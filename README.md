# Rock Paper Scissors Web App

A minimalist, single-page Rock Paper Scissors experience built with Next.js (App Router), TypeScript, and Tailwind CSS. The layout is optimised for large, touch-friendly controls so it works seamlessly across phones, tablets, and desktops.

## Features

- 🎮 Play Rock Paper Scissors against the computer with large, emoji-based controls.
- 🖥️ Responsive design keeps the interface centred and readable on all screen sizes.
- ☁️ Serverless-ready API endpoint prepared for persisting game results to Supabase in order to track computer win percentage.
- ✅ Automated logic tests covering the round outcome calculations.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to play the game.

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

The project uses ESLint for linting, Node's built-in test runner for unit tests, and the standard Next.js build for deployment readiness.

## Environment Variables

To enable result persistence with Supabase, provide the following variables (for example in a `.env.local` file):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_RESULTS_TABLE` (optional, defaults to `game_results`)

The `/api/results` route validates input before attempting to store it. If the environment variables are not present the game remains fully playable and the API responds with a `202` status so future integration can proceed without code changes.
