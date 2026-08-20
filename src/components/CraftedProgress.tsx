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
 * **At 99 the line says so in words.** Finishing the Chronicle's list is the
 * thing this page exists to be used for, and until now it changed a percentage
 * to 100 and nothing else. The sentence follows the counts on the same line
 * rather than arriving as a banner of its own: the line is where a player has
 * been watching the number, so it is where the number landing is answered, and
 * a surface that exists in exactly one state of the page is a surface that will
 * be wrong the first time the state is reached by an import.
 *
 * `aria-valuetext` stays the counts alone. A progress indicator's value is a
 * value; a reader who depends on it being one should not have to hear a
 * congratulation every time focus passes the bar.
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
  const line =
    crafted === total ? `${count} ${strings.progress.complete}` : count;

  return (
    // `data-complete` is the whole of what this component says about layout, and
    // it says it as state rather than as a height. The band's reserved height and
    // the offset the table header sticks at are one number in `src/index.css`;
    // this marks the case where that number has to be the taller one, and the
    // stylesheet does the rest. Without it the congratulation wrapped to three
    // lines at 390px inside a 56px band and painted over the panel below.
    <div
      className="progress-band grid gap-1"
      {...(crafted === total ? { "data-complete": "" } : {})}
    >
      <progress
        className="crafted-progress w-full"
        value={crafted}
        max={total}
        aria-label={strings.progress.label}
        aria-valuetext={count}
      />

      <p className="text-gold-mid">{line}</p>
    </div>
  );
}
