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
 * The socket a runeword is marked crafted in: empty, or filled.
 *
 * A `<button aria-pressed>` and not a checkbox. `IDEAS.md` settles that it is a
 * button so Tab and Space work, and the platform affordance being given up is
 * smaller than it looks — a checkbox would need `appearance: none` and a rebuilt
 * box to read as a socket anyway, at which point what remains of the native
 * control is the role.
 *
 * The state is carried by three things and only one of them is colour:
 * `aria-pressed` for assistive technology, the accessible name for what the next
 * press will do, and the socket rendering filled rather than hollow for a reader
 * who cannot separate the greens.
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
      className={socket({ crafted })}
    />
  );
}

/**
 * The two states, as a `cva` variant rather than a conditional string, per the
 * styling rules.
 *
 * Round, because a socket is. The hollow-to-filled change is the part that
 * survives colour being taken away; the border shifting from muted to the
 * crafted accent is the part that reads at a glance.
 */
const socket = cva(
  "size-5 shrink-0 cursor-pointer rounded-full border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light",
  {
    variants: {
      crafted: {
        true: "border-crafted bg-crafted",
        false: "border-muted bg-ground hover:border-gold",
      },
    },
  },
);
