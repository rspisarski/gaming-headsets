import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://goopfinder.com',
  integrations: [tailwind(), sitemap(), mdx(), icon(), preact({
    compat: true
  })],
});