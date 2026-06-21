# Changelog

All notable changes to Gatebreaker are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/). This project adheres to semver.

## [0.1.2] — 2026-06-21

### Added
- **Mobile touch joystick** (`systems/VirtualJoystick.ts`): press-and-hold anywhere to create an invisible joystick
  from the touch point; drag to steer. Combined with keyboard input in `MovementSystem`.
- **Personal space / collision**: the player can no longer pass through enemies or resource nodes (slight overlap
  allowed). New `balance.collision` radii; resolution in `MovementSystem`.
- **Resource "loading" ring**: `ResourceNode` now renders a circular ring around the whole node that fills as you
  gather (gold) and fills again as a depleted node respawns (blue).

### Changed
- **Level layouts** now run corner-to-corner: player starts bottom-left and exits through the opposite top-right
  corner (back-gate at top-left), with the enemy camp guarding the exit.
- **Enemies engage immediately** when the player enters a camp's zone (`enemy.zoneRadius`) instead of a small aggro
  range, and **always move slightly faster than the player** (`enemy.speedFactorVsPlayer` × current move speed).
- **Resource timings are per-resource** (`data/resources.ts`): higher-quality resources take longer to gather and
  respawn more slowly. Removed `balance.resources.gatherTimeSeconds` / `respawnMs` and `balance.enemy.aggroRange` /
  `leashRadius` (replaced by `zoneRadius`).

## [0.1.1] — 2026-06-21

### Changed — Manual player movement

- The player is now **moved manually** with WASD / arrow keys. Only **combat and gathering** remain automatic,
  triggering by proximity once the player walks next to an enemy or resource node (per the design intent).
- `MovementSystem` rewritten from auto-targeting to keyboard input (with world-bounds clamping and normalized
  diagonals). Removed the auto-move tunables `player.scanRadius` and `player.preferEnemies` from `balance.ts`.
- Updated HUD controls hint and docs (`README.md`, `CLAUDE.md`, `SCALING.md`).

## [0.1.0] — 2026-06-21

### Added — Initial prototype framework

- **Project scaffold**: Phaser 3 + TypeScript + Vite. Placeholder primitives for all visuals.
- **Core**: typed `EventBus`, shared `types`, vector/`math` helpers.
- **Config**: central `balance.ts` (all tunables), `gameConfig.ts`, `funFacts.ts`.
- **Data (data-driven)**: resource catalog (Stone/Wood/Iron/Crystal/Ether), enemy archetypes,
  placeholder upgrade catalog, and **5 scaffolded levels** matching the resource progression
  (L1 Stone → L2 stone+wood → L3 more wood → L4 wood → L5 introduces Iron; Crystal/Ether reserved for later levels).
- **Entities**: `Player`, `Enemy`, `ResourceNode`, `Gate` — state + self-rendering.
- **Systems**: Movement (auto-target nearest), Combat (auto-attack exchange), Gathering (auto-gather + respawn),
  Aggro (enemy chase / leash / return / fast-regen), Regen (player out-of-combat), Inventory (persistent store),
  Upgrade (spend resources → stat modifiers, placeholder), WorldState (cleared camps / unlocked levels).
- **Scenes**: Boot, generic `LevelScene`, parallel `UIScene`, `UpgradeScene`.
- **UI**: HUD (health + inventory), periodic fun-text popups, gate prompts, upgrade panel.
- **Services**: `HighscoreService` interface with Local (localStorage) + Supabase implementations and an
  auto-selecting factory.
- **Supabase**: `supabase/schema.sql` with `gatebreaker_highscores` (all tables `gatebreaker_`-prefixed).
- **Docs**: `CLAUDE.md`, `VERSION.md`, `SCALING.md`.

> All numbers are placeholders. Balancing/economy/progression are intentionally deferred (see `SCALING.md`).
