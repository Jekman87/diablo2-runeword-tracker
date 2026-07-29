import { cva } from "class-variance-authority";

import { useStrings } from "@/i18n";

export interface CraftedToggleProps {
  /** The runeword's canonical name — an identifier, not display copy. */
  name: string;
  crafted: boolean;
  onToggle: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * The box a runeword is marked crafted in: empty, or carrying a check.
 *
 * A `<button aria-pressed>` and not a checkbox. `IDEAS.md` settles that it is a
 * button so Tab and Space work, and the platform affordance being given up is
 * smaller than it looks — a checkbox would need `appearance: none` and a rebuilt
 * box to read as this one anyway, at which point what remains of the native
 * control is the role.
 *
 * **Square with a check rather than a round socket, which reverses an earlier
 * decision.** `IDEAS.md` called for a socket, filled or hollow, and the in-game
 * Chronicle this page tracks draws neither — its own controls are square and its
 * progress fills pale gold. A round green pip was the one element on the page that
 * looked like it came from a different application. `crafted-tracking`'s
 * requirement still holds in substance and is worded around a socket, so it is owed
 * a delta: the shape changed, the guarantee did not.
 *
 * The state is carried by three things and only one of them is colour:
 * `aria-pressed` for assistive technology, the accessible name for what the next
 * press will do, and the check being present rather than absent for a reader who
 * cannot separate the box's two border colours. That is the same guarantee the
 * filled socket gave, by a different mark.
 *
 * The button draws no text, so its accessible name is the only thing that says
 * which row it belongs to — and a screen reader can reach it out of the context
 * of that row.
 */
export function CraftedToggle({
  name,
  crafted,
  onToggle,
  ref,
}: CraftedToggleProps) {
  const strings = useStrings();

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={crafted}
      aria-label={
        crafted ? strings.crafted.unmark(name) : strings.crafted.mark(name)
      }
      onClick={onToggle}
      className={box({ crafted })}
    >
      {/* Only when marked, so "empty or checked" is a difference in what is drawn
          and not only in what colour it is drawn in. `currentColor` rather than a
          fill of its own, so the mark takes the box's own token and no colour
          value lands in this file. */}
      {crafted ? (
        <svg viewBox="0 0 12 12" aria-hidden="true" className="size-full">
          <path
            d="M2.5 6.4 4.9 8.8 9.5 3.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

/**
 * The two states, as a `cva` variant rather than a conditional string, per the
 * styling rules.
 *
 * Square, with the same 2px corner the search field and the filter chips take, so
 * the control belongs to the same interface as the rest of them. The
 * check-or-nothing change is the part that survives colour being taken away; the
 * border shifting from muted to the crafted accent is the part that reads at a
 * glance.
 *
 * `text-crafted` rather than `bg-crafted`: the accent is the mark now, not the
 * fill. A filled gold square with a gold check inside it would hide the mark it
 * was supposed to carry.
 */
const box = cva(
  "grid size-5 shrink-0 cursor-pointer place-items-center rounded-xs border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light",
  {
    variants: {
      crafted: {
        true: "border-crafted bg-ground text-crafted",
        false: "border-muted bg-ground hover:border-gold",
      },
    },
  },
);
