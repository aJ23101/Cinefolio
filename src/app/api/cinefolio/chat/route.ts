import { createClient } from "@/lib/supabase/server";
import type { Movie, MovieLog } from "@/lib/types";
import { buildTasteProfile, recommendMovies } from "@/lib/recommendations";
import { askMovieAssistant } from "@/lib/ai-provider";
import { discoverForQuestion } from "@/lib/tmdb-discovery";

export async function POST(request: Request) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return Response.json({ error: "Please sign in to ask Cinefolio." }, { status: 401 });
  const { question } = await request.json() as { question?: string }; if (!question?.trim()) return Response.json({ error: "Ask Cinefolio a movie question." }, { status: 400 });
  const { data: logData } = await supabase.from("logs").select("*, movie:movies(*)").order("watched_date", { ascending: false }); const logs = (logData as MovieLog[]) ?? [];
  const { data: listData } = await supabase.from("movie_collections").select("movie:movies(*)").eq("kind", "watchlist"); const watchlist = (listData ?? []).map((item) => item.movie as unknown as Movie).filter(Boolean);
  const profile = buildTasteProfile(logs);
  const discovered = await discoverForQuestion(profile, question);
  const discoveryMovies: Movie[] = discovered.map((movie) => ({ id: `tmdb-${movie.id}`, tmdb_id: movie.id, title: movie.title, release_year: movie.release_year, director: movie.director, runtime: movie.runtime, country: movie.country, language: movie.language, audio_languages: [], genre: movie.genres, poster_url: movie.poster_url, backdrop_url: movie.backdrop_url, overview: movie.overview, original_language: movie.original_language }));
  const picks = recommendMovies(logs, [...watchlist, ...discoveryMovies], new Set(watchlist.map((movie) => movie.id))).slice(0, 3);
  const lower = question.toLowerCase(); const short = /90|hour|minutes/.test(lower); const durationNote = short ? " I kept the focus on your saved options, but check each runtime before you press play." : "";
  const fallback = picks.length ? `Based on ${logs.length} logged ${logs.length === 1 ? "film" : "films"}, I’d start with ${picks[0].movie.title}.${durationNote}` : "Your taste is still taking shape. Log a few more films, or add a few titles to your watchlist, and I’ll have a stronger answer.";
  const answer = await askMovieAssistant({ question, watchedCount: logs.length, favoriteGenres: profile.genres.slice(0, 3).map((genre) => genre.name), languages: profile.languages, watchlist: watchlist.map((movie) => movie.title), candidateTitles: picks.map((pick) => pick.movie.title) }) ?? fallback;
  return Response.json({ answer, picks: picks.map((pick) => ({ title: pick.movie.title, reason: pick.reason })), context: { favoriteGenres: profile.genres.slice(0, 2).map((genre) => genre.name) } });
}
