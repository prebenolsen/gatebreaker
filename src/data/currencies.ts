import { Currency, type CurrencyDef } from '../core/types';

// Coin catalog. Visuals are placeholder primitives (color + emoji).
// Bronze < Silver < Gold in worth — the relative value of each resource is
// expressed by which coin (and how many) it sells for in `data/resources.ts`.
export const CURRENCIES: Record<Currency, CurrencyDef> = {
  [Currency.Bronze]: { type: Currency.Bronze, label: 'Bronze', emoji: '🥉', color: 0xcd7f32 },
  [Currency.Silver]: { type: Currency.Silver, label: 'Silver', emoji: '🥈', color: 0xc0c0c0 },
  [Currency.Gold]: { type: Currency.Gold, label: 'Gold', emoji: '🥇', color: 0xffd700 },
};

/** Stable display order (low → high worth). */
export const CURRENCY_ORDER: readonly Currency[] = [
  Currency.Bronze,
  Currency.Silver,
  Currency.Gold,
];
