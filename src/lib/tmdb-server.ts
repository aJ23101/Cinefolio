import { TMDB_IMAGE_BASE } from "@/lib/tmdb";

type CuratedMovie = { id: number; title: string };
type TmdbPosterResponse = { title?: string; poster_path?: string | null };

export type CuratedPoster = CuratedMovie & { poster_url: string | null };

const curatedMovies: CuratedMovie[] = [
  { id: 157336, title: "Interstellar" },
  { id: 155, title: "The Dark Knight" },
  { id: 27205, title: "Inception" },
  { id: 50348, title: "The Lincoln Lawyer" },
  { id: 496243, title: "Parasite" },
  { id: 496, title: "Borat" },
  { id: 372058, title: "Your Name" },
];

const fallback = ({ id, title }: CuratedMovie): CuratedPoster => ({ id, title, poster_url: null });

export async function getCuratedPosters(): Promise<CuratedPoster[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return curatedMovies.map(fallback);

  // The wall is decoration, so a brief timeout is better than making sign-in wait on TMDB.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900);

  try {
    return await Promise.all(curatedMovies.map(async (movie) => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${encodeURIComponent(apiKey)}&language=en-US`, { next: { revalidate: 60 * 60 * 24 * 30 }, signal: controller.signal });
        if (!response.ok) return fallback(movie);
        const details = await response.json() as TmdbPosterResponse;
        return { id: movie.id, title: details.title ?? movie.title, poster_url: details.poster_path ? `${TMDB_IMAGE_BASE}${details.poster_path}` : null };
      } catch { return fallback(movie); }
    }));
  } finally { clearTimeout(timeout); }
}
