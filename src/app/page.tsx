import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MovieCard } from "@/components/MovieCard";
import { createClient } from "@/lib/supabase/server";
import type { MovieLog } from "@/lib/types";
import { StatsSummary, summarizeLogs } from "@/components/StatsSummary";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("logs").select("*, movie:movies(*)").order("watched_date", { ascending: false });
  const logs = (data as MovieLog[]) ?? []; const summary = summarizeLogs(logs); const recent = logs.slice(0, 5);
  return <AppShell><div className="dashboard-hero"><div><p className="eyebrow">Your film journal</p><h1 className="mt-2 text-4xl font-semibold sm:text-5xl">The next story is yours.</h1><p className="mt-3 max-w-xl text-[var(--muted)]">A living record of the films that made you pause, laugh, argue, or sit quietly through the credits.</p></div><Link href="/log/new" className="button button-accent"><Plus size={17} /> Log a Film</Link></div>{logs.length > 0 && <StatsSummary summary={summary} />}<section className="dashboard-recent"><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow">Recent films</p><h2 className="mt-1 text-2xl font-semibold">What you&apos;ve been watching.</h2></div>{logs.length > 0 && <Link href="/movies" className="inline-flex items-center gap-2 text-sm text-[var(--accent-soft)]">See your collection <ArrowRight size={15} /></Link>}</div>{recent.length ? <div className="dashboard-film-grid">{recent.map((log) => <MovieCard key={log.id} log={log} />)}</div> : <div className="empty-state"><p className="eyebrow">A quiet beginning</p><h2 className="mt-3 text-2xl font-semibold">Your story hasn&apos;t started yet.</h2><p className="mx-auto mt-2 max-w-md text-[var(--muted)]">Log your first film and Cinefolio will start learning your viewing history.</p><Link href="/log/new" className="button button-accent mt-6">Log your first film</Link></div>}</section></AppShell>;
}
