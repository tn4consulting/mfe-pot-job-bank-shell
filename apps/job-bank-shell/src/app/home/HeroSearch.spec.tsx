import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HeroSearch } from './HeroSearch';

function renderHero() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <HeroSearch
              heading="Find your next job"
              intro="Search postings from across Canada."
              ctaLabel="Search jobs"
              searchLabel="Job title or keyword"
              searchPlaceholder="e.g. software developer"
            />
          }
        />
        <Route path="/job-bank" element={<p>Job Bank page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('HeroSearch', () => {
  it('renders the heading, intro, and search field', () => {
    renderHero();
    expect(screen.getByRole('heading', { name: 'Find your next job' })).toBeInTheDocument();
    expect(screen.getByText('Search postings from across Canada.')).toBeInTheDocument();
  });

  it('navigates to /job-bank when the CTA is clicked', async () => {
    renderHero();
    // scds-button is an unregistered custom element in this test
    // environment -- no shadow-DOM <button>/button role, so the click
    // targets its slotted (real light-DOM) label text directly.
    await userEvent.click(screen.getByText('Search jobs'));
    expect(await screen.findByText('Job Bank page')).toBeInTheDocument();
  });
});
