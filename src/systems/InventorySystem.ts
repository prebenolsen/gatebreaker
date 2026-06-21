import { ResourceType } from '../core/types';
import { EventBus, GameEvents } from '../core/EventBus';
import { RESOURCE_ORDER } from '../data/resources';

const STORAGE_KEY = 'gatebreaker.inventory';

/**
 * Persistent resource store. A module singleton so it survives level changes.
 * Persists to localStorage so a refresh keeps your loot (prototype convenience).
 */
class Inventory {
  private counts = new Map<ResourceType, number>();

  constructor() {
    this.load();
  }

  add(type: ResourceType, amount: number): void {
    if (amount <= 0) return;
    this.counts.set(type, this.get(type) + amount);
    this.persist();
    EventBus.emit(GameEvents.ResourceGathered, { type, amount });
    EventBus.emit(GameEvents.InventoryChanged);
  }

  /** Spend resources if affordable. Returns false (and changes nothing) if not. */
  spend(type: ResourceType, amount: number): boolean {
    if (this.get(type) < amount) return false;
    this.counts.set(type, this.get(type) - amount);
    this.persist();
    EventBus.emit(GameEvents.InventoryChanged);
    return true;
  }

  get(type: ResourceType): number {
    return this.counts.get(type) ?? 0;
  }

  total(): number {
    let sum = 0;
    for (const v of this.counts.values()) sum += v;
    return sum;
  }

  /** A plain snapshot in display order, for the HUD. */
  snapshot(): { type: ResourceType; amount: number }[] {
    return RESOURCE_ORDER.map((type) => ({ type, amount: this.get(type) }));
  }

  reset(): void {
    this.counts.clear();
    this.persist();
    EventBus.emit(GameEvents.InventoryChanged);
  }

  private persist(): void {
    try {
      const obj: Record<string, number> = {};
      for (const [k, v] of this.counts) obj[k] = v;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      /* storage unavailable — fine for prototype */
    }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const obj = JSON.parse(raw) as Record<string, number>;
      for (const [k, v] of Object.entries(obj)) {
        this.counts.set(k as ResourceType, v);
      }
    } catch {
      /* ignore */
    }
  }
}

export const inventory = new Inventory();
