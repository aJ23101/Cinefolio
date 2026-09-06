# Cinefolio

A private movie watch log built with Next.js, Supabase, and a little cinema mood.

## Setup

1. Create a Supabase project and copy `.env.local.example` to `.env.local`.
2. Add the project URL and anon key to `.env.local`.
3. Add a TMDB API key as `TMDB_API_KEY` to `.env.local`. Keep this key server-only; it powers the search routes and is never exposed to the browser.
4. Run `supabase/schema.sql` in the Supabase SQL editor. It creates the tables, TMDB metadata columns, indexes, and Row Level Security policies that keep each user's logs private.
5. Run `npm run dev` and open `http://localhost:3000`.

## Checks

- `npm run lint`
- `npm run build`
