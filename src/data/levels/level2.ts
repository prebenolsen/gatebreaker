import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 2 — Forest Edge. Resource mix: MOSTLY STONE + SOME WOOD.
// PORTRAIT: start bottom → exit top (guarded). Back-gate sits by the entry (bottom,
// where the player came from), always open; its camp is already cleared so it's safe to farm.
export const level2: LevelDefinition = {
  id: 'level2',
  name: 'Forest Edge',
  environment: 'forest-edge',
  backgroundColor: 0x21402c,
  width: 720,
  height: 1280,
  playerStart: { x: 360, y: 1180 },
  resources: [
    { type: ResourceType.Stone, x: 240, y: 1040 },
    { type: ResourceType.Stone, x: 470, y: 1000 },
    { type: ResourceType.Stone, x: 320, y: 880 },
    { type: ResourceType.Stone, x: 520, y: 800 },
    { type: ResourceType.Stone, x: 250, y: 700 },
    { type: ResourceType.Wood, x: 470, y: 620 },
    { type: ResourceType.Wood, x: 300, y: 540 },
  ],
  enemies: [
    { enemyId: 'goblin', campId: 'l2-gate-camp', x: 260, y: 380 },
    { enemyId: 'goblin', campId: 'l2-gate-camp', x: 460, y: 320 },
    { enemyId: 'wolf', campId: 'l2-gate-camp', x: 360, y: 450 },
  ],
  gates: [
    {
      id: 'l2-to-l1',
      x: 150,
      y: 1120,
      label: 'Back to Forest',
      requiredCampId: '',
      targetLevelId: 'level1',
    },
    {
      id: 'l2-to-l3',
      x: 360,
      y: 185,
      label: 'To Deep Forest',
      requiredCampId: 'l2-gate-camp',
      targetLevelId: 'level3',
    },
  ],
  platforms: [
    { kind: 'sell', x: 200, y: 290 },
    { kind: 'upgrade', x: 520, y: 290 },
  ],
};
