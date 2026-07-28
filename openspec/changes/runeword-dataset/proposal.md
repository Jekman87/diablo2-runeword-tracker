## Why

Every Phase 1 feature reads the same data and none of it exists yet in a form
the application can import. The table, the progress bar, the search, the slot
filter, the remaining-runes panel and the remaining-bases panel are all
projections of one dataset, so the dataset is the gate on all of them. Until it
lands, no feature change can be written without inventing its own ad-hoc shape.

The raw material is already in place and verified: `vendor/runewizard/` holds
99 runeword records, their 99 property blocks, the 33 runes and the 20 base
item categories, byte-checked against the upstream MIT-licensed snapshot (see
[`docs/DATA-SOURCES.md`](../../../docs/DATA-SOURCES.md)). What is missing is the
step from a read-only third-party snapshot to a typed, validated dataset of our
own that `src/` may import. This change is only that step — the data layer, no
UI.

## What Changes

- Ship the dataset as three committed static JSON files under `src/data/`:
  99 runewords with their granted properties merged in, the 33 runes with their
  tier, and the 20 base item categories with their optional wiki URLs.
- Adopt our own field names rather than the vendor's abbreviations — `name`,
  `runes`, `requiredLevel`, `itemTypes`, `itemTypeRestriction`, `properties`,
  `patch`, `ladderOnly`, `note`. The vendor's `title`/`ttypes`/`tinfos`/`level`
  do not leak into application code.
- **Socket count is not stored.** It equals `runes.length` and is derived at
  every use site, so there is no second field that can drift.
- Define `zod` schemas as the single source of truth for the shape, with the
  TypeScript types inferred from them, and validate the dataset when it loads
  rather than trusting the JSON.
- **Generate the dataset with a committed script rather than transcribing it.**
  The 45 KB of game data in `vendor/` is retyped by nobody: a script reads the
  vendor files, validates the vendor shape, transforms it, and writes the JSON.
  A unit test proves the committed JSON still matches what the generator
  produces, so the two cannot silently diverge.
- Add unit tests over the dataset invariants that a wrong value would otherwise
  hide behind: 99 records, unique names, every rune reference resolving to one
  of the 33 runes, 343 rune slots in total, every item type resolving to a known
  category, every runeword carrying at least one property line.
- Add the attribution the MIT licence requires, now that data derived from
  `fabd/diablo2-runewizard` ships inside our bundle rather than sitting inert
  under `vendor/`.

Explicitly **not** in this change:

- Any UI. No table, no panels, no progress bar, no rune sprite. The sprite and
  its CSS stay in `vendor/` until a presentation change needs them.
- The item-type-to-slot mapping behind the helm / weapon / shield / body-armour
  filter. That is filter logic, it needs a judgement call on at least one
  category (see Impact), and it belongs to the change that ships the filter.
- Crafted state, `localStorage`, and the remaining-runes and remaining-bases
  aggregation. All three depend on progress, which nothing tracks yet.
- Russian translations. Phase 2. English names stay the canonical identifiers,
  and nothing in this schema blocks a translation layer on top.
- Any correction of the vendor data's game accuracy. The transformation is
  faithful; if a level or a property is wrong upstream, it is wrong here too,
  and fixing it is a separate, evidenced change.

## Capabilities

### New Capabilities

- `runeword-dataset`: the data contract the whole application reads — what a
  runeword record contains, the rune and item-type reference data it points at,
  the invariants that hold across all 99 records, the validation that enforces
  them, and the generator that keeps the committed data honest about its
  source.

### Modified Capabilities

- `build-toolchain`: the requirement _Vendored reference data is excluded from
  the build_ currently asserts that "no content originating from `vendor/`
  appears in `dist/`". This change deliberately puts content derived from
  `vendor/` into the bundle, so as written the requirement would be violated by
  the change that fulfils the project's purpose. It needs to distinguish the two
  things it is really protecting — that `vendor/` is never compiled, linted,
  formatted or imported by application code — from a blanket ban on the data
  itself ever reaching production.

## Impact

- **New**: `src/data/` holding the three JSON files, the `zod` schemas, the
  inferred types and a single validated entry point; `scripts/` holding the
  generator and its drift test; a root `NOTICE` carrying the attribution.
- **Modified**: `tsconfig.node.json` (add `scripts` to `include`, so the
  generator is type-checked); `eslint.config.js` (a config block giving
  `scripts/` Node globals instead of browser ones); `package.json` (one
  `data:build` script); `README.md` (the attribution credit).
- **Dependencies**: none added. `zod` is already a runtime dependency and
  `typescript` already a dev one; the generator needs nothing else.
- **Bundle**: roughly 45 KB of JSON, imported and therefore inlined by Vite
  rather than fetched. No loading state and no network failure path to design
  for, which is worth more than the bytes.
- **Untouched**: `vendor/` stays read-only and unedited. `src/App.tsx` gains
  nothing — this change adds no rendering, so the visible page is unchanged and
  acceptance has to be judged from tests rather than from the site.
- **Risk worth naming**: a transcription error in game data is invisible. A
  wrong required level or a dropped property line looks exactly like correct
  data — no test fails, no type breaks, and the mistake surfaces only when a
  player trusts it in game. This is the whole reason the dataset is generated
  instead of typed out, and the reason the invariant tests target
  cross-references and counts rather than spot-checking values.
- **Known data question, deferred deliberately**: `Grimoire` appears as a base
  category on `Ancient's Pledge` alongside `Shields`, and which of the four
  filter slots it belongs to is not obvious from the data. Nothing in this
  change depends on the answer, because the dataset carries categories verbatim
  and classifies nothing. The change that introduces the slot filter has to
  settle it against the game.
