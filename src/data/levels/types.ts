import type { ResourceType, Vec2 } from '../../core/types';

/** A resource node placement on a level. */
export interface ResourceSpawn {
  type: ResourceType;
  x: number;
  y: number;
}

/**
 * An enemy placement. Its spawn point doubles as its "anchor" (home) for leashing.
 * Enemies sharing a `campId` form a camp; a gate unlocks when a camp is cleared.
 */
export interface EnemySpawn {
  enemyId: string;
  campId: string;
  x: number;
  y: number;
}

/** A gate to another level, locked until `requiredCampId` is cleared. */
export interface GateSpawn {
  id: string;
  x: number;
  y: number;
  label: string;
  /** Camp that must be cleared to unlock this gate. Empty string = always open. */
  requiredCampId: string;
  /** Level id this gate leads to. */
  targetLevelId: string;
}

/** A complete, data-only description of one level/map. */
export interface LevelDefinition {
  id: string;
  name: string;
  environment: 'forest' | 'forest-edge' | 'deep-forest' | 'grove' | 'mine' | 'crystal-cave' | string;
  /** Background color (placeholder primitive theming). */
  backgroundColor: number;
  width: number;
  height: number;
  playerStart: Vec2;
  resources: ResourceSpawn[];
  enemies: EnemySpawn[];
  gates: GateSpawn[];
}
