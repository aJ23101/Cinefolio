import { TMDB_IMAGE_BASE, type TmdbFilm } from "@/lib/tmdb";
import type { TasteProfile } from "@/lib/recommendations";

type TmdbResult = { id: number; title?: string; release_date?: string; poster_path?: string | null; backdrop_path?: string | null; overview?: string; genre_ids?: number[]; original_language?: string };
const genreNames: Record<number, string> = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 18: "Drama", 27: "Horror", 878: "Science Fiction", 53: "Thriller", 10749: "Romance", 9648: "Mystery", 14: "Fantasy", 10751: "Family", 99: "Documentary" };
const genreIds = Object.fromEntries(Object.entries(genreNames).map(([id, name]) => [name.toLowerCase(), id]));

export async function discoverForTaste(profile: TasteProfile): Promise<TmdbFilm[]> {
  const apiKey = process.env.TMDB_API_KEY; if (!apiKey) return [];
  const selected = profile.genres.filter((genre) => genre.score > 0).slice(0, 2).map((genre) => genreIds[genre.name]).filter(Boolean);
  const params = new URLSearchParams({ api_key: apiKey, language: "en-US", sort_by: "popularity.desc", include_adult: "false", page: "1", ...(selected.length ? { with_genres: selected.join(",") } : {}) });
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`, { next: { revalidate: 60 * 30 } });
  if (!response.ok) return [];
  const body = await response.json() as { results?: TmdbResult[] };
  return (body.results ?? []).map((film) => ({ id: film.id, title: film.title ?? "Untitled film", release_year: film.release_date ? Number(film.release_date.slice(0, 4)) : null, poster_url: film.poster_path ? `${TMDB_IMAGE_BASE}${film.poster_path}` : null, backdrop_url: film.backdrop_path ? `${TMDB_IMAGE_BASE}${film.backdrop_path}` : null, overview: film.overview ?? "", genres: (film.genre_ids ?? []).map((id) => genreNames[id]).filter(Boolean), original_language: film.original_language ?? "", language: "", country: "", director: "", runtime: null }));
}

/** Finds real TMDB candidates from the user's wording, then lets the taste score rank them. */
export async function discoverForQuestion(profile: TasteProfile, question: string): Promise<TmdbFilm[]> {
  const apiKey = process.env.TMDB_API_KEY; if (!apiKey) return [];
  const words = question.toLowerCase();
  const requested = Object.entries(genreIds).filter(([name]) => words.includes(name)).map(([, id]) => id).slice(0, 2);
  const selected = requested.length ? requested : profile.genres.filter((genre) => genre.score > 0).slice(0, 2).map((genre) => genreIds[genre.name]).filter(Boolean);
  const params = new URLSearchParams({ api_key: apiKey, language: "en-US", sort_by: "popularity.desc", include_adult: "false", page: "1", ...(selected.length ? { with_genres: selected.join(",") } : {}) });
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`, { next: { revalidate: 60 * 15 } });
  if (!response.ok) return [];
  const body = await response.json() as { results?: TmdbResult[] };
  return (body.results ?? []).map((film) => ({ id: film.id, title: film.title ?? "Untitled film", release_year: film.release_date ? Number(film.release_date.slice(0, 4)) : null, poster_url: film.poster_path ? `${TMDB_IMAGE_BASE}${film.poster_path}` : null, backdrop_url: film.backdrop_path ? `${TMDB_IMAGE_BASE}${film.backdrop_path}` : null, overview: film.overview ?? "", genres: (film.genre_ids ?? []).map((id) => genreNames[id]).filter(Boolean), original_language: film.original_language ?? "", language: "", country: "", director: "", runtime: null }));
}
