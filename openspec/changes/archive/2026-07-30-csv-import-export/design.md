# Design: csv-import-export

## Context

Progress is a `ReadonlySet<string>` of canonical English runeword names, written to
one `localStorage` key by `src/crafted/storage.ts` — the module `progress-persistence`
requires to be the only thing that names the key or touches the storage API. Its
docblock already names this change as the second caller it was written for, and its
`StoredProgress` shape already carries the two halves an import produces: `crafted`
for names the dataset knows, `unknown` for names it does not.

Constraints this design has to sit inside:

- **No backend and no dependency budget.** The deployment is a static GitHub Pages
  site. `IDEAS.md` and `docs/CODE_RULES.md` both say prefer plain React over a
  library, and the owner's decision on `.xlsx` is a direct application of that.
- **`localised-dataset-text` has already ruled on the format.** Canonical English
  names, independent of the active locale, in both directions.
- **jsdom 30 implements no `<dialog>` behaviour and no `URL.createObjectURL`.**
  Verified against the installed version: `showModal` is `undefined` and
  `URL.createObjectURL` is `undefined`. `src/test/setup.ts` used to carry a
  hand-written stand-in for `HTMLDialogElement` and the change that removed it wrote
  a paragraph explaining why re-adding one would be a step backwards. That paragraph
  is a constraint on this change, not decoration.
- **`@floating-ui/react` is already a dependency** and is already the project's
  focus-trap, dismissal and focus-restoration mechanism, in `RunewordDetails`.

## Goals / Non-Goals

**Goals:**

- A crafted list leaves one browser as a file and arrives in another as the same
  marks, with no account and no request.
- The destructive half — replacement — cannot happen by accident, and cannot happen
  without the player having seen how many runewords the file will actually mark.
- The format is boring enough to hand-edit and boring enough to produce from a
  spreadsheet in two clicks.
- Zero new dependencies.

**Non-Goals:**

- **Merging.** Import replaces. A merge would need a second control, a second
  confirmation and an answer to "what does it mean to import an unmark", and the
  owner ruled it out.
- **Undo for an import.** The confirmation is the safety mechanism. The undo notice
  stays one toggle deep.
- **An unmatched-name report.** Withdrawn by the owner on 2026-07-31; the
  confirmation's count is what a file is judged by.
- **Reading `.xlsx`, `.ods` or any workbook.** A parser for those would be the
  largest dependency in the project, added to read a list of names.
- **Any change to the storage key, its version, or the shape it holds.** Nothing an
  older build wrote becomes unreadable and nothing this build writes is new in kind.

## Decisions

### The confirmation is built from `@floating-ui/react`, not from `<dialog>`

A destructive confirmation is genuinely modal — unlike the detail panel, which was
moved _off_ `<dialog>` precisely because a hover panel had no business interrupting
the reader. So the semantics `showModal()` provides are the right semantics here.
The implementation is not.

`FloatingFocusManager` in `modal` mode gives the focus trap, the `inert`/hidden
treatment of everything outside, and focus returned to the reference on close.
`useDismiss` gives Escape and outside-press. `useRole({ role: "alertdialog" })`
gives the role, and `aria-labelledby` on the heading gives the name.
`FloatingOverlay` gives the backdrop that `RunewordDialog` deliberately did
without — the one part of a modal that is about interrupting, and the one this
surface wants.

**Without `lockScroll`, and that is a measurement rather than a preference.** The
lock sets `overflow: hidden` on `<body>` and adds `padding-right` equal to the
scrollbar's width, compensating for a layout viewport that widens when the
scrollbar goes. On this page it does not widen: measured in Chrome at 1384px,
`<html>`'s border box stays 1369px with the dialog open while `<body>` gains the
15px of padding, so `#root` goes 1369 → 1354 and every centred thing on the page
jumps 7.5px left at the moment the player is being asked a destructive question.
What the lock would buy — the table not scrolling behind the dim — is worth less
than a page that holds still, and the detail panel already scrolls behind itself.
Verified after removing it: every box identical, open and closed.

**Alternative considered: native `<dialog>` plus a jsdom shim.** Rejected. The spec
carries real scenarios for the focus trap, for Escape, and for where focus lands on
close; against a hand-written shim, those tests would assert that the shim works.
`src/test/setup.ts` argues this case in full and the argument has not changed. The
platform element also costs a second focus mechanism in a codebase that already has
one that works.

Focus lands on the cancel action, set with `initialFocus` pointed at it. A modal
whose default keypress destroys progress is a modal that will destroy progress.

### The format is a pure module; the DOM parts are two thin shells around it

`src/transfer/format.ts` holds the header constant, the filename constant,
`formatExport(names)` and `parseImport(text)` — plain functions over strings, no
React, no DOM. Every parsing rule in the spec is a unit test there: BOM, CRLF/LF/CR,
`#` lines, blank lines, comma and tab cells, quoted cells with a comma and with a
doubled quote, duplicates, a round-trip of the exporter's own output, and a buffer
of binary bytes decoded as text yielding no candidates.

`src/transfer/download.ts` is the six lines that turn a string into a download:
`Blob` → `URL.createObjectURL` → an anchor with `download` → `revokeObjectURL`.
Isolated because it is the only part that jsdom cannot run, so the one test that
touches it stubs `URL.createObjectURL` at that single seam instead of the setup file
growing a global fake. **Alternative considered: a `data:` URL**, which jsdom
tolerates. Rejected — it trades the idiomatic path for a test convenience, and a
one-line `vi.stubGlobal` in one file is cheaper than a non-standard download path in
production.

### The known/unknown split has one definition, in `storage.ts`

`loadCrafted` already splits a list of names into `crafted` and `unknown`. An import
performs the same split over a different source. That logic moves out into an
exported `splitStoredNames(names, known)` which `loadCrafted` calls and the import
path calls, so there is one answer to "does the dataset know this name" rather than
two that agree today.

Matching folds case: a `Map` from `name.toLowerCase()` to the canonical name, built
once at module scope beside the existing `runewordNames` set. `toLowerCase()` and
not `toLocaleLowerCase()` — the mapping must not depend on the runtime's locale, and
`toLocaleLowerCase()` under `tr` maps `I` to `ı` and would stop `Infinity` matching.

**Why fold case at all**, given the exporter writes canonical names: because the
owner removed the unmatched-name report, and a file typed by hand or pulled out of a
spreadsheet is now the only kind that can lose a mark invisibly. Case is the one
near-miss that costs nothing to absorb and cannot make two runewords ambiguous — the
99 canonical names are distinct case-insensitively. Trimming is already part of
parsing. Nothing beyond those two is attempted: no fuzzy matching, no Russian
labels, no punctuation stripping. Those would each be a way for an import to mark a
runeword the file did not name.

### The whole replacement is computed on file choice and held until confirmed

Choosing a file reads it, parses it, splits it and puts the resulting
`StoredProgress` in component state. The confirmation renders `crafted.size` from
exactly that object, and confirming hands that same object to the hook. The count
shown and the progress written therefore cannot disagree, because they are one
value — rather than the dialog counting matches and the confirm path re-deriving
them.

`useCraftedRunewords` gains `replace(next: StoredProgress)`: `setProgress(next)`,
`saveCrafted(next)`, `setPendingUndo(null)`. It takes the whole `StoredProgress`
rather than a list of names for the same reason — the split has already happened,
and a second entry point that re-splits is a second definition.

Clearing `pendingUndo` is the small load-bearing line. Without it, a notice raised
by a toggle made ten seconds before the import stays on screen offering to reverse
a toggle against a set that no longer exists.

### The controls reach the control bar through a slot, not through props

`RunewordControls` gains one optional `transfer?: ReactNode` prop. `App` renders
`<ProgressTransfer crafted={crafted} onReplace={replace} />` into it.

**It renders on the count's row, not the filter row.** The owner's original
placement was "immediately after the filters"; that row is a search field plus
nine chips across two fieldsets, and at the page's 1152px there is no honest room
for two more controls — the pair would wrap and become a third bar in all but
name. The second row holds the count and the conditional reset and is mostly
empty, so the two buttons go to the far end of it with `ml-auto`. `ml-auto` and
not `justify-between` on the row: the reset appears and disappears with the
narrowing, so the row's child count changes, and space-between would shift the
buttons every time it did.

Dropping the filter-row placement also drops the group heading that went with it.
A label was there to line the pair up with the legends above the chips; on a row
with no legends it would be a heading that repeats what "Export progress" and
"Import progress" already say.

**Alternative considered: `onExport` and `onImport` props on `RunewordControls`.**
Rejected. That component's docblock is explicit that it owns no state and renders
the view settings; giving it a file input, a modal and a parse result would put
progress concerns inside the component about search and filters. A slot keeps the
wiring in `App`, which already owns the crafted set and already renders the
undo notice for the same reason.

### The export filename is a constant, not display copy

`diablo2-runeword-tracker-crafted.csv`, declared in `format.ts` beside the header
line. It is never rendered in the interface, and it must not change when the
interface language does — a file carried between two browsers set to two languages
has to be the same file. Same reasoning that keeps canonical runeword names out of
the strings layer. Stated at the declaration so that a reviewer holding
`docs/CODE_RULES.md` does not read it as a hardcoded string that escaped the i18n
layer.

No timestamp in the name, matching the decision that there is none in the contents.
A second export overwrites or gets a browser-appended `(1)`, which is the browser's
job and not this project's.

### The file input is hidden behind the button and cleared after every read

A bare `<input type="file">` in the control bar would be a differently-styled
control in a row of chips, and its native text ("No file chosen") is display copy
this project cannot reach. So: a visually hidden input, a real button that clicks
it, and `event.target.value = ""` at the end of the change handler. The reset is
what makes choosing the same file twice fire `change` twice, which the spec requires
because cancelling and reconsidering is the expected path when a count looks wrong.

`accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"` is a hint to
the picker, not a guarantee — every OS picker offers a way past it. That is why the
spec makes a workbook degrade to a count of zero rather than to an error: the
graceful path is the one that will actually be taken.

## Risks / Trade-offs

- **An import is irreversible and can wipe a season of marks** → The confirmation
  states the replacement and the count, cancel is the focused control, and a file
  that matches nothing says so before it clears anything. The player can also export
  first, which is one button away in the same bar. _Considered and left out:_ a line
  of dialog copy telling them to export first. The owner specified the dialog's
  contents as warning, count and cancel, and a fourth sentence in a modal is a
  sentence people stop reading.
- **A total replacement drops previously preserved unknown names** → Deliberate, and
  specified as a `progress-persistence` delta rather than left to be discovered.
  It is also the only way one of those names can ever be cleared, which
  `IDEAS.md` records as a gap this change owes an answer to.
- **Case-folded matching is one step past what the owner enumerated** → Flagged
  here rather than buried: it is a judgement call made because removing the
  unmatched-name report removed the only signal a near-miss had. It cannot create an
  ambiguous match, and it is a two-line change to drop if the owner would rather
  match exactly.
- **A hand-written CSV cell parser will not handle every CSV in the world** →
  Correct, and bounded on purpose. It handles the first cell of a line, quoted or
  not, with commas or tabs between cells. A quoted cell containing a raw newline is
  not supported and would split into two candidates, neither of which matches; a
  runeword name contains no newline, so the only file that hits this is one that was
  never a list of runeword names.
- **`FloatingFocusManager` is userland, so its modality is not the platform's** →
  Everything outside gets `aria-hidden`/`inert` from the manager rather than from the
  top layer. The trade was already made and tested for `RunewordDetails`; the gain
  is that the focus scenarios in the spec are checked against the implementation that
  ships instead of against a stand-in.
- **jsdom cannot test that the download actually downloaded** → The format is fully
  tested as a pure function and the anchor click is asserted against a stub. Whether
  the browser writes the file is a `run-app` check, which is what that skill is for.

## Migration Plan

None required. No stored value changes shape, no key changes, and nothing an
earlier build wrote becomes unreadable. Rollback is reverting the commit.

The one file-format question the change had to answer twice is the header line.
It shipped out rather than in, and the parser keeps skipping `#` lines so that
nothing exported while it existed loses its first entry. A future v2 announces
itself with its own marker and reads an unmarked file as v1 — which costs it one
branch and cost this version nothing.

## Open Questions

None. Every decision the change needed was settled by the owner on 2026-07-31; the
two judgement calls made here — case-folded matching and the slot on
`RunewordControls` — are recorded above with the reasoning and are cheap to reverse.
