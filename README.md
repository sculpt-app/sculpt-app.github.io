# Sculpt website

The default Sculpt homepage features a floating 3D iPhone on a clean white background, with subtle marble shaders in the philosophy section. The original landing-page design has been removed. The old `/marble/` URL redirects to the homepage.

## The 3D phone

`assets/iphone.glb` is an original, reusable model generated from `src/phone-model.js`: a beveled metal frame, front display, back glass, camera housing/lenses, side buttons and charging port. Three.js **0.186.1** renders it with a transparent background and studio lighting. The phone gently rotates about its vertical axis while keeping the app readable.

`assets/home-screen.webp` is a real screenshot of the existing Sculpt iOS simulator build, captured on 14 October 2026 using an isolated iPhone 17 Pro simulator and the app's synthetic `--ui-testing --test-premium-fixture --test-body-review` flags. It contains no real account or health data. It shows the Body home page, not a recreated marketing concept. A future approved screenshot can replace this file and be rebuilt into the bundle.

The model and screenshot are embedded in the classic-script phone bundle so the 3D preview also works from `file://`, without cross-origin requests. The standalone source assets remain in the repository for reuse. The captured screen already includes its Dynamic Island, so the separate model island is hidden when the screenshot is applied.

- WebGL rendering is capped at a 1.5 device-pixel ratio and 30 rendered frames per second.
- The Motion control pauses/resumes the phone and the optional marble effect.
- Reduced motion gives a static 3D phone, with animation disabled.
- Rendering pauses while the page is hidden or the phone is outside the viewport.
- A static phone with the same real screenshot appears immediately and remains if WebGL or loading fails.
- Resources are released on unload; back-forward cache restoration resumes appropriately.
- `/?motion=off` shows the 3D phone without automatic rotation and skips the marble effect.

## Shader implementation

A subtle **Marble** texture nested inside **FilmGrain** enhances the full-width philosophy section, using the original `createShader` API from [shader-effects-inc/shaders](https://github.com/shader-effects-inc/shaders), pinned to **4.0.4**. It no longer lives in a hero image box. Telemetry is explicitly disabled. All runtime files are served locally.

The shader script is loaded only as its section approaches the viewport, when WebGPU exists and reduced motion isn't requested. A plain background handles unsupported browsers, failed GPU initialization and reduced-motion preferences.

The JavaScript entry in shaders 4.0.4 registers the entire 200+ component catalog. `build.mjs` limits the catalog to Marble and FilmGrain while retaining the upstream renderer and API. This adapter is pinned to the release's registry export contract; test WebGPU initialization and fallback when upgrading.

MIT notices are preserved in `assets/SHADERS-LICENSE.txt`, `assets/THREE-LICENSE.txt`, and adjacent generated notices.

## Rebuild the committed assets

From this folder:

```sh
npm ci
npm run build
```

This regenerates the GLB model and the self-contained phone and shader bundles. Commit the generated assets after source/texture changes. GitHub Pages serves these files directly and does not need Node or npm. `node_modules` is ignored by the root repository.

## Content

The confirmed support email and Coming soon on iOS status are retained. Demo data is labeled; no fake App Store link, signup form, testimonials or performance claims are included. Feature tabs support arrows, Home and End, with visible focus indicators. The homepage has canonical/social metadata for https://sculpt-app.github.io/ and is included in the sitemap. Legal drafts remain outside this public website; approve and publish accessible policy pages before App Store launch.

## Local preview

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. The phone bundle includes its assets to support direct-file previews, but automated browser QA uses HTTP.

## GitHub Pages

Set **Settings → Pages → Deploy from a branch → main → / (root)**. The checked-in site is buildless at deployment time. `.nojekyll` disables Jekyll processing. Hosting URL: https://sculpt-app.github.io/.
