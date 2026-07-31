import { useEffect, useState } from "react";

import { useStrings } from "@/i18n";

/**
 * Returns the reader to the top of a page whose table is thousands of pixels
 * tall. Absent until the header's sentinel leaves the viewport — so the
 * threshold follows the header's height rather than restating it as a constant.
 *
 * A real button, not a fragment link: a link would put a history entry for a
 * scroll. Smooth unless the reader has asked for reduced motion.
 *
 * `z-index: 3` — above both sticky bands, below the detail panel at 10, so a
 * panel the reader opened stays in front. Documented beside the bands in
 * `src/index.css`.
 */
export function ScrollToTop() {
  const strings = useStrings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sentinel = document.querySelector("[data-scroll-top-sentinel]");
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Visible when the sentinel is *not* intersecting — i.e. the header has
      // scrolled away.
      setVisible(!entry.isIntersecting);
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function goTop() {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={strings.scrollToTop.label}
      className="fixed right-8 bottom-40 z-[3] grid size-10 cursor-pointer place-items-center rounded-full border border-panel-edge bg-panel text-gold-mid hover:text-gold-light"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 12.5V3.5M4.5 7 8 3.5 11.5 7" />
      </svg>
    </button>
  );
}
