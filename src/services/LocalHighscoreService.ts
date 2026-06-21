import type { HighscoreEntry, HighscoreService } from './HighscoreService';

const STORAGE_KEY = 'gatebreaker.highscores';

/** localStorage-backed leaderboard. Used when Supabase env vars are absent. */
export class LocalHighscoreService implements HighscoreService {
  readonly backend = 'local';

  async submit(entry: HighscoreEntry): Promise<void> {
    const all = this.read();
    all.push(entry);
    all.sort((a, b) => b.score - a.score);
    this.write(all.slice(0, 100));
  }

  async top(limit: number): Promise<HighscoreEntry[]> {
    return this.read()
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private read(): HighscoreEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as HighscoreEntry[]) : [];
    } catch {
      return [];
    }
  }

  private write(entries: HighscoreEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }
}
