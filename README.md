# Pokemon Tinder

A small web app that shows Pokémon in a Tinder-style flow and attaches a Chuck Norris joke.

Users choose a Pokémon **region** and **types**, then swipe **Like / Dislike**. Liked Pokémon are saved to a list, and disliked Pokémon never appear again.

---

## Technologies

### Frontend
- Next.js (App Router) + React + TypeScript
- Tailwind CSS (light/dark support)

### Backend
- Next.js Route Handlers (`src/app/api/**`)
- JWT auth using `jsonwebtoken` (HttpOnly cookie session)
- Password hashing using `bcryptjs`
- Validation using `zod`

### Database
- PostgreSQL (Docker)
- Prisma ORM (schema + migrations)

### External APIs
- PokeAPI (`https://pokeapi.co`)
- Chuck Norris Jokes API (`https://api.chucknorris.io`)

---

## Requirements
- Node.js 20+
- Docker

---

## Setup

### 1) Create `.env`
Copy the example env file:

- Windows (CMD):
  - `copy .env.example .env`
- PowerShell:
  - `Copy-Item .env.example .env`
- macOS/Linux:
  - `cp .env.example .env`

Ensure `.env` contains:
- `DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=public"`
- `JWT_SECRET="your-long-random-secret"`

### 2) Start Postgres
`docker compose up -d`

### 3) Install dependencies
`npm i`

### 4) Generate Prisma client + run migrations
`npx prisma generate`  
`npx prisma migrate dev`

### 5) Run the app
`npm run dev`  
Open `http://localhost:3000`

---

## First-time user behavior

1. Opening `/` checks `/api/me`.
2. If not logged in, the app redirects to `/login`.
3. A new user registers at `/register` (session cookie is set automatically).
4. The user visits `/setup` to choose region and types (saved to DB).
5. The main screen `/` loads Pokémon from `/api/pokemon/next`.
6. Swipes are stored in DB; swiped Pokémon won’t appear again.
7. Liked Pokémon are visible on `/liked`.

---