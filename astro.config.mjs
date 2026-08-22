// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fully static output. Every route is prerendered, so no adapter is needed and
// `dist/` deploys to Cloudflare (or anywhere) as plain files.
export default defineConfig({
  site: 'https://aliveprostudios.com',
  output: 'static',
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
});
