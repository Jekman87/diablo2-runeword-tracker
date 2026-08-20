import { render, screen } from "@testing-library/react";

import { RuneSequence } from "@/components/RuneSequence";
import { type Runeword, runewords } from "@/data";

describe("RuneSequence", () => {
  it("draws each rune's name beside its icon", () => {
    const { container } = render(<RuneSequence runeword={named("Steel")} />);

    for (const rune of named("Steel").runes) {
      expect(screen.getByText(rune)).toBeVisible();
    }

    expect(container.querySelectorAll(".rune-icon")).toHaveLength(
      named("Steel").runes.length,
    );
  });

  it("keeps dataset order and repeats — `Infinity` is Ber Mal Ber Ist", () => {
    const { container } = render(<RuneSequence runeword={named("Infinity")} />);

    expect(labelsIn(container)).toEqual(["Ber", "Mal", "Ber", "Ist"]);
  });

  it("renders the whole dataset's sequences faithfully", () => {
    const wrong = runewords.filter((runeword) => {
      const { container, unmount } = render(
        <RuneSequence runeword={runeword} />,
      );
      const rendered = labelsIn(container);

      unmount();

      return String(rendered) !== String(runeword.runes);
    });

    expect(wrong).toEqual([]);
  });

  it("announces each rune once, not twice", () => {
    const { container } = render(<RuneSequence runeword={named("Infinity")} />);

    // The name is text and the icon is decoration. Labelled icons beside
    // visible names would have a screen reader read the sequence twice over.
    expect(screen.queryAllByRole("img")).toEqual([]);

    for (const icon of container.querySelectorAll(".rune-icon")) {
      expect(icon).toHaveAttribute("aria-hidden");
      expect(icon).not.toHaveAttribute("aria-label");
    }
  });

  it("draws at the theme's native size, restating nothing", () => {
    const { container } = render(<RuneSequence runeword={named("Steel")} />);

    // Nothing here sets `--rune-size`. The sprite's native 40px cell is the
    // theme's single declared default and also the ceiling above which the
    // artwork upscales, so the right thing for a use site that wants it sharp is
    // to ask for nothing at all.
    expect(container.innerHTML).not.toContain("--rune-size");
    expect(container.innerHTML).not.toContain("rune-size:");
  });

  it("takes a caller's layout classes without losing its own", () => {
    const { container } = render(
      <RuneSequence runeword={named("Steel")} className="flex md:hidden" />,
    );

    expect(container.firstElementChild).toHaveClass(
      "gap-1",
      "flex",
      "md:hidden",
    );
  });

  it("names runes from the dataset rather than from the strings layer", async () => {
    const strings = await import("@/i18n/en");

    // Rune names are canonical identifiers. `ui-strings` forbids the display
    // layer holding a dataset value, and this is the assertion that keeps it
    // true as the sequence gains visible text.
    expect(JSON.stringify(strings.en)).not.toContain("Ber");
    expect(JSON.stringify(strings.en)).not.toContain("Shael");
  });

  describe("in its names form", () => {
    it("draws the names and no icon at all", () => {
      const { container } = render(
        <RuneSequence runeword={named("Steel")} form="names" />,
      );

      for (const rune of named("Steel").runes) {
        expect(screen.getByText(rune)).toBeVisible();
      }

      // The whole point of the form: at a 390px viewport six 40px icons hold
      // the name column at 276px, and the names hold it at 126px.
      expect(container.querySelectorAll(".rune-icon")).toHaveLength(0);
    });

    it("keeps dataset order and repeats — `Infinity` is Ber Mal Ber Ist", () => {
      const { container } = render(
        <RuneSequence runeword={named("Infinity")} form="names" />,
      );

      expect(namesIn(container)).toEqual(["Ber", "Mal", "Ber", "Ist"]);
    });

    it("renders the whole dataset's sequences faithfully", () => {
      const wrong = runewords.filter((runeword) => {
        const { container, unmount } = render(
          <RuneSequence runeword={runeword} form="names" />,
        );
        const rendered = namesIn(container);

        unmount();

        return String(rendered) !== String(runeword.runes);
      });

      expect(wrong).toEqual([]);
    });

    it("announces nothing twice, because there is no icon to announce", () => {
      render(<RuneSequence runeword={named("Infinity")} form="names" />);

      expect(screen.queryAllByRole("img")).toEqual([]);
    });

    it("styles a name exactly as the icon form styles its label", () => {
      const icons = render(<RuneSequence runeword={named("Steel")} />);
      const names = render(
        <RuneSequence runeword={named("Steel")} form="names" />,
      );

      // The names form is the icon form with the sprite taken away, and should
      // read as the same thing rather than as a second treatment of the word.
      const label =
        icons.container.querySelector(".rune-icon")?.nextElementSibling;
      const name = names.container.firstElementChild?.firstElementChild;

      expect(name?.className).toBe(label?.className);
    });
  });
});

/**
 * The names the sequence draws, in order, whichever form drew them.
 *
 * The icon form puts the name in the icon's next sibling; the names form has no
 * icon and the name is the whole of each item. Reading the text of the outer
 * span's children covers both, so a test can assert the recipe without knowing
 * which form produced it.
 */
function namesIn(scope: Element) {
  const sequence = scope.firstElementChild;

  return sequence === null
    ? []
    : [...sequence.children].map((item) => item.textContent);
}

/** The rune names drawn beside the icons, in order. */
function labelsIn(scope: Element) {
  return [...scope.querySelectorAll(".rune-icon")].map(
    (icon) => icon.nextElementSibling?.textContent,
  );
}

function named(name: string): Runeword {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}
