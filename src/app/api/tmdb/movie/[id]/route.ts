import { NextResponse } from "next/server";
import { TMDB_IMAGE_BASE, type TmdbFilm } from "@/lib/tmdb";

type TmdbDetails = { id: number; title: string; release_date?: string; poster_path?: string | null; backdrop_path?: string | null; overview?: string; runtime?: number | null; original_language?: string; genres?: { name: string }[]; spoken_languages?: { english_name?: string; iso_639_1?: string }[]; production_countries?: { name: string }[]; credits?: { crew?: { job?: string; name?: string }[] } };
const languageNames: Record<string, string> = { en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese", hi: "Hindi", ta: "Tamil", te: "Telugu", ml: "Malayalam", kn: "Kannada", bn: "Bengali", mr: "Marathi", pa: "Punjabi", gu: "Gujarati", ja: "Japanese", ko: "Korean", zh: "Mandarin", th: "Thai", tr: "Turkish", ar: "Arabic", ru: "Russian" };

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "TMDB_API_KEY is not configured." }, { status: 503 });
  const { id } = await params;
  const response = await fetch(`https://api.themoviedb.org/3/movie/${encodeURIComponent(id)}?api_key=${encodeURIComponent(apiKey)}&language=en-US&append_to_response=credits`, { next: { revalidate: 86400 } });
  if (!response.ok) return NextResponse.json({ error: "TMDB could not be reached." }, { status: 502 });
  const film = await response.json() as TmdbDetails;
  const originalLanguage = film.original_language ?? "";
  const director = film.credits?.crew?.find((person) => person.job === "Director")?.name ?? "";
  const result: TmdbFilm = { id: film.id, title: film.title, release_year: film.release_date ? Number(film.release_date.slice(0, 4)) : null, poster_url: film.poster_path ? `${TMDB_IMAGE_BASE}${film.poster_path}` : null, backdrop_url: film.backdrop_path ? `https://image.tmdb.org/t/p/w1280${film.backdrop_path}` : null, overview: film.overview ?? "", genres: film.genres?.map((genre) => genre.name) ?? [], original_language: originalLanguage, language: languageNames[originalLanguage] ?? film.spoken_languages?.find((language) => language.iso_639_1 === originalLanguage)?.english_name ?? originalLanguage, country: film.production_countries?.[0]?.name ?? "", director, runtime: film.runtime ?? null };
  return NextResponse.json({ film: result });
}