import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

jest.mock('./register-scds', () => ({}));
jest.mock('./asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4200/' }));

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
  it('renders the homepage at the root route by default', async () => {
    const loadRemoteModule = jest.fn();
    render(<App loadRemoteModule={loadRemoteModule} />);

    // scds-button is an unregistered custom element in this test
    // environment -- its slotted label is real light-DOM text, asserted
    // directly rather than via a button role.
    expect(await screen.findByText('Search jobs')).toBeInTheDocument();
  });
});
