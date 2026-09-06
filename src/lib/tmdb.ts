export type TmdbFilm = {
  id: number;
  title: string;
  release_year: number | null;
  poster_url: string | null;
  backdrop_url: string | null;
  overview: string;
  genres: string[];
  original_language: string;
  language: string;
  country: string;
  director: string;
  runtime: number | null;
};

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";