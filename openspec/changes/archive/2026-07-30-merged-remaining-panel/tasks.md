# Tasks: merged-remaining-panel

## 1. Copy

- [x] 1.1 In `src/i18n/en.ts`'s `remaining` block: add `title` for the merged
      panel and `runesSection` / `basesSection` for the two headings, and delete
      `runesTitle` and `basesTitle` — their words move into the new strings, and
      copy nothing renders is the defect `detail.close` was removed for
- [x] 1.2 Comment why the section labels are the short words while the panel's
      title names both lists

## 2. The merged panel

- [x] 2.1 Create `src/components/RemainingNeeds.tsx`: the two lists as two
      `<section>`s with `h3` headings from the copy layer, runes first, in a
      `grid gap-6 md:grid-cols-2` so they sit side by side from `md` and stack
      below it
- [x] 2.2 `src/App.tsx`: mount one `RemainingPanel` titled `remaining.title`
      holding `RemainingNeeds`, passing both memoised aggregates; update the
      comment that describes the page's order
- [x] 2.3 `RemainingRunes`: tier labels from `h3` to `h4`, keeping `text-lg`, so
      the outline reads `h1` → `h2` → `h3` → `h4`
- [x] 2.4 Confirm `RemainingPanel` needs no change at all — one shell used once
      instead of twice

## 3. Tests

- [x] 3.1 New `RemainingNeeds.test.tsx`: both sections present under their own
      headings in order, each list's content rendered, each completion message
      shown when its aggregation is empty, and the heading level one below the
      panel's
- [x] 3.2 `RemainingRunes.test.tsx`: the tier label's heading level
- [x] 3.3 `App.test.tsx`: one panel between progress and the controls; the panel
      helpers find it by the new title; the toggle, the undo and the
      shared-crafted-set assertions open one panel instead of two

## 4. Verification

- [x] 4.1 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass
- [x] 4.2 Measure the built page against the numbers in the proposal: the space
      between the progress band and the controls, and where the first table row
      starts, at 1280px and 390px — closed and open
- [x] 4.3 Confirm the sticky progress band and table header band are untouched:
      same offsets while scrolled, `--progress-band-height` unchanged
- [x] 4.4 Class-list diff against the previous build: every new utility is
      rendered by the merged panel, nothing orphaned
- [x] 4.5 Update `IDEAS.md` with the change and its landed note, including the
      measured saving and the three placements deliberately left for later
