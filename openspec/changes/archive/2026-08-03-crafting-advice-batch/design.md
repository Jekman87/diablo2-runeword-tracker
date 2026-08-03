# Design: crafting-advice-batch

## Context

The tracker renders a vendored, zod-validated dataset of 99 runewords and
deliberately keeps every judgement out of it: availability fields are
decoration, progress is always out of 99, and nothing in the app ranks or
recommends. The owner now wants two editorial surfaces — how useful a runeword
is, and what to socket it into — plus a click-through bugfix they depend on,
two confirm-dialog refinements, a Help revision and an SEO batch. The
constraints that shape everything below: the dataset is generated
(`scripts/generate-dataset.ts`) from `vendor/` plus authored translation
modules in `data/ru/`; every user-facing word goes through the i18n layer or
the dataset's locale projection; the table's 99 rows are memoised and only the
open floating panel ever exists in the document; the site is one static page
on GitHub Pages with its URL pinned in `src/header/site.ts`.

## Goals / Non-Goals

**Goals:**

- A reader can tell at a glance whether a runeword is worth runes: a
  three-value usefulness label under the name, and free-form crafting advice
  (bases with affixes, sockets, ethereal notes, builds, sell/vendor verdicts,
  source links) behind the item-types cell.
- Clicks inside any portalled panel stop toggling the row beneath.
- Enter in the confirm dialog does the safe-and-expected thing per direction.
- Russian search queries can find the site; social shares carry a card.

**Non-Goals:**

- No filter, sort, counter or any logic reading the new fields — they are
  decoration on the exact terms `ladderOnly`/`patch`/`note` already set.
- No prices, no currency values, no live market data in the app. The Traderie
  analysis is a one-time offline research input, not an integration.
- No redirects and no language auto-detection: the stored locale preference
  keeps winning everywhere; `/ru/` only changes the default for first visits.
- No narrow-viewport table rework (still its own deferred change).

## Decisions

### 1. Row clicks are excluded by DOM containment, not by more selectors

`FloatingPortal` is a React portal: the panel's DOM lives at the end of the
document, but its synthetic events bubble through the _React_ tree into the
row's `onClick`. `handledElsewhere` filters interactive elements and live
selections, and plain text in a panel is neither — so the click toggles the
row. The fix: treat any event whose `target` is not a DOM descendant of the
`<tr>` (`event.currentTarget.contains(event.target)`) as handled elsewhere.
Chosen over adding `[role="dialog"]` to the `INTERACTIVE` selector because
containment covers every portalled surface this row will ever host — including
the advice panel this change adds — rather than the ones remembered to list.

### 2. New fields are authored modules merged by the generator

`usefulness` and `advice` have no vendor source, and the project already has
the pattern for exactly that: `data/ru/*.ts` — authored TypeScript modules
keyed by canonical name, validated against the vendored records, merged into
the emitted JSON, with per-entry `source` notes that never ship. A new
`data/advice/runewords.ts` module carries, per runeword: the usefulness value,
the English advice, the Russian advice, and the sourcing note. The generator
validates keys against the dataset and enforces EN/RU parity the same way it
does for translations. Editorial content in `data/`, generated artefact in
`src/data/` — the existing boundary, unmoved.

### 3. Field shapes: a closed enum and structured prose

- `usefulness?: "meta" | "situational" | "chronicle"` — the _value_ is
  locale-independent data; the _words_ shown for it are UI copy in
  `src/i18n/`, exactly as slot names work. Optional so the dataset stays
  loadable while entries await authoring, but the authored module covers all
  99 and a test pins that.
- `advice?: { paragraphs: string[]; sources?: { label: string; url: string }[] }`
  — paragraphs as an array of plain strings and links as a separate list,
  rendered as a "Sources" line at the panel's foot. Chosen over markdown-like
  inline links because rendering them would mean either a parser dependency or
  hand-rolled markup in dataset strings; nothing in the owner's examples needs
  a link mid-sentence. `ru.advice` mirrors `paragraphs` count-for-count
  (enforced like property-group parity); `sources` are shared, not translated.

### 4. The advice panel is the detail panel's pattern, and "one open panel" now spans both kinds

The panel reuses `@floating-ui/react` with the same three triggers (hover with
`safePolygon`, focus, click/tap), the same conditional focus management and
the same portal — a second instance of a solved problem, not a new pattern.
The reference element is a button wrapping the item-types cell content, so the
desktop hover target is the whole cell and the mobile tap target is the text
already there. Links inside are real anchors and the text is selectable; both
work because `safePolygon` holds the panel open under the pointer and the
row-click fix (Decision 1) keeps interactions inside it from toggling the row.
The table's single-open state widens from a runeword name to a
`(name, panel-kind)` pair, because "only one panel open" is a property of the
page and a details panel and an advice panel are both panels; opening either
closes whatever else is open.

### 5. Enter follows the direction; the buttons get a floor width

`CraftedConfirm`'s `initialFocus` becomes conditional: marking focuses the
confirm action (Enter adds — nothing is lost if it was a misclick, the dialog
already said what it will do), unmarking keeps focusing Cancel (Enter
preserves progress). The direction is already in `pending.crafted`; the change
is one ternary and the comment explaining the asymmetry. All three action
constants gain `min-w-*` so the English "Add" stops rendering as a sliver —
sized to match the language switch buttons, the page's existing precedent for
a minimum chip width.

### 6. `/ru/` is a second Vite entry, not a router or a redirect

Vite builds `ru/index.html` as a second rollup input loading the same bundle.
The document carries `lang="ru"`, Russian `<title>`/description/OG tags, its
own canonical, and the same hreflang pair as the root (`en`, `ru`,
`x-default` → root). The app's initial-locale logic gains one step: stored
preference first, else the document's `lang`. Chosen over prerendering or a
router because the product is one page in two languages, and two static shells
is the smallest thing a crawler can index as two languages. The sitemap lists
both URLs; `scripts/crawl-files.test.ts` extends to hold every copy of both
URLs together, as it already does for one.

### 7. The social card is a committed asset in `public/`

`og:image` must be an absolute URL in static HTML, so the card is a
1200×630 PNG in `public/` (unhashed, stable name), generated once from the
project's own themed assets (black ground, Bellefair title, rune sprite row,
ornamental divider) via a throwaway script — the PNG is committed, the script
is not part of the build. Both documents reference it with `twitter:card:
summary_large_image`, `og:locale`/`og:locale:alternate`, and a JSON-LD
`WebApplication` block naming the two languages. The image URL joins the
pinned constants beside `SITE_URL`.

### 8. Research method: tier list first, trade velocity as the check

Usefulness assignments start from the Maxroll tier list (S/A → meta, B/C →
situational, D/F → chronicle) and are checked against Traderie completed-trade
velocity (the time the newest 50 completed trades span — measured range:
Grief 17h to Wind's 32 trades in three years), with disagreements resolved by
judgement and recorded per entry in the authored module's `source` notes.
Recommended bases come from the same Traderie listings (sellers name the base)
cross-checked against build guides. The owner reviews the full assignment
table before it ships; Help states the season ("Reign of the Warlock") and
collection date and calls the labels approximate.

## Risks / Trade-offs

- **Portal containment check silently guards future surfaces** → the row's
  comment must say the check exists for portals, or a later cleanup "for
  simplicity" reintroduces the bug the panel depends on not having.
- **Two floating panels per row could both mount hooks** → same cost shape as
  today: contexts are per-row but panels render only while open; the memoised
  row keeps its stable props. Verify with the same Chromium long-task check
  `detail-view-hover` used.
- **The advice text roughly doubles the dataset's prose in two languages** →
  bundle grows by tens of kilobytes of JSON. Accepted: it is the feature. The
  class-list diff and bundle-size look happen at review as the project already
  requires.
- **A second HTML shell can drift from the first** → the crawl-files test
  pins both documents' URL copies and hreflang pairs together, so drift fails
  the build rather than waiting to be noticed.
- **Usefulness judgements go stale between seasons** → accepted by the owner;
  the Help caveat names the season and date, and staleness is a data edit, not
  a code change (the Mosaic precedent).
- **Editorial content in the dataset invites scope creep toward logic** → the
  spec states the fields are decoration on the availability-markers terms; any
  future filter is its own proposal.

## Open Questions

None blocking implementation. The owner reviews the usefulness assignments and
advice texts after the research pass produces them; corrections are data-only
edits to `data/advice/runewords.ts`.
