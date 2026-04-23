# Promo code API

REST API for promos and one-time activations by email, built with **NestJS 11**, **TypeScript**, **Prisma 7**, and **PostgreSQL 16**. No auth and no frontend, as per the take-home spec.

## Requirements

- Node.js 20+
- Docker (optional; used for a local database)

## Quick start

1. Copy the environment file and adjust the port for Postgres if you already use `55432` on your host:

   ```bash
   cp .env.example .env
   ```

2. Start PostgreSQL and wait until it is healthy:

   ```bash
   docker compose up -d
   ```

3. Install dependencies, generate the Prisma client, and apply migrations:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```

4. Start the app:

   ```bash
   npm run start:dev
   ```

The API listens on `PORT` (default `3000`).

- Swagger UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)  
- OpenAPI JSON: [http://localhost:3000/api/docs-json](http://localhost:3000/api/docs-json)

## HTTP surface

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/promo-codes` | Create a promo (code, discount %, activation limit, expiration). |
| `GET` | `/promo-codes` | List promos with `page`, `limit`, and optional `isActive` filter. |
| `GET` | `/promo-codes/:id` | Get one promo by UUID. |
| `POST` | `/promo-codes/:code/activate` | Attach the promo to an `email` (one activation per email per code; respects global cap). |

`isActive=true` means not expired and still has remaining redemptions. `isActive=false` means expired or fully redeemed.

## Environment variables

| Name | Description |
|------|-------------|
| `NODE_ENV` | `development` \| `test` \| `production` (default `development`). |
| `PORT` | HTTP port (default `3000`). |
| `LOG_LEVEL` | Nest log level (`log`, `error`, `warn`, `debug`, `verbose`). |
| `DATABASE_URL` | PostgreSQL connection string, e.g. from Docker Compose. |

`docker-compose.yml` maps container `5432` to host `55432` to reduce clashes with a local PostgreSQL on `5432`.

## Architecture notes

- **Validation**: DTOs with `class-validator`; env via Joi. No Prisma types on the wire (mappers to views).  
- **Activation**: a **Serializable** Prisma transaction plus a unique `@@unique([promoCodeId, email])` index; retries on Postgres serialization errors (`P2034`).  
- **Listing with `isActive`**: server-side `COUNT` and filters so pagination remains correct.  
- **Prisma 7** uses a **driver adapter** (`@prisma/adapter-pg` + `pg`); the generated client lives under `prisma/generated` (re-run `npx prisma generate` after pull).

## Scripts

| Command | Intent |
|--------|--------|
| `npm run start:dev` | Dev server with hot reload. |
| `npm run build` | Production build. |
| `npm run start` | Run compiled `dist/src/main.js`. |
| `npm run lint` | ESLint. |
| `npx prisma migrate dev` | New migration in development. |
| `npx prisma migrate deploy` | Apply migrations in CI or production. |

