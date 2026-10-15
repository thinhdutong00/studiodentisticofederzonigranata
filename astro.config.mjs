// @ts-check
import { defineConfig } from 'astro/config';
import bookingApiDev from './scripts/booking-api-dev.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://studiodentisticofederzonigranata.it',
  redirects: {
    '/ortodonzia-adulti/': '/visita-ortodonzia/ortodonzia-adulti/',
    '/ortodonzia-bambini-adolescenti/': '/visita-ortodonzia/ortodonzia-bambini-adolescenti/',
    '/allineatori-trasparenti/': '/visita-ortodonzia/allineatori-trasparenti/',
    '/apparecchio-fisso/': '/visita-ortodonzia/apparecchio-fisso/',
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: { plugins: [bookingApiDev()] },
});
