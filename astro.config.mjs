// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const scriptElementPattern = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const maintenancePageMarker = 'data-maintenance-page';

async function stripScriptsFromHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);

    if (entry.isDirectory()) {
      await stripScriptsFromHtml(entryUrl);
      return;
    }

    if (!entry.name.endsWith('.html')) return;

    const html = await readFile(entryUrl, 'utf8');
    if (!html.includes(maintenancePageMarker)) return;

    const scriptFreeHtml = html.replace(scriptElementPattern, '');

    if (scriptFreeHtml !== html) {
      await writeFile(entryUrl, scriptFreeHtml);
    }
  }));
}

function maintenanceOutput() {
  return {
    name: 'maintenance-output',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await stripScriptsFromHtml(dir);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://studiodentisticofederzonigranata.vercel.app',
  integrations: [maintenanceOutput()],
});
