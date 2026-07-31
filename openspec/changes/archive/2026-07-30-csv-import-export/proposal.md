# Proposal: csv-import-export

## Why

Progress lives in one browser's `localStorage` and has no way out of it. A player
who tracks 60 runewords on a desktop and then opens the site on a laptop starts at
zero, and a cleared browser profile takes the whole Chronicle with it. There is no
account and no backend to fix that with, and none is wanted — a file the player
saves and opens somewhere else is the whole mechanism the deployment can support.

This is Phase 3 of `IDEAS.md`, and it is also the last thing standing between the
tracker and being trusted with a season's worth of marks.

## What Changes

- **An export control** writes the crafted runewords to a downloaded text file, one
  canonical English name per line and nothing else. Every crafted runeword is
  written, never the visible rows — search, filters and sort have no bearing on
  what a backup contains, for the same reason they have no bearing on the progress
  denominator.

  The format-and-version line `# diablo2-runeword-tracker export v1` was specified,
  built, and **removed before shipping**: nothing read it and nothing would until a
  second format existed, so it was a line of ceremony at the top of every file the
  player opens, paid for by a version that may never arrive. A v2 can introduce its
  own marker and read an unmarked file as v1. Import still skips `#` lines, so a
  file exported while the header was being written imports whole.

- **An import control** reads a file, matches its lines against the dataset, and
  **replaces stored progress outright**: what the file lists becomes the crafted
  set and everything held before it is gone. Not a merge, not an addition.
- **A confirmation dialog stands in front of every import.** It states that current
  progress will be erased and replaced, states how many runewords the chosen file
  will mark, and offers to cancel. Nothing is written until it is confirmed. This
  dialog is the entire safety mechanism: **there is no undo for an import**, and the
  transient undo notice is not extended to cover a bulk replacement.
- **Import parses text, and deliberately does not read `.xlsx`.** It accepts
  `.csv`, `.tsv`, `.txt` and any single-column list: a leading BOM is stripped, CRLF
  and LF and CR all end a line, `#` lines are ignored, the first cell of each line is
  taken, and surrounding quotes are unwrapped. A spreadsheet parser would become the
  largest dependency in the project in order to read a list of names; anyone holding
  a spreadsheet saves it as CSV in two clicks.
- **Unmatched names are ignored silently — but not discarded.** A line the dataset
  does not know is kept in storage, unmarked and uncounted, exactly as
  `progress-persistence` already treats an unknown stored name. There is **no
  unmatched-name report**: the count in the confirmation dialog is what a player
  judges a file by, and a file of typos announces itself by offering to import
  nothing.
- **Both controls sit in the browsing-control bar, at the far end of the row that
  states the result count.** No second bar, and not on the filter row — that line
  is already a search field and nine filter options wide, so two more controls on
  it would wrap and read as a bar of their own. Opposite ends of the count's row
  is the space that was actually free.
- **Canonical English names, under either locale.** The file's contents do not
  change with the interface language, in either direction, which is what
  `localised-dataset-text` already requires of this format.
- **The help disclosure gains a point describing the feature, and loses a false
  one.** Its last point said progress "is never shared between devices", which
  exporting makes untrue; it now says nothing leaves the browser on its own. The
  help panel also moves **below** the header's ornamental divider, where an
  explanation of the page belongs — above it, a block of prose pushes the header's
  own bottom edge down and reads as part of the title block.

**Supersedes a decision in `IDEAS.md`.** Phase 3 there says import "must **report
unmatched names** rather than skip them quietly", and the `crafted-tracking` note
points at that report as the answer to preserved unknown names having no way off
the page. The owner withdrew the report on 2026-07-31: total replacement is what
clears a stale unknown name now, and the dialog's count is what tells a player their
file is wrong. `IDEAS.md` is updated to say so rather than left contradicting the
shipped behaviour.

## Capabilities

### New Capabilities

- `progress-transfer`: moving progress between browsers as a file — what export
  writes and what it draws from, what import accepts and how it parses it, the
  replace-everything semantics, the confirmation that guards them, the silent
  handling of unmatched names, and the locale-independence of the format.

### Modified Capabilities

- `progress-persistence`: the requirement that an unknown stored name "SHALL be
  written back unchanged on every save" is narrowed. It holds for every save that
  carries prior progress forward — which is every save that exists today — and a
  wholesale replacement from an imported file is named as the one save that does
  not, because a replacement defines the whole stored value, its unknown names
  included. This is what finally gives a preserved unknown name a way out.

## Impact

- **Code**: new `src/transfer/` holding the format as plain functions — the export
  serialiser, the text parser and the match-against-dataset split — plus the
  download trigger; new `src/components/ProgressTransfer.tsx` for the two
  controls, the file input and the confirmation dialog; `useCraftedRunewords` gains a
  replace operation that writes through `src/crafted/storage.ts` and clears any
  pending undo; `RunewordControls` gains a slot for the two controls so that a
  progress concern does not move into the view-settings component; `App` wires them.
- **Copy**: `src/i18n/en.ts` and `src/i18n/ru.ts` gain the two control names, the
  dialog's title, warning, count and two actions. The count is count-bearing, so the
  Russian record carries its own plural-form function, as `ui-strings` requires.
- **Dependencies**: none added. `Blob`, an anchor with `download` and `<input
type="file">` are the platform's; the confirmation is built from
  `@floating-ui/react`, which the detail panel already depends on.
- **Tests**: unit tests for the format module — round-trip, BOM, CRLF, quoted cells,
  tab-separated, `#` lines, blank lines, duplicates, binary input; component tests
  for the dialog's cancel-and-confirm paths, focus behaviour and the same-file-twice
  case; an `App` test that an import replaces rather than merges and that the
  progress indicator follows it.
- **Specs**: one new `progress-transfer` spec, a `progress-persistence` delta and a
  `site-header` delta.
- **Docs**: `IDEAS.md` Phase 3 and its `crafted-tracking` note, per the supersession
  above.
- **Also changed**: the undo notice dismisses itself after five seconds rather than
  six. Not required by anything here — the number was marked a guess where it was
  declared, and using the page settled it.
- **Not touched**: the storage key and its format, the undo notice's own behaviour
  beyond that interval, search, sort, the filters, the progress denominator, and the
  dataset.
