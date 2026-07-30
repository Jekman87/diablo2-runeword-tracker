import { useEffect, useState } from "react";

import type { PendingUndo } from "@/crafted/useCraftedRunewords";
import { useLocale, useStrings } from "@/i18n";
import { displayRunewordName } from "@/runewords/display";

export interface UndoToastProps {
  /** The last toggle, or `null` when there is nothing to take back. */
  pending: PendingUndo | null;
  onUndo: () => void;
  /** Must be stable: it is this component's dismissal-timer dependency. */
  onDismiss: () => void;
}

/**
 * A short-lived notice of the last toggle, with an undo.
 *
 * **This is the misclick affordance, not the undo mechanism.** The way back from
 * a toggle is to press the socket again — it is a toggle, focus is still on it,
 * and Space reverts. What the notice exists for is the enlarged row hit target,
 * which creates a way to mark something without meaning to, and that is a
 * pointer gesture. So its button sitting several tab stops away from where a
 * keyboard user is standing is a limitation of the shape rather than a hole in
 * it.
 *
 * The `role="status"` container is in the document from the first render and
 * stays there empty, because a live region injected at the moment its content
 * appears is unreliably announced. `status` and not `alert`: a confirmation of
 * the player's own action should wait for a pause, not interrupt.
 */
export function UndoToast({ pending, onUndo, onDismiss }: UndoToastProps) {
  const strings = useStrings();
  const locale = useLocale();
  const [holdsFocus, setHoldsFocus] = useState(false);

  useEffect(() => {
    // Nothing to dismiss, or the reader is standing in it. A focusable control
    // that removes itself while focused drops focus to `<body>`, which in a
    // 99-row table means losing your place with no way back but Tab from the
    // top. The timer starts again when focus leaves.
    if (!pending || holdsFocus) return;

    const timer = setTimeout(onDismiss, DISMISS_AFTER_MS);

    return () => clearTimeout(timer);
  }, [pending, holdsFocus, onDismiss]);

  return (
    // The region itself is unstyled and takes no space: it is empty most of the
    // time, and the notice inside it is positioned out of the flow.
    <div role="status">
      {pending ? (
        <div
          // React's focus events bubble, so these fire for the button inside.
          onFocus={() => setHoldsFocus(true)}
          onBlur={() => setHoldsFocus(false)}
          className="fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 border border-row-line bg-toast px-4 py-2 text-body"
        >
          <span>
            {/* The projected label inside the sentence: `pending.name` is the
                canonical identifier the undo acts on, and naming an English
                runeword inside a Russian sentence would be the one place the
                locale did not reach. */}
            {pending.marked
              ? strings.undo.marked(displayRunewordName(pending.name, locale))
              : strings.undo.unmarked(
                  displayRunewordName(pending.name, locale),
                )}
          </span>

          <button
            type="button"
            onClick={onUndo}
            className="cursor-pointer text-gold-mid underline hover:text-gold-light"
          >
            {strings.undo.action}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// Long enough that a misclick has time to register as one, short enough not to
// sit over the page. The number is only a guess, and the focus rule above is
// what removes the case where guessing wrong does actual harm.
const DISMISS_AFTER_MS = 6000;
