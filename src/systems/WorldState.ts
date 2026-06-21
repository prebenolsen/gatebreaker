import { getLevelIndex } from '../data/levels';

/**
 * Cross-level persistent world progress: which camps are cleared, which levels
 * are unlocked, and the deepest level reached (for scoring). A module singleton.
 */
class WorldState {
  private clearedCamps = new Set<string>();
  private unlockedLevels = new Set<string>(['level1']);
  maxLevelIndex = 0;

  isCampCleared(campId: string): boolean {
    return campId === '' || this.clearedCamps.has(campId);
  }

  clearCamp(campId: string): void {
    if (campId) this.clearedCamps.add(campId);
  }

  isLevelUnlocked(levelId: string): boolean {
    return this.unlockedLevels.has(levelId);
  }

  unlockLevel(levelId: string): void {
    if (!levelId) return;
    this.unlockedLevels.add(levelId);
    this.maxLevelIndex = Math.max(this.maxLevelIndex, getLevelIndex(levelId));
  }

  reset(): void {
    this.clearedCamps.clear();
    this.unlockedLevels = new Set<string>(['level1']);
    this.maxLevelIndex = 0;
  }
}

export const world = new WorldState();
