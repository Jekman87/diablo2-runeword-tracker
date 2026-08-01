# Proposal: tracker-ux-batch

## Why

Three related UX gaps land together: accidental mark/unmark on a large row
target, a silent 100% progress line, and import that rejects Russian runeword
lists. Splitting them into three OpenSpec changes would mean three full
propose–apply–archive cycles for one owner request; `AGENTS.md` now allows
grouping a coherent batch into one change.

## What Changes

1. **Toggle confirmation** — activating the crafted control or the row opens a
   modal (mark: cancel + green confirm; unmark: cancel + red remove) instead of
   toggling immediately. The transient undo toast is removed; the dialog is the
   safety mechanism, as for import. Help copy is updated.

2. **Completion message** — at 100% crafted, the progress text line appends a
   congratulations sentence after the percentage and counts (same line). Sticky
   band height is adjusted so the table header stays flush. Copy in both locales.

3. **Bilingual import** — import matching accepts canonical English names and
   Russian dataset labels (mixed files allowed); stored and exported names stay
   canonical English. Fold: case, trim, `ё`/`е`. Shared with the load splitter.

## Capabilities

### New Capabilities

- _(none)_

### Modified Capabilities

- `crafted-tracking`: confirmation before mark/unmark; undo notice removed;
  completion sentence on the progress line at 100%.
- `ui-strings`: confirmation copy; completion sentence; undo keys removed.
- `site-header`: help describes confirmation, not undo toast.
- `d2-theme`: confirm/remove action colours; undo-notice token removed; sticky
  progress height may change with the longer completion line.
- `progress-transfer`: matching is English **or** Russian label.
- `progress-persistence`: "known" includes Russian labels; unavailable-storage
  wording no longer assumes undo.

## Impact

- Toggle path: `App`, row/toggle, new confirmation dialog, remove `UndoToast`.
- Progress: `CraftedProgress`, i18n, `--progress-band-height`.
- Import/load: `splitStoredNames` / alias map, shared fold with search, tests.
- One quality-gate pass for the whole batch.
