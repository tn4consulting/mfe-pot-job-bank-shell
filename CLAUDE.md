# mfe-pot-job-bank-shell

## What this is

A **second, minimal host app** for the mfe-pot Government of Canada MFE proof-of-technology, proving the same Native Federation pattern that `mfe-pot-msca-shell` uses generalizes to more than one shell. This host composes exactly **one** federated remote — `mfe-pot-job-bank-mfe`'s own routed `./Component` — under Job-Bank branding: a plain GC-style header/footer, language switcher, the same real authorization-code + PKCE sign-in flow against `mock-idp`, and a runtime federation manifest reader. No sidebar nav (see "What's deliberately different from mfe-pot-msca-shell" below), no BFF of its own.

**This repo doesn't carry its own architecture doc.** Full rationale — bilingual/WCAG/GCDS requirements, the Native Federation setup, why apps are thin and libs hold the logic, the federation-sharing policy, security model, i18n mechanism, hosting/Helm pattern, and every non-obvious gotcha behind the code in this repo — lives in **`../mfe-pot-platform/CLAUDE.md`**. Read it before making any architectural change here; this file only covers what's specific to this repo. See `../CLAUDE.md` (the `mfe-pot` meta repo) for the full repo map.

## What's deliberately different from mfe-pot-msca-shell

This repo was scaffolded directly from `mfe-pot-msca-shell` (same PKCE flow, same runtime-config/federation-manifest resolution, same Helm chart shape) and then trimmed down to the minimum needed to prove a second host works. Know what's intentionally **not** here before assuming something is missing:

- **No sidebar nav** — `AppFrame.tsx` renders just `scds-header`/`scds-footer`, no `scds-sidebar`. With exactly one destination (`/job-bank`), a collapsible nav sidebar would be pure decoration with nothing to navigate between. If this host ever grows a second remote, `mfe-pot-msca-shell`'s `AppFrame.tsx` is the reference for the sidebar/nav-group pattern to bring back.
- **No cross-remote widget-loader Contexts** — `routes.tsx` has none of `mfe-pot-msca-shell`'s `JobApplicationsWidgetLoaderContext`/`EiReportingStatusWidgetLoaderContext`/`PaymentHistoryWidgetLoaderContext` wiring. This host only ever mounts job-bank-mfe's own `./Component` via a plain `<RemoteRouteHost remoteName="job-bank-mfe" />` — there's no cross-remote widget composition happening here at all.
- **`runtimeConfig.remotes` has a single entry** (`job-bank`) in both `main.tsx`'s dev defaults and `charts/job-bank-shell/values.yaml` — not all four remotes msca-shell knows about.
- **Distinct identity end to end**: Nx project `job-bank-shell`, federation name `job-bank-shell`, PKCE `CLIENT_ID = 'mfe-pot-job-bank-shell'`, dev-server port 4205 (msca-shell uses 4200 — the two hosts can run side by side locally), Ingress host `job-bank.mfe-pot.local`, Helm release `job-bank-shell`. `mock-idp`'s `ALLOWED_REDIRECT_URI_ORIGINS` must include this app's own Ingress origin alongside `mfe-pot-msca-shell`'s (see `mfe-pot-platform/charts/mock-idp/values.yaml`) — running two hosts against one shared `mock-idp` is genuinely new territory for this family, worth a real browser check through both, not just a code review, whenever this changes.

Otherwise this repo follows every convention `mfe-pot-msca-shell`'s CLAUDE.md documents (federation-sharing gotchas, the `main.tsx` bare-specifier constraint, the `build.mjs`/`serve.mjs` `external` array requirement) — read that repo's CLAUDE.md for the parts that are identical here, rather than duplicating it.

## What's in this repo

- `apps/job-bank-shell` — the only app; no co-located BFF (a pure federation host). No `libs/`.
- `charts/job-bank-shell` — this app's Helm chart, depending only on the platform repo's `mfe-frontend-lib` library chart (no backend, so `mfe-backend-lib` isn't used) plus a hand-written `templates/ingress.yaml`.
- `apps/job-bank-shell/Dockerfile` — nginx-served static build, same shape as every other frontend in the family; see the platform repo's CLAUDE.md ("Hosting: Kubernetes + Helm") for the Docker-build gotchas (npm auth secret mount, the `nx` postinstall hang fix) that apply here too.

Depends on published packages from GitHub Packages: `@tn4consulting/shared-auth`, `shared-federation-config`, `shared-federation-runtime`, `shared-i18n`, `shared-runtime-config`, `shared-ui-scds-core` (pinned in `package.json`; keep in sync with `platform-versions.json` in `mfe-pot-platform`). No `shared-content-client` — this app doesn't render any CMS-driven content itself.

## CI

`.github/workflows/ci.yml`: lint/test/build, then builds the image, spins up an ephemeral `kind` cluster, `helm install`s this chart, and curls the Ingress-routed hostname to confirm it serves. Checks out `mfe-pot-platform` as a sibling directory (public repo, no extra secret needed) so the chart's `file://` library-chart dependency resolves the same way it does in local dev. See `README.md` for local install/serve/build/Docker/Helm instructions.

## Renovate

`renovate.json` extends `github>tn4consulting/mfe-pot-platform` — the shared preset (groups `react`, `react-dom`, and `@tn4consulting/shared-ui-scds-core` into one coordinated pinned bump, the federation-shared singletons). Don't hand-roll React/SCDS version bumps here independently of the other repos; `platform-versions.json` in `mfe-pot-platform` is the source of truth. `listr2` stays pinned separately, via `pnpm.overrides` in this repo's own `package.json`.
