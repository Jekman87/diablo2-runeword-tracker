import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "@/App";
import { CRAFTED_STORAGE_KEY } from "@/crafted/storage";
import { en } from "@/i18n/en";
import { VIEW_STORAGE_KEY } from "@/view/storage";

// The table's own behaviour is covered by `RunewordTable.test.tsx`, the controls
// by `RunewordControls.test.tsx` and the narrowing by `visible.test.ts`. What is
// asserted here is what the page shell owes: its title, that the table is its
// content, that the two pieces of state it owns reach everything that reads
// them — and, above all, what narrowing the view must **not** touch.

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

  it("exposes the header as a banner landmark outside main", () => {
    render(<App />);

    const banner = screen.getByRole("banner");

    // The whole reason the header is a sibling of `<main>` rather than its first
    // grid item: inside `main` the element exposes no landmark at all, and this
    // assertion is what would catch a later refactor wrapping the two in a grid.
    expect(banner).toBeInTheDocument();
    expect(banner.closest("main")).toBeNull();
    expect(within(banner).getByRole("heading", { level: 1 })).toHaveTextContent(
      en.app.title,
    );
  });

  it("keeps the structure below the divider where it was", () => {
    render(<App />);

    // Progress, the remaining-needs panel, the controls and the table, in that
    // order, and all of them inside `main` — the header went in above without
    // moving any of it.
    const main = screen.getByRole("main");
    const progress = screen.getByRole("progressbar");
    const search = screen.getByRole("searchbox");
    const table = screen.getByRole("table");

    expect(progress.closest("main")).toBe(main);
    expect(follows(remainingPanel(), progress)).toBe(true);
    expect(follows(search, remainingPanel())).toBe(true);
    expect(follows(table, search)).toBe(true);
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

describe("narrowing the table", () => {
  it("presents the rows a filter leaves and states how many", async () => {
    render(<App />);

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotHelm }),
    );

    expect(runewordRows()).toHaveLength(14);
    expect(screen.getByText(en.controls.count(14, 99))).toBeVisible();
  });

  it("narrows by search without a delay", async () => {
    render(<App />);

    await userEvent.type(screen.getByRole("searchbox"), "assassin");

    expect(runewordRows()).toHaveLength(4);
    expect(screen.getByText(en.controls.count(4, 99))).toBeVisible();
  });

  it("combines the three controls", async () => {
    render(<App />);

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotOffhand }),
    );
    await userEvent.type(screen.getByRole("searchbox"), "spirit");

    expect(runewordRows()).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Spirit" })).toBeInTheDocument();
  });

  it("explains an empty result inside the table", async () => {
    render(<App />);

    await userEvent.type(screen.getByRole("searchbox"), "qzx");

    expect(screen.getByText(en.controls.empty)).toBeVisible();
    expect(runewordRows()).toHaveLength(0);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText(en.controls.count(0, 99))).toBeVisible();
  });

  it("removes a row that stops matching the filter it is under", async () => {
    render(<App />);

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.craftedRemaining }),
    );
    await userEvent.click(socketFor("Steel"));

    // What is shown continues to answer the question that was asked.
    expect(screen.queryByRole("button", { name: "Steel" })).toBeNull();
    expect(runewordRows()).toHaveLength(98);
  });

  it("restores all 99 when the view is reset", async () => {
    render(<App />);

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotHelm }),
    );
    await userEvent.type(screen.getByRole("searchbox"), "dream");
    await userEvent.click(
      screen.getByRole("button", { name: en.controls.reset }),
    );

    expect(runewordRows()).toHaveLength(99);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });
});

describe("what narrowing the view must not change", () => {
  it("leaves the progress denominator at 99", async () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Steel","Leaf"]');

    render(<App />);

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotHelm }),
    );

    // `crafted-tracking` wrote the maximum as the dataset's length specifically
    // so that this change could not move it, and named the filter as the thing it
    // was defending against.
    expect(runewordRows()).toHaveLength(14);
    expect(screen.getByRole("progressbar")).toHaveAttribute("max", "99");
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      en.progress.count(2, 99),
    );
  });

  it("leaves the progress value alone when the crafted rows are hidden", async () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Steel","Leaf"]');

    render(<App />);

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.craftedRemaining }),
    );

    // It counts the set, not the rows.
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      en.progress.count(2, 99),
    );
  });

  it("writes nothing to progress", async () => {
    render(<App />);

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotOffhand }),
    );
    await userEvent.type(screen.getByRole("searchbox"), "spirit");
    await userEvent.click(headerButtonFor(en.table.columnName));

    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBeNull();
  });

  it("keeps the two stored values in separate keys", async () => {
    render(<App />);

    await userEvent.click(socketFor("Steel"));
    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotHelm }),
    );

    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe('["Steel"]');
    expect(
      JSON.parse(window.localStorage.getItem(VIEW_STORAGE_KEY) ?? "{}"),
    ).toMatchObject({ slotFilter: "helm" });
  });
});

describe("the sort the page owns", () => {
  it("reorders the table from a column header", async () => {
    render(<App />);

    await userEvent.click(headerButtonFor(en.table.columnName));

    expect(firstRowName()).toBe("Ancient's Pledge");
  });

  it("reverses when the sorted column is activated again", async () => {
    render(<App />);

    await userEvent.click(headerButtonFor(en.table.columnName));
    await userEvent.click(headerButtonFor(en.table.columnName));

    expect(firstRowName()).toBe("Zephyr");
  });

  it("shows the crafted ones first on one press of their header", async () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Enigma","Zephyr"]');

    render(<App />);

    await userEvent.click(headerButtonFor(en.table.columnCrafted));

    // One press, not two. Every other column starts ascending; this one starts
    // descending, because "what have I made" is the question a player pressing it
    // is asking.
    expect(runewordRows()).toHaveLength(99);
    expect([firstRowName(), nthRowName(1)].sort()).toEqual([
      "Enigma",
      "Zephyr",
    ]);
  });

  it("shows what is left on a second press of the crafted header", async () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Enigma","Zephyr"]');

    render(<App />);

    await userEvent.click(headerButtonFor(en.table.columnCrafted));
    await userEvent.click(headerButtonFor(en.table.columnCrafted));

    expect([firstRowName(), nthRowName(1)]).not.toContain("Enigma");
  });

  it("keeps the sort through a reset", async () => {
    render(<App />);

    await userEvent.click(headerButtonFor(en.table.columnName));
    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotHelm }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: en.controls.reset }),
    );

    // Resetting is about what is hidden, not about the order.
    expect(runewordRows()).toHaveLength(99);
    expect(firstRowName()).toBe("Ancient's Pledge");
  });
});

describe("the view an earlier session left behind", () => {
  it("applies a stored filter on load", () => {
    window.localStorage.setItem(
      VIEW_STORAGE_KEY,
      JSON.stringify({
        sortKey: "requiredLevel",
        sortDirection: "ascending",
        craftedFilter: "all",
        slotFilter: "helm",
      }),
    );

    render(<App />);

    // The narrowed table is what renders, with no frame of the full one first.
    expect(runewordRows()).toHaveLength(14);
    expect(screen.getByText(en.controls.count(14, 99))).toBeVisible();
    expect(
      screen.getByRole("button", { name: en.controls.reset }),
    ).toBeVisible();
  });

  it("applies a stored sort on load", () => {
    window.localStorage.setItem(
      VIEW_STORAGE_KEY,
      JSON.stringify({
        sortKey: "name",
        sortDirection: "descending",
        craftedFilter: "all",
        slotFilter: "all",
      }),
    );

    render(<App />);

    expect(firstRowName()).toBe("Zephyr");
    expect(
      screen.getByRole("button", {
        name: en.sort.descending(en.table.columnName),
      }),
    ).toBeInTheDocument();
  });

  it("does not bring a search query back", () => {
    window.localStorage.setItem(
      VIEW_STORAGE_KEY,
      JSON.stringify({
        sortKey: "requiredLevel",
        sortDirection: "ascending",
        craftedFilter: "all",
        slotFilter: "all",
        query: "spirit",
      }),
    );

    render(<App />);

    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(runewordRows()).toHaveLength(99);
  });

  it("falls back to the full table on a corrupt value", () => {
    window.localStorage.setItem(VIEW_STORAGE_KEY, "not json");

    render(<App />);

    expect(runewordRows()).toHaveLength(99);
    expect(
      screen.queryByRole("button", { name: en.controls.reset }),
    ).toBeNull();
  });
});

describe("the remaining-needs panel", () => {
  it("mounts one panel between progress and the controls, closed", () => {
    render(<App />);

    // One, not two: the runes and the bases are sections of it now, and both
    // arrive with the single press this asserts is available. Counted as
    // disclosures rather than by the `group` role, which the controls' two
    // fieldsets also carry.
    expect(screen.getByRole("main").querySelectorAll("details")).toHaveLength(
      1,
    );
    expect(remainingPanel().open).toBe(false);

    // Document order: progress, then the panel, then the search field.
    const progress = screen.getByRole("progressbar");
    const search = screen.getByRole("searchbox");

    expect(follows(remainingPanel(), progress)).toBe(true);
    expect(follows(search, remainingPanel())).toBe(true);
  });

  it("brings both lists with one press", async () => {
    render(<App />);

    await userEvent.click(summaryFor(en.remaining.title));

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: en.remaining.runesSection,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: en.remaining.basesSection,
      }),
    ).toBeVisible();
  });

  it("updates both lists from one toggle, with no reload anywhere", async () => {
    render(<App />);

    await userEvent.click(summaryFor(en.remaining.title));

    // Steel is Tir El in a two-socket sword, axe or mace — and the only
    // two-socket sword there is, so its group must leave entirely.
    expect(runeCountFor("El")).toBe(en.remaining.runeCount(9));
    expect(runeCountFor("Tir")).toBe(en.remaining.runeCount(14));
    expect(baseRowFor("Swords", 2)).not.toBeNull();

    await userEvent.click(socketFor("Steel"));

    expect(runeCountFor("El")).toBe(en.remaining.runeCount(8));
    expect(runeCountFor("Tir")).toBe(en.remaining.runeCount(13));
    expect(baseRowFor("Swords", 2)).toBeNull();
  });

  it("restores both lists when the undo is taken", async () => {
    render(<App />);

    await userEvent.click(summaryFor(en.remaining.title));
    await userEvent.click(socketFor("Steel"));
    await userEvent.click(screen.getByRole("button", { name: en.undo.action }));

    expect(runeCountFor("El")).toBe(en.remaining.runeCount(9));
    expect(runeCountFor("Tir")).toBe(en.remaining.runeCount(14));
    expect(baseRowFor("Swords", 2)).not.toBeNull();
  });

  it("reads the same crafted set the progress indicator does", async () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Steel","Leaf"]');

    render(<App />);

    await userEvent.click(summaryFor(en.remaining.title));

    // Steel and Leaf each spend one Tir; only Steel spends an El. Two crafted
    // in the bar, and the counts move with the same two — one set, three
    // readers.
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      en.progress.count(2, 99),
    );
    expect(runeCountFor("El")).toBe(en.remaining.runeCount(8));
    expect(runeCountFor("Tir")).toBe(en.remaining.runeCount(12));
  });
});

describe("moving progress in and out as a file", () => {
  // The parsing, the count and the dialog's own behaviour are
  // `ProgressTransfer.test.tsx`'s. What is asserted here is the wiring the page
  // owns: that a confirmed import reaches everything a toggle reaches, and that
  // it replaces rather than adds.

  it("puts both controls in the browsing controls, reachable by keyboard", () => {
    render(<App />);

    for (const name of [en.transfer.exportAction, en.transfer.importAction]) {
      const control = screen.getByRole("button", { name });

      // In the control bar rather than in a bar of its own: the search field is
      // the bar's first control, and both of these are inside the same block.
      expect(control.closest("main")).toBe(screen.getByRole("main"));
      expect(follows(control, screen.getByRole("searchbox"))).toBe(true);
      expect(follows(screen.getByRole("table"), control)).toBe(true);
      expect(control).not.toHaveAttribute("tabindex", "-1");
    }
  });

  it("replaces progress rather than adding to it", async () => {
    render(<App />);

    await userEvent.click(socketFor("Steel"));
    await importFile("Leaf\nMalice");

    // `Steel` was marked and the file does not name it, so it is unmarked —
    // this is the assertion that separates a replacement from a merge.
    expect(socketFor("Steel")).toHaveAttribute("aria-pressed", "false");
    expect(socketFor("Leaf")).toHaveAttribute("aria-pressed", "true");
    expect(socketFor("Malice")).toHaveAttribute("aria-pressed", "true");
  });

  it("reaches the progress bar and storage from one import", async () => {
    render(<App />);

    await importFile("Leaf\nMalice\nSteel");

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      en.progress.count(3, 99),
    );
    expect(
      JSON.parse(window.localStorage.getItem(CRAFTED_STORAGE_KEY) ?? "[]"),
    ).toEqual(["Leaf", "Malice", "Steel"]);
  });

  it("takes the pending undo notice away with it", async () => {
    render(<App />);

    await userEvent.click(socketFor("Steel"));
    expect(screen.getByText(en.undo.marked("Steel"))).toBeVisible();

    await importFile("Leaf");

    // The notice offered to unmark `Steel`. After the import there is no toggle
    // for it to reverse, so it goes rather than sitting there acting on a set
    // that no longer exists.
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("changes nothing when the confirmation is cancelled", async () => {
    render(<App />);

    await userEvent.click(socketFor("Steel"));
    await chooseFile("Leaf");
    await userEvent.click(
      screen.getByRole("button", { name: en.transfer.confirmCancel }),
    );

    expect(socketFor("Steel")).toHaveAttribute("aria-pressed", "true");
    expect(socketFor("Leaf")).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe('["Steel"]');
  });
});

/** Chooses a file and leaves the confirmation open. */
async function chooseFile(text: string) {
  await userEvent.upload(
    screen.getByLabelText(en.transfer.importAction),
    new File([text], "progress.csv", { type: "text/csv" }),
  );

  await screen.findByRole("alertdialog");
}

/** Chooses a file and confirms the replacement. */
async function importFile(text: string) {
  await chooseFile(text);

  await userEvent.click(
    screen.getByRole("button", { name: en.transfer.confirmAccept }),
  );
}

/** The runeword rows, without the header row or an empty-state row. */
function runewordRows() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .filter((row) => row.querySelector("[aria-pressed]") !== null);
}

function firstRowName() {
  return nthRowName(0);
}

/** The runeword name in the nth presented row, counting from zero. */
function nthRowName(index: number) {
  return within(runewordRows()[index]).getAllByRole("button")[1].textContent;
}

/** The sort control heading a column, found by that column's own copy. */
function headerButtonFor(label: string) {
  const header = screen
    .getAllByRole("columnheader")
    .find(
      (candidate) =>
        within(candidate).getByRole("button").firstChild?.textContent === label,
    );

  if (!header) throw new Error(`No column headed ${label}`);

  return within(header).getByRole("button");
}

/** The one remaining-needs panel. */
function remainingPanel(): HTMLDetailsElement {
  const panel = screen.getByText(en.remaining.title).closest("details");

  if (!panel) throw new Error("No remaining-needs panel");

  return panel;
}

/** The disclosure control of the panel titled `title`. */
function summaryFor(title: string): HTMLElement {
  const summary = screen.getByText(title).closest("summary");

  if (!summary) throw new Error(`No summary titled ${title}`);

  return summary;
}

/**
 * The section of the remaining-needs panel headed `heading`.
 *
 * By heading role inside the panel rather than by text anywhere on the page:
 * "Runes" is also a table column and a detail-view label, so a text match finds
 * three things and fails on the wrong one.
 */
function sectionFor(heading: string): HTMLElement {
  const section = within(remainingPanel())
    .getByRole("heading", { level: 3, name: heading })
    .closest("section");

  if (!section) throw new Error(`No section headed ${heading}`);

  return section;
}

/** The count beside one rune's name in the runes section. */
function runeCountFor(name: string) {
  const entry = within(sectionFor(en.remaining.runesSection))
    .getByText(name)
    .closest("li");

  if (!entry) throw new Error(`No entry for ${name}`);

  return entry.lastChild?.textContent;
}

/** The `(category, sockets)` row of the bases section, or null. */
function baseRowFor(category: string, sockets: number) {
  return (
    within(sectionFor(en.remaining.basesSection))
      .getAllByRole("listitem")
      .find(
        (row) =>
          row.firstChild?.textContent === category &&
          within(row).queryByText(en.remaining.baseSockets(sockets)) !== null,
      ) ?? null
  );
}

/** Whether `later` comes after `earlier` in document order. */
function follows(later: Node, earlier: Node) {
  return Boolean(
    earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
}

/** The crafted socket in the row whose name button reads `name`. */
function socketFor(name: string) {
  const row = screen.getByRole("button", { name }).closest("tr");

  if (!row) throw new Error(`No row for ${name}`);

  return within(row).getByRole("button", {
    name: new RegExp(`^Mark ${name} as`),
  });
}
