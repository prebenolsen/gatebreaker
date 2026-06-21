import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 1 — Forest. Starting area, easy intro. Resource mix: STONE ONLY.
// PORTRAIT layout: player starts at the bottom; the exit gate is at the top,
// guarded by a weak wolf camp. Resources zig-zag up the vertical path between them.
export const level1: LevelDefinition = {
  id: 'level1',
  name: 'Whispering Forest',
  environment: 'forest',
  backgroundColor: 0x1d3b2a,
  width: 720,
  height: 1280,
  playerStart: { x: 360, y: 1180 },
  resources: [
    { type: ResourceType.Stone, x: 240, y: 1040 },
    { type: ResourceType.Stone, x: 480, y: 980 },
    { type: ResourceType.Stone, x: 280, y: 850 },
    { type: ResourceType.Stone, x: 500, y: 760 },
    { type: ResourceType.Stone, x: 250, y: 640 },
    { type: ResourceType.Stone, x: 470, y: 560 },
  ],
  enemies: [
    { enemyId: 'wolf', campId: 'l1-gate-camp', x: 280, y: 360 },
    { enemyId: 'wolf', campId: 'l1-gate-camp', x: 460, y: 300 },
  ],
  gates: [
    {
      id: 'l1-to-l2',
      x: 360,
      y: 185,
      label: 'To Forest Edge',
      requiredCampId: 'l1-gate-camp',
      targetLevelId: 'level2',
    },
  ],
  // Sell + upgrade platforms flank the forward gate (stepped on, no key press).
  platforms: [
    { kind: 'sell', x: 200, y: 290 },
    { kind: 'upgrade', x: 520, y: 290 },
  ],
};
