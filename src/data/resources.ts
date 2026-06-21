import { Currency, ResourceType, type ResourceDef } from '../core/types';

// Resource catalog. Visuals are placeholder primitives (color + emoji).
// Stone/Wood/Iron are early-game; Crystal/Ether are reserved for higher levels.
// PLACEHOLDER timings: higher-quality resources take longer to gather AND respawn
// more slowly (see SCALING.md). Do not balance these yet.
//
// `sell` is the (placeholder) worth of ONE unit at a sell platform. Worth rises
// Stone < Wood < Iron < Crystal < Ether, expressed via the coin denomination and
// amount (Bronze < Silver < Gold).
export const RESOURCES: Record<ResourceType, ResourceDef> = {
  [ResourceType.Stone]: { type: ResourceType.Stone, label: 'Stone', emoji: '🪨', color: 0x9aa0a6, gatherSeconds: 1.2, respawnSeconds: 8, sell: { currency: Currency.Bronze, amount: 1 } },
  [ResourceType.Wood]: { type: ResourceType.Wood, label: 'Wood', emoji: '🪵', color: 0x8b5a2b, gatherSeconds: 2.0, respawnSeconds: 14, sell: { currency: Currency.Bronze, amount: 3 } },
  [ResourceType.Iron]: { type: ResourceType.Iron, label: 'Iron', emoji: '🔩', color: 0xb0b7c3, gatherSeconds: 3.0, respawnSeconds: 22, sell: { currency: Currency.Silver, amount: 1 } },
  [ResourceType.Crystal]: { type: ResourceType.Crystal, label: 'Crystal', emoji: '💎', color: 0x7ad7f0, gatherSeconds: 4.5, respawnSeconds: 35, sell: { currency: Currency.Gold, amount: 1 } },
  [ResourceType.Ether]: { type: ResourceType.Ether, label: 'Ether', emoji: '✨', color: 0xc792ea, gatherSeconds: 6.0, respawnSeconds: 50, sell: { currency: Currency.Gold, amount: 5 } },
};

/** Stable display order (early → late game). */
export const RESOURCE_ORDER: readonly ResourceType[] = [
  ResourceType.Stone,
  ResourceType.Wood,
  ResourceType.Iron,
  ResourceType.Crystal,
  ResourceType.Ether,
];
