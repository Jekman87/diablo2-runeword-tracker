import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RunewordControls } from "@/components/RunewordControls";
import { en } from "@/i18n/en";

/** The bar presenting all 99 with nothing narrowed, and handlers that record. */
function renderControls(
  props: Partial<Parameters<typeof RunewordControls>[0]> = {},
) {
  const handlers = {
    onQueryChange: vi.fn(),
    onCraftedFilterChange: vi.fn(),
    onSlotFilterChange: vi.fn(),
    onReset: vi.fn(),
  };

  return {
    ...handlers,
    ...render(
      <RunewordControls
        query=""
        craftedFilter="all"
        slotFilter="all"
        visibleCount={99}
        narrowed={false}
        {...handlers}
        {...props}
      />,
    ),
  };
}

describe("the search field", () => {
  it("is a labelled search box, not a placeholder", () => {
    renderControls();

    const field = screen.getByRole("searchbox", {
      name: en.controls.searchLabel,
    });

    expect(field).toBeVisible();
    // A placeholder disappears the moment anything is typed, which is when a
    // reader most needs to know what the field searches.
    expect(field).not.toHaveAttribute("placeholder");
    expect(field).toHaveAccessibleDescription(en.controls.searchHint);
  });

  it("shows the query it is given", () => {
    renderControls({ query: "spirit" });

    expect(screen.getByRole("searchbox")).toHaveValue("spirit");
  });

  it("reports every keystroke rather than waiting", async () => {
    const { onQueryChange } = renderControls();

    await userEvent.type(screen.getByRole("searchbox"), "arm");

    // No debounce: filtering 99 records in memory is one pass, and a delay would
    // add latency to save work that does not exist.
    expect(onQueryChange).toHaveBeenCalledTimes(3);
    expect(onQueryChange).toHaveBeenLastCalledWith("m");
  });
});

describe("the crafted filter", () => {
  it("is a named group of three radios", () => {
    renderControls();

    const group = screen.getByRole("group", {
      name: en.controls.craftedLegend,
    });
    const options = within(group).getAllByRole("radio");

    expect(options).toHaveLength(3);
    expect(options.map((option) => option.getAttribute("value"))).toEqual([
      "all",
      "crafted",
      "remaining",
    ]);
  });

  it("shows which of the three is in effect", () => {
    renderControls({ craftedFilter: "remaining" });

    // Scoped to the group, because both filters offer an option called `All` and
    // it is the `<legend>` that tells them apart — which is exactly what a screen
    // reader reads before the option, and the reason a fieldset is the shape here.
    const group = within(
      screen.getByRole("group", { name: en.controls.craftedLegend }),
    );

    expect(
      group.getByRole("radio", { name: en.controls.craftedRemaining }),
    ).toBeChecked();
    expect(
      group.getByRole("radio", { name: en.controls.craftedAll }),
    ).not.toBeChecked();
  });

  it("reports a choice", async () => {
    const { onCraftedFilterChange } = renderControls();

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.craftedCrafted }),
    );

    expect(onCraftedFilterChange).toHaveBeenCalledWith("crafted");
  });
});

describe("the slot filter", () => {
  it("is a named group of six radios, in the game's own vocabulary", () => {
    renderControls();

    const group = screen.getByRole("group", { name: en.controls.slotLegend });
    const options = within(group).getAllByRole("radio");

    expect(options).toHaveLength(6);
    expect(options.map((option) => option.getAttribute("value"))).toEqual([
      "all",
      "helm",
      "melee",
      "missile",
      "offhand",
      "bodyArmour",
    ]);
  });

  it("offers one choice rather than a combination", async () => {
    const { onSlotFilterChange } = renderControls({ slotFilter: "helm" });

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotOffhand }),
    );

    // Radio semantics, so selecting one replaces the other without a handler
    // having to say so.
    expect(onSlotFilterChange).toHaveBeenCalledWith("offhand");
    expect(onSlotFilterChange).toHaveBeenCalledTimes(1);
  });

  it("offers no control for an individual base item category", () => {
    renderControls();

    // Narrower intent than a slot is search's job. `Swords` is a category, not a
    // slot, and there is no chip for it.
    expect(screen.queryByRole("radio", { name: "Swords" })).toBeNull();
    expect(screen.getAllByRole("radio")).toHaveLength(9);
  });

  it("offers no control over availability", () => {
    renderControls();

    expect(screen.getAllByRole("group")).toHaveLength(2);
    expect(screen.queryByRole("radio", { name: /ladder/i })).toBeNull();
    expect(screen.queryByRole("radio", { name: /patch/i })).toBeNull();
  });
});

describe("the count", () => {
  it("states the presented rows out of the dataset's total", () => {
    renderControls({ visibleCount: 11 });

    expect(screen.getByText(en.controls.count(11, 99))).toBeVisible();
  });

  it("states the total as 99 even when nothing is presented", () => {
    renderControls({ visibleCount: 0, narrowed: true });

    // The denominator is the dataset's length, not the crafted count and not the
    // rows before the last filter.
    expect(screen.getByText(en.controls.count(0, 99))).toBeVisible();
  });

  it("sits in a polite live region", () => {
    renderControls({ visibleCount: 11 });

    const count = screen.getByText(en.controls.count(11, 99));

    expect(count).toHaveAttribute("aria-live", "polite");
    // Polite and not assertive: worth announcing, not worth interrupting. And no
    // focus is moved, which is what `aria-live` buys over a focus target.
    expect(count).not.toHaveAttribute("aria-live", "assertive");
  });
});

describe("the reset", () => {
  it("is absent while the view presents everything", () => {
    renderControls();

    // A control that does nothing is worse than no control.
    expect(
      screen.queryByRole("button", { name: en.controls.reset }),
    ).toBeNull();
  });

  it("appears once the view is narrowed", () => {
    renderControls({ narrowed: true, visibleCount: 11 });

    expect(
      screen.getByRole("button", { name: en.controls.reset }),
    ).toBeVisible();
  });

  it("asks for the reset when activated", async () => {
    const { onReset } = renderControls({ narrowed: true });

    await userEvent.click(
      screen.getByRole("button", { name: en.controls.reset }),
    );

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("is operable by keyboard", async () => {
    const { onReset } = renderControls({ narrowed: true });

    screen.getByRole("button", { name: en.controls.reset }).focus();
    await userEvent.keyboard("{Enter}");

    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

describe("the bar itself", () => {
  it("owns no state of its own", async () => {
    // Given `all` and a handler that ignores it, the chip does not move — which is
    // what makes the controls always show what the table is really doing, including
    // on a first paint with a restored filter.
    renderControls({ slotFilter: "all" });

    await userEvent.click(
      screen.getByRole("radio", { name: en.controls.slotHelm }),
    );

    const slots = within(
      screen.getByRole("group", { name: en.controls.slotLegend }),
    );

    expect(
      slots.getByRole("radio", { name: en.controls.slotAll }),
    ).toBeChecked();
  });

  it("hardcodes no display text", () => {
    renderControls({ narrowed: true, visibleCount: 11 });

    for (const text of [
      en.controls.searchLabel,
      en.controls.craftedLegend,
      en.controls.slotLegend,
      en.controls.slotBodyArmour,
      en.controls.reset,
      en.controls.count(11, 99),
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });
});
