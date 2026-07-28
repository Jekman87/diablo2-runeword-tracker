import { useEffect, useRef } from "react";

import { PropertyLine } from "@/components/PropertyLine";
import { RuneIcon } from "@/components/RuneIcon";
import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";
import { itemTypesLabel } from "@/runewords/format";

export interface RunewordDialogProps {
  /** The runeword being shown, or `null` when nothing is open. */
  runeword: Runeword | null;
  onClose: () => void;
}

/**
 * The detail view for one runeword: its runes with their names, the socket count
 * derived from them, its bases, its level, its availability in full words and
 * every granted property line.
 *
 * One `<dialog>` for the whole table, driven by which runeword is selected —
 * not one per row. Ninety-nine of these would put 975 property lines into the
 * document so that a page whose entire content is 99 rows carried ten times
 * that in markup nobody is looking at. The element stays mounted and empty
 * while nothing is selected, which is what lets the platform close it and
 * restore focus.
 *
 * `showModal()` supplies the focus trap, Escape to close, `::backdrop`, inert
 * content behind and focus returned to the invoking button. None of it is
 * hand-rolled here, which is the point of the element: focus restoration and
 * Escape handling are exactly what a hand-rolled overlay gets subtly wrong.
 * Backdrop click-to-dismiss is the one dismissal it does not provide.
 */
export function RunewordDialog({ runeword, onClose }: RunewordDialogProps) {
  const strings = useStrings();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;

    if (!element) return;

    // Guarded both ways. Selecting a second runeword while the first is open
    // only changes the content, and `showModal()` on an already-open dialog
    // throws; closing an already-closed one would fire a stray `close` event.
    if (runeword && !element.open) element.showModal();
    if (!runeword && element.open) element.close();
  }, [runeword]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={dismissOnBackdrop(onClose)}
      aria-labelledby={DIALOG_TITLE_ID}
      className={PANEL}
    >
      {runeword ? (
        <div className="grid gap-3">
          {/* The close control sits at the top, beside the name, rather than
              after the property list. That is not only convention: it is the
              first focusable element in the dialog, so it is where `showModal()`
              puts focus — and a button below 26 property lines would have the
              browser scroll the panel to its bottom on open, landing the reader
              past the name they just clicked. */}
          <div className="flex items-baseline justify-between gap-4">
            <h2 id={DIALOG_TITLE_ID} className="text-2xl text-gold-mid">
              {runeword.name}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-row-line px-3 py-1 text-gold-mid hover:text-gold-light"
            >
              {strings.detail.close}
            </button>
          </div>

          {/* Label in one column, value in the next. A `dl` stacks by default,
              which turns eight short facts into sixteen lines and pushes the
              property list off a laptop screen. */}
          <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
            <dt className="text-gold">{strings.detail.runes}</dt>
            <dd className="flex flex-wrap gap-3">
              {runeword.runes.map((rune, index) => (
                <span
                  key={`${rune}-${index}`}
                  className="grid justify-items-center"
                >
                  <RuneIcon name={rune} />
                  <span className="text-sm text-gold-mid">{rune}</span>
                </span>
              ))}
            </dd>

            <dt className="text-gold">{strings.detail.sockets}</dt>
            {/* Derived here, at the point of display. There is no socket field
                on the record and none may be added: a second representation of
                a fact can only drift from the first. */}
            <dd>{runeword.runes.length}</dd>

            <dt className="text-gold">{strings.detail.itemTypes}</dt>
            <dd>{itemTypesLabel(runeword, strings)}</dd>

            <dt className="text-gold">{strings.detail.requiredLevel}</dt>
            <dd>{runeword.requiredLevel}</dd>

            {/* Patch and ladder status in full words, not the row's markers.
                This is the path that needs no pointer at all — a touch user
                with no screen reader can reach neither a hover tooltip nor an
                accessible name. */}
            {runeword.patch || runeword.ladderOnly ? (
              <>
                <dt className="text-gold">{strings.detail.availability}</dt>
                {/* One `dd` holding both sentences rather than two, because the
                    two-column grid gives each `dd` the second column and a
                    second one would land back under the label. */}
                <dd>
                  {runeword.patch ? (
                    <span className="block">
                      {strings.availability.patchMeaning(runeword.patch)}
                    </span>
                  ) : null}
                  {runeword.ladderOnly ? (
                    <span className="block">
                      {strings.availability.ladderMeaning}
                    </span>
                  ) : null}
                </dd>
              </>
            ) : null}

            {/* `Mosaic`'s caveat is the single most actionable sentence in the
                dataset, and the reference hides it behind a hover. */}
            {runeword.note ? (
              <>
                <dt className="text-gold">{strings.detail.note}</dt>
                <dd className="text-accent">{runeword.note}</dd>
              </>
            ) : null}
          </dl>

          <h3 className="text-xl">{strings.detail.properties}</h3>
          <ul className="grid gap-0.5 text-property">
            {runeword.properties.map((line, index) => (
              <li key={index}>
                <PropertyLine line={line} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </dialog>
  );
}

/**
 * Dismisses the dialog when the click landed outside its own box.
 *
 * A click on the backdrop targets the dialog element itself, so there is no
 * backdrop node to listen on; the pointer position against the dialog's
 * bounding box is what distinguishes the two. Three lines, and the only
 * dismissal `<dialog>` leaves to its caller.
 */
function dismissOnBackdrop(onClose: () => void) {
  return (event: React.MouseEvent<HTMLDialogElement>) => {
    const box = event.currentTarget.getBoundingClientRect();

    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;

    if (outside) onClose();
  };
}

// The dialog's accessible name is the runeword's own, so the element points at
// the heading rather than restating it. One dialog means one id.
const DIALOG_TITLE_ID = "runeword-detail-title";

// The height cap and the scroll are load-bearing rather than defensive.
// `Fortitude` has 26 property lines, and unbounded the panel grows taller than
// the viewport — at which point, because a modal dialog is positioned rather
// than in the flow, the overflow goes off the *top* edge with nothing to scroll.
// The name, the runes and the socket count end up rendered and unreachable.
const PANEL =
  "m-auto max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto border border-row-line bg-panel p-4 text-body backdrop:bg-backdrop";
