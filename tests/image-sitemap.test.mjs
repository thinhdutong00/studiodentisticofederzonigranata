import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';
import imageSitemap from '../scripts/image-sitemap.mjs';

test('la sitemap raccoglie anche le slide successive e le foto specifiche per mobile rispettando canonical e noindex', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'studio-image-sitemap-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const site = 'https://studio.example';
  const pages = [
    { path: 'galleria', canonical: 'galleria', robots: 'max-image-preview:large' },
    { path: 'annuncio', canonical: 'annuncio', robots: 'noindex,follow' },
    { path: 'alias', canonical: 'galleria', robots: '' },
  ];
  const sources = ['cover.jpg', 'mobile.webp', 'later.jpg', 'icon.svg'];
  const body = '<main><picture><source media="(max-width: 720px)" srcset="/mobile.webp"><img src="/cover.jpg" alt="Lo studio"></picture>' +
    '<figure aria-hidden="true"><img src="/later.jpg" alt="Seconda fotografia"></figure>' +
    '<img src="/later.jpg" alt="Seconda fotografia"><img src="/icon.svg" alt=""></main>';
  for (const file of sources) await writeFile(join(root, file), '');
  for (const page of pages) {
    await mkdir(join(root, page.path));
    await writeFile(join(root, page.path, 'index.html'),
      `<html><head><link rel="canonical" href="${site}/${page.canonical}/"><meta name="robots" content="${page.robots}"></head><body>${body}</body></html>`);
  }
  const pageNodes = pages.map((page) => `<url><loc>${site}/${page.path}/</loc></url>`).join('');
  await writeFile(join(root, 'sitemap.xml'), `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pageNodes}</urlset>`);
  await imageSitemap.hooks['astro:build:done']({ dir: pathToFileURL(root + '/') });
  const xml = load(await readFile(join(root, 'sitemap.xml'), 'utf8'), { xmlMode: true });
  assert.equal(xml('urlset').attr('xmlns:image'), 'http://www.google.com/schemas/sitemap-image/1.1');
  assert.deepEqual(xml('url > loc').map((_, el) => xml(el).text()).get(), pages.map((page) => `${site}/${page.path}/`));
  const entries = xml('url');
  assert.deepEqual(entries.eq(0).find('image\\:loc').map((_, el) => xml(el).text()).get(), sources.slice(0, 3).map((file) => `${site}/${file}`));
  assert.equal(entries.eq(1).children().length, 1);
  assert.equal(entries.eq(2).children().length, 1);
});
