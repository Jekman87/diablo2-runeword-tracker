# Phase 5 Polish — Tasks

Cancelled items are checked with a **Cancelled** note: the owner tried them and
reverted (grey ground / translucent panel / row View Transitions). Everything
else shipped.

## 1. The ground, and the palette that assumed it was black

- [x] 1.1 **Cancelled** — owner reverted to black `#000`; grey ground not shipped
- [x] 1.2 **Cancelled** — with 1.1
- [x] 1.3 **Cancelled** — no ground move, so no text-token lift
- [x] 1.4 **Cancelled** — with 1.1
- [x] 1.5 **Cancelled** — with 1.1
- [x] 1.6 **Cancelled** — with 1.1
- [x] 1.7 **Cancelled** — with 1.1
- [x] 1.8 **Cancelled** — with 1.1

## 2. The detail panel becomes the game's tooltip

- [x] 2.1 **Cancelled** — translucent panel only made sense on grey; reverted to opaque `#17171a`
- [x] 2.2 **Cancelled** — with 2.1
- [x] 2.3 Centre the property lines in `RunewordDetails` — the `PropertyLine`s alone. Leave the name, the labelled values and the note left-aligned, and say in the docblock why: the tooltip has no equivalent for the structure this panel adds
- [x] 2.4 Handle the grouped case: for the three runewords with two labelled property groups, centre a group's heading with its own lines so no heading sits at an edge above centred text
- [x] 2.5 Extend `RunewordDetails.test.tsx`: the property lines carry the centring, the name and the labelled values do not, and a two-group runeword centres each heading with its group

## 3. The divider spans the viewport

- [x] 3.1 Restructure `SiteHeader.tsx`: the `<header>` loses its measure classes, an inner wrapper takes `mx-auto max-w-6xl px-6` for the title block and the controls, and the divider becomes a direct child of the header outside that wrapper
- [x] 3.2 Keep the help panel at the page's measure inside its own wrapper, below the divider, as its requirement demands — the divider escaping the measure must not take the prose with it
- [x] 3.3 Move the comment that pairs the header's measure with `<main>`'s onto the new wrapper, and update its counterpart in `App.tsx` so the two still name each other
- [x] 3.4 Confirm no `100vw` anywhere: `html` reserves a stable scrollbar gutter, so a viewport-width band overflows the document. Check `document.scrollingElement.scrollWidth` against the viewport at 390px, 542px and desktop
- [x] 3.5 Extend `SiteHeader.test.tsx`: the divider is not inside the measure wrapper, the title block is, and the existing banner-landmark, two-link and panel-order assertions still pass

## 4. The footer

- [x] 4.1 Add the footer's copy to `src/i18n/en.ts` and `src/i18n/ru.ts` — the copyright line, the donation heading and its instructions, the copy control's name and the two outcomes it can announce
- [x] 4.2 Read the year from the clock at load and pass it into the copy as a value, so it cannot go stale and cannot differ between the two locale records — the same shape the patch number already takes
- [x] 4.3 Put the site name and any footer URL in `src/header/site.ts` beside the patch constants — or rename that module if "header" stops describing what it holds, updating its importers in the same step
- [x] 4.4 Create `src/components/SiteFooter.tsx`: a `<footer>` with the divider above it at half opacity as the reference draws it, the same full-width-band-with-inner-measure shape as the header, and centred content
- [x] 4.5 Render it from `App.tsx` as a sibling of `<main>`, not inside it — inside, the element exposes no `contentinfo` landmark
- [x] 4.6 Add `SiteFooter.test.tsx`: the `contentinfo` landmark exists and is not inside `main`, the copy switches with the locale, and the year comes from one source shared by both locales

## 5. The donation control

- [x] 5.1 **Get the address from the owner.** The instrument is settled — USDT on TON, chosen over TRC-20 for fees and over on-chain BTC, where the fee can exceed the donation — so record that choice and its rejected alternatives where the constant is declared
- [x] 5.2 Add the address as a constant beside the other site constants, with a comment stating that it is a receive address and that no key or seed belongs in this repository
- [x] 5.3 Verify the address against the wallet by its checksum before it is committed. This is the one string in the change worth reading twice — a wrong character sends money nowhere
- [x] 5.4 Render it as selectable text in a small dialog opened from the footer, in a monospace face, with the coin and network stated beside it, so the address is reachable by selection alone
- [x] 5.5 Add a copy control as an accelerator, not the only route: `navigator.clipboard` behind a capability check, and the outcome announced in a live region rather than by the control relabelling itself
- [x] 5.6 Cover it in `SiteFooter.test.tsx`: the address is present with the clipboard unavailable, the copy control reports success and reports failure, and the footer adds no request to another origin

## 6. Back to top

- [x] 6.1 Add the control's copy to both locale records — its accessible name is the whole of it
- [x] 6.2 Create `src/components/ScrollToTop.tsx`: a real `<button>`, not a fragment link, revealed by an `IntersectionObserver` on a sentinel at the end of the header, so the threshold follows the header's height instead of restating it as a constant
- [x] 6.3 Scroll with `scrollTo({ behavior: "smooth" })`, falling back to an immediate jump when `prefers-reduced-motion` is set, read through a media query rather than assumed
- [x] 6.4 Place it `fixed` bottom-right at `z-index: 3` — above the progress band at 2 and the table header band at 1, below the detail panel at 10 — and add it to the stacking-order comment in `src/index.css` so the arrangement stays documented in one place
- [x] 6.5 Measure it against the undo notice at 390px. The notice is `fixed bottom-4 left-1/2 -translate-x-1/2`, so the two can meet on a narrow screen; if they collide, move the control up rather than moving the notice, which is short-lived and announces itself
- [x] 6.6 Add `ScrollToTop.test.tsx`: absent before the sentinel leaves the viewport and present after, named in both locales, scrolls on click and on Enter, adds no history entry, and jumps without animation under reduced motion

## 7. The motion a re-sort needs

- [x] 7.1 **Cancelled** — View Transitions glitched when scrolling mid-animation; sticky overlap was also bad. Owner removed the feature
- [x] 7.2 **Cancelled** — with 7.1
- [x] 7.3 **Cancelled** — with 7.1
- [x] 7.4 **Cancelled** — with 7.1
- [x] 7.5 **Cancelled** — with 7.1

## 8. The three debts

- [x] 8.1 Make the 2px radius one token and apply it to every surface the project draws itself, adding the detail panel and the undo notice to the four that already have it
- [x] 8.2 Record the badges' exemption where the radius is declared: their `2px 4px` on a 4px radius and the round ladder marker are geometry copied from the reference, and a system for our own surfaces does not overrule a deliberate copy
- [x] 8.3 Check the progress indicator's engine-prefixed rules still round every part that paints, at 0% and at 100%, now that the radius arrives from a token
- [x] 8.4 Rename `--color-accent` to `--color-note-text` and update its one use site. Leave `--color-item-restriction` alone: sharing a value under two names is what having two names was for
- [x] 8.5 Give `useCraftedRunewords`' `toggle` a stable identity — `useCallback` over a functional `setState`, so it closes over nothing that changes per render
- [x] 8.6 Prove it: extend `useCraftedRunewords.test.ts` that the callback is identical across renders, and check that typing in the search field no longer re-renders every presented row

## 9. The help panel gains a legend

- [x] 9.1 Export the private `Badge` from `AvailabilityBadges.tsx` and give it a way to render as decoration — the sample must not be announced, because in the legend the words beside it already say what it means
- [x] 9.2 Add the legend's copy to both locale records: one line per badge — the ladder marker, one patch tag per era including the pre-remaster one, `Note!` — with the Russian wording for anything the game names taken from the source the existing terms came from
- [x] 9.3 Add the rune-tier explanation to both records: what the three bands of the remaining-runes panel are, and that they follow the Horadric Cube's upgrade ratios, which is why the rarest runes carry the smallest counts
- [x] 9.4 Render the legend in the help panel from the table's own badge component, so a badge cannot look one way in the table and another in the explanation of it
- [x] 9.5 Extend `SiteHeader.test.tsx` and `AvailabilityBadges.test.tsx`: the legend covers every distinct patch colour, the samples are not in the accessibility tree, every meaning is present as words, and a row's badge still carries its full meaning as its accessible name

## 10. Documentation

- [x] 10.1 Update `IDEAS.md` Phase 5 with what shipped and what it cost — the ground value actually chosen, the tokens that moved and the ones deliberately left, and the answers to the three open questions
- [x] 10.2 Record the badge-contrast decision's new standing: the legend is the mitigation that was claimed for it, and it now exists on the page rather than only in the argument
- [x] 10.3 Add the donation instrument to `docs/` where the site's constants are explained, so the next reader learns why a crypto address rather than a card
- [x] 10.4 Settle `AGENTS.md` against what this change did: it asks for one feature per change and never a whole phase, and this is a phase in one change by decision. Either the rule gains its exception for a finishing stage, or the decision is recorded as a one-off

## 11. Verification

- [x] 11.1 Run the full gate — `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test` — and fix what it surfaces
- [x] 11.2 Diff the generated class list against the previous build. This change writes a footer, a control, a legend and a page of new colour, so several new classes are expected; `pnpm build` alone will not show them
- [x] 11.3 Read the built stylesheet's computed values and check every figure this change claimed, because no test asserts a colour
- [x] 11.4 Verify in a browser with the `run-app` skill: the ground, a panel open over a row and over the header band, the centred properties, the divider at both edges with no sideways scroll, the footer's landmark and its copy control, the back-to-top control appearing and returning, a row animating under a crafted-state sort, and the legend — all of it in both locales, and at 390px as well as desktop
- [x] 11.5 Confirm the narrow-viewport overflow is no worse than it was. It is deferred, not fixed, and this change adds two full-width bands and a fixed control that could each make it worse
