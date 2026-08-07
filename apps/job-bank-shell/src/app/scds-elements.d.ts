import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * Minimal JSX typing for the SCDS custom elements this app renders
 * directly. Confirmed by inspecting `@tn4consulting/shared-ui-scds-core`'s
 * own compiled Stencil metadata: every prop used below is a plain string/
 * boolean prop with a real kebab-case `attribute` mapping, so a plain HTML
 * attribute in JSX is enough. Replaces gcds-elements.d.ts -- GCDS has been
 * removed from the family entirely.
 */
type ScdsElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'scds-header': ScdsElementProps & { 'app-title'?: string; 'skip-to-href'?: string };
      'scds-user-menu': ScdsElementProps & { name?: string };
      'scds-footer': ScdsElementProps;
    }
  }
}

export {};
