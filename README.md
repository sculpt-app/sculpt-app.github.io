# Sculpt website

The public Sculpt launch site, served directly by GitHub Pages at https://www.sculpt-fit.app/. The landing page follows the current marketing identity: bold Helvetica-style typography, off-white, charcoal, lime accents, and native dark app screens.

## Landing page

- “Out now” messaging links directly to https://apps.apple.com/app/id6825584822 (Sculpt: Fitness & Body Scanner, Jacob LaGesse).
- At widths of 800px and below, the first screen centers a large tappable Sculpt app icon, the App Store badge, and a link to explore. It uses the small viewport height to accommodate mobile browser controls; short displays can scroll naturally.
- Desktop shows body and workout screens in CSS phone frames. There are no WebGL dependencies or animation loops on the landing page.
- The feature section switches between body, workout, and progress screens. Tabs support Left/Right arrows and Home/End, expose selection to screen readers, and retain all feature content when JavaScript is unavailable.
- Download links are ordinary HTTPS anchors and work without JavaScript. Badges, images and styles are local. Google Analytics loads automatically once configured; no external fonts are added.
- Keyboard focus, reduced-motion preferences, support, and public legal pages are preserved.

## Assets and provenance

`assets/app-icon.webp` is a resized export of the current iOS AppIcon from the `body-ai` repo. `assets/{body,workouts,progress}-dark.webp` are optimized versions of the native dark screenshots used in `body-ai/artifacts/instagram-carousel/hevy-inspired-v17/screens`, originating in `artifacts/app-store-screenshots/medium-final-five-v15/raw`. They contain synthetic demo data. The website labels these as demo screens, not promised outcomes.

`assets/app-store.svg` is the official Apple download badge reused from the marketing assets. `assets/launch-social.jpg` is the launch-specific social preview; its editable source is `scripts/build-social.swift`. On macOS, regenerate it from this directory with:

```sh
swift -module-cache-path /tmp/sculpt-social-module-cache scripts/build-social.swift
```

The old 3D phone/shader experiments remain in `src/`, `build*.mjs`, and their existing generated assets for reuse. They are not loaded by the landing page. `npm ci && npm run build` rebuilds those archived experiments only; no npm build is needed to serve or edit the current site.

## Local preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. Check the desktop layout, 320–800px mobile layouts (including short viewports), tab keyboard behavior, and support/legal links before publishing.

## GitHub Pages

Use **Settings → Pages → Deploy from a branch → main → / (root)**. Commit the HTML, CSS, JS, and image assets. `.nojekyll` disables Jekyll, and `CNAME` retains `www.sculpt-fit.app`. Publishing is handled by the repository's existing GitHub Pages process.

## Legal documents

The legal policy text and PDF downloads are retained. Edit `legal/privacy.md`, `legal/consumer-health.md`, and `legal/terms.md`, then run `python3 scripts/build-legal.py` with `reportlab` and `pypdf` installed. Commit generated HTML and PDFs alongside the sources. Effective dates must reflect the approved publication version. Internal assessments are not published.

To sync a new app privacy disclosure without rebuilding other policy PDFs:

```sh
python3 scripts/build-legal.py --document privacy --app-privacy /path/to/body-ai/Resources/Legal/legal.json
```

The site favicon, ICO fallback, and Apple touch icon remain exports of the current iOS AppIcon.

## Website analytics (GA4)

The Sculpt Website web stream is configured with Measurement ID `G-Y2PK1R343Z` in `analytics-config.js`. Analytics loads automatically on production hosts after these files are published. This public ID is not a secret; do not add credentials or an API secret.

1. In Google Analytics, create a **Sculpt Website** property (America/Los_Angeles), then a **Web** stream for `https://www.sculpt-fit.app`.
2. Copy its `G-...` Measurement ID into `window.SCULPT_ANALYTICS_ID` in `analytics-config.js`. Disable Enhanced Measurement in the stream to keep collection to this site's explicit page views and download clicks. Leave Google signals and advertising features disabled.
3. Publish through the repository's normal GitHub Pages process. Collection runs only on `www.sculpt-fit.app`, `sculpt-fit.app` and `sculpt-app.github.io`; previews and localhost never send events.
4. Open the published site, then check **Realtime** in Google Analytics. Click a download link and confirm `app_store_click`. This is a click, not proof of an App Store installation.
5. Mark `app_store_click` as a key event in GA4. For placement comparisons, register the event-scoped custom dimension `cta_location`. Locations distinguish desktop/mobile hero badges, app logos, launch, header, footer and support FAQ.

Google Analytics loads automatically on every supported production page once configured. There is no consent popup, preference control, or stored consent gate. Google signals and ad personalization are disabled. Page URLs omit fragments and query parameters other than standard UTM campaign fields; referrers omit queries. No account identifiers, names or health data are sent. Analytics never blocks App Store navigation.

Automatic-loading and event checks: `node --test scripts/analytics.test.mjs`. These run in an isolated mock browser and never send events to Google. Setting the Measurement ID back to an empty string disables the integration.
