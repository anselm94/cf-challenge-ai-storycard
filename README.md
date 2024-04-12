# AI Story Card ([#CloudflareAIDevChallenge](https://dev.to/challenges/cloudflare))

Create Stories in a card with illustrations using AI. Created as part of [Cloudflare AI Dev Challenge](https://dev.to/challenges/cloudflare).

**Demo** - https://cf-challenge-ai-storycard.pages.dev

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Deploy

### Prerequisites

1. Create a Cloudflare account
2. Create an application under 'Workers & Pages'
3. Create a KV namespace
4. Create an R2 bucket
5. Update the [`wrangler.toml`](./wrangler.toml) file with right KV `id` and R2 `bucket_name`

### Steps

1. Build the app

```bash
npm run build
```

2. Deploy the app

```bash
npm run deploy
```
