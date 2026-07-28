import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RunewordTable } from "@/components/RunewordTable";
import { runewords } from "@/data";
import { en } from "@/i18n/en";
import { itemTypesLabel } from "@/runewords/format";
import { orderedRunewords } from "@/runewords/order";

/**
 * The table with nothing crafted and a toggle that goes nowhere.
 *
 * Crafted state is `App`'s, so the table takes it as a prop. Most of what is
 * asserted below is presentation that does not depend on it; the tests that do
 * pass their own set.
 */
function renderTable(
  crafted: ReadonlySet<string> = new Set(),
  onToggle = vi.fn(),
) {
  return {
    onToggle,
    ...render(<RunewordTable crafted={crafted} onToggle={onToggle} />),
  };
}

describe("the table's structure", () => {
  it("exposes a table with 99 rows beneath its header row", () => {
    renderTable();

    const rows = screen.getAllByRole("row");

    // The header row is a row too, so 99 runewords make 100.
    expect(rows).toHaveLength(100);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("associates every column header with its column", () => {
    renderTable();

    const headers = screen.getAllByRole("columnheader");

    expect(headers.map((header) => header.textContent)).toEqual([
      en.table.columnCrafted,
      en.table.columnName,
      en.table.columnRunes,
      en.table.columnItemTypes,
      en.table.columnRequiredLevel,
    ]);
    expect(headers.every((header) => header.getAttribute("scope") === "col"));
  });

  it("describes itself with a caption", () => {
    renderTable();

    expect(screen.getByText(en.table.caption).tagName).toBe("CAPTION");
  });

  it("renders every runeword exactly once", () => {
    renderTable();

    // Compared as sorted lists rather than by querying each of the 99 names in
    // turn. Every row now holds a socket as well as a name, so a name-filtered
    // role query computes an accessible name for ~198 buttons — ninety-nine of
    // those is slow enough to time the test out.
    expect([...renderedNames()].sort()).toEqual(
      runewords.map((runeword) => runeword.name).sort(),
    );
  });

  it("leads with a crafted-state column of its own", () => {
    renderTable();

    expect(screen.getAllByRole("columnheader")).toHaveLength(5);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent(
      en.table.columnCrafted,
    );
  });

  it("keeps the four dataset columns free of controls", () => {
    renderTable();

    const row = rowFor("Leaf");
    const [, ...dataCells] = [...row.querySelectorAll("td")];

    // The name button opens the detail view and changes no data; nothing else
    // in the four columns is interactive at all.
    expect(
      dataCells.flatMap((cell) => [
        ...cell.querySelectorAll("input, select, textarea, [aria-pressed]"),
      ]),
    ).toEqual([]);
  });

  it("presents the last row of the order without paging to it", () => {
    renderTable();

    const last = orderedRunewords[orderedRunewords.length - 1];

    expect(screen.getByRole("button", { name: last.name })).toBeInTheDocument();
  });
});

describe("the order rows appear in", () => {
  it("reads down the table in required-level order", () => {
    renderTable();

    expect(renderedNames()).toEqual(
      orderedRunewords.map((runeword) => runeword.name),
    );
  });

  it("does not present the dataset's storage order", () => {
    renderTable();

    expect(renderedNames()).not.toEqual(
      runewords.map((runeword) => runeword.name),
    );
  });

  it("renders the same sequence on a second render", () => {
    const first = renderTable();
    const before = renderedNames();
    first.unmount();

    renderTable();

    expect(renderedNames()).toEqual(before);
  });
});

describe("what a row carries", () => {
  it("carries the four values", () => {
    renderTable();

    const row = rowFor("Leaf");

    expect(within(row).getByRole("button", { name: "Leaf" })).toBeVisible();
    expect(within(row).getAllByRole("img", { name: "Tir" })).not.toHaveLength(
      0,
    );
    expect(within(row).getByText("Staves (Not Orbs/Wands)")).toBeVisible();
    expect(within(row).getByText("19")).toBeVisible();
  });

  it("keeps rune order and repeats — `Infinity` is Ber Mal Ber Ist", () => {
    renderTable();

    // Twice over, because the runes are rendered for both breakpoints. Reading
    // one cell rather than the row is what isolates a single sequence.
    const sequences = runeSequencesIn(rowFor("Infinity"));

    expect(sequences).toEqual([
      ["Ber", "Mal", "Ber", "Ist"],
      ["Ber", "Mal", "Ber", "Ist"],
    ]);
  });

  it("labels every rune icon with its own name", () => {
    renderTable();

    const rows = rowsByName();
    const wrong = orderedRunewords.filter((runeword) => {
      const [sequence] = runeSequencesIn(rows(runeword.name));

      return String(sequence) !== String(runeword.runes);
    });

    expect(wrong).toEqual([]);
  });

  it("lists multiple categories and puts a restriction in parentheses", () => {
    renderTable();

    const rows = rowsByName();
    const wrong = orderedRunewords.filter(
      (runeword) =>
        within(rows(runeword.name)).queryByText(
          itemTypesLabel(runeword, en),
        ) === null,
    );

    expect(wrong).toEqual([]);
  });

  it("renders no parentheses at all where there is no restriction", () => {
    renderTable();

    const rows = rowsByName();
    const unrestricted = orderedRunewords.filter(
      (runeword) => runeword.itemTypeRestriction === undefined,
    );

    expect(unrestricted).toHaveLength(84);

    const bracketed = unrestricted.filter((runeword) =>
      within(rows(runeword.name))
        .getByText(runeword.itemTypes.join(en.itemTypes.separator))
        .textContent?.includes("("),
    );

    expect(bracketed).toEqual([]);
  });

  it("leaves the dataset's restriction bare after rendering", () => {
    renderTable();

    const leaf = runewords.find((runeword) => runeword.name === "Leaf");

    expect(leaf?.itemTypeRestriction).toBe("Not Orbs/Wands");
  });

  it("does not link a category to a reference URL", () => {
    renderTable();

    expect(screen.queryAllByRole("link")).toEqual([]);
  });
});

describe("availability across the table", () => {
  it("marks exactly the 9 ladder-only rows", () => {
    const { container } = renderTable();

    expect(
      container.querySelectorAll(
        `[aria-label="${en.availability.ladderMeaning}"]`,
      ),
    ).toHaveLength(9);
  });

  it("shows all three markers on `Mosaic`", () => {
    renderTable();

    const row = within(rowFor("Mosaic"));

    expect(
      row.getByRole("img", { name: en.availability.patchMeaning("2.6") }),
    ).toBeVisible();
    expect(
      row.getByRole("img", { name: en.availability.ladderMeaning }),
    ).toBeVisible();
    expect(row.getByText(en.availability.noteMarker)).toBeVisible();
  });
});

describe("marking a runeword crafted", () => {
  it("gives every row a socket", () => {
    renderTable();

    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(99);
  });

  it("shows the socket pressed for a runeword in the crafted set", () => {
    renderTable(new Set(["Leaf"]));

    expect(socketIn(rowFor("Leaf"))).toHaveAttribute("aria-pressed", "true");
    expect(socketIn(rowFor("Steel"))).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles when the socket is clicked, exactly once", async () => {
    const { onToggle } = renderTable();

    await userEvent.click(socketIn(rowFor("Leaf")));

    // Once, not twice. The row's own handler sees the click too and has to
    // recognise that a control already dealt with it.
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle.mock.calls[0][0]).toBe("Leaf");
  });

  it("toggles when the row itself is clicked", async () => {
    const { onToggle } = renderTable();

    await userEvent.click(within(rowFor("Leaf")).getByText("19"));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle.mock.calls[0][0]).toBe("Leaf");
  });

  it("does not toggle when the name is clicked", async () => {
    const { onToggle } = renderTable();

    await userEvent.click(nameButtonIn(rowFor("Leaf")));

    // The detail view opened and nothing was marked. This is the collision
    // `runeword-table` recorded when it made the name a button.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("hands over the socket so an undo can restore focus to it", async () => {
    const { onToggle } = renderTable();
    const row = rowFor("Leaf");

    await userEvent.click(within(row).getByText("19"));

    // The row was clicked, not the socket, and the socket is still what comes
    // back — both paths record the same place for focus to return to.
    expect(onToggle.mock.calls[0][1]).toBe(socketIn(row));
  });

  it("does not toggle when the click ends a text selection", () => {
    const { onToggle } = renderTable();
    const cell = within(rowFor("Leaf")).getByText("Staves (Not Orbs/Wands)");

    // `removeAllRanges` first: `addRange` is specified to do nothing when the
    // selection already holds one, and an earlier `userEvent.click` in this
    // file leaves a collapsed range behind that would silently swallow this.
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(cell);
    selection?.removeAllRanges();
    selection?.addRange(range);

    // `fireEvent` rather than `userEvent` deliberately. A drag-to-select ends
    // with `click` dispatched while the selection is still standing, which is
    // exactly this; `userEvent.click` models a *plain* click and collapses the
    // selection first, so it can never reach the branch under test.
    fireEvent.click(cell);

    // Dragging across a row to copy it is not a request to mark anything.
    expect(onToggle).not.toHaveBeenCalled();

    selection?.removeAllRanges();
  });

  it("puts no row in the tab order", () => {
    renderTable();

    expect(
      screen.getAllByRole("row").filter((row) => row.hasAttribute("tabindex")),
    ).toEqual([]);
    expect(screen.queryAllByRole("button", { name: /^$/ })).toEqual([]);
  });

  it("keeps the rows as rows rather than as buttons", () => {
    renderTable(new Set(["Leaf"]));

    expect(screen.getAllByRole("row")).toHaveLength(100);
    expect(rowFor("Leaf").getAttribute("role")).toBeNull();
  });
});

/** The rendered rows' names, in the order they appear. */
function renderedNames() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => nameButtonIn(row).textContent);
}

function rowFor(name: string) {
  const row = screen.getByRole("button", { name }).closest("tr");

  if (!row) throw new Error(`No row for ${name}`);

  return row;
}

/**
 * The button that opens the detail view, which is the second in the row — the
 * crafted socket is now the first, and it draws no text of its own.
 */
function nameButtonIn(row: HTMLElement) {
  return within(row).getAllByRole("button")[1];
}

function socketIn(row: Element) {
  const socket = row.querySelector("[aria-pressed]");

  if (!(socket instanceof HTMLElement)) throw new Error("No socket in the row");

  return socket;
}

/**
 * A lookup of every rendered row by its runeword's name.
 *
 * Indexed once so the whole-dataset assertions above cost one pass over the
 * table rather than 99 role queries against a hundred-row document.
 */
function rowsByName() {
  const rows = new Map(
    screen
      .getAllByRole("row")
      .slice(1)
      .map((row): [string | null, HTMLElement] => [
        nameButtonIn(row).textContent,
        row,
      ]),
  );

  return (name: string) => {
    const row = rows.get(name);

    if (!row) throw new Error(`No row for ${name}`);

    return row;
  };
}

/**
 * The rune names of each cell in a row that renders a sequence — two of them,
 * one per breakpoint. jsdom applies no media queries, so both are present here;
 * which one a reader perceives is a browser check.
 */
function runeSequencesIn(row: Element) {
  return [...row.querySelectorAll("td")]
    .map((cell) =>
      [...cell.querySelectorAll(".rune-icon")].map((icon) =>
        icon.getAttribute("aria-label"),
      ),
    )
    .filter((sequence) => sequence.length > 0);
}
