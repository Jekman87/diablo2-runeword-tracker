# Tasks: crafting-advice-batch

## 1. Click-through fix (prerequisite)

- [ ] 1.1 In `RunewordRow`, treat any click whose target is not a DOM
      descendant of the row (`event.currentTarget.contains(event.target)`)
      as handled elsewhere, with a comment naming the portal-bubbling reason
- [ ] 1.2 Test: a click on plain text inside an open detail panel opens no
      confirmation and changes no crafted state

## 2. Dataset fields

- [ ] 2.1 Extend `src/data/schema.ts`: `usefulness` closed enum, `advice`
      shape (non-empty paragraphs, `https` source URLs), Russian advice
      paragraph parity in the record-level `superRefine`
- [ ] 2.2 Create `data/advice/types.ts` and `data/advice/runewords.ts` —
      authored module keyed by canonical name with per-entry `source` notes
- [ ] 2.3 Extend `scripts/generate-dataset.ts`: merge the advice module,
      fail on unknown keys, strip `source` from the emitted JSON
- [ ] 2.4 Author the content: usefulness for all 99 from the Maxroll tiers
      cross-checked against the Traderie velocity data; advice paragraphs
      (bases with affixes, sockets, ethereal notes, builds, verdicts) for
      every runeword with something worth saying, EN and RU
- [ ] 2.5 Run `pnpm data:build`; extend `generate-dataset.test.ts` and the
      dataset tests for the new fields
- [ ] 2.6 Present the full usefulness/advice table to the owner for review

## 3. Advice surfaces

- [ ] 3.1 Render the usefulness line under the name in `RunewordRow` via the
      strings layer (new copy in `en.ts`/`ru.ts`)
- [ ] 3.2 Widen the table's single-open panel state from a name to a
      (name, kind) pair; details and advice close each other
- [ ] 3.3 New `RunewordAdvice` component on the item-types cell: floating
      panel with hover/`safePolygon`, focus and click triggers, portalled,
      paragraphs plus a sources line of real anchors
      (`target="_blank"`, `rel="noopener noreferrer"`)
- [ ] 3.4 Tests: label renders and localises; panel opens by all three
      routes; links and text selection work inside it; no-advice rows offer
      no panel; one-open-panel across kinds
- [ ] 3.5 Verify in the browser: hover, tap-sized targets, copyable text,
      long-task check with the memoised rows

## 4. Confirm dialog

- [ ] 4.1 Conditional `initialFocus` in `CraftedConfirm` (mark → confirm,
      unmark → Cancel), comment stating the asymmetry
- [ ] 4.2 Minimum width on the three action-button constants
- [ ] 4.3 Update `CraftedConfirm` tests for both Enter behaviours

## 5. Help revision

- [ ] 5.1 Describe both advice surfaces with the approximation caveat naming
      season and collection date, in `en.ts` and `ru.ts`
- [ ] 5.2 Audit the existing help copy: correct anything the new surfaces
      falsify, drop the self-evident, add what is missing
- [ ] 5.3 Update help tests

## 6. SEO batch

- [ ] 6.1 Add `ru/index.html` as a second Vite input: `lang="ru"`, Russian
      title/description/OG, own canonical, Russian noscript fallback
- [ ] 6.2 hreflang trio (`en`, `ru`, `x-default`) in both documents
- [ ] 6.3 Initial locale falls back to the document `lang` when nothing is
      stored; stored preference still wins; tests for both entries
- [ ] 6.4 Generate the 1200×630 og-image from project assets; commit to
      `public/`; reference with `og:image`, `twitter:card`, `og:locale`
      pair in both documents
- [ ] 6.5 "D2R" in title/description (both languages); JSON-LD
      `WebApplication` block in both documents
- [ ] 6.6 Sitemap lists both URLs; pin the `/ru/` URL and og-image URL in
      `src/header/site.ts`; extend `scripts/crawl-files.test.ts` to hold
      every copy together
- [ ] 6.7 Update `docs/SITE.md` (new URLs, the og-image, what Search Console
      needs after deploy)

## 7. Quality gate

- [ ] 7.1 `pnpm lint`, `pnpm test`, `pnpm build`; diff the generated class
      list against the previous build for prose leakage
- [ ] 7.2 Verify the built site: both entries, both locales, panels, dialog
      focus, og tags — and re-measure the 390px overflow to confirm this
      change did not worsen it
