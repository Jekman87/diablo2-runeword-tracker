## Why

The live site at `https://jekman87.github.io/diablo2-runeword-tracker/` is a
public GitHub Pages app with almost nothing for crawlers: `index.html` carries
only a title, there is no `robots.txt` or sitemap, and the body is an empty
`#root` until JavaScript runs. Search engines can eventually render SPAs, but
without meta, a sitemap, and an explicit invitation to crawl, discovery is slow
and the snippet has nothing useful to show. The product phases are shipped; this
is the next small step so the page can appear in Google and Yandex.

## What Changes

- Add a concise meta description (and matching Open Graph title/description) to
  the static document head, sourced so EN/RU UI copy stays coherent with what
  crawlers see on first paint.
- Add a site `canonical` URL constant beside the other site constants, and emit
  it as a `<link rel="canonical">`.
- Ship `robots.txt` and `sitemap.xml` from Vite `public/`, with absolute URLs
  under the Pages sub-path base (`/diablo2-runeword-tracker/`).
- Add a small crawlable fallback in the static HTML (`<noscript>` and/or a short
  text node) stating what the page is, so a non-JS fetch is not an empty shell.
- Document the **manual** owner steps after deploy: Google Search Console (and
  optionally Yandex Webmaster) property verification and sitemap submission.

Explicitly **not** in this change:

- Analytics or any third-party script (still forbidden by the theme's own-origin
  rule).
- Full prerender / SSR / multi-route SEO — one URL is enough for this SPA.
- Changing Vite `base` or the Pages hosting setup.
- Paid SEO tooling or Search Console API automation.

## Capabilities

### New Capabilities

- `search-indexing`: what the deployed document exposes for crawlers — meta,
  canonical, robots, sitemap, and a non-empty static fallback — and that
  verification in Search Console is an owner step outside the build.

### Modified Capabilities

- `static-site-deployment`: the build SHALL emit `robots.txt` and `sitemap.xml`
  as static files under the site base path (same class of asset as other
  `public/` files), without breaking the existing hashed-asset / base-path
  gate.

## Impact

- `index.html` head and body fallback; likely `public/robots.txt` and
  `public/sitemap.xml`.
- `src/header/site.ts` gains the canonical public URL.
- i18n may gain a short description string if the meta text is shared with UI;
  crawlers still read the English static HTML first paint.
- `docs/SITE.md` (or README) records Search Console steps.
- No new runtime dependencies. CI already builds and deploys `dist/`.
