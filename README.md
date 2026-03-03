# vintique-sound-website
This is an Astro/Shadcn UI React components/Tailwind CSS/MDX/NestJS/PostgreSQL DB/Prism based website for my music business "Vintique Sound."


# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Pricing Architecture

- Canonical prices are stored in CAD cents in `src/lib/pricing/catalog.ts`.
- Currency conversion uses a weekly snapshot in `src/lib/pricing/fx-weekly-snapshot.ts`.
- The header currency selector only shows checkout-supported currencies from `src/lib/payments/providers.ts`.
- Shared conversion/formatting helpers are in `src/lib/pricing/money.ts`.

### Weekly FX updates

- Manual local refresh: `pnpm fx:update-weekly`
- Scheduled refresh: `.github/workflows/fx-weekly.yml` runs weekly and commits the updated snapshot.
- If live FX fetch fails, fallback rates are used by `scripts/update-fx-weekly.mjs` so builds remain stable.

## Environment strategy (production-safe)

Use separate values for public contact identity and private SMTP credentials.

- `PUBLIC_CONTACT_EMAIL`: public-facing address shown on the site (keep this in source config, not in Netlify env vars).
- `REQUEST_PACKAGE_TO`: inbox for incoming package requests.
- `SMTP_USER` / `SMTP_PASS`: private SMTP login credentials.
- `SMTP_FROM`: sender header value shown to recipients.

Recommended policy:

1. Keep `PUBLIC_CONTACT_EMAIL` public.
2. Do not set `PUBLIC_CONTACT_EMAIL` as a Netlify environment variable.
3. Do not reuse that same value for `SMTP_USER`.
4. Do not set `REQUEST_PACKAGE_TO` to the same literal value as `PUBLIC_CONTACT_EMAIL`.
5. Store real secrets only in host-managed environment variables (Netlify UI), never in repo files.
6. Use `.env.example` as the contract and keep `.env` local only.

Netlify notes:

- Secrets scanning is value-based. If a secret key uses a value that is intentionally public, scans can fail by design.
- For long-term safety, use a dedicated SMTP auth identity (for example `mailer@...`) so secret values do not appear in public content.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
