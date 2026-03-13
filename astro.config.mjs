import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// --- Sitemap lastmod : dates Git pour les pages statiques ---

// Pour les projets avec un blog (collection markdown), décommenter et adapter :
// function readDateModified(dir) {
//   const dates = new Map();
//   for (const file of fs.readdirSync(dir)) {
//     if (!file.endsWith('.md')) continue;
//     const content = fs.readFileSync(path.join(dir, file), 'utf-8');
//     const match = content.match(/dateModified:\s*(\d{4}-\d{2}-\d{2})/);
//     if (match) {
//       dates.set(file.replace('.md', ''), match[1]);
//     }
//   }
//   return dates;
// }
// const postDates = readDateModified(path.resolve('./src/content/posts'));
//
// Dans serialize(), ajouter avant le fallback git :
// const pubMatch = url.pathname.match(/^\/publications\/(.+?)\/$/);
// if (pubMatch && postDates.has(pubMatch[1])) {
//   item.lastmod = new Date(postDates.get(pubMatch[1]));
// }

function getGitDate(filePath) {
  try {
    const date = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    return date || null;
  } catch {
    return null;
  }
}

const pageFileMap = new Map();
const pagesDir = path.resolve('./src/pages');
function scanPages(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      scanPages(path.join(dir, entry.name), `${prefix}/${entry.name}`);
    } else if (entry.name.endsWith('.astro')) {
      const name = entry.name.replace('.astro', '');
      const urlPath = name === 'index' ? `${prefix}/` : `${prefix}/${name}/`;
      pageFileMap.set(urlPath, path.join(dir, entry.name));
    }
  }
}
scanPages(pagesDir);

export default defineConfig({
  site: 'https://example.com',
  prefetch: { defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/ds/') &&
        !page.includes('/recherche/'),
      serialize(item) {
        const url = new URL(item.url);
        const gitDate = getGitDate(pageFileMap.get(url.pathname));
        if (gitDate) {
          item.lastmod = new Date(gitDate);
        }
        return item;
      },
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
  build: {
    format: 'directory',
  },
});
