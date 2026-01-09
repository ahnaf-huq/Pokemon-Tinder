# Pokémon Tinder

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

## One-time setup (Windows / macOS / Linux)

### 1) Clone and install

```
git clone <your-repo-url>
cd <your-repo-folder>
npm install
```


### 2) Create `.env`
#### Windows (CMD)
`copy .env.example .env`
#### Windows (PowerShell)
`Copy-Item .env.example .env`
#### macOS/Linux
`cp .env.example .env`

Your `.env` must include:
```
DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=public"
JWT_SECRET="change-me-to-a-long-random-string"
NODE_ENV="development"
```


### 3) Start PostgreSQL (Docker)
From the project root:
`docker compose up -d`

Check it is running:
`docker compose ps`

### 4) Prisma generate + migrations
Create DB tables and Prisma client:
```
npx prisma generate  
npx prisma migrate dev
```

If you see “drift detected” or migration mismatch.
This can happen if your Docker volume already has old DB schema/migrations.

Reset the dev database:
`npx prisma migrate reset`

If you want a completely clean Docker database (removes ALL DB data):
```
docker compose down -v
docker compose up -d
npx prisma migrate dev
```

### 5) Run the app
Start the development server:
`npm run dev`  
Open:
`http://localhost:3000`

If port 3000 is busy, run on another port:
`npm run dev -- -p 3001`

### 6) How to use the app

1. For the first time, the app takes you to the login page.
2. If you do not have an account, you can register as a user.
3. Once you are logged in, you can find the Settings page with Regions and Types of Pokémon.
4. Select a region and one or more types of Pokémon.
5. You can save your choices for next time or move to the next page when you are done.
6. A Pokémon with a random human name shows up with the stats (Types, Height, Weight, Skill, Level), accompanied by a Chuck Norris joke.
7. There are two buttons for `Like` and `Dislike` for the Pokémons.
8. Liking a Pokémon saves them in your profile and you can view them later. Disliking removes the Pokémon and doesn't present itself again.
9. At any time, clicking the `Setting` button takes you back to the Settings page and you can change the parameters of the Pokémon search.

#### Enjoy!
Remember to enjoy the experience beacuse Chuck Norris definitely would. But then again, he enjoys playing games like Connect Four, winning in just three moves XD


### Project structure (overview)
```
src/
  app/
    globals.css
    layout.tsx
    page.tsx                 # main swipe screen
    setup/page.tsx           # preferences
    liked/page.tsx           # liked UI
    login/page.tsx           # login UI
    register/page.tsx        # register UI
    api/
      me/route.ts
      pokemon/next/route.ts
      preferences/route.ts
      swipe/route.ts
      liked/route.ts
      auth/login/route.ts
      auth/register/route.ts
      auth/logout/route.ts
  lib/
    prisma.ts                # Prisma client singleton
    auth.ts                  # JWT + cookie helpers
    validators.ts            # Zod schemas
    pokeapi.ts               # PokeAPI helpers
    chuck.ts                 # Chuck jokes helper
    names.ts                 # random human names
prisma/
  schema.prisma
  migrations/
docker-compose.yml
.env.example
README.md

```
---
