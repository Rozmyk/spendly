# Spendly API

Backend aplikacji **Spendly** do zapisywania i przeglądania wydatków. API jest zbudowane w TypeScript z użyciem Fastify, Prisma i PostgreSQL.

## Wymagania

- Node.js 18 lub nowszy
- PostgreSQL
- npm

## Szybki start

1. Zainstaluj zależności:

   ```bash
   npm install
   ```

2. Utwórz lokalną konfigurację (opcjonalnie, gdy wartości z `.env.development` Ci nie odpowiadają):

   ```bash
   cp .env.development .env.development.local
   ```

3. Ustaw `DATABASE_URL` w `.env.development.local`, na przykład:

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/spendly?schema=public"
   ```

4. Wygeneruj klienta Prisma i zastosuj istniejące migracje:

   ```bash
   npm run migrate
   npm run generate
   ```

   Jeśli dopiero dodałeś model `Expense` do `prisma/schema.prisma`, utwórz dla niego migrację przed uruchomieniem aplikacji:

   ```bash
   npm run migrate:create
   ```

5. Uruchom serwer w trybie deweloperskim:

   ```bash
   npm run dev
   ```

Domyślny adres serwera to `https://localhost:5050`, a wszystkie endpointy mają prefiks `/v1`.

> Jeśli nie masz lokalnych certyfikatów w katalogu `ssl/`, usuń lub wyczyść zmienne `SSL_CERT` i `SSL_KEY` w `.env.development.local`. Wtedy użyj `http://localhost:5050` oraz usuń flagę `-k` z przykładów curl.

## Health check

Endpoint potwierdza, że serwer Fastify działa. Nie sprawdza połączenia z bazą danych.

```bash
curl -k -i https://localhost:5050/v1/health
```

Oczekiwana odpowiedź:

```http
HTTP/1.1 200 OK
```

```json
{ "status": "ok" }
```

## Endpointy API

### Utworzenie wydatku

```http
POST /v1/expenses
Content-Type: application/json
```

```bash
curl -k -i -X POST https://localhost:5050/v1/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount":50,"description":"Pizza","categoryId":2}'
```

Wymagane pola:

| Pole | Typ | Warunek |
| --- | --- | --- |
| `amount` | number | minimum `0.01` |
| `description` | string | niepusty tekst |
| `categoryId` | integer | identyfikator kategorii |

Poprawna odpowiedź ma status `201 Created` i zawiera zapisany wydatek.

### Lista wydatków

```http
GET /v1/expenses
```

```bash
curl -k -i https://localhost:5050/v1/expenses
```

Odpowiedź ma status `200 OK` i zawiera wydatki posortowane od najnowszego:

```json
[
  {
    "id": 1,
    "amount": 50,
    "description": "Pizza",
    "categoryId": 2,
    "createdAt": "2026-09-05T10:00:00.000Z"
  }
]
```

### Użytkownicy

| Metoda | Ścieżka | Opis |
| --- | --- | --- |
| `POST` | `/v1/users` | Tworzy użytkownika na podstawie `email` i `name`. |

## Dokumentacja interaktywna

Po uruchomieniu aplikacji Swagger UI jest dostępny pod adresem:

```text
/explorer
```

Specyfikację OpenAPI można pobrać jako JSON z `/explorer/json` albo YAML z `/explorer/yaml`.

## Przydatne polecenia

```bash
npm run dev               # serwer deweloperski z obserwowaniem zmian
npm run build             # kompilacja TypeScript do build/
npm start                 # uruchomienie skompilowanej aplikacji
npm run test              # testy Vitest
npm run lint              # sprawdzenie lintingu
npm run generate          # generowanie Prisma i typów schematów
npm run migrate           # zastosowanie oczekujących migracji
npm run migrate:create    # utworzenie i zastosowanie nowej migracji
```

## Struktura projektu

```text
src/resources/
├── core/       # endpointy infrastrukturalne, np. /health
├── expenses/   # trasy, kontrolery, repozytorium i schematy wydatków
└── users/      # obsługa użytkowników
prisma/         # model danych i migracje PostgreSQL
```
