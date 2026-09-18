// @ts-check
import { defineConfig } from 'astro/config';
import bookingApiDev from './scripts/booking-api-dev.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://studiodentisticofederzonigranata.vercel.app',
  build: {
    inlineStylesheets: 'always',
  },
  vite: { plugins: [bookingApiDev()] },
});
