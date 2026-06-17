import { site } from '../data/site';

export async function GET({ site: astroSite }: { site: URL }) {
  const base = astroSite || new URL('https://studiodentisticofederzonigranata.vercel.app');
  const urls = site.pages
    .map((page) => {
      const loc = new URL(page.path, base).toString();
      return `<url><loc>${loc}</loc></url>`;
    })
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
