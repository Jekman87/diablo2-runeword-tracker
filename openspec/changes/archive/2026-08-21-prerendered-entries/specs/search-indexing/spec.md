## MODIFIED Requirements

### Requirement: The deployed document is discoverable by search crawlers

The static HTML documents that GitHub Pages serves SHALL give a crawler enough
to index the site without executing the application: a document title, a meta
description, a canonical link, and — since the entries are prerendered — the
rendered list itself. There SHALL be two such documents — the root entry in
English and a `/ru/` entry in Russian — each carrying its own language's title,
description and body content, its own canonical URL, and a `hreflang` link
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

**The head is no longer the only indexable text.** Until the entries were
prerendered, the title, the description and a short fallback paragraph were the
whole of what a non-rendering crawler could read, and the description was
therefore written to carry the terms players search. That constraint is lifted:
the runeword names, rune names, base item types and levels are now in the body of
both documents. The description SHALL still not be stuffed with names — the
names are in the list, and a description crowded with them describes nothing.

#### Scenario: The head carries title, description and canonical

- **WHEN** the deployed `index.html` is fetched without executing scripts
- **THEN** it includes a non-empty `<title>`, a `meta name="description"`, and a
  `link rel="canonical"` whose `href` is the site's public Pages URL

#### Scenario: The Russian entry is a Russian document

- **WHEN** the deployed `/ru/` document is fetched without executing scripts
- **THEN** it declares `lang="ru"`, carries a Russian title and description, a
  canonical pointing at the `/ru/` URL, and Russian body content

#### Scenario: The two entries name each other

- **WHEN** either document's `hreflang` links are read
- **THEN** they name the English URL as `en`, the Russian URL as `ru`, and the
  root as `x-default`, identically in both documents

#### Scenario: A non-JS fetch is not an empty page

- **WHEN** either document is read with scripting disabled
- **THEN** the body contains the rendered list in that document's language,
  together with a short statement of what scripting is needed for
- **AND** both are present without waiting for the React bundle

#### Scenario: Canonical and sitemap agree

- **WHEN** each document's canonical `href` and the sitemap's URLs are compared
- **THEN** they are the same absolute URLs, taken from the site constants

#### Scenario: The search term players use is present

- **WHEN** the root document's title and description are read
- **THEN** at least one of them contains "D2R"

## ADDED Requirements

### Requirement: A second search engine's property is verified the same way

Where the project claims a property with a search engine, ownership SHALL be
proven with inert markup rather than an executable surface, and the tag SHALL
stay in the document afterwards, because engines re-check it and drop a property
whose proof disappeared. This holds for Yandex as it already does for Google:
the Russian entry exists so Russian queries have a Russian document, and Russian
search mostly happens on Yandex, so the property is worth claiming.

The verification value SHALL be held where the other site constants are and
checked against the document copy, so a tag deleted by accident fails a test
rather than silently unverifying the property. The submission steps SHALL be
documented for the owner beside the existing Search Console steps, as an account
action rather than a build step.

#### Scenario: Ownership is proven without a script

- **WHEN** the root document's head is read
- **THEN** it carries a Yandex verification meta tag alongside the Google one
- **AND** neither is a script or loads anything from another origin

#### Scenario: A deleted verification tag fails a check

- **WHEN** either verification tag is removed from the document
- **THEN** a repository check fails naming it

#### Scenario: The owner's steps are written down

- **WHEN** a reader opens the site-constants documentation
- **THEN** it names the Yandex Webmaster steps — add the site, verify with the
  meta tag, submit the same sitemap — next to the Search Console ones
