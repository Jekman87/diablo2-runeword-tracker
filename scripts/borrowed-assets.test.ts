import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The three assets borrowed from the vendored snapshot exist twice by necessity:
// `vendor/` is a verbatim snapshot whose README forbids editing it, and no module
// under `src/` may import from it, so the consumed copy has to live under `src/`.
//
// That duplication is only honest if a divergence is detected. An edit to either
// side of a binary file is invisible to diff review, so this is the analogue of
// the dataset drift test next door: change one copy without the other and the
// suite fails, naming the file.
//
// It lives in `scripts/` rather than `src/` for the same reason that test does —
// it reads the repository from disk, and `tsconfig.app.json` deliberately
// withholds Node's types from application code.

const ROOT = path.resolve(import.meta.dirname, "..");

// Byte counts as verified against the GitHub API tree listing when the files
// were vendored.
const BORROWED_ASSETS = [
  { file: "runes-sprite.png", bytes: 98_434 },
  { file: "mouse.png", bytes: 1_928 },
  { file: "hr-gold.gif", bytes: 3_482 },
] as const;

describe.each(BORROWED_ASSETS)("borrowed asset $file", ({ file, bytes }) => {
  const vendored = readFileSync(
    path.join(ROOT, "vendor", "runewizard", "assets", file),
  );
  const copied = readFileSync(path.join(ROOT, "src", "assets", "images", file));

  it("is byte-identical to its vendored original", () => {
    expect(copied.equals(vendored)).toBe(true);
  });

  it("still matches the size verified against the GitHub API", () => {
    expect(vendored.byteLength).toBe(bytes);
  });
});
