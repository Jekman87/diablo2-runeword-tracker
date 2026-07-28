import { CraftedProgress } from "@/components/CraftedProgress";
import { RunewordTable } from "@/components/RunewordTable";
import { UndoToast } from "@/components/UndoToast";
import { useCraftedRunewords } from "@/crafted/useCraftedRunewords";
import { useStrings } from "@/i18n";

// The page: a title, the divider, overall progress, the table of all 99
// runewords, and the undo notice.
//
// Crafted state is owned here rather than in the table, because the progress
// bar and the notice are the table's siblings and read the same value. That is
// two levels of prop drilling for one `Set`, which is not a context and is
// certainly not a store library.
//
// The progress bar sits directly under the divider. `IDEAS.md` puts it third in
// the Phase 1 layout, below a patch line and the Help, Feedback and Update
// Notes links — and no change in its list builds those. `site-header` slots
// them in above this without moving it.
//
// Still no header. Inventing one inside the tracking change is how a change
// stops being one feature; the gap is recorded in `IDEAS.md` for the proposal
// that picks it up.

export function App() {
  const strings = useStrings();
  const { crafted, pendingUndo, toggle, undo, dismissUndo } =
    useCraftedRunewords();

  return (
    <main className="mx-auto grid min-h-dvh max-w-4xl content-start gap-6 p-6">
      <h1 className="text-3xl font-normal tracking-wide">
        {strings.app.title}
      </h1>

      <div className="gold-divider" />

      <CraftedProgress crafted={crafted.size} />

      <RunewordTable crafted={crafted} onToggle={toggle} />

      <UndoToast pending={pendingUndo} onUndo={undo} onDismiss={dismissUndo} />
    </main>
  );
}
