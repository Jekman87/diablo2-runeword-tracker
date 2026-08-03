import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  RunewordTable,
  type RunewordTableProps,
} from "@/components/RunewordTable";
import { runewords } from "@/data";
import { en } from "@/i18n/en";
import { orderedRunewords } from "@/runewords/order";

/**
 * The table presenting every runeword in the default order, with nothing crafted
 * and handlers that go nowhere.
 *
 * Both the rows and the crafted set are `App`'s, so the table takes them as props.
 * Most of what is asserted below is presentation that depends on neither; the
 * tests that do pass their own.
 */
function renderTable(overrides: Partial<RunewordTableProps> = {}) {
  const onSort = vi.fn();
  const onToggle = vi.fn();

  return {
    onSort,
    onToggle,
    ...render(
      <RunewordTable
        runewords={orderedRunewords}
        crafted={new Set()}
        sortKey="requiredLevel"
        sortDirection="ascending"
        onSort={onSort}
        onToggle={onToggle}
        {...overrides}
      />,
    ),
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

    // The heading text, not the whole cell: the sorted column also draws a
    // direction arrow, which is decoration and is `aria-hidden`.
    expect(headers.map(headingOf)).toEqual([
      en.table.columnCrafted,
      en.table.columnName,
      en.table.columnRunes,
      en.table.columnItemTypes,
      en.table.columnRequiredLevel,
    ]);
    expect(
      headers.every((header) => header.getAttribute("scope") === "col"),
    ).toBe(true);
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

  it("renders whatever rows it is given, in the order it is given them", () => {
    // The table decides neither. `App` derives the array; a row withheld by a
    // filter never reaches here at all.
    const three = [named("Zephyr"), named("Leaf"), named("Enigma")];

    renderTable({ runewords: three });

    expect(renderedNames()).toEqual(["Zephyr", "Leaf", "Enigma"]);
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });
});

describe("sorting from the header row", () => {
  it("asks for a sort by the column that was activated", async () => {
    const { onSort } = renderTable();

    for (const [label, key] of [
      [en.table.columnCrafted, "crafted"],
      [en.table.columnName, "name"],
      [en.table.columnRunes, "runes"],
      [en.table.columnItemTypes, "itemTypes"],
    ] as const) {
      await userEvent.click(headerButtonFor(label));

      expect(onSort).toHaveBeenLastCalledWith(key);
    }

    expect(onSort).toHaveBeenCalledTimes(4);
  });

  it("asks for the sorted column again rather than a third state", async () => {
    // The flip lives in the settings, not here — three presses are three requests
    // for the same key, and there is no "unsorted" for the table to ask for.
    const { onSort } = renderTable({ sortKey: "name" });
    const header = headerButtonFor(en.table.columnName);

    await userEvent.click(header);
    await userEvent.click(header);
    await userEvent.click(header);

    expect(onSort.mock.calls).toEqual([["name"], ["name"], ["name"]]);
  });

  it("marks exactly one column as sorted", () => {
    renderTable({ sortKey: "name", sortDirection: "ascending" });

    const sorted = screen
      .getAllByRole("columnheader")
      .filter((header) => header.hasAttribute("aria-sort"));

    expect(sorted).toHaveLength(1);
    expect(headingOf(sorted[0])).toBe(en.table.columnName);
    expect(sorted[0]).toHaveAttribute("aria-sort", "ascending");
  });

  it("leaves `aria-sort` absent rather than `none` on the other four", () => {
    renderTable({ sortKey: "name" });

    // Absent, so assistive technology reports one sorted column instead of five
    // columns with opinions.
    expect(
      screen
        .getAllByRole("columnheader")
        .map((header) => header.getAttribute("aria-sort")),
    ).toEqual([null, "ascending", null, null, null]);
  });

  it("reports the direction in words as well as in the arrow", () => {
    renderTable({ sortKey: "runes", sortDirection: "descending" });

    expect(
      screen.getByRole("button", {
        name: en.sort.descending(en.table.columnRunes),
      }),
    ).toBeInTheDocument();
    // An unsorted column says what activating it will do, and nothing about a
    // direction it is not in.
    expect(
      screen.getByRole("button", { name: en.sort.by(en.table.columnName) }),
    ).toBeInTheDocument();
  });

  it("draws the arrow on the sorted column only, in space every column reserves", () => {
    renderTable({ sortKey: "name", sortDirection: "descending" });

    const slots = screen
      .getAllByRole("columnheader")
      .flatMap((header) => [
        ...header.querySelectorAll("[aria-hidden='true']"),
      ]);
    const drawn = slots.filter((slot) => slot.textContent?.trim() !== "");

    // All five reserve the space; exactly one fills it. Reserved on all of them
    // because an arrow appearing only on the sorted column made that column wider
    // than the rest and shifted the rows beside it on every press.
    expect(slots).toHaveLength(5);
    expect(drawn).toHaveLength(1);
    expect(headingOf(drawn[0].closest("th") as HTMLElement)).toBe(
      en.table.columnName,
    );
  });

  it("makes the whole cell the control, and the control a real button", async () => {
    const { onSort } = renderTable();
    const header = screen.getAllByRole("columnheader")[1];
    const control = within(header).getByRole("button");

    await userEvent.click(control);

    // Both halves matter and they used to pull against each other. The control has
    // to be a real `<button>` — that is what puts it in the tab order and makes
    // Space and Enter work — and it has to cover the cell, or a press two pixels to
    // the right of the word does nothing. It covers it by filling it rather than by
    // the cell growing a handler.
    expect(onSort).toHaveBeenCalledWith("name");
    expect(control.tagName).toBe("BUTTON");
    expect(header).toHaveClass("p-0");
    expect(control).toHaveClass("w-full");
    expect(header).not.toHaveAttribute("onclick");
  });

  it("is operable by keyboard", async () => {
    const { onSort } = renderTable();

    headerButtonFor(en.table.columnName).focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    expect(onSort.mock.calls).toEqual([["name"], ["name"]]);
  });

  it("declares its column widths rather than letting the rows decide", () => {
    const { container } = renderTable();

    // Auto layout sizes a column by the widest thing in it, so the columns were a
    // function of whichever rows a filter left behind. From `md` up the widths come
    // from the header row and the body is ignored; below it the runes collapse into
    // the name cell and no percentage survives six 40px icons, so that width keeps
    // the layout it always had.
    expect(container.querySelector("table")).toHaveClass(
      "table-auto",
      "md:table-fixed",
    );
    expect(
      screen
        .getAllByRole("columnheader")
        .map((header) =>
          [...header.classList].find((name) => name.startsWith("md:w-[")),
        ),
    ).toEqual([
      "md:w-[9%]",
      "md:w-[20%]",
      "md:w-[29%]",
      "md:w-[24%]",
      "md:w-[18%]",
    ]);
  });

  it("holds the header band at the top of the viewport", () => {
    const { container } = renderTable();

    // A sort control 7 000px above the row being read is not a control. jsdom
    // applies no layout, so what is asserted is the utility rather than the
    // position — the stacking against the detail panel is a browser check.
    expect(container.querySelector("thead")).toHaveClass("table-header-band");
  });
});

describe("when nothing matches", () => {
  it("explains itself inside the table", () => {
    renderTable({ runewords: [] });

    const message = screen.getByText(en.controls.empty);

    expect(message).toBeVisible();
    // Within the table rather than beside it, so a reader navigating by row
    // arrives at the explanation instead of at nothing.
    expect(message.closest("table")).toBe(screen.getByRole("table"));
    expect(message.closest("tbody")).not.toBeNull();
  });

  it("keeps the column headers and the table itself", () => {
    renderTable({ runewords: [] });

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(5);
    expect(screen.getByText(en.table.caption).tagName).toBe("CAPTION");
  });

  it("spans the full width as one cell, and renders no row", () => {
    renderTable({ runewords: [] });

    const cells = screen.getAllByRole("cell");

    expect(cells).toHaveLength(1);
    expect(cells[0]).toHaveAttribute("colspan", "5");
    // The header row and the message row, and no runeword row between them.
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("still offers the sort controls", async () => {
    const { onSort } = renderTable({ runewords: [] });

    await userEvent.click(headerButtonFor(en.table.columnName));

    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("carries a data row's own borders, so the columns do not shift", () => {
    const withRows = renderTable();
    const dataRow = screen.getAllByRole("row")[1];
    const borders = ["border-t", "border-l-4", "border-t-row-line"] as const;

    expect(dataRow).toHaveClass(...borders);
    withRows.unmount();

    renderTable({ runewords: [] });
    const messageRow = screen.getAllByRole("row")[1];

    // A row without the crafted accent's 4px border made the collapsed table 2px
    // narrower on that edge, and every column moved sideways the moment a filter
    // emptied the table. Measured sub-pixel in Chromium before and after.
    expect(messageRow).toHaveClass(...borders, "border-l-transparent");
  });
});

describe("what a row carries", () => {
  it("carries the four values", () => {
    renderTable();

    const row = rowFor("Leaf");

    expect(within(row).getByRole("button", { name: "Leaf" })).toBeVisible();
    // Twice over: the runes are rendered for both sides of the breakpoint.
    expect(within(row).getAllByText("Tir")).not.toHaveLength(0);
    expect(within(row).getByText("Staves")).toBeVisible();
    expect(within(row).getByText("(Not Orbs/Wands)")).toBeVisible();
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

  it("draws every rune's name beside its icon", () => {
    renderTable();

    const rows = rowsByName();
    const wrong = orderedRunewords.filter((runeword) => {
      const [sequence] = runeSequencesIn(rows(runeword.name));

      return String(sequence) !== String(runeword.runes);
    });

    expect(wrong).toEqual([]);
  });

  it("does not announce a rune's icon separately from its name", () => {
    renderTable();

    // The icons carry no accessible name of their own now. Left labelled, a
    // screen reader would announce 686 names for a table of 343 runes.
    //
    // Every icon, not every image in the row: the availability badges are still
    // images with names, and rightly so — a badge draws a marker rather than a
    // word, so its meaning has nowhere else to live.
    const icons = [...rowFor("Infinity").querySelectorAll(".rune-icon")];

    expect(icons).toHaveLength(8);
    expect(icons.every((icon) => icon.hasAttribute("aria-hidden"))).toBe(true);
    expect(icons.filter((icon) => icon.hasAttribute("aria-label"))).toEqual([]);
    expect(icons.filter((icon) => icon.getAttribute("role") === "img")).toEqual(
      [],
    );
  });

  it("lists multiple categories and sets a restriction apart from them", () => {
    renderTable();

    const rows = rowsByName();
    const wrong = orderedRunewords.filter((runeword) => {
      const row = within(rows(runeword.name));
      const categories = runeword.itemTypes.join(en.itemTypes.separator);

      if (row.queryByText(categories) === null) return true;

      return (
        runeword.itemTypeRestriction !== undefined &&
        row.queryByText(
          en.itemTypes.restriction(runeword.itemTypeRestriction),
        ) === null
      );
    });

    expect(wrong).toEqual([]);
  });

  it("puts the restriction on its own line, in its own colour", () => {
    renderTable();

    const row = within(rowFor("Leaf"));
    const categories = row.getByText("Staves");
    const restriction = row.getByText("(Not Orbs/Wands)");

    // Two elements, not one run of text — which is the whole reason
    // `itemTypesLabel` had to stop being a function returning `string`.
    expect(categories).not.toContainElement(restriction);
    expect(restriction).toHaveClass("text-item-restriction");
    // The colour is on the block around the categories: the words themselves
    // sit in an inner span so the advice underline can wrap with them.
    expect(categories.closest(".text-muted")).not.toBeNull();
  });

  it("renders no parentheses and no extra line where there is no restriction", () => {
    renderTable();

    const rows = rowsByName();
    const unrestricted = orderedRunewords.filter(
      (runeword) => runeword.itemTypeRestriction === undefined,
    );

    expect(unrestricted).toHaveLength(84);

    const bracketed = unrestricted.filter((runeword) => {
      const cell = within(rows(runeword.name))
        .getByText(runeword.itemTypes.join(en.itemTypes.separator))
        .closest("td");

      return cell?.textContent?.includes("(");
    });

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
  it("marks exactly the 8 ladder-only rows", () => {
    const { container } = renderTable();

    expect(
      container.querySelectorAll(
        `[aria-label="${en.availability.ladderMeaning}"]`,
      ),
    ).toHaveLength(8);
  });

  it("shows patch and note on `Mosaic`, without a ladder marker", () => {
    renderTable();

    const row = within(rowFor("Mosaic"));

    expect(
      row.getByRole("img", { name: en.availability.patchMeaning("2.6") }),
    ).toBeVisible();
    expect(
      row.queryByRole("img", { name: en.availability.ladderMeaning }),
    ).not.toBeInTheDocument();
    expect(row.getByText(en.availability.noteMarker)).toBeVisible();
  });
});

describe("marking a runeword crafted", () => {
  it("gives every row a socket", () => {
    renderTable();

    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(99);
  });

  it("shows the socket pressed for a runeword in the crafted set", () => {
    renderTable({ crafted: new Set(["Leaf"]) });

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

  it("does not toggle when plain text inside the open detail panel is clicked", async () => {
    const { onToggle } = renderTable();

    await userEvent.click(nameButtonIn(rowFor("Leaf")));
    const panel = screen.getByRole("dialog");

    // The panel is a portal: its DOM is outside the row, but its events still
    // bubble through the component tree into the row's click handler. A reader
    // clicking the panel's own text — mid-selection, or just resting the
    // pointer — must not be asked whether to mark the runeword underneath.
    await userEvent.click(within(panel).getByRole("heading", { name: "Leaf" }));

    expect(onToggle).not.toHaveBeenCalled();
  });

  it("hands over the socket so the confirmation can return focus to it", async () => {
    const { onToggle } = renderTable();
    const row = rowFor("Leaf");

    await userEvent.click(within(row).getByText("19"));

    // The row was clicked, not the socket, and the socket is still what comes
    // back — both paths record the same place for focus to return to.
    expect(onToggle.mock.calls[0][1]).toBe(socketIn(row));
  });

  it("does not toggle when the click ends a text selection", () => {
    const { onToggle } = renderTable();
    const cell = within(rowFor("Leaf")).getByText("Staves");

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
    renderTable({ crafted: new Set(["Leaf"]) });

    expect(screen.getAllByRole("row")).toHaveLength(100);
    expect(rowFor("Leaf").getAttribute("role")).toBeNull();
  });
});

/** The sort control heading a column, found by that column's own copy. */
function headerButtonFor(label: string) {
  const header = screen
    .getAllByRole("columnheader")
    .find((candidate) => headingOf(candidate) === label);

  if (!header) throw new Error(`No column headed ${label}`);

  return within(header).getByRole("button");
}

function named(name: string) {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}

/**
 * A column header's heading, without the direction arrow the sorted one draws.
 *
 * Read from the button rather than from the cell, because the arrow is a sibling
 * of the label inside it.
 */
function headingOf(header: HTMLElement) {
  return within(header).getByRole("button").firstChild?.textContent;
}

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
 *
 * Read as the text drawn beside each icon rather than as the icon's label. The
 * icons are decoration now, and reading the visible name is what proves the
 * sequence is legible to somebody who does not know the runes by silhouette.
 */
function runeSequencesIn(row: Element) {
  return [...row.querySelectorAll("td")]
    .map((cell) =>
      [...cell.querySelectorAll(".rune-icon")].map(
        (icon) => icon.nextElementSibling?.textContent,
      ),
    )
    .filter((sequence) => sequence.length > 0);
}
