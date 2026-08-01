## 1. Theme and shared copy

- [x] 1.1 Add confirm-action (green) and remove-action (red) tokens; remove undo-notice toast token if unused
- [x] 1.2 Add mark/unmark confirmation strings and progress completion strings to `en.ts` / `ru.ts`; delete `undo` keys
- [x] 1.3 Update Help marking point: confirmation, no undo toast

## 2. Toggle confirmation

- [x] 2.1 Strip undo from `useCraftedRunewords`; keep a confirmed write path
- [x] 2.2 Add Floating UI mark/unmark confirmation dialog (Cancel focused; green confirm / red remove)
- [x] 2.3 Wire App so row/button/keyboard open the dialog; apply only on confirm; remove `UndoToast`
- [x] 2.4 Update tests that assumed immediate toggle + undo

## 3. Completion message

- [x] 3.1 Show completion sentence on the progress text line at 100%; short form for `aria-valuetext`
- [x] 3.2 Measure EN+RU at ~390px and fix `--progress-band-height` (or measured height) for the sticky stack
- [x] 3.3 Extend `CraftedProgress` tests for incomplete vs complete

## 4. Bilingual import

- [x] 4.1 Extract shared `foldLabel`; build EN+RU alias map; uniqueness test
- [x] 4.2 Update `splitStoredNames` / load+import callers; point search at shared fold
- [x] 4.3 Tests: Russian-only, mixed, ё/е; export still English; drop “Russian is not a match” assertions

## 5. Gate

- [x] 5.1 Run the project quality gate and fix failures
- [x] 5.2 Note in `IDEAS.md` (brief) that this batch shipped as one change under the updated grouping rule, if the backlog table still needs a row
