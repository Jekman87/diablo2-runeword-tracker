## Context

The tracker is a Vite SPA deployed to GitHub Pages at
`https://jekman87.github.io/diablo2-runeword-tracker/` with
`base: "/diablo2-runeword-tracker/"`. Phase 5 finished the product surface.
Crawlers hitting the site today get a title and an empty `#root`.

Constraints that shape this change:

- **Own origin only** — no analytics, font CDNs, or Search Console verification
  scripts that call out. HTML meta tags and static files are fine.
- **One public URL** — there is no client router; sitemap lists that one page.
- **Sub-path base** — every absolute URL in sitemap/canonical/robots must include
  `/diablo2-runeword-tracker/`. Files from `public/` are copied to `dist/` root
  and served under that base (e.g. `…/diablo2-runeword-tracker/robots.txt`).
- **Bilingual UI** — first HTML paint is English (`lang="en"` today). Meta
  description is authored in English for the static document; Russian remains
  the in-app locale. A bilingual description line is allowed if kept short.

## Goals / Non-Goals

**Goals**

- Give crawlers a clear title, description, canonical URL, robots policy, and
  sitemap for the one page.
- Leave a non-empty static HTML fallback when JS is off or not yet run.
- Tell the owner exactly how to finish indexing in Search Console after merge.

**Non-Goals**

- Ranking optimization, backlink campaigns, or schema.org Product spam.
- Per-runeword deep links or prerendered table HTML.
- Automating Search Console verification from CI.

## Decisions

1. **Static files in `public/`** — Vite copies them unchanged into `dist/`. The
   CI base-path assertion targets hashed assets in `index.html`; plain
   `robots.txt` / `sitemap.xml` do not need hashing.

2. **Canonical URL as a site constant** — same module as donation/patch
   (`src/header/site.ts`), so the sitemap and the `<link rel="canonical">` cannot
   disagree. Value:
   `https://jekman87.github.io/diablo2-runeword-tracker/`.

3. **Meta description is English in `index.html`** — crawlers see the shell
   before React hydrates. Keep it project prose (what the tracker is), not a
   dump of runeword names. Optional: mirror the same sentence in `en.ts` only if
   a visible UI surface needs it; do not invent a second wording.

4. **`<noscript>` fallback** — short paragraph with the same meaning as the
   description. Enough for a fetch without JS; not a second app.

5. **Owner-side Search Console** — after deploy, verify the URL-prefix property
   and submit `…/sitemap.xml`. Document in `docs/SITE.md`. Not a code gate.

6. **Yandex** — optional, same sitemap; document as optional, do not require it.

## Risks / Trade-offs

- **SPA still JS-heavy** — Google may index, but rich content in the table stays
  behind hydration. Acceptable for v1; a later change can add prerender if
  snippets stay thin.
- **Wrong absolute URL** — a typo in the constant breaks canonical/sitemap.
  Pin the URL once and reuse it; add a small test or build assertion that
  `sitemap.xml` contains the constant's host+path.
- **`lang="en"` with Russian users** — fine for the static shell; the app still
  switches locale after load.

## Migration Plan

None. Deploy with the next `main` push; then the owner submits the sitemap in
Search Console. No data migration.

## Open Questions

None blocking. Optional later: prerender the first paint of the table, or a
custom domain with its own Search Console property.
