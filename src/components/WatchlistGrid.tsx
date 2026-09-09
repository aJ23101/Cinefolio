"use client";

import { BookmarkCheck, Film, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Movie } from "@/lib/types";

export function WatchlistGrid({ movies }: { movies: Movie[] }) {
  const [removing, setRemoving] = useState<string | null>(null); const router = useRouter();
  async function remove(movieId: string) { setRemoving(movieId); await createClient().from("movie_collections").delete().eq("movie_id", movieId).eq("kind", "watchlist"); router.refresh(); setRemoving(null); }
  if (!movies.length) return <div className="empty-state"><BookmarkCheck className="empty-state-icon" size={28} /><p className="eyebrow">Your next act</p><h2 className="mt-3 text-2xl font-semibold">Nothing saved yet.</h2><p className="mt-2 text-[var(--muted)]">Save a pick from Discovery and it will be waiting here.</p><Link href="/" className="button button-accent mt-6">Discover films</Link></div>;
  return <div className="watchlist-grid">{movies.map((movie) => <article className="watchlist-card" key={movie.id}><div className="watchlist-poster">{movie.poster_url ? <img src={movie.poster_url} alt={`${movie.title} poster`} /> : <Film size={30} />}</div><div className="min-w-0"><p className="eyebrow">Saved for later</p><h2>{movie.title}</h2><p className="watchlist-meta">{[movie.release_year, ...(movie.genre ?? []).slice(0, 2)].filter(Boolean).join(" · ")}</p>{movie.overview && <p className="watchlist-overview">{movie.overview}</p>}<div className="mt-4 flex flex-wrap gap-2"><Link href="/log/new" className="button button-accent text-sm">Log when watched</Link><button type="button" className="button button-dark text-sm" onClick={() => remove(movie.id)} disabled={removing === movie.id}><Trash2 size={15} />{removing === movie.id ? "Removing..." : "Remove"}</button></div></div></article>)}</div>;
}
