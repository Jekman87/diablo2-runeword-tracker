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

| locale | vw   | docW | overflow | docH   | tableW | columns                | row (median / max) |
| ------ | ---- | ---- | -------- | ------ | ------ | ---------------------- | ------------------ |
| en     | 320  | 320  | **0**    | 10 196 | 281    | 2, 126, 0, 98, 52      | 85 / 155           |
| en     | 360  | 360  | **0**    | 9 868  | 312    | 2, 133, 0, 123, 52     | 85 / 155           |
| en     | 390  | 390  | **0**    | 9 700  | 342    | 2, 140, 0, 146, 52     | 85 / 135           |
| en     | 414  | 414  | **0**    | 9 660  | 366    | 2, 145, 0, 165, 52     | 85 / 135           |
| en     | 625  | 625  | 0        | 9 208  | 577    | 2, 193, 0, 327, 53     | 85 / 85            |
| en     | 753  | 753  | 0        | 8 366  | 705    | 63, 141, 204, 169, 127 | 75 / 115           |
| en     | 1265 | 1265 | 0        | 8 106  | 1104   | 99, 220, 320, 264, 198 | 75 / 75            |
| ru     | 320  | 320  | **0**    | 10 328 | 292    | 2, 141, 0, 109, 38     | 85 / 155           |
| ru     | 360  | 360  | **0**    | 10 128 | 312    | 2, 144, 0, 126, 38     | 85 / 155           |
| ru     | 390  | 390  | **0**    | 9 884  | 342    | 2, 150, 0, 150, 38     | 85 / 135           |
| ru     | 414  | 414  | **0**    | 9 784  | 366    | 2, 154, 0, 170, 38     | 85 / 135           |
| ru     | 625  | 625  | **0**    | 9 240  | 577    | 2, 194, 0, 341, 38     | 85 / 85            |
| ru     | 753  | 753  | 0        | 8 653  | 705    | 63, 141, 204, 169, 127 | 75 / 115           |
| ru     | 1265 | 1265 | 0        | 8 106  | 1104   | 99, 220, 320, 264, 198 | 75 / 75            |

**The budget holds at every supported width in both locales**, and at 320px too,
which is below the width this change promises. The crafted column measures 2px
rather than 0 — the cell keeps its place in the column count and its content is
out of flow, and 2px is what the header band's own corner radius leaves behind. It
is not worth chasing.

**The desktop rows are identical to the baseline** — every column width, both row
heights and both document heights at 753 and 1265, in both locales. That is the
non-regression check, and it is a comparison of numbers rather than a reading of
the diff, because a rule written without its breakpoint guard looks correct.

Checked separately, and not in the table because it has no widths worth listing:
at 390px and at 320px, in both locales, the document still does not scroll
sideways with the remaining panel open, with the help panel open, and with a
search query that matches nothing.

## What each step bought

Applied one at a time to the live page, English, at a 390px viewport:

| after                          | docW       | docH   | median row |
| ------------------------------ | ---------- | ------ | ---------- |
| nothing                        | 620        | 13 406 | 127        |
| the runes as names             | 470        | 9 996  | 85         |
| the crafted column withdrawn   | 388        | 10 180 | 85         |
| the short heading and no arrow | 390 → fits | 9 700  | 85         |

The runes are the whole of the height saving and the largest part of the width
saving. The other two steps are what close the last 80px, and Russian needed all
three: it was still 84px over after the first two.

## The stylesheet

The built CSS gained exactly the classes the change renders, and nothing from the
prose in the new comments:

```
added  : [&>button]:hidden crafted-toggle md:[&>button]:flex md:block md:p-2
         md:rounded-tl-none w-0
removed: (none)
```

20 383 B → 20 843 B. The check matters here because the scanner reads comments as
class candidates — `src/index.css` records what a single word in a sentence has
cost before.
