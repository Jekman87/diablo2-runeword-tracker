import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  CraftedConfirm,
  type PendingToggle,
} from "@/components/CraftedConfirm";
import { setLocale } from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";

// The dialog on its own: what each direction says, that only the confirming
// answer changes anything, and that the safe answer is the one under the
// player's fingers. Its wiring to the table and the crafted set is `App`'s.

function renderConfirm(pending: Partial<PendingToggle> = {}) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  // A real control in the document, because it is what focus is handed back to
  // — a detached node would make the return silently a no-op.
  const control = document.body.appendChild(document.createElement("button"));

  return {
    onConfirm,
    onCancel,
    control,
    user: userEvent.setup(),
    ...render(
      <CraftedConfirm
        pending={{ name: "Enigma", crafted: false, control, ...pending }}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    ),
  };
}

function dialog() {
  return screen.getByRole("dialog");
}

/**
 * Waits until the dialog holds focus.
 *
 * `FloatingFocusManager` moves focus asynchronously, so the dialog is in the
 * document for a moment before `initialFocus` has landed — and it only hands
 * focus back on close if it had focus to begin with.
 */
async function opened(action: string) {
  await screen.findByRole("dialog");

  await waitFor(() =>
    expect(
      within(dialog()).getByRole("button", { name: action }),
    ).toHaveFocus(),
  );
}

afterEach(() => {
  document.body.replaceChildren();
  setLocale("en");
});

describe("nothing pending", () => {
  it("renders no dialog at all", () => {
    render(
      <CraftedConfirm pending={null} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("asking to mark", () => {
  it("names the runeword and offers the confirming action", async () => {
    renderConfirm({ crafted: false });

    expect(await screen.findByRole("dialog")).toHaveAccessibleName(
      en.crafted.confirmMarkTitle,
    );
    expect(screen.getByText("Enigma")).toHaveClass("text-gold-mid");
    expect(
      screen.getByText("will be counted towards your progress.", {
        exact: false,
      }),
    ).toBeVisible();
    expect(
      within(dialog()).getByRole("button", {
        name: en.crafted.confirmMarkAction,
      }),
    ).toBeVisible();
  });

  it("applies the change only when that action is taken", async () => {
    const { user, onConfirm } = renderConfirm({ crafted: false });

    await opened(en.crafted.confirmMarkAction);
    await user.click(
      within(dialog()).getByRole("button", {
        name: en.crafted.confirmMarkAction,
      }),
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("draws its confirming action from the confirm token", async () => {
    renderConfirm({ crafted: false });

    expect(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: en.crafted.confirmMarkAction,
      }).className,
    ).toContain("bg-confirm-action");
  });

  it("gives every action the shared minimum width", async () => {
    renderConfirm({ crafted: false });

    // The English "Add" is three letters where the Russian label is eight;
    // without a shared floor the affirmative action renders as a sliver.
    const buttons = within(await screen.findByRole("dialog")).getAllByRole(
      "button",
    );

    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.className).toContain("min-w-24");
    }
  });
});

describe("asking to remove", () => {
  it("asks the other question of the same runeword", async () => {
    renderConfirm({ crafted: true });

    expect(await screen.findByRole("dialog")).toHaveAccessibleName(
      en.crafted.confirmUnmarkTitle,
    );
    expect(screen.getByText("Enigma")).toHaveClass("text-gold-mid");
    expect(
      screen.getByText("will no longer count towards your progress.", {
        exact: false,
      }),
    ).toBeVisible();
  });

  it("draws its removing action from the remove token", async () => {
    renderConfirm({ crafted: true });

    expect(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: en.crafted.confirmUnmarkAction,
      }).className,
    ).toContain("bg-remove-action");
  });
});

describe("leaving without answering", () => {
  it("cancels on the cancelling action", async () => {
    const { user, onCancel, onConfirm } = renderConfirm();

    await opened(en.crafted.confirmMarkAction);
    await user.click(
      within(dialog()).getByRole("button", {
        name: en.crafted.confirmCancel,
      }),
    );

    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("cancels on Escape", async () => {
    const { user, onCancel, onConfirm } = renderConfirm();

    await opened(en.crafted.confirmMarkAction);
    await user.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("cancels on a press outside it", async () => {
    const { user, onCancel, onConfirm } = renderConfirm();

    await opened(en.crafted.confirmMarkAction);
    await user.click(document.body);

    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("survives the press and cancels on the release", async () => {
    const { onCancel } = renderConfirm();

    await opened(en.crafted.confirmMarkAction);

    // The dim has to still be there when the release is hit-tested. Closing on
    // the press unmounts it in between, and the browser then delivers
    // `mousedown`, `mouseup` and `click` to whatever the dim was covering —
    // traced on a phone-sized viewport as one tap that closed this dialog and
    // opened a row's advice panel underneath it.
    fireEvent.pointerDown(document.body);
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(document.body);
    expect(onCancel).toHaveBeenCalled();
  });
});

describe("focus", () => {
  // The two directions disagree about which answer the reflex Enter should
  // land on. Marking loses nothing if it was a misclick, so Enter records the
  // craft the player just asked for; unmarking would erase progress, so Enter
  // preserves it.

  it("marks on the reflex Enter", async () => {
    const { user, onConfirm } = renderConfirm({ crafted: false });

    await opened(en.crafted.confirmMarkAction);
    await user.keyboard("{Enter}");

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("preserves progress on the reflex Enter when removing", async () => {
    const { user, onCancel, onConfirm } = renderConfirm({ crafted: true });

    await opened(en.crafted.confirmCancel);
    await user.keyboard("{Enter}");

    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("returns to the control that raised it", async () => {
    const { user, control, rerender } = renderConfirm();

    await opened(en.crafted.confirmMarkAction);

    await user.keyboard("{Escape}");
    rerender(
      <CraftedConfirm pending={null} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );

    await waitFor(() => expect(control).toHaveFocus());
  });
});

describe("the locale", () => {
  it("takes every word of the dialog from the active record", async () => {
    setLocale("ru");
    renderConfirm({ crafted: true });

    expect(await screen.findByRole("dialog")).toHaveAccessibleName(
      ru.crafted.confirmUnmarkTitle,
    );
    expect(screen.getByText("Тайна")).toHaveClass("text-gold-mid");
    expect(
      screen.getByText("перестанет учитываться в вашем прогрессе.", {
        exact: false,
      }),
    ).toBeVisible();
    expect(
      within(dialog()).getByRole("button", {
        name: ru.crafted.confirmUnmarkAction,
      }),
    ).toBeVisible();
    expect(
      within(dialog()).getByRole("button", { name: ru.crafted.confirmCancel }),
    ).toBeVisible();
  });

  it("names the runeword in the language the row shows it in", async () => {
    setLocale("ru");
    renderConfirm({ name: "Enigma", crafted: false });

    await screen.findByRole("dialog");

    // `Тайна` is the dataset's Russian label for `Enigma`. An English name in
    // the middle of a Russian sentence is the one place the locale would not
    // have reached, and storage keeps the canonical name regardless.
    expect(screen.getByText("Тайна")).toBeVisible();
    expect(
      screen.getByText("будет учтено в вашем прогрессе.", { exact: false }),
    ).toBeVisible();
  });
});
