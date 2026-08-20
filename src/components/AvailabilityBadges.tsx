import { useState } from "react";

import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import type { Runeword } from "@/data";
import { useLocale, useStrings } from "@/i18n";
import { displayRuneword } from "@/runewords/display";
import { patchColour } from "@/runewords/patch-colour";

export interface AvailabilityBadgesProps {
  runeword: Runeword;
}

/**
 * The markers beside a runeword's name: the patch that introduced it, and a note
 * marker where a caveat exists.
 *
 * There used to be a third — a ladder-only marker. Patch 3.3 released the last
 * eight ladder-only runewords into Non-Ladder, and the restriction that outlived
 * it belongs to Lord of Destruction rather than to the mode this tracker
 * mirrors, so the field is gone from the dataset and the badge with it. A badge
 * no record can trigger is not a feature waiting for data; it is a promise the
 * legend has to keep explaining.
 *
 * Both remaining fields are decoration by requirement — availability changes
 * between ladder seasons, so a stale badge is a cosmetic inaccuracy where stale
 * logic would miscount progress. Nothing in the application may order, count or
 * branch on them, and this component is the first thing in the project that
 * *could* have. They are read here and in the detail view, which restates the
 * same facts in full words, and nowhere else.
 *
 * A runeword carrying neither renders nothing at all — no placeholder and no
 * empty slot, so the name of a runeword with no markers sits where the name of
 * one with both does.
 *
 * Nothing here is hover-only for the *fact*. Each badge draws a short marker,
 * carries its full meaning as its accessible name, and shows that meaning in a
 * Floating UI tooltip styled like the detail panel — replacing the browser's
 * native `title`, which was the one surface on the page that still looked like
 * the OS rather than the game. The detail view restates both in full words,
 * which is the path a touch user with no screen reader takes.
 */
export function AvailabilityBadges({ runeword }: AvailabilityBadgesProps) {
  const strings = useStrings();
  const projected = displayRuneword(runeword, useLocale());

  return (
    <>
      {runeword.patch ? (
        <Badge
          kind="patch"
          // The one badge whose colour is not fixed by its kind. Which era it
          // came from is the thing worth reading at a glance, and the mapping
          // that decides it is `patch-colour.ts` rather than a variant here,
          // because the dataset types this field as an open string.
          colour={patchColour(runeword.patch)}
          marker={runeword.patch}
          meaning={strings.availability.patchMeaning(runeword.patch)}
        />
      ) : null}

      {projected.note ? (
        <Badge
          kind="note"
          marker={strings.availability.noteMarker}
          // The note itself, not a sentence about there being one. It is
          // dataset text rather than copy, so it comes from the locale
          // projection rather than the strings layer — the same rule that makes
          // a rune icon's label the rune's own projected name.
          meaning={projected.note}
        />
      ) : null}
    </>
  );
}

export interface BadgeProps {
  kind: "patch" | "note";
  /** What the badge draws — short enough to sit beside a name. */
  marker: string;
  /** What it means, in full. The accessible name and the pointer tooltip. */
  meaning: string;
  /**
   * A background class the kind does not fix, for the patch badge alone. Empty
   * where the patch has no colour decided, which leaves the badge plain.
   */
  colour?: string;
  /**
   * When true, the badge is a visual sample beside words that already say what
   * it means — as in the help legend. It is hidden from assistive technology
   * rather than announcing the meaning a second time, and it draws no tooltip:
   * the sentence beside it is the meaning. In a table row the opposite is true:
   * nothing beside the badge says what it is, so the meaning is its accessible
   * name and its hover tip.
   */
  decorative?: boolean;
}

/**
 * `role="img"` with `aria-label` rather than a bare `<span>`: it is what makes
 * the full meaning the element's accessible name instead of the letter drawn
 * inside it, and it stops a screen reader announcing `L` on its own.
 *
 * The accessible name and the tooltip are unchanged by the colour-coding, which
 * is the point of it being colour-coding: the era is an additional channel laid
 * over a meaning that is already stated in words, so it is never the only way to
 * read the badge. A reader who cannot distinguish `#513B2C` from `#7B3FE4` — or
 * cannot see either — loses nothing, and the detail view restates all three
 * fields in full sentences besides.
 *
 * Exported so the help legend can render the same shape the table does, rather
 * than a copy that can drift. A `decorative` sample there is `aria-hidden`
 * because the sentence beside it already carries the meaning.
 */
export function Badge({
  kind,
  marker,
  meaning,
  colour,
  decorative = false,
}: BadgeProps) {
  if (decorative) {
    return (
      <span aria-hidden className={twMerge(badge({ kind }), colour)}>
        {marker}
      </span>
    );
  }

  return (
    <BadgeWithTooltip
      kind={kind}
      marker={marker}
      meaning={meaning}
      colour={colour}
    />
  );
}

/**
 * The table-row badge: marker plus a hover tip in the detail panel's own
 * surface, not the browser's `title` chrome.
 *
 * One floating context per badge rather than one shared tip for the table —
 * the same trade `RunewordDetails` made for the name. A badge tip is a sentence
 * at most, so the per-instance cost is small against 99 rows that already each
 * run a floating context for the detail panel.
 */
function BadgeWithTooltip({
  kind,
  marker,
  meaning,
  colour,
}: Omit<BadgeProps, "decorative">) {
  const [open, setOpen] = useState(false);

  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    strategy: "fixed",
    middleware: [
      offset(GAP),
      flip({ padding: EDGE }),
      shift({ padding: EDGE }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const interactions = useInteractions([
    useHover(context, {
      // Same delay as the detail panel: a pointer crossing the badges on the
      // way to a name should not flash three tips.
      delay: { open: OPEN_DELAY },
      mouseOnly: true,
    }),
    useRole(context, { role: "tooltip" }),
  ]);

  return (
    <>
      <span
        ref={setReference}
        className={twMerge(badge({ kind }), colour)}
        role="img"
        aria-label={meaning}
        {...interactions.getReferenceProps()}
      >
        {marker}
      </span>

      {open ? (
        <FloatingPortal>
          <div
            ref={setFloating}
            {...interactions.getFloatingProps()}
            style={floatingStyles}
            className={TOOLTIP}
          >
            {meaning}
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
}

// `cva` rather than a conditional class string, per the code rules — three
// variants of one shape is exactly what it is for. Not extended to the patch
// colours: those are keyed by a dataset value rather than by a kind, and the
// dataset types that value as an open string, so they live in
// `patch-colour.ts` and arrive as a class this merges over the variant.
//
// Geometry from the reference, which an audit found we differed from in six
// ways. Patch and note take `2px 4px` on a 4px radius, and both are 12px, which
// they already were. The round `1px 5px` ladder marker left with the badge
// itself, and with it the one length written outside Tailwind's scale.
//
// Every colour is a theme token. The patch badge's own `bg-patch` is gone,
// replaced by the four era tokens; `Note!` stops borrowing `--color-danger` for
// a red the reference does not use, and takes `--color-note`, which is the one
// badge that change made *more* legible — 4.44:1 today against 10.3:1 for
// white on the darker red.
const badge = cva("inline-block align-middle text-xs leading-normal", {
  variants: {
    kind: {
      patch: "rounded px-1 py-0.5 text-patch-label",
      note: "rounded px-1 py-0.5 bg-note text-note-label",
    },
  },
});

// The detail panel's surface at a tip's size: same ground, edge and text, so a
// badge tip and a property panel read as one family rather than two chrome
// systems. Above the sticky bands (1–2) and level with the detail panel (10).
const TOOLTIP =
  "z-10 max-w-xs rounded-xs border border-panel-edge bg-panel px-2 py-1 text-sm text-panel-text";

const GAP = 6;
const EDGE = 8;
const OPEN_DELAY = 250;
