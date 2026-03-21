# vintique-sound-website
This is an NodeJS/Astro/Shadcn UI React components/Tailwind CSS/MDX/Zod/Supabase PostgreSQL DB and auth/Drizzle ORM, and pnpm based website for my music business "Vintique Sound."

![alt="Vintique Sound website preview image"](./vintique_sound_website-preview.png)

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

Use separate values for public contact identities and private SMTP credentials.

Public business emails are defined in `src/consts.ts` (`BUSINESS_EMAILS`):

- `main`: primary business contact (example: `name@...`)
- `requests`: service/package requests (example: `requests@...`)
- `support`: digital product support (example: `support@...`)
- `billing`: invoices and billing (example: `billing@...`)

Private email transport credentials stay in environment variables:

- `SMTP_USER` / `SMTP_PASS`: private SMTP login credentials.
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE`: SMTP transport settings.
- `SMTP_FROM`: sender header value shown to recipients.

Recommended policy:

1. Keep business contact addresses in source config (`src/consts.ts`) and treat them as public.
2. Do not set public business emails as Netlify environment variables.
3. Use a private SMTP identity for `SMTP_USER` (do not reuse public addresses).
4. Store real secrets only in host-managed environment variables (Netlify UI), never in repo files.
5. Use local `.env` only for development.

Netlify notes:

- Secrets scanning is value-based. If a secret key uses a value that is intentionally public, scans can fail by design.
- For long-term safety, use a dedicated SMTP auth identity (for example `mailer@...`) so secret values do not appear in public content.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
