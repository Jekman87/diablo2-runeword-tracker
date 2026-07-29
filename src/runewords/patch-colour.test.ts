import { runewords } from "@/data";
import { patchColour } from "@/runewords/patch-colour";

// Asserted over the dataset's own patch values rather than over invented ones.
// The mapping's whole job is to cover what the data holds, so a test that made
// its own values up would keep passing on the day the generator emits a sixth
// patch — which is precisely the day somebody needs to be told.

describe("the patch values the dataset holds", () => {
  it("holds exactly five, in the counts the mapping was built for", () => {
    const counts = new Map<string, number>();

    for (const runeword of runewords) {
      const key = runeword.patch ?? NONE;

      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    expect(Object.fromEntries(counts)).toEqual({
      "1.10": 46,
      "1.11": 7,
      "2.4": 7,
      "2.6": 7,
      "3.0": 7,
      [NONE]: 25,
    });
  });

  it("gives every patch in the data a colour", () => {
    const uncoloured = patched().filter(
      (runeword) => patchColour(runeword.patch as string) === "",
    );

    expect(uncoloured).toEqual([]);
  });

  it("colours 74 badges and leaves 25 rows with no badge to colour", () => {
    expect(patched()).toHaveLength(74);
    expect(runewords.length - patched().length).toBe(25);
  });
});

describe("the colours themselves", () => {
  it("treats `1.10` and `1.11` as one era", () => {
    expect(patchColour("1.10")).toBe(patchColour("1.11"));
  });

  it("tells `3.0` apart from `1.10`", () => {
    expect(patchColour("3.0")).not.toBe(patchColour("1.10"));
  });

  it("gives each of the four eras a distinct class", () => {
    const classes = ["1.10", "2.4", "2.6", "3.0"].map(patchColour);

    expect(new Set(classes).size).toBe(4);
  });

  it("resolves a patch nobody has chosen a colour for to nothing", () => {
    // Visibly plain rather than borrowing another era's colour, so a patch that
    // arrives without a decision looks unfinished instead of looking wrong.
    expect(patchColour("3.1")).toBe("");
    expect(patchColour("")).toBe("");
  });

  it("returns a class the stylesheet can see, not one assembled from the value", () => {
    // The literal that makes the utility survive Tailwind's build-time scan. If
    // this ever becomes a template over the patch string, the badge loses its
    // background in production and nowhere else.
    expect(patchColour("3.0")).toBe("bg-patch-3-0");
  });
});

function patched() {
  return runewords.filter((runeword) => runeword.patch !== undefined);
}

// Stands in for "this runeword names no patch" while the values are counted.
// Not a patch value and not a key in the mapping — 25 records genuinely carry
// nothing, and they need somewhere to be counted that cannot collide with a
// real patch.
const NONE = "(none)";
