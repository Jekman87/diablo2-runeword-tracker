import { render, screen, within } from "@testing-library/react";

import { RemainingRunes } from "@/components/RemainingRunes";
import { en } from "@/i18n/en";
import type { RemainingRune } from "@/remaining/runes";

// The component takes the aggregation's output, so fixtures here are what
// `remainingRunes` is already proven to produce: canonical order, no zero
// counts. What the aggregation guarantees is tested there; what is asserted
// here is the banding, the announcement and the empty state.

const ONE_OF_EACH_TIER: RemainingRune[] = [
  { name: "El", tier: "common", count: 5 },
  { name: "Shael", tier: "semirare", count: 20 },
  { name: "Zod", tier: "rare", count: 3 },
];

describe("the tier bands", () => {
  it("presents three labelled bands in tier order", () => {
    render(<RemainingRunes runes={ONE_OF_EACH_TIER} />);

    // Level 4: this list sits under the runes section's `h3`, which sits under
    // the panel's `h2`. Asserted here as well as in `RemainingNeeds.test.tsx`,
    // because this is the file that would change the level.
    const labels = screen
      .getAllByRole("heading", { level: 4 })
      .map((heading) => heading.textContent);

    expect(labels).toEqual([
      en.remaining.tier.common,
      en.remaining.tier.semirare,
      en.remaining.tier.rare,
    ]);
  });

  it("puts each rune under its own tier", () => {
    render(<RemainingRunes runes={ONE_OF_EACH_TIER} />);

    const common = screen.getByRole("heading", {
      name: en.remaining.tier.common,
    }).parentElement;

    if (!common) throw new Error("The band has no container");

    expect(within(common).getByText("El")).toBeInTheDocument();
    expect(within(common).queryByText("Zod")).toBeNull();
  });

  it("omits a tier none of whose runes are needed", () => {
    render(
      <RemainingRunes
        runes={ONE_OF_EACH_TIER.filter((rune) => rune.tier !== "semirare")}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: en.remaining.tier.semirare }),
    ).toBeNull();
    expect(screen.queryByText("Shael")).toBeNull();
    expect(screen.getByText("El")).toBeInTheDocument();
    expect(screen.getByText("Zod")).toBeInTheDocument();
  });
});

describe("a rune's entry", () => {
  it("carries the name as text and the count in the copy layer's format", () => {
    render(<RemainingRunes runes={ONE_OF_EACH_TIER} />);

    expect(screen.getByText("Shael")).toBeInTheDocument();
    expect(screen.getByText(en.remaining.runeCount(20))).toBeInTheDocument();
  });

  it("announces the rune once, from the text and not the icon", () => {
    render(<RemainingRunes runes={ONE_OF_EACH_TIER} />);

    // The icon is present but decorative: no `img` role carries a rune's
    // name, so assistive technology reads each entry's name exactly once.
    expect(screen.queryByRole("img")).toBeNull();

    const entry = screen.getByText("Zod").closest("li");

    if (!entry) throw new Error("The entry is not a list item");

    expect(entry.querySelector(".rune-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

describe("nothing left", () => {
  it("says so through the strings layer rather than rendering nothing", () => {
    render(<RemainingRunes runes={[]} />);

    expect(screen.getByText(en.remaining.runesDone)).toBeInTheDocument();
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
