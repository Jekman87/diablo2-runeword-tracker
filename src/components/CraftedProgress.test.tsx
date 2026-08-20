import { render, screen } from "@testing-library/react";

import { CraftedProgress } from "@/components/CraftedProgress";
import { runewords } from "@/data";
import { setLocale } from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";

// Two of the tests below stand in for what jsdom does not have — `ResizeObserver`
// and a box with a height. Neither is restored automatically here, and a mocked
// `getBoundingClientRect` left in place would answer for every test after it.
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** What the band has told the stylesheet about its own height. */
function published() {
  return document.documentElement.style.getPropertyValue(
    "--progress-band-height",
  );
}

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

describe("reaching the end of the list", () => {
  it("says nothing about completion below 99", () => {
    render(<CraftedProgress crafted={98} />);

    expect(screen.queryByText(en.progress.complete)).toBeNull();
    expect(screen.getByText(en.progress.count(98, 99))).toBeVisible();
  });

  it("congratulates on the same line as the counts at 99", () => {
    render(<CraftedProgress crafted={99} />);

    // One line, not a banner of its own: the percentage, the counts and the
    // sentence are one piece of text in reading order.
    const line = screen.getByText(en.progress.complete, { exact: false });

    expect(line).toHaveTextContent("100%");
    expect(line).toHaveTextContent("99 of 99");
    expect(line).toHaveTextContent(en.progress.complete);
  });

  it("keeps the announced value the counts alone", () => {
    render(<CraftedProgress crafted={99} />);

    expect(bar()).toHaveAttribute("aria-valuetext", en.progress.count(99, 99));
  });

  it("takes the sentence back if a mark is removed", () => {
    const { rerender } = render(<CraftedProgress crafted={99} />);

    rerender(<CraftedProgress crafted={98} />);

    expect(screen.queryByText(en.progress.complete)).toBeNull();
  });

  it("publishes its measured height for the header that sticks beneath it", () => {
    // jsdom measures every box as zero and has no `ResizeObserver`, so both are
    // supplied here. What is being asserted is the contract — the band reports
    // the height it turned out to be, rather than a constant guessing at it —
    // and the heights themselves are a browser check: 56px with the counts
    // alone, 104px at 390px once the line congratulates.
    const observed: Element[] = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe(element: Element) {
          observed.push(element);
        }
        unobserve() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 104,
    } as DOMRect);

    const { container, unmount } = render(<CraftedProgress crafted={99} />);

    expect(published()).toBe("104px");
    expect(observed).toEqual([container.firstElementChild]);

    // And it takes it back, so nothing is left pointing at a band that has gone.
    unmount();

    expect(published()).toBe("");
  });

  it("publishes nothing rather than zero when it cannot be measured", () => {
    // A detached or hidden band measures zero, and a zero here would stick the
    // table header under the top of the viewport.
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 0,
    } as DOMRect);

    render(<CraftedProgress crafted={99} />);

    expect(published()).toBe("");
  });

  it("congratulates in the active locale", () => {
    setLocale("ru");
    render(<CraftedProgress crafted={99} />);

    expect(
      screen.getByText(ru.progress.complete, { exact: false }),
    ).toBeVisible();

    setLocale("en");
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
