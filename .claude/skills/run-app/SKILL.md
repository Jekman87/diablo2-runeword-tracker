---
name: run-app
description: Launch this app and drive it in a real browser — dev server plus headless Chrome over CDP, for screenshots and end-to-end checks. Use when asked to run, start, or screenshot the app, or to confirm a change works in the real page rather than only in tests.
---

# Running the runeword tracker

Vitest covers the logic; this covers the page. Use it when a change touches
rendering, the locale projection, or anything whose failure mode is visual —
a passing suite proved nothing about how `+2*ур` wraps in a panel.

## Dev server

```bash
pnpm dev
```

**The base path is not `/`.** `vite.config.ts` hardcodes
`base: "/diablo2-runeword-tracker/"` so `pnpm preview` rehearses GitHub Pages
faithfully, which means the dev URL is:

```
http://localhost:5173/diablo2-runeword-tracker/
```

Poll it rather than sleeping, and kill by port when done:

```bash
timeout 40 bash -c 'until curl -sf http://localhost:5173/diablo2-runeword-tracker/ >/dev/null; do sleep 1; done'
# ...
netstat -ano | grep ":5173" | grep LISTENING | awk '{print $5}' | sort -u \
  | while read pid; do taskkill //PID $pid //F; done
```

## Driving it

Neither `chromium-cli` nor Playwright is installed, and installing a browser
runtime for a page this small is not worth it. Chrome is already on the machine
and speaks CDP; Node 24 has a global `WebSocket`, so a driver is ~80 lines with
no dependencies. `scripts/cdp-driver.mjs` beside this file is that driver —
copy it to your scratchpad and import from it.

```bash
cp .claude/skills/run-app/scripts/cdp-driver.mjs "$SCRATCHPAD/"
```

```js
import { goto, evaluate, shot, send, chrome, ws, URL_BASE } from "./cdp-driver.mjs";

await goto(URL_BASE);
await evaluate(`localStorage.clear()`);   // start as a first visit
await send("Page.reload");
await goto(URL_BASE);
await shot("01-english");
ws.close();
chrome.kill();
```

## The flags that matter

Chrome exits with code 21 and no output if you get these wrong — it fails
silently, which costs twenty minutes to diagnose.

- `--no-sandbox` — required. Without it: exit 21, nothing on stderr.
- `--user-data-dir=<absolute path>` — required, and absolute. A relative path
  also gives exit 21.
- `--headless=new`, `--disable-gpu`, `--no-first-run`,
  `--no-default-browser-check` — the usual set.

`PHONE_REGISTRATION_ERROR` on stderr is normal noise from Chrome's GCM client.
Ignore it; CDP is up if `http://127.0.0.1:<port>/json/version` answers.

## Gotchas this page has

- **Persisted state leaks between runs.** The locale, the view settings and the
  crafted set all live in `localStorage`, so a second run inherits the first
  one's sort direction and progress. Clear it and reload before asserting
  anything, or a descending sort will look like a collation bug.
- **The empty state is a `<tr>`.** `document.querySelectorAll('tbody tr').length`
  is 1, not 0, when a query matches nothing — the message row carries a runeword
  row's borders on purpose. Count data rows by
  `tbody tr td button[aria-pressed]` instead.
- **The search field is a controlled React input.** Setting `.value` fires no
  `onChange`. Go through the native setter:

  ```js
  const field = document.querySelector('input[type="search"], input[type="text"]');
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, "value",
  ).set;
  setter.call(field, "доспех");
  field.dispatchEvent(new Event("input", { bubbles: true }));
  ```

- **Detail panels are portalled and rendered only while open**, so query
  `[role="dialog"]` after clicking a name, not before.
- **`captureBeyondViewport: true` screenshots the whole 8000px page**, which is
  unreadable when scaled to fit. For anything you intend to *look* at, set
  `Emulation.setDeviceMetricsOverride` with `deviceScaleFactor: 1.6` and capture
  the viewport only.

## Checks worth running for a locale change

The Russian locale's contract is "strictly one language on screen", and the
cheap version of that assertion caught real bugs:

```js
// No Latin word anywhere in the Russian table body.
const words = document.querySelector("tbody").innerText.match(/[A-Za-z]{2,}/g) ?? [];
```

Also worth driving: switch to Russian and back and confirm
`localStorage.getItem("diablo2-runeword-tracker:crafted:v1")` still holds
canonical English names, because that is the invariant the whole
identity-versus-presentation split rests on.
