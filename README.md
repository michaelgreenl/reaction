# Reaction

Reaction is a reaction-time game with saved settings, scores, statistics, and game history.

[Live site](https://trainreaction.gg) · [API health](https://api.trainreaction.gg/health) · [Demo](https://michaelgreenl.net/#projects?slug=reaction&autoplay=true)

## Workspaces

| Workspace    | Purpose      | Stack                          |
| ------------ | ------------ | ------------------------------ |
| `app/client` | Browser game | Vue 3, Pinia, Vite, GSAP, Sass |
| `app/server` | HTTP API     | Express, Sequelize, PostgreSQL |

The root owns shared formatting, Node, Docker Compose, CI, and npm scripts.

## Local development

Install Node.js 24.20.0 and Docker. Then run:

```sh
npm install
cp app/client/.env.example app/client/.env.development
cp app/server/.env.example app/server/.env.development
npm run dev
```

The client runs on `http://localhost:5173`. The API runs on `http://localhost:3000`.

`npm run dev` starts PostgreSQL, applies pending migrations, and starts both workspaces.

## Root scripts

- `npm run dev` starts both workspaces.
- `npm run dev:client` starts only the client.
- `npm run dev:server` starts PostgreSQL and the API.
- `npm start` starts the API and applies pending migrations.
- `npm run build` builds the client.
- `npm test` runs the API contract and schema tests.
- `npm run test:db` runs the API PostgreSQL integration tests.
- `npm run lint` checks both workspaces.
- `npm run lint:style` checks client styles.
- `npm run format` checks repository formatting.
- `npm run deploy:client` publishes the client build to `gh-pages`.

The client includes Vitest and Playwright configuration. It does not yet include committed client tests.

## Environment

The client reads `VITE_API_URL` from `app/client/.env.*`.

The API reads server, database, JWT, and client-origin values from `app/server/.env.*`. Render supplies these values in production.

## Deployment

GitHub Pages serves the `gh-pages` branch from its root. `app/client/public/CNAME` preserves `trainreaction.gg` during each deployment.

Render uses this repository with no root-directory override. Its build command is `npm ci`, start command is `npm start`, and health path is `/health`.

The start script selects `app/server` through npm workspaces. The API applies migrations before it starts.
