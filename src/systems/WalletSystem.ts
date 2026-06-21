import { Currency } from '../core/types';
import { EventBus, GameEvents } from '../core/EventBus';
import { CURRENCY_ORDER } from '../data/currencies';

const STORAGE_KEY = 'gatebreaker.wallet';

/**
 * Persistent coin purse (Bronze/Silver/Gold). Filled by SELLING resources at a
 * sell platform; drained by BUYING upgrades. A module singleton so it survives
 * level changes; persisted to localStorage (prototype convenience).
 */
class Wallet {
  private counts = new Map<Currency, number>();

  constructor() {
    this.load();
  }

  add(currency: Currency, amount: number): void {
    if (amount <= 0) return;
    this.counts.set(currency, this.get(currency) + amount);
    this.persist();
    EventBus.emit(GameEvents.WalletChanged);
  }

  /** Spend coins if affordable. Returns false (and changes nothing) if not. */
  spend(currency: Currency, amount: number): boolean {
    if (this.get(currency) < amount) return false;
    this.counts.set(currency, this.get(currency) - amount);
    this.persist();
    EventBus.emit(GameEvents.WalletChanged);
    return true;
  }

  get(currency: Currency): number {
    return this.counts.get(currency) ?? 0;
  }

  /** A plain snapshot in display order, for the HUD. */
  snapshot(): { currency: Currency; amount: number }[] {
    return CURRENCY_ORDER.map((currency) => ({ currency, amount: this.get(currency) }));
  }

  reset(): void {
    this.counts.clear();
    this.persist();
    EventBus.emit(GameEvents.WalletChanged);
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
        this.counts.set(k as Currency, v);
      }
    } catch {
      /* ignore */
    }
  }
}

export const wallet = new Wallet();
