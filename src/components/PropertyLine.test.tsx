import { render, screen } from "@testing-library/react";

import { PropertyLine } from "@/components/PropertyLine";
import { runewords } from "@/data";

// The round-trip is asserted over every line in the dataset, not a sample. A
// sample is exactly how a dropped sign survives: the pattern that loses the `-`
// from `-25% Target Defense` renders `+50% Enhanced Defense` perfectly.

const allLines = runewords.flatMap((runeword) =>
  runeword.propertyGroups.flatMap((group) => group.properties),
);

const allRussianLines = runewords.flatMap(
  (runeword) =>
    runeword.ru?.propertyGroups.flatMap((group) => group.properties) ?? [],
);

describe("the round-trip over the whole dataset", () => {
  it("holds 969 property lines to check", () => {
    expect(allLines).toHaveLength(969);
  });

  it("reproduces every line exactly from its rendered fragments", () => {
    expect(roundTrip(allLines)).toEqual(allLines);
  });

  it("reproduces every Russian line exactly as well", () => {
    // The same assertion over the other language, and it is not a formality:
    // the split is by numeric pattern, and Russian lines put their numbers in
    // different places — «Похищает 7% здоровья за удар» leads with a word where
    // the English leads with the value, and «+(5-30) урона от огня» wraps a
    // range in brackets the English does not have.
    expect(allRussianLines).toHaveLength(969);
    expect(roundTrip(allRussianLines)).toEqual(allRussianLines);
  });
});

describe("which fragments are emphasised", () => {
  it("emphasises the value and not the words", () => {
    const { emphasised, text } = renderLine("+50% Enhanced Defense");

    expect(emphasised).toEqual(["+50%"]);
    expect(text).toBe("+50% Enhanced Defense");
  });

  it("keeps a leading minus inside the emphasised value", () => {
    const { emphasised, text } = renderLine("-33% Extra Gold From Monsters");

    expect(emphasised).toEqual(["-33%"]);
    expect(text).toBe("-33% Extra Gold From Monsters");
  });

  it("emphasises a range as one value", () => {
    const { emphasised } = renderLine("+8-15% to Cold Skill Damage");

    expect(emphasised).toEqual(["+8-15%"]);
  });

  it("does not confuse a range with a standalone hyphen", () => {
    const line = "Adds 3-14 Cold Damage - Cold Duration 3 Seconds";
    const { emphasised, text } = renderLine(line);

    expect(emphasised).toEqual(["3-14", "3"]);
    expect(text).toBe(line);
  });

  it("emphasises a decimal range", () => {
    const { emphasised } = renderLine("+0.375-37.125 To Strength");

    expect(emphasised).toEqual(["+0.375-37.125"]);
  });

  it("renders a line with no digit as one unemphasised fragment", () => {
    const { emphasised, text } = renderLine("Prevent Monster Heal");

    expect(emphasised).toEqual([]);
    expect(text).toBe("Prevent Monster Heal");
  });

  it("emphasises the value in a Russian line, and only the value", () => {
    const { emphasised, text } = renderLine("+50% к защите");

    expect(emphasised).toEqual(["+50%"]);
    expect(text).toBe("+50% к защите");
  });

  it("emphasises a value that follows Russian words", () => {
    // The English line leads with its value; this one does not, and the split
    // has to find it in the middle just the same.
    const { emphasised, text } = renderLine("Похищает 7% здоровья за удар");

    expect(emphasised).toEqual(["7%"]);
    expect(text).toBe("Похищает 7% здоровья за удар");
  });

  it("emphasises a bracketed Russian range as one value", () => {
    // The brackets are the site's own convention and are not part of the value,
    // so they stay in the unemphasised text around it.
    const { emphasised, text } = renderLine("+(5-30) урона от огня");

    expect(emphasised).toEqual(["5-30"]);
    expect(text).toBe("+(5-30) урона от огня");
  });

  it("emphasises both values in a Russian line that carries two", () => {
    const line = "+2 урона от яда за 4 сек.";
    const { emphasised, text } = renderLine(line);

    expect(emphasised).toEqual(["+2", "4"]);
    expect(text).toBe(line);
  });

  it("emphasises a value in every Russian line that carries a digit", () => {
    // The mechanism holding is the claim: Russian lines keep Arabic digits,
    // `+`, `%` and hyphenated ranges, so every line with a number in it gets
    // that number picked out rather than rendering flat.
    const withDigits = allRussianLines.filter((line) => /\d/.test(line));
    const unemphasised = withDigits.filter(
      (line) => renderLine(line).emphasised.length === 0,
    );

    expect(withDigits.length).toBeGreaterThan(900);
    expect(unemphasised).toEqual([]);
  });

  it("leaves all 60 digitless lines unemphasised", () => {
    const digitless = allLines.filter((line) => !/\d/.test(line));

    // Sixty rather than the old sixty-six: the six `####` headings the
    // generator used to pass through were digitless lines too.
    expect(digitless).toHaveLength(60);

    const emphasisedAnywhere = digitless.filter(
      (line) => renderLine(line).emphasised.length > 0,
    );

    expect(emphasisedAnywhere).toEqual([]);
  });
});

describe("PropertyLine's own markup", () => {
  it("merges a caller's class onto the line", () => {
    render(<PropertyLine line="Prevent Monster Heal" className="text-sm" />);

    expect(screen.getByText("Prevent Monster Heal")).toHaveClass("text-sm");
  });
});

/**
 * Renders a whole set of lines at once and reports what each one came out as.
 *
 * One render for all 969, so the assertion is over what the browser would
 * actually build rather than over the pattern in isolation.
 */
function roundTrip(lines: readonly string[]) {
  const { container } = render(
    <ul>
      {lines.map((line, index) => (
        <li key={index}>
          <PropertyLine line={line} />
        </li>
      ))}
    </ul>,
  );

  return [...container.querySelectorAll("li")].map((item) => item.textContent);
}

/**
 * Renders one line and reports its emphasised fragments and its full text.
 *
 * The emphasised fragments are found by class, because the class *is* the
 * requirement: the theme declares `--color-property-value` for exactly this, and
 * an assertion that avoided naming it would not be checking the emphasis at all.
 */
function renderLine(line: string) {
  const { container } = render(<PropertyLine line={line} />);

  return {
    emphasised: [...container.querySelectorAll(".text-property-value")].map(
      (fragment) => fragment.textContent,
    ),
    text: container.textContent,
  };
}
