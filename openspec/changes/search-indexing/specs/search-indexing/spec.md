# search-indexing Delta Specification

## ADDED Requirements

### Requirement: The deployed document is discoverable by search crawlers

The static HTML document that GitHub Pages serves SHALL give a crawler enough to
index the site without executing the application: a document title, a meta
description, a canonical link to the public Pages URL, and a short plain-text
fallback in the body when scripting is unavailable.

The canonical URL SHALL be an application constant — the same absolute URL the
sitemap lists — and SHALL include the repository's Pages sub-path. It SHALL NOT
be hardcoded independently in two places that can drift.

The meta description SHALL state what the page is for in one or two sentences of
project prose in English (the language of the static shell). It SHALL NOT be an
empty string, and it SHALL NOT depend on JavaScript to appear in the head.

#### Scenario: The head carries title, description and canonical

- **WHEN** the deployed `index.html` is fetched without executing scripts
- **THEN** it includes a non-empty `<title>`, a `meta name="description"`, and a
  `link rel="canonical"` whose `href` is the site's public Pages URL

#### Scenario: A non-JS fetch is not an empty page

- **WHEN** the same document is read with scripting disabled
- **THEN** the body still contains a short plain-text explanation of the tracker
- **AND** that text is present without waiting for the React bundle

#### Scenario: Canonical and sitemap agree

- **WHEN** the canonical `href` and the sitemap's page URL are compared
- **THEN** they are the same absolute URL, taken from one site constant

### Requirement: Robots and sitemap are published with the site

The build SHALL publish a `robots.txt` that allows crawling of the site and that
names the sitemap by absolute URL. It SHALL publish a `sitemap.xml` that lists
the site's public Pages URL (the single application entry).

Both files SHALL be reachable under the Pages base path after deploy (for this
project: `/diablo2-runeword-tracker/robots.txt` and
`/diablo2-runeword-tracker/sitemap.xml`).

#### Scenario: robots.txt allows indexing and points at the sitemap

- **WHEN** `robots.txt` is fetched from the deployed site
- **THEN** it does not disallow the site's content for `*`
- **AND** it includes a `Sitemap:` line with the absolute sitemap URL

#### Scenario: sitemap.xml lists the entry URL

- **WHEN** `sitemap.xml` is fetched from the deployed site
- **THEN** it contains the canonical Pages URL as a `<loc>`
- **AND** it is well-formed XML

### Requirement: Search Console submission is documented for the owner

The repository SHALL document the post-deploy steps the owner must take in Google
Search Console (verify the URL-prefix property, submit the sitemap). Those steps
SHALL NOT be automated by the build, and SHALL NOT require a third-party script on
the page.

#### Scenario: The steps are written down

- **WHEN** a reader opens the site-constants documentation
- **THEN** it names the live URL, the sitemap URL, and the Search Console actions
  to take after a deploy that includes these files
