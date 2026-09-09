"use client";

import { Bookmark, Check } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Movie } from "@/lib/types";
import { toast } from "sonner";

export function WatchlistButton({ movie, saved = false }: { movie: Movie; saved?: boolean }) {
  const [isSaved, setIsSaved] = useState(saved); const [busy, setBusy] = useState(false);
  async function toggle() { setBusy(true); const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) { toast.error("Please sign in to save films."); setBusy(false); return; }
    const payload = { user_id: user.id, tmdb_id: movie.tmdb_id, title: movie.title, release_year: movie.release_year, director: movie.director, runtime: movie.runtime, country: movie.country, language: movie.language, audio_languages: movie.audio_languages ?? [], genre: movie.genre ?? [], poster_url: movie.poster_url, backdrop_url: movie.backdrop_url, overview: movie.overview, original_language: movie.original_language };
    try { let savedMovieId = movie.id.startsWith("tmdb-") ? null : movie.id;
      if (!savedMovieId && movie.tmdb_id) { const { data, error } = await supabase.from("movies").select("id").eq("user_id", user.id).eq("tmdb_id", movie.tmdb_id).maybeSingle(); if (error) throw error; savedMovieId = data?.id ?? null; }
      if (!savedMovieId) { const { data, error } = await supabase.from("movies").insert(payload).select("id").single(); if (error) throw error; savedMovieId = data.id; }
      const result = isSaved ? await supabase.from("movie_collections").delete().eq("movie_id", savedMovieId).eq("kind", "watchlist") : await supabase.from("movie_collections").insert({ movie_id: savedMovieId, user_id: user.id, kind: "watchlist" });
      if (result.error) throw result.error; setIsSaved(!isSaved); toast.success(isSaved ? "Removed from your watchlist." : "Added to your watchlist.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update your watchlist."); } finally { setBusy(false); }
  }
  return <button type="button" className="button button-dark text-sm" disabled={busy} onClick={toggle}>{isSaved ? <Check size={16} /> : <Bookmark size={16} />}{isSaved ? "On watchlist" : "Add to watchlist"}</button>;
}
