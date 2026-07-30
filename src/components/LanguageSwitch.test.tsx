import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LanguageSwitch } from "@/components/LanguageSwitch";
import { SiteHeader } from "@/components/SiteHeader";
import { resetLocaleForTests, useStrings } from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";
import { LOCALE_STORAGE_KEY } from "@/i18n/storage";

// The switch is the one control that changes the language, and the contract it
// carries is mostly about everything else: another consumer re-rendering
// without having been edited, the header keeping its two links, the active
// option being state rather than colour. Those are what is asserted here.

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "en";
  resetLocaleForTests();
});

/**
 * A copy consumer that knows nothing about locales — no prop, no import of the
 * setter. If it re-renders in Russian, the seam did its job.
 */
function Probe() {
  const strings = useStrings();

  return <p>{strings.controls.searchLabel}</p>;
}

describe("the language switch", () => {
  it("labels each option in its own language, from the copy layer", () => {
    render(<LanguageSwitch />);

    // Visible label the code, accessible name the whole word — and the same
    // pair whatever language the page is in, so a reader who cannot read the
    // active language can still find the way out of it.
    expect(option(en.language.enName)).toHaveTextContent(en.language.en);
    expect(option(en.language.ruName)).toHaveTextContent(en.language.ru);
  });

  it("names the pair as a group", () => {
    render(<LanguageSwitch />);

    expect(
      screen.getByRole("group", { name: en.language.label }),
    ).toBeInTheDocument();
  });

  it("reports the active language as state, not colour", async () => {
    render(<LanguageSwitch />);

    expect(option(en.language.enName)).toHaveAttribute("aria-pressed", "true");
    expect(option(en.language.ruName)).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(option(en.language.ruName));

    expect(option(en.language.enName)).toHaveAttribute("aria-pressed", "false");
    expect(option(en.language.ruName)).toHaveAttribute("aria-pressed", "true");
  });

  it("re-renders another consumer that was never edited to allow it", async () => {
    render(
      <>
        <LanguageSwitch />
        <Probe />
      </>,
    );

    expect(screen.getByText(en.controls.searchLabel)).toBeVisible();

    await userEvent.click(option(en.language.ruName));

    expect(screen.getByText(ru.controls.searchLabel)).toBeVisible();
    expect(screen.queryByText(en.controls.searchLabel)).toBeNull();

    await userEvent.click(option(en.language.enName));

    expect(screen.getByText(en.controls.searchLabel)).toBeVisible();
  });

  it("persists the choice as the switch, not on load", async () => {
    render(<LanguageSwitch />);

    expect(window.localStorage.length).toBe(0);

    await userEvent.click(option(en.language.ruName));

    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('"ru"');
  });
});

describe("the switch in the header", () => {
  it("keeps the header at exactly two links, in either language", async () => {
    render(<SiteHeader />);

    expect(screen.getAllByRole("link")).toHaveLength(2);

    await userEvent.click(option(en.language.ruName));

    // The header itself is a consumer: its own copy switched with the page.
    expect(
      screen.getByRole("heading", { level: 1, name: ru.app.title }),
    ).toBeVisible();
    // And the switch is a control, not a third link.
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});

/** An option of the switch, by its accessible name. */
function option(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}
