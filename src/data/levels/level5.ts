import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 5 — Mine Entrance. Resource mix: WOOD + IRON INTRODUCED.
// Start bottom-left → exit top-right (guarded). The forward gate is reserved for
// future content (Crystal Cave / Ether end-game) and is a no-op target for now.
export const level5: LevelDefinition = {
  id: 'level5',
  name: 'Mine Entrance',
  environment: 'mine',
  backgroundColor: 0x2b2620,
  width: 1280,
  height: 720,
  playerStart: { x: 110, y: 610 },
  resources: [
    { type: ResourceType.Wood, x: 280, y: 540 },
    { type: ResourceType.Wood, x: 420, y: 470 },
    { type: ResourceType.Iron, x: 560, y: 520 },
    { type: ResourceType.Iron, x: 640, y: 340 },
    { type: ResourceType.Iron, x: 800, y: 300 },
  ],
  enemies: [
    { enemyId: 'oreCreature', campId: 'l5-gate-camp', x: 1000, y: 240 },
    { enemyId: 'oreCreature', campId: 'l5-gate-camp', x: 1100, y: 360 },
  ],
  gates: [
    {
      id: 'l5-to-l4',
      x: 110,
      y: 110,
      label: 'Back to the Grove',
      requiredCampId: '',
      targetLevelId: 'level4',
    },
    // Forward gate placeholder — leads nowhere yet (future Crystal Cave).
    {
      id: 'l5-to-next',
      x: 1170,
      y: 110,
      label: 'Crystal Cave (coming soon)',
      requiredCampId: 'l5-gate-camp',
      targetLevelId: '',
    },
  ],
};
