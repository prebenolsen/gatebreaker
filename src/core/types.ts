// Shared types and enums used across the whole game.
// Content (which resources/enemies exist) lives in src/data/; these are the shapes.

export enum ResourceType {
  Stone = 'stone',
  Wood = 'wood',
  Iron = 'iron',
  Crystal = 'crystal',
  Ether = 'ether',
}

export enum DamageType {
  Physical = 'physical',
  Magic = 'magic',
}

export interface Vec2 {
  x: number;
  y: number;
}

/** Visual + identity definition for a resource type (placeholder primitives). */
export interface ResourceDef {
  type: ResourceType;
  label: string;
  emoji: string;
  color: number;
  /** Seconds to gather one yield at gatherSpeed = 1. Higher tiers take longer. */
  gatherSeconds: number;
  /** Seconds before a depleted node respawns. Higher tiers respawn slower. */
  respawnSeconds: number;
}

/** Archetype definition for an enemy. All numbers are placeholders (see SCALING.md). */
export interface EnemyDef {
  id: string;
  label: string;
  emoji: string;
  color: number;
  maxHealth: number;
  damage: number;
  damageType: DamageType;
  /** Attacks per second. */
  attackSpeed: number;
  /** Movement speed in px/sec while chasing. */
  moveSpeed: number;
}

/** The player's effective stats after upgrades are applied. */
export interface PlayerStats {
  maxHealth: number;
  damage: number;
  damageType: DamageType;
  /** Attacks per second. */
  attackSpeed: number;
  /** Movement speed in px/sec. */
  moveSpeed: number;
  /** Flat physical damage reduction. */
  armor: number;
  /** Flat magic damage reduction. */
  magicResist: number;
  /** Multiplier on gather rate (1 = base). */
  gatherSpeed: number;
  /** Additional yield fraction per gather (0 = none). */
  resourceBonus: number;
}
