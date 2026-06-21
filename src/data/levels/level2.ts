import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 2 — Forest Edge. Resource mix: MOSTLY STONE + SOME WOOD.
// Start bottom-left → exit top-right (guarded). Back-gate at top-left to L1.
export const level2: LevelDefinition = {
  id: 'level2',
  name: 'Forest Edge',
  environment: 'forest-edge',
  backgroundColor: 0x21402c,
  width: 1280,
  height: 720,
  playerStart: { x: 110, y: 610 },
  resources: [
    { type: ResourceType.Stone, x: 260, y: 540 },
    { type: ResourceType.Stone, x: 420, y: 470 },
    { type: ResourceType.Stone, x: 560, y: 540 },
    { type: ResourceType.Stone, x: 620, y: 360 },
    { type: ResourceType.Stone, x: 520, y: 260 },
    { type: ResourceType.Wood, x: 760, y: 430 },
    { type: ResourceType.Wood, x: 840, y: 300 },
  ],
  enemies: [
    { enemyId: 'goblin', campId: 'l2-gate-camp', x: 980, y: 200 },
    { enemyId: 'goblin', campId: 'l2-gate-camp', x: 1060, y: 290 },
    { enemyId: 'wolf', campId: 'l2-gate-camp', x: 1120, y: 400 },
  ],
  gates: [
    {
      id: 'l2-to-l1',
      x: 110,
      y: 110,
      label: 'Back to Forest',
      requiredCampId: '',
      targetLevelId: 'level1',
    },
    {
      id: 'l2-to-l3',
      x: 1170,
      y: 110,
      label: 'To Deep Forest',
      requiredCampId: 'l2-gate-camp',
      targetLevelId: 'level3',
    },
  ],
};
