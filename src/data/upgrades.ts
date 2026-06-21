import { ResourceType, type PlayerStats } from '../core/types';

export type UpgradeCategory =
  | 'damage'
  | 'attackSpeed'
  | 'health'
  | 'armor'
  | 'gatherSpeed'
  | 'resourceBonus';

/**
 * A placeholder upgrade. Effects and costs are NOT balanced — see SCALING.md.
 * The UpgradeSystem applies `effectPerLevel * level` additively onto `stat`,
 * and charges `cost.baseAmount * cost.growth^level` of `cost.type` per purchase.
 */
export interface UpgradeDef {
  id: string;
  label: string;
  category: UpgradeCategory;
  description: string;
  /** Which PlayerStats field this upgrade modifies. */
  stat: keyof PlayerStats;
  /** PLACEHOLDER additive effect per level. */
  effectPerLevel: number;
  maxLevel: number;
  /** PLACEHOLDER cost curve. */
  cost: {
    type: ResourceType;
    baseAmount: number;
    growth: number;
  };
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'damage',
    label: 'Damage',
    category: 'damage',
    description: 'Increase attack damage.',
    stat: 'damage',
    effectPerLevel: 5,
    maxLevel: 20,
    cost: { type: ResourceType.Stone, baseAmount: 10, growth: 1.5 },
  },
  {
    id: 'attackSpeed',
    label: 'Attack Speed',
    category: 'attackSpeed',
    description: 'Attack more often.',
    stat: 'attackSpeed',
    effectPerLevel: 0.15,
    maxLevel: 20,
    cost: { type: ResourceType.Wood, baseAmount: 10, growth: 1.5 },
  },
  {
    id: 'health',
    label: 'Health',
    category: 'health',
    description: 'Increase max health (physical & magic hits).',
    stat: 'maxHealth',
    effectPerLevel: 25,
    maxLevel: 20,
    cost: { type: ResourceType.Stone, baseAmount: 15, growth: 1.5 },
  },
  {
    id: 'armor',
    label: 'Armor',
    category: 'armor',
    description: 'Reduce physical damage taken.',
    stat: 'armor',
    effectPerLevel: 2,
    maxLevel: 20,
    cost: { type: ResourceType.Iron, baseAmount: 8, growth: 1.6 },
  },
  {
    id: 'gatherSpeed',
    label: 'Gathering Speed',
    category: 'gatherSpeed',
    description: 'Gather resources faster.',
    stat: 'gatherSpeed',
    effectPerLevel: 0.2,
    maxLevel: 20,
    cost: { type: ResourceType.Wood, baseAmount: 12, growth: 1.5 },
  },
  {
    id: 'resourceBonus',
    label: 'Resource Bonus',
    category: 'resourceBonus',
    description: 'Gain extra resources per gather.',
    stat: 'resourceBonus',
    effectPerLevel: 0.25,
    maxLevel: 20,
    cost: { type: ResourceType.Crystal, baseAmount: 5, growth: 1.7 },
  },
];
