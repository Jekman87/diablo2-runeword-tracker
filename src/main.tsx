import { StrictMode } from "react";

import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { App } from "@/App";
import "@/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found in index.html");
}

// The build renders the list into `#root` so a crawler — and a first visit — get
// the page without waiting for this bundle. A reader who already has progress
// stored must never see that snapshot: it is not their page, and showing it would
// be the "visible frame of a page the player did not leave behind" that the three
// storage-backed stores load eagerly to avoid. The inline script in each document
// hides the container when this browser holds any of the persisted keys; see
// `scripts/prerender.ts` for where that script comes from.
//
// **Revealing it again is this file's job, and the timing is the whole point.**
// `flushSync` makes the first render commit before the next line runs, so the
// container is unhidden with the reader's real state already in the DOM and no
// frame is painted in between. A `useEffect` would run after paint and produce
// exactly the flash all of this exists to prevent — which is invisible in review
// and obvious on a slow connection.
flushSync(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

rootElement.style.removeProperty("display");
