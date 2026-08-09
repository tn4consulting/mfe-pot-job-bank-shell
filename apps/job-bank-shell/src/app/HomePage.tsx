// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { ContentClient } from '@tn4consulting/shared-content-client';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { runtimeConfig } from '../runtime-config';
import { assetBaseUrl } from './asset-base-url';
import { createContentClient, HOME_CONTENT_KEYS } from './content-client';
import { usePageContents } from './use-page-contents';
import { HeroSearch } from './home/HeroSearch';
import { FeaturedTools } from './home/FeaturedTools';
import { TrendingTopics } from './home/TrendingTopics';
import { AudienceResources } from './home/AudienceResources';

/**
 * This host's own bespoke jobbank.gc.ca-style landing page -- not sourced
 * from job-bank-mfe's shared `./Component`, so msca-shell (which composes
 * that same remote) is structurally unaffected by anything here. Public,
 * no session required, same as job-bank.gc.ca's real homepage.
 */
export function HomePage() {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const [contentClient, setContentClient] = useState<ContentClient | null>(null);

  useEffect(() => {
    setContentClient(createContentClient(runtimeConfig.strapiBaseUrl, assetBaseUrl));
  }, []);

  const content = usePageContents(contentClient, HOME_CONTENT_KEYS, locale);

  // Never fall through to the raw CMS key -- that's an implementation
  // detail, not something a citizen should ever see on screen.
  function label(key: (typeof HOME_CONTENT_KEYS)[number]): string {
    return content[key]?.title ?? t('errors.contentUnavailable');
  }

  return (
    <div className="home-page">
      <HeroSearch
        heading={label('job-bank-shell.home.hero.heading')}
        intro={label('job-bank-shell.home.hero.intro')}
        ctaLabel={label('job-bank-shell.home.hero.ctaButton')}
        searchLabel={label('job-bank-shell.home.hero.searchLabel')}
        searchPlaceholder={label('job-bank-shell.home.hero.searchPlaceholder')}
      />
      <FeaturedTools
        heading={label('job-bank-shell.home.featuredTools.heading')}
        tiles={[
          {
            title: label('job-bank-shell.home.featuredTools.findJob.title'),
            description: label('job-bank-shell.home.featuredTools.findJob.description'),
            href: '/job-bank',
          },
          {
            title: label('job-bank-shell.home.featuredTools.fillPosition.title'),
            description: label('job-bank-shell.home.featuredTools.fillPosition.description'),
          },
          {
            title: label('job-bank-shell.home.featuredTools.findTraining.title'),
            description: label('job-bank-shell.home.featuredTools.findTraining.description'),
          },
        ]}
      />
      <TrendingTopics
        heading={label('job-bank-shell.home.trendingTopics.heading')}
        topics={[
          {
            title: label('job-bank-shell.home.trendingTopics.aiTraining.title'),
            description: label('job-bank-shell.home.trendingTopics.aiTraining.description'),
          },
          {
            title: label('job-bank-shell.home.trendingTopics.careerDevelopment.title'),
            description: label('job-bank-shell.home.trendingTopics.careerDevelopment.description'),
          },
          {
            title: label('job-bank-shell.home.trendingTopics.skilledTrades.title'),
            description: label('job-bank-shell.home.trendingTopics.skilledTrades.description'),
          },
        ]}
      />
      <AudienceResources
        heading={label('job-bank-shell.home.audienceResources.heading')}
        titles={[
          label('job-bank-shell.home.audienceResources.youngCanadians.title'),
          label('job-bank-shell.home.audienceResources.indigenousPeoples.title'),
          label('job-bank-shell.home.audienceResources.newcomers.title'),
          label('job-bank-shell.home.audienceResources.personsWithDisabilities.title'),
          label('job-bank-shell.home.audienceResources.veterans.title'),
        ]}
      />
    </div>
  );
}
