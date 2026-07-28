## Why

Every Phase 1 component reads the same visual language, and none of it exists
yet. `src/index.css` is one line — `@import "tailwindcss"` — so the deployed page
renders a black-on-white browser default. Building the table, the badges, the
popover and the panels before the theme exists means building them against
placeholder colours and repainting each one afterwards, which is why
[`IDEAS.md`](../../../IDEAS.md) puts the theme before the components.

The material is available and now verified rather than assumed. The reference's
own `_colors.css` gives the exact token values, its `main.css` gives the sprite
and cursor techniques, and the 440×120 rune sprite is already vendored and
byte-checked. What is missing is our own theme layer: tokens the components can
name, a display font that does not depend on a third party at runtime, and a rune
icon that renders the right 40×40 cell.

## What Changes

- Declare the palette as Tailwind v4 `@theme` custom properties in
  `src/index.css`, using the values read from the reference's `_colors.css`
  rather than eyeballed approximations — black ground `#000`, body text
  `#aca798`, the blood band `#400000` / `#200000`, the gold family `#8a8062` /
  `#a79663` / `#bab197`, and the two property greens `#48ac3f` / `#5cbd4b`.
- **Both greens belong to a granted-property line**, not one to the runeword's
  name. The reference calls `#48ac3f` `--color-runeword-text`, which reads like
  the name, but applies it to `.rw-RunewordPopup-body` — the property list — and
  uses `#5cbd4b` for the numbers picked out within each line. A runeword's name
  is drawn from the gold family: `gold-mid` in the popover title, `muted` in the
  table cell, `gold-light` on hover. Taking the token's name at face value would
  have shipped a `text-runeword` utility that renders green, which the reference
  never does and the game does not either.
- **Self-host Bellefair** as a single 400-weight `woff2` under
  `src/assets/fonts/`, loaded with `@font-face` and `font-display: swap`. The
  reference pulls it from `fonts.googleapis.com`; we do not, so the page makes no
  third-party request and renders offline.
- Copy the rune sprite from `vendor/` into `src/assets/images/` and render a rune
  icon by **deriving its sprite cell from its position in `runes.json`** — the
  vendored offset order matches the dataset's array order exactly, index for
  index, so the sprite row is the rune's tier band.
- **Store no sprite index and generate no 33-rule stylesheet.** The cell is
  `(index % 11, index / 11)`, derived at the use site — the same rule that keeps
  socket count off the runeword record. This closes the open question
  `runeword-dataset` left about whether the rune record should carry a sprite
  index: it should not.
- Vendor two further assets from the reference — `mouse.png` (the cursor,
  hotspot `2 2`) and `hr-gold.gif` (the ornamental divider, a `repeat-x` band,
  not the fixed image [`docs/REFERENCE.md`](../../../docs/REFERENCE.md) describes
  it as) — then copy both into `src/assets/images/`.
- Apply the cursor from a single base rule rather than copying the reference's
  `div { cursor: … !important }`, which sets a pointer cursor on every division
  of the page whether it is interactive or not.
- Render rune icons at **full opacity**. The reference's `opacity: 0.5` dims
  runes you do not own, and rune inventory is a feature `IDEAS.md` explicitly
  decided against, so inheriting the dimming would be inheriting the artefact of
  a feature we do not have.
- Add one `RuneIcon` component as the theme's acceptance evidence: give it a rune
  name, get that rune's icon. It is the smallest thing that proves the sprite,
  the token layer and the alias all work together.
- Extend `NOTICE` to cover the two newly borrowed assets and the font's SIL Open
  Font License, and keep the OFL text alongside the font it covers.

Explicitly **not** in this change:

- The table, the badges, the properties popover, the progress bar and the two
  remaining-* panels. This change gives them their colours; it does not build
  them.
- The site header and footer. The reference's `logo-rune.png` and
  `logo-text-runewizard.png` are **its branding, not a visual technique**, and
  are deliberately not vendored — reusing them would misrepresent this project as
  Runewizard.
- The favicon, and the `rune-bg2.gif` tile the reference paints behind rune
  cells. Neither is needed to prove a rune renders, and the tile's role is a
  table-cell decision.
- Any dark/light mode. The theme is one palette; a tracker styled after a game
  with a black UI has no second mode to design.
- The item-type-to-slot mapping, still owed by the change that ships the filter.

## Capabilities

### New Capabilities

- `d2-theme`: the visual contract every component renders against — the named
  colour tokens and what each is for, the self-hosted display font, how a rune
  name becomes the correct sprite cell, the cursor and divider decorations, and
  the attribution the borrowed assets require.

### Modified Capabilities

- `build-toolchain`: the requirement _Vendored reference data is excluded from
  the build_ currently permits derived content in the bundle only when it "has
  been transformed into the project's own schema". That wording was written for
  the JSON dataset and does not fit a PNG copied byte-for-byte into
  `src/assets/`, so as written this change would violate the requirement it needs
  to rely on. It has to cover binary assets copied from the snapshot as well as
  data transformed out of it, while keeping the snapshot itself uncompiled,
  unlinted, unformatted and unimported.
- `static-site-deployment`: the requirement _Published site_ asserts that the
  hashed **JavaScript and CSS** assets resolve under the repository sub-path.
  This change adds the first font and image assets, and they are referenced from
  inside CSS rather than from a module import, which is a different resolution
  path and the exact class of bug the sub-path assertion exists to catch. The
  guarantee needs to extend to them.

  It also needs to say that those assets are **emitted as files at all**. A
  sub-path guarantee is only meaningful for an asset that has a URL: Vite inlines
  anything under 4 KB as a base64 data URI, which silently exempts the small
  decorations from the very assertion being added here and makes the guarantee
  depend on a file's byte count. Stating the file-emission requirement at spec
  level is what gives the build setting a reason to exist, so it cannot later be
  tidied away as an unexplained config line.

## Impact

- **New**: `src/assets/fonts/` (the Bellefair `woff2` and its OFL text);
  `src/assets/images/` (the rune sprite, cursor and divider copies);
  `src/theme/rune-sprite.ts` (the cell function and the name-to-index map) and
  its test; `src/components/RuneIcon.tsx` and its test;
  `scripts/borrowed-assets.test.ts` (the byte-identity test).
- **`scripts/`, not `src/`, for the byte-identity test.** It reads two files off
  disk, and `tsconfig.app.json` deliberately withholds Node's types from
  application code — its `types` field lists only `vite/client`,
  `vitest/globals` and `@testing-library/jest-dom`, so `node:fs` and `Buffer` do
  not resolve there. `tsconfig.node.json` already covers `scripts/`, and the
  dataset drift test it sits beside is the same kind of check for the same
  reason. Adding `"node"` to the app project to keep the test under `src/` would
  hand every component `process` and `Buffer`, which is a worse trade than one
  file living next to its analogue.
- **Modified**: `src/index.css` (the `@theme` block, `@font-face`, the base and
  cursor rules, the rune sprite and divider utilities); `src/App.tsx`;
  `vite.config.ts` (emit assets as files rather than inlining the small ones);
  `NOTICE` (three assets and the font licence); `docs/REFERENCE.md` (correct the
  details this change verified against the source: rune opacity is `0.5` not
  `0.75`, the divider is a `repeat-x` band not a fixed 301×32 image, and the
  green is the property list rather than the runeword's name); `IDEAS.md` (the
  Planned changes row).
- **`src/App.tsx` becomes the theme's acceptance surface.** Two tasks require
  looking at the result — that the divider tiles at more than one width, and that
  a rune from each tier band renders the right picture — and neither is possible
  against a page that renders nothing. It shows all 33 runes as the sprite's own
  11×3 grid, so every cell is checked at a glance rather than sampled, plus the
  divider at two widths. It is interim: the table change replaces it.
- **Added to `vendor/`**: `assets/mouse.png` and `assets/hr-gold.gif`, listed in
  the vendor README's file table like the existing four. `vendor/` stays
  read-only afterwards; nothing already in it is edited.
- **Dependencies**: none added. Tailwind v4 already handles `@theme`, and Vite
  already base-prefixes and fingerprints assets referenced from CSS — but only
  those it emits as files. Its default inlines anything under 4 KB as a base64
  data URI, which would have caught the cursor and the divider, so the build is
  set to emit every asset as a file. See the `static-site-deployment` note above.
- **Bundle**: roughly 100 KB of new assets — the 98 KB sprite dominates, the
  font is around 15 KB and the two decorations under 6 KB together. All are
  fingerprinted static files served once and cached, not parsed JavaScript.
- **Risk worth naming**: this is the first change whose acceptance is genuinely
  visual. A wrong sprite offset renders a real rune icon that is simply the wrong
  rune, and no test that only asserts "a background image is set" would catch it.
  The `RuneIcon` test therefore has to assert the computed cell position for
  named runes at both ends of the sprite, not merely that the element rendered.
- **Risk worth naming**: the two new vendored assets have to be fetched over the
  network, and [`docs/DATA-SOURCES.md`](../../../docs/DATA-SOURCES.md) documents
  TLS interception on this machine breaking `curl` and `git` in different ways.
  The documented `--ssl-no-revoke` and `schannel` workarounds apply; the GitHub
  API and raw endpoints were both reachable while this proposal was written.
- **Untouched**: `src/data/` and its schema. The sprite index is derived from the
  existing array order, so the dataset gains no field and needs no regeneration.
