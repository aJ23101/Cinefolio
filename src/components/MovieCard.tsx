import Link from "next/link";
import { Clock3, Film, RotateCcw } from "lucide-react";
import type { MovieLog } from "@/lib/types";
import { RatingInput } from "@/components/RatingInput";
import { formatDate, formatRuntime } from "@/lib/utils";

export function MovieCard({ log }: { log: MovieLog }) {
  const { movie } = log;
  const runtime = formatRuntime(movie.runtime);
  const review = log.review_text ?? log.review;

  return <Link href={`/movies/${log.id}`} className="movie-card movie-card-enter block">
    <div className="poster-frame">{movie.poster_url ? <img src={movie.poster_url} alt={`${movie.title} poster`} /> : <div className="poster-placeholder"><Film size={34} /></div>}</div>
    <div className="movie-card-info">
      <div className="mb-2 flex items-center justify-between gap-2"><RatingInput value={log.rating} readOnly />{log.rewatch && <RotateCcw size={15} className="text-[var(--accent)]" aria-label="Rewatch" />}</div>
      <h3 className="truncate text-lg font-semibold">{movie.title}</h3>
      <p className="mt-1 text-xs text-[var(--muted)]">{movie.release_year ?? "Year unknown"} &middot; {formatDate(log.watched_date ?? log.watched_on)}</p>
      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
        {runtime && <span className="inline-flex shrink-0 items-center gap-1 text-[var(--accent-soft)]"><Clock3 size={12} aria-hidden="true" /> {runtime}</span>}
        <span className="truncate">{movie.language ?? "Language unknown"} &middot; {movie.country ?? "Country unknown"}</span>
      </div>
      {review && <p className="movie-card-review">&ldquo;{review.slice(0, 72)}{review.length > 72 ? "..." : ""}&rdquo;</p>}
      <div className="mt-3 flex items-center justify-between gap-2"><div className="flex gap-1 overflow-hidden">{(movie.genre ?? []).slice(0, 2).map((genre) => <span className="tag shrink-0" key={genre}>{genre}</span>)}</div><span className="card-action">View entry <span aria-hidden="true">&rarr;</span></span></div>
    </div>
  </Link>;
}
