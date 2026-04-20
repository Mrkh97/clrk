# clrk

`clrk` is a personal finance workspace built around three core loops:

- track spending with a live dashboard
- scan and normalize receipts with AI-assisted extraction
- turn recent transactions into concrete savings suggestions

Live app: [clrk.app](https://clrk.app)

## What This Repo Contains

```text
apps/
  clrk-web/      TanStack Start web app
  clrk-mobile/   Flutter mobile app
  clrk-api/      Hono + Drizzle backend API
docker-compose.yml
docker-compose.env.example
```

## Product Overview

clrk is designed to make day-to-day spending easier to understand. The web app gives you a larger-screen dashboard, optimizer, and receipt review workflow. The mobile app focuses on fast capture, review, and daily check-ins. The API handles authentication, receipt extraction, dashboard aggregation, optimizer generation, email flows, and persistence.

## Stack

- Web: TanStack Start
- Mobile: Flutter
- API: Hono
- Infra: PostgreSQL 18.3, Redis 8.6, Docker Compose

## Easiest Deployment

The simplest production setup in this repo is Docker Compose for the application stack:

- `postgres`
- `redis`
- `clrk-api`
- `clrk-web`

The current compose file keeps the web and API services internal to the Compose network with `expose`, so you should put a reverse proxy or load balancer in front of them for public traffic.

### 1. Clone the repo

```bash
git clone https://github.com/Mrkh97/clrk.git
cd clrk
```

### 2. Create the Compose env file

```bash
cp docker-compose.env.example .env
```

Update `.env` for your real domain and secrets. For a production setup using `clrk.app`, a good baseline is:

```env
POSTGRES_DB=clrk
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me

WEB_ORIGIN=https://clrk.app
WEB_ORIGIN_SECONDARY=
BETTER_AUTH_URL=https://api.clrk.app
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
AUTH_COOKIE_DOMAIN=.clrk.app

VITE_API_BASE_URL=https://api.clrk.app
INTERNAL_API_BASE_URL=http://clrk-api:3001
VITE_PUBLIC_API_BASE_URL=https://api.clrk.app

RESEND_API_KEY=replace-with-resend-api-key
RESEND_FROM_EMAIL=no-reply@clrk.app

OPENAI_API_KEY=replace-with-openai-api-key
OPENAI_MODEL=gpt-5.4-nano
```

Generate a strong auth secret with:

```bash
openssl rand -base64 32
```

### 3. Point your domains at the server

Recommended routing:

- `clrk.app` -> reverse proxy -> `clrk-web:3000`
- `api.clrk.app` -> reverse proxy -> `clrk-api:3001`

The proxy can be Caddy, Nginx, Traefik, or a cloud load balancer. The important part is that both app containers share the same Docker network as the proxy.

### 4. Start the stack

```bash
docker compose up -d --build
```

### 5. Verify container health

```bash
docker compose ps
docker compose logs -f clrk-api clrk-web
```

Health checks in the compose file verify:

- API: `http://127.0.0.1:3001/api/health`
- Web: `http://127.0.0.1:3000`

### 6. Run updates

```bash
git pull
docker compose up -d --build
```

## App Docs

- [clrk-web](./apps/clrk-web/README.md)
- [clrk-mobile](./apps/clrk-mobile/README.md)
