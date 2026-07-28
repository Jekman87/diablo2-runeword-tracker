## Why

The scaffold builds a static bundle but nothing publishes it, so there is no
way to look at the project outside a local dev server. `IDEAS.md` settled the
target long ago — GitHub Pages under the personal account `Jekman87` — and the
repository is already most of the way there: Pages is enabled with its source
set to **GitHub Actions** (`build_type: "workflow"`), and its deployment status
is `null` because no workflow has ever run. The hosting is waiting for a
workflow file.

The same change closes a promise the previous one left open. `AGENTS.md`'s code
rules, `README.md` and the archived `project-scaffolding` design all state that
type-checking and tests deliberately stay out of the pre-commit hook because
they "belong in CI, which is the next change". Right now two committed
documents describe a CI that does not exist, and a deploy workflow without a
gate would publish unverified code to a public URL. So the gate ships here,
with the deployment it protects.

## What Changes

- Add a GitHub Actions workflow that runs the full quality gate — `typecheck`,
  `lint`, `format:check`, `test`, `build` — on pushes to `main` and on pull
  requests.
- Publish the built bundle to GitHub Pages from that workflow, gated on the
  checks passing, using the official `actions/configure-pages`,
  `actions/upload-pages-artifact` and `actions/deploy-pages` actions rather
  than a `gh-pages` branch.
- **Set Vite's `base` to `/diablo2-runeword-tracker/`.** This is the one change
  that is easy to miss and guarantees a broken site if missed: the project
  deploys to `https://jekman87.github.io/diablo2-runeword-tracker/`, a
  sub-path, while `base` currently defaults to `/`. Every hashed asset URL in
  `dist/index.html` would resolve against the domain root and 404.
- Pin the toolchain versions the workflow runs on, so CI and the developer
  machine agree: Node from `.nvmrc` or the workflow, pnpm from the
  `packageManager` field already in `package.json`.
- Cache the pnpm store between runs so the gate stays quick.
- Update `README.md` with the live URL and a workflow status badge.

Explicitly **not** in this change:

- A custom domain. `cname` is null and no domain has been discussed.
- An SPA `404.html` fallback. There is no router yet and Phase 1 is a single
  page; adding a fallback now would be guessing at a routing scheme. It belongs
  to whichever change introduces routing, if one ever does.
- Per-pull-request preview deployments. Overkill for a solo project.
- Any runeword feature, and any change to the visual theme.

## Capabilities

### New Capabilities

- `continuous-integration`: the automated quality gate — which checks run, on
  which events, and the guarantee that a failing check is visible and blocks
  whatever depends on it.
- `static-site-deployment`: the built bundle is published to a public URL from
  `main`, only after the gate passes, with the deployment traceable to a commit.

### Modified Capabilities

- `build-toolchain`: the Production build requirement gains a sub-path
  constraint. Today the spec only requires that `dist/` contain `index.html`
  plus hashed assets; it says nothing about the URLs those assets are
  referenced by. Deploying under a repository sub-path makes that
  spec-relevant, so the requirement needs to state that built asset references
  resolve under the configured base path, and that `pnpm preview` serves the
  result correctly.

## Impact

- **New**: `.github/workflows/` containing the CI and deployment workflow.
  Possibly `.nvmrc` if the Node version is pinned in a file rather than inline.
- **Modified**: `vite.config.ts` (`base`), `README.md` (live URL, status
  badge), `openspec/specs/build-toolchain/spec.md` via a delta.
- **Dependencies**: none added, neither runtime nor dev. GitHub-hosted runners
  and the official Pages actions cover all of it. This change spends no
  dependency budget.
- **Repository settings**: none to change — Pages is already set to build from
  a workflow. The workflow does need `pages: write` and `id-token: write`
  permissions granted in its own YAML, plus the `github-pages` environment,
  which GitHub creates on first deploy.
- **Untouched**: `vendor/`, `src/` beyond nothing at all, `local/`. No
  application code changes; the only source edit is one bundler option.
- **Risk worth naming**: a wrong `base` fails silently in every local check.
  `pnpm dev`, `pnpm test` and even `pnpm build` all pass with a mismatched base
  — the failure appears only when the deployed page loads its assets from the
  wrong origin path. Verification therefore has to inspect the emitted
  `dist/index.html` and load the real deployed URL, not just watch the gate go
  green.
