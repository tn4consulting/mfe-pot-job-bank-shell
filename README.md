# mfe-pot-job-bank-shell

> **Disclaimer:** This is an independent proof-of-technology project, not
> affiliated with, endorsed by, or associated with Service Canada,
> Employment and Social Development Canada (ESDC), or the Government of
> Canada in any way. "Job Bank" and any GC branding/design-system
> references are used only to ground the proof of technology in a
> realistic scenario.

A **second, minimal host app** for the mfe-pot Government of Canada MFE
proof-of-technology, proving the same federation pattern
[`mfe-pot-msca-shell`](../mfe-pot-msca-shell) uses generalizes to more than
one shell. Composes exactly one federated remote —
[`mfe-pot-job-bank`](../mfe-pot-job-bank)'s own routed `./Component` — under
Job-Bank branding: header/footer, language switcher, mock sign-in. No
sidebar nav (there's only one destination), no BFF of its own.

This README covers running **this app standalone**. For the full family
(all 7 repos together) and architecture rationale, see
[`../mfe-pot-platform/README.md`](../mfe-pot-platform/README.md) and
[`CLAUDE.md`](./CLAUDE.md) in this repo (especially "What's deliberately
different from mfe-pot-msca-shell").

## Prerequisites

- **asdf** with the `nodejs` plugin (`.tool-versions` pins the exact
  version — currently 22.22.0, anything ≥ 22.12 works).
- **pnpm** (not asdf-managed — install globally or via `corepack enable`).
- **A GitHub personal access token with `read:packages` scope**, exported as
  `NODE_AUTH_TOKEN` — `pnpm install` pulls `@tn4consulting/shared-*` packages
  from GitHub Packages (`.npmrc` in this repo points at that registry). `gh
  auth token` works as a substitute if you have `gh` authenticated.
- **Docker**, **kind**, **helm**, **kubectl** — only for the containerized
  loop below.

## Install & run standalone

```bash
export NODE_AUTH_TOKEN=<your GitHub token>
pnpm install
pnpm exec nx serve job-bank-shell
```

Open `http://localhost:4205` (a different port from `mfe-pot-msca-shell`'s
4200, so both hosts can run side by side locally). Running alone, this app
has no remote to federate in — its own login page and app frame render, and
it falls back to static federation-manifest config if Strapi isn't
reachable (see the platform repo's README for running Strapi and
`mfe-pot-job-bank` alongside this one for the full experience).

## Test, lint, build

```bash
pnpm exec nx test job-bank-shell
pnpm exec nx lint job-bank-shell
pnpm exec nx build job-bank-shell --configuration=production
```

Or all three across this repo's projects: `pnpm run test` / `pnpm run lint`
/ `pnpm run build`.

## Build & run the Docker image standalone

```bash
docker build --secret id=npm_token,src=<(printf '%s' "$NODE_AUTH_TOKEN") \
  -t mfe-pot-job-bank-shell:local -f apps/job-bank-shell/Dockerfile .
docker run -p 8080:80 mfe-pot-job-bank-shell:local
```

Serves the production build on nginx at `http://localhost:8080` with
`window.__mfePotEnv = {}` (the image's placeholder runtime config).

## Deploy this app's Helm chart locally (kind)

```bash
pnpm deploy:local
```

Runs `tools/deploy-local.sh`: builds the image, creates/reuses a local
`kind` cluster (shared with the other app repos, named `kind`), and
`helm upgrade --install`s `charts/job-bank-shell`. Requires
`../mfe-pot-platform` checked out as a sibling (this chart's library-chart
dependency resolves via a `file://../../../mfe-pot-platform/charts/...`
relative path). Add to `/etc/hosts`:

```
127.0.0.1 job-bank-shell.mfe-pot.local
```

Then `curl -H "Host: job-bank-shell.mfe-pot.local" http://localhost/` or
browse there directly. `mock-idp`'s `ALLOWED_REDIRECT_URI_ORIGINS` must
include this hostname (already configured in `mfe-pot-platform`'s
`charts/mock-idp/values.yaml`) for sign-in to work.

## Where to go next

- [`CLAUDE.md`](./CLAUDE.md) — this repo's specific gotchas, and exactly
  what's intentionally trimmed relative to `mfe-pot-msca-shell`.
- [`../mfe-pot-platform/CLAUDE.md`](../mfe-pot-platform/CLAUDE.md) — the
  full architecture reference for the whole family.
- [`../mfe-pot-platform/README.md`](../mfe-pot-platform/README.md) —
  running all 7 repos together.
