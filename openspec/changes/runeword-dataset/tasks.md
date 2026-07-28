## 1. Tooling for the generator

- [x] 1.1 Add `scripts` to `include` in `tsconfig.node.json`, so `pnpm typecheck`
      covers the generator. Confirm afterwards that no diagnostic references a
      file under `vendor/` — if one does, the generator is importing the snapshot
      as a module instead of reading it as text
- [x] 1.2 Add an ESLint config block for `scripts/**/*.ts` giving it
      `globals.node` instead of `globals.browser`, leaving the `dist` and
      `vendor` ignores untouched
- [x] 1.3 Add `"data:build": "node scripts/generate-dataset.ts"` to
      `package.json`. No runner dependency — Node 24 strips the types, so the
      generator's own source must stay erasable-syntax-only: no `enum`, no
      `namespace`, no parameter properties
- [x] 1.4 Run `pnpm typecheck` and `pnpm lint` on the empty-scripts state to
      confirm the config changes alone break nothing

## 2. Schemas and types

- [x] 2.1 Create `src/data/schema.ts` with the `zod` schema for a runeword
      record: `name`, `runes` (non-empty, ordered), `requiredLevel` (positive
      integer), `itemTypes` (non-empty), optional `itemTypeRestriction`, required
      `ladderOnly` boolean, optional `patch`, optional `note`, and non-empty
      `properties`
- [x] 2.2 Add the rune schema — `name` plus `tier` as the union `common` /
      `semirare` / `rare` — and the item-type schema, with an optional `url`
- [x] 2.3 Export the TypeScript types as `z.infer` of those schemas. Do **not**
      hand-write a parallel `interface`; one declaration is the point
- [x] 2.4 Deliberately omit any socket-count field. It equals `runes.length` and
      is derived at each use site

## 3. Generator

- [x] 3.1 Create `scripts/generate-dataset.ts` with a vendor loader that reads a
      file with `readFileSync`, transpiles it in memory via `typescript`'s
      `transpileModule` to CommonJS, and evaluates it through
      `new Function("exports", "require", js)` with a `require` that throws.
      Read the files as text — a static `import` would pull `vendor/` into
      `pnpm typecheck` and the vendor files annotate with types they never
      declare
- [x] 3.2 Confirm the loader reads all four vendor files, including
      `runes.ts` with its `export const enum`, and that the counts match
      `docs/DATA-SOURCES.md`: 99 runewords, 99 description keys, 33 runes,
      20 item categories
- [x] 3.3 Add strict `zod` schemas for the **vendor** shape and parse each file
      immediately after evaluation. The runeword schema must accept exactly the
      eight known keys — `title`, `runes`, `level`, `ttypes`, `tinfos`,
      `version`, `ladder`, `note` — so a new upstream field fails loudly rather
      than being silently dropped
- [x] 3.4 Assert the description keys and the runeword titles are the same set in
      **both** directions, and fail naming the mismatched entries. They agree
      today; the assertion is for after a vendor refresh
- [x] 3.5 Transform the runeword records: `title`→`name`, `level`→
      `requiredLevel`, `ttypes`→`itemTypes`, `version`→`patch`,
      `ladder`→`ladderOnly` normalised to a boolean on all 99. Omit `patch`,
      `note` and `itemTypeRestriction` when absent rather than emitting empty
      values
- [x] 3.6 Strip the surrounding parentheses from `tinfos` into
      `itemTypeRestriction`, asserting first that every source value is
      parenthesis-wrapped so the rule cannot quietly mangle a value that does not
      fit it
- [x] 3.7 Merge the property blocks in as `properties`: split on newlines, trim
      each line, drop empties. The 99 blocks carry 201 blank and 974 indented raw
      lines, so neither step is optional
- [x] 3.8 Transform the runes, mapping tier `1`/`2`/`3` to `common`/`semirare`/
      `rare` and preserving array order as the canonical rune order
- [x] 3.9 Parse the transformed data against the schemas from section 2 before
      writing, so the generator cannot emit output its own consumers would reject
- [x] 3.10 Write `src/data/runewords.json`, `src/data/runes.json` and
      `src/data/item-types.json`, preserving the vendor's patch-grouped record
      order so a post-refresh diff stays readable
- [x] 3.11 Run the emitted text through Prettier's API using the repository's own
      resolved config, so `pnpm data:build` leaves a tree `format:check` already
      accepts instead of always producing a formatting diff
- [x] 3.12 Split the module into a pure transform function and a thin I/O entry
      point, so the drift test can call the transform directly without spawning a
      subprocess
- [x] 3.13 Run `pnpm data:build` and read the output: `Infinity` keeps
      `Ber Mal Ber Ist` with the repeat intact, `Mosaic` carries all three
      availability fields, `Wealth` has the fewest property lines at 4 and
      `Fortitude` the most at 26

## 4. Validated entry point

- [x] 4.1 Create `src/data/index.ts` importing the three JSON files and parsing
      each at module initialisation. Validation is unconditional — the likely
      future edit is a hand-fix to the JSON, and load-time parsing is what makes
      that fail loudly
- [x] 4.2 Export the validated `runewords`, `runes` and `itemTypes`, plus `Map`
      lookups by name for runes and item types. Every consumer needs them and the
      table resolves 343 rune references, so build them once at load
- [x] 4.3 Do not export a `socketCount()` helper. It wraps one property access
      and invites caching the result in a field, which is exactly the drift the
      derived-count rule exists to prevent
- [x] 4.4 Confirm the JSON is imported and bundled rather than fetched —
      `resolveJsonModule` is already enabled, so no config change should be
      needed

## 5. Dataset tests

- [x] 5.1 Test the counts and identity: exactly 99 runewords, all names distinct,
      33 runes, 20 item categories
- [x] 5.2 Test the rune cross-reference: every rune named across all 99 sequences
      resolves, and the total rune slots across the dataset is 343
- [x] 5.3 Test rune order and repeats explicitly — `Ancient's Pledge` is
      `Ral Ort Tal`, `Infinity` is `Ber Mal Ber Ist`. Also assert the five
      runewords that repeat a rune still do: `Sanctuary`, `Infinity`,
      `Last Wish`, `Phoenix`, `Bone`
- [x] 5.4 Test the item-type cross-reference: every category named by a runeword
      resolves against the 20 declared, and the four with no URL — `Grimoire`,
      `Melee Weapons`, `Missile Weapons`, `Weapons` — still validate
- [x] 5.5 Test derived socket counts: each equals its rune-sequence length, and
      the range across the dataset is 2 to 6
- [x] 5.6 Test the properties: every runeword has at least one line, no line is
      empty, and no line carries leading or trailing whitespace
- [x] 5.7 Test required levels: every value a positive integer, range 13 to 69
- [x] 5.8 Test the rune tiers: each is one of the three named values, and each
      band holds exactly 11 runes
- [x] 5.9 Test the availability fields as data: `ladderOnly` present on all 99
      and set on exactly 9, `patch` present on 74, `note` present only on
      `Mosaic`, and the progress denominator derived from the dataset is 99
      regardless of any of them
- [x] 5.10 Test restriction normalisation: no `itemTypeRestriction` value carries
      surrounding parentheses, and runewords needing no narrowing expose none
- [x] 5.11 Test that malformed data fails at load: parse a record with a required
      field removed and with one given the wrong type, and assert each throws
      naming the offending field

## 6. Drift test

- [x] 6.1 Add `scripts/generate-dataset.test.ts` that runs the pure transform
      against the current vendor snapshot and compares the result to the
      committed JSON
- [x] 6.2 Compare **parsed objects**, not file text, so a formatting change can
      never fail the data test and reformatting can never satisfy it
- [x] 6.3 Confirm the test is picked up by Vitest's default include without a
      config change, and that it passes in the `jsdom` environment the project
      configures globally
- [x] 6.4 Verify the test actually bites: hand-edit one value in the committed
      JSON, confirm the test fails and names the diverging dataset, then restore
      the value
- [x] 6.5 Verify the vendor-shape guard bites: temporarily feed the generator a
      record with a renamed field, confirm it fails naming that field rather than
      emitting a record with missing values, then revert

## 7. Attribution

- [x] 7.1 Add a root `NOTICE` naming Fabrice Denis, the MIT licence and the
      upstream repository, and stating that `src/data/` is derived from it
- [x] 7.2 Link the attribution from `README.md`, so it is reachable rather than
      merely present
- [x] 7.3 Confirm the upstream MIT licence text is still at
      `vendor/runewizard/LICENSE` and that nothing in this change edited any file
      under `vendor/`

## 8. Documentation

- [x] 8.1 Record the confirmed field mapping and the generator command in
      `docs/DATA-SOURCES.md`, next to the existing refresh procedure, so a future
      vendor refresh is one documented sequence rather than two half-documented
      ones
- [x] 8.2 Note in `docs/DATA-SOURCES.md` that `Grimoire` has no wiki URL and its
      filter slot is unresolved, so the slot-filter change inherits the question
      rather than rediscovering it
- [x] 8.3 Update the `IDEAS.md` Data section if it describes the dataset as
      pending

## 9. Acceptance

- [x] 9.1 Run `pnpm data:build` twice in a row and confirm the second run leaves
      the working tree clean
- [x] 9.2 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five exit
      zero
- [x] 9.3 Confirm `pnpm build` still succeeds and that `dist/` contains the
      derived data while no module from `vendor/` was bundled.
      **Verified with a temporary importer, because this change deliberately
      adds no consumer.** With one line importing `@/data` from `App.tsx` the
      dataset inlines — bundle 190.67 KB → 302.13 KB, `Ancient's Pledge` and
      `Ber","Mal","Ber","Ist` present, still no vendor module — and with it
      reverted Rollup tree-shakes the whole graph away, which is the committed
      state. The build-toolchain scenario is permissive (derived data _may_ be
      bundled, conditional on application code importing it), so the absence is
      correct here; the change that adds the first consumer inherits the
      standing proof
- [x] 9.4 Confirm no module under `src/` imports from `vendor/`
- [x] 9.5 Run `openspec validate --changes runeword-dataset --strict`
- [x] 9.6 Commit as `feat(data): add validated runeword dataset`
