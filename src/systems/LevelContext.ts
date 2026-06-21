import type { Player } from '../entities/Player';
import type { Enemy } from '../entities/Enemy';
import type { ResourceNode } from '../entities/ResourceNode';
import type { Gate } from '../entities/Gate';

/**
 * The live entities of the current level, passed to each behavior system.
 * Systems read/mutate these every tick; they hold no Phaser scene logic.
 */
export interface LevelContext {
  player: Player;
  enemies: Enemy[];
  resources: ResourceNode[];
  gates: Gate[];
}
