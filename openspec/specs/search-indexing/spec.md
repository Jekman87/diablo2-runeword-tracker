# search-indexing Specification

## Purpose

What the deployed document offers a search crawler before any of it runs: a
description, a canonical address, a robots policy, a sitemap, and something to
read when scripting is unavailable. Also where that stops being the build's
job — verification and submission are account actions the owner takes by hand.

## Requirements

### Requirement: The deployed document is discoverable by search crawlers

The static HTML documents that GitHub Pages serves SHALL give a crawler enough
to index the site without executing the application: a document title, a meta
description, a canonical link, and a short plain-text fallback in the body when
scripting is unavailable. There SHALL be two such documents — the root entry in
English and a `/ru/` entry in Russian — each carrying its own language's title,
description and fallback text, its own canonical URL, and a `hreflang` link
group naming the English URL, the Russian URL and an `x-default` pointing at
the root. The two documents SHALL load the same application bundle.

The canonical URLs SHALL be application constants — the same absolute URLs the
sitemap lists — and SHALL include the repository's Pages sub-path. They SHALL
NOT be hardcoded independently in places that can drift; the existing
crawl-file test SHALL hold every copy of both URLs together.

Each meta description SHALL state what the page is for in one or two sentences
of project prose in its document's language. The title or description SHALL
include the game's common abbreviation ("D2R"), because it is the term players
actually search. Neither description SHALL be an empty string, and neither
SHALL depend on JavaScript to appear in the head.

#### Scenario: The head carries title, description and canonical

- **WHEN** the deployed `index.html` is fetched without executing scripts
- **THEN** it includes a non-empty `<title>`, a `meta name="description"`, and a
  `link rel="canonical"` whose `href` is the site's public Pages URL

#### Scenario: The Russian entry is a Russian document

- **WHEN** the deployed `/ru/` document is fetched without executing scripts
- **THEN** it declares `lang="ru"`, carries a Russian title and description, a
  canonical pointing at the `/ru/` URL, and a Russian plain-text fallback

#### Scenario: The two entries name each other

- **WHEN** either document's `hreflang` links are read
- **THEN** they name the English URL as `en`, the Russian URL as `ru`, and the
  root as `x-default`, identically in both documents

#### Scenario: A non-JS fetch is not an empty page

- **WHEN** either document is read with scripting disabled
- **THEN** the body still contains a short plain-text explanation of the tracker
  in that document's language
- **AND** that text is present without waiting for the React bundle

#### Scenario: Canonical and sitemap agree

- **WHEN** each document's canonical `href` and the sitemap's URLs are compared
- **THEN** they are the same absolute URLs, taken from the site constants

#### Scenario: The search term players use is present

- **WHEN** the root document's title and description are read
- **THEN** at least one of them contains "D2R"

### Requirement: Robots and sitemap are published with the site

The build SHALL publish a `robots.txt` that allows crawling of the site and that
names the sitemap by absolute URL. It SHALL publish a `sitemap.xml` that lists
both public entry URLs — the root and `/ru/`.

Both files SHALL be reachable under the Pages base path after deploy (for this
project: `/diablo2-runeword-tracker/robots.txt` and
`/diablo2-runeword-tracker/sitemap.xml`).

#### Scenario: robots.txt allows indexing and points at the sitemap

- **WHEN** `robots.txt` is fetched from the deployed site
- **THEN** it does not disallow the site's content for `*`
- **AND** it includes a `Sitemap:` line with the absolute sitemap URL

#### Scenario: sitemap.xml lists the entry URL

- **WHEN** `sitemap.xml` is fetched from the deployed site
- **THEN** it contains the root Pages URL and the `/ru/` URL as `<loc>` entries
- **AND** it is well-formed XML

### Requirement: Search Console submission is documented for the owner

The repository SHALL document the post-deploy steps the owner must take in Google
Search Console (verify the URL-prefix property, submit the sitemap). Those steps
SHALL NOT be automated by the build, and SHALL NOT be satisfied by adding a
verification script, a tag manager or any other executable third-party surface to
the page: verification is available as inert markup, and the counter this project
does carry is not a licence to add more.

The documentation SHALL further record what has been verified about the sitemap
from outside the repository, so a status in a third-party console cannot be
mistaken for a defect in these files. Where the sitemap is served correctly and
both entry URLs are indexed, a console reporting that it could not fetch the
sitemap SHALL be recorded as a known condition to ignore rather than chased with
changes to files that are already right.

#### Scenario: The steps are written down

- **WHEN** a reader opens the site-constants documentation
- **THEN** it names the live URL, the sitemap URL, and the Search Console actions
  to take after a deploy that includes these files

#### Scenario: A sound sitemap with a failing status is documented as such

- **WHEN** the sitemap returns 200 as well-formed XML, nothing disallows
  crawling, and both entry URLs are indexed, while Search Console still reports
  that it could not fetch the sitemap
- **THEN** the documentation states that this is the known condition, names what
  was verified, and prescribes no repository change

### Requirement: A social share carries a card

Both documents SHALL carry Open Graph and Twitter card metadata sufficient for
a link shared into a chat or feed to present a card: `og:title`,
`og:description` and `og:url` in the document's language, `og:image` naming a
committed 1200×630 image by absolute URL, `twitter:card` as
`summary_large_image`, and `og:locale` with `og:locale:alternate` naming the
other language. The image SHALL be a stable, unhashed file under the site's
own origin, built from the project's own themed assets, and its URL SHALL be
pinned beside the other site constants.

#### Scenario: The card metadata is complete

- **WHEN** either deployed document's head is read without executing scripts
- **THEN** it carries `og:image` with an absolute URL, `twitter:card`, and an
  `og:locale` pair naming both languages

#### Scenario: The image is really there

- **WHEN** the `og:image` URL is fetched from the deployed site
- **THEN** it returns a 1200×630 raster image from this site's own origin

### Requirement: The application identifies itself as structured data

Each document SHALL carry one JSON-LD block describing the site as a
`WebApplication`: its name, its URL, that it is free, and the two languages it
is available in. The block SHALL be inert data in the document rather than
anything scripted, so that what a crawler reads about this site is markup and
never behaviour.

#### Scenario: The structured data parses

- **WHEN** the JSON-LD block is extracted from either deployed document
- **THEN** it is valid JSON declaring a `WebApplication` with the site's name
  and URL and both languages

#### Scenario: The block executes nothing

- **WHEN** the JSON-LD block is inspected in either document
- **THEN** it is data of a non-executable type and loads nothing from another
  origin
