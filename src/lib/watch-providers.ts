export type WatchProvider = { name: string; type: "streaming" | "rent" | "buy"; logoUrl?: string };

/** Provider boundary: connect a licensed availability source here when one is configured. */
export async function getWatchProviders(_tmdbId: number | null, _country: string): Promise<WatchProvider[]> {
  // No availability API is configured for Cinefolio. Returning an empty list is
  // intentional: the UI must never imply a title is available somewhere.
  void _tmdbId; void _country; return [];
}
