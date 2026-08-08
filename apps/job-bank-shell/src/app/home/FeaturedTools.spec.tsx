import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturedTools } from './FeaturedTools';

const TILES = [
  { title: 'Find a job', description: 'Search and apply.', href: '/job-bank' },
  { title: 'Fill a position', description: 'Post a job.' },
  { title: 'Find training', description: 'Build skills.' },
];

describe('FeaturedTools', () => {
  it('renders the heading and every tile as a scds-card', () => {
    const { container } = render(<FeaturedTools heading="Featured tools" tiles={TILES} />);

    expect(screen.getByRole('heading', { name: 'Featured tools' })).toBeInTheDocument();
    // scds-card is an unregistered custom element in this test
    // environment -- card-title/href land as plain attributes, asserted
    // directly rather than via shadow-DOM rendered text (same convention
    // as dashboard-mfe's NeedsAttentionList.spec.tsx).
    const cards = Array.from(container.querySelectorAll('scds-card'));
    expect(cards).toHaveLength(3);
  });

  it('only "Find a job" gets a real href -- no route exists for the other two tiles', () => {
    const { container } = render(<FeaturedTools heading="Featured tools" tiles={TILES} />);

    const findJobCard = Array.from(container.querySelectorAll('scds-card')).find(
      (card) => card.getAttribute('card-title') === 'Find a job',
    );
    expect(findJobCard?.getAttribute('href')).toBe('/job-bank');

    const fillPositionCard = Array.from(container.querySelectorAll('scds-card')).find(
      (card) => card.getAttribute('card-title') === 'Fill a position',
    );
    expect(fillPositionCard?.hasAttribute('href')).toBe(false);
  });
});
