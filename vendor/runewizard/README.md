# Vendored from fabd/diablo2-runewizard

These files are copied verbatim from
<https://github.com/fabd/diablo2-runewizard> (branch `main`), by Fabrice Denis,
and are used under the MIT licence. The full licence text sits next to them in
[`LICENSE`](LICENSE) and must stay there.

Copied on 2026-07-28. Sizes verified against the GitHub API.

| File | Size | Contents |
| --- | --- | --- |
| `data/runewords.ts` | 13 975 | 99 runewords: name, runes, level, item types, badge fields |
| `data/runewords-descriptions.ts` | 31 418 | granted properties for all 99 |
| `data/item-types.ts` | 1 173 | 19 base categories with wiki links |
| `data/runes.ts` | 1 126 | the 33 runes with a tier field |
| `assets/runes-sprite.png` | 98 434 | all 33 rune icons, 40×40 each, 11×3 grid |
| `assets/runes.css` | 2 605 | sprite offset rules |

## Do not edit these files

They are a reference snapshot. Our own data lives elsewhere and is derived from
these; keeping the originals pristine is what makes it possible to re-derive or
diff against upstream later.

The rune artwork derives from Blizzard Entertainment's game assets. The MIT
licence covers Fabrice Denis's work, not Blizzard's underlying material.
