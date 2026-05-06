# College Decision Platform

A production-oriented MVP for college discovery, comparison, and shortlisting. The system is split into a Next.js frontend and an Express + PostgreSQL backend so the UI always renders live API data instead of hardcoded demo arrays.

## Stack

- Frontend: Next.js App Router, React, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Deploy targets: Vercel (frontend), Render (backend), hosted PostgreSQL

## Project structure

```text
college final/
  backend/
    src/
      controllers/
      models/
      routes/
      services/
      utils/
  frontend/
    app/
    components/
    lib/
  db/
    schema.sql
    seed.sql
```

## API endpoints

- `GET /colleges`
- `GET /colleges/meta`
- `GET /colleges/:id`
- `GET /compare?ids=1,2,3`
- `POST /save`
- `GET /saved`
- `GET /health`

All successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

All failures use:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy:

- `backend/.env.example` to `backend/.env`
- `frontend/.env.local.example` to `frontend/.env.local`

Set the backend database URL and the frontend API URL.

Example backend env:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/college_decision
FRONTEND_URL=http://localhost:3000
DUMMY_USER_ID=demo-user
```

Example frontend env:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Create database schema and seed

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Edit `backend/.env` so `DATABASE_URL` points to a real PostgreSQL database, then run:

```bash
psql "postgresql://postgres:postgres@localhost:5432/college_decision" -f db/schema.sql
psql "postgresql://postgres:postgres@localhost:5432/college_decision" -f db/seed.sql
```

If the database does not exist yet, create it first:

```bash
createdb college_decision
```

### 4. Run the apps

In separate terminals:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

## Backend notes

- Pagination is implemented with `LIMIT` and `OFFSET`
- Query validation uses `zod`
- `city` accepts repeated query params or comma-separated values
- `course` accepts repeated query params or comma-separated values
- Missing placement and package values are preserved as `null`
- Indexes are created for `city` and `rating`
- `saved_colleges` has a `UNIQUE (user_id, college_id)` constraint to avoid duplicates
- `courses` and `college_courses` support course-aware filtering and richer detail pages

## Frontend notes

- Home page starts the search flow
- Listing page supports API-driven city and course filters, fees, rating, pagination, save, and compare
- Detail page keeps rating, fees, placement, and package above the fold, plus strengths, cautions, and course-fee data
- Compare page highlights best values and shows an overall best-fit summary
- Saved page reads directly from the API
- Empty, loading, and error states are included

## Verification

- Backend build: `npm --workspace backend run build`
- Frontend build: `npm --workspace frontend run build`
- Backend integration tests: `npm --workspace backend run test`
- Frontend unit tests: `npm --workspace frontend run test`

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Render service blueprint: `render.yaml`
- Recommended flow:
  - Push repo to GitHub
  - Connect frontend repo/root `frontend` to Vercel
  - Connect backend repo/root `backend` to Render
  - Set `NEXT_PUBLIC_API_URL` on Vercel
  - Set `DATABASE_URL`, `FRONTEND_URL`, and `DUMMY_USER_ID` on Render

## Deployment

### Frontend on Vercel

- Root directory: `frontend`
- Env var: `NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com`

### Backend on Render

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Env vars:
  - `DATABASE_URL`
  - `FRONTEND_URL`
  - `DUMMY_USER_ID`

### Database

Use any hosted PostgreSQL provider. Run `db/schema.sql` and `db/seed.sql` once after provisioning.
