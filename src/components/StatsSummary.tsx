type Summary = {
  total: number;
  average: number;
  genre: string;
  language: string;
  country: string;
};

export function StatsSummary({ summary }: { summary: Summary }) {
  const items = [
    { label: "Films watched", value: summary.total ? String(summary.total) : "-" },
    { label: "Average rating", value: summary.total ? `${summary.average.toFixed(1)} / 5` : "-" },
    { label: "Most watched genre", value: summary.genre || "Not enough yet" },
    { label: "Most common language", value: summary.language || "Not enough yet" },
    { label: "Most common country", value: summary.country || "Not enough yet" },
  ];

  return <section className="snapshot" aria-label="Your film snapshot">
    <div className="snapshot-heading"><p className="eyebrow">Your film life at a glance</p><span className="snapshot-note">Built from your collection</span></div>
    <div className="snapshot-grid">{items.map((item) => <div className="snapshot-item" key={item.label}><p>{item.label}</p><strong>{item.value}</strong></div>)}</div>
  </section>;
}

export function summarizeLogs(logs: Array<{ rating: number; movie?: { title?: string; genre?: string[]; language?: string | null; country?: string | null } | Array<{ title?: string; genre?: string[]; language?: string | null; country?: string | null }> }>) {
  const movies = logs.map((log) => Array.isArray(log.movie) ? log.movie[0] : log.movie).filter(Boolean) as Array<{ title?: string; genre?: string[]; language?: string | null; country?: string | null }>;
  const count = (values: string[]) => values.reduce<Record<string, number>>((counts, value) => { counts[value] = (counts[value] ?? 0) + 1; return counts; }, {});
  const top = (values: string[]) => Object.entries(count(values)).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
  return { total: logs.length, average: logs.length ? logs.reduce((sum, log) => sum + log.rating, 0) / logs.length : 0, genre: top(movies.flatMap((movie) => movie.genre ?? [])), language: top(movies.map((movie) => movie.language).filter(Boolean) as string[]), country: top(movies.map((movie) => movie.country).filter(Boolean) as string[]) };
}
