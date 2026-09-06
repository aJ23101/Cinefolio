export type Movie = {
  id: string;
  tmdb_id: number | null;
  title: string;
  release_year: number | null;
  director: string | null;
  runtime: number | null;
  country: string | null;
  language: string | null;
  audio_languages: string[];
  genre: string[];
  poster_url: string | null;
  backdrop_url: string | null;
  overview: string | null;
  original_language: string | null;
};

export type MovieLog = {
  id: string;
  movie_id: string;
  user_id: string;
  watched_on: string;
  watched_date?: string;
  rating: number;
  review_text: string | null;
  review?: string | null;
  tags: string[];
  rewatch: boolean;
  created_at: string;
  movie: Movie;
};

export type LogDraft = {
  tmdb_id: string;
  title: string;
  release_year: string;
  director: string;
  runtime: string;
  country: string;
  language: string;
  audio_languages: string[];
  genre: string[];
  poster_url: string;
  backdrop_url: string;
  overview: string;
  original_language: string;
  watched_on: string;
  rating: number;
  review_text: string;
  tags: string[];
  rewatch: boolean;
};