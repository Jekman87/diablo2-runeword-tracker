## Context

The tracker is functionally complete. This change is the finishing pass over its
surface, and it is one change rather than nine because each item is small — see the
proposal for why that is a deliberate exception to the one-feature-per-change rule.

The state it starts from matters, because most of the difficulty is in what the
existing palette assumed. **Every colour in `src/index.css` was derived against
`#000`**, and on a black page the only direction available is upwards: a hairline,
a hover state, an inset field and a progress groove are all defined as small steps
_above_ black. Move the ground to grey and those four stop being steps above
anything. The blood bands, the panel and the toast are also near-black and become
darker than their own page.

Two other pieces of existing structure constrain this change. The sticky bands share
`--progress-band-height` and a deliberate stacking order — progress band `z-index:
2`, table header band `1`, detail panel `z-10`, the numbers eight apart on purpose —
so any new floating control joins an arrangement that already has a documented
failure mode at one scroll offset. And the table's rows are memoised because
unmemoised they cost long tasks to 127ms when a detail panel opens, so any animation
that hands every row a new prop per frame undoes a measured win.

Measurements quoted below were taken during this design: the reference ground from
[diablo2.io](https://diablo2.io/) in a browser, the contrast figures computed from
the project's own tokens.

## Goals / Non-Goals

**Goals:**

- A grey page ground that reads as the game's own screens, with **no text losing
  contrast it has today**.
- The detail panel reading as the game's translucent item tooltip, with its property
  lines centred as the game centres them.
- Closing furniture the page currently lacks: a footer, a donation route, a way back
  to the top.
- The ornamental divider spanning the viewport.
- Motion that explains a row moving out from under the pointer.
- Three named pieces of debt paid: the radius system, the misnamed token, the
  unstable callback.
- A help panel that explains the badges, which nothing on the page does today.

**Non-Goals:**

- **The narrow-viewport defect.** The table overflows below about 542px and that is
  deferred by decision. This change must not make the figure worse; it does not fix
  it.
- **A texture.** The ground is a flat colour. diablo2.io's is a tiled image, its
  theme carries no reuse licence, and a flat colour is not an asset.
- **A QR code, a payment processor, or any third-party donation widget.** An address
  and the words around it.
- **A rune inventory, and anything the availability fields could be made to filter.**
  Untouched by decision recorded in `IDEAS.md`.
- **Retiring the badge contrast decision.** Black on the classic brown stays at
  2.01:1. The legend makes the existing mitigation visible; it does not change a
  colour.

## Decisions

### The ground is `#262626`, and it comes from a measurement

diablo2.io's ground is a 590×590 tile averaging `rgb(38,38,38)` over a `#111111`
body, with per-pixel luminance from 12 to 79. `#262626` is that average. Taking the
average of the thing the owner pointed at is a better basis than a taste call, and it
is falsifiable: if a flat field at that value reads lighter than their mottled one —
plausible, since a texture spends much of its area darker than its mean — the
fallback is `#1f1f1f`, and both are measured below. **This is the one value in the
change to check in a browser before the rest is judged.**

Alternatives considered. `#111111`, their body colour, is not the ground a reader
sees and barely differs from black. A two-layer scheme — near-black page, grey
`<main>` — is what diablo2.io actually does, but their `<main>` spans the viewport
while ours is a centred `max-w-6xl` column, so the same structure here draws a grey
sheet with black gutters. That is a different and much larger design statement than
"the background is grey", and it is not what was asked for.

### Tokens move by role — raised or inset — not by preserving a ratio to the ground

The naive reading of "the ground got lighter" is that everything defined above black
must be lifted to stay above grey. That is wrong for half of them, and the reason is
worth stating because it is the rule the whole palette pass follows:

**On a black page, "distinct from the ground" can only mean lighter. On a grey page
it can mean either, and which one is right follows from what the surface is.** A
groove and an inset field are recessed, so they go _darker_ than the ground — which
they already are, and their tokens barely move. A hovered row lifts, so it goes
lighter. A hairline can go either way and goes darker, because a dark incision is
how the game draws a separator and because keeping it lighter would mean brightening
every separator in a 99-row table.

Applied, against a `#262626` ground:

| Token                    | Today     | Role              | Direction    |
| ------------------------ | --------- | ----------------- | ------------ |
| `--color-row-line`       | `#24221c` | separator         | darker       |
| `--color-row-hover`      | `#191712` | raised            | lighter      |
| `--color-muted-dark`     | `#24221c` | inset field, chip | darker       |
| `--color-progress-track` | `#24221c` | groove            | darker       |
| `--color-blood`          | `#400000` | band              | stays darker |
| `--color-blood-dark`     | `#200000` | subordinate band  | stays darker |
| `--color-toast`          | `#200000` | floating notice   | stays darker |

The blood family is the case that proves the rule. Preserving its old 1.22:1 ratio
to the ground would take the table's header band from `#400000` to `#700000` — and
that band carries gold text measured at 4.6:1, which a lighter band would spend. A
dark red band on a grey page needs no adjustment at all; it reads as a band, which
is its whole job.

Text is the other half, and the rule there is arithmetic: **no token loses contrast
it has today.** Two need lifting on a `#262626` ground, and only two:

| Token           | On `#000` | On `#262626` | Lifted to |
| --------------- | --------- | ------------ | --------- |
| `--color-gold`  | 5.34:1    | 3.85:1       | `#968c6b` |
| `--color-muted` | 4.28:1    | 3.08:1       | `#8c8782` |

`--color-muted` is already under AA at 4.28:1 and this change neither fixes nor
worsens that; it holds the standing it has. Everything else clears AA on the new
ground untouched — body 6.29:1, gold-mid 5.18:1, gold-light 7.08:1, the property
blue 4.60:1, the restriction 4.76:1.

### The detail panel becomes `rgb(0 0 0 / 0.85)`

Translucent black, which is what the game's tooltip is. `--color-backdrop` already
holds a colour in this form, so the notation is not new.

The alpha is 0.85 rather than diablo2.io's 0.5 because ours has to be legible over
table rows rather than over a decorative texture, and because at 0.85 the panel is
_darker_ than the page — which is where its edge comes from now. Over the new ground
it composes to `#060606`, and that is contrast-positive against today's opaque
`#17171a`: white text goes 17.89:1 → 20.26:1, the property blue 5.44:1 → 6.16:1, the
value blue 8.94:1 → 10.13:1.

Worth being honest about what transparency buys on a flat ground: over the ground
itself, `rgb(0 0 0 / 0.85)` is indistinguishable from the opaque colour it composes
to. It only shows where the panel overlaps something — a row, a band, a rune icon —
and that is exactly the game's behaviour, where the world shows faintly through a
tooltip.

### The property lines are centred; nothing else in the panel is

The game centres its tooltip text. Only `PropertyLine`s are centred here — the
runeword's name, the labelled values (runes, sockets, level) and the note stay
left-aligned, because those are structure this panel adds and the tooltip has no
equivalent for.

The shape to watch is that three runewords carry two labelled property groups, so
this is a list of groups with optional headings rather than a run of lines. A
centred group under a left-aligned heading reads as a mistake, so the heading
centres with its group.

### The divider goes full width by restructuring the header, not with `100vw`

`html` carries `scrollbar-gutter: stable`, so a `100vw` band is wider than the
content area by the gutter's width and would overflow the document — the same
sideways scroll this change is required not to worsen. Instead the `<header>` becomes
a full-width element, its title block and help panel get an inner
`mx-auto max-w-6xl px-6` wrapper, and the divider sits outside that wrapper as a
direct child. The `<footer>` takes the same shape.

The consequence to carry: the measure classes duplicated between `<header>` and
`<main>`, with a comment on each naming the other, move to the new inner wrapper.
The header is not sticky, so `--progress-band-height` and the stacking order are
untouched.

### The footer mirrors the header, and the donation control is an address

A `<footer>` sibling of `<main>`, not inside it — the same reason the header is a
sibling: inside `main` the element exposes no `contentinfo` landmark. Divider above
it at half opacity, which is what the reference does, then centred content.

The donation control is **the address as selectable text plus a button that copies
it**, and nothing else. No QR, which is an asset and can be added later if anyone
asks; no third-party widget, which is a script and a tracker. The address stays
selectable whether or not the clipboard is available, so the copy button is an
accelerator rather than the only route — the same shape the CSV controls already
take. The copy button reports success in a live region rather than by changing its
own label, so a screen reader hears it.

Which coin, which network, and the address itself are open questions below. What is
settled is that the value is a **receive address in the repository** — public and
permanent by nature, and never a key.

### Back-to-top is revealed by a sentinel, not by a scroll handler

An `IntersectionObserver` on a sentinel element at the end of the header. That gives
"once the page has scrolled past the header" literally, with no magic offset to keep
in step with the header's height, and no scroll listener running on every frame of a
7400px page.

`position: fixed`, bottom right, `z-index: 3` — above both sticky bands and below
the detail panel at `z-10`, because a panel the reader opened is more important than
a control that returns them somewhere. Scrolling uses
`scrollTo({ behavior: "smooth" })` unless `prefers-reduced-motion` is set, in which
case it jumps.

### Row motion uses the View Transitions API, so the memoisation is untouched

`document.startViewTransition` with a `view-transition-name` per row: the browser
takes the before and after positions and interpolates them. No component receives a
new prop per frame, which is what keeps the row memoisation — and the 127ms of long
tasks it prevents — intact.

Alternatives considered. Hand-rolled FLIP means measuring 99 rows and writing
transforms, which is per-frame work on the exact structure that was memoised to
avoid it. An animation library is a dependency for decoration. Both were rejected on
those grounds.

Where the API is unavailable the reorder happens instantly, as it does today. That is
acceptable because this is decoration whose absence is the current behaviour, and it
is the same code path `prefers-reduced-motion` takes.

### The 2px radius becomes a system, with the badges explicitly outside it

`--radius-xs` extends to the detail panel and the undo notice, which are the two
square surfaces left. **The badges keep their 4px**, and that is a carve-out rather
than an oversight: their whole geometry — `2px 4px` padding on a 4px radius, the
ladder marker round at `1px 5px` — was copied from the reference deliberately. A
system for our own surfaces does not overrule geometry taken from somewhere else.

### `--color-accent` becomes `--color-note-text`

A rename and its one use site. The token holds `#BD8547` for the detail view's note
text and nothing else, so the old name describes a hue's job in the abstract, which
is what this file's naming rule exists to prevent. It shares its value with
`--color-item-restriction`, which is fine and is exactly why they are two tokens.

### `toggle` becomes stable by updating from the previous state

`useCallback` over a functional `setState`, so the callback closes over nothing that
changes per render. Then typing in the search field stops handing 99 rows a new prop.

### The badge legend renders real badges, and they are decorative there

The private `Badge` in `AvailabilityBadges.tsx` is exported so the legend can render
a sample per kind — the ladder marker, one patch tag per era, `Note!` — from the same
component the table uses, rather than a copy that can drift.

**In the legend the samples are `aria-hidden`.** In the table a badge carries its
full meaning as its accessible name because nothing beside it says what it is; in the
legend the sentence next to it says exactly that, so an announced badge would repeat
it. Same component, two roles, decided by a prop rather than by two components.

The words stay in the copy layer, in both locales. The samples are components, which
is the distinction the help panel's "every word resolves through the display-copy
layer" requirement has to grow.

## Risks / Trade-offs

- [The ground reads lighter than diablo2.io's despite matching its average, because
  a texture's mean is not its impression] → `#1f1f1f` is the measured fallback and
  the numbers for it are in this document. Check in a browser before judging the rest
  of the palette.
- [A palette pass is invisible to the test suite by design — tests assert token
  references, not colour values] → Verified the way `detail-panel-tooltip` was: read
  the built stylesheet's values, then read the page in a browser, including a panel
  open over a row and over a band.
- [Lifting `--color-gold` and `--color-muted` shifts two colours a reader knows] →
  Both move by the minimum that holds their current contrast, and both keep their
  hue: the retarget scales channels rather than picking a new colour.
- [The undo toast is `fixed bottom-4 left-1/2`, centred, and the new control is
  bottom-right] → No overlap at desktop width; at 390px the toast is wide and the two
  can meet. Measure both visible at 390px and, if they collide, the control moves up
  rather than the toast moving — the toast is short-lived and announces itself.
- [View Transitions on a 99-row table could be slow, or could animate more than the
  moved row] → Scope the transition names to rows whose position actually changed, and
  measure the same way the memoisation was measured: click to painted, and long tasks.
- [The full-bleed restructure breaks the header's landmark, its two-link rule, or the
  layout below the divider] → All three are existing requirements with existing
  scenarios; they are re-run rather than re-reasoned.
- [The class-list diff grows from prose] → This change writes a footer, a donation
  control, a legend and a page of new colour, so it should expect several. Diff the
  generated class list against the previous build; `pnpm build` alone does not show
  it.
- [A donation address is permanent in git history] → It is a receive address, which is
  public information. The risk worth naming is the opposite one: an address typed
  wrongly sends money nowhere, so it is checksum-verified against the wallet before
  the change is applied, and it is the one string in this change that gets read twice.

## Settled by the owner

- **The donation instrument is USDT on TON.** Chosen over TRC-20 for fees and over
  on-chain BTC, where the fee can exceed the donation. The footer states both the
  coin and the network, because an address alone is ambiguous between chains and a
  sender who picks the wrong one loses the money.
- **The copyright line is the site's name and the year read from the clock at
  load.** A fixed year goes stale on a page that is otherwise entirely static, and
  the year is therefore the one piece of text here whose value depends on when it is
  read — which is also why it comes from one place rather than from each locale's
  copy record.
- **The legend shows all four patch colours**, the pre-remaster era included. The
  reference shows only its new ones, but a reader meeting the brown tag has nowhere
  else to learn that it means "before the remaster", and a legend that omits one of
  four colours is a legend that has to be read twice.

## Open Questions

- **The address itself.** The one string in this change that is verified against the
  wallet by checksum before it is committed.
