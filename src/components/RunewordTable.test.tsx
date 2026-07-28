import { render, screen, within } from "@testing-library/react";

import { RunewordTable } from "@/components/RunewordTable";
import { runewords } from "@/data";
import { en } from "@/i18n/en";
import { itemTypesLabel } from "@/runewords/format";
import { orderedRunewords } from "@/runewords/order";

describe("the table's structure", () => {
  it("exposes a table with 99 rows beneath its header row", () => {
    render(<RunewordTable />);

    const rows = screen.getAllByRole("row");

    // The header row is a row too, so 99 runewords make 100.
    expect(rows).toHaveLength(100);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("associates every column header with its column", () => {
    render(<RunewordTable />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers.map((header) => header.textContent)).toEqual([
      en.table.columnName,
      en.table.columnRunes,
      en.table.columnItemTypes,
      en.table.columnRequiredLevel,
    ]);
    expect(headers.every((header) => header.getAttribute("scope") === "col"));
  });

  it("describes itself with a caption", () => {
    render(<RunewordTable />);

    expect(screen.getByText(en.table.caption).tagName).toBe("CAPTION");
  });

  it("renders every runeword exactly once", () => {
    render(<RunewordTable />);

    const names = runewords.map((runeword) => runeword.name);
    const duplicated = names.filter(
      (name) => screen.getAllByRole("button", { name }).length !== 1,
    );

    expect(duplicated).toEqual([]);
  });

  it("has no column for crafted state", () => {
    render(<RunewordTable />);

    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.queryAllByRole("checkbox")).toEqual([]);
  });

  it("presents the last row of the order without paging to it", () => {
    render(<RunewordTable />);

    const last = orderedRunewords[orderedRunewords.length - 1];

    expect(screen.getByRole("button", { name: last.name })).toBeInTheDocument();
  });
});

describe("the order rows appear in", () => {
  it("reads down the table in required-level order", () => {
    render(<RunewordTable />);

    expect(renderedNames()).toEqual(
      orderedRunewords.map((runeword) => runeword.name),
    );
  });

  it("does not present the dataset's storage order", () => {
    render(<RunewordTable />);

    expect(renderedNames()).not.toEqual(
      runewords.map((runeword) => runeword.name),
    );
  });

  it("renders the same sequence on a second render", () => {
    const first = render(<RunewordTable />);
    const before = renderedNames();
    first.unmount();

    render(<RunewordTable />);

    expect(renderedNames()).toEqual(before);
  });
});

describe("what a row carries", () => {
  it("carries the four values", () => {
    render(<RunewordTable />);

    const row = rowFor("Leaf");

    expect(within(row).getByRole("button", { name: "Leaf" })).toBeVisible();
    expect(within(row).getAllByRole("img", { name: "Tir" })).not.toHaveLength(
      0,
    );
    expect(within(row).getByText("Staves (Not Orbs/Wands)")).toBeVisible();
    expect(within(row).getByText("19")).toBeVisible();
  });

  it("keeps rune order and repeats — `Infinity` is Ber Mal Ber Ist", () => {
    render(<RunewordTable />);

    // Twice over, because the runes are rendered for both breakpoints. Reading
    // one cell rather than the row is what isolates a single sequence.
    const sequences = runeSequencesIn(rowFor("Infinity"));

    expect(sequences).toEqual([
      ["Ber", "Mal", "Ber", "Ist"],
      ["Ber", "Mal", "Ber", "Ist"],
    ]);
  });

  it("labels every rune icon with its own name", () => {
    render(<RunewordTable />);

    const rows = rowsByName();
    const wrong = orderedRunewords.filter((runeword) => {
      const [sequence] = runeSequencesIn(rows(runeword.name));

      return String(sequence) !== String(runeword.runes);
    });

    expect(wrong).toEqual([]);
  });

  it("lists multiple categories and puts a restriction in parentheses", () => {
    render(<RunewordTable />);

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
    render(<RunewordTable />);

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
    render(<RunewordTable />);

    const leaf = runewords.find((runeword) => runeword.name === "Leaf");

    expect(leaf?.itemTypeRestriction).toBe("Not Orbs/Wands");
  });

  it("does not link a category to a reference URL", () => {
    render(<RunewordTable />);

    expect(screen.queryAllByRole("link")).toEqual([]);
  });
});

describe("availability across the table", () => {
  it("marks exactly the 9 ladder-only rows", () => {
    const { container } = render(<RunewordTable />);

    expect(
      container.querySelectorAll(
        `[aria-label="${en.availability.ladderMeaning}"]`,
      ),
    ).toHaveLength(9);
  });

  it("shows all three markers on `Mosaic`", () => {
    render(<RunewordTable />);

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

/** The rendered rows' names, in the order they appear. */
function renderedNames() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("button")[0].textContent);
}

function rowFor(name: string) {
  const row = screen.getByRole("button", { name }).closest("tr");

  if (!row) throw new Error(`No row for ${name}`);

  return row;
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
        within(row).getAllByRole("button")[0].textContent,
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
