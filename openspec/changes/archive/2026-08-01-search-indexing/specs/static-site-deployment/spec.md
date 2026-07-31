# static-site-deployment Delta Specification

## ADDED Requirements

### Requirement: Crawl files ship as static public assets

The production build SHALL include `robots.txt` and `sitemap.xml` as static files
emitted into the deployable `dist/` tree (Vite `public/` copy), so they are
published with the Pages artifact alongside `index.html`.

These files SHALL use absolute URLs that include the configured Vite `base` path
when naming the site and the sitemap. They SHALL NOT assume deployment at the
domain root.

#### Scenario: The build emits robots and sitemap

- **WHEN** `pnpm build` completes
- **THEN** `dist/robots.txt` and `dist/sitemap.xml` exist

#### Scenario: Absolute URLs respect the Pages sub-path

- **WHEN** the sitemap and the robots `Sitemap:` line are read from `dist/`
- **THEN** each absolute URL includes the repository Pages base path
  (`/diablo2-runeword-tracker/` for this project)
