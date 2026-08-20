// The width-budget probe for the `mobile-layout` change.
//
// Reports, per viewport width and per locale, the numbers the change is judged
// on: the document's width against the viewport (the budget), the document's
// height, the table's width, every column's width, and the median row height.
import { URL_BASE, chrome, evaluate, goto, send, ws } from "./cdp-driver.mjs";

const WIDTHS = [320, 360, 390, 414, 640, 768, 1280];
const LOCALE_KEY = "diablo2-runeword-tracker:locale:v1";

const PROBE = `(() => {
  const doc = document.documentElement;
  const vw = doc.clientWidth;
  const table = document.querySelector("table");
  const rows = [...table.querySelectorAll("tbody tr")]
    .map((row) => Math.round(row.getBoundingClientRect().height))
    .sort((a, b) => a - b);
  const over = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 0.5 || r.left < -0.5) {
      over.push(el.tagName.toLowerCase() + "." + (el.className || "").toString().split(" ")[0] + " @" + Math.round(r.left) + "→" + Math.round(r.right));
    }
  }
  return {
    vw,
    docW: doc.scrollWidth,
    overflow: doc.scrollWidth - vw,
    docH: doc.scrollHeight,
    tableW: Math.round(table.getBoundingClientRect().width),
    cols: [...table.querySelectorAll("thead th")].map((th) => Math.round(th.getBoundingClientRect().width)),
    rowMedian: rows[Math.floor(rows.length / 2)],
    rowMax: rows[rows.length - 1],
    overflowers: over.length,
    firstOverflower: over[0] ?? null,
  };
})()`;

const results = [];

for (const locale of ["en", "ru"]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto(URL_BASE);
  await evaluate(
    `localStorage.clear(); localStorage.setItem(${JSON.stringify(LOCALE_KEY)}, ${JSON.stringify(JSON.stringify(locale))})`,
  );
  await send("Page.reload");
  await goto(URL_BASE);
  await new Promise((r) => setTimeout(r, 600));

  for (const width of WIDTHS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 844,
      deviceScaleFactor: 1,
      mobile: width < 640,
    });
    await new Promise((r) => setTimeout(r, 350));
    results.push({ locale, ...(await evaluate(PROBE)) });
  }
}

console.log(JSON.stringify(results, null, 1));
ws.close();
chrome.kill();
