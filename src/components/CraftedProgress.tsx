import { runewords } from "@/data";
import { useStrings } from "@/i18n";

export interface CraftedProgressProps {
  /** How many runewords are marked. The total is not passed in — see below. */
  crafted: number;
}

/**
 * Overall progress: crafted runewords out of every runeword there is.
 *
 * A native `<progress>`, which carries the `progressbar` role, its value and its
 * maximum without any of the three being restated in ARIA — the same trade
 * `runeword-table` made in choosing `<dialog>` over a hand-rolled overlay. The
 * cost is three engine-prefixed rules in `src/index.css`; the alternative is a
 * `div` with four `aria-*` attributes to keep in step by hand.
 *
 * The count is stated in text beside it, because a bar alone does not say 37.
 * The same sentence is the bar's `aria-valuetext`, so it is announced as
 * "37 of 99 crafted" rather than as a percentage.
 *
 * **The denominator is read from the dataset here, and is deliberately not a
 * prop.** `IDEAS.md` settles that progress is always out of all 99 — no toggle,
 * no shifting denominator — and every change still to come gives the *visible*
 * row count a new reason to differ from it: a filter, a search, a slot
 * selection, a ladder season. Reading `runewords.length` directly is what makes
 * it impossible for one of them to move the denominator by accident. A literal
 * `99` would be the other way to get it wrong, going stale on the patch that
 * adds a runeword.
 */
export function CraftedProgress({ crafted }: CraftedProgressProps) {
  const strings = useStrings();

  const total = runewords.length;
  const count = strings.progress.count(crafted, total);

  return (
    <div className="progress-band grid gap-1">
      <progress
        className="crafted-progress w-full"
        value={crafted}
        max={total}
        aria-label={strings.progress.label}
        aria-valuetext={count}
      />

      <p className="text-gold-mid">{count}</p>
    </div>
  );
}
