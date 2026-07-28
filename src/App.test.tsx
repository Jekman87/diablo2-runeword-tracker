import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "@/App";
import { CRAFTED_STORAGE_KEY } from "@/crafted/storage";
import { en } from "@/i18n/en";

// The table's own behaviour is covered by `RunewordTable.test.tsx` and the
// pieces below it by their own files. What is asserted here is what the page
// shell owes: its title, that the table is its content, and that the one piece
// of state it owns actually reaches all three of the things that read it.

beforeEach(() => {
  window.localStorage.clear();
});

describe("App", () => {
  it("renders the application shell", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: en.app.title }),
    ).toBeInTheDocument();
  });

  it("renders the runeword table as the page's content", () => {
    render(<App />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(100);
  });

  it("renders overall progress and an empty live region", () => {
    render(<App />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("builds no site header", () => {
    render(<App />);

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toEqual([]);
  });
});

describe("the state the page owns", () => {
  it("reaches the row, the progress bar and the notice from one toggle", async () => {
    render(<App />);

    await userEvent.click(socketFor("Steel"));

    expect(socketFor("Steel")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      en.progress.count(1, 99),
    );
    expect(screen.getByText(en.undo.marked("Steel"))).toBeVisible();
  });

  it("puts everything back when the undo is taken", async () => {
    render(<App />);

    await userEvent.click(socketFor("Steel"));
    await userEvent.click(screen.getByRole("button", { name: en.undo.action }));

    expect(socketFor("Steel")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      en.progress.count(0, 99),
    );
    // Focus is on the socket it reverted, not on `<body>`.
    expect(socketFor("Steel")).toHaveFocus();
  });

  it("loads the progress an earlier session left behind", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Steel","Leaf"]');

    render(<App />);

    expect(socketFor("Steel")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      en.progress.count(2, 99),
    );
  });

  it("persists a toggle without waiting for anything", async () => {
    render(<App />);

    await userEvent.click(socketFor("Steel"));

    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe('["Steel"]');
  });
});

/** The crafted socket in the row whose name button reads `name`. */
function socketFor(name: string) {
  const row = screen.getByRole("button", { name }).closest("tr");

  if (!row) throw new Error(`No row for ${name}`);

  return within(row).getByRole("button", {
    name: new RegExp(`^Mark ${name} as`),
  });
}
