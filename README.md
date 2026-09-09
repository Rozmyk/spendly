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
- Request validation, OpenAPI/Swagger documentation, security headers, CORS, rate limiting, structured logging, metrics, and liveness/readiness checks

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

- Node.js 22 or newer
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
| `GET` | `/metrics` | Prometheus-compatible process and HTTP metrics |
| `GET`, `POST` | `/v1/auth/*` | Authentication endpoints handled by Better Auth |
| `GET` | `/v1/categories` | List expense categories |
| `GET`, `PUT` | `/v1/budget` | Read or update the current user's monthly budget |
| `GET`, `POST` | `/v1/accounts` | List or create financial accounts with opening balances |
| `GET`, `POST` | `/v1/incomes` | List or record income |
| `GET` | `/v1/financial-summary` | Return opening balance, income, expenses, and current balance |
| `GET`, `POST` | `/v1/expenses` | List or create expenses |
| `GET` | `/v1/expenses/export` | Download all user expenses as CSV |
| `GET`, `PATCH`, `DELETE` | `/v1/expenses/:id` | Read, update, or delete an expense |
| `POST` | `/v1/imports/expenses` | Queue a CSV expense import |
| `GET` | `/v1/imports/expenses/:id` | Retrieve import progress and result |
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

### Reliable expense creation

Provide a unique `Idempotency-Key` header when creating an expense. A retried request with the same key returns the original `201` response instead of creating a duplicate.

```bash
curl -X POST http://localhost:5050/v1/expenses \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 70cae728-4c29-4f42-b1f3-9490c5a53870" \
  --cookie "better-auth.session_token=..." \
  -d '{"amount":42.5,"description":"Lunch","categoryId":1}'
```

### CSV imports

Upload a CSV file to queue a durable background import. The worker records the import status, row totals, skipped rows, and any failure message. The file contents are removed after a successful import.

```csv
amount,description,categoryId,createdAt
42.50,Lunch,1,2026-09-09T12:30:00.000Z
120.00,Train ticket,3,2026-09-08T08:00:00.000Z
```

```bash
curl -X POST http://localhost:5050/v1/imports/expenses \
  --cookie "better-auth.session_token=..." \
  -F "file=@expenses.csv"
```

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

The GitHub Actions workflow runs type checks, unit tests, a PostgreSQL-backed integration test, database migrations, and the frontend production build on every pull request and push to `main`.

## Docker

Run the complete stack with Docker:

```bash
docker compose up --build
```

The API is available on port `5050`, the frontend on port `3000`, and PostgreSQL on port `5433`.

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
