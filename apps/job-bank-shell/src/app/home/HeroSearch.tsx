// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export interface HeroSearchProps {
  heading: string;
  intro: string;
  ctaLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
}

/**
 * Decorative hero + search entry point. Deliberately does not thread a
 * typed query into job-bank-mfe's FeatureSearch -- that's the shared
 * remote's own component, and wiring real keyword/location filtering
 * through it would mean editing shared code (see the plan's scope
 * boundary). Submitting just navigates to the real search/apply page.
 */
export function HeroSearch({ heading, intro, ctaLabel, searchLabel, searchPlaceholder }: HeroSearchProps) {
  const navigate = useNavigate();

  return (
    <section className="home-hero">
      <div className="scds-container home-hero__inner">
        <h1>{heading}</h1>
        <p>{intro}</p>
        <div className="home-hero__search">
          <scds-text-input label={searchLabel} placeholder={searchPlaceholder} />
          <scds-button variant="primary" onClick={() => navigate('/job-bank')}>
            {ctaLabel}
          </scds-button>
        </div>
      </div>
    </section>
  );
}
