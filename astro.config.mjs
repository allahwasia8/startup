// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ukstartupflow.com',
  integrations: [sitemap({
    serialize(item) {
      if (item.url !== 'https://ukstartupflow.com/') {
        item.url = item.url.replace(/\/$/, '');
      }
      return item;
    }
  })]
});