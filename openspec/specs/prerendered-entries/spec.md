# prerendered-entries Specification

## Purpose

TBD - created by syncing change prerendered-entries. Update Purpose after archive.

## Requirements

### Requirement: Each served document carries the rendered list

Both deployed entry documents SHALL contain the rendered application in their
HTML, before any script runs: every runeword's name, its runes, its base item
types and its required level, in that document's own language. A fetch that never
executes JavaScript SHALL therefore be able to read the whole list.

The rendered markup SHALL be produced from the same components the browser
renders, at build time, from the same dataset. It SHALL NOT be a second,
hand-maintained copy of the content in static form: a summary written beside the
application is a summary that goes stale, and the reason this content is worth
indexing is that it is the same content the reader sees.

#### Scenario: The list is readable without scripting

- **WHEN** either deployed document is fetched and no script is executed
- **THEN** its body contains every runeword name in the dataset
- **AND** the runes, base item types and required level of each

#### Scenario: Each document renders its own language

- **WHEN** the root document and the `/ru/` document are compared without
  executing scripts
- **THEN** the root carries the English names of runes and base item types and
  the Russian document carries the Russian ones, from the dataset's own locale
  projection

#### Scenario: The markup comes from the application

- **WHEN** the prerendered markup is compared with what the browser renders for
  the same default state
- **THEN** they are produced by the same components, so no second implementation
  of the table exists to drift from the first

### Requirement: The prerender states the default state and nothing else

The render pass has no reader, no storage and no request. It SHALL therefore
render the application's default state — nothing crafted, the default sort, no
filters — and SHALL NOT imply otherwise: no progress figure in the served HTML
may claim a completion that belongs to whoever fetches it.

The renderer SHALL state the locale for each document explicitly rather than
inferring it. Inference reads the document's own `lang` declaration, which is a
browser concern; at build time there is no document and no reader, only a
decision about which language this file is, and stating it is both honest and the
only thing that works.

#### Scenario: The served progress figure is the empty one

- **WHEN** either deployed document's progress band is read without executing
  scripts
- **THEN** it reports nothing crafted, out of the whole list

#### Scenario: The locale is stated, not detected

- **WHEN** the render pass runs
- **THEN** each document's language is supplied to the renderer as an input, and
  the render does not read any document attribute to discover it

### Requirement: The client render is unchanged by the prerender

The browser SHALL continue to render the application as it does without a
prerender: the client build takes over on mount and the prerendered markup is
replaced rather than adopted. Hydration SHALL NOT be used while the locale, the
crafted progress and the view settings are read from storage the render pass
cannot see, because a returning reader's first client render differs from the
served markup by construction and every load would mismatch.

#### Scenario: Stored progress still appears

- **WHEN** a reader with stored progress loads either document
- **THEN** their marked runewords are presented once the application mounts

#### Scenario: No hydration warning is produced

- **WHEN** either document is loaded in a browser with the console open
- **THEN** no hydration mismatch is reported, because hydration is not attempted

### Requirement: A reader with saved state never sees the snapshot

The prerendered markup SHALL NOT be presented to a client that holds saved state
for this site. Each document SHALL decide this before its first paint, and hide
the snapshot where any of the persisted keys is present, so that a returning
reader sees what they see today — nothing, then their own state — rather than a
list that is not theirs.

This is not a refinement of the prerender; it is the condition on which the
prerender is allowed at all. The project's stores load in lazy initialisers for
one stated reason — an effect "would render the full table and then narrow it,
which is a visible frame of a page the player did not leave behind" — and a
snapshot shown to a reader who has progress is exactly that frame, widened to the
length of a bundle download.

The decision SHALL be taken by code that runs before the application bundle and
before any paint, SHALL survive storage being unavailable, and SHALL NOT depend
on identifying the client. The snapshot is withheld from clients that already
hold this site's data; it is never withheld from a client because of who or what
it appears to be. A crawler and a first-time reader therefore receive the same
document and the same rendered content.

The keys it tests SHALL be derived from the application's own storage-key
constants rather than restated, because a restated key is a second
representation of one fact whose failure is silent: renaming a key would leave
the test matching nothing, and returning readers would begin seeing the snapshot
with nothing to report it.

The snapshot SHALL be revealed again only once the application has committed the
reader's real state, and before a frame is painted. Revealing it after a painted
frame reintroduces the flash this requirement exists to prevent.

#### Scenario: A returning reader sees no snapshot

- **WHEN** a reader whose browser holds saved progress loads either document on a
  slow connection
- **THEN** no version of the list is presented before their own state is, and no
  intermediate content appears at any point

#### Scenario: A first visit sees the list at once

- **WHEN** a reader with no saved state for this site loads either document
- **THEN** the prerendered list is presented immediately, without waiting for the
  application bundle

#### Scenario: A crawler is treated as a first visit

- **WHEN** a client with no saved state fetches the document, whatever it
  identifies itself as
- **THEN** it receives the rendered list, and nothing about the response or the
  presentation depends on that identification

#### Scenario: Scripting disabled leaves the list visible

- **WHEN** either document is loaded with scripting disabled
- **THEN** the snapshot remains presented, because the code that would hide it
  never runs

#### Scenario: Unavailable storage does not break the page

- **WHEN** the document is loaded in a mode where reading storage throws
- **THEN** the page still loads and the application still mounts

#### Scenario: The keys come from the constants

- **WHEN** a storage key constant is renamed and the site is rebuilt
- **THEN** the built documents test the new key, because the value was taken from
  the constant rather than written out again

### Requirement: The scriptless fallback says what is actually true

The `<noscript>` paragraph SHALL state what a reader without JavaScript can and
cannot do, and it SHALL be corrected in the same change that makes an earlier
version of it untrue. With the list rendered into the HTML, the sentence that the
page "needs JavaScript to run" is no longer accurate: the list is readable, and
what needs JavaScript is marking a runeword, searching, sorting and carrying
progress between browsers.

#### Scenario: The fallback does not deny what the page now does

- **WHEN** either document's `<noscript>` text is read
- **THEN** it does not claim the page cannot be read without JavaScript
- **AND** it names what scripting is required for instead

### Requirement: The rendered content is checked, not assumed

The repository SHALL check the built documents rather than the source templates
for this guarantee, because the rendered list is a build product and a template
that still contains an empty `#root` proves nothing. The check SHALL fail when a
built document carries no runeword content, and SHALL verify each document in its
own language.

A build that silently stops prerendering is the failure this exists to catch: the
site would keep working for every reader and quietly lose everything a crawler
was given.

#### Scenario: An empty root fails the check

- **WHEN** the render pass is disabled and the build runs
- **THEN** the check fails naming the document whose `#root` is empty

#### Scenario: A document rendered in the wrong language fails the check

- **WHEN** the Russian document is built carrying English content
- **THEN** the check fails rather than passing on the presence of content alone
