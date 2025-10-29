// @ts-check

import { defineConfig } from 'astro/config';
import path from 'path';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.vintiquesound.com',
    integrations: [sitemap(), react(), mdx()],
    vite: {
        resolve: {
            alias: {
                '@': path.resolve(new URL('.', import.meta.url).pathname, 'src'),
            },
        },
    },
});
