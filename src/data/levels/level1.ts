import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 1 — Forest. Starting area, easy intro. Resource mix: STONE ONLY.
// Player starts bottom-left; the exit gate is the opposite (top-right) corner,
// guarded by a weak wolf camp. Resources line the diagonal path between them.
export const level1: LevelDefinition = {
  id: 'level1',
  name: 'Whispering Forest',
  environment: 'forest',
  backgroundColor: 0x1d3b2a,
  width: 1280,
  height: 720,
  playerStart: { x: 110, y: 610 },
  resources: [
    { type: ResourceType.Stone, x: 260, y: 540 },
    { type: ResourceType.Stone, x: 400, y: 560 },
    { type: ResourceType.Stone, x: 360, y: 400 },
    { type: ResourceType.Stone, x: 540, y: 470 },
    { type: ResourceType.Stone, x: 640, y: 330 },
    { type: ResourceType.Stone, x: 760, y: 430 },
  ],
  enemies: [
    { enemyId: 'wolf', campId: 'l1-gate-camp', x: 1010, y: 210 },
    { enemyId: 'wolf', campId: 'l1-gate-camp', x: 1090, y: 300 },
  ],
  gates: [
    {
      id: 'l1-to-l2',
      x: 1170,
      y: 110,
      label: 'To Forest Edge',
      requiredCampId: 'l1-gate-camp',
      targetLevelId: 'level2',
    },
  ],
};
