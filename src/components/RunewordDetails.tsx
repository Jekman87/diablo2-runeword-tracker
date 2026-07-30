import { useId, useState } from "react";

import {
  FloatingFocusManager,
  FloatingPortal,
  type OpenChangeReason,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import { RunewordDialog } from "@/components/RunewordDialog";
import type { Runeword } from "@/data";
import { useLocale } from "@/i18n";
import { displayRuneword } from "@/runewords/display";

export interface RunewordDetailsProps {
  runeword: Runeword;
  /** Whether this row's panel is the open one. Owned by the table. */
  open: boolean;
  /**
   * Asks the table to open this runeword's panel or to close whatever is open.
   * Takes the name because one value serves all 99 rows, which is what makes
   * opening one panel close the others, and the reason because the table has to
   * tell a reader arriving from a closing panel's focus handing itself back.
   */
  onOpenChange: (
    name: string,
    open: boolean,
    reason: OpenChangeReason | undefined,
  ) => void;
}

/**
 * A runeword's name, and the detail panel it opens.
 *
 * **One component for both, because they share one floating context.**
 * `useHover` binds to a single reference element by design — there is no version
 * of it that watches 99 buttons and reports which one the pointer is over — so
 * each row owns its own `useFloating` and its own interaction hooks rather than
 * the table sharing one. The alternative, a single instance at table level driven
 * by a virtual reference with hover tracked by hand across 99 names, is precisely
 * the interaction logic `@floating-ui/react` was added to avoid, and it would
 * have to reimplement `safePolygon` on top.
 *
 * **Which panel is open is the table's, though, and has to be.** "Only one at a
 * time" is a statement about the whole set, and 99 independent open flags cannot
 * make it true — each one only knows about itself. Left that way it very nearly
 * worked by accident: hovering a second name closed the first because
 * `safePolygon` gave up when the pointer left, and pressing a second name closed
 * the first because `useDismiss` saw the press land outside. What neither covers
 * is a panel pinned open by a click and then a *hover* somewhere else: no press,
 * and `safePolygon` has nothing to say about a panel the pointer already left. Two
 * panels overlapped. So the open flag is one value at table level, and opening any
 * panel closes whatever else was open by construction rather than by luck.
 *
 * The cost of that is real and worth naming: 99 rows each running `useFloating`
 * and five interaction hooks is per-render work the single shared `<dialog>` did
 * not have. What it is *not* is markup — only the open panel is ever rendered, so
 * the guarantee that the document holds no per-row detail markup survives
 * untouched.
 *
 * **Three triggers, one panel.** Hover for a pointer, focus for the keyboard,
 * click for a tap. None of the three can be the only way in: a touch device has
 * no hover, and a keyboard has neither hover nor tap.
 *
 * **The focus trap is conditional on how it opened**, which is the one place an
 * existing requirement had to be read for its intent rather than its letter. It
 * says focus stays within the view while it is open, and it was written when the
 * only way to open the view was to activate a button on purpose. Applied to a
 * panel that appears under a passing pointer it would seize the keyboard as the
 * pointer swept 99 rows, which is not what it was protecting. So: a panel you
 * opened on purpose traps focus and gives it back; a panel that appeared under
 * your pointer never touches it.
 */
export function RunewordDetails({
  runeword,
  open,
  onOpenChange,
}: RunewordDetailsProps) {
  const titleId = useId();
  // The visible name is projected; every callback below still reports the
  // canonical `runeword.name`, because the table keys the open panel by it and
  // the row keys crafted progress by it.
  const label = displayRuneword(runeword, useLocale()).name;

  // Which kind of trigger opened it, tracked beside the open flag because
  // `onOpenChange` reports the causing event and that is the only moment the
  // distinction exists. Deliberately not reset on close: the focus manager reads
  // it while unmounting to decide whether to return focus, so clearing it on the
  // way out would silently cost a keyboard reader their place in the table.
  const [openedBy, setOpenedBy] = useState<Trigger>("hover");

  // `setReference` and `setFloating` are callback refs — the two elements are
  // handed to the library rather than read from it — so they are pulled out
  // here and the `refs` container never appears in the markup.
  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange(nextOpen, _event, reason) {
      onOpenChange(runeword.name, nextOpen, reason);

      // Activating a panel the pointer or the keyboard already opened promotes
      // it, which is right: the reader has now asked to be there.
      if (nextOpen) setOpenedBy(triggerFor(reason));
    },
    placement: "bottom-start",
    // Fixed rather than absolute. The panel is portalled to the end of the
    // document and the page it floats over is 7400px of scrolling table, so
    // viewport coordinates are the ones `flip` and `shift` need to reason in.
    strategy: "fixed",
    middleware: [
      offset(GAP),
      // The two that earn the dependency. A panel of up to 24 property lines
      // has to flip above the name for rows near the bottom of the table, and
      // shift inward at the edges — on both axes, because a tall panel
      // overflows the viewport vertically as readily as a wide one does
      // horizontally.
      flip({ padding: EDGE }),
      shift({ padding: EDGE, crossAxis: true }),
    ],
    // Keeps it positioned while the page scrolls under it.
    whileElementsMounted: autoUpdate,
  });

  const interactions = useInteractions([
    useHover(context, {
      // After a delay, so a pointer crossing the table on its way somewhere
      // else does not open a panel for every name it passes.
      delay: { open: OPEN_DELAY },
      // The hard part, and the reason a library is here at all: the panel stays
      // open while the pointer travels the gap from the name toward it, instead
      // of closing the instant it leaves the name.
      handleClose: safePolygon(),
      // Mouse and nothing else. A tap fires `pointerenter` too, and letting it
      // open the panel by "hover" would leave a tapped panel with no focus trap
      // and no way to reason about how it opened. Touch goes through the click
      // path, where it is a deliberate act.
      mouseOnly: true,
    }),
    // Left on unconditionally. `useFocus` cannot tell a reader tabbing to this
    // name from a replaced panel handing focus back to it on the way out, and
    // that second case would reopen the panel the reader just replaced. Telling
    // the two apart needs to happen where both requests are visible in order,
    // which is the table — see `farewellFrom` there.
    useFocus(context),
    useClick(context),
    useDismiss(context),
    useRole(context, { role: "dialog" }),
  ]);

  return (
    <>
      <button
        ref={setReference}
        type="button"
        className="cursor-pointer text-gold-mid hover:text-gold-light"
        {...interactions.getReferenceProps()}
      >
        {label}
      </button>

      {/* Rendered only while open, so 99 rows put no detail markup in the
          document — 969 property lines for a page whose entire content is 99
          rows. Portalled out of the `<td>` it belongs to, because a positioned
          panel inside a table cell is at the mercy of the table's own layout. */}
      {open ? (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            // Three triggers, three focus behaviours, and the middle one is the
            // one that had to be learned by using it.
            //
            // **Activated** — clicked or tapped: a trap, because the reader
            // asked to be here and should not be dropped back into the table
            // behind by a stray Tab.
            //
            // **Focused** — reached by Tab: no trap, and no focus moved. A trap
            // here reads as reasonable and is a dead end: Tab lands on the name,
            // the panel opens, the trap swallows the keyboard, and every
            // subsequent Tab cycles inside a panel whose only focusable element
            // is its close button. Escape gives focus back to the name, and the
            // next Tab walks straight into it again — so row 2 of 99 is
            // unreachable by keyboard. Non-modal keeps Tab flowing: name, into
            // the panel, out to the next row.
            //
            // **Hovered** — no focus management at all. `disabled` rather than
            // `modal={false}` because a non-modal manager still moves focus into
            // the panel on open, and a panel that appeared under a passing
            // pointer must not touch the keyboard.
            modal={openedBy === "activated"}
            disabled={openedBy === "hover"}
            // Only meaningful for the two that manage focus, and only the
            // activated one ever moved it — but stated rather than left to a
            // default, because a focus-opened panel silently pulling focus is
            // exactly the failure above.
            initialFocus={openedBy === "activated" ? 0 : -1}
          >
            <div
              ref={setFloating}
              {...interactions.getFloatingProps()}
              style={floatingStyles}
              aria-labelledby={titleId}
              className={PANEL}
            >
              <RunewordDialog runeword={runeword} titleId={titleId} />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}

/**
 * How the open panel came to be open, which is what its focus behaviour turns on.
 *
 * Three values rather than the two the design expected. "Deliberate or not" put
 * keyboard focus on the same side as a click, and a trap on a focus-opened panel
 * makes a 99-row table impossible to tab through — so reaching a name by Tab is
 * its own case, sitting between the two.
 */
type Trigger = "hover" | "focused" | "activated";

/**
 * Which of the three a floating-ui open reason belongs to.
 *
 * Everything that is not hover and not focus is an activation: `click` covers a
 * mouse press, a tap and Space or Enter on the name alike, and the remaining
 * reasons cannot open this panel at all.
 */
function triggerFor(reason: OpenChangeReason | undefined): Trigger {
  if (reason === "hover") return "hover";
  if (reason === "focus") return "focused";

  return "activated";
}

// The gap between the name and the panel, and the margin the panel keeps from
// the viewport edge. The gap is what `safePolygon` covers.
const GAP = 8;
const EDGE = 8;

// Long enough that a pointer crossing the table opens nothing, short enough that
// resting on a name does not feel unresponsive. One of the two dials — the other
// is `safePolygon`'s buffer — and which values are right is a question only using
// it in a browser can answer.
const OPEN_DELAY = 250;

// The height cap and the scroll are load-bearing rather than defensive.
// `Fortitude` has 24 property lines plus two group sub-headings — visually as
// tall as ever — and unbounded the panel grows taller than the viewport. `flip`
// and `shift` place it as well as it can be placed; past that the content has
// to scroll inside it, and this is what makes it able to.
const PANEL =
  "z-10 max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto border border-panel-edge bg-panel p-4 text-panel-text";
