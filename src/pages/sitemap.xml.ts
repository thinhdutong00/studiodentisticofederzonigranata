import { site } from '../data/site';
import { publishedPages } from '../data/publishedPages';
import { orthodonticPaths } from '../data/orthodonticPaths';
import { orthodonticResultsPath } from '../data/orthodonticResults';

export async function GET({ site: astroSite }: { site: URL }) {
  const base = astroSite || new URL(site.source);
  const paths = publishedPages.map((page) => page.path);
  const urls = [
    ...paths,
    '/richiesta/',
    '/prenota-prima-visita/',
    '/prenota-urgenza/',
    '/visita-ortodonzia/',
    orthodonticResultsPath,
    ...orthodonticPaths.map(pathway => pathway.href),
  ]
    .map((path) => {
      const loc = new URL(path, base).toString();
      return `<url><loc>${loc}</loc></url>`;
    })
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
