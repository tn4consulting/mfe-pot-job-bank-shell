// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RemoteRouteHost } from '@tn4consulting/shared-federation-runtime';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { AuthCallbackPage } from './AuthCallbackPage';
import { RequireSession } from './RequireSession';

// Unlike mfe-pot-msca-shell (which composes 4 remotes and provides several
// cross-remote widget-loader Contexts above their RemoteRouteHost calls --
// see that repo's routes.tsx), this host composes exactly one: job-bank's
// own routed `./Component`. There's no widget-loader wiring here at all --
// RemoteRouteHost only needs a RemoteModuleLoaderContext.Provider above it
// (already provided in App.tsx), nothing route-specific.
//
// `/` is this host's own bespoke jobbank.gc.ca-style landing page (public,
// no session needed) -- LoginPage moved to `/sign-in` to make room for it.
// `/job-bank` is untouched: still the shared job-bank-mfe remote, still
// session-gated, reached via the homepage's hero/tiles.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/job-bank"
        element={
          <RequireSession>
            <RemoteRouteHost remoteName="job-bank-mfe" />
          </RequireSession>
        }
      />
    </Routes>
  );
}
