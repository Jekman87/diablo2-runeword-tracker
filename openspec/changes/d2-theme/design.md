## Context

The repository has a green gate, a validated 99-runeword dataset and a deployed
shell that renders a black-on-white browser default: `src/index.css` is the
single line `@import "tailwindcss"`. See [`proposal.md`](proposal.md) for why the
theme lands before the components.

Seven facts shape this design. All seven were read from the source or measured,
not assumed:

- **The reference's exact token values are available.** `src/assets/css/_colors.css`
  declares them: ground `#000`, body text `#aca798`, blood `#400000` /
  `#200000`, gold `#8a8062` / `#a79663` / `#bab197`, runeword name `#48ac3f`,
  property text `#5cbd4b`, title `#d5d2d0`, accent `#bd8547`, ladder badge
  `#501008` on `#a19999`, patch tag `#513b2c`, muted `#74706c` / `#24221c`.
- **That file contradicts itself on one token.** `--color-gold` is `#8a8162` in
  its `@theme` block and `#8a8062` in its `:root` block. The `:root` declaration
  is unlayered while `@theme` is emitted into Tailwind's `theme` layer, and
  unlayered styles beat layered ones regardless of order, so `#8a8062` is the
  value that actually renders. We take that one.
- **The sprite is 440×120, eleven columns by three rows of 40×40**, and the
  vendored `runes.css` offset order matches `runes.json` array order index for
  index. The three sprite rows are therefore exactly the three tier bands.
- **The reference dims rune icons with `opacity: 0.5`** — not the `0.75` recorded
  in [`docs/REFERENCE.md`](../../../docs/REFERENCE.md) — because unowned runes
  render faded. Rune inventory is a feature `IDEAS.md` decided against.
- **The divider is a repeating band, not a fixed image.**
  `.rw-Layout-goldBarSeparator` is `url(hr-gold.gif) repeat-x 0 100%` at 16 px
  tall, which `docs/REFERENCE.md` describes as a 301×32 image.
- **Bellefair ships three subsets and none of them is Cyrillic**: hebrew
  (6 752 B), latin-ext (11 336 B) and latin (16 536 B). The dataset is 100 %
  ASCII — verified across all names, item types, properties, restrictions and
  notes — so the latin subset alone covers every character Phase 1 renders.
- **The reference loads the font from `fonts.googleapis.com`** via a `<link>` in
  its `index.html`, applied by `.ux-serif { font-family: Bellefair, serif }`.

## Goals / Non-Goals

**Goals:**

- One named token set that every later component styles against, so no change
  invents its own hex.
- A rune name renders the correct sprite cell, provably, for all 33 runes.
- No third-party request at runtime. The deployed page fetches only its own
  fingerprinted assets.
- No hand-transcribed offset table and no second representation of a rune's
  sprite position.
- `vendor/` stays read-only and unimported, and the borrowed assets carry their
  attribution.
- Zero new dependencies.

**Non-Goals:**

- Any component beyond the one rune icon that proves the theme works.
- The reference's branding. Its logo files are identity, not technique.
- A second colour mode.
- Structural typography decisions — heading scale, table density, spacing rhythm.
  Those belong to the change that builds the thing being spaced.
- Any interpretation of the palette into semantic component roles that no
  component exists to need yet.

## Decisions

### Tokens are declared in `@theme`, and named for role

`src/index.css` gains one `@theme` block. Declaring there rather than in a plain
`:root` is what makes the values usable as `bg-blood`, `text-gold`,
`text-property` — real Tailwind utilities, sorted by `prettier-plugin-tailwindcss`
and completed by the editor, instead of `bg-[var(--color-blood)]` arbitrary
values at every call site.

The names describe what the colour is **for**, not what it looks like:
`--color-property` rather than `--color-green-light`. A component reading
`text-property` states its intent; one reading `text-green-400` states a
coincidence, and the next change that needs a different green has nowhere to put
it.

_Alternative considered:_ mirror the reference's own token names one-for-one, so
the two stylesheets can be diffed. Rejected in part — the role-shaped ones
(`blood`, `gold`, `ladder`) are kept precisely because that diff is useful, but
its `--color-green` / `--color-green-light` pair is dropped, because in our
application those two are the runeword name and the property text and nothing
else.

### The token set covers what `IDEAS.md` already commits to, and stops there

Tokens for the table band, the badges and the crafted tint are included even
though no component renders them yet, because `IDEAS.md` specifies all three as
settled requirements — colour-coded patch badges, an `L` ladder marker, a green
tint on a crafted row. Defining them once here is the whole point of a theme
change; leaving them out would mean three later changes each inventing a hex for
the same band.

The line is drawn at colours no decision has been made about. Nothing is added
speculatively for the popover, the toast or the panels.

### The sprite cell is derived from the rune's array position

A rune's cell is `col = index % 11`, `row = ⌊index / 11⌋`, where `index` is its
position in `runes.json`. Nothing stores it and nothing generates a stylesheet
for it.

This is the same rule that keeps socket count off the runeword record, applied to
the same kind of fact: the position is already in the data, so a second
representation could only drift from it. It also answers the question
`runeword-dataset` deliberately left open — whether the rune record should carry
a sprite index — with no.

- _Generate 33 CSS rules from `runes.json`, mirroring the vendored `runes.css`._
  Rejected. It is the technique the reference needs because a Vue template binds
  a class name, and it costs us a generated artifact plus a drift test to keep it
  honest — all to precompute one multiplication. The dataset generator earns its
  drift test because 45 KB of game values cannot be re-derived by inspection; 33
  offsets can.
- _Store `spriteIndex` on each rune record._ Rejected for the drift reason above,
  and because it would mean regenerating the dataset for a presentation concern.
- _Thirty-three hand-written rules._ Rejected: that is transcription, which this
  project has a standing rule against for exactly the reason that a wrong offset
  renders a real icon of the wrong rune.

The offsets are expressed in units of a `--rune-size` custom property —
`background-size: calc(var(--rune-size) * 11) calc(var(--rune-size) * 3)` and a
position of `calc(var(--rune-size) * -col)` — so the icon is resolution
independent and responsive sizing changes one variable. That part of the
reference's technique is worth keeping and is the reason its `runes.css` is
written in `calc()` rather than pixels.

The name-to-index lookup is a `Map` built once in the theme layer, not in
`src/data`. Sprite geometry is presentation; the dataset should not learn about
it.

### Rune icons render at full opacity

The reference's `opacity: 0.5` exists to fade runes the player does not own. We
decided against rune inventory, so inheriting the value would mean shipping every
icon permanently dimmed for a reason that does not apply — a faithful copy of an
artefact rather than of a technique.

### The font is self-hosted, latin subset only

One 16 536-byte `woff2` under `src/assets/fonts/`, declared with `@font-face` and
`font-display: swap`.

Self-hosting removes the only third-party request the page would otherwise make,
which matters more here than the bytes: a static site on GitHub Pages with no
backend has no reason to make its first paint depend on `fonts.googleapis.com`
resolving, and a `<link>` to a font CDN is render-blocking. It also means the
site works offline and leaks no visitor IP to a third party.

Latin only, because the dataset is 100 % ASCII. Adding latin-ext would cost
11 336 bytes to cover accented characters that no runeword, rune, item type or
property line contains, and hebrew is irrelevant. If Phase 2 needs more, it adds
a subset then — `unicode-range` makes that additive.

_Alternative considered:_ the reference's Google Fonts `<link>`. Rejected as
above. _Also considered:_ a generic serif stack and no font file, which is free
and loses the display character the whole visual language depends on.

### The fallback stack is load-bearing, because Bellefair has no Cyrillic

`font-family: Bellefair, <serif stack>` is not the usual defensive fallback. When
Phase 2 ships Russian, every Cyrillic glyph will fall through to the stack,
because Bellefair has no Cyrillic subset to fall back from. The stack therefore
has to be chosen as a real reading font rather than as `serif` and a shrug.

This is recorded here rather than left for Phase 2 to discover, because the
alternative is finding out when the Russian names land and the headings silently
change typeface mid-page.

### Borrowed assets are copied into `src/assets/`, never imported from `vendor/`

The sprite, cursor and divider are byte-identical copies. `vendor/` is a verbatim
snapshot whose README forbids editing it, and `build-toolchain` forbids any module
under `src/` importing from it, so "move the sprite out of `vendor/`" as
`IDEAS.md` phrases it has to be a copy that leaves the original in place.

The accepted cost is 98 KB of sprite duplicated in the repository. In exchange, a
test asserts the copy is byte-identical to its vendored original — the analogue of
the dataset's drift test, and about four lines. Without it, "someone edited the
copy" is a silent divergence in a binary file, which no diff review would catch.

### The cursor is set once at the root, not on every `div`

The reference uses `div { cursor: url(mouse.png) 2 2, pointer !important }`, which
its own source marks with a stylelint suppression. That makes every division of
the page claim to be clickable.

We set the custom cursor once as the document default with its `2 2` hotspot, and
leave interactive elements to state their own cursor. A cursor is a real
imposition on the user — it overrides an OS-level affordance they chose — so it
should at least tell the truth about what is clickable. `IDEAS.md` settled that we
want it; that does not settle copying the mechanism.

### `RuneIcon` is the acceptance evidence, and the geometry is tested as a pure function

`src/components/RuneIcon.tsx` takes a rune name and renders its icon. The cell
maths lives in an exported pure function, unit-tested across **all 33 runes**, and
the component test asserts the style it emits.

The split is forced by a real constraint: jsdom does not evaluate `calc()`, so
`getComputedStyle` cannot confirm a computed pixel offset. Asserting only that an
element rendered with a background image would pass on every wrong offset — and a
wrong offset is invisible, because it renders a real rune icon that is simply the
wrong rune. Testing the pure function exhaustively is what actually closes that
gap; the browser check in the migration plan closes the rest.

### Three documentation corrections travel with the change

`docs/REFERENCE.md` records the rune opacity as `0.75`, the divider as a 301×32
image and the rune text as tan. The source says `0.5`, a `repeat-x` band, and
`#48ac3f` green for the runeword name. Those are fixed here rather than left, so
the next reader of that document is not designing against three wrong facts.

## Risks / Trade-offs

- **A wrong sprite offset is invisible** → It renders a real icon of the wrong
  rune, and no smoke test catches it. Mitigated by testing the cell function over
  all 33 runes rather than a sample, and by a browser check against the reference
  before the change is accepted.
- **jsdom cannot compute `calc()`** → So the component test asserts the emitted
  style attribute, not `getComputedStyle`. The pure function carries the real
  assertion. Stated so the test suite is not later "improved" into asserting
  something jsdom cannot answer.
- **Bellefair has no Cyrillic** → Phase 2's Russian text will render in the
  fallback. Named as an open question rather than discovered later; the fallback
  stack is chosen deliberately for that reason.
- **A custom cursor overrides a user's OS affordance** → Kept, because `IDEAS.md`
  settled it as core to the feel, but applied from a single root rule so it does
  not also lie about what is interactive.
- **98 KB of sprite is duplicated between `vendor/` and `src/`** → Required: one
  spec forbids editing the snapshot, another forbids importing it. The
  byte-identity test makes the duplication honest.
- **Assets referenced from CSS must resolve under the Pages sub-path** → This is
  the first `url()` in the project, and a wrong `base` here passes every local
  check and breaks only once deployed, which is why CI already asserts the prefix
  for JS and CSS. Extended to fonts and images as a spec scenario, and verified in
  `dist/` before the change is accepted.
- **Fetching three assets over the network may fail on this machine** →
  `docs/DATA-SOURCES.md` documents TLS interception breaking `curl` and `git`
  differently; `--ssl-no-revoke` and the schannel settings are the recorded
  workarounds, and both the GitHub and gstatic endpoints responded while this was
  written.
- **The token set commits colours before components exist** → Bounded to what
  `IDEAS.md` already settled. The failure mode of the alternative is worse: three
  changes each picking their own dark red.
- **Acceptance is partly visual** → Tests prove the geometry and the tokens
  resolve; they cannot prove it looks right. The migration plan makes the browser
  check an explicit step rather than an assumption.

## Migration Plan

No runtime migration. Purely additive: no persisted state, no consumer of the
theme yet beyond the one icon, nothing to convert.

1. Vendor `mouse.png` and `hr-gold.gif` into `vendor/runewizard/assets/` and add
   them to the vendor README's file table. Verify sizes against the GitHub API,
   as the existing four were.
2. Fetch the Bellefair latin `woff2` and the OFL text into `src/assets/fonts/`.
   Copy the three images into `src/assets/images/`.
3. Add the `@theme` block, the `@font-face`, the base rules and the rune sprite
   rule to `src/index.css`.
4. Add the cell function, `RuneIcon`, and their tests. Confirm the 33-rune test
   fails if the column and row are swapped, then restore.
5. Extend `NOTICE`; correct the three facts in `docs/REFERENCE.md`.
6. Run the full gate, then `pnpm dev` and **look at it** — a rune from each tier
   band, at both ends of the sprite, against the reference site. Then `pnpm build`
   and confirm the font and image URLs in `dist/` carry the sub-path prefix.

**Rollback:** revert the commit. The only files touched outside new directories
are `src/index.css`, `NOTICE`, the vendor README and two documents, and nothing
consumes the theme, so a revert is complete by construction.

## Open Questions

None blocking. Three left open deliberately:

- **Which display font Phase 2 uses for Cyrillic.** Bellefair has no Cyrillic
  subset, so Russian either falls back or the theme gains a second family. The
  translation change decides, with the Russian strings in hand.
- **Whether the crafted row's green tint is a token or a computed mix.**
  `IDEAS.md` calls for a green tint and a left accent border; whether that is one
  more token or `color-mix()` over an existing one is a decision for the change
  that renders a row.
- **Whether `rune-bg2.gif` is wanted behind rune cells.** The reference paints a
  tile there. It is a table-cell decision, it is not needed to prove an icon
  renders, and it is one more borrowed asset — so the table change settles it.
