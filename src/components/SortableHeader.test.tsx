import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SortableHeader } from "@/components/SortableHeader";
import { en } from "@/i18n/en";
import type { SortDirection } from "@/runewords/sort";

// The header in isolation. What it does inside the real table is covered by
// `RunewordTable.test.tsx`; what is asserted here is the part that is this
// component's own — the three accessible names, `aria-sort` being absent rather
// than `"none"`, and the arrow being decoration.
//
// Wrapped in a table because a `<th>` outside one is invalid markup, and an
// invalid ancestor chain costs the `columnheader` role the test then queries by.

function renderHeader({
  direction,
  align,
  className,
}: {
  direction?: SortDirection;
  align?: "start" | "end";
  className?: string;
} = {}) {
  const onSort = vi.fn();

  return {
    onSort,
    ...render(
      <table>
        <thead>
          <tr>
            <SortableHeader
              sortKey="name"
              label={en.table.columnName}
              direction={direction}
              onSort={onSort}
              align={align}
              className={className}
            />
          </tr>
        </thead>
      </table>,
    ),
  };
}

describe("the control", () => {
  it("is a button inside the column header it heads", () => {
    renderHeader();

    const header = screen.getByRole("columnheader");

    expect(header.tagName).toBe("TH");
    expect(header).toHaveAttribute("scope", "col");
    expect(within(header).getByRole("button").tagName).toBe("BUTTON");
  });

  it("reports its own key rather than closing over one", async () => {
    const { onSort } = renderHeader();

    await userEvent.click(screen.getByRole("button"));

    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("is operable by keyboard", async () => {
    const { onSort } = renderHeader();

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    // A real button, so both keys work without a `keydown` handler being written.
    expect(onSort).toHaveBeenCalledTimes(2);
  });

  it("asks for the same key however many times it is activated", async () => {
    const { onSort } = renderHeader({ direction: "ascending" });

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));

    // The flip is the settings' business. This component has no state to cycle.
    expect(onSort.mock.calls).toEqual([["name"], ["name"]]);
  });
});

describe("what it says about the sort", () => {
  it("says only what activating it will do when the column is not sorted", () => {
    renderHeader();

    expect(screen.getByRole("columnheader")).not.toHaveAttribute("aria-sort");
    expect(
      screen.getByRole("button", { name: en.sort.by(en.table.columnName) }),
    ).toBeInTheDocument();
  });

  it("leaves `aria-sort` absent rather than setting it to `none`", () => {
    renderHeader();

    // Absent, so a reader is told about one sorted column rather than five
    // columns each with an opinion about not being it.
    expect(
      screen.getByRole("columnheader").getAttribute("aria-sort"),
    ).toBeNull();
  });

  it("reports the direction in the attribute and in words", () => {
    for (const direction of ["ascending", "descending"] as const) {
      const { unmount } = renderHeader({ direction });

      expect(screen.getByRole("columnheader")).toHaveAttribute(
        "aria-sort",
        direction,
      );
      expect(
        screen.getByRole("button", {
          name: en.sort[direction](en.table.columnName),
        }),
      ).toBeInTheDocument();

      unmount();
    }
  });

  it("reserves the arrow's space whether or not it draws one", () => {
    const plain = renderHeader();
    const empty = screen
      .getByRole("columnheader")
      .querySelector("[aria-hidden='true']");

    // The box is always there, and holds a non-breaking space when the column is
    // not sorted. Drawn only on the sorted column, the arrow made that column wider
    // than the other four and resized it on every press.
    expect(empty).not.toBeNull();
    expect(empty).toHaveClass("w-3");
    expect(empty?.textContent).toBe("\u00A0");
    plain.unmount();

    renderHeader({ direction: "descending" });
    const arrow = screen
      .getByRole("columnheader")
      .querySelector("[aria-hidden='true']");

    // Decoration: the accessible name and `aria-sort` already carry the
    // direction, so the glyph is never the only thing that does.
    expect(arrow?.textContent).toBe("↓");
    expect(arrow).toHaveClass("w-3");
  });

  it("keeps the arrow out of the accessible name", () => {
    renderHeader({ direction: "ascending" });

    expect(screen.getByRole("button").getAttribute("aria-label")).not.toContain(
      "↑",
    );
  });
});

describe("how it is drawn", () => {
  it("takes the sorted band from a token, not a literal colour", () => {
    renderHeader({ direction: "ascending" });

    expect(screen.getByRole("columnheader")).toHaveClass("bg-blood-light");
  });

  it("carries no band when it is not the sorted column", () => {
    renderHeader();

    expect(screen.getByRole("columnheader")).not.toHaveClass("bg-blood-light");
  });

  it("accepts the cell's own classes without losing its base ones", () => {
    renderHeader({ className: "rounded-tr-xs whitespace-nowrap" });

    const header = screen.getByRole("columnheader");

    // The responsive collapse and the corner belong to the column, not to this
    // component, so they arrive as a prop and must not replace the cell's own.
    expect(header).toHaveClass(
      "rounded-tr-xs",
      "whitespace-nowrap",
      "font-normal",
    );
  });

  it("fills the cell, so a press anywhere in the header sorts", () => {
    renderHeader();

    const header = screen.getByRole("columnheader");
    const control = within(header).getByRole("button");

    // The padding is on the control and not on the cell, which is what makes the
    // whole header the hit target rather than the few pixels the text occupies.
    // jsdom does no hit testing, so this is structural; the behaviour is a browser
    // check.
    expect(header).toHaveClass("p-0");
    expect(control).toHaveClass("w-full", "p-2");
  });

  it("aligns the heading to the edge it is asked to", () => {
    const left = renderHeader();

    expect(
      within(screen.getByRole("columnheader")).getByRole("button"),
    ).toHaveClass("justify-start");
    left.unmount();

    renderHeader({ align: "end" });

    // A full-width flex control does not honour its parent's `text-align`, which is
    // why this is a prop rather than `text-right` in the cell's classes.
    expect(
      within(screen.getByRole("columnheader")).getByRole("button"),
    ).toHaveClass("justify-end");
  });
});
