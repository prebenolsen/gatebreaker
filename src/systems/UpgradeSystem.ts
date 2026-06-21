import type { PlayerStats } from '../core/types';
import { EventBus, GameEvents } from '../core/EventBus';
import { UPGRADES, type UpgradeDef } from '../data/upgrades';
import { inventory } from './InventorySystem';

const STORAGE_KEY = 'gatebreaker.upgrades';

/**
 * Owns purchased upgrade levels and applies them to the player's base stats.
 * Effects/costs are PLACEHOLDERS (see data/upgrades.ts + SCALING.md).
 */
class Upgrades {
  private levels = new Map<string, number>();

  constructor() {
    this.load();
  }

  getLevel(id: string): number {
    return this.levels.get(id) ?? 0;
  }

  /** Cost of the NEXT level of an upgrade (placeholder curve). */
  nextCost(def: UpgradeDef): number {
    const level = this.getLevel(def.id);
    return Math.round(def.cost.baseAmount * Math.pow(def.cost.growth, level));
  }

  isMaxed(def: UpgradeDef): boolean {
    return this.getLevel(def.id) >= def.maxLevel;
  }

  canAfford(def: UpgradeDef): boolean {
    if (this.isMaxed(def)) return false;
    return inventory.get(def.cost.type) >= this.nextCost(def);
  }

  /** Attempt to buy one level. Returns true on success. */
  purchase(id: string): boolean {
    const def = UPGRADES.find((u) => u.id === id);
    if (!def || this.isMaxed(def)) return false;
    const cost = this.nextCost(def);
    if (!inventory.spend(def.cost.type, cost)) return false;
    this.levels.set(id, this.getLevel(id) + 1);
    this.persist();
    EventBus.emit(GameEvents.UpgradePurchased, { id });
    return true;
  }

  /** Produce effective stats by applying owned upgrades onto a base copy. */
  applyTo(base: PlayerStats): PlayerStats {
    const out: PlayerStats = { ...base };
    for (const def of UPGRADES) {
      const level = this.getLevel(def.id);
      if (level <= 0) continue;
      const stat = def.stat;
      const current = out[stat];
      if (typeof current === 'number') {
        (out[stat] as number) = current + def.effectPerLevel * level;
      }
    }
    return out;
  }

  reset(): void {
    this.levels.clear();
    this.persist();
  }

  private persist(): void {
    try {
      const obj: Record<string, number> = {};
      for (const [k, v] of this.levels) obj[k] = v;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      /* ignore */
    }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const obj = JSON.parse(raw) as Record<string, number>;
      for (const [k, v] of Object.entries(obj)) this.levels.set(k, v);
    } catch {
      /* ignore */
    }
  }
}

export const upgrades = new Upgrades();
