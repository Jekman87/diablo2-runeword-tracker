import { useId, useRef } from "react";

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import { useLocale, useStrings } from "@/i18n";
import { displayRunewordName } from "@/runewords/display";

/** A mark or unmark the player has asked for and not yet confirmed. */
export interface PendingToggle {
  /** The runeword's canonical name — the identifier the toggle acts on. */
  name: string;
  /** Its state now, which is what decides the direction the dialog asks about. */
  crafted: boolean;
  /**
   * The control that raised the request, to hand focus back to.
   *
   * A DOM node rather than a name, because the alternative is minting an id for
   * every row out of names that contain apostrophes and spaces. Both routes into
   * the dialog — the crafted button and a click anywhere on the row — hand over
   * the row's own button, so the reader lands on the control for the runeword
   * they were just asked about however they got here.
   */
  control: HTMLElement | null;
}

export interface CraftedConfirmProps {
  /** The pending request, or `null` when no dialog is on screen. */
  pending: PendingToggle | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * The question standing in front of every mark and unmark.
 *
 * **It replaced the undo notice, and the swap is the whole point.** The row is a
 * large pointer target by design, so marking something by accident is easy; the
 * notice answered that after the fact, on a five-second timer, from the bottom
 * of the viewport. Asking first is the same protection taken in the other order,
 * and it is the one import already uses for a change it cannot take back.
 *
 * One dialog for both directions rather than two components. What differs
 * between them is three strings and the colour of one button — the modal, the
 * focus trap, the backdrop and the dismissal routes are identical, and two
 * copies of those would be two places for the safe answer to stop being the
 * focused one.
 *
 * **Rendered once, from `App`, rather than once per row.** Ninety-nine dialogs
 * that are all closed is ninety-nine floating contexts, and the pending request
 * is a property of the page rather than of a row: only one can be open.
 *
 * The Floating UI pattern is `ProgressTransfer`'s, deliberately down to the
 * details — modal focus management, initial focus on the safe action, no scroll
 * lock. Not shared as one component with it: that dialog counts a file and this
 * one names a runeword, and a single component taking both sets of props would
 * be a switch statement wearing a modal.
 */
export function CraftedConfirm({
  pending,
  onConfirm,
  onCancel,
}: CraftedConfirmProps) {
  const strings = useStrings();
  const locale = useLocale();
  const titleId = useId();

  // The reflex Enter lands on the safe-and-expected action, and the two
  // directions disagree about which that is. Marking focuses the confirm
  // action: the player just asked to record a craft, and confirming a misclick
  // loses nothing that one more click cannot undo. Unmarking focuses Cancel:
  // there Enter would erase progress, so the reflex preserves it. Refs rather
  // than tabbable indexes — a number is not a thing to encode where getting it
  // wrong changes the player's progress.
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const {
    refs: { setFloating },
    context,
  } = useFloating({
    open: pending !== null,
    // Every route out that the library owns — Escape, a press on the backdrop —
    // arrives here, and all of them mean cancel. Confirming does not come
    // through this; it calls `onConfirm` directly.
    onOpenChange: (open) => {
      if (!open) onCancel();
    },
    // The control that raised the request, given to the library as this
    // dialog's reference so that closing by any route returns focus to it. The
    // dialog is rendered by `App` and its reference is in a table row, which is
    // exactly the case `elements` exists for.
    elements: { reference: pending?.control ?? null },
  });

  // No positioning middleware and no `autoUpdate`: this is centred in the
  // viewport by the overlay's own layout rather than anchored to the control,
  // so there is nothing to measure and nothing to keep measuring.
  const interactions = useInteractions([
    // **`click`, not the default `pointerdown`, and the dim is the reason.**
    // Dismissing on `pointerdown` unmounts the overlay between the press and the
    // release, so the browser hit-tests the release against whatever the dim was
    // covering and delivers `mousedown`, `mouseup` and `click` to the page
    // underneath. Traced on a phone-sized viewport: one tap on the dim closed
    // this and then landed on a row, opening that row's advice panel — or, a few
    // pixels over, raising the crafted question again for a different runeword.
    //
    // Dismissing on `click` leaves the overlay mounted until the click is
    // dispatched, so the click's target is the dim itself and the page never sees
    // it. A backdrop exists to absorb the press; this is what makes it do that.
    useDismiss(context, { outsidePressEvent: "click" }),
    useRole(context, { role: "dialog" }),
  ]);

  if (pending === null) return null;

  // The projected label inside the sentence. `pending.name` is the canonical
  // identifier the toggle acts on, and an English runeword named in the middle
  // of a Russian sentence is the one place the locale would not have reached.
  const label = displayRunewordName(pending.name, locale);

  const { title, body, action, actionClass } = pending.crafted
    ? {
        title: strings.crafted.confirmUnmarkTitle,
        body: strings.crafted.confirmUnmarkBody,
        action: strings.crafted.confirmUnmarkAction,
        actionClass: REMOVE,
      }
    : {
        title: strings.crafted.confirmMarkTitle,
        body: strings.crafted.confirmMarkBody,
        action: strings.crafted.confirmMarkAction,
        actionClass: CONFIRM,
      };

  // One split on the `{name}` placeholder the copy layer leaves. The halves
  // are plain text; only the label between them takes colour.
  const [before, after = ""] = body.split("{name}");

  return (
    <FloatingPortal>
      {/* The dim the detail panel deliberately does without: that panel opens
          under a passing pointer and must not interrupt, and this one is a
          question that has to be answered before anything else happens.

          No `lockScroll`, for the reason `ProgressTransfer` measured: the lock
          compensates for a layout viewport that does not widen on this page, and
          every centred thing on it jumps sideways at the moment the player's
          attention is being pulled to a question. */}
      <FloatingOverlay className="z-20 grid place-items-center bg-backdrop p-4">
        <FloatingFocusManager
          context={context}
          modal
          initialFocus={pending.crafted ? cancelRef : confirmRef}
        >
          <div
            ref={setFloating}
            {...interactions.getFloatingProps()}
            aria-labelledby={titleId}
            className="grid max-w-md gap-3 rounded-xs border border-panel-edge bg-panel p-4 text-panel-text"
          >
            <h2 id={titleId} className="text-2xl text-gold-mid">
              {title}
            </h2>

            <p>
              {before}
              {/* Gold, as a runeword's name is everywhere else on the page —
                  so the identifier inside the sentence is the same colour as
                  the row the player just clicked, not a second kind of name. */}
              <span className="text-gold-mid">{label}</span>
              {after}
            </p>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className={ACTION}
              >
                {strings.crafted.confirmCancel}
              </button>

              {/* Green to mark, red to remove — the second carrier of the
                  direction. The first is the label, which names the action
                  rather than saying "OK", so the colour is never the only thing
                  telling the two dialogs apart. */}
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                className={actionClass}
              >
                {action}
              </button>
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}

// The chip's resting appearance, as `ProgressTransfer`'s cancel takes. Written
// out here rather than imported from that component: two dialogs sharing a
// class constant would make one of them the owner of the other's styling, and
// the string is the same three decisions the whole interface makes about a
// pressable chip.
//
// `min-w-24` with centred content on all three: the labels differ wildly in
// length between the locales — the English "Add" is three letters where the
// Russian is eight — and without a floor the affirmative action renders as a
// sliver beside its Cancel. One floor shared by every button in the dialog, so
// no action is ever the visibly smaller target.
const ACTION =
  "inline-flex h-9 min-w-24 cursor-pointer items-center justify-center rounded-xs bg-muted-dark px-3 text-[14px] text-body hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light";

const CONFIRM =
  "inline-flex h-9 min-w-24 cursor-pointer items-center justify-center rounded-xs bg-confirm-action px-3 text-[14px] text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light";

const REMOVE =
  "inline-flex h-9 min-w-24 cursor-pointer items-center justify-center rounded-xs bg-remove-action px-3 text-[14px] text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light";
