# Design: tracker-ux-batch

## Context

One owner request, three surfaces: mark/unmark confirmation (and dropping undo),
a 100% congratulations line on progress, and bilingual import matching. They
share the crafted-progress path and the i18n layer; implementing them as three
OpenSpec changes would triple the propose–apply–archive cost. `AGENTS.md` now
prefers grouping a coherent batch.

Constraints that apply across the batch:

- `@floating-ui/react` for modals; no native `<dialog>` (jsdom).
- Display copy through `src/i18n/`; colours through theme tokens.
- Storage and export stay on canonical English names.
- Sticky progress height (`--progress-band-height`) couples to the table header.

## Goals / Non-Goals

**Goals:**

- Confirm before every mark/unmark (row, button, keyboard); green confirm / red
  remove; remove undo toast.
- At 100%, append completion copy on the same progress text line; keep sticky
  stack correct.
- Import (and the shared name splitter) match English and Russian labels; mixed
  files work; fold case/trim/`ё`/`е`.

**Non-Goals:**

- Changing import replace semantics or export format.
- Fuzzy matching, milestones below 100%, or celebration chrome beyond the line.
- Sharing one React dialog component between import and toggle (same pattern is
  enough).

## Decisions

### 1. Toggle confirmation (see prior `toggle-confirmation` design)

- Confirmation is the safety net; undo goes away.
- One pending-confirm state at App level; Floating UI overlay; focus Cancel;
  return focus to the crafted control.
- New confirm/remove colour tokens; drop `--color-toast` with the notice.

### 2. Completion message (see prior `completion-message` design)

- Same visible line: percentage and counts, then the sentence.
- `aria-valuetext` stays the short counts form.
- Prefer raising `--progress-band-height` after measuring EN+RU at ~390px; fall
  back to measured height if a fixed value wastes too much space.

### 3. Bilingual import (see prior `bilingual-import` design)

- Extend `splitStoredNames` via a folded alias map (EN + `ru.name` → canonical).
- Shared `foldLabel` with search.
- Uniqueness test over folded keys; Russian labels already in `unknown` may
  promote to crafted on first load after deploy — intentional.

### Apply order inside the batch

Implement confirmation and copy/theme first (largest UI blast radius), then
completion line + sticky height, then matching/fold — so progress UI is stable
before bilingual tests assert confirmation counts. One quality gate at the end.

## Risks / Trade-offs

- **[Risk] Larger review than a single feature** → Mitigation: tasks grouped by
  feature; specs stay capability-scoped deltas.
- **[Risk] Sticky height fights completion wrap** → Measure before ship.
- **[Risk] Extra click on every mark** → Accepted by the owner.

## Migration Plan

No storage key bump. Optional promotion of previously-unknown Russian names on
load. Deploy after one quality-gate pass.
