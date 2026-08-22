// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://aliveprostudios.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
});
