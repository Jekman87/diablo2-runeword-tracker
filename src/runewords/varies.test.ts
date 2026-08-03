import { type Runeword, runewords } from "@/data";
import { varyingProperties } from "@/runewords/varies";

// The detector reads the Russian variant because that is where the dataset
// marks a roll reliably. These cases pin the convention it depends on, and the
// dataset-wide counts that justified choosing it over the English markers.

function runeword(name: string): Runeword {
  const found = runewords.find((entry) => entry.name === name);

  if (!found) throw new Error(`No runeword named "${name}"`);

  return found;
}

/** A line and its flag, flattened, for a record whose groups do not matter. */
function flagged(name: string): [string, boolean][] {
  const record = runeword(name);
  const flags = varyingProperties(record);

  return record.propertyGroups.flatMap((group, groupIndex) =>
    group.properties.map((line, index): [string, boolean] => [
      line,
      flags[groupIndex][index],
    ]),
  );
}

describe("what counts as a roll", () => {
  it("marks a bracketed Russian range", () => {
    // `Call to Arms`: «+(1-6) к умению "Боевые приказы"» — the charge every
    // buyer checks, and the case that started this.
    const battleOrders = flagged("Call to Arms").find(([line]) =>
      line.includes("Battle Orders"),
    );

    expect(battleOrders?.[1]).toBe(true);
  });

  it("leaves a fixed damage span alone", () => {
    // `Leaf`: `Adds 5-30 Fire Damage` — every copy adds 5-30, so the range is
    // the property rather than a roll. The Russian writes it unbracketed.
    const fireDamage = flagged("Leaf").find(([line]) =>
      line.includes("Adds 5-30 Fire Damage"),
    );

    expect(fireDamage?.[1]).toBe(false);
  });

  it("marks a per-level value", () => {
    const perLevel = flagged("Leaf").find(([line]) =>
      line.includes("Per Character Level"),
    );

    expect(perLevel?.[1]).toBe(true);
  });

  it("leaves a flat value alone", () => {
    const flat = flagged("Leaf").find(([line]) => line === "+3 To Fire Skills");

    expect(flat?.[1]).toBe(false);
  });

  it("catches rolls the English text does not mark", () => {
    // `Cure`: `+75-100% Enhanced Defense` carries no `(varies)`, and rolls.
    // This is the whole reason the Russian line is the sensor.
    const enhancedDefense = flagged("Cure").find(([line]) =>
      line.includes("Enhanced Defense"),
    );

    expect(enhancedDefense?.[1]).toBe(true);
  });
});

describe("across the dataset", () => {
  it("keeps a flag for every line, in the shape of the groups", () => {
    for (const record of runewords) {
      const flags = varyingProperties(record);

      expect(flags).toHaveLength(record.propertyGroups.length);
      record.propertyGroups.forEach((group, index) => {
        expect(flags[index]).toHaveLength(group.properties.length);
      });
    }
  });

  it("marks about a sixth of the lines, not most and not none", () => {
    // A detector that fired on everything or nothing would pass every case
    // above that asserts one direction. The shipped figure is 158 of 969.
    const flags = runewords.flatMap((record) =>
      varyingProperties(record).flat(),
    );

    expect(flags).toHaveLength(969);
    expect(flags.filter(Boolean)).toHaveLength(158);
  });

  it("falls back to the English markers without a Russian variant", () => {
    const record = structuredClone(runeword("Call to Arms")) as Record<
      string,
      unknown
    >;
    delete record.ru;

    const flags = varyingProperties(record as unknown as Runeword).flat();
    const lines = (record.propertyGroups as { properties: string[] }[]).flatMap(
      (group) => group.properties,
    );

    // `(varies)` is on the Battle Orders line in the English text too.
    const index = lines.findIndex((line) => line.includes("Battle Orders"));

    expect(flags[index]).toBe(true);
  });
});
