# Reference site analysis — Runewizard

<https://fabd.github.io/diablo2-runewizard/>
Repository: <https://github.com/fabd/diablo2-runewizard>

Studied live via browser on 2026-07-28. Site header reads
"for Diablo II Resurrected: Reign of the Warlock — Patch 3.1.1".

**It is a Vue application, not React.** Component structure cannot be lifted;
only the visual language and the interaction ideas transfer.

---

## Page structure

```
┌────────────────────────────────────────────────────────────┐
│ [logo] RUNEWIZARD                        ⌄ Help  ⧉ Feedback│
│        for Diablo II Resurrected…  Patch 3.1.1 Update Notes│
├────────────────────────────────────────────────────────────┤
│ ~~~ ornamental gold divider band (image, 301×32) ~~~       │
├──────────────────┬─────────────────────────────────────────┤
│ Runes            │ Search [ Runeword name or item type   ] │
│ ┌──┬──┬──┬──┐    │ ┌─────────┬───────┬───────────┬───────┐ │
│ │El│Eld│Tir│…│   │ │Runeword │ Runes │ Item Types│ Level │ │
│ └──┴──┴──┴──┘    │ ├─────────┼───────┼───────────┼───────┤ │
│ 33 rune icons    │ │ rows…                               │ │
│ in an 11×3 grid  │ └─────────┴───────┴───────────┴───────┘ │
└──────────────────┴─────────────────────────────────────────┘
```

Left column is the rune inventory: you click the runes you own. Runes you do
not own render with class `is-rune off` and appear dimmed in the table. This
is the feature we decided **not** to build.

---

## Table

- 99 rows on the current patch
- Columns: `Runeword` · `Runes` · `Item Types` · `Level`
- **Every column header is sortable** — `cursor-pointer` on all four `th`,
  with a sort arrow icon on the active one. Default sort is Level ascending.
  This is the pattern to copy: header-click sorting, no dropdown.
- `Runes` column is hidden below the `md` breakpoint; on mobile the runes are
  rendered inline under the runeword name instead. Sensible responsive trick.
- Each row has a **pin** control — a diamond glyph (`rw-Table-pin`), sitting
  between the name and the runes. Our completion toggle can take this slot.
- Item types read as a category list with a parenthetical restriction below:
  `Staves (Not Orbs/Wands)`, `Body Armors (Barbarian)`, `Claws (Assassin)`.
  Confirms that bases are **categories with constraints**, not single items.

### Badges next to the runeword name

- Patch of introduction: `1.10`, `1.11`, `2.4`, `2.6`, `3.0` — colour-coded
- `L` marker for ladder-only runewords
- `Note!` marker for special cases (seen on Mosaic)

### Detail popover

Clicking a runeword name opens a centred popover: name, rune icons with
labels, item type, a divider, then the granted properties as a list in
Diablo II's green magic-property colour. Example for Nadir:

```
+50% Enhanced Defense
+10 Defense
+30 Defense vs. Missile
Level 13 Cloak of Shadows (9 Charges)
+2 To Mana After Each Kill
+5 To Strength
-33% Extra Gold From Monsters
-3 To Light Radius
```

---

## Search

Placeholder: `Runeword name or item type`. So it matches **name and item
type**, not runes. Our plan to also match rune names is a genuine improvement
over the reference, not a copy.

---

## Assets and styling

| Thing                        | Detail                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Rune icons                   | One CSS sprite, `runes-sprite-DKLwYvyC.png`, 440×120 px                                                       |
| Sprite layout                | 40×40 per rune, 11 columns × 3 rows = 33 runes                                                                |
| Sprite usage                 | `.rw-RuneImg{opacity:.75}` + `.rune-El{background-position:0 0}`, offsets driven by a `--rune-w` CSS variable |
| Font                         | **Bellefair** (Google Fonts) for the serif display text                                                       |
| Background                   | Pure black `rgb(0,0,0)`                                                                                       |
| Table header                 | Dark red band                                                                                                 |
| Rune text                    | Tan / orange small-caps                                                                                       |
| Properties text              | Green, matching the in-game magic property colour                                                             |
| Custom cursor                | Yes — the stylesheet contains a `cursor: url(…)` rule                                                         |
| Only two `<img>` on the page | the logo and the ornamental divider; everything else is CSS                                                   |

The sprite approach is worth copying: 33 runes as one 12 KB PNG beats 33
requests, and the CSS-variable offset trick keeps the rule list trivial.

---

## Header links, and what they imply for our GitHub setup

| Link           | Target                                               |
| -------------- | ---------------------------------------------------- |
| `Update Notes` | Blizzard patch notes article on news.blizzard.com    |
| `Help`         | in-page dropdown, `href="#"`                         |
| `Feedback`     | **`github.com/fabd/diablo2-runewizard/discussions`** |
| footer         | author's other site, and a link back to the repo     |

So the feedback channel is GitHub Discussions, which has to be enabled in the
repository settings — it is off by default.

---

## Licensing note

The rune sprite is derived from Blizzard artwork, and the reference
repository has its own licence. Both need checking before any asset is
reused. Producing our own sprite from in-game rune icons puts us in the same
position as every other fan tool, which is a decision to make consciously
rather than by accident.
