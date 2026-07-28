export function App() {
  // Deliberate lint error for CI negative verification — this branch is
  // temporary and must never be merged.
  const heading: any = "Diablo II Runeword Tracker";
  return (
    <main className="grid min-h-dvh place-items-center">
      <h1 className="text-2xl font-semibold tracking-wide">{heading}</h1>
    </main>
  );
}
