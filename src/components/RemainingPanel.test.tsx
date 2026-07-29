import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RemainingPanel } from "@/components/RemainingPanel";

// The shell's own behaviour: the disclosure, its default state, the keyboard
// path and what it must not touch. What goes inside it is the content
// components' business, so the body here is a plain sentence.

beforeEach(() => {
  window.localStorage.clear();
});

function renderPanel() {
  return render(
    <RemainingPanel title="Remaining Runes">
      <p>The panel body</p>
    </RemainingPanel>,
  );
}

function disclosure(): HTMLDetailsElement {
  const element = screen.getByText("Remaining Runes").closest("details");

  if (!element) throw new Error("The panel is not a native details element");

  return element;
}

function summary(): HTMLElement {
  const element = screen.getByText("Remaining Runes").closest("summary");

  if (!element) throw new Error("The title is not inside a summary");

  return element;
}

describe("the panel shell", () => {
  it("loads closed, showing the title and not the content", () => {
    renderPanel();

    expect(disclosure()).not.toHaveAttribute("open");
    expect(screen.getByText("Remaining Runes")).toBeVisible();
    expect(screen.getByText("The panel body")).not.toBeVisible();
  });

  it("opens and closes from the summary", async () => {
    renderPanel();

    await userEvent.click(summary());
    expect(screen.getByText("The panel body")).toBeVisible();

    await userEvent.click(summary());
    expect(screen.getByText("The panel body")).not.toBeVisible();
  });

  it("is focusable, as the keyboard path requires", () => {
    // jsdom does not simulate a summary's activation behaviour — Enter and
    // Space opening the panel is the platform's own conduct, checked in a real
    // browser like the sticky bands' stacking is. What is asserted here is the
    // mechanism that conduct hangs off: the control takes focus, and it is the
    // native summary of a native details rather than a styled span.
    renderPanel();

    expect(summary().tabIndex).toBe(0);

    summary().focus();
    expect(summary()).toHaveFocus();
  });

  it("exposes its state through the element itself", async () => {
    // The `open` attribute is what assistive technology reads from a native
    // details — there is no ARIA here to drift from it.
    renderPanel();

    expect(disclosure().open).toBe(false);

    await userEvent.click(summary());
    expect(disclosure().open).toBe(true);
  });

  it("keeps the content in the document while closed", () => {
    // Closed is a display state, not a conditional render: Chromium's
    // find-in-page can open the panel to a match, and that only works if the
    // text is there to find.
    renderPanel();

    expect(screen.getByText("The panel body")).toBeInTheDocument();
  });

  it("writes nothing to storage", async () => {
    renderPanel();

    await userEvent.click(summary());
    await userEvent.click(summary());

    expect(window.localStorage.length).toBe(0);
  });

  it("keeps the state's glyph out of the accessibility tree", () => {
    renderPanel();

    // The element reports open or closed itself; the triangle restating it is
    // decoration, exactly as a rune icon is beside its name.
    const glyph = summary().querySelector("[aria-hidden]");

    expect(glyph).not.toBeNull();
  });
});
