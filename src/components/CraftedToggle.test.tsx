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

  it("renders filled rather than hollow when crafted, so colour is not the only carrier", () => {
    const { rerender } = render(
      <CraftedToggle name="Enigma" crafted={false} onToggle={vi.fn()} />,
    );

    const empty = screen.getByRole("button").className;

    rerender(<CraftedToggle name="Enigma" crafted onToggle={vi.fn()} />);

    expect(empty).toContain("bg-ground");
    expect(screen.getByRole("button").className).toContain("bg-crafted");
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
