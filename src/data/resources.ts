import { ResourceType, type ResourceDef } from '../core/types';

// Resource catalog. Visuals are placeholder primitives (color + emoji).
// Stone/Wood/Iron are early-game; Crystal/Ether are reserved for higher levels.
// PLACEHOLDER timings: higher-quality resources take longer to gather AND respawn
// more slowly (see SCALING.md). Do not balance these yet.
export const RESOURCES: Record<ResourceType, ResourceDef> = {
  [ResourceType.Stone]: { type: ResourceType.Stone, label: 'Stone', emoji: '🪨', color: 0x9aa0a6, gatherSeconds: 1.2, respawnSeconds: 8 },
  [ResourceType.Wood]: { type: ResourceType.Wood, label: 'Wood', emoji: '🪵', color: 0x8b5a2b, gatherSeconds: 2.0, respawnSeconds: 14 },
  [ResourceType.Iron]: { type: ResourceType.Iron, label: 'Iron', emoji: '🔩', color: 0xb0b7c3, gatherSeconds: 3.0, respawnSeconds: 22 },
  [ResourceType.Crystal]: { type: ResourceType.Crystal, label: 'Crystal', emoji: '💎', color: 0x7ad7f0, gatherSeconds: 4.5, respawnSeconds: 35 },
  [ResourceType.Ether]: { type: ResourceType.Ether, label: 'Ether', emoji: '✨', color: 0xc792ea, gatherSeconds: 6.0, respawnSeconds: 50 },
};

/** Stable display order (early → late game). */
export const RESOURCE_ORDER: readonly ResourceType[] = [
  ResourceType.Stone,
  ResourceType.Wood,
  ResourceType.Iron,
  ResourceType.Crystal,
  ResourceType.Ether,
];
