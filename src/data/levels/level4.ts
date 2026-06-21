import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 4 — The Grove. Resource mix: WOOD ONLY.
// Start bottom-left → exit top-right (guarded). Back-gate at top-left to L3.
export const level4: LevelDefinition = {
  id: 'level4',
  name: 'The Grove',
  environment: 'grove',
  backgroundColor: 0x14301c,
  width: 1280,
  height: 720,
  playerStart: { x: 110, y: 610 },
  resources: [
    { type: ResourceType.Wood, x: 260, y: 540 },
    { type: ResourceType.Wood, x: 400, y: 470 },
    { type: ResourceType.Wood, x: 520, y: 540 },
    { type: ResourceType.Wood, x: 600, y: 360 },
    { type: ResourceType.Wood, x: 720, y: 460 },
    { type: ResourceType.Wood, x: 820, y: 280 },
  ],
  enemies: [
    { enemyId: 'goblin', campId: 'l4-gate-camp', x: 1000, y: 230 },
    { enemyId: 'oreCreature', campId: 'l4-gate-camp', x: 1100, y: 340 },
  ],
  gates: [
    {
      id: 'l4-to-l3',
      x: 110,
      y: 110,
      label: 'Back to Deep Forest',
      requiredCampId: '',
      targetLevelId: 'level3',
    },
    {
      id: 'l4-to-l5',
      x: 1170,
      y: 110,
      label: 'To the Mine',
      requiredCampId: 'l4-gate-camp',
      targetLevelId: 'level5',
    },
  ],
};
