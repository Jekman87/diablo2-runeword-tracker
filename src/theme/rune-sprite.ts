import { runes } from "@/data";

/**
 * Where a rune's icon sits in the 440×120 sprite: eleven columns by three rows
 * of 40×40 cells, one per rune.
 */
export interface RuneCell {
  readonly col: number;
  readonly row: number;
}

/** Columns in the sprite. The eleven runes of a tier fill one row exactly. */
export const SPRITE_COLUMNS = 11;

/** Rows in the sprite — one per rarity tier, in ascending order. */
export const SPRITE_ROWS = 3;

/**
 * The sprite cell for a rune, derived from its position in the rune dataset.
 *
 * The vendored sprite's offset order matches `runes.json` array order index for
 * index, so the position is already in the data and nothing needs to store it
 * again. This is the same rule that keeps socket count off the runeword record:
 * a second representation of a fact can only drift from the first. It is also
 * the answer to the sprite-index question `runeword-dataset` left open — the
 * rune record gains no field.
 *
 * A row is therefore exactly a tier band: `common` on 0, `semirare` on 1,
 * `rare` on 2.
 *
 * @throws if the name is not one of the 33 runes. Falling back to cell zero
 * would render `El` for a typo — a wrong icon that still looks like a real one,
 * which is the failure mode this whole module is arranged to avoid.
 */
export function runeCell(name: string): RuneCell {
  const index = spriteIndexByName.get(name);

  if (index === undefined) {
    throw new Error(`Unknown rune name: ${name}`);
  }

  return {
    col: index % SPRITE_COLUMNS,
    row: Math.floor(index / SPRITE_COLUMNS),
  };
}

// Built once at module load rather than scanned per call: the table alone
// resolves 343 rune references.
//
// This lookup lives in the theme layer, not in `src/data`. Sprite geometry is
// presentation, and the dataset should not learn about it.
const spriteIndexByName: ReadonlyMap<string, number> = new Map(
  runes.map((rune, index) => [rune.name, index]),
);
