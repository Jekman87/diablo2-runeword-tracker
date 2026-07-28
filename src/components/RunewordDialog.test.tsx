import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RunewordTable } from "@/components/RunewordTable";
import { runewords } from "@/data";
import { en } from "@/i18n/en";

// Driven through the table rather than by rendering the dialog directly,
// because what is under test is the whole path: a name is a button, the table
// holds the selection, and one dialog serves all 99 rows.
//
// jsdom implements only `HTMLDialogElement.open`, so `src/test/setup.ts` stands
// in for the platform's `showModal`, `close`, Escape and focus restoration.
// These tests therefore prove the component's wiring, not the browser's
// behaviour. The focus trap, `inert`, `::backdrop` and backdrop click geometry
// have no layout in jsdom and are checked in a browser instead — asserting them
// here would be asserting the stand-in.

/**
 * The table with nothing crafted. Crafted state is `App`'s and reaches the
 * table as a prop; none of the detail view's behaviour depends on it.
 */
function renderTable() {
  return render(<RunewordTable crafted={new Set()} onToggle={vi.fn()} />);
}

describe("opening the detail view", () => {
  it("opens on the name and shows the full record", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Mosaic" }));

    const dialog = within(screen.getByRole("dialog"));

    expect(dialog.getByRole("heading", { name: "Mosaic" })).toBeVisible();
    expect(dialog.getByText(en.detail.runes)).toBeVisible();
    expect(dialog.getByRole("img", { name: "Gul" })).toBeVisible();
    expect(dialog.getByText("Claws (Assassin)")).toBeVisible();
    expect(dialog.getByText("53")).toBeVisible();
    expect(dialog.getAllByRole("listitem")).toHaveLength(10);
  });

  it("names the dialog after the runeword", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Enigma");
  });

  it("opens from the keyboard, because the name is a button", async () => {
    const user = userEvent.setup();
    renderTable();

    screen.getByRole("button", { name: "Steel" }).focus();
    await user.keyboard(" ");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Steel" })).toBeVisible();
  });

  it("derives the socket count from the rune sequence", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Infinity" }));

    const dialog = within(screen.getByRole("dialog"));
    const sockets = dialog.getByText(en.detail.sockets).nextElementSibling;

    expect(sockets).toHaveTextContent("4");
    expect(dialog.getAllByRole("img")).toHaveLength(4);

    // Nothing was read to produce it: the record has no such field.
    const infinity = runewords.find((runeword) => runeword.name === "Infinity");

    expect(infinity).not.toHaveProperty("sockets");
    expect(infinity).not.toHaveProperty("socketCount");
  });

  it("shows every property line, in the dataset's order", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Fortitude" }));

    const fortitude = runewords.find(
      (runeword) => runeword.name === "Fortitude",
    );
    const lines = within(screen.getByRole("dialog"))
      .getAllByRole("listitem")
      .map((line) => line.textContent);

    expect(lines).toHaveLength(26);
    expect(lines).toEqual(fortitude?.properties);
  });

  it("restates patch, ladder status and the note in full words", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Mosaic" }));

    const dialog = within(screen.getByRole("dialog"));

    expect(
      dialog.getByText(en.availability.patchMeaning("2.6")),
    ).toBeInTheDocument();
    expect(dialog.getByText(en.availability.ladderMeaning)).toBeInTheDocument();
    expect(
      dialog.getByText(
        "Disabled in Season 13! Can be crafted offline non-ladder.",
      ),
    ).toBeInTheDocument();
  });

  it("states no availability for a runeword carrying none", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Steel" }));

    const dialog = within(screen.getByRole("dialog"));

    expect(dialog.queryByText(en.detail.availability)).not.toBeInTheDocument();
    expect(dialog.queryByText(en.detail.note)).not.toBeInTheDocument();
  });
});

describe("one dialog for the whole table", () => {
  it("holds one dialog element and no detail content while closed", () => {
    const { container } = renderTable();

    expect(container.querySelectorAll("dialog")).toHaveLength(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Fortitude" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(en.detail.properties)).not.toBeInTheDocument();
  });

  it("replaces the first runeword when a second name is activated", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));
    expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible();

    // The row's button, not the dialog's heading — the dialog covers the table
    // in a browser, but the point of the test is that state replaces content
    // rather than stacking a second dialog.
    await user.click(rowButton("Fortitude"));

    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Fortitude" })).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Enigma" }),
    ).not.toBeInTheDocument();
  });
});

describe("dismissal and focus", () => {
  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on the close button", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));
    await user.click(screen.getByRole("button", { name: en.detail.close }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("returns focus to the name that opened it", async () => {
    const user = userEvent.setup();
    renderTable();

    const name = screen.getByRole("button", { name: "Enigma" });

    await user.click(name);
    expect(name).not.toHaveFocus();

    await user.keyboard("{Escape}");

    expect(name).toHaveFocus();
  });

  it("returns focus after closing by button too", async () => {
    const user = userEvent.setup();
    renderTable();

    const name = screen.getByRole("button", { name: "Ice" });

    await user.click(name);
    await user.click(screen.getByRole("button", { name: en.detail.close }));

    expect(name).toHaveFocus();
  });
});

/** A runeword's name button in the table, as opposed to the dialog's heading. */
function rowButton(name: string) {
  const button = screen
    .getAllByRole("button", { name })
    .find((candidate) => candidate.closest("tr") !== null);

  if (!button) throw new Error(`No row button for ${name}`);

  return button;
}
