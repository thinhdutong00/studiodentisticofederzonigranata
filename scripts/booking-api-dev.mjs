import { loadEnv } from 'vite';
import { createBookingHandler } from '../server/booking.js';

export default function bookingApiDev() {
  function configure(server) {
    const env = { ...loadEnv(server.config.mode, server.config.envDir, 'RESEND_'), ...process.env };
    const handler = createBookingHandler({ env });
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] === '/api/booking') return void handler(req, res);
      next();
    });
  }
  return { name: 'booking-api-dev', configureServer: configure, configurePreviewServer: configure };
}
