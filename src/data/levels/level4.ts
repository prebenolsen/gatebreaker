import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 4 — The Grove. Resource mix: WOOD ONLY.
// PORTRAIT: start bottom → exit top (guarded). Back-gate sits by the entry to L3 (bottom).
export const level4: LevelDefinition = {
  id: 'level4',
  name: 'The Grove',
  environment: 'grove',
  backgroundColor: 0x14301c,
  width: 720,
  height: 1280,
  playerStart: { x: 360, y: 1180 },
  resources: [
    { type: ResourceType.Wood, x: 240, y: 1040 },
    { type: ResourceType.Wood, x: 470, y: 990 },
    { type: ResourceType.Wood, x: 320, y: 870 },
    { type: ResourceType.Wood, x: 510, y: 780 },
    { type: ResourceType.Wood, x: 260, y: 680 },
    { type: ResourceType.Wood, x: 460, y: 580 },
  ],
  enemies: [
    { enemyId: 'goblin', campId: 'l4-gate-camp', x: 300, y: 400 },
    { enemyId: 'oreCreature', campId: 'l4-gate-camp', x: 460, y: 330 },
  ],
  gates: [
    {
      id: 'l4-to-l3',
      x: 150,
      y: 1120,
      label: 'Back to Deep Forest',
      requiredCampId: '',
      targetLevelId: 'level3',
    },
    {
      id: 'l4-to-l5',
      x: 360,
      y: 185,
      label: 'To the Mine',
      requiredCampId: 'l4-gate-camp',
      targetLevelId: 'level5',
    },
  ],
  platforms: [
    { kind: 'sell', x: 200, y: 290 },
    { kind: 'upgrade', x: 520, y: 290 },
  ],
};
