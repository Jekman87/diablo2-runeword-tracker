import { type ChangeEvent, useId, useRef, useState } from "react";

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import { type StoredProgress, splitStoredNames } from "@/crafted/storage";
import { runewordNameAliases } from "@/data";
import { useStrings } from "@/i18n";
import { downloadText } from "@/transfer/download";
import {
  EXPORT_FILENAME,
  decodeImportBytes,
  formatExport,
  parseImport,
} from "@/transfer/format";

export interface ProgressTransferProps {
  /** Every crafted runeword, which is what an export writes. */
  crafted: ReadonlySet<string>;
  /** Applies a confirmed import. Replaces progress outright. */
  onReplace: (next: StoredProgress) => void;
}

/**
 * The export and import controls, and the confirmation standing in front of
 * every import.
 *
 * Rendered into `RunewordControls`' slot, so the two buttons sit with the
 * browsing controls without that component knowing anything about progress. It
 * takes the crafted set and one callback and holds nothing else — the parsed
 * file lives here only for as long as the confirmation is on screen.
 *
 * **The export is every crafted runeword, never the visible rows.** The prop is
 * the whole set for that reason: a backup that quietly held only what a filter
 * was showing would erase the rest on the next import, which is the same failure
 * `crafted-tracking` guards the progress denominator against.
 *
 * **Nothing is written until the player confirms.** Choosing a file reads it,
 * parses it and splits it against the dataset, and all of that lands in state;
 * the confirmation renders the count from that very object and confirming hands
 * the same object to `onReplace`. The number the player agreed to and the
 * progress they get therefore cannot disagree, because they are one value rather
 * than two derivations of one file.
 */
export function ProgressTransfer({
  crafted,
  onReplace,
}: ProgressTransferProps) {
  const strings = useStrings();
  const titleId = useId();

  // The file, parsed and split, held from the moment it is chosen until the
  // player answers. `null` is "no confirmation on screen" — the dialog's open
  // state and its contents are one value, so there is no way to be open with
  // nothing to show.
  const [pending, setPending] = useState<StoredProgress | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  // The focus manager needs the safe action by reference rather than by index:
  // cancel is the second button in the dialog, and a tabbable order is not a
  // thing to encode as a number in the one place where getting it wrong loses
  // the player their progress.
  const cancelRef = useRef<HTMLButtonElement>(null);

  const {
    refs: { setReference, setFloating },
    context,
  } = useFloating({
    open: pending !== null,
    // Every route out of the dialog that the library owns — Escape, a press on
    // the backdrop — arrives here, and all of them mean cancel. Confirming does
    // not come through this; it calls `apply` directly.
    onOpenChange: (open) => {
      if (!open) setPending(null);
    },
  });

  // No positioning middleware and no `autoUpdate`: this is centred in the
  // viewport by the overlay's own layout rather than anchored to the button, so
  // there is nothing to measure and nothing to keep measuring. `useFloating` is
  // here for the context the three interaction hooks share.
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
    useRole(context, { role: "alertdialog" }),
  ]);

  return (
    // No label over the pair and no `role="group"`. The two buttons sit on the
    // count's row rather than among the filters, where there is no column of
    // legends to line up with — and "Export progress" and "Import progress" say
    // what they are without a heading repeating it. A group label that adds no
    // word the controls do not already carry is one more thing for a screen
    // reader to read out.
    <>
      <div className="flex flex-wrap gap-1">
        <button type="button" onClick={exportProgress} className={ACTION}>
          <TransferIcon direction="out" />
          {strings.transfer.exportAction}
        </button>

        <button
          ref={setReference}
          type="button"
          onClick={() => fileRef.current?.click()}
          className={ACTION}
          {...interactions.getReferenceProps()}
        >
          <TransferIcon direction="in" />
          {strings.transfer.importAction}
        </button>

        {/* Hidden behind the button rather than sitting in the bar. A bare file
            input renders its own control and its own "No file chosen" — text
            this project cannot reach and cannot translate — in a row whose other
            controls are chips. `sr-only` and not `display: none`, so the input
            keeps its own accessible name and a screen reader can still find the
            picker if it goes looking. */}
        <input
          ref={fileRef}
          type="file"
          // A hint to the picker and never a guarantee: every OS dialog offers a
          // way past it, which is why a workbook chosen anyway has to degrade to
          // a count of zero rather than to an error.
          accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
          aria-label={strings.transfer.importAction}
          onChange={(event) => void fileChosen(event)}
          className="sr-only"
        />
      </div>

      {pending === null ? null : (
        <FloatingPortal>
          {/* The dim the detail panel deliberately does without. That panel
              opens under a passing pointer and must not interrupt; this one is
              destructive and irreversible, and interrupting is its job.

              **No `lockScroll`, and that is measured rather than preferred.**
              The lock sets `overflow: hidden` on `<body>` and adds
              `padding-right` equal to the scrollbar's width to compensate for
              the layout viewport widening. On this page the viewport does not
              widen: with the dialog open, `<html>`'s border box stays 1369px
              while `<body>` gains the 15px of padding, so `#root` goes 1369 →
              1354 and every centred thing on the page — the header, the progress
              band, the table — jumps 7.5px to the left. At the exact moment the
              player's attention is being pulled to a destructive question, the
              page moves under them.

              What the lock would buy is that the table cannot be scrolled behind
              the dim. That is worth less than a stationary page, and it is
              already how the detail panel behaves. The overlay still covers
              everything, still dims it, and still swallows the press. */}
          <FloatingOverlay className="z-20 grid place-items-center bg-backdrop p-4">
            <FloatingFocusManager
              context={context}
              modal
              // The reflex keypress is the safe one. A modal that destroys
              // progress on Enter is a modal that destroys progress.
              initialFocus={cancelRef}
            >
              <div
                ref={setFloating}
                {...interactions.getFloatingProps()}
                aria-labelledby={titleId}
                className="grid max-w-md gap-3 border border-panel-edge bg-panel p-4 text-panel-text"
              >
                <h2 id={titleId} className="text-2xl text-gold-mid">
                  {strings.transfer.confirmTitle}
                </h2>

                <p>{strings.transfer.confirmWarning}</p>

                {/* The number the file is judged by, and the reason no report
                    of unmatched names is owed: a file of typos offers to import
                    nothing, in the one place the player is already reading. */}
                <p className="text-gold-mid">
                  {strings.transfer.confirmCount(pending.crafted.size)}
                </p>

                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    ref={cancelRef}
                    type="button"
                    onClick={() => setPending(null)}
                    className={ACTION}
                  >
                    {strings.transfer.confirmCancel}
                  </button>

                  <button type="button" onClick={apply} className={DESTRUCTIVE}>
                    {strings.transfer.confirmAccept}
                  </button>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );

  function exportProgress() {
    downloadText(EXPORT_FILENAME, formatExport(crafted));
  }

  async function fileChosen(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];

    // Cleared before anything else, and deliberately not at the end: without
    // this the same file chosen twice fires no second `change`, and a player who
    // cancelled a confirmation and reconsidered would find the button dead.
    // Doing it first means it happens even if reading throws below. The `File`
    // handle taken above stays readable after the input is cleared.
    input.value = "";

    if (!file) return;

    try {
      // Split by the same function a stored list goes through, so an import and
      // a reload cannot disagree about which names the dataset knows. The
      // aliases are English and Russian alike, so a translated or mixed list
      // marks what it names and the count below says so.
      setPending(
        splitStoredNames(
          parseImport(decodeImportBytes(await file.arrayBuffer())),
          runewordNameAliases,
        ),
      );
    } catch {
      // The file could not be read at all — removed from the disk between the
      // picker and here, or a permission the browser withdrew. Nothing opens and
      // nothing changes. There is no error copy because there is nothing the
      // player could do with it that choosing the file again does not do.
    }
  }

  function apply() {
    if (pending === null) return;

    onReplace(pending);
    setPending(null);
  }
}

/**
 * An arrow leaving a tray, or entering one.
 *
 * **Decorative, and `aria-hidden` for that reason.** Both buttons carry their
 * own visible text; the icon is the thing that makes the pair findable at a
 * glance in a bar of words, not a second name for it. An icon that a reader has
 * to be told about is one that failed at its job and is now costing them a word.
 *
 * Inline SVG rather than an icon package, which would be a dependency for two
 * glyphs. `currentColor` and no size of its own, so it takes the button's colour
 * and its hover with no second declaration of either — the same way
 * `CraftedToggle` draws its check.
 *
 * The tray is the same three strokes in both; only the arrow turns over. Export
 * lifts a file out of the page, import drops one in, and reading them together
 * is what makes either legible — a lone downward arrow means "download" to some
 * readers and "receive" to others.
 */
function TransferIcon({ direction }: { direction: "in" | "out" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The tray: two shoulders and a floor. */}
      <path d="M3 10.5V13h10v-2.5" />

      {direction === "out" ? (
        // Out of the page and into a file: the shaft rises from the tray and the
        // head points away from it.
        <path d="M8 10V3M5 5.8 8 2.8l3 3" />
      ) : (
        // Into the page from a file: the same shaft, the head pointing down into
        // the tray.
        <path d="M8 2.8V10M5 7l3 3 3-3" />
      )}
    </svg>
  );
}

// The chip's own resting appearance, so the four controls in this row read as
// one bar. Not `cva` and not shared with `RunewordControls`' `chip`: that one
// has a selected variant and wraps a hidden radio, and these are plain buttons
// with one state.
//
// `gap-2` for the icon beside the label, which is the only thing the chip's own
// class list did not already need.
const ACTION =
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-xs bg-muted-dark px-3 text-[14px] text-body hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light";

// The one control on the page that destroys something. It takes the selected
// chip's colours — the blood family — because that is the palette's emphasis and
// this change adds no hue for one button.
const DESTRUCTIVE =
  "inline-flex h-9 cursor-pointer items-center rounded-xs bg-blood-light px-3 text-[14px] text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light";
