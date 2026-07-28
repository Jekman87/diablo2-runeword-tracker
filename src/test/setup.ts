import "@testing-library/jest-dom/vitest";

// jsdom 30 ships `HTMLDialogElement` with the `open` property and nothing else:
// no `showModal`, no `close`, no Escape handling and no focus behaviour. So the
// detail view cannot be opened in a test at all without standing something in
// for the platform.
//
// What follows is that stand-in, and it is deliberately the smallest thing that
// lets the dialog's *wiring* be tested: that the component calls `showModal()`,
// that a `close` event clears the selection, that Escape closes, and that focus
// returns to the element that opened it. The application code is unchanged by
// its existence — it uses the native element and the native methods, as the
// design requires.
//
// What this cannot prove is the behaviour a browser supplies and jsdom has no
// layout for: the focus trap, `inert` content behind the dialog, `::backdrop`
// and the dim, and backdrop click geometry. Those are browser checks, not
// assertions here.

// The guard is `typeof` rather than `in`, because TypeScript's lib declares
// both methods and `"showModal" in prototype` would narrow the prototype itself
// to `never` inside the block.
const dialogs = HTMLDialogElement.prototype;

if (typeof dialogs.showModal !== "function") {
  const opener = new WeakMap<HTMLDialogElement, Element | null>();

  dialogs.showModal = function showModal(this: HTMLDialogElement) {
    if (this.open) {
      throw new DOMException(
        "The element already has an 'open' attribute",
        "InvalidStateError",
      );
    }

    opener.set(this, document.activeElement);
    this.open = true;

    // The browser moves focus into the dialog on open. Without it, Escape
    // would still be delivered to whatever opened the dialog.
    const focusable = this.querySelector<HTMLElement>(FOCUSABLE);
    (focusable ?? this).focus();
  };

  dialogs.close = function close(this: HTMLDialogElement) {
    if (!this.open) return;

    this.open = false;

    const invoker = opener.get(this);
    opener.delete(this);

    if (invoker instanceof HTMLElement) invoker.focus();

    this.dispatchEvent(new Event("close"));
  };

  // Escape closes the topmost modal dialog. Bound on the document because the
  // shim's dialog is not really modal, so the key event is not guaranteed to
  // be delivered inside it.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const open = [...document.querySelectorAll("dialog[open]")].at(-1);

    if (open instanceof HTMLDialogElement) {
      open.dispatchEvent(new Event("cancel"));
      open.close();
    }
  });
}

const FOCUSABLE =
  "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
