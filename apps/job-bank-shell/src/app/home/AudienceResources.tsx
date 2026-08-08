// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';

export interface AudienceResourcesProps {
  heading: string;
  titles: string[];
}

/** No real destinations exist for these audience groups anywhere in mfe-pot -- static (no-href) scds-card, title only. */
export function AudienceResources({ heading, titles }: AudienceResourcesProps) {
  return (
    <section className="home-section">
      <div className="scds-container">
        <h2>{heading}</h2>
        <div className="home-tile-grid home-tile-grid--audience">
          {titles.map((title) => (
            <scds-card key={title} card-title={title} />
          ))}
        </div>
      </div>
    </section>
  );
}
