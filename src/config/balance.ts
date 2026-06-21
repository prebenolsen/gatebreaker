import { DamageType, type PlayerStats } from '../core/types';

/**
 * ★ SINGLE SOURCE OF GAMEPLAY NUMBERS ★
 *
 * Everything here is a PLACEHOLDER. Do NOT balance in the prototype phase.
 * See SCALING.md for the map of what each value controls. Systems and entities
 * must read from here rather than hardcoding numbers.
 */
export const Balance = {
  /**
   * World/canvas reference size. Each level fits one screen in the prototype.
   * PORTRAIT — the game targets a phone held vertically (9:16). Phaser's FIT
   * scale mode letterboxes this onto any device, so levels are laid out tall:
   * the player starts at the bottom and the forward gate sits at the top.
   */
  world: {
    width: 720,
    height: 1280,
  },

  player: {
    /** Base stats before upgrades. */
    base: {
      maxHealth: 100,
      damage: 10,
      damageType: DamageType.Physical,
      attackSpeed: 1, // attacks/sec
      moveSpeed: 150, // px/sec
      armor: 0,
      magicResist: 0,
      gatherSpeed: 1, // multiplier
      resourceBonus: 0, // extra yield fraction
    } satisfies PlayerStats,

    /** Distance at which the player auto-attacks an enemy (when standing near it). */
    attackRange: 46,
    /** Distance at which the player auto-gathers a node (when standing near it). */
    gatherRange: 42,

    /** Out-of-combat health regeneration. */
    regen: {
      outOfCombatDelay: 2500, // ms since last hit before regen starts
      perSecond: 8,
    },
  },

  enemy: {
    /** Distance at which an enemy auto-attacks the player. */
    attackRange: 42,
    /**
     * Enemy chase speed as a multiple of the player's CURRENT move speed, so
     * enemies are always slightly faster than the player (even after upgrades).
     * Every enemy always chases the player across the whole map (no leashing).
     */
    speedFactorVsPlayer: 1.12,
  },

  /** Personal space: entities can't pass through each other (slight overlap ok). */
  collision: {
    playerRadius: 18,
    enemyRadius: 16,
    resourceRadius: 18,
    /** How much radii may overlap before being pushed apart. */
    allowedOverlap: 8,
  },

  resources: {
    /** Yield per completed gather (before resourceBonus). */
    defaultYield: 1,
    // Per-resource gather/respawn timings live in src/data/resources.ts.
  },

  combat: {
    /** Damage floor after armor/resist reduction. */
    minDamage: 1,
  },

  /** Placeholder highscore formula weights. */
  score: {
    resourceWeight: 10,
    levelWeight: 100,
  },

  /** Cadence of the fun-fact popups shown while farming. */
  funText: {
    minIntervalMs: 8000,
    maxIntervalMs: 16000,
    durationMs: 5000,
  },
} as const;
