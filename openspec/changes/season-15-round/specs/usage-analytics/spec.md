## ADDED Requirements

### Requirement: Both entry documents count page views

Each entry document SHALL carry one page-view counter, placed so it never delays
what the reader came for: at the end of the body, and in a form that does not
block parsing — a module script, which is deferred by definition, or an
explicitly deferred one. Never a blocking script in the head. Both documents
SHALL carry the same counter, because a count of one language is not a count of
the site.

The counter SHALL be declared in the form its provider issues, rather than
rewritten into an equivalent the provider does not test. Where that form already
satisfies the no-blocking rule, restating it is a change with no upside and a
support conversation on the downside.

The counter's provider SHALL be reached over `https` from a single host, and that
host SHALL be the only third-party origin the page contacts. A second analytics
surface, a tag manager, an A/B tool or any other executable third party SHALL be
its own proposal, argued on its own merits; this requirement is not a precedent
for a general licence to load scripts.

#### Scenario: Both documents carry the counter

- **WHEN** the deployed English document and the deployed Russian document are
  read without executing scripts
- **THEN** each carries the counter, in the provider's own snippet form

#### Scenario: The counter is the page's only third party

- **WHEN** the origins the deployed page requests are listed
- **THEN** the counter's host is the only one that is not this site's own

#### Scenario: The counter does not block the page

- **WHEN** the document's scripts are inspected
- **THEN** the counter sits at the end of the body and is not a blocking script,
  so a slow or unreachable counter host cannot delay the tracker rendering

### Requirement: The counter sets no cookie and reads no progress

The counter SHALL set no cookie, write no persistent identifier, and read nothing
the reader has stored. The reader's crafted-runeword progress SHALL remain
unreadable to it and untransmitted by it, and no consent dialog SHALL be added to
the page, because a counter that collects no personal data needs none — and a
counter that needed one would be the wrong counter.

Should the chosen provider ever require a cookie, an identifier or a consent
dialog to keep working, the counter SHALL be removed rather than the dialog
added.

#### Scenario: No cookie appears

- **WHEN** a reader loads either document and the browser's cookie store for the
  site is inspected
- **THEN** it holds nothing the counter put there

#### Scenario: Progress stays where it is

- **WHEN** the requests the counter makes are inspected after several runewords
  have been marked crafted
- **THEN** none carries any part of the stored progress, and the stored progress
  is unchanged

#### Scenario: No consent dialog is introduced

- **WHEN** the page is loaded for the first time in a clean browser
- **THEN** it presents no cookie or consent dialog, and the tracker is usable
  immediately

### Requirement: The counter's identifier is a checked site constant

The counter's site identifier SHALL live beside the other site constants as a
named constant, and both entry documents SHALL state it. Because the documents
are static files that cannot import a module, a repository check SHALL compare
the copy in each document against the constant, on the same terms the site's URLs
are already held, so a document that loses its counter or drifts from the
constant fails a check rather than silently stopping counting.

The identifier is public by nature — it ships in the page — and SHALL NOT be
treated as a secret or moved into build-time configuration. The check SHALL also
reject a value that is not an identifier of the shape the provider issues, so a
placeholder left behind cannot ship as a counter that reports nowhere while
appearing complete.

#### Scenario: Both copies match the constant

- **WHEN** the repository check reads the counter identifier from each entry
  document
- **THEN** both equal the constant, and a mismatch fails the check naming the
  document

#### Scenario: A missing counter fails the check

- **WHEN** the counter is deleted from one document
- **THEN** the check fails rather than passing on the strength of the other
  document

#### Scenario: A placeholder does not pass for a real identifier

- **WHEN** the constant holds a value that is not of the shape the provider
  issues — an empty string, `TODO`, or the word `token`
- **THEN** the check fails, so the gap is visible before deployment rather than
  after a week of counting nothing

### Requirement: What the counts are worth is written down

The repository SHALL record what the counts can and cannot support: that ad
blockers commonly block the counter's host, that the deployment serves no logs
against which the shortfall could be measured, and that the numbers are therefore
a trend and an order of magnitude rather than a census.

It SHALL further record that the counter keys on hostname while both documents
sit under a project sub-path, so the two languages appear as separate paths and
anything else ever published under the same hostname would appear alongside them.

#### Scenario: The limits are documented

- **WHEN** a reader opens the site-constants documentation
- **THEN** it states that blockers undercount, that the numbers are a trend
  rather than a census, and how the two languages are distinguished

### Requirement: The documented no-third-party principle matches the code

The repository's own documents SHALL state the rule the code actually follows.
Where they claim the page makes no third-party request, carries no analytics or
loads nothing from another origin, they SHALL be restated as the narrower rule
that now holds: no cookies, no consent dialog, no reading or transmitting of a
reader's progress, and no third-party script beyond one cookieless counter.

The principle SHALL be narrowed rather than deleted. It is the reason this page
carries no tag manager, no advertising, no session recorder and no hosted
donation widget, and a document that has quietly dropped its own rule cannot
refuse the next request that breaks it.

#### Scenario: No document contradicts the shipped page

- **WHEN** the repository is searched for claims that the page makes no
  third-party request or carries no analytics
- **THEN** each has been restated to describe the counter and the limits that
  still hold

#### Scenario: The rule still refuses something

- **WHEN** the restated principle is read
- **THEN** it names what remains forbidden, rather than merely recording that a
  counter was added
