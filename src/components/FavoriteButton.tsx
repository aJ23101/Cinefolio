"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function FavoriteButton({ movieId, initial = false }: { movieId: string; initial?: boolean }) {
  const [favorite, setFavorite] = useState(initial); const [busy, setBusy] = useState(false);
  async function toggle() { setBusy(true); const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (user) { if (favorite) await supabase.from("movie_collections").delete().eq("movie_id", movieId).eq("kind", "favorite"); else await supabase.from("movie_collections").upsert({ movie_id: movieId, user_id: user.id, kind: "favorite" }); setFavorite(!favorite); } setBusy(false); }
  return <button type="button" className="button button-dark text-sm" disabled={busy} onClick={toggle}><Heart size={16} fill={favorite ? "currentColor" : "none"} />{favorite ? "Favourite" : "Add to favourites"}</button>;
}
