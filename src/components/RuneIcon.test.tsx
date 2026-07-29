import { render, screen } from "@testing-library/react";

import { RuneIcon } from "@/components/RuneIcon";

// jsdom does not evaluate `calc()`, so `getComputedStyle` cannot report a
// computed pixel offset here. These tests therefore assert the style attribute
// the component *emits* — the two cell coordinates — and leave the geometry
// itself to `rune-sprite.test.ts`, which carries the real assertion over all 33
// runes. Rewriting this to read a computed offset would assert something jsdom
// cannot answer.

describe("RuneIcon", () => {
  it("renders the rune as a labelled image", () => {
    render(<RuneIcon name="Ber" />);

    expect(screen.getByRole("img", { name: "Ber" })).toBeInTheDocument();
  });

  it("carries the sprite utility class", () => {
    render(<RuneIcon name="El" />);

    expect(screen.getByRole("img", { name: "El" })).toHaveClass("rune-icon");
  });

  it.each([
    { name: "El", col: "0", row: "0" },
    { name: "Amn", col: "10", row: "0" },
    { name: "Sol", col: "0", row: "1" },
    { name: "Zod", col: "10", row: "2" },
  ])("emits $name as column $col of row $row", ({ name, col, row }) => {
    render(<RuneIcon name={name} />);

    const style = screen.getByRole("img", { name }).getAttribute("style");

    expect(style).toContain(`--rune-col: ${col}`);
    expect(style).toContain(`--rune-row: ${row}`);
  });

  it("merges a caller's class without dropping its own", () => {
    render(<RuneIcon name="Jah" className="mr-1" />);

    expect(screen.getByRole("img", { name: "Jah" })).toHaveClass(
      "rune-icon",
      "mr-1",
    );
  });

  it("renders as decoration where the name is already drawn beside it", () => {
    const { container } = render(<RuneIcon name="Ber" decorative />);
    const icon = container.firstElementChild;

    // No role and no label, rather than a role with an empty one. The visible
    // text carries the name; announcing it here too would say every rune twice.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).not.toHaveAttribute("aria-label");
    expect(icon).not.toHaveAttribute("role");

    // Still the same icon: decoration changes what is announced, not what is
    // drawn.
    expect(icon).toHaveClass("rune-icon");
    expect(icon?.getAttribute("style")).toContain("--rune-col: 7");
    expect(icon?.getAttribute("style")).toContain("--rune-row: 2");
  });

  it("surfaces an unknown rune name instead of rendering a wrong rune", () => {
    expect(() => render(<RuneIcon name="Nope" />)).toThrow(
      /unknown rune name/i,
    );
  });
});
