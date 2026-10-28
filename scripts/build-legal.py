"""Build the public legal pages and PDFs from the matching Markdown sources."""
import argparse
import html
import json
import re
import shutil
from functools import partial
from pathlib import Path

import reportlab
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, SimpleDocTemplate
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://sculpt-app.github.io/'
DOCUMENTS = [
    ('privacy', 'Privacy Policy', 'privacy-policy.pdf'),
    ('consumer-health', 'Consumer Health Data Privacy Notice', 'consumer-health-data-notice.pdf'),
    ('terms', 'Terms of Use', 'terms-of-use.pdf'),
]
LEGAL_NAV = '<nav class="footer-legal" aria-label="Legal"><a href="privacy.html">Privacy Policy</a><a href="consumer-health.html">Consumer Health Data</a><a href="terms.html">Terms of Use</a></nav>'


def sync_app_privacy(path):
    """Copy the app's disclosure, retaining the website-specific notices."""
    paragraphs = json.loads(path.read_text())['privacy']
    title = re.fullmatch(r'\*\*Sculpt Privacy Policy — (.+)\*\*', paragraphs[0])
    if not title:
        raise ValueError('The app privacy policy needs a dated title.')
    old_source = (ROOT / 'legal/privacy.md').read_text()
    operator = next(block for block in re.split(r'\n\s*\n', old_source)
                    if block.startswith('Sculpt is operated by '))
    result = ['# Privacy Policy', f'Effective date: {title[1]}', operator, paragraphs[1]]
    for paragraph in paragraphs[2:]:
        section = re.fullmatch(r'\*\*(.+?)\*\*\s+(.+)', paragraph)
        if not section:
            raise ValueError('An app privacy section is missing its heading.')
        result += ['## ' + section[1].rstrip('.'), section[2]]
    website_sections = re.split(r'^##\s+(?:\d+\.\s+)?(.+)\n', old_source, flags=re.M)
    for heading, body in zip(website_sections[1::2], website_sections[2::2]):
        if heading in {'Website visits', 'Your privacy rights', 'Legal bases and international processing'}:
            result += ['## ' + heading, body.strip()]
    (ROOT / 'legal/privacy.md').write_text('\n\n'.join(result) + '\n')


def inline(text, pdf=False):
    result = []
    for part in re.split(r'(\[[^\]]+\]\((?:https://|mailto:)[^\s)]+\))', text):
        match = re.fullmatch(r'\[([^\]]+)\]\(((?:https://|mailto:)[^\s)]+)\)', part)
        if match:
            label, url = map(html.escape, match.groups())
            result.append(f'<link href="{url}" color="#365F5D">{label}</link>' if pdf else f'<a href="{url}">{label}</a>')
        else:
            result.append(html.escape(part))
    return ''.join(result)


def blocks(source):
    for block in re.split(r'\n\s*\n', source.strip()):
        if block.startswith('# '):
            continue
        if block.startswith('## '):
            yield 'heading', block[3:].strip()
        elif block.startswith('- '):
            yield 'list', [line[2:] for line in block.splitlines()]
        else:
            yield 'paragraph', ' '.join(block.splitlines())


def webpage(slug, title, pdf_name, contents):
    body = []
    for kind, text in contents:
        if kind == 'heading':
            body.append(f'<h2>{inline(text)}</h2>')
        elif kind == 'list':
            body.append('<ul>' + ''.join(f'<li>{inline(item)}</li>' for item in text) + '</ul>')
        else:
            body.append(f'<p>{inline(text)}</p>')
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f8f8f5">
  <title>{title} — Sculpt</title>
  <meta name="description" content="Read Sculpt's {html.escape(title.lower())}, including contact details for support and privacy requests.">
  <link rel="canonical" href="{BASE}{slug}.html">
  <link rel="icon" href="assets/favicon-32.png?v=20261025" type="image/png" sizes="32x32">
  <link rel="icon" href="favicon.ico?v=20261025" sizes="any">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png" sizes="180x180">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="header frame"><a class="wordmark" href="./" aria-label="Sculpt home">sculpt.</a><nav aria-label="Main navigation"><a href="./">Home</a><a href="support.html">Support</a></nav></header>
  <main id="main" class="legal-main frame">
    <p class="overline">SCULPT / LEGAL</p>
    <h1>{title}</h1>
    <a class="legal-download" href="legal/{pdf_name}">Download PDF <span aria-hidden="true">↓</span></a>
    <article class="legal-copy" aria-label="{title}">
      {chr(10).join(body)}
    </article>
  </main>
  <footer class="footer frame"><div class="footer-main"><a class="wordmark" href="./" aria-label="Sculpt home">sculpt.</a><p>Fitness, thoughtfully shaped.</p><div><a href="support.html">Support</a></div></div>{LEGAL_NAV}<div class="footer-fine"><p>For adults. AI-assisted fitness insights are estimates, not medical measurements or advice.</p><span>© 2026 Sculpt</span></div></footer>
</body>
</html>
'''


class PageCanvas(canvas.Canvas):
    def __init__(self, *args, effective_date, **kwargs):
        super().__init__(*args, **kwargs)
        self.states = []
        self.effective_date = effective_date

    def showPage(self):
        self.states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self.states)
        for state in self.states:
            self.__dict__.update(state)
            self.setStrokeColor(colors.HexColor('#D8E1DE'))
            self.setLineWidth(.5)
            self.line(50, 38, 562, 38)
            self.setFont('SculptBody', 8)
            self.setFillColor(colors.HexColor('#647477'))
            self.drawString(50, 25, f'Sculpt | Effective {self.effective_date}')
            self.drawRightString(562, 25, f'{self._pageNumber} / {total}')
            super().showPage()
        super().save()


def pdf_document(path, title, contents):
    # Embed a Unicode font for the app's navigation arrows on macOS and Linux.
    candidates = [
        (Path('/System/Library/Fonts/Supplemental/Arial.ttf'), Path('/System/Library/Fonts/Supplemental/Arial Bold.ttf')),
        (Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'), Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')),
        (Path(reportlab.__file__).parent / 'fonts/Vera.ttf', Path(reportlab.__file__).parent / 'fonts/VeraBd.ttf'),
    ]
    regular, bold = next(pair for pair in candidates if all(path.exists() for path in pair))
    pdfmetrics.registerFont(TTFont('SculptBody', str(regular)))
    pdfmetrics.registerFont(TTFont('SculptBold', str(bold)))
    body = ParagraphStyle('body', fontName='SculptBody', fontSize=10.2, leading=14.6, textColor=colors.HexColor('#243235'), spaceAfter=8, allowWidows=0, allowOrphans=0)
    heading = ParagraphStyle('heading', parent=body, fontName='SculptBold', fontSize=12, leading=16, textColor=colors.HexColor('#365F5D'), spaceBefore=12, keepWithNext=True)
    title_style = ParagraphStyle('title', parent=body, fontName='SculptBold', fontSize=27, leading=32, spaceAfter=16, keepWithNext=True)
    bullet = ParagraphStyle('bullet', parent=body, leftIndent=11, firstLineIndent=-11, spaceAfter=5)
    story = [Paragraph(title, title_style)]
    for kind, text in contents:
        if kind == 'heading':
            story.append(Paragraph(inline(text, True), heading))
        elif kind == 'list':
            story.extend(Paragraph('- ' + inline(item, True), bullet) for item in text)
        else:
            story.append(Paragraph(inline(text, True), body))

    def header(c, _):
        c.setFont('SculptBold', 10)
        c.setFillColor(colors.HexColor('#365F5D'))
        c.drawString(50, 763, 'SCULPT')
        c.setFont('SculptBody', 8)
        c.drawRightString(562, 763, title)
        c.setStrokeColor(colors.HexColor('#D8E1DE'))
        c.line(50, 752, 562, 752)

    doc = SimpleDocTemplate(str(path), pagesize=(612, 792), leftMargin=50, rightMargin=50, topMargin=58, bottomMargin=53, title=f'Sculpt - {title}', author='Jacob Lagesse')
    effective_date = next(text.removeprefix('Effective date: ') for kind, text in contents
                          if kind == 'paragraph' and text.startswith('Effective date: '))
    doc.build(story, onFirstPage=header, onLaterPages=header,
              canvasmaker=partial(PageCanvas, effective_date=effective_date))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output-dir', type=Path)
    parser.add_argument('--document', choices=[item[0] for item in DOCUMENTS], action='append')
    parser.add_argument('--app-privacy', type=Path, help='Sync the privacy policy from the app legal.json first.')
    args = parser.parse_args()
    if args.app_privacy:
        sync_app_privacy(args.app_privacy)
    writer = PdfWriter()
    offset = 0
    for slug, title, pdf_name in DOCUMENTS:
        if args.document and slug not in args.document:
            continue
        source = (ROOT / 'legal' / f'{slug}.md').read_text()
        contents = list(blocks(source))
        (ROOT / f'{slug}.html').write_text(webpage(slug, title, pdf_name, contents))
        path = ROOT / 'legal' / pdf_name
        pdf_document(path, title, contents)
        count = len(PdfReader(path).pages)
        writer.append(str(path), import_outline=False)
        writer.add_outline_item(title, offset)
        offset += count
        if args.output_dir:
            args.output_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, args.output_dir / pdf_name)
        print(f'{title}: {count} pages')
    if args.output_dir:
        writer.add_metadata({'/Title': 'Sculpt - Public Policies', '/Author': 'Jacob Lagesse'})
        with (args.output_dir / 'sculpt-public-policies.pdf').open('wb') as f:
            writer.write(f)


if __name__ == '__main__':
    main()
