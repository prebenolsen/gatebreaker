import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 3 — Deep Forest. Resource mix: MORE WOOD THAN STONE.
// Start bottom-left → exit top-right (guarded). Back-gate at top-left to L2.
export const level3: LevelDefinition = {
  id: 'level3',
  name: 'Deep Forest',
  environment: 'deep-forest',
  backgroundColor: 0x17321f,
  width: 1280,
  height: 720,
  playerStart: { x: 110, y: 610 },
  resources: [
    { type: ResourceType.Wood, x: 260, y: 540 },
    { type: ResourceType.Wood, x: 380, y: 440 },
    { type: ResourceType.Wood, x: 540, y: 520 },
    { type: ResourceType.Wood, x: 620, y: 340 },
    { type: ResourceType.Wood, x: 720, y: 440 },
    { type: ResourceType.Stone, x: 470, y: 300 },
    { type: ResourceType.Stone, x: 820, y: 260 },
  ],
  enemies: [
    { enemyId: 'goblin', campId: 'l3-gate-camp', x: 980, y: 210 },
    { enemyId: 'goblin', campId: 'l3-gate-camp', x: 1060, y: 300 },
    { enemyId: 'goblin', campId: 'l3-gate-camp', x: 1120, y: 420 },
  ],
  gates: [
    {
      id: 'l3-to-l2',
      x: 110,
      y: 110,
      label: 'Back to Forest Edge',
      requiredCampId: '',
      targetLevelId: 'level2',
    },
    {
      id: 'l3-to-l4',
      x: 1170,
      y: 110,
      label: 'To the Grove',
      requiredCampId: 'l3-gate-camp',
      targetLevelId: 'level4',
    },
  ],
};
