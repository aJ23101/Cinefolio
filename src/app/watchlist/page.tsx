import { Bookmark } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WatchlistGrid } from "@/components/WatchlistGrid";
import { createClient } from "@/lib/supabase/server";
import type { Movie } from "@/lib/types";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("movie_collections").select("created_at, movie:movies(*)").eq("kind", "watchlist").order("created_at", { ascending: false });
  const movies = (data ?? []).map((item) => item.movie as unknown as Movie).filter(Boolean);
  return <AppShell><div className="watchlist-hero"><div><p className="eyebrow">Your Watchlist</p><h1>Stories waiting their turn.</h1><p>Save a discovery now, then log it when the credits roll.</p></div><Bookmark size={28} className="text-[var(--accent)]" /></div><WatchlistGrid movies={movies} /></AppShell>;
}
