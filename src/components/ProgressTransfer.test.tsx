import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProgressTransfer } from "@/components/ProgressTransfer";
import { setLocale } from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";

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

  it("counts a list written in Russian", async () => {
    const { user } = renderTransfer();

    // The dataset's own labels: `Тайна` is Enigma, `Дух` is Spirit, `Бред` is
    // Delirium. A player who reads the page in Russian writes their list in
    // Russian, and a count of zero for a file of real runewords is the bug this
    // is here about.
    await choose(user, "Тайна\nДух\nБред");

    expect(await screen.findByText(en.transfer.confirmCount(3))).toBeVisible();
  });

  it("counts a Windows-1251 file of Russian names", async () => {
    const { user } = renderTransfer();

    // What Excel and Notepad write on a Russian Windows install. The bytes are
    // `Дух` and `Злоба`; read as UTF-8 they are � and match nothing.
    await user.upload(
      screen.getByLabelText(en.transfer.importAction),
      new File(
        [
          Uint8Array.from([
            0xc4, 0xf3, 0xf5, 0x0d, 0x0a, 0xc7, 0xeb, 0xee, 0xe1, 0xe0, 0x0d,
            0x0a,
          ]),
        ],
        "progress.csv",
        { type: "text/csv" },
      ),
    );

    expect(await screen.findByText(en.transfer.confirmCount(2))).toBeVisible();
  });

  it("counts every recognised line of a file that mixes the languages", async () => {
    const { user } = renderTransfer();

    await choose(user, "Enigma\nДух\nБред");

    expect(await screen.findByText(en.transfer.confirmCount(3))).toBeVisible();
  });

  it("matches the same names whichever locale is active", async () => {
    setLocale("ru");

    const { user } = renderTransfer();

    await user.upload(
      screen.getByLabelText(ru.transfer.importAction),
      new File(["Enigma\nДух"], "progress.csv", { type: "text/csv" }),
    );

    // Matching reads the dataset, not the interface. The locale decides what the
    // page says and never what a file means — an English name still matches
    // here, and the count is the one an English session would show.
    expect(await screen.findByText(ru.transfer.confirmCount(2))).toBeVisible();
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

  it("stores canonical English names for a Russian file", async () => {
    const { user, onReplace } = renderTransfer();

    await choose(user, "Тайна\nДух");
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: en.transfer.confirmAccept,
      }),
    );

    const [next] = onReplace.mock.calls[0] as [
      { crafted: ReadonlySet<string>; unknown: readonly string[] },
    ];

    // The label is a key to match on and never an identity. Progress, storage
    // and the next export are English whatever language the file was in.
    expect([...next.crafted]).toEqual(["Enigma", "Spirit"]);
    expect(next.unknown).toEqual([]);
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

    // Captured before the dialog opens, because the manager takes them out of
    // the accessibility tree once it is up and no role query would find them.
    const behind = [
      screen.getByRole("button", { name: en.transfer.exportAction }),
      screen.getByRole("button", { name: en.transfer.importAction }),
      screen.getByLabelText(en.transfer.importAction),
    ];

    await openConfirmation(user, "Enigma");

    for (let press = 0; press < 6; press += 1) {
      await user.tab();

      // **The assertion is "not the page behind", not "inside the dialog".**
      // Those differ only in jsdom, and the difference is the whole reason this
      // test failed on CI while passing on every local run. `FloatingFocusManager`
      // closes its cycle with sentinel spans whose focus handler sends focus back
      // to the first control; jsdom does not reliably run that handler, so Tab
      // walks off the end of the document and lands on `<body>`. `<body>` is not
      // a control behind the dialog, it is nowhere — asserting against it was
      // asserting jsdom's fidelity to a browser rather than anything this
      // component does.
      //
      // What escaping would actually look like is focus arriving on one of the
      // three controls captured above; jsdom's Tab wraps to the start of the
      // document, so that is exactly where a missing trap would put it, and this
      // catches it.
      expect(behind).not.toContain(document.activeElement);
    }

    // **That the cycle reaches both of the dialog's buttons is a browser check,
    // not this one**, for the same reason. It is verified in Chrome by the
    // `run-app` step of this change, which observed Tab cycling Отмена →
    // Заменить → Отмена. Here, the neighbouring test that the page behind is
    // hidden from assistive technology is the other half of the guarantee.
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

    vi.spyOn(unreadable, "arrayBuffer").mockRejectedValue(
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
