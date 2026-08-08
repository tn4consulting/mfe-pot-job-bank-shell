import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage';

jest.mock('./register-scds', () => ({}));
jest.mock('./asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4200/' }));

// Same pattern as job-bank-mfe's own App.spec.tsx -- mocks content-client
// so this page's CMS-driven text resolves to known values instead of the
// initial raw-key fallback or a real (jsdom-unavailable) fetch. The
// factory only references the bare `mockGetPageContents` jest.fn() --
// referencing any other top-level const from inside it hits a "Cannot
// access before initialization" error, since the hoisted jest.mock() call
// runs before later const declarations in this file do. Its resolved
// value is set in beforeEach instead, once module loading has finished.
const mockGetPageContents = jest.fn();
jest.mock('./content-client', () => ({
  HOME_CONTENT_KEYS: [
    'job-bank-shell.home.hero.heading',
    'job-bank-shell.home.hero.intro',
    'job-bank-shell.home.hero.ctaButton',
    'job-bank-shell.home.hero.searchLabel',
    'job-bank-shell.home.hero.searchPlaceholder',
    'job-bank-shell.home.featuredTools.heading',
    'job-bank-shell.home.featuredTools.findJob.title',
    'job-bank-shell.home.featuredTools.findJob.description',
    'job-bank-shell.home.featuredTools.fillPosition.title',
    'job-bank-shell.home.featuredTools.fillPosition.description',
    'job-bank-shell.home.featuredTools.findTraining.title',
    'job-bank-shell.home.featuredTools.findTraining.description',
    'job-bank-shell.home.trendingTopics.heading',
    'job-bank-shell.home.trendingTopics.aiTraining.title',
    'job-bank-shell.home.trendingTopics.aiTraining.description',
    'job-bank-shell.home.trendingTopics.careerDevelopment.title',
    'job-bank-shell.home.trendingTopics.careerDevelopment.description',
    'job-bank-shell.home.trendingTopics.skilledTrades.title',
    'job-bank-shell.home.trendingTopics.skilledTrades.description',
    'job-bank-shell.home.audienceResources.heading',
    'job-bank-shell.home.audienceResources.youngCanadians.title',
    'job-bank-shell.home.audienceResources.indigenousPeoples.title',
    'job-bank-shell.home.audienceResources.newcomers.title',
    'job-bank-shell.home.audienceResources.personsWithDisabilities.title',
    'job-bank-shell.home.audienceResources.veterans.title',
  ],
  createContentClient: () => ({ getPageContents: mockGetPageContents, getPageContent: jest.fn() }),
}));

beforeEach(() => {
  mockGetPageContents.mockReset().mockResolvedValue({
    'job-bank-shell.home.hero.heading': { title: 'Find your next job', body: '' },
    'job-bank-shell.home.hero.intro': { title: 'Search postings from across Canada.', body: '' },
    'job-bank-shell.home.hero.ctaButton': { title: 'Search jobs', body: '' },
    'job-bank-shell.home.hero.searchLabel': { title: 'Job title or keyword', body: '' },
    'job-bank-shell.home.hero.searchPlaceholder': { title: 'e.g. software developer', body: '' },
    'job-bank-shell.home.featuredTools.heading': { title: 'Featured tools', body: '' },
    'job-bank-shell.home.featuredTools.findJob.title': { title: 'Find a job', body: '' },
    'job-bank-shell.home.featuredTools.findJob.description': { title: 'Search and apply.', body: '' },
    'job-bank-shell.home.featuredTools.fillPosition.title': { title: 'Fill a position', body: '' },
    'job-bank-shell.home.featuredTools.fillPosition.description': { title: 'Post a job.', body: '' },
    'job-bank-shell.home.featuredTools.findTraining.title': { title: 'Find training', body: '' },
    'job-bank-shell.home.featuredTools.findTraining.description': { title: 'Build skills.', body: '' },
    'job-bank-shell.home.trendingTopics.heading': { title: 'Trending topics', body: '' },
    'job-bank-shell.home.trendingTopics.aiTraining.title': { title: 'Explore AI training', body: '' },
    'job-bank-shell.home.trendingTopics.aiTraining.description': { title: 'Learn about AI at work.', body: '' },
    'job-bank-shell.home.trendingTopics.careerDevelopment.title': { title: 'Career development', body: '' },
    'job-bank-shell.home.trendingTopics.careerDevelopment.description': { title: 'Plan your next move.', body: '' },
    'job-bank-shell.home.trendingTopics.skilledTrades.title': { title: 'Skilled trades', body: '' },
    'job-bank-shell.home.trendingTopics.skilledTrades.description': { title: 'Discover opportunities.', body: '' },
    'job-bank-shell.home.audienceResources.heading': { title: 'Resources for specific groups', body: '' },
    'job-bank-shell.home.audienceResources.youngCanadians.title': { title: 'Young Canadians', body: '' },
    'job-bank-shell.home.audienceResources.indigenousPeoples.title': { title: 'Indigenous peoples', body: '' },
    'job-bank-shell.home.audienceResources.newcomers.title': { title: 'Newcomers to Canada', body: '' },
    'job-bank-shell.home.audienceResources.personsWithDisabilities.title': {
      title: 'Persons with disabilities',
      body: '',
    },
    'job-bank-shell.home.audienceResources.veterans.title': { title: 'Armed Forces veterans', body: '' },
  });
});

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job-bank" element={<p>Job Bank page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('renders the hero, featured tools, trending topics, and audience resources sections', async () => {
    const { container } = renderHomePage();

    expect(await screen.findByRole('heading', { name: 'Find your next job' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Featured tools' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Trending topics' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Resources for specific groups' })).toBeInTheDocument();

    // scds-card is an unregistered custom element in this test environment
    // -- card-title lands as a plain attribute, not rendered text, so it's
    // asserted directly (same convention as dashboard-mfe's
    // NeedsAttentionList.spec.tsx).
    const cardTitles = Array.from(container.querySelectorAll('scds-card')).map((card) =>
      card.getAttribute('card-title'),
    );
    expect(cardTitles).toEqual(
      expect.arrayContaining(['Find a job', 'Fill a position', 'Find training', 'Young Canadians']),
    );
  });

  it('navigates to /job-bank when the hero search CTA is clicked', async () => {
    renderHomePage();

    // scds-button is likewise unregistered here (no shadow-DOM <button>,
    // no button role) -- its slotted label is real light-DOM text, so the
    // click targets that text node directly.
    await userEvent.click(await screen.findByText('Search jobs'));

    expect(await screen.findByText('Job Bank page')).toBeInTheDocument();
  });
});
