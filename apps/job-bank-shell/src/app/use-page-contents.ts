import { useEffect, useState } from 'react';
import type { ContentClient, PageContent } from '@tn4consulting/shared-content-client';
import type { Locale } from '@tn4consulting/shared-i18n';

export interface PageContentsState {
  content: Record<string, PageContent>;
  /** True until the current contentClient/locale's own fetch settles (success or failure). */
  loading: boolean;
  /** True only once that fetch has actually rejected -- not while it's still in flight. */
  error: boolean;
}

/**
 * Same pattern as job-bank-mfe's own use-page-contents.ts (this app's
 * first CMS-driven content, so no shared package for it -- each app owns
 * its own copy by convention). Batch-fetches a fixed set of CMS keys and
 * re-fetches whenever `locale` changes, since ContentClient isn't reactive
 * by default.
 *
 * Returns `loading`/`error` distinctly (not just the fetched `content`)
 * so a consumer can render an actual loading state instead of treating an
 * empty `content` -- which is also the shape mid-fetch, before the promise
 * has settled either way -- as if the fetch had already failed.
 */
export function usePageContents(
  contentClient: ContentClient | null,
  keys: readonly string[],
  locale: Locale,
): PageContentsState {
  const [content, setContent] = useState<Record<string, PageContent>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!contentClient) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    contentClient
      .getPageContents([...keys], locale === 'fr' ? 'fr' : 'en')
      .then((result) => {
        if (!cancelled) {
          setContent(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load page content', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // `keys` deliberately omitted -- the one call site passes a
    // module-level constant array.
  }, [contentClient, locale]);

  return { content, loading, error };
}
