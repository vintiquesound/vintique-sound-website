// @ts-check

import { defineConfig } from "astro/config";
import path from "path";

import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import favicons from "astro-favicons";

// https://astro.build/config
export default defineConfig({
  site: "https://vintiquesound.netlify.app",
  output: "server",
  adapter: netlify(),
  integrations: [
    sitemap(),
    react(),
    mdx(),
    icon(),
    favicons()
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
