"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { value: number; onChange?: (value: number) => void; readOnly?: boolean };
export function RatingInput({ value, onChange, readOnly = false }: Props) {
  if (readOnly) return <span className="rating-display" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <span key={star} className={star <= value ? "rating-display-filled" : "rating-display-empty"}>★</span>)}</span>;
  return <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" disabled={readOnly} onClick={() => onChange?.(star)} className={cn("rating-star", star <= value && "rating-star-active")} aria-label={`Rate ${star} stars`}><Star size={18} fill={star <= value ? "currentColor" : "none"} /></button>)}
    {!readOnly && <span className="ml-2 text-sm text-[var(--muted)]">{value}/5</span>}
  </div>;
}