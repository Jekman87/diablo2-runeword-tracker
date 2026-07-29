import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CraftedToggle } from "@/components/CraftedToggle";
import { en } from "@/i18n/en";

describe("the crafted socket", () => {
  it("reports itself unpressed when the runeword is not crafted", () => {
    render(<CraftedToggle name="Enigma" crafted={false} onToggle={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: en.crafted.mark("Enigma") }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("reports itself pressed when it is", () => {
    render(<CraftedToggle name="Enigma" crafted onToggle={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: en.crafted.unmark("Enigma") }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("names the runeword and the direction of the next press", () => {
    const { rerender } = render(
      <CraftedToggle name="Enigma" crafted={false} onToggle={vi.fn()} />,
    );

    const empty = screen.getByRole("button").getAttribute("aria-label");

    rerender(<CraftedToggle name="Enigma" crafted onToggle={vi.fn()} />);

    const filled = screen.getByRole("button").getAttribute("aria-label");

    expect(empty).toContain("Enigma");
    expect(filled).toContain("Enigma");
    expect(empty).not.toBe(filled);
  });

  it("draws a check when crafted and nothing when not, so colour is not the only carrier", () => {
    const { rerender } = render(
      <CraftedToggle name="Enigma" crafted={false} onToggle={vi.fn()} />,
    );

    // Empty: a box and no mark inside it.
    expect(screen.getByRole("button").querySelector("svg")).toBeNull();

    rerender(<CraftedToggle name="Enigma" crafted onToggle={vi.fn()} />);

    const mark = screen.getByRole("button").querySelector("svg");

    // Marked: the same box with a check in it. A reader who cannot separate the two
    // border colours still sees a difference in what is drawn, which is the
    // guarantee the filled socket used to carry.
    expect(mark).not.toBeNull();
    expect(mark).toHaveAttribute("aria-hidden", "true");
  });

  it("takes the mark's colour from the box rather than from a value of its own", () => {
    render(<CraftedToggle name="Enigma" crafted onToggle={vi.fn()} />);

    const button = screen.getByRole("button");

    // `currentColor` on the stroke and the token on the button, so no colour value
    // lands in the component.
    expect(button.className).toContain("text-crafted");
    expect(button.querySelector("path")).toHaveAttribute(
      "stroke",
      "currentColor",
    );
  });

  it("is square rather than round, with the interface's own corner", () => {
    render(<CraftedToggle name="Enigma" crafted={false} onToggle={vi.fn()} />);

    const className = screen.getByRole("button").className;

    expect(className).toContain("rounded-xs");
    expect(className).not.toContain("rounded-full");
  });
});

describe("operating it", () => {
  it("toggles on a click", async () => {
    const onToggle = vi.fn();
    render(<CraftedToggle name="Enigma" crafted={false} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole("button"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("toggles on Space and on Enter, because it is a real button", async () => {
    const onToggle = vi.fn();
    render(<CraftedToggle name="Enigma" crafted={false} onToggle={onToggle} />);

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard(" ");
    await userEvent.keyboard("{Enter}");

    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});
