"use client";

import { useEffect, useMemo, useState } from "react";
import { Film, Plus } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { createClient } from "@/lib/supabase/client";
import type { MovieLog } from "@/lib/types";

const emptyFilters = { tag: "", rating: "", from: "", to: "", rewatch: false, country: "", language: "", genre: "" };

export default function MoviesPage() {
  const [logs, setLogs] = useState<MovieLog[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(""); const [filters, setFilters] = useState(() => ({ ...emptyFilters, tag: typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("tag") ?? "" }));
  useEffect(() => { createClient().from("logs").select("*, movie:movies(*)").order("watched_date", { ascending: false }).then(({ data }) => { setLogs((data as MovieLog[]) ?? []); setLoading(false); }); }, []);
  const tags = useMemo(() => [...new Set(logs.flatMap((log) => log.tags))].sort(), [logs]); const countries = useMemo(() => [...new Set(logs.map((log) => log.movie?.country).filter(Boolean) as string[])].sort(), [logs]); const languages = useMemo(() => [...new Set(logs.map((log) => log.movie?.language).filter(Boolean) as string[])].sort(), [logs]); const genres = useMemo(() => [...new Set(logs.flatMap((log) => log.movie?.genre ?? []))].sort(), [logs]);
  const filtered = useMemo(() => logs.filter((log) => { const movie = log.movie; const date = log.watched_date ?? log.watched_on; return (movie?.title?.toLowerCase() ?? "").includes(search.toLowerCase()) && (!filters.tag || log.tags.includes(filters.tag)) && (!filters.rating || log.rating >= Number(filters.rating)) && (!filters.from || date >= filters.from) && (!filters.to || date <= filters.to) && (!filters.rewatch || log.rewatch) && (!filters.country || movie.country === filters.country) && (!filters.language || movie.language === filters.language) && (!filters.genre || movie.genre.includes(filters.genre)); }), [logs, search, filters]);
  return <AppShell><div className="collection-hero collection-hero-enter"><div><p className="eyebrow">YOUR COLLECTION</p><h1 className="collection-headline mt-2 text-4xl font-semibold sm:text-5xl"><span>The films I&apos;ve seen.</span><span>A life in frames.</span><span>Stories worth keeping.</span><span>The reel keeps turning.</span></h1><p className="mt-3 max-w-xl text-[var(--muted)]">{logs.length ? `${logs.length} ${logs.length === 1 ? "film" : "films"} you thought worth keeping.` : "Every film has a story. This is where yours begins."}</p></div><Link href="/log/new" className="button button-accent"><Plus size={17} /> Log a Film</Link></div><div className="collection-toolbar"><SearchBar value={search} onChange={setSearch} /><FilterBar {...filters} tags={tags} countries={countries} languages={languages} genres={genres} onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))} /></div>{loading ? <div className="movie-grid">{[1,2,3,4,5].map((item) => <div key={item} className="poster-skeleton" />)}</div> : filtered.length ? <div className="movie-grid movie-grid-enter">{filtered.map((log) => <MovieCard key={log.id} log={log} />)}</div> : <div className="empty-state"><Film className="empty-state-icon" size={28} strokeWidth={1.5} /><p className="eyebrow">A quiet beginning</p><h2 className="mt-3 text-2xl font-semibold">{"You haven't logged any films yet."}</h2><p className="mt-2 text-[var(--muted)]">Your first film is waiting.</p>{!logs.length && <Link href="/log/new" className="button button-accent mt-6">Log your first film</Link>}</div>}</AppShell>;
}
