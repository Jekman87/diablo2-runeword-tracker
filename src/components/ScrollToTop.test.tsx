import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ScrollToTop } from "@/components/ScrollToTop";
import { resetLocaleForTests, setLocale } from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";

function mountWithSentinel() {
  const sentinel = document.createElement("div");
  sentinel.setAttribute("data-scroll-top-sentinel", "");
  document.body.appendChild(sentinel);

  let observerCallback: IntersectionObserverCallback | null = null;
  const observe = vi.fn();
  const disconnect = vi.fn();

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = observe;
      unobserve = vi.fn();
      disconnect = disconnect;
      takeRecords = () => [];
      root = null;
      rootMargin = "";
      thresholds = [];
    },
  );

  const view = render(<ScrollToTop />);

  return {
    ...view,
    sentinel,
    observe,
    disconnect,
    reveal() {
      act(() => {
        observerCallback?.(
          [
            {
              isIntersecting: false,
              target: sentinel,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });
    },
    hide() {
      act(() => {
        observerCallback?.(
          [
            {
              isIntersecting: true,
              target: sentinel,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });
    },
  };
}

beforeEach(() => {
  resetLocaleForTests();
  setLocale("en");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("scroll to top", () => {
  it("is absent while the header sentinel is in view", () => {
    const { hide } = mountWithSentinel();
    hide();

    expect(
      screen.queryByRole("button", { name: en.scrollToTop.label }),
    ).not.toBeInTheDocument();
  });

  it("appears once the sentinel leaves the viewport", () => {
    const { reveal } = mountWithSentinel();
    reveal();

    expect(
      screen.getByRole("button", { name: en.scrollToTop.label }),
    ).toBeVisible();
  });

  it("is named in Russian under that locale", () => {
    setLocale("ru");
    const { reveal } = mountWithSentinel();
    reveal();

    expect(
      screen.getByRole("button", { name: ru.scrollToTop.label }),
    ).toBeVisible();
  });

  it("scrolls to the top without adding a history entry", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { reveal } = mountWithSentinel();
    reveal();

    await user.click(
      screen.getByRole("button", { name: en.scrollToTop.label }),
    );

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("jumps without animation under reduced motion", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { reveal } = mountWithSentinel();
    reveal();

    await user.click(
      screen.getByRole("button", { name: en.scrollToTop.label }),
    );

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
