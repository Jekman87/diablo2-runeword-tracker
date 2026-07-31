# Site constants

Language-invariant values the page states about itself — patch number, URLs,
site name, donation receive address — live in `src/header/site.ts`. They are
constants rather than copy: a URL is not translated, a patch number is the same
word in every locale, and a receive address is the same string whichever language
names the coin beside it.

## Donation

The footer offers **USDT on TON** (a Jetton receive address). That instrument was
chosen over USDT-TRC20 for fees and over on-chain BTC, where the fee can exceed
the donation. Card processors and hosted "buy me a coffee" services do not reach
the author in Belarus, so a crypto address is the route that works.

The address is a **receive address only** — public and permanent by nature. No
key or seed belongs in this repository. Coin and network are stated beside it in
the donation dialog, because an address alone is ambiguous between chains and a
sender who picks the wrong one loses the money.
