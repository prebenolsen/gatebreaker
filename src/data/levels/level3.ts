import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 3 — Deep Forest. Resource mix: MORE WOOD THAN STONE.
// PORTRAIT: start bottom → exit top (guarded). Back-gate sits by the entry to L2 (bottom).
export const level3: LevelDefinition = {
  id: 'level3',
  name: 'Deep Forest',
  environment: 'deep-forest',
  backgroundColor: 0x17321f,
  width: 720,
  height: 1280,
  playerStart: { x: 360, y: 1180 },
  resources: [
    { type: ResourceType.Wood, x: 240, y: 1040 },
    { type: ResourceType.Wood, x: 470, y: 990 },
    { type: ResourceType.Wood, x: 320, y: 880 },
    { type: ResourceType.Wood, x: 520, y: 790 },
    { type: ResourceType.Wood, x: 250, y: 690 },
    { type: ResourceType.Stone, x: 460, y: 610 },
    { type: ResourceType.Stone, x: 320, y: 530 },
  ],
  enemies: [
    { enemyId: 'goblin', campId: 'l3-gate-camp', x: 260, y: 380 },
    { enemyId: 'goblin', campId: 'l3-gate-camp', x: 460, y: 320 },
    { enemyId: 'goblin', campId: 'l3-gate-camp', x: 360, y: 450 },
  ],
  gates: [
    {
      id: 'l3-to-l2',
      x: 150,
      y: 1120,
      label: 'Back to Forest Edge',
      requiredCampId: '',
      targetLevelId: 'level2',
    },
    {
      id: 'l3-to-l4',
      x: 360,
      y: 185,
      label: 'To the Grove',
      requiredCampId: 'l3-gate-camp',
      targetLevelId: 'level4',
    },
  ],
  platforms: [
    { kind: 'sell', x: 200, y: 290 },
    { kind: 'upgrade', x: 520, y: 290 },
  ],
};
