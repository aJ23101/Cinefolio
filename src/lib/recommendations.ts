import type { Movie, MovieLog } from "@/lib/types";

export type TasteProfile = {
  genres: Array<{ name: string; score: number; count: number }>;
  languages: string[];
  countries: string[];
  watchedTmdbIds: number[];
};

export type Recommendation = {
  movie: Movie;
  score: number;
  reason: string;
  source: "watchlist" | "discovery";
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export function buildTasteProfile(logs: MovieLog[]): TasteProfile {
  const genreScores = new Map<string, { score: number; count: number }>();
  const languageScores = new Map<string, number>();
  const countryScores = new Map<string, number>();
  for (const log of logs) {
    const weight = Math.max(-2, log.rating - 3);
    for (const genre of log.movie.genre ?? []) {
      const key = normalize(genre); const current = genreScores.get(key) ?? { score: 0, count: 0 };
      genreScores.set(key, { score: current.score + weight + 1, count: current.count + 1 });
    }
    if (log.movie.language) languageScores.set(log.movie.language, (languageScores.get(log.movie.language) ?? 0) + weight + 2);
    if (log.movie.country) countryScores.set(log.movie.country, (countryScores.get(log.movie.country) ?? 0) + weight + 2);
  }
  return {
    genres: [...genreScores.entries()].map(([name, value]) => ({ name, ...value })).sort((a, b) => b.score - a.score || b.count - a.count),
    languages: [...languageScores.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name).slice(0, 3),
    countries: [...countryScores.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name).slice(0, 3),
    watchedTmdbIds: logs.map((log) => log.movie.tmdb_id).filter((id): id is number => Boolean(id)),
  };
}

export function recommendMovies(logs: MovieLog[], candidates: Movie[], watchlistIds = new Set<string>(), favoriteMovies: Movie[] = []): Recommendation[] {
  const profile = buildTasteProfile(logs); const genreMap = new Map(profile.genres.map((genre) => [genre.name, genre]));
  return candidates.filter((movie) => !movie.tmdb_id || !profile.watchedTmdbIds.includes(movie.tmdb_id)).map((movie) => {
    const matches = (movie.genre ?? []).map(normalize).map((genre) => genreMap.get(genre)).filter((genre): genre is NonNullable<typeof genre> => Boolean(genre));
    const genreScore = matches.reduce((sum, genre) => sum + genre.score, 0);
    const languageScore = movie.language && profile.languages.includes(movie.language) ? 2 : 0;
    const countryScore = movie.country && profile.countries.includes(movie.country) ? 1 : 0;
    const saved = watchlistIds.has(movie.id); const favoriteSignal = favoriteMovies.some((favorite) => favorite.genre.some((genre) => movie.genre.includes(genre))) ? 4 : logs.some((log) => log.rating >= 5 && log.movie.genre.some((genre) => movie.genre.includes(genre))) ? 2 : 0;
    const named = matches.slice(0, 2).map((match) => match.name);
    const reason = saved ? "Already on your watchlist — moved up because it fits your taste." : named.length ? `Matches your preference for ${named.join(" and ")}.` : "A fresh pick shaped by your viewing history.";
    const source: Recommendation["source"] = saved ? "watchlist" : "discovery";
    return { movie, score: genreScore + languageScore + countryScore + favoriteSignal + (saved ? 7 : 0), reason, source };
  }).sort((a, b) => b.score - a.score).slice(0, 6);
}
