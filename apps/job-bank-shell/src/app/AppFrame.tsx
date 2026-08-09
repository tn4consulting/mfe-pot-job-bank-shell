// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthSession, clearSession, getStoredSession, onSessionChange } from '@tn4consulting/shared-auth/core';
import { Locale, broadcastLocaleChange, useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from './asset-base-url';
import './register-scds';

/**
 * The app frame (header + footer), owned by this host only. The remote
 * renders its own content inside it via RemoteRouteHost -- it never renders
 * its own header/footer (see CLAUDE.md: the host owns the app frame,
 * remotes are content only).
 *
 * Deliberately no sidebar nav here, unlike mfe-pot-msca-shell's AppFrame:
 * this host has exactly one destination (`/job-bank`), so a collapsible
 * nav sidebar would be pure decoration with nothing to navigate between.
 * If this host ever grows a second remote, revisit -- msca-shell's
 * AppFrame.tsx is the reference for the sidebar/nav-group pattern.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());

  useEffect(() => onSessionChange(setSession), []);

  const otherLocale: Locale = locale === 'en' ? 'fr' : 'en';

  function switchLocale(): void {
    broadcastLocaleChange(otherLocale);
  }

  function signOut(): void {
    clearSession();
    navigate('/');
  }

  return (
    <>
      <scds-header app-title={t('appFrame.appTitle')} skip-to-href="#main-content">
        {/* The language toggle stays available whether or not there's a
            session -- unlike sign-out, it's not identity-gated -- so it's a
            plain sibling in the `account` slot rather than nested inside
            scds-user-menu (which only renders once signed in). */}
        <button slot="account" type="button" onClick={switchLocale}>
          {otherLocale === 'fr' ? 'Français' : 'English'}
        </button>
        {session && (
          <scds-user-menu slot="account" name={session.name}>
            <button type="button" onClick={signOut}>
              {t('accountMenu.signOut', { name: session.name })}
            </button>
          </scds-user-menu>
        )}
      </scds-header>

      {/* scds-header has no nav slot (nav lives in scds-sidebar for
          msca-shell, which this host deliberately doesn't render -- see
          this file's own top comment). A jobbank.gc.ca-style top nav row
          is therefore bespoke markup here, not a header prop/slot. Only
          "Job search" has a real destination in this PoT; the rest are
          decorative, same honesty-about-scope treatment as the footer
          links below and HomePage's own static tiles. */}
      <nav className="home-top-nav" aria-label={t('mainNav.label')}>
        <a href="/job-bank">{t('mainNav.jobSearch')}</a>
        <a href="/training-careers">{t('mainNav.trainingCareers')}</a>
        <a href="/labour-market-information">{t('mainNav.labourMarketInformation')}</a>
        <a href="/hiring">{t('mainNav.hiring')}</a>
        <a href="/help">{t('mainNav.help')}</a>
        <a href="/about">{t('mainNav.about')}</a>
      </nav>

      <main id="main-content">
        <div className="scds-container">{children}</div>
      </main>

      {/* Footer links are decorative -- this PoT doesn't build out a real
          canada.ca global-footer sitemap -- but point at plausible,
          non-"#" paths (matching those real page titles/URLs) rather than
          bare "#" placeholders, which jsx-a11y/anchor-is-valid correctly
          flags as not a navigable address. */}
      <scds-footer>
        <a slot="column-1" href="/contact-us">
          {t('footer.contactUs')}
        </a>
        <a slot="column-1" href="/news">
          {t('footer.news')}
        </a>
        <a slot="column-1" href="/prime-minister">
          {t('footer.primeMinister')}
        </a>
        <a slot="column-2" href="/departments-agencies">
          {t('footer.departmentsAgencies')}
        </a>
        <a slot="column-2" href="/treaties-laws-regulations">
          {t('footer.treatiesLawsRegulations')}
        </a>
        <a slot="column-2" href="/government">
          {t('footer.aboutGovernment')}
        </a>
        <a slot="column-3" href="/public-service-military">
          {t('footer.publicServiceMilitary')}
        </a>
        <a slot="column-3" href="/government-wide-reporting">
          {t('footer.governmentWideReporting')}
        </a>
        <a slot="column-3" href="/open-government">
          {t('footer.openGovernment')}
        </a>
        <a slot="bottom" href="/social-media">
          {t('footer.socialMedia')}
        </a>
        <a slot="bottom" href="/mobile-applications">
          {t('footer.mobileApplications')}
        </a>
        <a slot="bottom" href="/about">
          {t('footer.aboutCanada')}
        </a>
        <a slot="bottom" href="/terms-conditions">
          {t('footer.termsConditions')}
        </a>
        <a slot="bottom" href="/site-privacy">
          {t('footer.sitePrivacy')}
        </a>
      </scds-footer>
    </>
  );
}
