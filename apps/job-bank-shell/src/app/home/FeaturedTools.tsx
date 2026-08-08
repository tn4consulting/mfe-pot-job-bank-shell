// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';

export interface FeaturedTile {
  title: string;
  description: string;
  href?: string;
}

export interface FeaturedToolsProps {
  heading: string;
  tiles: FeaturedTile[];
}

/**
 * Only "Find a job" has a real destination in this PoT (`/job-bank`, the
 * shared job-bank-mfe remote). "Fill a position"/"Find training" have no
 * corresponding remote or route anywhere in mfe-pot, so they render as
 * scds-card's static (no-href) variant -- an honest scope choice, not a
 * placeholder to fix later.
 */
export function FeaturedTools({ heading, tiles }: FeaturedToolsProps) {
  return (
    <section className="home-section">
      <div className="scds-container">
        <h2>{heading}</h2>
        <div className="home-tile-grid">
          {tiles.map((tile) => (
            <scds-card key={tile.title} card-title={tile.title} description={tile.description} href={tile.href} />
          ))}
        </div>
      </div>
    </section>
  );
}
