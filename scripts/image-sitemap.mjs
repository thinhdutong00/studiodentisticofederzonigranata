import { access, readFile, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { updatePageImagePreview } from './page-image-preview.mjs';

const imageNamespace = 'http://www.google.com/schemas/sitemap-image/1.1';

// A <picture> may show a different photograph at another breakpoint. Keep one
// alternative per media query, without submitting every codec and display density.
function collectImages($, pageUrl) {
  const images = new Map();
  function add(element, src, alt) {
    if (!src || !alt) return;
    const url = new URL(src, pageUrl);
    if (url.origin !== pageUrl.origin || !/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)) return;
    if (!images.has(url.href)) images.set(url.href, { element, url, alt });
  }

  for (const element of $('main img[src]')) {
    const img = $(element);
    // Inactive carousel slides are still part of the page's gallery.
    if (img.is('[aria-hidden="true"], [role="presentation"], [role="none"]')) continue;
    const alt = img.attr('alt')?.trim();
    add(element, img.attr('src'), alt);
    const mediaQueries = new Set();
    for (const source of img.parent('picture').children('source[media][srcset]')) {
      const media = $(source).attr('media');
      if (mediaQueries.has(media)) continue;
      mediaQueries.add(media);
      const candidates = $(source).attr('srcset').split(',');
      add(element, candidates.at(-1).trim().split(/\s+/)[0], alt);
    }
  }

  // The header logo identifies the studio. Associate it once with its homepage.
  if (pageUrl.pathname === '/') {
    const logo = $('header .brand img').first();
    if (logo.length) add(logo[0], logo.attr('src'), logo.attr('alt'));
  }
  return [...images.values()];
}

export default {
  name: 'site-image-sitemap',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const sitemapFile = new URL('sitemap.xml', dir);
      const xml = load(await readFile(sitemapFile, 'utf8'), { xmlMode: true });
      xml('urlset').attr('xmlns:image', imageNamespace);
      const checked = new Set();
      for (const entry of xml('urlset > url')) {
        const node = xml(entry);
        const pageUrl = new URL(node.children('loc').text());
        const htmlFile = new URL('.' + pageUrl.pathname.replace(/\/?$/, '/') + 'index.html', dir);
        const html = await readFile(htmlFile, 'utf8');
        const $ = load(html);
        const directives = $('meta[name="robots" i], meta[name="googlebot" i], meta[name="googlebot-image" i]')
          .map((_, el) => $(el).attr('content')).get().join(',').toLowerCase().split(/[,\s]+/);
        if (directives.some((d) => ['noindex', 'noimageindex', 'none'].includes(d))) continue;
        if ($('link[rel="canonical"]').attr('href') !== pageUrl.href) continue;

        const images = collectImages($, pageUrl);
        for (const { url } of images) {
          if (!checked.has(url.href)) {
            await access(new URL('.' + url.pathname, dir));
            checked.add(url.href);
          }
          const image = xml('<image:image/>');
          image.append(xml('<image:loc/>').text(url.href));
          node.append(image);
        }

        const updated = updatePageImagePreview(html, pageUrl, images, $);
        if (updated !== html) await writeFile(htmlFile, updated);
      }
      await writeFile(sitemapFile, xml.xml());
    },
  },
};
