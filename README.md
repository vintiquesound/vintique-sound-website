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

## Request Package Email Setup

Use this checklist to configure and test the `Request This Package` email flow.

### 1) Install dependency

- `pnpm add nodemailer`

### 2) Configure environment variables

Add the standard set of SMTP keys in your local `.env` file:

Notes:

- Keep real secrets only in `.env` (already git-ignored).
- Keep placeholder values in `.env.example`.

### 3) Dry-run test (no email sent)

1. Set `EMAIL_DRY_RUN=1`.
2. Start dev server: `pnpm dev`.
3. Build a package in the UI and submit `Request This Package`.
4. Expected result:
	- UI shows dry-run success.
	- Server logs include `Package request (dry run)` with request payload.

### 4) Real send test

1. Set `EMAIL_DRY_RUN=0`.
2. Restart dev server: `pnpm dev`.
3. Submit a new package request from the UI.
4. Confirm email delivery in inbox/spam.

### 5) Troubleshooting

- If POST requests fail with static-endpoint warnings, ensure the API route has `export const prerender = false;` in `src/pages/api/request-package.ts`.
- If you see sender auth errors, verify `SMTP_USER`/`SMTP_PASS` and provider SMTP host/port.
- If Gmail app passwords are unavailable, use another SMTP provider (Brevo, Mailtrap, etc.) with the same env keys.
- If UI shows a generic error, inspect the server response message in the modal and terminal logs.

### 6) Security

- If an app password is ever exposed, revoke and rotate it immediately.
- Use separate credentials for local testing and production where possible.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
