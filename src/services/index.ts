import type { HighscoreService } from './HighscoreService';
import { LocalHighscoreService } from './LocalHighscoreService';
import { SupabaseHighscoreService } from './SupabaseHighscoreService';

export type { HighscoreEntry, HighscoreService } from './HighscoreService';

let instance: HighscoreService | null = null;

/**
 * Returns the active highscore backend. Uses Supabase when both env vars are set
 * (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY); otherwise falls back to the local
 * store so the prototype always runs. Cached after first call.
 */
export function getHighscoreService(): HighscoreService {
  if (instance) return instance;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (url && key) {
    try {
      instance = new SupabaseHighscoreService(url, key);
      return instance;
    } catch (err) {
      console.warn('[gatebreaker] Supabase init failed, using local highscores:', err);
    }
  }
  instance = new LocalHighscoreService();
  return instance;
}
