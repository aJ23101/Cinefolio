import { NextResponse } from "next/server";
import { TMDB_IMAGE_BASE, type TmdbFilm } from "@/lib/tmdb";

type TmdbSearchResult = { id: number; title?: string; release_date?: string; poster_path?: string | null; overview?: string };

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query")?.trim();
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "TMDB_API_KEY is not configured." }, { status: 503 });
  if (!query || query.length < 2) return NextResponse.json({ results: [] });
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(apiKey)}&language=en-US&include_adult=false&page=1&query=${encodeURIComponent(query)}`, { next: { revalidate: 300 } });
  if (!response.ok) return NextResponse.json({ error: "TMDB could not be reached." }, { status: 502 });
  const body = await response.json() as { results?: TmdbSearchResult[] };
  const results: TmdbFilm[] = (body.results ?? []).slice(0, 8).map((film) => ({ id: film.id, title: film.title ?? "Untitled film", release_year: film.release_date ? Number(film.release_date.slice(0, 4)) : null, poster_url: film.poster_path ? `${TMDB_IMAGE_BASE}${film.poster_path}` : null, backdrop_url: null, overview: film.overview ?? "", genres: [], original_language: "", language: "", country: "", director: "", runtime: null }));
  return NextResponse.json({ results });
}