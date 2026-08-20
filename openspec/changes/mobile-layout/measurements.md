# Measurements

Taken with [`probe.mjs`](probe.mjs) beside this file — copy it next to
`.claude/skills/run-app/scripts/cdp-driver.mjs` in a scratchpad and run it
against `pnpm dev`. `vw` is `documentElement.clientWidth`, so the wide rows read
15px under the emulated width: that is the scrollbar gutter `html` reserves.

`columns` is the five declared column widths in order — crafted, name, runes,
base items, required level. A `0` is a column the stylesheet has withdrawn.

## Before

| locale | vw   | docW | overflow | docH   | tableW | columns                | row (median / max) |
| ------ | ---- | ---- | -------- | ------ | ------ | ---------------------- | ------------------ |
| en     | 320  | 620  | **+300** | 13 442 | 596    | 84, 276, 0, 98, 135    | 127 / 143          |
| en     | 360  | 621  | **+261** | 13 442 | 596    | 84, 276, 0, 98, 135    | 127 / 143          |
| en     | 390  | 620  | **+230** | 13 406 | 596    | 84, 276, 0, 98, 135    | 127 / 143          |
| en     | 414  | 620  | **+206** | 13 406 | 596    | 84, 276, 0, 98, 135    | 127 / 143          |
| en     | 625  | 625  | 0        | 13 406 | 596    | 84, 276, 0, 98, 135    | 127 / 143          |
| en     | 753  | 753  | 0        | 8 366  | 705    | 63, 141, 204, 169, 127 | 75 / 115           |
| en     | 1265 | 1265 | 0        | 8 106  | 1104   | 99, 220, 320, 264, 198 | 75 / 75            |
| ru     | 320  | 701  | **+381** | 13 478 | 677    | 94, 276, 0, 125, 180   | 127 / 127          |
| ru     | 360  | 701  | **+341** | 13 450 | 677    | 94, 276, 0, 125, 180   | 127 / 127          |
| ru     | 390  | 701  | **+311** | 13 426 | 677    | 94, 276, 0, 125, 180   | 127 / 127          |
| ru     | 414  | 701  | **+287** | 13 426 | 677    | 94, 276, 0, 125, 180   | 127 / 127          |
| ru     | 625  | 701  | **+76**  | 13 390 | 677    | 94, 276, 0, 125, 180   | 127 / 127          |
| ru     | 753  | 753  | 0        | 8 653  | 705    | 63, 141, 204, 169, 127 | 75 / 115           |
| ru     | 1265 | 1265 | 0        | 8 106  | 1104   | 99, 220, 320, 264, 198 | 75 / 75            |

Two things the English figures alone would have hidden.

**Russian is the harder case, and by 81px.** Its table bottoms out at 677px
rather than 596px, because `Создано`, `Предметные базы` and `Требуемый уровень`
are all longer than their English headings. It is the locale the budget has to be
checked against.

**Russian still overflows at 625px**, one step below the breakpoint, where
English has already fitted. So the defect was never only a phone defect: a
desktop window at 640px scrolls sideways in Russian today.

The 753 and 1265 rows are the desktop numbers. They are identical between the two
locales in every column, and they are what the change must leave untouched.

## After

<!-- Filled in by task 7. -->
