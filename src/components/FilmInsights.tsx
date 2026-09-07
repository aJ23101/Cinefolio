type Insight = { label: string; detail: string };

export function FilmInsights({ insights }: { insights: Insight[] }) {
  return <section className="insights"><div className="insights-heading"><div><p className="eyebrow">Your film patterns</p><h2 className="mt-1 text-2xl font-semibold">A few things your collection is saying.</h2></div>{!insights.length && <span className="insight-count">Just getting started</span>}</div>{insights.length ? <div className="insight-list">{insights.map((insight) => <div className="insight" key={insight.label}><span className="insight-mark" aria-hidden="true" /><p><strong>{insight.label}</strong><span>{insight.detail}</span></p></div>)}</div> : <p className="insights-empty">Log a few more films and Cinefolio will start revealing patterns in your taste.</p>}</section>;
}

export function buildInsights(logs: Array<{ watched_date?: string; watched_on?: string; rating: number; movie?: { genre?: string[]; language?: string | null; country?: string | null } | Array<{ genre?: string[]; language?: string | null; country?: string | null }> }>) {
  const movies = logs.map((log) => Array.isArray(log.movie) ? log.movie[0] : log.movie).filter(Boolean) as Array<{ genre?: string[]; language?: string | null; country?: string | null }>;
  const count = (values: string[]) => values.reduce<Record<string, number>>((counts, value) => { counts[value] = (counts[value] ?? 0) + 1; return counts; }, {});
  const top = (values: string[]) => Object.entries(count(values)).sort((a, b) => b[1] - a[1])[0];
  const insights: Insight[] = [];
  const genre = top(movies.flatMap((movie) => movie.genre ?? [])); if (genre) insights.push({ label: `${genre[0]} is your most-watched genre`, detail: `${genre[1]} ${genre[1] === 1 ? "film" : "films"} in your collection.` });
  const language = top(movies.map((movie) => movie.language).filter(Boolean) as string[]); if (language) insights.push({ label: `${language[0]} leads your language list`, detail: "A small window into the worlds you keep returning to." });
  const country = top(movies.map((movie) => movie.country).filter(Boolean) as string[]); if (country) insights.push({ label: `${country[0]} appears most often`, detail: "Your collection keeps finding its way there." });
  const currentMonth = new Date().toISOString().slice(0, 7); const thisMonth = logs.filter((log) => (log.watched_date ?? log.watched_on ?? "").startsWith(currentMonth)).length; if (thisMonth) insights.push({ label: `${thisMonth} ${thisMonth === 1 ? "film" : "films"} this month`, detail: "Your viewing life is active right now." });
  return insights.slice(0, 4);
}
