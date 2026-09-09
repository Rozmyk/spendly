# Spendly

Spendly is a full-stack personal-finance application for recording expenses, setting a monthly budget, and understanding spending patterns. It is built as a portfolio project with an emphasis on a well-structured, production-minded API.

![Spendly sign-in screen](docs/screenshots/sign-in.png)

## Highlights

- Email-and-password authentication with session-based access control
- User-scoped expense CRUD operations
- Monthly budgets and fixed expense categories
- Server-side monthly reports, including category totals and remaining budget
- Filtered, sorted, and paginated expense lists
- PostgreSQL indexes for common expense queries
- Request validation, OpenAPI/Swagger documentation, security headers, CORS, rate limiting, structured logging, and liveness/readiness checks

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Material UI, Recharts |
| Backend | Node.js, Fastify, TypeScript |
| Data | PostgreSQL, Prisma |
| Authentication | Better Auth |
| Testing | Vitest |
| Local infrastructure | Docker Compose |

## Architecture

The frontend communicates with a versioned REST API under `/v1`. Fastify loads resources automatically, Prisma is exposed through a single Fastify plugin, and protected routes resolve the current user from the Better Auth session.

```text
Next.js client
    |
    v
Fastify API (/v1)
    |
    +-- Better Auth sessions
    +-- request validation and rate limiting
    +-- resources: expenses, budgets, categories, reports
    |
    v
PostgreSQL
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- Docker and Docker Compose

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Configure the backend

Create `.env.development.local` in the repository root:

```env
DATABASE_URL="postgresql://spendly:spendly@localhost:5433/spendly?schema=public"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:5050/v1/auth"
CLIENT_ORIGIN="http://localhost:3000"
SSL_CERT=
SSL_KEY=
```

Install dependencies, generate Prisma Client, apply migrations, and run the API:

```bash
npm install
npm run generate
npm run migrate
npm run dev
```

The API runs on `http://localhost:5050`.

### 3. Configure and run the frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5050/v1"
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API overview

Interactive API documentation is available at [http://localhost:5050/explorer](http://localhost:5050/explorer).

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/v1/health` | Liveness check |
| `GET` | `/v1/ready` | Readiness check, including PostgreSQL connectivity |
| `GET`, `POST` | `/v1/auth/*` | Authentication endpoints handled by Better Auth |
| `GET` | `/v1/categories` | List expense categories |
| `GET`, `PUT` | `/v1/budget` | Read or update the current user's monthly budget |
| `GET`, `POST` | `/v1/expenses` | List or create expenses |
| `GET`, `PATCH`, `DELETE` | `/v1/expenses/:id` | Read, update, or delete an expense |
| `GET` | `/v1/reports/monthly` | Monthly spending and budget report |

### Expense list query parameters

`GET /v1/expenses` supports the following optional parameters:

| Parameter | Example | Purpose |
| --- | --- | --- |
| `page` | `2` | Page number, starting at 1 |
| `limit` | `20` | Results per page, from 1 to 100 |
| `categoryId` | `1` | Filter by category |
| `from`, `to` | `2026-09-01T00:00:00.000Z` | Filter by creation date |
| `minAmount`, `maxAmount` | `20`, `200` | Filter by amount |
| `sort` | `asc` or `desc` | Sort by creation date |

Pagination metadata is returned in the `X-Page`, `X-Page-Size`, and `X-Total-Count` response headers, preserving a simple array response for the client.

### Monthly report example

```bash
curl --cookie "better-auth.session_token=..." \
  "http://localhost:5050/v1/reports/monthly?month=2026-09"
```

```json
{
  "month": "2026-09",
  "total": 428.5,
  "count": 12,
  "budget": 1800,
  "remaining": 1371.5,
  "byCategory": [
    { "categoryId": 1, "name": "Food", "total": 230.5, "count": 7 }
  ]
}
```

## Quality checks

```bash
npx tsc --noEmit
npm test -- --run
npm run build
```

## Project structure

```text
frontend/                 Next.js application
prisma/                   Prisma schema and SQL migrations
src/core/                 configuration, plugins, authentication, database client
src/resources/            API resources and route handlers
tests/                    API and server tests
docs/screenshots/         product screenshots used in this README
```

## License

MIT
