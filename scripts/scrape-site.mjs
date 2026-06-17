import * as cheerio from 'cheerio';
import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const origin = 'https://studiodentisticofederzonigranata.it';
const publicAssetDir = join(rootDir, 'public', 'assets', 'original');
const dataFile = join(rootDir, 'src', 'data', 'site.ts');

const pageSitemaps = [
  'http://studiodentisticofederzonigranata.it/page-sitemap.xml',
  'http://studiodentisticofederzonigranata.it/post-sitemap.xml',
];

const staticAssets = [
  `${origin}/wp-content/uploads/2022/04/studio-dentistico-federzoni-granata.png`,
  `${origin}/wp-content/uploads/2020/10/cropped-favicon-32x32.png`,
  `${origin}/wp-content/uploads/2020/10/cropped-favicon-192x192.png`,
  `${origin}/wp-content/uploads/2020/10/cropped-favicon-180x180.png`,
  `${origin}/wp-content/uploads/2020/10/cropped-favicon-270x270.png`,
  `${origin}/wp-content/uploads/2022/03/dentista-modena-reggio-emilia.jpg`,
];

const clinicalCategoryPaths = new Set([
  '/estetica/',
  '/protesi/',
  '/parodontologia/',
  '/implantologia/',
  '/ortodonzia/',
  '/conservativa/',
  '/endodonzia/',
]);

const officePaths = new Set(['/modena/', '/reggio-emilia/']);
const contactFormPaths = new Set(['/', '/modena/', '/reggio-emilia/', '/landing-ortodonzia/']);

const htmlEntityMap = {
  '&nbsp;': ' ',
  '&#8211;': '–',
  '&#8217;': '’',
  '&#8220;': '“',
  '&#8221;': '”',
  '&#038;': '&',
  '&amp;': '&',
};

function decodeBasicEntities(value = '') {
  return value.replace(/&(nbsp|amp);|&#(8211|8217|8220|8221|038);/g, (match) => htmlEntityMap[match] || match);
}

function normalizeUrl(url) {
  if (!url) return '';
  let normalized = decodeBasicEntities(url.trim()).replace(/^\/\//, 'https://');
  if (normalized.startsWith('/')) normalized = `${origin}${normalized}`;
  try {
    const parsed = new URL(normalized);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function isUploadAsset(url) {
  return /\/wp-content\/uploads\//.test(url) && /\.(avif|gif|ico|jpe?g|pdf|png|svg|webp)$/i.test(new URL(url).pathname);
}

function localAssetPath(url) {
  const parsed = new URL(url);
  const rel = decodeURIComponent(parsed.pathname.split('/wp-content/uploads/')[1] || '').replace(/^\/+/, '');
  return `/assets/original/${rel}`;
}

function diskAssetPath(url) {
  const parsed = new URL(url);
  const rel = decodeURIComponent(parsed.pathname.split('/wp-content/uploads/')[1] || '').replace(/^\/+/, '');
  return join(publicAssetDir, rel);
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Fetch failed ${response.status} for ${url}`);
  return response.text();
}

async function sitemapUrls() {
  const urls = [];
  for (const sitemap of pageSitemaps) {
    const xml = await fetchText(sitemap);
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.push(match[1].replace('http://', 'https://'));
    }
  }
  return [...new Set(urls)];
}

function cleanText(value) {
  return decodeBasicEntities(value || '').replace(/\s+/g, ' ').trim();
}

function headingId(path, text) {
  if (path !== '/') return undefined;
  const value = text.toLowerCase();
  if (value.includes('digitale')) return 'digitale';
  if (value.includes('studio dentistico') || value.includes('lo studio')) return 'studio';
  if (value.includes('casi clinici')) return 'casi-clinici';
  if (value.includes('modena')) return 'modena';
  if (value.includes('reggio')) return 'reggio-emilia';
  return undefined;
}

function safeExternalHref(href) {
  const normalized = normalizeUrl(href);
  if (!normalized) return href || '';
  const parsed = new URL(normalized);
  if (parsed.hostname === 'studiodentisticofederzonigranata.it') {
    if (isUploadAsset(normalized)) return localAssetPath(normalized);
    return `${parsed.pathname}${parsed.hash || ''}`;
  }
  return normalized;
}

function sanitizeInlineHtml($, element, assetUrls) {
  const clone = cheerio.load($.html(element), { decodeEntities: false });
  clone('script, style, noscript, iframe, svg, canvas, input, textarea, button').remove();
  clone('*').each((_, node) => {
    const tag = node.tagName?.toLowerCase();
    const $node = clone(node);
    if (tag === 'a') {
      const href = safeExternalHref($node.attr('href'));
      $node.attr('href', href);
      if (/^https?:\/\//.test(href) && !href.includes('studiodentisticofederzonigranata.it')) {
        $node.attr('target', '_blank');
        $node.attr('rel', 'noopener noreferrer');
      }
      for (const attr of Object.keys(node.attribs || {})) {
        if (!['href', 'target', 'rel'].includes(attr)) $node.removeAttr(attr);
      }
    } else if (tag === 'strong' || tag === 'b' || tag === 'em' || tag === 'i' || tag === 'br' || tag === 'small') {
      for (const attr of Object.keys(node.attribs || {})) $node.removeAttr(attr);
    } else if (tag === 'span' || tag === 'div') {
      $node.replaceWith($node.contents());
    } else if (tag === 'img') {
      const src = imageSource($node);
      if (src) {
        assetUrls.add(src);
        $node.attr('src', localAssetPath(src));
      }
      for (const attr of Object.keys(node.attribs || {})) {
        if (!['src', 'alt', 'width', 'height'].includes(attr)) $node.removeAttr(attr);
      }
    } else {
      for (const attr of Object.keys(node.attribs || {})) $node.removeAttr(attr);
    }
  });
  return cleanHtml(clone.root().html() || '');
}

function cleanHtml(value) {
  return decodeBasicEntities(value)
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\s+(?=<)/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function imageSource($img) {
  const candidates = [
    $img.attr('data-guid'),
    $img.attr('data-src'),
    $img.attr('data-lazy-src'),
    $img.attr('src'),
    $img.closest('a').attr('href'),
  ].map(normalizeUrl).filter(Boolean);
  const full = candidates.find((candidate) => isUploadAsset(candidate) && !/-uai-\d+x\d+/i.test(candidate));
  return full || candidates.find(isUploadAsset) || '';
}

function collectUploadAssets($, assetUrls) {
  const attrs = ['src', 'href', 'data-src', 'data-guid', 'data-lazy-src', 'content'];
  $('*').each((_, node) => {
    const $node = $(node);
    for (const attr of attrs) {
      const value = normalizeUrl($node.attr(attr));
      if (value && isUploadAsset(value)) assetUrls.add(value);
    }
    const style = $node.attr('style') || '';
    for (const match of style.matchAll(/url\(([^)]+)\)/g)) {
      const value = normalizeUrl(match[1].replace(/^['"]|['"]$/g, ''));
      if (value && isUploadAsset(value)) assetUrls.add(value);
    }
  });
}

function extractBlocks($, path, assetUrls) {
  const root = $('.sections-container').first().length
    ? $('.sections-container').first()
    : $('.main-container, main, article, body').first();

  root.find('script, style, noscript, svg, canvas, [id^="script-row"], .vc_controls, .moove-gdpr-info-bar-hidden, #moove_gdpr_cookie_modal, #moove_gdpr_cookie_info_bar, .screen-reader-response, .wpcf7-response-output, .cf7sr-g-recaptcha, .grecaptcha-badge').remove();

  const embeds = [];
  root.find('iframe').each((_, frame) => {
    const src = normalizeUrl($(frame).attr('src') || $(frame).attr('data-src'));
    if (!src || /googletagmanager|facebook\.com\/tr/.test(src)) return;
    embeds.push({
      embedKind: /youtube|youtu\.be/.test(src) ? 'video' : /maps|google/.test(src) ? 'map' : 'external',
      url: src,
      label: /youtube|youtu\.be/.test(src) ? 'Guarda il video' : /maps|google/.test(src) ? 'Apri la mappa' : 'Apri contenuto',
    });
  });
  root.find('iframe').remove();

  const hasContactForm = contactFormPaths.has(path) || root.find('form, .wpcf7').length > 0;
  root.find('form, .wpcf7').remove();

  const blocks = [];
  const seenText = new Set();
  const seenImages = new Set();
  const selectors = 'h1,h2,h3,h4,h5,h6,p,ul,ol,img,figure,table,blockquote';

  root.find(selectors).each((_, element) => {
    const $element = $(element);
    const tag = element.tagName.toLowerCase();
    if ($element.parents(selectors).length > 0 && !(tag === 'img' && $element.parents('figure').length === 0)) return;

    if (tag === 'img' || tag === 'figure') {
      const $img = tag === 'img' ? $element : $element.find('img').first();
      const src = imageSource($img);
      if (!src || seenImages.has(src)) return;
      seenImages.add(src);
      assetUrls.add(src);
      blocks.push({
        type: 'image',
        src: localAssetPath(src),
        alt: cleanText($img.attr('alt') || $img.attr('title') || ''),
      });
      return;
    }

    const text = cleanText($element.text());
    if (!text || text === '*' || text === 'Loading…' || text.toLowerCase() === 'scroll down') return;
    const key = `${tag}:${text.toLowerCase()}`;
    if (text.length > 18 && seenText.has(key)) return;
    seenText.add(key);

    if (/^h[1-6]$/.test(tag)) {
      blocks.push({
        type: 'heading',
        level: Number(tag.slice(1)),
        text,
        id: headingId(path, text),
      });
      return;
    }

    if (tag === 'p') {
      const html = sanitizeInlineHtml($, element, assetUrls);
      if (!cleanText(cheerio.load(html).text())) return;
      blocks.push({ type: 'paragraph', html });
      return;
    }

    if (tag === 'ul' || tag === 'ol') {
      const html = sanitizeInlineHtml($, element, assetUrls);
      if (!cleanText(cheerio.load(html).text())) return;
      blocks.push({ type: 'list', ordered: tag === 'ol', html });
      return;
    }

    const html = sanitizeInlineHtml($, element, assetUrls);
    if (cleanText(cheerio.load(html).text())) blocks.push({ type: 'html', html });
  });

  for (const embed of embeds) blocks.push({ type: 'embed', ...embed });
  return { blocks, hasContactForm };
}

function pageKind(path) {
  if (path === '/') return 'home';
  if (clinicalCategoryPaths.has(path)) return 'clinical';
  if (officePaths.has(path)) return 'office';
  if (path === '/privacy-policy/' || path === '/cookie-privacy/') return 'policy';
  if (path === '/landing-ortodonzia/') return 'landing';
  if (path === '/video/') return 'video';
  if (path.includes('dente') || path.includes('tumore') || path.includes('carie') || path.includes('dentiera') || path.includes('protesi-dentarie') || path.includes('studio-dentistico-cosa')) return 'article';
  return 'page';
}

async function downloadAsset(url) {
  const output = diskAssetPath(url);
  await mkdir(dirname(output), { recursive: true });
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok || !response.body) {
    console.warn(`Skipped ${url}: ${response.status}`);
    return false;
  }
  await pipeline(response.body, createWriteStream(output));
  return true;
}

function routeFromUrl(url) {
  const path = new URL(url).pathname;
  return path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`;
}

function buildData(pages, assetCount) {
  return {
    name: 'Studio Dentistico Federzoni Granata',
    description: 'Odontoiatria digitale per adulti e bambini a Modena e Reggio Emilia.',
    source: origin,
    logo: localAssetPath(staticAssets[0]),
    heroImage: localAssetPath(staticAssets[5]),
    social: [
      { label: 'Instagram', url: 'https://www.instagram.com/federzonigranatadentista' },
      { label: 'Facebook', url: 'https://www.facebook.com/Federzoni.Granata' },
      { label: 'YouTube', url: 'https://www.youtube.com/channel/UCO-D1kTMKZIFAE2oT6maghg' },
    ],
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Il Digitale', href: '/#digitale' },
      { label: 'Lo Studio', href: '/#studio' },
      { label: 'Casi Clinici', href: '/#casi-clinici' },
      { label: 'Modena', href: '/#modena' },
      { label: 'Reggio Emilia', href: '/#reggio-emilia' },
    ],
    clinicalLinks: [
      { label: 'Estetica', href: '/estetica/' },
      { label: 'Protesi', href: '/protesi/' },
      { label: 'Parodontologia', href: '/parodontologia/' },
      { label: 'Implantologia', href: '/implantologia/' },
      { label: 'Ortodonzia', href: '/ortodonzia/' },
      { label: 'Conservativa', href: '/conservativa/' },
      { label: 'Endodonzia', href: '/endodonzia/' },
      { label: 'Video', href: '/video/' },
    ],
    offices: [
      {
        city: 'Modena',
        title: 'Studio dentistico di Modena',
        address: 'Via Giovanni Segantini, 25, 41124 Modena (MO)',
        phone: '+39 059345557',
        phoneHref: 'tel:+39059345557',
        email: 'info.federzonigranata@gmail.com',
        emailHref: 'mailto:info.federzonigranata@gmail.com',
        hours: 'Dal Lunedì al Venerdì: 10:00 – 19:00; Sabato e Domenica: CHIUSO',
        href: '/modena/',
      },
      {
        city: 'Reggio Emilia',
        title: 'Studio dentistico di Reggio Emilia',
        address: 'Via Guido da Castello 8, 42121 Reggio nell’Emilia (RE)',
        phone: '+39 0522436618',
        phoneHref: 'tel:+390522436618',
        email: 'info.federzonigranata@gmail.com',
        emailHref: 'mailto:info.federzonigranata@gmail.com',
        hours: 'Dal Lunedì al Venerdì: 10:00 – 19:00; Sabato e Domenica: CHIUSO',
        href: '/reggio-emilia/',
      },
    ],
    footerNote: 'Tutte le immagini presenti sul sito sono sotto il copyright dello Studio Dentistico Federzoni Granata',
    generatedAt: new Date().toISOString(),
    assetCount,
    pages,
  };
}

async function main() {
  await mkdir(publicAssetDir, { recursive: true });
  const urls = await sitemapUrls();
  const assetUrls = new Set(staticAssets);
  const pages = [];

  for (const url of urls) {
    console.log(`Scraping ${url}`);
    const html = await fetchText(url);
    const $ = cheerio.load(html, { decodeEntities: false });
    collectUploadAssets($, assetUrls);

    const path = routeFromUrl(url);
    const title = cleanText($('title').first().text()) || cleanText($('h1').first().text()) || 'Studio Dentistico Federzoni Granata';
    const description = cleanText($('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '');
    const ogImageRaw = normalizeUrl($('meta[property="og:image"]').attr('content'));
    if (ogImageRaw && isUploadAsset(ogImageRaw)) assetUrls.add(ogImageRaw);
    const { blocks, hasContactForm } = extractBlocks($, path, assetUrls);
    const firstHeading = blocks.find((block) => block.type === 'heading')?.text;

    pages.push({
      path,
      slug: path === '/' ? '' : path.replace(/^\/|\/$/g, ''),
      kind: pageKind(path),
      title,
      navTitle: firstHeading || title.replace(' - Studio dentistico Federzoni Granata', ''),
      description,
      ogImage: ogImageRaw && isUploadAsset(ogImageRaw) ? localAssetPath(ogImageRaw) : undefined,
      hasContactForm,
      blocks,
    });
  }

  const assets = [...assetUrls].sort();
  let downloaded = 0;
  for (const asset of assets) {
    try {
      if (await downloadAsset(asset)) downloaded++;
    } catch (error) {
      console.warn(`Download failed ${asset}: ${error.message}`);
    }
  }

  const data = buildData(pages, downloaded);
  const ts = `// Generated by scripts/scrape-site.mjs. Edit the scraper or components, then regenerate.\n\nexport const site = ${JSON.stringify(data, null, 2)} as const;\n\nexport type SitePage = (typeof site.pages)[number];\nexport type ContentBlock = SitePage['blocks'][number];\n`;
  await writeFile(dataFile, ts);
  console.log(`Generated ${pages.length} pages and downloaded ${downloaded}/${assets.length} assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
