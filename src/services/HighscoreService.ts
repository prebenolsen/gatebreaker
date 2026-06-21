/** One leaderboard row. */
export interface HighscoreEntry {
  playerName: string;
  score: number;
  maxLevel: number;
  resourcesTotal: number;
}

/**
 * Storage-agnostic highscore API. Implemented by a local (localStorage) store
 * and a Supabase-backed store; a factory picks one based on env vars.
 */
export interface HighscoreService {
  submit(entry: HighscoreEntry): Promise<void>;
  top(limit: number): Promise<HighscoreEntry[]>;
  /** Human-readable name of the active backend, for diagnostics. */
  readonly backend: string;
}
