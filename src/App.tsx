import { RunewordTable } from "@/components/RunewordTable";
import { useStrings } from "@/i18n";

// The page: a title, the divider, and the table of all 99 runewords.
//
// The 33-rune grid that stood here was `d2-theme`'s acceptance surface, and the
// table replaces it comprehensively — 343 rune icons in real rows is a stricter
// check on the sprite than eleven columns of it ever was.
//
// No header. `IDEAS.md` puts a patch line and Help, Feedback and Update Notes
// links in the Phase 1 layout, but no change in its list builds them, and
// inventing a header inside the table change is how a change stops being one
// feature. The gap is recorded in `IDEAS.md` for the next proposal to find.

export function App() {
  const strings = useStrings();

  return (
    <main className="mx-auto grid min-h-dvh max-w-4xl content-start gap-6 p-6">
      <h1 className="text-3xl font-normal tracking-wide">
        {strings.app.title}
      </h1>

      <div className="gold-divider" />

      <RunewordTable />
    </main>
  );
}
