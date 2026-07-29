import { runes } from "@/data";
import { SPRITE_COLUMNS, SPRITE_ROWS, runeCell } from "@/theme/rune-sprite";

// A wrong sprite offset is invisible: it renders a real rune icon that is simply
// the wrong rune. No test that merely asserts "a background image is set" would
// catch it, and a sampled test is exactly the one that lets it through — so the
// cell is checked for all 33 runes, and the sprite's corners are pinned by name.

describe("runeCell", () => {
  it("covers all 33 runes", () => {
    expect(runes).toHaveLength(SPRITE_COLUMNS * SPRITE_ROWS);
  });

  it("maps every rune to its own cell, in dataset order", () => {
    // Built independently of the implementation: reading straight down the
    // dataset, eleven per row. If the implementation swaps column for row, the
    // comparison fails and names the first rune that diverges.
    const expected = runes.map((rune, index) => ({
      name: rune.name,
      col: index % SPRITE_COLUMNS,
      row: Math.floor(index / SPRITE_COLUMNS),
    }));

    const actual = runes.map((rune) => ({
      name: rune.name,
      ...runeCell(rune.name),
    }));

    expect(actual).toEqual(expected);
  });

  it("gives each rune a distinct cell", () => {
    const cells = runes.map((rune) => {
      const { col, row } = runeCell(rune.name);

      return `${row}:${col}`;
    });

    expect(new Set(cells).size).toBe(runes.length);
  });

  it("keeps every cell inside the sprite", () => {
    for (const rune of runes) {
      const { col, row } = runeCell(rune.name);

      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(SPRITE_COLUMNS);
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(SPRITE_ROWS);
    }
  });

  // The four anchors: both ends of the sprite, and the seam between the first
  // and second rows where an off-by-one in the row division would show up.
  it.each([
    { name: "El", col: 0, row: 0 },
    { name: "Amn", col: 10, row: 0 },
    { name: "Sol", col: 0, row: 1 },
    { name: "Zod", col: 10, row: 2 },
  ])("anchors $name at column $col of row $row", ({ name, col, row }) => {
    expect(runeCell(name)).toEqual({ col, row });
  });

  it("puts each tier band on its own row", () => {
    const rowsByTier = { common: 0, semirare: 1, rare: 2 } as const;

    for (const rune of runes) {
      expect(runeCell(rune.name).row).toBe(rowsByTier[rune.tier]);
    }
  });

  it("fills each row with exactly eleven runes", () => {
    const perRow = new Map<number, number>();

    for (const rune of runes) {
      const { row } = runeCell(rune.name);

      perRow.set(row, (perRow.get(row) ?? 0) + 1);
    }

    expect([...perRow.entries()].sort()).toEqual([
      [0, 11],
      [1, 11],
      [2, 11],
    ]);
  });

  // Falling back to cell zero would render `El` for a typo — a wrong icon that
  // still looks like a real one.
  it.each(["", "el", "Elk", "Zodd", "Ondal's Wisdom"])(
    "refuses the unknown name %o rather than resolving it to a cell",
    (name) => {
      expect(() => runeCell(name)).toThrow(/unknown rune name/i);
    },
  );
});

// The sprite is 440×120 — eleven columns and three rows of a 40px cell — so 40px
// is the size at which the artwork is drawn pixel for pixel, and the size above
// which it is upscaled and softened. Both use sites draw at it, which means both
// ask for nothing and take the one default the theme declares.
//
// Checked by reading the source rather than a rendered element, on purpose. jsdom
// evaluates no `calc()` and applies no stylesheet, so a computed width here would
// come back empty whatever any use site had asked for. What *can* be checked is
// that no use site asks at all — which is the whole of the requirement, since the
// theme's single declared default is the native size.
//
// Read through the bundler's own `?raw` imports rather than `node:fs`: the app's
// `types` list deliberately admits no Node globals, nothing under `src/` may reach
// for the filesystem, and a test is not a reason to widen that. The trade is that
// `src/index.css` cannot be read this way — Vite's stylesheet pipeline intercepts
// `?raw` and hands back nothing — so the theme's own internal consistency is not
// asserted here. It is one file a reader can see whole, and the two integers its
// geometry is built from are `SPRITE_COLUMNS` and `SPRITE_ROWS` above.

describe("the native cell as a ceiling", () => {
  it("has no use site set a rune size at all, let alone a larger one", () => {
    const setters = Object.entries(SOURCES)
      .filter(([path]) => !path.includes(".test."))
      .filter(([, source]) => code(source).includes("--rune-size"))
      .map(([path]) => path);

    // Not "none above 40px" but "none at all". The sprite is 440×120, so 40px is
    // both where the artwork is drawn pixel for pixel and the ceiling above which
    // it is upscaled — which makes the theme's default the right answer for every
    // use site, and a use site that restated it a second opinion about how big a
    // rune is.
    expect(setters).toEqual([]);
  });
});

/** Every TypeScript module under `src/`, as text, keyed by its path. */
const SOURCES: Record<string, string> = import.meta.glob("/src/**/*.{ts,tsx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

/**
 * A module's code with its comments stripped.
 *
 * Load-bearing rather than tidy: the comments explaining why the size lives in
 * one place name `--rune-size` several times, and counting those would make the
 * prose fail the test the prose is describing.
 */
function code(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}
