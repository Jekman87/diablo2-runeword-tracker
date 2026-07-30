// A dependency-free Chrome driver over the DevTools Protocol.
//
// Neither Playwright nor chromium-cli is installed, and a browser runtime is a
// heavy dependency for a page this small. Chrome is already on the machine and
// Node 24 has a global WebSocket, so this is the whole driver.
//
// Copy it beside your throwaway script and import what you need:
//
//   import { goto, evaluate, shot, send, chrome, ws, URL_BASE } from "./cdp-driver.mjs";
//
// Remember to `ws.close()` and `chrome.kill()` at the end, or the process hangs
// with a headless Chrome still resident.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

export const URL_BASE = "http://localhost:5173/diablo2-runeword-tracker/";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9223;
const OUT = "shots";
mkdirSync(OUT, { recursive: true });

// `--no-sandbox` and an *absolute* `--user-data-dir` are both load-bearing:
// without either, Chrome exits with code 21 and prints nothing at all.
export const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--no-first-run",
  "--no-default-browser-check",
  "--user-data-dir=C:/Users/Jekman/AppData/Local/Temp/claude/cdp-profile",
  "--window-size=1400,1000",
  "about:blank",
]);
chrome.on("error", (error) => console.error("chrome spawn error", error));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function firstPage() {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const page = (await response.json()).find((t) => t.type === "page");
      if (page) return page;
    } catch {
      // CDP is not listening yet.
    }
    await sleep(250);
  }

  throw new Error("Chrome CDP never came up — check the flags above");
}

const page = await firstPage();
export const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => (ws.onopen = resolve));

let nextId = 1;
const pending = new Map();

/** Protocol events, for reading console errors after the fact. */
export const events = [];

ws.onmessage = (message) => {
  const payload = JSON.parse(message.data);

  if (payload.id && pending.has(payload.id)) {
    pending.get(payload.id)(payload);
    pending.delete(payload.id);
  } else if (payload.method) {
    events.push(payload);
  }
};

/** One CDP call. Resolves with the raw protocol response. */
export function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));

  return new Promise((resolve) => pending.set(id, resolve));
}

/** Evaluates an expression in the page and returns its value. Awaits promises. */
export async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });

  if (response.result?.exceptionDetails) {
    throw new Error(
      "page threw: " + JSON.stringify(response.result.exceptionDetails),
    );
  }

  return response.result?.result?.value;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

/**
 * Navigates and waits for the table to exist, rather than for a fixed delay.
 * Vite compiles on demand, so a first load can take several seconds.
 */
export async function goto(url = URL_BASE) {
  await send("Page.navigate", { url });

  for (let attempt = 0; attempt < 60; attempt++) {
    const ready = await evaluate(
      "document.readyState === 'complete' && !!document.querySelector('table')",
    );
    if (ready) return;
    await sleep(500);
  }

  throw new Error("the page never rendered a table");
}

/**
 * Full-page screenshot, into `shots/<name>.png`.
 *
 * The table is ~8000px tall, so these are for machine inspection. To *look* at
 * something, override the device metrics first and drop `captureBeyondViewport`:
 *
 *   await send("Emulation.setDeviceMetricsOverride",
 *     { width: 1300, height: 900, deviceScaleFactor: 1.6, mobile: false });
 */
export async function shot(name, { fullPage = true } = {}) {
  const response = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: fullPage,
  });

  writeFileSync(`${OUT}/${name}.png`, Buffer.from(response.result.data, "base64"));
  console.log(`[shot] ${OUT}/${name}.png`);
}

/** Console and log errors seen so far — check before declaring a run green. */
export function consoleErrors() {
  return events.filter(
    (event) =>
      (event.method === "Log.entryAdded" &&
        event.params.entry.level === "error") ||
      (event.method === "Runtime.consoleAPICalled" &&
        event.params.type === "error"),
  );
}
