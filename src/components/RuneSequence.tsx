import clsx from "clsx";

import { RuneIcon } from "@/components/RuneIcon";
import type { Runeword } from "@/data";
import { useLocale } from "@/i18n";
import { displayRune } from "@/runewords/display";

export interface RuneSequenceProps {
  runeword: Runeword;
  /**
   * How the sequence is drawn: the sprite with each rune's name beneath it, or
   * the names alone.
   *
   * The names form exists for the narrow viewport, where six 40px icons take
   * more width than the whole table has. It is a prop rather than a media query
   * inside this component because the row renders both forms and lets the
   * stylesheet choose — see the note in `RunewordRow`.
   */
  form?: "icons" | "names";
  className?: string;
}

/**
 * A runeword's runes in dataset order — `Infinity` is `Ber`, `Mal`, `Ber`, `Ist`,
 * with `Ber` appearing twice.
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
 * **That is also why the narrow viewport can drop the icons entirely.** The names
 * already carry the recipe and are already the announced text — the icons are
 * `decorative`, so nothing leaves the accessibility tree with them. Measured at a
 * 390px viewport: the name column falls from 276px to 126px and a row from 127px
 * to 65px, which is the difference between a table that fits a phone and one that
 * does not. The reference site reaches its 51px rows the same way.
 *
 * **No `--rune-size` is set here.** The theme's default is the sprite's native
 * 40×40 cell, which is both what makes the artwork sharp and the ceiling above
 * which it cannot be drawn without upscaling — so the right thing for a use site
 * that wants it at its best is to ask for nothing and inherit the one value
 * `src/index.css` declares. Restating `2.5rem` in two components would put the
 * theme's default in three places and invite exactly the drift the single value
 * exists to prevent. Drawing the icons *smaller* for the phone was the other
 * candidate and buys a third of what dropping them buys, at the cost of showing
 * the artwork at 60 % of the size it was drawn for.
 *
 * The key carries the index because the sequence is not a set. Five runewords
 * repeat a rune, so a name alone would collide.
 */
export function RuneSequence({
  runeword,
  form = "icons",
  className,
}: RuneSequenceProps) {
  const locale = useLocale();

  return (
    <span className={clsx("gap-1", className)}>
      {runeword.runes.map((rune, index) =>
        form === "names" ? (
          // The name is the whole of this form, so it is the element the key
          // goes on. A wrapper around it would be a span whose only job is to
          // hold a key, and it would put a second span in the row for every
          // rune the table draws.
          <RuneName key={`${rune}-${index}`}>
            {displayRune(rune, locale)}
          </RuneName>
        ) : (
          <span
            key={`${rune}-${index}`}
            // A 2px gap under a 40px icon and a 16px line-box for the 12px label:
            // 58px of content, 75px of row once the cell's padding and the
            // separator are counted. Recorded because the table's height is the
            // price this change pays and it should be traceable to a value.
            className="grid justify-items-center gap-0.5"
          >
            <RuneIcon name={rune} decorative />
            <RuneName>{displayRune(rune, locale)}</RuneName>
          </span>
        ),
      )}
    </span>
  );
}

/**
 * One rune's name, styled once for both forms.
 *
 * Shared rather than restated so the two forms cannot drift into two typographic
 * treatments of the same word — the names form is the icon form with the sprite
 * taken away, and it should read as the same thing.
 */
function RuneName({ children }: { children: React.ReactNode }) {
  return <span className="text-xs leading-4 text-gold-mid">{children}</span>;
}
