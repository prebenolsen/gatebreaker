import type { LevelDefinition } from './types';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';

// Ordered registry of all levels. Add a new level = add a data file and list it here.
export const LEVELS: LevelDefinition[] = [level1, level2, level3, level4, level5];

export const FIRST_LEVEL_ID = LEVELS[0].id;

export function getLevel(id: string): LevelDefinition | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelIndex(id: string): number {
  return LEVELS.findIndex((l) => l.id === id);
}

export type { LevelDefinition };
