import { render, screen } from "@testing-library/react";

import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { type Runeword, runewords } from "@/data";
import { en } from "@/i18n/en";

describe("AvailabilityBadges", () => {
  it("renders all three for `Mosaic`", () => {
    const mosaic = named("Mosaic");

    render(<AvailabilityBadges runeword={mosaic} />);

    expect(
      screen.getByRole("img", { name: en.availability.patchMeaning("2.6") }),
    ).toHaveTextContent("2.6");
    expect(
      screen.getByRole("img", { name: en.availability.ladderMeaning }),
    ).toHaveTextContent(en.availability.ladderMarker);
    expect(screen.getByRole("img", { name: mosaic.note })).toHaveTextContent(
      en.availability.noteMarker,
    );
  });

  it("states a badge's meaning rather than the letter it draws", () => {
    render(<AvailabilityBadges runeword={named("Mosaic")} />);

    const ladder = screen.getByRole("img", {
      name: en.availability.ladderMeaning,
    });

    expect(ladder).not.toHaveAccessibleName(en.availability.ladderMarker);
    expect(ladder).toHaveAttribute("title", en.availability.ladderMeaning);
  });

  it("renders nothing for a runeword predating patch tracking", () => {
    const untracked = runewords.find(
      (runeword) =>
        !runeword.patch && !runeword.ladderOnly && runeword.note === undefined,
    );

    expect(untracked).toBeDefined();

    const { container } = render(
      <AvailabilityBadges runeword={untracked as Runeword} />,
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryAllByRole("img")).toEqual([]);
  });

  it("marks exactly the 9 ladder-only runewords", () => {
    const { container } = render(
      <ul>
        {runewords.map((runeword) => (
          <li key={runeword.name}>
            <AvailabilityBadges runeword={runeword} />
          </li>
        ))}
      </ul>,
    );

    const ladder = container.querySelectorAll(
      `[aria-label="${en.availability.ladderMeaning}"]`,
    );

    expect(ladder).toHaveLength(9);
  });

  it("marks exactly the one runeword carrying a note", () => {
    const noted = runewords.filter((runeword) => runeword.note !== undefined);

    expect(noted.map((runeword) => runeword.name)).toEqual(["Mosaic"]);
  });
});

function named(name: string) {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}
