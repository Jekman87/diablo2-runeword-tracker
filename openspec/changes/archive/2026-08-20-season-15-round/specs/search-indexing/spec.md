## MODIFIED Requirements

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
