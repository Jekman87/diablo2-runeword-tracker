import { render, screen } from "@testing-library/react";

import { CraftedProgress } from "@/components/CraftedProgress";
import { runewords } from "@/data";
import { en } from "@/i18n/en";

function bar() {
  const element = screen.getByRole("progressbar");

  if (!(element instanceof HTMLProgressElement)) {
    throw new Error("The indicator is not a native progress element");
  }

  return element;
}

describe("the progress indicator", () => {
  it("reports the crafted count against all 99", () => {
    render(<CraftedProgress crafted={3} />);

    expect(bar().value).toBe(3);
    expect(bar().max).toBe(99);
  });

  it("states the count in text as well as in the bar", () => {
    render(<CraftedProgress crafted={3} />);

    expect(screen.getByText(en.progress.count(3, 99))).toBeVisible();
  });

  it("states the percentage and both counts, and neither replaces the other", () => {
    render(<CraftedProgress crafted={22} />);

    // The percentage is the form the in-game Chronicle uses; the counts stay
    // because the goal is a number of runewords and 22% cannot be checked against
    // a list of 99.
    const text = screen.getByText(en.progress.count(22, 99));

    expect(text).toHaveTextContent("22%");
    expect(text).toHaveTextContent("22 of 99");
  });

  it("rounds the percentage rather than showing a decimal", () => {
    // Ninety-nine runewords put every step about one percent apart, so a decimal
    // place would change on every toggle and say nothing.
    expect(en.progress.count(1, 99)).toContain("1%");
    expect(en.progress.count(50, 99)).toContain("51%");
    expect(en.progress.count(99, 99)).toContain("100%");
    expect(en.progress.count(0, 99)).toContain("0%");
  });

  it("stays visible while the table is read", () => {
    const { container } = render(<CraftedProgress crafted={3} />);

    // jsdom performs no layout, so what is asserted is the utility rather than the
    // position — that it is pinned above the table's own band, and that the detail
    // panel still paints above both, is a browser check.
    expect(container.firstElementChild).toHaveClass("progress-band");
  });

  it("announces the count rather than a percentage", () => {
    render(<CraftedProgress crafted={3} />);

    expect(bar()).toHaveAttribute("aria-valuetext", en.progress.count(3, 99));
  });

  it("reports zero rather than being absent", () => {
    render(<CraftedProgress crafted={0} />);

    expect(bar().value).toBe(0);
    expect(screen.getByText(en.progress.count(0, 99))).toBeVisible();
  });

  it("moves as the count does", () => {
    const { rerender } = render(<CraftedProgress crafted={0} />);

    rerender(<CraftedProgress crafted={1} />);

    expect(bar().value).toBe(1);
    expect(screen.getByText(en.progress.count(1, 99))).toBeVisible();
  });
});

describe("where the denominator comes from", () => {
  it("takes it from the dataset and not from a rendered table", () => {
    // Nothing but the indicator is rendered here — there is no table to count,
    // and the maximum is still 99. That is the property the requirement wants:
    // no filter, search or slot selection can move it, because none of them is
    // anywhere near this number.
    render(<CraftedProgress crafted={0} />);

    expect(bar().max).toBe(runewords.length);
    expect(runewords).toHaveLength(99);
  });
});
