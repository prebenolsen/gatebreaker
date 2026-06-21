# CLAUDE.md — Gatebreaker

Guidance for any agent (or human) working in this repository.

## What this project is

Gatebreaker is an **automatic action/resource progression game**. The player is **moved manually** (WASD / arrow
keys); **combat and gathering are automatic by proximity** — they trigger only once the player walks close to an
enemy or resource node. The world is a chain of **gated levels**; each gate unlocks once the enemy camp guarding it
is cleared. This repo is currently the **prototype framework** — playable systems with placeholder numbers. Real
balancing, economy, and progression come later.

## ⚠️ Mandatory on every change

1. **Bump `VERSION.md`** following semver (prototype is in `0.x`).
2. **Add an entry to `CHANGELOG.md`** (Keep-a-Changelog format) describing the change.
3. **Update `SCALING.md`** whenever you add/remove/rename any tunable value or balance surface
   (anything in `src/config/balance.ts`, `src/data/`, or the per-level content).

These three are not optional. If a change touches gameplay numbers or content, all three files change.

## Prototype rules (this phase)

- **Do NOT balance.** No tuning of damage, costs, regen rates, enemy scaling, economy, or progression curves.
  Placeholder values are expected and correct for now.
- **Keep it data-driven.** New levels/enemies/resources/upgrades are added as **data** in `src/data/`, not new code.
- **Keep numbers in one place.** Every tunable lives in `src/config/balance.ts` (or the `src/data/` catalogs).
  Never hardcode gameplay numbers inside systems/entities/scenes.

## Architecture map

```
src/
  config/    balance.ts (★ all tunables), gameConfig.ts, funFacts.ts
  core/      types.ts, EventBus.ts, math.ts
  data/      resources.ts, enemies.ts, upgrades.ts, levels/ (data-only level layouts)
  entities/  Player, Enemy, ResourceNode, Gate   — STATE + rendering (placeholder primitives)
  systems/   Movement, Combat, Gathering, Aggro, Regen, Inventory, Upgrade, WorldState — BEHAVIOR
  scenes/    Boot, Level (generic, renders any level from data), UI, Upgrade
  ui/        HUD, FunTextDisplay, GatePrompt, UpgradePanel
  services/  HighscoreService (interface) + Local + Supabase implementations
```

Separation of concerns is deliberate:
- **Entities** hold state and draw themselves (colored shapes + emoji — swap for sprites later via an asset map).
- **Systems** hold behavior and operate over entity lists each tick. They are the only place game rules live.
- **Data** files hold all content and numbers.
- **Scenes** wire Phaser to the systems. `LevelScene` is generic — it renders *any* `LevelDefinition`.

## Supabase

- All external Supabase configuration (project, credentials) is owned by the **user**.
- We only author `supabase/schema.sql`. **Every table must be prefixed `gatebreaker_`.**
- The game runs without Supabase: `services/` falls back to a local store when env vars are absent.

## Dev

- `npm install` then `npm run dev` (Vite, opens at http://localhost:5173).
- `npm run typecheck` — TypeScript must pass.
