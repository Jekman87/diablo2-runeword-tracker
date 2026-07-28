import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UndoToast } from "@/components/UndoToast";
import type { PendingUndo } from "@/crafted/useCraftedRunewords";
import { en } from "@/i18n/en";

const MARKED: PendingUndo = { name: "Enigma", marked: true, control: null };

function renderToast(pending: PendingUndo | null = MARKED) {
  const onUndo = vi.fn();
  const onDismiss = vi.fn();

  return {
    onUndo,
    onDismiss,
    ...render(
      <UndoToast pending={pending} onUndo={onUndo} onDismiss={onDismiss} />,
    ),
  };
}

describe("the notice", () => {
  it("names what happened and offers to take it back", () => {
    renderToast();

    expect(screen.getByText(en.undo.marked("Enigma"))).toBeVisible();
    expect(
      screen.getByRole("button", { name: en.undo.action }),
    ).toBeInTheDocument();
  });

  it("says the other thing when the toggle unmarked a runeword", () => {
    renderToast({ name: "Enigma", marked: false, control: null });

    expect(screen.getByText(en.undo.unmarked("Enigma"))).toBeVisible();
  });

  it("undoes on activation", async () => {
    const { onUndo } = renderToast();

    await userEvent.click(screen.getByRole("button", { name: en.undo.action }));

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("describes only the most recent toggle", () => {
    const { rerender } = renderToast();

    rerender(
      <UndoToast
        pending={{ name: "Spirit", marked: true, control: null }}
        onUndo={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    expect(
      screen.getAllByRole("button", { name: en.undo.action }),
    ).toHaveLength(1);
    expect(
      screen.queryByText(en.undo.marked("Enigma")),
    ).not.toBeInTheDocument();
  });
});

describe("the live region", () => {
  it("is polite rather than assertive", () => {
    renderToast();

    const region = screen.getByRole("status");

    expect(region).toBeInTheDocument();
    expect(region).not.toHaveAttribute("aria-live", "assertive");
  });

  it("is in the document before there is anything to announce", () => {
    renderToast(null);

    // A live region injected at the moment its content appears is unreliably
    // announced, so the empty region has to already be there.
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});

describe("dismissal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("removes itself after a short interval", () => {
    const { onDismiss } = renderToast();

    expect(onDismiss).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(6000));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  // `userEvent` is not used in this block. It has its own timer plumbing, and
  // driving it alongside fake ones deadlocks; `focus()` and `blur()` dispatch
  // the same events React listens for, which is all these two need.

  it("does not vanish while it holds focus", () => {
    const { onDismiss } = renderToast();

    act(() => undoButton().focus());
    expect(undoButton()).toHaveFocus();

    act(() => void vi.advanceTimersByTime(60_000));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("starts the interval again once focus leaves", () => {
    const { onDismiss } = renderToast();

    act(() => undoButton().focus());
    act(() => void vi.advanceTimersByTime(60_000));
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => undoButton().blur());
    act(() => void vi.advanceTimersByTime(6000));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not run a timer when there is nothing pending", () => {
    const { onDismiss } = renderToast(null);

    act(() => void vi.advanceTimersByTime(60_000));

    expect(onDismiss).not.toHaveBeenCalled();
  });
});

describe("focus", () => {
  it("does not take focus when it appears", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();

    renderToast();

    expect(document.activeElement).toBe(outside);

    outside.remove();
  });
});

function undoButton() {
  return screen.getByRole("button", { name: en.undo.action });
}
