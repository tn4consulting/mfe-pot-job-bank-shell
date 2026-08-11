import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

jest.mock('./register-scds', () => ({}));
jest.mock('./asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4200/' }));

// This test only renders the homepage route, which never calls
// loadRemoteModule -- mocked directly rather than exercising the real
// jose-backed createVerifiedRemoteModuleLoader, both for isolation (a
// component-render smoke test shouldn't need real crypto -- that's
// shared-remote-integrity's own test suite's job) and to sidestep Jest's
// buildable-library resolver quirk against a locally file:-linked package.
const mockCreateVerifiedRemoteModuleLoader = jest.fn((rawLoadRemoteModule: unknown) => rawLoadRemoteModule);
jest.mock('@tn4consulting/shared-remote-integrity', () => ({
  createVerifiedRemoteModuleLoader: (...args: unknown[]) => mockCreateVerifiedRemoteModuleLoader(...args),
}));

// Same pattern as job-bank-mfe's own App.spec.tsx: mock content-client so
// HomePage's CMS-driven text resolves to a known value instead of the
// initial raw-key fallback or a real (jsdom-unavailable) fetch. Mock
// variable name is prefixed "mock" -- jest's module-factory hoisting only
// allows referencing out-of-scope identifiers with that prefix.
const mockGetPageContents = jest.fn().mockResolvedValue({
  'job-bank-shell.home.hero.ctaButton': { title: 'Search jobs', body: '' },
});
jest.mock('./content-client', () => ({
  HOME_CONTENT_KEYS: ['job-bank-shell.home.hero.ctaButton'],
  createContentClient: () => ({ getPageContents: mockGetPageContents, getPageContent: jest.fn() }),
}));

describe('App', () => {
  beforeEach(() => {
    mockCreateVerifiedRemoteModuleLoader.mockClear();
  });

  it('renders the homepage at the root route by default', async () => {
    const loadRemoteModule = jest.fn();
    const verifiedRemoteContext = {
      verifiedManifests: new Map(),
      remoteBaseUrls: new Map(),
      allowUnverifiedRemotes: false,
    };
    render(<App loadRemoteModule={loadRemoteModule} verifiedRemoteContext={verifiedRemoteContext} />);

    // scds-button is an unregistered custom element in this test
    // environment -- its slotted label is real light-DOM text, asserted
    // directly rather than via a button role.
    expect(await screen.findByText('Search jobs')).toBeInTheDocument();
  });

  it('wraps loadRemoteModule with verification when allowUnverifiedRemotes is false', async () => {
    const loadRemoteModule = jest.fn();
    const verifiedRemoteContext = {
      verifiedManifests: new Map(),
      remoteBaseUrls: new Map(),
      allowUnverifiedRemotes: false,
    };
    render(<App loadRemoteModule={loadRemoteModule} verifiedRemoteContext={verifiedRemoteContext} />);
    await screen.findByText('Search jobs');
    expect(mockCreateVerifiedRemoteModuleLoader).toHaveBeenCalledWith(loadRemoteModule, verifiedRemoteContext);
  });

  it('skips the verification wrapper entirely when allowUnverifiedRemotes is true (dev escape hatch)', async () => {
    const loadRemoteModule = jest.fn();
    const verifiedRemoteContext = {
      verifiedManifests: new Map(),
      remoteBaseUrls: new Map(),
      allowUnverifiedRemotes: true,
    };
    render(<App loadRemoteModule={loadRemoteModule} verifiedRemoteContext={verifiedRemoteContext} />);
    await screen.findByText('Search jobs');
    expect(mockCreateVerifiedRemoteModuleLoader).not.toHaveBeenCalled();
  });
});
