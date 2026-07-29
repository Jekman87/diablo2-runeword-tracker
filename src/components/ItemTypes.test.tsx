import { render, screen } from "@testing-library/react";

import { ItemTypes } from "@/components/ItemTypes";
import { type Runeword, runewords } from "@/data";
import { en } from "@/i18n/en";

describe("ItemTypes", () => {
  it("presents a single category with its restriction beneath it", () => {
    render(<ItemTypes runeword={named("Leaf")} />);

    const categories = screen.getByText("Staves");
    const restriction = screen.getByText("(Not Orbs/Wands)");

    expect(categories).toBeVisible();
    expect(restriction).toBeVisible();

    // Two elements rather than one run of text. That is the whole reason this
    // is a component: a function returning `string` cannot carry two colours.
    expect(categories).not.toContainElement(restriction);
  });

  it("gives the restriction its own colour and its own line", () => {
    render(<ItemTypes runeword={named("Leaf")} />);

    expect(screen.getByText("Staves")).toHaveClass("block", "text-muted");
    expect(screen.getByText("(Not Orbs/Wands)")).toHaveClass(
      "block",
      "text-item-restriction",
    );
  });

  it("lists every category a runeword names, as a list", () => {
    const many = named("Spirit");

    render(<ItemTypes runeword={many} />);

    expect(many.itemTypes.length).toBeGreaterThan(1);
    expect(
      screen.getByText(many.itemTypes.join(en.itemTypes.separator)),
    ).toBeVisible();
  });

  it("renders nothing at all where there is no restriction", () => {
    const { container } = render(<ItemTypes runeword={named("Steel")} />);

    // Not an empty pair of parentheses and not an empty line. Eighty-four of
    // the 99 carry no restriction, and a blank line in each of them would read
    // as the column having lost something.
    expect(container.textContent).not.toContain("(");
    expect(linesIn(container)).toHaveLength(1);
  });

  it("sizes the restriction against the categories, not against the cell", () => {
    const { container } = render(<ItemTypes runeword={named("Leaf")} />);

    // The size is on the wrapper so the restriction's `0.9em` resolves against
    // it. Left to inherit the cell's 16px it comes out at 14.4px — larger than
    // the category it qualifies, which is not what the reference means by it.
    expect(container.firstElementChild).toHaveClass("text-[14px]");
    expect(screen.getByText("(Not Orbs/Wands)")).toHaveClass("text-[0.9em]");
    expect(screen.getByText("Staves")).not.toHaveClass("text-[14px]");
  });

  it("covers the whole dataset the same way", () => {
    const restricted = runewords.filter(
      (runeword) => runeword.itemTypeRestriction !== undefined,
    );

    expect(restricted).toHaveLength(15);

    const wrong = runewords.filter((runeword) => {
      const { container, unmount } = render(<ItemTypes runeword={runeword} />);
      const lines = linesIn(container).map((line) => line.textContent);

      const expected =
        runeword.itemTypeRestriction === undefined
          ? [runeword.itemTypes.join(en.itemTypes.separator)]
          : [
              runeword.itemTypes.join(en.itemTypes.separator),
              en.itemTypes.restriction(runeword.itemTypeRestriction),
            ];

      unmount();

      return String(lines) !== String(expected);
    });

    expect(wrong).toEqual([]);
  });

  it("leaves the dataset's restriction bare after rendering", () => {
    const leaf = named("Leaf");

    render(<ItemTypes runeword={leaf} />);

    // The punctuation was supplied at presentation and never written back.
    expect(leaf.itemTypeRestriction).toBe("Not Orbs/Wands");
  });

  it("takes the brackets from the strings layer and the words from the data", () => {
    // The split the layering rule turns on: punctuation is copy, the words
    // inside it are dataset content, and neither crosses into the other's file.
    expect(en.itemTypes.restriction("Assassin")).toBe("(Assassin)");
    expect(JSON.stringify(en)).not.toContain("Assassin");
    expect(JSON.stringify(en)).not.toContain("Orbs/Wands");
  });
});

/** The lines inside the sizing wrapper: the categories, and any restriction. */
function linesIn(container: HTMLElement) {
  return [...(container.firstElementChild?.children ?? [])];
}

function named(name: string): Runeword {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}
