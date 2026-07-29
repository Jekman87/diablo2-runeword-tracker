import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RunewordTable } from "@/components/RunewordTable";
import { runewords } from "@/data";
import { en } from "@/i18n/en";
import { orderedRunewords } from "@/runewords/order";

// Driven through the table rather than by rendering the panel directly, because
// what is under test is the whole path: a name is a button, each row owns its own
// floating context, and only the open panel is ever in the document.
//
// The jsdom `showModal` stand-in these tests used to run against is gone with the
// `<dialog>`. What they assert now is `@floating-ui/react`'s real behaviour, which
// is a straight improvement — and it moves the boundary rather than removing it.
// What jsdom still cannot answer is anything needing layout: `safePolygon`'s
// geometry, whether the panel flipped above the pointer or shifted inward at a
// viewport edge, and how long the open delay feels. Those are browser checks.

/**
 * The table with nothing crafted, presenting every runeword in the default order.
 *
 * Crafted state and the rows are both `App`'s and reach the table as props; none
 * of the detail view's behaviour depends on either, which is why the sort here is
 * simply the default rather than something these tests vary.
 */
function renderTable() {
  return render(
    <RunewordTable
      runewords={orderedRunewords}
      crafted={new Set()}
      sortKey="requiredLevel"
      sortDirection="ascending"
      onSort={vi.fn()}
      onToggle={vi.fn()}
    />,
  );
}

describe("what opens the detail view", () => {
  it("opens on a click and shows the full record", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Mosaic" }));

    const panel = within(screen.getByRole("dialog"));

    expect(panel.getByRole("heading", { name: "Mosaic" })).toBeVisible();
    expect(panel.getByText(en.detail.runes)).toBeVisible();
    expect(panel.getByText("Gul")).toBeVisible();
    expect(panel.getByText("Claws")).toBeVisible();
    expect(panel.getByText("(Assassin)")).toBeVisible();
    expect(panel.getByText("53")).toBeVisible();
    expect(panel.getAllByRole("listitem")).toHaveLength(10);
  });

  it("opens on hover, with no click at all", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.hover(screen.getByRole("button", { name: "Enigma" }));

    // Awaited rather than asserted outright, because hover opens after a delay.
    // That the delay exists is the assertion below; how long it should be is a
    // question for a browser.
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible(),
    );
  });

  it("opens nothing while the pointer is only passing over", async () => {
    const user = userEvent.setup();
    renderTable();

    // Three names crossed without resting on any. The delay is what makes a
    // pointer travelling down a 99-row table on its way somewhere else open no
    // panels rather than three.
    await user.hover(screen.getByRole("button", { name: "Steel" }));
    await user.hover(screen.getByRole("button", { name: "Ice" }));
    await user.hover(screen.getByRole("button", { name: "Enigma" }));
    await user.unhover(screen.getByRole("button", { name: "Enigma" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on keyboard focus alone, without being activated", async () => {
    renderTable();

    // Wrapped because focusing is what opens it, so the state it changes has to
    // be flushed before the panel can be looked for.
    await act(async () => {
      screen.getByRole("button", { name: "Steel" }).focus();
    });

    // No Space and no Enter. A keyboard reader reaches the same content a
    // pointer user reaches by hovering.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Steel" })).toBeVisible();
  });

  it("opens from a keypress, because the name is still a button", async () => {
    const user = userEvent.setup();
    renderTable();

    const name = screen.getByRole("button", { name: "Leaf" });

    name.focus();
    await user.keyboard(" ");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Leaf" })).toBeVisible();
  });

  it("names the panel after the runeword", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Enigma");
  });
});

describe("what the panel presents", () => {
  it("derives the socket count from the rune sequence", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Infinity" }));

    const panel = within(screen.getByRole("dialog"));
    const sockets = panel.getByText(en.detail.sockets).nextElementSibling;

    expect(sockets).toHaveTextContent("4");

    // Read as the four labels rather than as four images: the icons are
    // decoration now that their names are drawn beside them.
    expect(runeLabelsIn(screen.getByRole("dialog"))).toEqual([
      "Ber",
      "Mal",
      "Ber",
      "Ist",
    ]);

    // Nothing was read to produce the count: the record has no such field.
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

    const panel = within(screen.getByRole("dialog"));

    expect(
      panel.getByText(en.availability.patchMeaning("2.6")),
    ).toBeInTheDocument();
    expect(panel.getByText(en.availability.ladderMeaning)).toBeInTheDocument();
    expect(
      panel.getByText(
        "Disabled in Season 13! Can be crafted offline non-ladder.",
      ),
    ).toBeInTheDocument();
  });

  it("states no availability for a runeword carrying none", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Steel" }));

    const panel = within(screen.getByRole("dialog"));

    expect(panel.queryByText(en.detail.availability)).not.toBeInTheDocument();
    expect(panel.queryByText(en.detail.note)).not.toBeInTheDocument();
  });
});

describe("one panel at a time, and none while closed", () => {
  it("holds no detail markup at all while nothing is open", () => {
    const { container } = renderTable();

    // Not "one empty dialog element" — none. Ninety-nine rows would otherwise
    // put 975 property lines into a document whose entire content is 99 rows.
    expect(container.querySelectorAll("dialog")).toHaveLength(0);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Fortitude" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(en.detail.properties)).not.toBeInTheDocument();
  });

  it("replaces the first runeword when a second name is activated", async () => {
    const user = userEvent.setup();
    renderTable();

    // Both taken before either panel opens. A deliberately-opened panel hides
    // the rest of the page from the accessibility tree — see the trap test
    // below — so the second name cannot be found by role once the first is up.
    const enigma = rowButton("Enigma");
    const fortitude = rowButton("Fortitude");

    await user.click(enigma);
    expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible();

    await user.click(fortitude);

    // One panel, not two. Each row owns its own floating context, so this is
    // the assertion that 99 of them do not stack.
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Fortitude" })).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Enigma" }),
    ).not.toBeInTheDocument();
  });

  it("replaces a click-pinned panel when a second name is hovered", async () => {
    const user = userEvent.setup();
    renderTable();

    const enigma = rowButton("Enigma");
    const fortitude = rowButton("Fortitude");

    // Pinned by a click, which is the whole point: a clicked panel stays put
    // when the pointer wanders, so nothing about hover or `useDismiss` closes
    // it. Two panels overlapped until the open flag became one value.
    await user.click(enigma);
    expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible();

    await user.hover(fortitude);

    await waitFor(() => {
      expect(screen.getAllByRole("dialog")).toHaveLength(1);
      expect(screen.getByRole("heading", { name: "Fortitude" })).toBeVisible();
    });
    expect(
      screen.queryByRole("heading", { name: "Enigma" }),
    ).not.toBeInTheDocument();
  });

  it("never holds two panels, whatever order the triggers come in", async () => {
    const user = userEvent.setup();
    renderTable();

    const names = ["Enigma", "Fortitude", "Ice"].map(rowButton);

    // Click, hover, focus, click again — every pairing of the three triggers
    // across three different rows, asserting the count after each.
    for (const [step, name] of [
      ["click", names[0]],
      ["hover", names[1]],
      ["focus", names[2]],
      ["click", names[1]],
      ["hover", names[0]],
    ] as const) {
      if (step === "click") await user.click(name);
      if (step === "hover") await user.hover(name);
      if (step === "focus") await act(async () => name.focus());

      await waitFor(() =>
        expect(screen.queryAllByRole("dialog").length).toBeLessThanOrEqual(1),
      );
    }
  });

  it("replaces the first when a second name is hovered", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.hover(rowButton("Enigma"));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible(),
    );

    await user.hover(rowButton("Fortitude"));

    await waitFor(() => {
      expect(screen.getAllByRole("dialog")).toHaveLength(1);
      expect(screen.getByRole("heading", { name: "Fortitude" })).toBeVisible();
    });
  });
});

describe("dismissal", () => {
  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on a press outside it", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // The dismissal that replaced the close button, and the one a touch reader
    // uses: press anywhere that is not the panel.
    await user.click(document.body);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("offers no close button, because a popup is left rather than closed", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Enigma" }));

    // The panel holds no control at all. The button it used to hold was
    // `<dialog>`'s — `showModal()` needed something to focus — and a panel that
    // opens when the pointer rests on a name has no such ceremony.
    expect(within(screen.getByRole("dialog")).queryAllByRole("button")).toEqual(
      [],
    );
  });
});

describe("focus, and how the panel was opened", () => {
  it("returns focus to the name after a panel opened on purpose", async () => {
    const user = userEvent.setup();
    renderTable();

    const name = screen.getByRole("button", { name: "Enigma" });

    await user.click(name);
    await user.keyboard("{Escape}");

    // The behaviour `runeword-table` verified against `<dialog>`, now supplied
    // by `FloatingFocusManager`. A keyboard reader is not returned to the top of
    // a 99-row table.
    expect(name).toHaveFocus();
  });

  it("does not yank focus back when a press outside closed it", async () => {
    const user = userEvent.setup();
    renderTable();

    const name = screen.getByRole("button", { name: "Ice" });

    await user.click(name);
    await user.click(document.body);

    // Deliberately *not* returned to the name. Focus restoration exists so a
    // keyboard reader who pressed Escape is not dropped at the top of a 99-row
    // table; a reader who pressed somewhere else has said where they want to be,
    // and pulling them back to the name they left would be the rudeness the
    // feature is meant to prevent.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(name).not.toHaveFocus();
  });

  it("does not let focus escape into the table behind", async () => {
    const user = userEvent.setup();
    renderTable();

    const enigma = rowButton("Enigma");
    const row = rowFor("Enigma");

    await user.click(enigma);

    // Advanced well past the panel's last focusable element, which is its only
    // one. Focus visits the name, the panel's close button and the manager's
    // own boundary guards, and never a row.
    const visited: (Element | null)[] = [];

    for (let step = 0; step < 4; step++) {
      await user.tab();
      visited.push(document.activeElement);
    }

    const escaped = visited.filter((element) => {
      const landed = element?.closest("tr");

      return landed !== null && landed !== row;
    });

    expect(escaped).toEqual([]);

    // Deliberately not asserting that a tab *reaches* the panel. jsdom has no
    // layout, so the manager's boundary guards do not hand focus on the way a
    // browser makes them; where focus lands inside the boundary is 7.9's job.
    // What is assertable here is that it never lands outside it.

    // The other half of the containment, and the part jsdom can answer
    // outright: while a deliberately-opened panel is up, the page behind it is
    // out of the accessibility tree entirely. `<dialog>` gave this for free and
    // the jsdom stand-in never modelled it, so it was never asserted before.
    expect(screen.queryByRole("button", { name: "Fortitude" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Fortitude", hidden: true }),
    ).toBeInTheDocument();
  });

  it("does not take the keyboard when focus opens the panel", async () => {
    renderTable();

    const name = rowButton("Steel");

    await act(async () => {
      name.focus();
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Focus stays on the name the reader tabbed to. A trap here is the defect
    // that made the table impossible to tab through: focus reaching a name is
    // what opens that name's panel, so a trap closes on the first row and no
    // later row can be reached at all.
    expect(name).toHaveFocus();
  });

  it("lets focus out the far side of a focus-opened panel", async () => {
    const user = userEvent.setup();
    renderTable();

    const name = rowButton("Steel");

    await act(async () => {
      name.focus();
    });

    const panel = screen.getByRole("dialog");

    // The page behind is not hidden from assistive technology either, which is
    // the other half of not being modal — the reader is still in the table.
    expect(screen.getByRole("button", { name: "Leaf" })).toBeInTheDocument();

    await user.tab();

    // Where the tabs land past the panel is the browser's business — jsdom has
    // no layout for the manager's boundary guards — but a non-modal panel must
    // not be a dead end, and that much is assertable: focus is somewhere, and
    // the table behind was never taken out of reach.
    expect(panel).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Fortitude" }),
    ).toBeInTheDocument();
  });

  it("never moves focus for a panel opened by hover", async () => {
    const user = userEvent.setup();
    renderTable();

    const elsewhere = socketIn(rowFor("Steel"));
    elsewhere.focus();

    await user.hover(rowButton("Enigma"));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible(),
    );

    // A panel that appeared under a passing pointer must not take the keyboard
    // away from wherever its owner actually is.
    expect(elsewhere).toHaveFocus();
  });

  it("does not confine focus to a panel opened by hover", async () => {
    const user = userEvent.setup();
    renderTable();

    socketIn(rowFor("Steel")).focus();

    await user.hover(rowButton("Enigma"));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible(),
    );

    const hovered = screen.getByRole("dialog");

    await user.tab();

    // Focus advanced into the table, not into a panel its reader never asked to
    // go to. Where exactly it lands is the table's business — that it is not
    // trapped in `Enigma`'s panel is this one's.
    expect(hovered).not.toContainElement(document.activeElement as HTMLElement);
  });

  it("leaves focus alone when a hover-opened panel closes", async () => {
    const user = userEvent.setup();
    renderTable();

    const elsewhere = socketIn(rowFor("Steel"));
    elsewhere.focus();

    await user.hover(rowButton("Enigma"));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Enigma" })).toBeVisible(),
    );

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Not moved to the name the pointer happened to be over.
    expect(elsewhere).toHaveFocus();
  });
});

/** A runeword's name button in the table, as opposed to the panel's heading. */
function rowButton(name: string) {
  const button = screen
    .getAllByRole("button", { name })
    .find((candidate) => candidate.closest("tr") !== null);

  if (!button) throw new Error(`No row button for ${name}`);

  return button;
}

function rowFor(name: string) {
  const row = rowButton(name).closest("tr");

  if (!row) throw new Error(`No row for ${name}`);

  return row;
}

function socketIn(row: Element) {
  const socket = row.querySelector("[aria-pressed]");

  if (!(socket instanceof HTMLElement)) throw new Error("No socket in the row");

  return socket;
}

/**
 * The rune names drawn in a sequence, read as the text beside each icon rather
 * than as the icons' labels. The icons carry no label any more — the visible name
 * is what a reader gets, and reading it here is what proves that.
 */
function runeLabelsIn(scope: Element) {
  return [...scope.querySelectorAll(".rune-icon")].map(
    (icon) => icon.nextElementSibling?.textContent,
  );
}
