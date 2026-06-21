# SCALING.md — the tuning surface

> **Every value referenced here is a PLACEHOLDER.** Balancing, economy, and progression are deferred.
> This document is the map of *where* numbers live so future tuning is a data edit, not a code change.
> Update this file whenever a tunable is added/removed/renamed (see `CLAUDE.md`).

## Single source of numbers: `src/config/balance.ts`

| Group | Keys | Meaning |
|-------|------|---------|
| `player.base` | maxHealth, damage, damageType, attackSpeed, moveSpeed, armor, magicResist, gatherSpeed, resourceBonus | Player base stats before upgrades. `moveSpeed` is the manual (keyboard) movement speed. |
| `player` | attackRange, gatherRange | Proximity at which auto-combat / auto-gather trigger once the player walks near. |
| `player.regen` | outOfCombatDelay, perSecond | Out-of-combat health regeneration. |
| `enemy` | zoneRadius, attackRange, speedFactorVsPlayer, returnRegenPerSecond, idleRegenPerSecond | `zoneRadius` = the camp's guarded area; entering it engages the enemy immediately. `speedFactorVsPlayer` keeps enemies slightly faster than the player's current move speed. Leaving the zone makes the enemy return + fast-regen. |
| `collision` | playerRadius, enemyRadius, resourceRadius, allowedOverlap | Personal space — the player can't pass through enemies/resources (a slight overlap is allowed). |
| `resources` | defaultYield | Per-gather yield. Gather time + respawn time are PER-RESOURCE in `data/resources.ts`. |
| `combat` | minDamage | Damage floor after armor. |
| `score` | resourceWeight, levelWeight | Placeholder highscore formula weights. |
| `funText` | minIntervalMs, maxIntervalMs, durationMs | Cadence of fun-fact popups during farming. |

## Content catalogs: `src/data/`

- **`resources.ts`** — the resource types (Stone, Wood, Iron, Crystal, Ether): label, emoji, color, and the
  **placeholder** `gatherSeconds` / `respawnSeconds` (higher-quality resources take longer to gather and respawn slower).
- **`enemies.ts`** — enemy archetypes: health, damage, damage type, attack speed, move speed, look.
- **`upgrades.ts`** — upgrade catalog (Damage, Attack Speed, Health, Armor, Gather Speed, Resource Bonus):
  which stat each modifies, **placeholder** `effectPerLevel`, `maxLevel`, and **placeholder** cost
  (`baseAmount`, `growth`, resource type). Cost/effect formulas are the main economy surface to balance later.
- **`levels/level1..5.ts`** — per-level layout: size, player start, resource node placements (and thus the
  **resource mix** per level), enemy camps (grouped by `campId`), and gates (which `campId` unlocks them and
  which level they lead to). This is where the L1→L5 resource progression is expressed as data.

## How upgrades apply (placeholder math)

`UpgradeSystem.applyTo(base)` starts from `balance.player.base` and adds, per owned upgrade,
`effectPerLevel * level` onto the targeted stat. Linear and unbalanced on purpose — replace with the
real curve later. Cost per purchase = `baseAmount * growth^currentLevel` of the upgrade's resource.

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

Damage/health/cost/regen values, enemy difficulty scaling, respawn timers, upgrade curves, score weights.
Leave placeholders as-is until the balancing phase.
