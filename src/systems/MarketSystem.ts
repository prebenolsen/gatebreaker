import { Currency } from '../core/types';
import { RESOURCES } from '../data/resources';
import { inventory } from './InventorySystem';
import { wallet } from './WalletSystem';

/** Summary of a sale: how many resource units were sold and the coins gained. */
export interface SaleResult {
  /** Total resource units sold across all types. */
  totalUnits: number;
  /** Coins gained per denomination (zero entries omitted). */
  gains: Partial<Record<Currency, number>>;
}

/**
 * Sells the ENTIRE inventory at each resource's placeholder `sell` value, moving
 * the proceeds into the wallet and emptying the inventory. Returns a summary so
 * the caller can show a toast. No-op (totalUnits 0) when the inventory is empty.
 */
export function sellAll(): SaleResult {
  const gains: Partial<Record<Currency, number>> = {};
  let totalUnits = 0;

  for (const { type, amount } of inventory.snapshot()) {
    if (amount <= 0) continue;
    const { currency, amount: unitValue } = RESOURCES[type].sell;
    const coins = unitValue * amount;
    wallet.add(currency, coins);
    gains[currency] = (gains[currency] ?? 0) + coins;
    totalUnits += amount;
  }

  if (totalUnits > 0) inventory.reset();
  return { totalUnits, gains };
}
