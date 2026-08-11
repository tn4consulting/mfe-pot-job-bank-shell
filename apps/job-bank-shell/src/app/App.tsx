// This app's tsconfig uses the classic JSX transform (jsxFactory:
// React.createElement) -- see build/build.mjs's own comment for why:
// the automatic transform's synthesized `react/jsx-runtime` import fails
// to resolve once react is a federation-shared external. `import * as
// React` is required for JSX to compile under that transform, even
// though it looks unused.
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RemoteModuleLoader, RemoteModuleLoaderContext } from '@tn4consulting/shared-federation-runtime';
import { createVerifiedRemoteModuleLoader } from '@tn4consulting/shared-remote-integrity';
import type { ShellVerifiedRemoteContext } from '../bootstrap';
import { AppFrame } from './AppFrame';
import { AppRoutes } from './routes';

export interface AppProps {
  loadRemoteModule: RemoteModuleLoader;
  verifiedRemoteContext: ShellVerifiedRemoteContext;
}

/**
 * Stage B of federation remote-loading integrity (see
 * mfe-pot/docs/plans/20260811-1500-federation-remote-loading-integrity.md):
 * wraps the raw federation-result loader from `main.tsx` so every
 * `loadRemoteModule(remoteName, exposedModule)` call -- `RemoteRouteHost`'s,
 * eventually -- hash-checks the specific exposed chunk about to execute
 * against Stage A's already-verified claims before delegating to the real
 * loader. `RemoteRouteHost` itself is unchanged; it only ever depends on
 * `RemoteModuleLoaderContext`'s black-box function type, so it can't tell
 * the difference.
 *
 * `allowUnverifiedRemotes` (dev-only, see `ShellRuntimeConfig`'s doc
 * comment in `main.tsx`) skips the wrapper entirely and uses the raw
 * loader -- Stage A already warned per remote and left
 * `verifiedRemoteContext`'s maps empty in that mode, so wrapping here
 * would just make every remote throw "not admitted" instead of loading.
 */
export function App({ loadRemoteModule, verifiedRemoteContext }: AppProps) {
  const effectiveLoadRemoteModule = verifiedRemoteContext.allowUnverifiedRemotes
    ? loadRemoteModule
    : createVerifiedRemoteModuleLoader(loadRemoteModule, verifiedRemoteContext);
  return (
    <RemoteModuleLoaderContext.Provider value={effectiveLoadRemoteModule}>
      <BrowserRouter>
        <AppFrame>
          <AppRoutes />
        </AppFrame>
      </BrowserRouter>
    </RemoteModuleLoaderContext.Provider>
  );
}
