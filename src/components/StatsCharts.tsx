"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createClient } from "@/lib/supabase/client";
import { FilmInsights, buildInsights } from "@/components/FilmInsights";
import { StatsSummary, summarizeLogs } from "@/components/StatsSummary";

type MovieStats = { genre: string[]; country: string | null; language: string | null };
type Log = { watched_date?: string; watched_on?: string; rating: number; tags: string[]; movie: MovieStats | MovieStats[] };
const accent = "#eaa04a";
const palette = ["#eaa04a", "#c96f42", "#8d553f", "#b79b6b", "#6e6b61", "#d8c7a9"];
const tooltipStyle = { background: "#24211e", border: "1px solid #39332d", color: "#f5f0e8" };

export function StatsCharts() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { createClient().from("logs").select("watched_date,watched_on,rating,tags,movie:movies(genre,country,language)").then(({ data }) => { setLogs((data as Log[]) ?? []); setLoading(false); }); }, []);
  const months = [...Array(6)].map((_, index) => { const date = new Date(); date.setMonth(date.getMonth() - (5 - index)); const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; return { key, month: date.toLocaleString("en-US", { month: "short" }) }; }).map(({ key, month }) => ({ month, movies: logs.filter((log) => (log.watched_date ?? log.watched_on ?? "").startsWith(key)).length }));
  const ratings = [1, 2, 3, 4, 5].map((rating) => ({ rating: `${rating} star${rating === 1 ? "" : "s"}`, count: logs.filter((log) => log.rating === rating).length }));
  const tags = countValues(logs.flatMap((log) => log.tags));
  const genres = countValues(logs.flatMap((log) => movieOf(log).genre ?? []));
  const countries = countValues(logs.map((log) => movieOf(log).country).filter(Boolean) as string[]);
  const languages = countValues(logs.map((log) => movieOf(log).language).filter(Boolean) as string[]);
  if (loading) return <div className="grid gap-5 lg:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="chart-skeleton" />)}</div>;
  const summary = summarizeLogs(logs); const insights = buildInsights(logs);
  if (!logs.length) return <div className="stats-empty"><p className="eyebrow">Your film patterns</p><h2 className="mt-3 text-2xl font-semibold">Your story hasn&apos;t started yet.</h2><p className="mt-2 text-[var(--muted)]">Log your first film and Cinefolio will start learning your viewing history.</p></div>;
  return <div className="stats-content"><StatsSummary summary={summary} /><FilmInsights insights={insights} />{logs.length < 3 ? <div className="low-data-note"><p className="eyebrow">The picture is still forming</p><h2 className="mt-2 text-xl font-semibold">Keep logging films.</h2><p className="mt-2 text-sm text-[var(--muted)]">Your patterns will appear here as your collection grows.</p></div> : <div className="chart-grid"><ChartPanel title="Films watched" caption="The last six months"><ResponsiveContainer width="100%" height={190}><BarChart data={months}><CartesianGrid stroke="#39332d" vertical={false} /><XAxis dataKey="month" stroke="#a39b91" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} stroke="#a39b91" tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#30271e" }} /><Bar dataKey="movies" fill={accent} radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></ChartPanel><ChartPanel title="Rating distribution" caption="How the films landed"><ResponsiveContainer width="100%" height={190}><BarChart data={ratings} layout="vertical"><CartesianGrid stroke="#39332d" horizontal={false} /><XAxis type="number" allowDecimals={false} hide /><YAxis dataKey="rating" type="category" width={55} stroke="#a39b91" tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#30271e" }} /><Bar dataKey="count" fill={accent} radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></ChartPanel><Distribution title="Most-used tags" caption="Your personal themes, separate from official genres" data={tags} /><Distribution title="Genres" caption="Broad categories from the films you chose" data={genres} /><Distribution title="Countries" caption="Where the films came from" data={countries} /><Distribution title="Languages" caption="Each primary language, kept distinct" data={languages} /></div>}</div>;
}
function countValues(values: string[]) { const counts = new Map<string, number>(); values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1)); return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })).slice(0, 8); }
function movieOf(log: Log) { return Array.isArray(log.movie) ? (log.movie[0] ?? { genre: [], country: null, language: null }) : log.movie; }
function Distribution({ title, caption, data }: { title: string; caption: string; data: { name: string; count: number }[] }) { return <ChartPanel title={title} caption={caption}><div className="grid gap-3"><ResponsiveContainer width="100%" height={180}><BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}><CartesianGrid stroke="#39332d" horizontal={false} /><XAxis type="number" allowDecimals={false} hide /><YAxis dataKey="name" type="category" width={92} tick={{ fill: "#a39b91", fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#30271e" }} /><Bar dataKey="count" radius={[0, 3, 3, 0]}>{data.map((item, index) => <Cell key={item.name} fill={palette[index % palette.length]} />)}</Bar></BarChart></ResponsiveContainer><div className="flex flex-wrap gap-2">{data.map((item) => <span className="tag" key={item.name}>{item.name} · {item.count}</span>)}</div></div></ChartPanel>; }
function ChartPanel({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) { return <section className="chart-panel"><div className="mb-4"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{caption}</p></div>{children}</section>; }
