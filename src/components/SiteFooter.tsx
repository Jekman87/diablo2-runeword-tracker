import { useEffect, useId, useRef, useState } from "react";

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import {
  DONATION_ADDRESS,
  DONATION_COIN,
  DONATION_NETWORK,
  SITE_NAME,
} from "@/header/site";
import { useStrings } from "@/i18n";

/** How long the easter-egg line stays before the copyright returns. */
const EASTER_EGG_MS = 5_000;

/**
 * The page's closing furniture: a copyright line with a small easter egg, and a
 * donation control on its own row that opens a small dialog with the receive
 * address.
 *
 * A `<footer>` **outside** `<main>`, sibling of the header, for the same reason
 * the header is: inside `main` the element exposes no `contentinfo` landmark.
 *
 * The divider above it spans the viewport at half opacity — the reference's
 * own shape — and the content keeps the page's measure, matching the header.
 *
 * The year is read from the clock at load and passed into the copy as a value,
 * the same shape the patch number already takes.
 *
 * The donation address lives only in the dialog: selectable text first, copy
 * button as an accelerator. The outcome is announced in a live region rather
 * than by the button relabelling itself.
 *
 * The copyright easter egg picks one of six short quotes at random; a
 * five-second timer restores the copyright. A second press while a quote is up
 * restores it immediately and cancels the timer.
 */
export function SiteFooter() {
  const strings = useStrings();
  const year = new Date().getFullYear();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [eggLine, setEggLine] = useState<string | null>(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  useEffect(() => {
    if (eggLine === null) return;

    const timer = setTimeout(() => setEggLine(null), EASTER_EGG_MS);
    return () => clearTimeout(timer);
  }, [eggLine]);

  const {
    refs: { setReference, setFloating },
    context,
  } = useFloating({
    open: donateOpen,
    onOpenChange(open) {
      setDonateOpen(open);
      if (!open) setCopyStatus("idle");
    },
  });

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

  async function copyAddress() {
    if (!navigator.clipboard?.writeText) {
      setCopyStatus("failed");
      return;
    }

    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  function toggleEasterEgg() {
    if (eggLine !== null) {
      setEggLine(null);
      return;
    }

    setEggLine(pickEasterEgg(strings.footer.easterEggs));
  }

  return (
    <footer className="grid gap-6 pb-10">
      <div className="gold-divider opacity-50" />

      <div className="mx-auto grid w-full max-w-6xl justify-items-center gap-2 px-6 text-center">
        <button
          type="button"
          onClick={toggleEasterEgg}
          className="cursor-pointer text-muted underline hover:text-gold-light"
        >
          {eggLine ?? strings.footer.copyright(SITE_NAME, year)}
        </button>

        <button
          ref={setReference}
          type="button"
          onClick={() => setDonateOpen(true)}
          className="cursor-pointer text-gold-mid underline hover:text-gold-light"
        >
          {strings.footer.donationHeading}
        </button>
      </div>

      {donateOpen ? (
        <FloatingPortal>
          <FloatingOverlay
            className="z-20 grid place-items-center bg-backdrop p-4"
            lockScroll={false}
          >
            <FloatingFocusManager
              context={context}
              modal
              initialFocus={closeRef}
            >
              <div
                ref={setFloating}
                {...interactions.getFloatingProps()}
                aria-labelledby={titleId}
                className="grid max-w-md gap-4 rounded-xs border border-panel-edge bg-panel p-4 text-panel-text"
              >
                <h2 id={titleId} className="text-xl text-gold-mid">
                  {strings.footer.donationHeading}
                </h2>

                <p className="text-muted">
                  {strings.footer.donationInstrument(
                    DONATION_COIN,
                    DONATION_NETWORK,
                  )}
                </p>

                <p className="font-mono text-sm break-all text-body select-all">
                  {DONATION_ADDRESS}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      void copyAddress();
                    }}
                    className="cursor-pointer rounded-xs bg-muted-dark px-3 py-2 text-gold-mid hover:text-gold-light"
                  >
                    {strings.footer.copyAddress}
                  </button>

                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setDonateOpen(false)}
                    className="cursor-pointer text-gold-mid underline hover:text-gold-light"
                  >
                    {strings.footer.donationClose}
                  </button>
                </div>

                <p aria-live="polite" className="text-sm text-muted">
                  {copyStatus === "copied"
                    ? strings.footer.copySuccess
                    : copyStatus === "failed"
                      ? strings.footer.copyFailure
                      : null}
                </p>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      ) : null}
    </footer>
  );
}

/** One line from the list, chosen uniformly. */
function pickEasterEgg(lines: readonly string[]): string {
  return lines[Math.floor(Math.random() * lines.length)]!;
}
