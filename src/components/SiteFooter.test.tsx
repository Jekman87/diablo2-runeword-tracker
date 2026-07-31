import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SiteFooter } from "@/components/SiteFooter";
import {
  DONATION_ADDRESS,
  DONATION_COIN,
  DONATION_NETWORK,
  SITE_NAME,
} from "@/header/site";
import { resetLocaleForTests, setLocale } from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";

beforeEach(() => {
  resetLocaleForTests();
  setLocale("en");
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("the site footer", () => {
  it("is a contentinfo landmark", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toBeVisible();
  });

  it("names the site and the current year from one source", () => {
    render(<SiteFooter />);

    const year = new Date().getFullYear();
    expect(
      screen.getByRole("button", {
        name: en.footer.copyright(SITE_NAME, year),
      }),
    ).toBeVisible();
  });

  it("switches copy with the locale and keeps the year shared", () => {
    setLocale("ru");
    const year = new Date().getFullYear();
    render(<SiteFooter />);

    expect(
      screen.getByRole("button", {
        name: ru.footer.copyright(SITE_NAME, year),
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: ru.footer.donationHeading }),
    ).toBeVisible();
  });

  it("keeps the donation control on its own row and opens a dialog for the address", async () => {
    const user = userEvent.setup();
    render(<SiteFooter />);

    expect(screen.queryByText(DONATION_ADDRESS)).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: en.footer.donationHeading }),
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByText(
        en.footer.donationInstrument(DONATION_COIN, DONATION_NETWORK),
      ),
    ).toBeVisible();
    expect(within(dialog).getByText(DONATION_ADDRESS)).toBeVisible();
  });

  it("copies the address from the dialog and announces success", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<SiteFooter />);

    await user.click(
      screen.getByRole("button", { name: en.footer.donationHeading }),
    );
    await user.click(
      screen.getByRole("button", { name: en.footer.copyAddress }),
    );

    expect(writeText).toHaveBeenCalledWith(DONATION_ADDRESS);
    expect(screen.getByText(en.footer.copySuccess)).toBeVisible();
  });

  it("announces failure when the clipboard is unavailable", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });

    render(<SiteFooter />);

    await user.click(
      screen.getByRole("button", { name: en.footer.donationHeading }),
    );

    expect(screen.getByText(DONATION_ADDRESS)).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: en.footer.copyAddress }),
    );

    expect(screen.getByText(en.footer.copyFailure)).toBeVisible();
  });

  it("swaps the copyright for a random easter-egg line on press", async () => {
    const user = userEvent.setup();
    const year = new Date().getFullYear();
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<SiteFooter />);

    await user.click(
      screen.getByRole("button", {
        name: en.footer.copyright(SITE_NAME, year),
      }),
    );

    expect(
      screen.getByRole("button", { name: en.footer.easterEggs[0] }),
    ).toBeVisible();
  });

  it("picks from every easter-egg line across presses", async () => {
    const user = userEvent.setup();
    const year = new Date().getFullYear();
    const random = vi.spyOn(Math, "random");
    render(<SiteFooter />);

    for (let i = 0; i < en.footer.easterEggs.length; i++) {
      random.mockReturnValue(i / en.footer.easterEggs.length);

      await user.click(
        screen.getByRole("button", {
          name: en.footer.copyright(SITE_NAME, year),
        }),
      );

      expect(
        screen.getByRole("button", { name: en.footer.easterEggs[i] }),
      ).toBeVisible();

      await user.click(
        screen.getByRole("button", { name: en.footer.easterEggs[i] }),
      );
    }
  });

  it("restores the copyright five seconds after the easter egg", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const year = new Date().getFullYear();
    render(<SiteFooter />);

    // `userEvent` has its own timer plumbing and deadlocks alongside fake
    // ones — same reason UndoToast drives dismissal with `fireEvent`.
    fireEvent.click(
      screen.getByRole("button", {
        name: en.footer.copyright(SITE_NAME, year),
      }),
    );

    expect(
      screen.getByRole("button", { name: en.footer.easterEggs[0] }),
    ).toBeVisible();

    act(() => void vi.advanceTimersByTime(4_999));
    expect(
      screen.getByRole("button", { name: en.footer.easterEggs[0] }),
    ).toBeVisible();

    act(() => void vi.advanceTimersByTime(1));
    expect(
      screen.getByRole("button", {
        name: en.footer.copyright(SITE_NAME, year),
      }),
    ).toBeVisible();
  });

  it("loads no third-party resource", () => {
    const { container } = render(<SiteFooter />);
    const footer = screen.getByRole("contentinfo");

    expect(within(footer).queryAllByRole("img")).toHaveLength(0);
    expect(container.querySelectorAll("iframe, script[src]")).toHaveLength(0);
  });
});
