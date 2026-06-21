import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { HighscoreEntry, HighscoreService } from './HighscoreService';

const TABLE = 'gatebreaker_highscores';

/**
 * Supabase-backed leaderboard. The user owns all external config; this reads the
 * client URL/key passed in by the factory. Maps to/from the gatebreaker_highscores
 * table columns (snake_case).
 */
export class SupabaseHighscoreService implements HighscoreService {
  readonly backend = 'supabase';
  private client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey);
  }

  async submit(entry: HighscoreEntry): Promise<void> {
    const { error } = await this.client.from(TABLE).insert({
      player_name: entry.playerName,
      score: entry.score,
      max_level: entry.maxLevel,
      resources_total: entry.resourcesTotal,
    });
    if (error) throw error;
  }

  async top(limit: number): Promise<HighscoreEntry[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select('player_name, score, max_level, resources_total')
      .order('score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => ({
      playerName: row.player_name as string,
      score: row.score as number,
      maxLevel: row.max_level as number,
      resourcesTotal: row.resources_total as number,
    }));
  }
}
