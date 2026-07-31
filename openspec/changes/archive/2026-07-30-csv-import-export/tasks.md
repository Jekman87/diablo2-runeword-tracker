# CSV Import / Export — Tasks

## 1. The transfer format, as plain functions

- [x] 1.1 Create `src/transfer/format.ts`: the `EXPORT_FILENAME` constant with the docblock explaining why a download filename is not display copy, `formatExport(names)` (sorted canonical names, one per line, LF, ASCII, no BOM, **no header line** — the `# diablo2-runeword-tracker export v1` line was built and then removed, because nothing reads it until a v2 exists) and `parseImport(text)` (strip BOM, split on CRLF/LF/CR, drop `#` and blank lines, take the first comma-or-tab cell, unwrap a quoted cell including a doubled quote, trim, de-duplicate)
- [x] 1.2 Add `src/transfer/format.test.ts` covering every parsing rule the spec names: round-trip of the exporter's own output, BOM, CRLF and lone CR, `#` and blank lines, multi-column CSV, tab-separated cells, a quoted cell containing a comma and a doubled quote, repeated names collapsing, and binary bytes decoded as text yielding no candidates
- [x] 1.3 Add `src/transfer/download.ts`: `downloadText(filename, text)` — `Blob` (`text/csv`), `URL.createObjectURL`, an anchor with `download`, click, `revokeObjectURL` — kept as its own module because it is the only part jsdom cannot run

## 2. One definition of the known/unknown split

- [x] 2.1 Extract the split in `src/crafted/storage.ts` into an exported `splitStoredNames(names, known)` returning `StoredProgress`, have `loadCrafted` call it, and fold case on the match with a module-scope `Map` from lower-cased canonical name to canonical name (`toLowerCase()`, never `toLocaleLowerCase()`); store the canonical form for a matched name
- [x] 2.2 Extend `src/crafted/storage.test.ts`: the split is unchanged for the load path, a lower-case name matches and is stored canonically, a Russian label does not match, an unmatched name lands in `unknown`
- [x] 2.3 Update the `storage.ts` docblock that says import "must report unmatched names rather than skip them quietly" — that decision was withdrawn; the module preserves them and nothing reports them

## 3. Replacing progress

- [x] 3.1 Add `replace(next: StoredProgress)` to `useCraftedRunewords`: set the progress, save it through `saveCrafted`, and clear `pendingUndo` so a notice raised before the import cannot be undone against the imported set
- [x] 3.2 Extend `src/crafted/useCraftedRunewords.test.ts`: a replacement drops marks the new value does not carry, writes through storage, drops the previously stored unknown names, keeps the imported ones, and leaves no pending undo

## 4. Copy

- [x] 4.1 Add a `transfer` section to `src/i18n/en.ts`: the export and import control names, the confirmation's heading, its replacement warning, its count line and its two actions
- [x] 4.2 Add the matching Russian entries to `src/i18n/ru.ts`, with the count line as that record's own plural-form function (`ui-strings` forbids shared plural machinery), and source notes on any game vocabulary the copy uses

## 5. The controls and the confirmation

- [x] 5.1 Add an optional `transfer?: ReactNode` slot to `RunewordControls`, rendered at the far end of the result-count row with `ml-auto` — not on the filter row, which a search field and nine chips already fill — with a docblock saying why the transfer controls arrive as a slot rather than as `onExport`/`onImport` props
- [x] 5.2 Create `src/components/ProgressTransfer.tsx`: the export button (calls `formatExport` over the crafted set and hands it to `downloadText`), the import button, the visually hidden `<input type="file">` with the `accept` hint, the file read → `parseImport` → `splitStoredNames` pipeline into component state, and `event.target.value = ""` after every read so the same file fires twice
- [x] 5.3 Create the confirmation dialog in that component from `@floating-ui/react` — `useFloating` + `useDismiss` + `useRole({ role: "alertdialog" })`, `FloatingOverlay` **without** `lockScroll` — measured: the lock's scrollbar compensation shifts the whole centred page 7.5px left, because `<html>`'s box does not widen — `FloatingFocusManager` in `modal` mode with `initialFocus` on the cancel action, `aria-labelledby` on the heading — rendering the warning and the matched count, and calling `replace` only when the player proceeds
- [x] 5.4 Wire it in `src/App.tsx`: render `<ProgressTransfer>` into the new slot, passing the crafted set and `replace`

## 6. Component and application tests

- [x] 6.1 Add `src/components/ProgressTransfer.test.tsx`: choosing a file opens the confirmation and changes nothing; the count is the matched count; cancel and Escape both leave progress alone; confirming replaces it; focus starts on cancel, is trapped, and returns to the import button on close; the same file chosen twice opens the dialog twice; an unreadable file opens nothing
- [x] 6.2 Cover export in the same file with `URL.createObjectURL` stubbed at that one seam: the exported text is every crafted runeword rather than the visible rows, an empty file when nothing is crafted, and canonical English names under the Russian locale
- [x] 6.3 Extend `src/App.test.tsx`: an import replaces rather than merges, the progress indicator follows it, a pending undo notice is gone afterwards, and the two controls are present in the control bar and reachable by Tab

## 6a. The help disclosure

- [x] 6a.1 Add a transfer point to `helpPoints` in both locales — what the two controls do, that import replaces rather than adds, that there is no undo, and that a spreadsheet works if saved as CSV with names in the first column
- [x] 6a.2 Correct the storage point in both locales: it claimed progress is never shared between devices, which exporting makes false — it now says nothing leaves the browser on its own
- [x] 6a.3 Move the help panel below the header's ornamental divider, dropping the duplicated width and gutter classes the header's own grid already supplies
- [x] 6a.4 Extend `SiteHeader.test.tsx`: the panel follows the divider in document order, and the panel names both transfer controls

## 7. Documentation and the superseded decision

- [x] 7.1 Update `IDEAS.md` Phase 3 to record what shipped — replacement not merge, the confirmation and its count, no undo, no unmatched-name report, text parsing with `.xlsx` refused — and mark the "must report unmatched names" bullet as superseded on 2026-07-31 with the reason
- [x] 7.2 Update the `crafted-tracking` note in `IDEAS.md` that points at the unmatched-name report as the answer to preserved unknown names: the answer is total replacement, which is the only thing that can clear one

## 7a. Two numbers the owner settled by using it

- [x] 7a.1 Drop the export's header line: remove `EXPORT_HEADER`, emit an empty file when nothing is crafted, keep `parseImport` skipping `#` lines so files exported while it existed still import, and update the spec, proposal, design and `IDEAS.md` to record that it was built and then removed
- [x] 7a.2 Shorten the undo notice from six seconds to five, and pin the interval in `UndoToast.test.tsx` either side of it rather than outlasting it

## 8. Verification

- [x] 8.1 Run the full gate — `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test` — and fix anything it surfaces
- [x] 8.2 Verify in a browser with the `run-app` skill: export downloads a file whose contents are correct, re-importing it restores the same marks, importing a two-column spreadsheet CSV reads the first column, importing an `.xlsx` reaches a confirmation counting zero, cancelling changes nothing, and the confirmation is usable by keyboard alone under both locales
