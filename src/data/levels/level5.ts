import { ResourceType } from '../../core/types';
import type { LevelDefinition } from './types';

// Level 5 — Mine Entrance. Resource mix: WOOD + IRON INTRODUCED.
// PORTRAIT: start bottom → exit top (guarded). Back-gate sits by the entry to L4 (bottom).
// The forward gate is reserved for future content (Crystal Cave / Ether end-game)
// and is a no-op target for now.
export const level5: LevelDefinition = {
  id: 'level5',
  name: 'Mine Entrance',
  environment: 'mine',
  backgroundColor: 0x2b2620,
  width: 720,
  height: 1280,
  playerStart: { x: 360, y: 1180 },
  resources: [
    { type: ResourceType.Wood, x: 280, y: 1040 },
    { type: ResourceType.Wood, x: 470, y: 960 },
    { type: ResourceType.Iron, x: 320, y: 820 },
    { type: ResourceType.Iron, x: 500, y: 700 },
    { type: ResourceType.Iron, x: 280, y: 600 },
  ],
  enemies: [
    { enemyId: 'oreCreature', campId: 'l5-gate-camp', x: 300, y: 400 },
    { enemyId: 'oreCreature', campId: 'l5-gate-camp', x: 460, y: 330 },
  ],
  gates: [
    {
      id: 'l5-to-l4',
      x: 150,
      y: 1120,
      label: 'Back to the Grove',
      requiredCampId: '',
      targetLevelId: 'level4',
    },
    // Forward gate placeholder — leads nowhere yet (future Crystal Cave).
    {
      id: 'l5-to-next',
      x: 360,
      y: 185,
      label: 'Crystal Cave (coming soon)',
      requiredCampId: 'l5-gate-camp',
      targetLevelId: '',
    },
  ],
  platforms: [
    { kind: 'sell', x: 200, y: 290 },
    { kind: 'upgrade', x: 520, y: 290 },
  ],
};
