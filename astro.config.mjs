// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fully static output. Every route is prerendered, so no adapter is needed and
// `dist/` deploys to Cloudflare (or anywhere) as plain files.
export default defineConfig({
  site: 'https://aliveprostudios.com',
  output: 'static',
  integrations: [
    // /thank-you is a post-submit destination, not a landing page. It carries
    // `noindex` in its head, so it must not be advertised in the sitemap either.
    // /home-b is the draft home page, noindex for the same reason.
    sitemap({ filter: (page) => !page.endsWith('/thank-you') && !page.endsWith('/home-b') }),
  ],
  trailingSlash: 'never',
  build: { format: 'file' },
});
