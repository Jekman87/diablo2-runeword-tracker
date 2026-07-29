import { render, screen, within } from "@testing-library/react";

import { RemainingBases } from "@/components/RemainingBases";
import { en } from "@/i18n/en";
import type { RemainingBase } from "@/remaining/bases";

// Fixtures are what `remainingBases` is proven to produce: category order,
// ascending sockets within one, no zero counts. The aggregation's own tests
// carry those guarantees; asserted here is the row, the order's preservation
// and the empty state.

const SAMPLE: RemainingBase[] = [
  { category: "Body Armors", sockets: 2, count: 3 },
  { category: "Body Armors", sockets: 3, count: 15 },
  { category: "Polearms", sockets: 4, count: 4 },
  { category: "Weapons", sockets: 5, count: 1 },
];

describe("a base's row", () => {
  it("carries the category, the socket count and what the count serves", () => {
    render(<RemainingBases bases={SAMPLE} />);

    const row = screen.getByText("Polearms").closest("li");

    if (!row) throw new Error("The row is not a list item");

    expect(within(row).getByText(en.remaining.baseSockets(4))).toBeVisible();
    expect(within(row).getByText(en.remaining.baseCount(4))).toBeVisible();
  });

  it("speaks of one runeword in the singular", () => {
    render(<RemainingBases bases={SAMPLE} />);

    const row = screen.getByText("Weapons").closest("li");

    if (!row) throw new Error("The row is not a list item");

    expect(within(row).getByText("serves 1 runeword")).toBeVisible();
  });
});

describe("the list's order", () => {
  it("matches the aggregation's, with nothing re-sorted here", () => {
    render(<RemainingBases bases={SAMPLE} />);

    const rows = screen
      .getAllByRole("listitem")
      .map((row) => row.firstChild?.textContent);

    expect(rows).toEqual(["Body Armors", "Body Armors", "Polearms", "Weapons"]);
  });
});

describe("nothing left", () => {
  it("says so through the strings layer rather than rendering nothing", () => {
    render(<RemainingBases bases={[]} />);

    expect(screen.getByText(en.remaining.basesDone)).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).toBeNull();
  });
});
