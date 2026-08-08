// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';

export interface TrendingTopic {
  title: string;
  description: string;
}

export interface TrendingTopicsProps {
  heading: string;
  topics: TrendingTopic[];
}

/** No real destinations exist for these topics anywhere in mfe-pot -- static (no-href) scds-card, same as FeaturedTools' non-"Find a job" tiles. */
export function TrendingTopics({ heading, topics }: TrendingTopicsProps) {
  return (
    <section className="home-section">
      <div className="scds-container">
        <h2>{heading}</h2>
        <div className="home-tile-grid">
          {topics.map((topic) => (
            <scds-card key={topic.title} card-title={topic.title} description={topic.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
