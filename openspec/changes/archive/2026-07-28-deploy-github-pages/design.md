## Context

The `project-scaffolding` change left a working build and five local commands
(`typecheck`, `lint`, `format:check`, `test`, `build`) that all pass. Nothing
runs them automatically and nothing publishes the result. This change adds the
automation.

Three facts about the current state shape the design, and all three were
verified against the live repository rather than assumed:

- **Pages is already enabled and already set to build from a workflow.**
  `GET /repos/Jekman87/diablo2-runeword-tracker/pages` returns a `build_type`
  of `workflow`, an `html_url` of
  `https://jekman87.github.io/diablo2-runeword-tracker/`, a null `cname` and a
  null `status`. So there is no repository setting to change and no
  `gh-pages` branch to create — the hosting is configured and idle, waiting for
  a workflow to hand it an artifact.
- **The deployment URL has a sub-path.** It is a project page, not a user page.
  `vite.config.ts` currently sets no `base`, which defaults to `/`.
- **The repository is public**, so Actions minutes are free and there is no
  budget argument for keeping the gate minimal.

The constraint that matters most is a failure mode rather than a requirement: a
wrong `base` passes every local check. `pnpm dev` works, `pnpm test` works,
`pnpm build` succeeds and even `pnpm preview` serves happily, because preview
honours whatever `base` is configured. The mismatch only surfaces as a blank
page on the real domain. Any verification plan that stops at "the gate went
green" will not catch it.

## Goals / Non-Goals

**Goals:**

- A push to `main` runs the full gate and, if it passes, publishes the built
  site to `https://jekman87.github.io/diablo2-runeword-tracker/`.
- A pull request runs the same gate and publishes nothing.
- A failing check is unmistakable and stops the deployment.
- The deployed asset URLs are correct under the repository sub-path, and that
  correctness is asserted by the pipeline rather than eyeballed once.
- CI and a developer machine run the same Node and pnpm versions, from a single
  declared source each.
- No new dependencies, runtime or dev.

**Non-Goals:**

- A custom domain. `cname` is null; nothing has been discussed.
- An SPA `404.html` fallback. There is no router and Phase 1 is one page.
- Per-PR preview deployments, deployment approvals, or multiple environments.
- Test coverage thresholds or reporting. The suite is five smoke tests; a
  threshold now would encode a number nobody chose.
- Type-aware linting, still deferred as the scaffolding design decided.
- Any application, data or theme work.

## Decisions

### One workflow, two jobs — not two workflows

A single `.github/workflows/ci.yml` with a `build` job and a `deploy` job, the
second declaring `needs: build` and `if: github.ref == 'refs/heads/main' &&
github.event_name == 'push'`.

The gate and the deployment share checkout, Node setup, pnpm setup, install and
cache restore. Splitting them across two workflow files means duplicating all
of that, and then coordinating "deploy only if CI passed" through a
`workflow_run` trigger — which runs against the default branch's workflow
definition, does not report status back onto the originating commit in the
obvious way, and is a well-known source of confusion. One workflow expresses
the dependency with a single `needs:`.

_Alternative considered:_ deploy from a `peaceiris/actions-gh-pages`-style push
to a `gh-pages` branch. Rejected — Pages is already configured for the
artifact-based workflow path, the official actions need no token handling
beyond `id-token`, and a branch-based deploy puts build output into git
history, which this repository has no reason to carry.

### `base` is hardcoded, not derived from the environment

`vite.config.ts` gets `base: "/diablo2-runeword-tracker/"` as a literal.

The tempting alternatives both make the bug harder to catch:

- `base: process.env.VITE_BASE ?? "/"`, set only in CI — now local `preview`
  and production differ in exactly the dimension that silently breaks, so local
  verification stops meaning anything.
- Deriving it from `GITHUB_REPOSITORY` — same problem, plus the value is empty
  locally.

Hardcoding makes `pnpm preview` a faithful rehearsal of production. That is
worth the two costs it carries: `pnpm dev` now serves at
`localhost:5173/diablo2-runeword-tracker/` rather than the root, and renaming
the repository would break the site until the constant is updated. The first is
cosmetic; the second is caught by the assertion below.

### The pipeline asserts the base path rather than trusting it

After `pnpm build`, a step greps `dist/index.html` and fails if the asset
references are not prefixed with `/diablo2-runeword-tracker/`.

This exists because of the silent-failure property described in Context. It is
three lines of shell that convert the project's one guaranteed-invisible
mistake into a red check. Cheap insurance on exactly the thing that local
tooling cannot see.

### The gate runs as separate steps, accepting one duplicated type-check

`pnpm build` already runs `pnpm typecheck` first, so running `typecheck` as its
own step type-checks twice.

Kept separate anyway. `tsc --build --force` on this project takes about a
second, and the point of CI is to say _what_ broke. A single red "build" step
that might mean a type error, a bundler failure or a Tailwind problem is worse
than five steps where the failing one names itself. Revisit if the type-check
ever becomes slow enough to matter.

### Versions come from files already in the repository

- pnpm: `pnpm/action-setup@v6` with no `version` input, so it reads
  `packageManager: "pnpm@10.20.0"` from `package.json` — the field the scaffold
  already pins.
- Node: a new `.nvmrc`, consumed via `actions/setup-node@v7`'s
  `node-version-file`. Pinning Node 24, matching the development machine.

Two files, each the single source of truth for one tool, and both useful
locally as well as in CI. The floor is set by the dependencies —
`vite@8` requires `^20.19.0 || >=22.12.0` and `vitest@4` requires
`^20 || ^22 || >=24` — so 24 satisfies everything with room ahead of it.

_Alternative considered:_ a `version:` literal in the workflow and a
`node-version:` literal beside it. Rejected — that is two more places for a
version to drift, and drift between CI and local is the class of bug this
decision exists to prevent.

### Ordering: pnpm before `setup-node`, because of the cache

`actions/setup-node`'s `cache: "pnpm"` needs the pnpm binary on PATH to resolve
the store directory, so `pnpm/action-setup` must run first. Reversed, the cache
step fails with a confusing "Unable to locate executable file: pnpm". Install
then runs with `--frozen-lockfile`, which is already CI's default but is worth
stating so the intent survives a future edit.

### Action versions pinned to major tags

`actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6`,
`actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`,
`actions/deploy-pages@v5` — all verified as current at the time of writing.

_Alternative considered:_ pinning to full commit SHAs, which is the stricter
supply-chain posture. Rejected for now: it converts every action update into a
manual lookup, and the threat model for a public hobby repository with no
secrets beyond the Pages token does not justify that overhead. Worth
reconsidering if the project ever gains a deployment secret.

### Concurrency

`concurrency: { group: "pages", cancel-in-progress: false }` on the deploy path.
Pages rejects overlapping deployments, and cancelling a half-finished one is
how a deployment ends up in a stuck state. Queue instead.

## Risks / Trade-offs

- **A wrong `base` is invisible to every local check** → The reason for both
  the hardcoded literal and the `dist/index.html` assertion step. Acceptance
  additionally requires loading the real deployed URL and confirming the asset
  requests return 200, not just that the workflow is green.
- **Renaming the repository silently breaks the site** → The base path becomes
  wrong while every local command still passes. The assertion step turns the
  next deploy red, which is the earliest honest signal available.
- **`pnpm dev` no longer serves at the domain root** → Accepted deliberately, in
  exchange for `pnpm preview` faithfully reproducing production. Documented in
  `README.md` so the sub-path in the dev URL does not read as a bug.
- **First deploy has to create the `github-pages` environment** → GitHub does
  this automatically on the first `deploy-pages` run. No pre-work, but the very
  first run is the one to watch rather than assume.
- **The deployed site is public** → No new exposure: the repository is already
  public and all state lives in the visitor's own `localStorage`, so nothing
  user-specific is transmitted or hosted. Worth stating explicitly rather than
  leaving implied.
- **Action major tags move under us** → A breaking change inside a major tag
  can turn a previously green pipeline red without a commit. The trade-off
  accepted above; the mitigation is that a deploy failure never corrupts the
  live site, it just fails to replace it.
- **The gate is the only thing standing between a commit and production** →
  There is no staging environment and no approval step, by choice for a solo
  project. The compensating control is that `main` is the only deploying branch
  and reverting a commit redeploys the previous state.

## Migration Plan

1. Set `base` in `vite.config.ts`, run `pnpm build`, and inspect
   `dist/index.html` locally to confirm the asset prefix.
2. Run `pnpm preview` and load the sub-path URL to confirm the page renders and
   the CSS applies.
3. Add `.nvmrc` and the workflow. Commit and push to `main`.
4. Watch the first run end to end. The `github-pages` environment appears
   during the deploy job.
5. Load `https://jekman87.github.io/diablo2-runeword-tracker/`, confirm the
   heading renders, Tailwind styles apply, and the network panel shows the
   hashed JS and CSS returning 200 from under the sub-path.
6. Add the live URL and the status badge to `README.md`.

**Rollback:** revert the offending commit and push — the workflow redeploys the
previous state automatically. For a faster path that skips the gate, re-run the
last known-good deployment from the Actions UI; Pages retains deployment
history. Because a failed deploy leaves the previously published site in place,
the worst case of a bad run is a stale site rather than a broken one.

## Open Questions

None blocking. Two things deliberately left open:

- Whether to add an `engines` field to `package.json` alongside `.nvmrc`. It
  would make the Node floor enforceable at install time, but pnpm's behaviour
  there is a separate small decision and this change does not need it.
- A custom domain, if the project ever warrants one. It would change `base`
  back to `/` and add a `CNAME`, which is a small follow-up rather than
  something to design for now.
