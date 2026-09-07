import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes || !Number.isFinite(minutes) || minutes < 1) return null;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? (remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`) : `${remainingMinutes}m`;
}
