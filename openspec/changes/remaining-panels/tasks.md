## 1. Aggregation logic

- [x] 1.1 Create `src/remaining/runes.ts`: `remainingRunes(runewords, runes, crafted)`
      returning `{ name, tier, count }[]` in canonical rune order — repeats
      within a sequence counted, crafted runewords excluded, zero-count runes
      omitted
- [x] 1.2 Unit-test it in `src/remaining/runes.test.ts` against the dataset's
      known anchors: nothing crafted yields all 33 runes summing to 343 with
      `Shael ×20` and `Zod ×3`; crafting one runeword subtracts exactly its
      sequence; `Infinity` contributes two `Ber`; a satisfied rune is absent;
      all 99 crafted yields an empty result
- [x] 1.3 Create `src/remaining/bases.ts`: `remainingBases(runewords, itemTypes, crafted)`
      returning `{ category, sockets, count }[]` — sockets from
      `runes.length`, a multi-category runeword counted under each of its
      categories, ordered by `item-types.json` position then ascending
      sockets, zero-count groups omitted
- [x] 1.4 Unit-test it in `src/remaining/bases.test.ts`: a group counts the
      uncrafted runewords it serves; a multi-category runeword appears under
      every alternative at its socket count; crafting removes it from all of
      them and drops a group reaching zero; ordering follows category then
      sockets; all crafted yields an empty result

## 2. Panel shell and content components

- [x] 2.1 Add the panels' copy to `src/i18n/en.ts`: the two titles, the three
      tier labels, the count and socket-count formats, and one completion
      message per panel — formatting lives in the copy layer, as the progress
      percentage already does
- [x] 2.2 Create `src/components/RemainingPanel.tsx`: a `<details>`/`<summary>`
      shell taking a title and children — no `open` attribute so it loads
      collapsed, `list-none` plus the WebKit pseudo-element to drop the native
      marker, a tokened glyph that rotates with `[open]` and moves between the
      muted-to-gold hover pair, and the summary band drawn from
      `--color-blood-dark`
- [x] 2.3 Test the shell: loads collapsed, opens and closes via the summary by
      keyboard, exposes its expanded/collapsed state, writes nothing to
      storage
- [x] 2.4 Create `src/components/RemainingRunes.tsx`: tier bands in tier order
      with labels from the strings layer, each rune as a `decorative`
      `RuneIcon` beside its canonical name as text and its count, a satisfied
      band omitted, the completion message when nothing is needed
- [x] 2.5 Test it: three bands in order, a rune announced once (icon carries
      no label when the name is text beside it), a satisfied tier's band
      absent, the empty state resolved from the strings layer
- [x] 2.6 Create `src/components/RemainingBases.tsx`: a flat list of
      `(category, sockets, count)` rows in aggregation order, copy that names
      the count as runewords the base would serve, the completion message when
      nothing is needed
- [x] 2.7 Test it: rows carry category, socket count and count; order matches
      the aggregation; the empty state resolves from the strings layer

## 3. Wiring into the page

- [x] 3.1 Mount both panels in `src/App.tsx` between `CraftedProgress` and
      `RunewordControls`, each aggregate derived in a `useMemo` keyed on
      `crafted` — no effects, no storage, not sticky, and no participation in
      the `--progress-band-height` stacking arrangement
- [x] 3.2 Test the page-level behaviour: toggling a runeword updates both
      panels immediately, an undo restores both, and the panels agree with the
      progress indicator on the same crafted set

## 4. Theme debt

- [x] 4.1 Render `--color-blood-dark` as the summary band and update its
      comment in `src/index.css`: the declared-ahead-of-use count falls to
      one, `--color-link`, owed to `site-header` — declare no new surface
      token, and leave `--color-panel` to the detail view
- [x] 4.2 Check the panels in a non-Chromium engine: native marker fully
      replaced, band and glyph render from tokens, open/close works by
      keyboard

## 5. Gate and stylesheet audit

- [x] 5.1 Diff the generated class list against the previous build, as
      `search-sort-filter` established — comments and copy in this change are
      prose the scanner can misread, and `pnpm build` alone does not show it
- [x] 5.2 Run the full gate: `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build`
- [x] 5.3 Update `IDEAS.md`: mark change #8 done in the table and record what
      landed differently from the sketch, including the discharged
      "placement and grouping still to be designed" note on the bases block
      and the still-open slot-filter count question
