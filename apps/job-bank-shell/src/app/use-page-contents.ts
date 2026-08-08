import { useEffect, useState } from 'react';
import type { ContentClient, PageContent } from '@tn4consulting/shared-content-client';
import type { Locale } from '@tn4consulting/shared-i18n';

/**
 * Same pattern as job-bank-mfe's own use-page-contents.ts (this app's
 * first CMS-driven content, so no shared package for it -- each app owns
 * its own copy by convention). Batch-fetches a fixed set of CMS keys and
 * re-fetches whenever `locale` changes, since ContentClient isn't reactive
 * by default.
 */
export function usePageContents(
  contentClient: ContentClient | null,
  keys: readonly string[],
  locale: Locale,
): Record<string, PageContent> {
  const [content, setContent] = useState<Record<string, PageContent>>({});

  useEffect(() => {
    if (!contentClient) {
      return;
    }
    let cancelled = false;
    contentClient
      .getPageContents([...keys], locale === 'fr' ? 'fr' : 'en')
      .then((result) => {
        if (!cancelled) {
          setContent(result);
        }
      })
      .catch((err) => {
        console.error('Failed to load page content', err);
      });
    return () => {
      cancelled = true;
    };
    // `keys` deliberately omitted -- the one call site passes a
    // module-level constant array.
  }, [contentClient, locale]);

  return content;
}
