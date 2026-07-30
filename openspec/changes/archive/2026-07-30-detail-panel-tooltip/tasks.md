# Tasks: detail-panel-tooltip

## 1. Palette

- [x] 1.1 In `src/index.css`'s `@theme`: move `--color-panel` to the neutral grey,
      leaving `--color-toast` and `--color-blood-dark` at their value, and rewrite
      the comment beside the table's surfaces to say why the panel left the blood
      family and the other two did not
- [x] 1.2 Declare `--color-panel-edge` for the panel's own border and
      `--color-panel-text` for its descriptive text, each commented with the
      surface it draws and, for the text, with the note that `--color-note-label`
      holds the same value for a different role
- [x] 1.3 Move `--color-property` and `--color-property-value` to the game's blue,
      one step brighter than `#6969ff`, with the measured contrast ratios and the
      reason the reference's green is not the authority for this surface

## 2. The panel

- [x] 2.1 `RunewordDetails`' `PANEL`: `border-panel-edge` in place of
      `border-row-line`, `text-panel-text` in place of `text-body`
- [x] 2.2 Confirm `RunewordDialog` needs no change — the property list already
      reads `text-property`, and the labels and the note keep the tokens they have

## 3. Verification

- [x] 3.1 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass
- [x] 3.2 Built stylesheet: the five token values are what this change declares,
      `--color-row-line`, `--color-toast` and `--color-blood-dark` are untouched,
      and the class-list diff shows only the two utilities the panel gained
- [x] 3.3 Open a detail panel in the built page and read it: grey ground against
      the black page, an edge brighter than the row hairlines behind it, blue
      property lines with brighter values, white descriptive lines, gold name and
      labels — at 1280px and at 390px
- [x] 3.4 Update `IDEAS.md` with the change and its landed note (the game rather
      than the reference as the source for this surface; blue one step brighter
      than the game's own for AA)
