import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';
import {
  existingArticles,
  guideCategories,
  guideIndexEntries,
  guideIndexGroups,
  guidePath,
  guides,
  guidesForTreatment,
  guidesIndexPath,
  nonIndexablePaths,
  publishedGuidePaths,
  publishedGuides,
  requestTreatmentLabels,
  resolveGuideReference,
} from '../src/data/guides.js';

const root = new URL('..', import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), 'utf8');
const requestPage = read('src/pages/richiesta.astro');
const siteData = read('src/data/site.ts');

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const pagesDir = join(root, 'src/pages');
const staticRoutes = walk(pagesDir)
  .filter((file) => file.endsWith('.astro') && !file.includes('['))
  .map((file) => `/${relative(pagesDir, file).replace(/\.astro$/, '').replace(/(^|\/)index$/, '')}/`.replace(/\/+/g, '/'));
const dataRoutes = Array.from(siteData.matchAll(/"path": "([^"]+)"/g), (match) => match[1]);
const knownRoutes = new Set([...staticRoutes, ...dataRoutes, ...publishedGuidePaths]);
const pathOnly = (href) => href.split('?')[0];

test('ogni guida pubblicata ha i contenuti necessari', () => {
  assert.ok(publishedGuides.length > 0);
  const slugs = new Set();
  for (const guide of publishedGuides) {
    assert.ok(!slugs.has(guide.slug), `slug duplicato: ${guide.slug}`);
    slugs.add(guide.slug);
    for (const field of ['title', 'seoTitle', 'description', 'summary', 'kicker', 'lead', 'updated']) {
      assert.ok(guide[field]?.length > 0, `${guide.slug}: manca ${field}`);
    }
    assert.ok(guide.description.length <= 200, `${guide.slug}: description troppo lunga`);
    assert.ok(guide.sections.length >= 3, `${guide.slug}: poche sezioni`);
    assert.ok(guide.faqs.length >= 3, `${guide.slug}: poche FAQ`);
    assert.ok(guide.sources.length >= 1, `${guide.slug}: mancano le fonti`);
    for (const source of guide.sources) assert.match(source.url, /^https?:\/\//);
    assert.ok(guideCategories.some((category) => category.id === guide.category), `${guide.slug}: categoria sconosciuta`);
  }
});

test('modulo breve e CTA portano a /richiesta/ con valori riconosciuti dal questionario', () => {
  const inRequestPage = (value) => requestPage.includes(`'${value}'`);
  for (const label of requestTreatmentLabels) assert.ok(inRequestPage(label), `trattamento non previsto da /richiesta/: ${label}`);
  for (const guide of publishedGuides) {
    assert.equal(pathOnly(guide.cta.href), '/richiesta/', `${guide.slug}: la CTA finale deve portare a /richiesta/`);
    const ctaTreatment = new URL(guide.cta.href, 'https://example.test').searchParams.get('trattamento');
    if (ctaTreatment) assert.ok(inRequestPage(ctaTreatment), `${guide.slug}: trattamento CTA non riconosciuto`);
    const { form } = guide;
    if (form.treatment) {
      assert.ok(inRequestPage(form.treatment), `${guide.slug}: trattamento non riconosciuto`);
      for (const reason of form.reasons || []) assert.ok(inRequestPage(reason), `${guide.slug}: motivo non riconosciuto: ${reason}`);
    } else {
      assert.ok(form.treatmentOptions?.length > 0, `${guide.slug}: scelta aperta senza opzioni`);
      for (const option of form.treatmentOptions) assert.ok(inRequestPage(option), `${guide.slug}: opzione non riconosciuta: ${option}`);
    }
  }
});

test('i collegamenti interni puntano a pagine esistenti', () => {
  assert.ok(knownRoutes.has(guidesIndexPath));
  for (const article of existingArticles) assert.ok(knownRoutes.has(article.href), `approfondimento inesistente: ${article.href}`);
  for (const guide of publishedGuides) {
    for (const link of guide.treatments) assert.ok(knownRoutes.has(link.href), `${guide.slug}: link inesistente ${link.href}`);
    for (const path of guide.treatmentPaths || []) assert.ok(knownRoutes.has(path), `${guide.slug}: trattamento inesistente ${path}`);
    for (const reference of guide.related || []) assert.ok(resolveGuideReference(reference), `${guide.slug}: correlato inesistente ${reference}`);
  }
  for (const path of nonIndexablePaths) assert.ok(knownRoutes.has(path));
});

test('indice: nessuna categoria vuota, bozze escluse, voci uniche', () => {
  assert.ok(guideIndexGroups.every((group) => group.entries.length > 0));
  assert.equal(guideIndexGroups.reduce((total, group) => total + group.entries.length, 0), guideIndexEntries.length);
  assert.equal(new Set(guideIndexEntries.map((entry) => entry.href)).size, guideIndexEntries.length);
  const drafts = guides.filter((guide) => !guide.published).map((guide) => guidePath(guide.slug));
  for (const draft of drafts) assert.ok(!guideIndexEntries.some((entry) => entry.href === draft));
  assert.ok(guidesForTreatment('/implantologia-tradizionale-computer-guidata/').length >= 1);
});

test('menu, sitemap e robots sono coerenti con la raccolta', () => {
  const header = read('src/components/Header.astro');
  const information = header.slice(header.indexOf('const siteMenuInformation = ['), header.indexOf('const mobileMovedInformationLabels'));
  const labels = Array.from(information.matchAll(/label: '([^']+)'/g), (match) => match[1]);
  assert.equal(labels[labels.indexOf('Video') + 1], 'Guide e consigli', 'la voce deve seguire "Video" nel gruppo Informazioni');
  assert.equal(header.split("label: 'Guide e consigli'").length - 1, 1, 'una sola voce di menu');
  const sitemap = read('src/pages/sitemap.xml.ts');
  assert.ok(sitemap.includes('publishedGuidePaths') && sitemap.includes('guidesIndexPath') && sitemap.includes('nonIndexablePaths'));
  assert.ok(read('src/components/BaseLayout.astro').includes('nonIndexablePaths.includes(canonicalPath)'));
});
