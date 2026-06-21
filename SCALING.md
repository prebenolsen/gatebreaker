# SCALING.md — the tuning surface

> **Every value referenced here is a PLACEHOLDER.** Balancing, economy, and progression are deferred.
> This document is the map of *where* numbers live so future tuning is a data edit, not a code change.
> Update this file whenever a tunable is added/removed/renamed (see `CLAUDE.md`).

## Single source of numbers: `src/config/balance.ts`

| Group | Keys | Meaning |
|-------|------|---------|
| `world` | width, height | Canvas reference size. **Portrait** (`720×1280`) — the game targets a phone held vertically; Phaser's FIT scale mode letterboxes it onto any device. Each level overrides these per-level (currently all match). Levels lay out bottom (player start) → top (forward gate). |
| `player.base` | maxHealth, damage, damageType, attackSpeed, moveSpeed, armor, magicResist, gatherSpeed, resourceBonus | Player base stats before upgrades. `moveSpeed` is the manual (keyboard) movement speed. |
| `player` | attackRange, gatherRange | Proximity at which auto-combat / auto-gather trigger once the player walks near. |
| `player.regen` | outOfCombatDelay, perSecond | Out-of-combat health regeneration. |
| `enemy` | attackRange, speedFactorVsPlayer | Enemies always chase the player across the whole map (no zones, no leashing). `attackRange` = distance at which an enemy auto-attacks. `speedFactorVsPlayer` keeps enemies slightly faster than the player's current move speed so they can always catch up. Enemies stop at the player's `collision` stand-off so they attack without pushing the player. |
| `collision` | playerRadius, enemyRadius, resourceRadius, allowedOverlap | Personal space — the player can't pass through enemies/resources (a slight overlap is allowed). |
| `resources` | defaultYield | Per-gather yield. Gather time + respawn time are PER-RESOURCE in `data/resources.ts`. |
| `combat` | minDamage | Damage floor after armor. |
| `score` | resourceWeight, levelWeight | Placeholder highscore formula weights. |
| `funText` | minIntervalMs, maxIntervalMs, durationMs | Cadence of fun-fact popups during farming. |

## Content catalogs: `src/data/`

- **`resources.ts`** — the resource types (Stone, Wood, Iron, Crystal, Ether): label, emoji, color, the
  **placeholder** `gatherSeconds` / `respawnSeconds` (higher-quality resources take longer to gather and respawn
  slower), and `sell` — the **placeholder** worth of ONE unit at a sell platform (`{ currency, amount }`). The
  sell-worth order is **Stone < Wood < Iron < Crystal < Ether**, encoded by coin denomination + amount.
- **`currencies.ts`** — the three coins (Bronze, Silver, Gold): label, emoji, color, and display order. Bronze <
  Silver < Gold in worth. This is what resources are sold for and what everything is bought with.
- **`enemies.ts`** — enemy archetypes: health, damage, damage type, attack speed, move speed, look.
- **`upgrades.ts`** — upgrade catalog (Damage, Attack Speed, Health, Armor, Gather Speed, Resource Bonus):
  which stat each modifies, **placeholder** `effectPerLevel`, `maxLevel`, and **placeholder** cost
  (`baseAmount`, `growth`, **`currency`** — one of Bronze/Silver/Gold). Cost/effect formulas are the main
  economy surface to balance later. Costs are paid from the wallet, never from raw resources.
- **`levels/level1..5.ts`** — per-level layout: size, player start, resource node placements (and thus the
  **resource mix** per level), enemy camps (grouped by `campId`), gates (which `campId` unlocks them and which
  level they lead to), and `platforms` (the **sell** / **upgrade** platforms placed beside the forward gate).
  This is where the L1→L5 resource progression is expressed as data.

## How upgrades apply (placeholder math)

`UpgradeSystem.applyTo(base)` starts from `balance.player.base` and adds, per owned upgrade,
`effectPerLevel * level` onto the targeted stat. Linear and unbalanced on purpose — replace with the
real curve later. Cost per purchase = `baseAmount * growth^currentLevel` of the upgrade's **coin**
(`cost.currency`), charged from the wallet.

## Economy loop (placeholder)

Gather resources → step on the **Sell** platform to convert the whole inventory into coins
(`MarketSystem.sellAll()`, using each resource's `sell` value) → step on the **Upgrade** platform to buy
upgrades with those coins. Sell values and coin costs are the two economy surfaces to balance later.

## Resource progression (data-driven, per level)

| Level | Environment | Resource mix (placeholder) |
|-------|-------------|----------------------------|
| 1 | Forest | Stone only |
| 2 | Forest edge | Mostly Stone + some Wood |
| 3 | Deep Forest | More Wood than Stone |
| 4 | Grove | Wood only |
| 5 | Mine entrance | Wood + Iron introduced |

> Crystal and Ether are defined in `resources.ts` and reserved for higher levels added later
> (Crystal Cave, end-game Ether). Add them by editing level data — no code changes.

## Explicitly NOT to tune in this phase

Damage/health/cost/regen values, enemy difficulty scaling, respawn timers, upgrade curves, score weights,
resource sell values, coin costs. Leave placeholders as-is until the balancing phase.
