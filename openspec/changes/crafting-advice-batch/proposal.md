# Proposal: crafting-advice-batch

## Why

The tracker says _what_ is left to craft but nothing about _whether it is worth
crafting_ — a player closing the Chronicle cannot tell Spirit from Holy Thunder
without leaving the page. The owner asked for two advice surfaces (a usefulness
label and per-runeword base recommendations), and named four smaller items in
the same request: a real click-through defect on the detail panel, two
confirm-dialog refinements, a Help revision, and an SEO batch whose biggest gap
is that the Russian half of a bilingual site is invisible to search engines.
One request, one change, per the grouping rule in `AGENTS.md`.

## What Changes

- **Fix: clicks pass through the detail panel.** Clicking plain text in the
  open properties panel toggles the row beneath it (opens the crafted-confirm
  dialog). `FloatingPortal` is a React portal, so the panel's synthetic events
  bubble through the React tree into the row's `onClick`; the row must ignore
  events whose target is not its own DOM descendant. Prerequisite for the
  advice panel below, which must be clickable inside.
- **Usefulness label.** A new optional dataset field with exactly three values
  — `meta`, `situational`, `chronicle` — rendered as a second line under the
  runeword's name. Presentation only: no filter, no sort, no counter reads it.
  Sourced from the Maxroll tier list cross-checked against Traderie
  completed-trade velocity; the owner reviews the assignments.
- **Crafting advice.** A new optional free-form dataset field per runeword:
  recommended bases _with the affixes that matter_ (resists on paladin
  shields, +3 bow skills on a Grand Matron Bow), socket counts,
  ethereal-for-mercenary notes, which builds use it, sell/keep/vendor advice,
  and source links. Shown in a floating panel on the item-types cell — hover
  on desktop, click/tap on mobile — with working links and selectable,
  copyable text inside it.
- **Confirm dialog refinements.** Action buttons get a minimum width (the
  English "Add" is a sliver); Enter confirms when _marking_ and continues to
  cancel when _unmarking_ — the reflex keypress is the safe-and-expected
  action for each direction.
- **Help revision.** The two new surfaces are described with an explicit
  "approximate estimates" caveat naming the data season and collection date,
  and the existing content gets an audit pass — drop the obvious, refresh the
  stale, add what is missing.
- **SEO batch.** A `/ru/` static entry point (same bundle, Russian
  title/description, Russian default locale for first-time visitors; the
  stored language preference still wins, no redirects), a `hreflang` pair on
  both documents, both URLs in the sitemap, an `og:image` social card built
  from the project's own themed assets plus `twitter:card`, `og:locale` and
  its alternate, the "D2R" search term in the title/description, and a
  JSON-LD `WebApplication` block.

## Capabilities

### New Capabilities

- `crafting-advice`: the two advice surfaces — the usefulness label under the
  runeword's name and the crafting-advice panel on the item-types cell —
  including their interaction rules (hover/tap, links, copyable text) and
  their strictly decorative relationship to progress logic.

### Modified Capabilities

- `runeword-dataset`: two new optional fields (`usefulness`, `advice`) with
  schema validation and whole-record Russian parity on the advice text.
- `localised-dataset-text`: advice text and usefulness labels render in the
  active locale; advice Russian is authored free-form from fan sources — the
  strict game-client sourcing rule applies to game vocabulary inside it, not
  to the prose.
- `crafted-tracking`: the row-toggle exclusion extends to portalled surfaces
  (the click-through fix); the confirm dialog's initial focus depends on the
  direction being asked about; action buttons carry a minimum width.
- `site-header`: the help panel describes the two advice surfaces with the
  approximation caveat, and its existing content is revised.
- `search-indexing`: the Russian entry point, hreflang, social card, locale
  metadata, keyword coverage and structured data.

## Impact

- `src/data/schema.ts`, `src/data/runewords.json`, `data/ru/` — new fields and
  their generation/validation. The advice content itself is research output,
  reviewed by the owner.
- `src/components/RunewordRow.tsx` (click exclusion), `RunewordDetails.tsx`
  (unchanged pattern, reused for the advice panel), a new advice panel
  component, `CraftedConfirm.tsx` (focus + width).
- `src/i18n/en.ts`, `src/i18n/ru.ts` — help revision, new feature copy.
- `index.html`, new `ru/index.html` (or generated equivalent), `public/`
  (og-image, sitemap), `src/header/site.ts` (pinned URLs), `docs/SITE.md`.
- No new runtime dependency: the advice panel reuses `@floating-ui/react`.
- No progress-format or storage change; canonical names stay the identifiers.
