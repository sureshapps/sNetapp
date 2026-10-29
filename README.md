# SNet

A React PWA network toolkit inspired by the supplied SNet reference.

## Run

Requires Node.js 22.12+ (or 20.19+).

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. For real ICMP ping and traceroute, run `npm run companion` in a second terminal. The companion listens on loopback only; Vite proxies `/api` to port 8787.

## Features

- Real download/upload measurement using Cloudflare public speed endpoints, configurable duration and direction, live chart, cancellation.
- HTTP round-trip probes with min, max, average, jitter, failed request count. HTTP measurements are not ICMP.
- ICMP ping and traceroute through the optional local companion, with target validation and process timeouts.
- Public IP and edge connection lookup, browser network estimates where supported.
- Browser memory transfer benchmark, with actual data copying.
- Local test history, JSON export, clear history and persistent preferences.
- Responsive design, PWA manifest, install guidance, offline shell and saved results after first production visit.

## Browser limitations

A PWA cannot create a device VPN tunnel or read gateway, subnet, DNS, carrier, exact hardware model or iCloud Private Relay status. The VPN screen provides native-app setup and a public-IP lookup, and never pretends to establish a VPN. A full VPN requires a separately installed native client and a configured provider.

The browser benchmark measures memory copies, not disk speed. Browser network estimates may be rounded. Cloudflare tests measure this browser's path to its edge; external services may be blocked or unavailable. Test duration is approximate and bounded by in-flight requests. Ping probe count is capped at 60.

## Production

```sh
npm run build
npm run preview
```

Serve `dist/` over HTTPS (localhost is also a secure context). PWA offline support is enabled only in production builds. Install via browser menu or Settings. Native ping/traceroute are available in local development with the companion, not on static hosting. Public hosting must not expose the local companion.

## Validation

`npm test` checks target validation. `npm run build` produces the production app.

No results are simulated. Test data and preferences stay in local browser storage. Speed tests and public IP lookup contact Cloudflare; HTTP probes contact the target you enter. Fonts are loaded from Google Fonts with local sans-serif fallbacks.

## Visual concept

Uses the supplied void / electric iris concept in src/tokens.css: pure black surfaces, 6px spacing scale, 24px controls, lightweight type, and a procedural SVG constellation. PPNeueMontreal is named first, with Inter as the available fallback; no proprietary font file was supplied. The invalid reference tint #15846 is normalized to #15846e. Layout ranges use responsive clamp() values. Reduced-motion preferences stop the constellation animation.


## Mobile app view

All viewport sizes use a single-column, touch-first app shell capped at 480px. The interface fills phones and stays centered at phone width on larger screens. A sticky app header and safe-area-aware bottom tabs provide Home, Tools, History and Settings. Tool cards stay in a two-column launcher grid; measurement settings and results stack vertically.


## GSAP motion

GSAP drives the globe's 3D particle rotation, screen and card entrances, active-tab feedback, button presses, result reveals and toasts. The canvas draws at most 30 frames per second; rotation pauses when off-screen or when the document is hidden. gsap.matchMedia honors reduced motion and reverts animations and listeners when their screen unmounts. No measurement data is animated or simulated.


## Launch and notifications

A static loader appears before JavaScript loads, followed by the branded splash while the app initializes. The welcome screen appears once per browser/device; Settings can replay it. Returning launches show a welcome-back update. An in-app banner and persistent bell inbox report every successful, failed, or stopped test, plus network lookup outcomes. Successful test notifications open their saved result. Up to 50 updates are stored locally; opening the inbox marks them read. These are in-app notifications, not push notifications, and do not request browser permission. Reduced-motion preferences apply to launch and welcome animations.

