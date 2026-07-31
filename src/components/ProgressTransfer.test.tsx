import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProgressTransfer } from "@/components/ProgressTransfer";
import { setLocale } from "@/i18n";
import { en } from "@/i18n/en";

function renderTransfer(crafted: Iterable<string> = []) {
  const onReplace = vi.fn();

  return {
    onReplace,
    user: userEvent.setup(),
    ...render(
      <ProgressTransfer crafted={new Set(crafted)} onReplace={onReplace} />,
    ),
  };
}

/** Chooses a file through the hidden input, as the picker would. */
async function choose(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.upload(
    screen.getByLabelText(en.transfer.importAction),
    new File([text], "progress.csv", { type: "text/csv" }),
  );
}

function dialog() {
  return screen.getByRole("alertdialog", { name: en.transfer.confirmTitle });
}

/**
 * Chooses a file and waits until the confirmation has actually taken focus.
 *
 * **`findByRole` alone is not enough, and the difference only shows on a slow
 * machine.** `FloatingFocusManager` moves focus asynchronously, so the dialog is
 * in the document for a moment before `initialFocus` has landed. A test that acts
 * in that window is racing: the active element is still `<body>`, the first Tab
 * goes nowhere near the dialog, and — worse — closing it returns focus nowhere,
 * because the manager only hands focus back when it had focus to begin with. Both
 * of those failed on CI and neither ever failed locally.
 */
async function openConfirmation(
  user: ReturnType<typeof userEvent.setup>,
  text: string,
) {
  await choose(user, text);
  await screen.findByRole("alertdialog");

  await waitFor(() =>
    expect(
      within(dialog()).getByRole("button", {
        name: en.transfer.confirmCancel,
      }),
    ).toHaveFocus(),
  );
}

// `URL.createObjectURL` and `revokeObjectURL` do not exist in jsdom 30. Stubbed
// here, at the one seam that needs them, rather than in `src/test/setup.ts` —
// that file was emptied of exactly this kind of hand-written stand-in for a
// browser, and confining it to the two export tests is what keeps everything
// else asserting against the real implementation.
const created: Blob[] = [];

beforeEach(() => {
  created.length = 0;

  // The two methods are added to the real `URL`, not swapped for an object
  // standing in for it. `vi.stubGlobal("URL", { ...URL, … })` reads as the
  // obvious way and is a trap: spreading a constructor copies none of its
  // non-enumerable statics and leaves behind something that cannot be called
  // with `new`, so any `new URL(…)` in the same test would throw for a reason
  // nothing on screen would explain.
  URL.createObjectURL = (blob: Blob) => {
    created.push(blob);

    return "blob:stub";
  };
  URL.revokeObjectURL = () => {};
});

afterEach(() => {
  // jsdom ships neither, so removing them restores the environment exactly.
  Reflect.deleteProperty(URL, "createObjectURL");
  Reflect.deleteProperty(URL, "revokeObjectURL");
  setLocale("en");
});

/** What the export handed to the browser, as text. */
async function exported(): Promise<string> {
  expect(created).toHaveLength(1);

  return created[0].text();
}

describe("exporting", () => {
  it("writes every crafted runeword, one per line", async () => {
    const { user } = renderTransfer(["Spirit", "Enigma"]);

    await user.click(
      screen.getByRole("button", { name: en.transfer.exportAction }),
    );

    expect(await exported()).toBe("Enigma\nSpirit\n");
  });

  it("writes an empty file when nothing is crafted", async () => {
    const { user } = renderTransfer();

    await user.click(
      screen.getByRole("button", { name: en.transfer.exportAction }),
    );

    // The control still produces a file rather than doing nothing, so an empty
    // export is a legible answer instead of a dead button.
    expect(await exported()).toBe("");
  });

  it("writes canonical English names under the Russian locale", async () => {
    const { user } = renderTransfer(["Enigma"]);

    setLocale("ru");

    await user.click(
      screen.getByRole("button", { name: en.transfer.exportAction }),
    );

    // `localised-dataset-text` settled this: the file is the same file whichever
    // language wrote it, or it does not transfer between two browsers.
    expect(await exported()).toContain("Enigma");
  });
});

describe("choosing a file", () => {
  it("opens the confirmation and changes nothing on its own", async () => {
    const { user, onReplace } = renderTransfer(["Grief"]);

    await choose(user, "Enigma\nSpirit");

    expect(await screen.findByRole("alertdialog")).toBeVisible();
    expect(onReplace).not.toHaveBeenCalled();
  });

  it("states how many runewords the file will mark", async () => {
    const { user } = renderTransfer();

    await choose(user, "Enigma\nSpirit\nGrief");

    expect(await screen.findByText(en.transfer.confirmCount(3))).toBeVisible();
  });

  it("counts only the names the dataset knows", async () => {
    const { user } = renderTransfer();

    await choose(user, "Enigma\nNot A Runeword\nAlso Not One");

    // The unmatched two are neither counted nor reported. The count is the whole
    // signal, which is why it has to be the matched count.
    expect(await screen.findByText(en.transfer.confirmCount(1))).toBeVisible();
  });

  it("says none will be marked when the file matches nothing", async () => {
    const { user } = renderTransfer(["Enigma"]);

    await choose(user, "Runeword,Level\nfoo,1\nbar,2");

    // The screen a player gets when they brought the wrong file — and the reason
    // no unmatched-name report is owed.
    expect(await screen.findByText(en.transfer.confirmCount(0))).toBeVisible();
  });

  it("warns that the replacement cannot be undone", async () => {
    const { user } = renderTransfer();

    await choose(user, "Enigma");

    expect(await screen.findByText(en.transfer.confirmWarning)).toBeVisible();
  });

  it("opens the confirmation again for the same file", async () => {
    const { user } = renderTransfer();

    await choose(user, "Enigma");
    await user.click(
      within(dialog()).getByRole("button", {
        name: en.transfer.confirmCancel,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );

    // Without clearing the input, the picker fires no second `change` and the
    // button looks dead to a player who cancelled and reconsidered.
    await choose(user, "Enigma");

    expect(await screen.findByRole("alertdialog")).toBeVisible();
  });
});

describe("answering the confirmation", () => {
  it("replaces progress when the player proceeds", async () => {
    const { user, onReplace } = renderTransfer(["Grief"]);

    await choose(user, "Enigma\nSpirit");
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: en.transfer.confirmAccept,
      }),
    );

    expect(onReplace).toHaveBeenCalledTimes(1);

    const [next] = onReplace.mock.calls[0] as [
      { crafted: ReadonlySet<string>; unknown: readonly string[] },
    ];

    // Exactly the file, and nothing carried over from what was crafted before.
    expect([...next.crafted]).toEqual(["Enigma", "Spirit"]);
  });

  it("carries the file's unrecognised names into the replacement", async () => {
    const { user, onReplace } = renderTransfer();

    await choose(user, "Enigma\nOndal's Wisdom");
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: en.transfer.confirmAccept,
      }),
    );

    const [next] = onReplace.mock.calls[0] as [
      { crafted: ReadonlySet<string>; unknown: readonly string[] },
    ];

    // Uncounted and unreported, but stored — the terms `progress-persistence`
    // already sets for a name the dataset does not know.
    expect(next.unknown).toEqual(["Ondal's Wisdom"]);
  });

  it("closes and changes nothing when cancelled", async () => {
    const { user, onReplace } = renderTransfer();

    await choose(user, "Enigma");
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: en.transfer.confirmCancel,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    expect(onReplace).not.toHaveBeenCalled();
  });

  it("closes and changes nothing on Escape", async () => {
    const { user, onReplace } = renderTransfer();

    await choose(user, "Enigma");
    await screen.findByRole("alertdialog");

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    expect(onReplace).not.toHaveBeenCalled();
  });
});

describe("the confirmation's focus behaviour", () => {
  it("puts focus on the cancelling action", async () => {
    const { user } = renderTransfer();

    await choose(user, "Enigma");

    // The reflex Enter keeps the player's progress. A modal that destroys it on
    // the default keypress is a modal that destroys it.
    await waitFor(() =>
      expect(
        within(dialog()).getByRole("button", {
          name: en.transfer.confirmCancel,
        }),
      ).toHaveFocus(),
    );
  });

  it("never lets Tab reach a control behind it", async () => {
    const { user } = renderTransfer();

    await openConfirmation(user, "Enigma");

    for (let press = 0; press < 6; press += 1) {
      await user.tab();

      const active = document.activeElement;

      if (!(active instanceof HTMLElement)) continue;
      // The trap's own sentinels are skipped rather than asserted on. Focus
      // passes through them on its way back into the dialog — that is *how*
      // `FloatingFocusManager` closes the cycle — and in a browser nothing
      // observes it.
      if ("floatingUiFocusGuard" in active.dataset) continue;

      expect(dialog()).toContainElement(active);
    }

    // **That the cycle reaches both buttons is a browser check, not this one.**
    // jsdom never runs the guards' redirect — a sentinel's focus handler is what
    // sends focus back to the first control, and without it Tab here bounces
    // between the last button and the sentinel. What this file can prove is the
    // half that matters for correctness: nothing behind the dialog is ever
    // reached. Keyboard use of the confirmation end to end is verified in a real
    // browser, which is what the `run-app` step of this change is for.
  });

  it("hides the page behind it from assistive technology", async () => {
    const { user } = renderTransfer();

    // The manager applies the hiding on mount, in the same asynchronous pass
    // that moves focus — so this waits for the same signal the other two do.
    await openConfirmation(user, "Enigma");

    // The export button is still in the document and is no longer reachable —
    // which is what `modal` means, and what the backdrop says visually.
    expect(
      screen.queryByRole("button", { name: en.transfer.exportAction }),
    ).not.toBeInTheDocument();
  });

  it("gives focus back to the import control on close", async () => {
    const { user } = renderTransfer();

    // Waiting for the dialog to hold focus is the whole precondition: the
    // manager returns focus on unmount only if it had focus to return.
    await openConfirmation(user, "Enigma");

    await user.keyboard("{Escape}");

    // Somewhere deliberate rather than `<body>`, which is the same rule the undo
    // notice follows for the same reason.
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: en.transfer.importAction }),
      ).toHaveFocus(),
    );
  });
});

describe("a file that is not a list of names", () => {
  it("reaches the confirmation counting zero rather than failing", async () => {
    const { user } = renderTransfer();

    // What an `.xlsx` looks like read as text.
    await choose(user, "PK  workbook.xml");

    expect(await screen.findByText(en.transfer.confirmCount(0))).toBeVisible();
  });

  it("opens nothing when the file cannot be read", async () => {
    const { user, onReplace } = renderTransfer();

    const unreadable = new File([""], "gone.csv");

    vi.spyOn(unreadable, "text").mockRejectedValue(
      new DOMException("not found", "NotFoundError"),
    );

    await user.upload(
      screen.getByLabelText(en.transfer.importAction),
      unreadable,
    );

    // No confirmation and no error copy: there is nothing a player could do with
    // one that choosing the file again does not do.
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onReplace).not.toHaveBeenCalled();
  });
});
