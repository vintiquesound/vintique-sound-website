// @ts-check

import { defineConfig } from "astro/config";
import path from "path";

import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://www.vintiquesound.com",
  integrations: [
    sitemap(),
    react(),
    mdx(),
    icon(),
  ],
  vite: {
    plugins: [
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(new URL('.', import.meta.url).pathname, "src"),
      },
    },
  },
});
