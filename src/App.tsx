import { RuneIcon } from "@/components/RuneIcon";
import { runes } from "@/data";

// Interim shell. Until the table lands this page is the theme's acceptance
// surface: it renders all 33 runes as the sprite's own 11×3 grid, so every cell
// can be compared against the reference at a glance rather than sampled — a
// wrong offset renders a real rune icon that is simply the wrong rune, and that
// is not something a test can see.
//
// The divider appears at two container widths deliberately: it has to tile
// across whatever width it is given, with no seam and no crop. Its eventual
// placement in the page header belongs to the change that builds the header.

export function App() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-4xl content-start gap-6 p-6">
      <h1 className="text-3xl font-normal tracking-wide">
        Diablo II Runeword Tracker
      </h1>

      <div className="gold-divider" />

      <ul className="grid grid-cols-11 justify-items-center gap-1">
        {runes.map((rune) => (
          <li key={rune.name} className="grid justify-items-center">
            <RuneIcon name={rune.name} />
            <span className="text-xs text-gold-mid">{rune.name}</span>
          </li>
        ))}
      </ul>

      <div className="gold-divider max-w-xs" />
    </main>
  );
}
