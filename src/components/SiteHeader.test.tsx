import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SiteHeader } from "@/components/SiteHeader";
import { FEEDBACK_URL, GAME_PATCH, UPDATE_NOTES_URL } from "@/header/site";
import { en } from "@/i18n/en";

// The band states what the page is, offers two destinations and hides the rest of
// the answer behind a disclosure. Each of those has a way of going quietly wrong:
// a label written into the component rather than resolved through copy, a href
// drifting from the module that owns it, a new tab opened without saying so, a
// help panel that is a conditional render and therefore unfindable while closed.
// Those are what is asserted here. That the header sits outside `main` is
// `App.test.tsx`'s to check, because it is a fact about the page.

describe("the site header", () => {
  it("opens with the title and the patch the list reflects", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("heading", { level: 1, name: en.app.title }),
    ).toBeVisible();
    expect(
      screen.getByText(en.header.patchLine, { exact: false }),
    ).toBeVisible();
  });

  it("hangs the patch notes off the patch number itself", () => {
    render(<SiteHeader />);

    const patchNotes = screen.getByRole("link", {
      name: en.header.patchNotesName(GAME_PATCH),
    });

    // The pressable words are the patch, not a second control saying the same
    // one — and the value comes from the constants module, so a locale that
    // hardcoded `3.1.1` would fail here rather than ship a stale number.
    expect(patchNotes).toHaveAttribute("href", UPDATE_NOTES_URL);
    expect(patchNotes).toHaveTextContent(GAME_PATCH);
    expect(patchNotes.textContent).toBe(en.header.patchLink(GAME_PATCH));
  });

  it("carries the feedback link and no third link", () => {
    render(<SiteHeader />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: en.header.feedbackName }),
    ).toHaveAttribute("href", FEEDBACK_URL);
  });

  it("opens both links in a new tab and says so in their names", () => {
    render(<SiteHeader />);

    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      // No `window.opener` handed over, no referrer leaked.
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      // The behaviour is in the accessible name, not only in the attribute:
      // a screen-reader user hears it before pressing rather than after.
      expect(link).toHaveAccessibleName(/opens in a new tab/);
    }
  });

  it("holds no URL and no patch number as a literal", () => {
    // Every destination came from `src/header/site.ts` and every word from
    // `src/i18n/en.ts`.
    const { container } = render(<SiteHeader />);

    const hrefs = [...container.querySelectorAll("a")].map(
      (anchor) => anchor.getAttribute("href") ?? "",
    );

    expect(hrefs.sort()).toEqual([FEEDBACK_URL, UPDATE_NOTES_URL].sort());
  });

  it("renders the links in the gold family, not in a link blue", () => {
    // The token this change first rendered was removed from the palette, so the
    // assertion is on the classes: `--color-link` has no use site anywhere.
    const { container } = render(<SiteHeader />);

    for (const anchor of container.querySelectorAll("a")) {
      expect(anchor.className).toContain("text-gold-mid");
      expect(anchor.className).toContain("hover:text-gold-light");
      expect(anchor.className).not.toContain("text-link");
    }
  });
});

describe("the help disclosure", () => {
  it("loads closed, with the state on the control", () => {
    render(<SiteHeader />);

    expect(helpButton()).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(en.header.helpIntro)).not.toBeVisible();
  });

  it("opens and closes from its own control", async () => {
    render(<SiteHeader />);

    await userEvent.click(helpButton());
    expect(screen.getByText(en.header.helpIntro)).toBeVisible();
    expect(helpButton()).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(helpButton());
    expect(screen.getByText(en.header.helpIntro)).not.toBeVisible();
    expect(helpButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("names the panel it controls", () => {
    // The control is a button rather than a `<summary>` because Help sits on the
    // title's line and its panel spans the width below — two rows of the header's
    // grid, which one `<details>` cannot straddle. What the platform would have
    // supplied is supplied here: the state on the control, and the control
    // pointing at the element it opens.
    render(<SiteHeader />);

    const panelId = helpButton().getAttribute("aria-controls");

    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId ?? "")).toContainElement(
      screen.getByText(en.header.helpIntro),
    );
  });

  it("explains how the page works, in the copy layer's own words", async () => {
    render(<SiteHeader />);

    await userEvent.click(helpButton());

    for (const point of en.header.helpPoints) {
      expect(screen.getByText(point)).toBeVisible();
    }
  });

  it("opens beneath the divider, not above it", async () => {
    const { container } = render(<SiteHeader />);

    await userEvent.click(helpButton());

    const divider = container.querySelector(".gold-divider");
    const panel = screen.getByText(en.header.helpIntro).closest("[id]");

    if (!divider) throw new Error("No divider in the header");
    if (!panel) throw new Error("No help panel");

    // The divider is the header's bottom edge. Prose wedged in above it pushes
    // that edge down and reads as part of the title block; below it, the help is
    // an explanation opened over the top of the page.
    expect(
      divider.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("describes moving progress in and out as a file", async () => {
    render(<SiteHeader />);

    await userEvent.click(helpButton());

    // A feature that ships adds its point here. This one had to: exporting made
    // the sentence before it — progress never leaving the browser — untrue.
    const panel = screen.getByText(en.header.helpIntro).closest("[id]");

    expect(panel).toHaveTextContent(en.transfer.exportAction);
    expect(panel).toHaveTextContent(en.transfer.importAction);
  });

  it("keeps the panel mounted while closed", () => {
    // Closed is a display state, not a conditional render, so `aria-controls`
    // always resolves to a real element rather than to nothing half the time.
    render(<SiteHeader />);

    expect(screen.getByText(en.header.helpIntro)).toBeInTheDocument();
  });

  it("is not a link, because there is nowhere to go", () => {
    render(<SiteHeader />);

    // The help used to be an anchor at the repository README. A reader asking how
    // the page works is not asking to be sent to a repository, and the assertion
    // that stops that coming back is that no link is named Help.
    expect(screen.queryByRole("link", { name: /help/i })).toBeNull();
    expect(helpButton()).toBeVisible();
  });

  it("keeps the underline off the glyph", async () => {
    render(<SiteHeader />);

    // The state glyph is decoration, and an underline running under a triangle
    // reads as a typo — so the hover underline is on the word, not on the button.
    expect(helpButton().className).not.toContain("hover:underline");
    expect(
      screen.getByText(en.header.help).className.includes("underline"),
    ).toBe(true);

    // And it is out of the accessibility tree either way.
    const glyph = helpButton().querySelector("[aria-hidden]");

    expect(glyph).not.toBeNull();
    expect(helpButton()).toHaveAccessibleName(en.header.help);

    await userEvent.click(helpButton());
    expect(helpButton()).toHaveAccessibleName(en.header.help);
  });

  it("writes nothing to storage", async () => {
    render(<SiteHeader />);

    await userEvent.click(helpButton());
    await userEvent.click(helpButton());

    expect(window.localStorage.length).toBe(0);
  });
});

/** The control that opens the help disclosure. */
function helpButton(): HTMLElement {
  return screen.getByRole("button", { name: en.header.help });
}
