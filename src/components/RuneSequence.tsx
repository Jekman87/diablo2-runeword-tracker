import clsx from "clsx";

import { RuneIcon } from "@/components/RuneIcon";
import type { Runeword } from "@/data";
import { useLocale } from "@/i18n";
import { displayRune } from "@/runewords/display";

export interface RuneSequenceProps {
  runeword: Runeword;
  className?: string;
}

/**
 * A runeword's runes in dataset order, each icon with its name directly beneath
 * it — `Infinity` is four icons reading `Ber`, `Mal`, `Ber`, `Ist`, with `Ber`
 * drawn twice.
 *
 * Lifted out of `RunewordRow` once it stopped being a row of icons. The row and
 * the detail view now draw the sequence identically and from here, which is what
 * makes "one sprite, one derivation" true of the whole application rather than
 * of one component: there is no second place that decides how a rune is
 * presented.
 *
 * **The names are the point.** A row of unlabelled 24px sprites tells a reader
 * who does not already know the runes by silhouette nothing at all, and the
 * recipe is the one thing the column exists to carry. The label is the rune's
 * projected name — `Бер` under the Russian locale, `Ber` under English — read
 * from the dataset's own locale projection rather than from the strings layer,
 * which is the same rule that makes a rune icon's accessible label the rune's
 * own name. The canonical name stays the sprite key beside it.
 *
 * **No `--rune-size` is set here.** The theme's default is the sprite's native
 * 40×40 cell, which is both what makes the artwork sharp and the ceiling above
 * which it cannot be drawn without upscaling — so the right thing for a use site
 * that wants it at its best is to ask for nothing and inherit the one value
 * `src/index.css` declares. Restating `2.5rem` in two components would put the
 * theme's default in three places and invite exactly the drift the single value
 * exists to prevent.
 *
 * The key carries the index because the sequence is not a set. Five runewords
 * repeat a rune, so a name alone would collide.
 */
export function RuneSequence({ runeword, className }: RuneSequenceProps) {
  const locale = useLocale();

  return (
    <span className={clsx("gap-1", className)}>
      {runeword.runes.map((rune, index) => (
        <span
          key={`${rune}-${index}`}
          // A 2px gap under a 40px icon and a 16px line-box for the 12px label:
          // 58px of content, 75px of row once the cell's padding and the
          // separator are counted. Recorded because the table's height is the
          // price this change pays and it should be traceable to a value.
          className="grid justify-items-center gap-0.5"
        >
          <RuneIcon name={rune} decorative />
          <span className="text-xs leading-4 text-gold-mid">
            {displayRune(rune, locale)}
          </span>
        </span>
      ))}
    </span>
  );
}
