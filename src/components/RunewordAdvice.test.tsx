import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RunewordTable } from "@/components/RunewordTable";
import { type Runeword, runewords } from "@/data";
import { setLocale } from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";

// The advice surfaces, driven through the table like the detail view's tests:
// what is under test is the whole path — the trigger is the item-types cell of
// a memoised row, the open flag lives on the table and spans both panel kinds.
// What jsdom cannot answer stays a browser check: `safePolygon`'s geometry,
// real text selection, and the hover feel.

function renderTable(rows: readonly Runeword[] = runewords) {
  return render(
    <RunewordTable
      runewords={rows}
      crafted={new Set()}
      sortKey="requiredLevel"
      sortDirection="ascending"
      onSort={vi.fn()}
      onToggle={vi.fn()}
    />,
  );
}

function record(name: string): Runeword {
  const found = runewords.find((entry) => entry.name === name);

  if (!found) throw new Error(`No runeword named "${name}"`);

  return found;
}

/** A copy of a real record with the advice fields removed, both locales. */
function withoutAdvice(name: string): Runeword {
  const copy = structuredClone(record(name)) as Record<string, unknown>;
  delete copy.advice;
  delete copy.usefulness;
  delete (copy.ru as Record<string, unknown>).advice;

  return copy as unknown as Runeword;
}

afterEach(() => {
  setLocale("en");
});

describe("the usefulness line", () => {
  it("renders under the name, in the copy layer's words", () => {
    renderTable([record("Spirit")]);

    // `Spirit` is meta; the dataset value never appears verbatim.
    expect(screen.getByText(en.advice.usefulness.meta)).toBeVisible();
    expect(screen.queryByText("meta")).not.toBeInTheDocument();
  });

  it("follows the locale", () => {
    setLocale("ru");
    renderTable([record("Spirit")]);

    expect(screen.getByText(ru.advice.usefulness.meta)).toBeVisible();
    expect(
      screen.queryByText(en.advice.usefulness.meta),
    ).not.toBeInTheDocument();
  });

  it("renders no line at all on a record without one", () => {
    renderTable([withoutAdvice("Spirit")]);

    for (const label of Object.values(en.advice.usefulness)) {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    }
  });
});

describe("the advice panel", () => {
  it("opens from the item-types cell and shows the paragraphs", async () => {
    const user = userEvent.setup();
    renderTable([record("Spirit")]);

    await user.click(
      screen.getByRole("button", { name: en.advice.label("Spirit") }),
    );

    const panel = await screen.findByRole("dialog");

    expect(
      within(panel).getByRole("heading", { name: en.advice.heading }),
    ).toBeVisible();
    // By whole-paragraph text content rather than `getByText`: the rendered
    // paragraph is split by the roll-range emphasis spans.
    const rendered = [...panel.querySelectorAll("p")].map((p) => p.textContent);
    for (const paragraph of record("Spirit").advice?.paragraphs ?? []) {
      expect(rendered).toContain(paragraph);
    }
  });

  it("picks the roll ranges out of the prose", async () => {
    const user = userEvent.setup();
    renderTable([record("Spirit")]);

    await user.click(
      screen.getByRole("button", { name: en.advice.label("Spirit") }),
    );
    const panel = await screen.findByRole("dialog");

    // Spirit's advice names its faster-cast-rate roll; the range is what a
    // crafter has to pay attention to, so it renders emphasised.
    const emphasised = [...panel.querySelectorAll("em")].map(
      (em) => em.textContent,
    );

    expect(emphasised).toContain("25-35%");
  });

  it("renders the sources as real links that leave in a new tab", async () => {
    const user = userEvent.setup();
    renderTable([record("Spirit")]);

    await user.click(
      screen.getByRole("button", { name: en.advice.label("Spirit") }),
    );
    const panel = await screen.findByRole("dialog");

    const links = within(panel).getAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
    }
  });

  it("keeps its text selectable by declaration", async () => {
    // Real selection is a browser check; what jsdom can hold is that the panel
    // opts into selection rather than inheriting whatever the table does.
    const user = userEvent.setup();
    renderTable([record("Spirit")]);

    await user.click(
      screen.getByRole("button", { name: en.advice.label("Spirit") }),
    );

    expect((await screen.findByRole("dialog")).className).toContain(
      "select-text",
    );
  });

  it("projects the paragraphs in the active locale", async () => {
    setLocale("ru");
    const user = userEvent.setup();
    renderTable([record("Spirit")]);

    await user.click(
      screen.getByRole("button", {
        name: ru.advice.label(record("Spirit").ru?.name ?? "Spirit"),
      }),
    );
    const panel = await screen.findByRole("dialog");

    const rendered = [...panel.querySelectorAll("p")].map((p) => p.textContent);
    for (const paragraph of record("Spirit").ru?.advice?.paragraphs ?? []) {
      expect(rendered).toContain(paragraph);
    }
    for (const paragraph of record("Spirit").advice?.paragraphs ?? []) {
      expect(rendered).not.toContain(paragraph);
    }
  });

  it("offers no trigger and no panel on a record without advice", () => {
    renderTable([withoutAdvice("Spirit")]);

    expect(
      screen.queryByRole("button", { name: en.advice.label("Spirit") }),
    ).not.toBeInTheDocument();
    // The cell still shows its categories as plain text.
    expect(screen.getByText(/Shields/)).toBeInTheDocument();
  });
});

describe("one open panel across both kinds", () => {
  it("closes an open detail panel when advice opens", async () => {
    const user = userEvent.setup();
    renderTable([record("Spirit"), record("Leaf")]);

    await user.click(screen.getByRole("button", { name: "Spirit" }));
    expect(
      await screen.findByRole("dialog", { name: "Spirit" }),
    ).toBeInTheDocument();

    // `hidden: true` because the open panel is modal and the page behind it is
    // out of the accessibility tree — the very containment the detail view's
    // own tests assert.
    await user.click(
      screen.getByRole("button", {
        name: en.advice.label("Leaf"),
        hidden: true,
      }),
    );

    // One panel on the page, whatever its kind.
    expect(
      await screen.findByRole("dialog", { name: en.advice.heading }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: "Spirit" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("closes an open advice panel when details open", async () => {
    const user = userEvent.setup();
    renderTable([record("Spirit"), record("Leaf")]);

    await user.click(
      screen.getByRole("button", { name: en.advice.label("Leaf") }),
    );
    expect(
      await screen.findByRole("dialog", { name: en.advice.heading }),
    ).toBeInTheDocument();

    // `hidden: true` for the detail-view tests' reason: the open advice panel
    // is modal, so the page behind it is out of the accessibility tree.
    await user.click(
      screen.getByRole("button", { name: "Spirit", hidden: true }),
    );

    expect(
      await screen.findByRole("dialog", { name: "Spirit" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: en.advice.heading }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });
});
