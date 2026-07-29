import { itemTypes, runewords } from "@/data";
import { type Slot, slots, slotsOf, slotsOfCategory } from "@/runewords/slots";

// Asserted over the whole dataset rather than a fixture, because the failure
// this file exists to catch is a category nobody mapped — and a fixture of three
// categories is by construction complete. The real dataset is what can gain a
// twenty-first.

describe("the mapping's totality", () => {
  it("resolves every category any of the 99 runewords names", () => {
    const unmapped = [...new Set(runewords.flatMap((r) => r.itemTypes))]
      .filter((category) => slotsOfCategory(category).length === 0)
      .sort();

    // Named rather than counted, so a category new to us reads as itself in the
    // failure output instead of as a number that went up.
    expect(unmapped).toEqual([]);
  });

  it("resolves every category the reference data declares", () => {
    const unmapped = itemTypes
      .map((itemType) => itemType.name)
      .filter((category) => slotsOfCategory(category).length === 0);

    expect(unmapped).toEqual([]);
    expect(itemTypes).toHaveLength(20);
  });

  it("reports nothing for a category the dataset does not have", () => {
    // The absent case exists so the test above can catch an unmapped category,
    // not so the interface can render a fifth state.
    expect(slotsOfCategory("Orbs")).toEqual([]);
    expect(slotsOfCategory("")).toEqual([]);
  });

  it("gives every runeword at least one slot", () => {
    const slotless = runewords.filter((r) => slotsOf(r).length === 0);

    expect(slotless).toEqual([]);
  });
});

describe("what each slot holds", () => {
  it("matches the dataset's own totals", () => {
    expect(countsBySlot()).toEqual({
      helm: 14,
      melee: 49,
      missile: 19,
      offhand: 10,
      bodyArmour: 22,
    });
  });

  it("sums to more than 99, because a runeword can occupy several", () => {
    const memberships = Object.values(countsBySlot()).reduce(
      (a, b) => a + b,
      0,
    );

    // 114 across 99 runewords. The excess is the thirteen that span more than one
    // slot, and it is the point of the filter rather than double counting: nothing
    // here feeds the progress denominator.
    expect(memberships).toBe(114);
  });

  it("puts the fourteen `Helms` runewords in the helm slot and no others", () => {
    const inHelm = runewords
      .filter((r) => slotsOf(r).includes("helm"))
      .map((r) => r.name);
    const naming = runewords
      .filter((r) => r.itemTypes.includes("Helms"))
      .map((r) => r.name);

    expect(inHelm).toEqual(naming);
    expect(inHelm).toHaveLength(14);
  });

  it("counts a runeword once per slot rather than once per category", () => {
    // `Ancient's Pledge` names `Shields` *and* `Grimoire`, both of which are the
    // offhand slot. It is one off-hand runeword, not two.
    const pledge = named("Ancient's Pledge");

    expect(pledge.itemTypes).toContain("Shields");
    expect(pledge.itemTypes).toContain("Grimoire");
    expect(slotsOf(pledge)).toEqual(["offhand"]);
  });

  it("reports the slots in the control's own order", () => {
    // `Dragon` names `Body Armors` before `Shields`; the filter lists the offhand
    // before body armour, and that is the order reported.
    expect(slotsOf(named("Dragon"))).toEqual(["offhand", "bodyArmour"]);
    expect(slots).toEqual([
      "helm",
      "melee",
      "missile",
      "offhand",
      "bodyArmour",
    ]);
  });
});

describe("runewords that span more than one slot", () => {
  it("is exactly these thirteen", () => {
    const spanning = runewords
      .filter((r) => slotsOf(r).length > 1)
      .map((r) => r.name)
      .sort();

    // Eight more than the four-slot mapping had, and all eight arrive through
    // `Weapons` or through a record naming both a melee category and a missile one.
    // Splitting the weapon slot is what surfaced them; they were always craftable
    // in either kind.
    expect(spanning).toEqual([
      "Breath of the Dying",
      "Call to Arms",
      "Dragon",
      "Dream",
      "Fortitude",
      "Hand of Justice",
      "Insight",
      "Mania",
      "Passion",
      "Phoenix",
      "Silence",
      "Spirit",
      "Venom",
    ]);
  });

  it("appears under each slot it names", () => {
    expect(slotsOf(named("Fortitude"))).toEqual([
      "melee",
      "missile",
      "bodyArmour",
    ]);
    expect(slotsOf(named("Dream"))).toEqual(["helm", "offhand"]);
    expect(slotsOf(named("Phoenix"))).toEqual(["melee", "missile", "offhand"]);
    expect(slotsOf(named("Spirit"))).toEqual(["melee", "offhand"]);
  });

  it("spans three where the record earns it, and never four", () => {
    const three = runewords
      .filter((r) => slotsOf(r).length === 3)
      .map((r) => r.name);

    // `Fortitude` is `Weapons` plus `Body Armors`; `Phoenix` is `Weapons` plus
    // `Shields`. Both really can go into all three.
    expect(three.sort()).toEqual(["Fortitude", "Phoenix"]);
    expect(runewords.filter((r) => slotsOf(r).length > 3)).toEqual([]);
  });

  it("puts a bow runeword under missile and not under melee", () => {
    // `Faith` is `Missile Weapons` alone.
    expect(slotsOf(named("Faith"))).toEqual(["missile"]);
    expect(slotsOf(named("Zephyr"))).toEqual(["missile"]);
  });
});

describe("the entries worth defending", () => {
  it("makes an off-hand category a shield", () => {
    expect(slotsOfCategory("Grimoire")).toEqual(["offhand"]);
  });

  it("puts every Grimoire runeword in the shield slot through `Shields` too", () => {
    // Which is the whole argument for the entry above: a Grimoire runeword is
    // already a shield-slot runeword, so any other mapping would answer the
    // wrong filter.
    const grimoire = runewords.filter((r) => r.itemTypes.includes("Grimoire"));

    expect(grimoire.map((r) => r.name)).toEqual([
      "Ancient's Pledge",
      "Rhyme",
      "Sanctuary",
      "Splendor",
      "Dragon",
      "Dream",
      "Vigilance",
    ]);
    expect(grimoire.every((r) => r.itemTypes.includes("Shields"))).toBe(true);
  });

  it("makes the three general weapon categories weapons", () => {
    // The one category with two slots: `Weapons` means any weapon, so a runeword
    // carrying it can be made in a bow as readily as in a sword.
    expect(slotsOfCategory("Weapons")).toEqual(["melee", "missile"]);
    expect(slotsOfCategory("Melee Weapons")).toEqual(["melee"]);
    expect(slotsOfCategory("Missile Weapons")).toEqual(["missile"]);
  });

  it("makes both shield categories shields", () => {
    expect(slotsOfCategory("Shields")).toEqual(["offhand"]);
    expect(slotsOfCategory("Paladin Shields")).toEqual(["offhand"]);
  });

  it("keeps helm and body armour to one category each", () => {
    const categories = itemTypes.map((itemType) => itemType.name);

    expect(categories.filter((c) => onlySlot(c) === "helm")).toEqual(["Helms"]);
    expect(categories.filter((c) => onlySlot(c) === "bodyArmour")).toEqual([
      "Body Armors",
    ]);
  });
});

describe("what the dataset must not carry", () => {
  it("holds no slot field of its own", () => {
    // The mapping is the application's grouping, and the generator has no source
    // for one. If a `slot` key ever appears in either file, it was invented.
    expect(itemTypes.every((itemType) => !("slot" in itemType))).toBe(true);
    expect(runewords.every((runeword) => !("slot" in runeword))).toBe(true);
  });
});

/** How many runewords occupy each slot. */
function countsBySlot(): Record<Slot, number> {
  const counts = Object.fromEntries(slots.map((slot) => [slot, 0])) as Record<
    Slot,
    number
  >;

  for (const runeword of runewords) {
    for (const slot of slotsOf(runeword)) counts[slot] += 1;
  }

  return counts;
}

/**
 * The one slot a category belongs to, or `undefined` where it belongs to none or
 * to more than one.
 *
 * Only `Weapons` is in that second case, so this reads as "the category's slot"
 * everywhere it is used and still cannot quietly ignore a second one.
 */
function onlySlot(category: string): Slot | undefined {
  const found = slotsOfCategory(category);

  return found.length === 1 ? found[0] : undefined;
}

function named(name: string) {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}
