# Sculpt website

A responsive, buildless site for https://sculpt-app.github.io. Plain HTML, CSS, and a small accessible feature-tab script. All assets are local; there are no external fonts, analytics scripts, forms, or cookies.

## Preview

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. No package install or build is required.

## GitHub Pages

After reviewing and pushing these files to `main`:

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main**, **/ (root)**, and save.
4. The site will be available at **https://sculpt-app.github.io/** once GitHub completes deployment.

`.nojekyll` disables unnecessary Jekyll processing. The site also includes a custom 404 page, sitemap, favicon, and social preview image. No custom-domain configuration is assumed.

## Content updates

- **Launch:** replace the coming-soon labels with the confirmed App Store link and official badge when released. Update the support FAQ and description at the same time.
- **Email:** the public support contact is `sculpt.app.support@gmail.com` in both pages.
- **Legal:** the legal PDFs prepared separately are still drafts. Before App Store launch, complete and approve them, add accessible HTML privacy/consumer-health/terms pages, and link them in the footer and app. Drafts have deliberately not been copied into this public repository.
- **Preview:** the illustrated app screen, goal values, routine, and weight chart are presentation concepts, not screenshots or promised results. Replace them with approved app screenshots when available.
- **Assets:** `assets/body-goal.webp` is sourced from Sculpt's existing onboarding body model image. Confirm the model's license covers public marketing before publishing. The wordmark and favicon are website typography/vector assets, not a replacement for the app's final logo.

## Accessibility

Semantic landmarks, a skip link, keyboard-operable tabs (arrows, Home, End), visible focus states, native support accordions, reduced-motion support, and responsive layouts. Features and links should be checked after substantive content changes.

## Marble alternative

A separate, white-marble gallery direction lives at [`marble/`](marble/README.md). Preview `/marble/` alongside the original home page. Its WebGPU effect bundle is checked in, so GitHub Pages needs no build step. It is intentionally excluded from search indexing while it is an alternative design.
