import {
  ContentClient,
  FallbackContentClient,
  StaticContentClient,
  StrapiContentClient,
} from '@tn4consulting/shared-content-client';

// `job-bank-shell.*`, not `job-bank.*` -- that namespace already belongs to
// job-bank-mfe's own domain content in the same shared Strapi instance (see
// tools/cms/strapi/src/index.ts in mfe-pot-platform). This host's homepage
// content is hosting-identity content, not job-search-domain content, so it
// gets its own namespace to avoid a key collision.
export const HOME_CONTENT_KEYS = [
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
] as const;

/**
 * Same shape as job-bank-mfe's own content-client.ts -- no CMS configured
 * -> the bilingual static fallback directly; CMS configured -> Strapi as
 * primary, same fallback backing it up if Strapi is unreachable or missing
 * a key at runtime.
 */
export function createContentClient(strapiBaseUrl: string | undefined, assetBaseUrl: string): ContentClient {
  const fallback = new StaticContentClient(assetBaseUrl);
  return strapiBaseUrl ? new FallbackContentClient(new StrapiContentClient(strapiBaseUrl), fallback) : fallback;
}
