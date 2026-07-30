# Tasks: site-header

## 1. Prerequisites outside the codebase

- [x] 1.1 Enable GitHub Discussions on the repository
      (`gh repo edit Jekman87/diablo2-runeword-tracker --enable-discussions`)
      and verify `https://github.com/Jekman87/diablo2-runeword-tracker/discussions`
      loads rather than 404s
- [x] 1.2 Read the Update Notes href off the reference site's header (the
      Blizzard patch-notes article for patch 3.1.1) and record it for task 2.1;
      capture a baseline class-list from the current `dist/` build for the diff
      in task 6.3

## 2. Constants and copy

- [x] 2.1 Create `src/header/site.ts` exporting the game patch value (`"3.1.1"`)
      and the three link targets (Help → repository README, Feedback →
      repository Discussions, Update Notes → the Blizzard article), with a
      comment naming where the patch value was read from and that it moves
      together with the Update Notes URL
- [x] 2.2 Add the `header` strings to `src/i18n/en.ts`: the navigation
      landmark's label, the three link labels, and `patchLine(patch)` taking
      the patch value as a parameter — no URL and no patch number in the copy
      layer

## 3. The header component

- [x] 3.1 Create `src/components/SiteHeader.tsx`: a `<header>` with the title
      (`<h1>`), the patch line beneath it in `text-muted`, a `nav` labelled from
      the copy layer holding the three default-behaviour anchors in `text-link`
      (hover: gold-light with underline), and the `gold-divider` closing it
- [x] 3.2 Lay the header out as a wrapping flex row — title block left, links
      right, links wrapping beneath the title at narrow widths — and check it
      at 390px and 1280px
- [x] 3.3 Mount `SiteHeader` as a sibling before `<main>` in `src/App.tsx`,
      remove the `<h1>` and divider from `<main>`, and give the header the same
      width classes as `<main>` with a comment on each naming the other

## 4. Tests

- [x] 4.1 `SiteHeader.test.tsx`: the three links carry their copy-layer labels
      and the `src/header/site.ts` hrefs, none forces a new tab, the nav has
      its accessible label, and the patch line contains the patch constant
- [x] 4.2 Update `App.test.tsx`: the page exposes a `banner` landmark that is
      not inside `main`, the title lives in it, and the pre-existing structure
      below the divider is unchanged
- [x] 4.3 Update the i18n test if it enumerates the record's shape

## 5. Spec accounting

- [x] 5.1 Confirm the d2-theme delta matches what shipped: `--color-link`
      rendered by the links, no new token declared, the ahead-of-use count at
      zero (update `src/index.css`'s token commentary accordingly)

## 6. Verification

- [x] 6.1 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass
- [x] 6.2 Load the built page: header renders above the divider, the sticky
      progress and table-header bands behave exactly as before, the header
      scrolls away, and each link resolves (Discussions loads, README loads,
      the Blizzard article loads)
- [x] 6.3 Diff the built stylesheet's class list against the previous build:
      every new utility is rendered by the header, no prose leakage
- [x] 6.4 Update `IDEAS.md`: mark change 10 `site-header` done with a short
      landed note (what was decided: README as Help, plain links, constants
      module)

## 7. Revision after review

Four decisions reversed on looking at the built page. The artifacts above and the
specs were rewritten to match rather than appended to, so the change reads as what
it does; these tasks record the work.

- [x] 7.1 Both links open in a new tab: `target="_blank"`,
      `rel="noopener noreferrer"`, and the new-tab behaviour stated in each
      link's accessible name through the copy layer
- [x] 7.2 Header links and the help trigger render `text-gold-mid` →
      `text-gold-light` with an underline, and `--color-link` is deleted from
      `src/index.css`'s `@theme` with its commentary rewritten (a token whose
      last use site is gone goes with it)
- [x] 7.3 Help becomes an in-page `<details>` disclosure with real usage prose
      in `src/i18n/en.ts` — intro plus five points — closed by default, content
      in the document while closed, trigger at the left edge above its own panel;
      `HELP_URL` removed from `src/header/site.ts`
- [x] 7.4 The patch-notes link moves onto the patch value inside the patch line;
      the separate Update Notes link and the single-link `nav` landmark go
- [x] 7.5 Tests rewritten: two links with new-tab attributes and names, the
      patch value as the notes link, no help link to the repository, the
      disclosure's open/closed conduct, the gold classes, no `text-link`
- [x] 7.6 Re-verify: `pnpm lint`, `typecheck`, `test`, `build`; class-list diff
      against the pre-change build; the built page at 390px and 1280px with the
      help open and closed, hover colours, and the sticky bands unchanged

## 8. Second revision: the help control's position

- [x] 8.1 Move the help control onto the title's line beside Feedback (Help
      first, the reference's order), so a closed disclosure spends no row on
      itself; the panel stays a row of the header's grid, full measure, on the
      page's left rule
- [x] 8.2 Convert the disclosure from `<details>`/`<summary>` to a button with
      `aria-expanded` and `aria-controls` — a `<summary>` cannot leave the
      element it opens — with the panel hidden by the `hidden` attribute and its
      `display` class applied only while open
- [x] 8.3 Put the hover underline on the label rather than the control, so it
      does not run under the state glyph, and tighten the glyph-to-label gap
- [x] 8.4 Update the tests for the button semantics (expanded state, the panel it
      controls, the underline's target, the accessible name excluding the glyph),
      and the spec and design for the position and the element it forces
