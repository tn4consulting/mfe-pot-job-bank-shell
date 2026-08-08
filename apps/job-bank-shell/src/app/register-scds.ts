// Registers SCDS custom elements once, as a side effect. Shell is never
// itself federated (no `exposes` in federation.config.mjs), so this only
// ever needs importing from AppFrame.tsx's own module. Stencil's own
// loader guards against double-registering (customElements.get(tag) ||
// customElements.define(...)), so this is harmless even if it somehow
// runs twice. Replaces register-gcds.ts -- GCDS has been removed from the
// family entirely; shell depends directly on
// @tn4consulting/shared-ui-scds-core for scds-header/scds-footer/
// scds-user-menu (app-frame chrome) and, since HomePage.tsx, also
// scds-card/scds-button/scds-text-input (the jobbank.gc.ca-style
// homepage). One defineCustomElements() call registers the whole library.
import { defineCustomElements } from '@tn4consulting/shared-ui-scds-core/loader';

defineCustomElements();
