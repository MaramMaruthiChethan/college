# College Decision Platform

Decision-first college discovery, comparison, and shortlisting built as a full-stack MVP.

## Assignment status

### What the docs require

From the internship brief in `/Users/maruthichethan/Downloads/Collegupp- Full Stack Developer Internship .docx`:

- Part 1: research + reverse engineering
- Part 2: working MVP
- Mandatory deployment:
  - Frontend on `Vercel` or `Netlify`
  - Backend on `Render` or `Railway`
  - Database hosted, not local

### CI/CD requirement

`CI/CD` is **not explicitly mandatory** in the docs.

What is explicitly mandatory is:

- live working deployment
- GitHub repo
- technical notes
- demo readiness

This repo includes **CI** with GitHub Actions in `.github/workflows/ci.yml`, which is an improvement over the minimum requirement. Continuous deployment is optional and can be enabled by connecting the GitHub repo to Vercel and Render.

## Current completion status

### Completed

- Next.js frontend with App Router
- Express + TypeScript backend
- PostgreSQL schema with seed data
- Search, filters, compare, save, and detail flow
- Lightweight login flow for user-specific saved colleges
- API-driven filters for location and courses
- Error handling, validation, and missing-data fallbacks
- Automated tests
- GitHub repository
- CI workflow

### Still account/platform dependent

- Live Vercel deployment URL
- Live Render deployment URL
- Hosted PostgreSQL production database

Those three require your platform accounts and environment variables.

## Product summary

The platform is built to help students:

- discover colleges
- filter by city, course, fees, and rating
- compare colleges side by side
- shortlist colleges under a logged-in user
- make faster decisions with clearer metrics

## Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- CI: GitHub Actions
- Deployment targets:
  - Frontend: Vercel
  - Backend: Render
  - Database: hosted PostgreSQL

## Project structure

```text
college final/
  backend/
    src/
      controllers/
      models/
      routes/
      services/
      types/
      utils/
    tests/
  frontend/
    app/
    components/
    lib/
    tests/
  db/
    schema.sql
    seed.sql
  .github/workflows/ci.yml
  render.yaml
```

## Features

### Discovery

- homepage search
- college listing page
- API-driven city and course filters
- fees and rating filters
- pagination

### Decision support

- compare page
- best-value highlighting
- overall decision score
- detail page with strengths, cautions, ranking, placement, fees, and course fee snapshot

### Shortlisting

- login page
- user-specific saved colleges
- save action from cards and detail page

### Performance and reliability

- paginated backend queries using `LIMIT` + `OFFSET`
- DB indexes on city and rating
- consistent response shape
- null-safe data rendering
- CI test/build verification

## API endpoints

- `GET /health`
- `GET /colleges`
- `GET /colleges/meta`
- `GET /colleges/:id`
- `GET /compare?ids=1,2,3`
- `POST /auth/login`
- `GET /auth/me`
- `POST /save`
- `GET /saved`

### Success response

```json
{
  "success": true,
  "data": {}
}
```

### Error response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Database design

### Tables

- `colleges`
- `courses`
- `college_courses`
- `users`
- `saved_colleges`

### Notes

- `saved_colleges` is user-specific
- `courses` and `college_courses` support course-based filtering and richer detail pages
- missing placement/package fields remain nullable

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy:

- `backend/.env.example` to `backend/.env`
- `frontend/.env.local.example` to `frontend/.env.local`

Example backend env:

```env
PORT=4000
DATABASE_URL=postgresql://localhost:5432/college_decision
FRONTEND_URL=http://localhost:3000
DUMMY_USER_ID=demo-user
```

Example frontend env:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Apply schema and seed data

```bash
psql "postgresql://localhost:5432/college_decision" -f db/schema.sql
psql "postgresql://localhost:5432/college_decision" -f db/seed.sql
```

If the DB does not exist yet:

```bash
createdb college_decision
```

### 4. Start development servers

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

## Verification

### Run tests

```bash
npm test
```

### Run production build

```bash
npm run build
```

### Current verified state

- backend integration tests pass
- frontend unit tests pass
- repo production build passes

## GitHub and CI

Repository:

- [MaramMaruthiChethan/college](https://github.com/MaramMaruthiChethan/college)

Recent commits:

- `3a50d94` Initial college decision platform MVP
- `ab7f193` Add login flow and improve search performance
- `7a954d0` Fix CI test paths and filter selection

CI workflow:

- `.github/workflows/ci.yml`

CI currently does:

- install dependencies
- apply schema and seed data
- run tests
- run builds

## Deployment

### Frontend: Vercel

Create a Vercel project from the GitHub repo with:

- Framework: Next.js
- Root directory: `frontend`
- Environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com
```

### Backend: Render

Create a Render Web Service from the same GitHub repo with:

- Root directory: `backend`
- Build command:

```bash
npm install && npm run build
```

- Start command:

```bash
npm run start
```

- Environment variables:

```env
DATABASE_URL=your_hosted_postgres_url
FRONTEND_URL=https://your-vercel-app.vercel.app
DUMMY_USER_ID=demo-user
```

Blueprint file included:

- `render.yaml`

### Database: hosted PostgreSQL

Use any hosted PostgreSQL provider such as:

- Neon
- Supabase
- Render PostgreSQL
- Railway PostgreSQL

After provisioning:

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

## What still needs to be done to fully satisfy the brief

To mark the assignment as fully complete, you still need:

1. live frontend URL
2. live backend URL
3. hosted production DB
4. attach those URLs in the final submission

## Notes on limitations

- The auth flow is lightweight MVP auth, not full password/OAuth auth
- The current data model is centered on colleges, courses, users, and saved colleges
- The Part 1 research deliverable is separate from this repo and should be submitted alongside the build
