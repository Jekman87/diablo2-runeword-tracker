import { render, screen, within } from "@testing-library/react";

import { RemainingNeeds } from "@/components/RemainingNeeds";
import { en } from "@/i18n/en";
import type { RemainingBase } from "@/remaining/bases";
import type { RemainingRune } from "@/remaining/runes";

// What the merge owes: both lists still reachable, each under a heading naming it,
// in a heading order a reader navigating by headings can follow, and each half
// still saying so when it has nothing left. What each list *contains* is
// `RemainingRunes.test.tsx` and `RemainingBases.test.tsx`; this is about the two
// of them being one panel's content.

const RUNES: RemainingRune[] = [
  { name: "El", tier: "common", count: 9 },
  { name: "Jah", tier: "rare", count: 2 },
];

const BASES: RemainingBase[] = [
  { category: "Swords", sockets: 2, count: 1 },
  { category: "Body Armors", sockets: 4, count: 3 },
];

describe("the remaining-needs panel content", () => {
  it("presents both lists under their own headings, runes first", () => {
    render(<RemainingNeeds runes={RUNES} bases={BASES} />);

    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(headings).toEqual([
      en.remaining.runesSection,
      en.remaining.basesSection,
    ]);
  });

  it("keeps each list inside its own section", () => {
    render(<RemainingNeeds runes={RUNES} bases={BASES} />);

    expect(
      within(sectionFor(en.remaining.runesSection)).getByText("El"),
    ).toBeVisible();
    expect(
      within(sectionFor(en.remaining.basesSection)).getByText("Swords"),
    ).toBeVisible();

    // And not in each other's.
    expect(
      within(sectionFor(en.remaining.runesSection)).queryByText("Swords"),
    ).toBeNull();
    expect(
      within(sectionFor(en.remaining.basesSection)).queryByText("El"),
    ).toBeNull();
  });

  it("puts the tier bands one level below the section that holds them", () => {
    // `h1` page title, `h2` panel title, `h3` section, `h4` tier — asserted
    // because a skipped or repeated level is invisible to everyone except the
    // reader who navigates by headings.
    render(<RemainingNeeds runes={RUNES} bases={BASES} />);

    const tiers = screen
      .getAllByRole("heading", { level: 4 })
      .map((heading) => heading.textContent);

    expect(tiers).toEqual([en.remaining.tier.common, en.remaining.tier.rare]);
  });

  it("keeps both headings when one list is empty", () => {
    render(<RemainingNeeds runes={[]} bases={BASES} />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: en.remaining.runesSection,
      }),
    ).toBeVisible();
    expect(screen.getByText(en.remaining.runesDone)).toBeVisible();
    expect(screen.getByText("Swords")).toBeVisible();
  });

  it("says so in both halves when everything is crafted", () => {
    render(<RemainingNeeds runes={[]} bases={[]} />);

    expect(screen.getByText(en.remaining.runesDone)).toBeVisible();
    expect(screen.getByText(en.remaining.basesDone)).toBeVisible();
  });
});

/** The section whose heading reads `heading`. */
function sectionFor(heading: string): HTMLElement {
  const section = screen
    .getByRole("heading", { level: 3, name: heading })
    .closest("section");

  if (!section) throw new Error(`No section headed ${heading}`);

  return section;
}
