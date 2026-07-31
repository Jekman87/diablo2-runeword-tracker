# search-indexing — Tasks

## 1. Site URL constant and static head

- [x] 1.1 Add `SITE_URL` (or equivalent) to `src/header/site.ts` as
      `https://jekman87.github.io/diablo2-runeword-tracker/` with a short comment
      that sitemap, canonical, and docs must reuse it
- [x] 1.2 Update `index.html`: `meta name="description"`, Open Graph
      `og:title` / `og:description` (same wording), `link rel="canonical"` using
      that URL, keep existing title coherent with the description
- [x] 1.3 Add a `<noscript>` (and/or other non-JS) short English explanation of the
      tracker in the body so a scriptless fetch is not an empty `#root` only

## 2. robots.txt and sitemap.xml

- [x] 2.1 Add `public/robots.txt` allowing `*` and a `Sitemap:` line with the
      absolute sitemap URL under the Pages base path
- [x] 2.2 Add `public/sitemap.xml` with a single `<url><loc>` for `SITE_URL`
- [x] 2.3 Assert in a test or a small build check that `dist/robots.txt` and
      `dist/sitemap.xml` exist after `pnpm build` and that the sitemap loc matches
      the site constant / expected Pages URL

## 3. Documentation

- [x] 3.1 Extend `docs/SITE.md` with: live URL, robots/sitemap paths, and Google
      Search Console steps (add URL-prefix property → verify → submit sitemap).
      Mention Yandex Webmaster as optional
- [x] 3.2 Link `docs/SITE.md` from `AGENTS.md` Read first if not already linked

## 4. Verification

- [x] 4.1 `pnpm build` and confirm `dist/index.html` head tags, `dist/robots.txt`,
      `dist/sitemap.xml`
- [x] 4.2 `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`
- [ ] 4.3 After merge/deploy: owner submits sitemap in Search Console (manual;
      not a CI gate)
