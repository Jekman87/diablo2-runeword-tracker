import { useEffect, useRef } from "react";

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

  const band = useRef<HTMLDivElement>(null);

  // The band reports how tall it turned out, because two elements need that
  // number and only one of them can know it.
  //
  // The band is sticky at the top of the viewport and the table's header band
  // sticks directly beneath it, at `--progress-band-height`. Nothing in CSS can
  // ask an element how tall its sibling ended up, so that property used to be a
  // constant — and a constant cannot be right: the band is one line of text while
  // progress is partial and up to three once the completion sentence joins it,
  // with the thresholds different in each locale. Too small and the congratulation
  // painted over the panel below; too large and it left 48px of empty page under
  // the line at every width where it fitted. Both were shipped, in that order.
  //
  // So the constant in `src/index.css` is now only what applies before this has
  // run, and a `ResizeObserver` keeps it true afterwards — through a locale
  // switch, a viewport resize, a font that lands late, and any copy written later.
  // A plain effect, not a layout effect. There is nothing to measure before the
  // first paint: the build's prerender pass has no layout at all, and the page it
  // bakes is always the first-visit one, where the band is its usual single line
  // and the stylesheet's own value is already right. The taller band only exists
  // once a reader's progress has been read out of storage, which is after this
  // has run. A layout effect would buy nothing and warn during `renderToString`.
  useEffect(() => {
    const element = band.current;
    if (element === null || typeof ResizeObserver === "undefined") return;

    const publish = () => {
      const { height } = element.getBoundingClientRect();

      // Zero is what a detached or hidden element measures, and publishing it
      // would stick the table header under the top of the viewport.
      if (height > 0) {
        document.documentElement.style.setProperty(
          "--progress-band-height",
          `${height}px`,
        );
      }
    };

    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(element);

    return () => {
      observer.disconnect();
      // Back to the stylesheet's own value, so nothing is left behind pointing at
      // a band that is no longer on the page.
      document.documentElement.style.removeProperty("--progress-band-height");
    };
  }, []);

  const total = runewords.length;
  const count = strings.progress.count(crafted, total);
  const line =
    crafted === total ? `${count} ${strings.progress.complete}` : count;

  return (
    <div ref={band} className="progress-band grid gap-1">
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
