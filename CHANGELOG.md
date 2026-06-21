# Changelog

All notable changes to Gatebreaker are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/). This project adheres to semver.

## [0.3.1] — 2026-06-21

### Changed
- **Top-left HUD no longer overlaps the top gate cluster.** Removed the two instructional hint lines under
  the resource/coin readout and shrank the HUD card (200→116px tall). In all five levels the forward gate
  (`y` 90→185) and its Sell/Upgrade platforms (`y` 150→290) moved down so none sits stacked underneath the
  level card. Placements only — no gameplay numbers tuned.

## [0.3.0] — 2026-06-21

### Changed
- **Portrait orientation for mobile.** The game now targets a phone held vertically. The world reference
  size in `config/balance.ts` flipped from landscape `1280×720` to portrait `720×1280`, and Phaser's FIT
  scale mode letterboxes it onto any device.
- **All five levels re-laid out vertically.** Each level's `width`/`height` is now `720×1280` and every
  placement was redesigned around a bottom-to-top flow: the player starts at the bottom, resources zig-zag
  up the tall corridor, and the forward gate (with its Sell/Upgrade platforms and guarding camp) sits at the
  top. Back-gates moved to the bottom by the entry. No gameplay numbers were tuned — placements only.
- **HUD hints wrap** to the narrower portrait panel (panel grew 184→200px tall) and the move hint now reads
  "drag anywhere (or WASD / arrows)" to lead with the touch control.

### Added
- **Mobile viewport hardening** in `index.html`: `user-scalable=no` + `viewport-fit=cover`, web-app-capable
  meta tags, and `touch-action: none` / `overscroll-behavior: none` so touch-drags drive the in-game
  joystick instead of scrolling or zooming the page.

## [0.2.0] — 2026-06-21

### Added
- **Coin economy (Bronze / Silver / Gold).** New `Currency` enum + `data/currencies.ts` catalog and a
  persistent `WalletSystem` (mirrors the inventory store). The HUD now shows the coin purse beneath the
  resource counts.
- **Sell platforms.** Each level has a 💰 **Sell** platform beside the forward gate: stepping onto it cashes
  in the entire inventory for coins (one sale per step-on) and shows a toast. Selling is handled by the new
  `MarketSystem.sellAll()` using each resource's placeholder `sell` value.
- **Upgrade platforms.** A separate ⬆️ **Upgrade** platform beside the forward gate opens the upgrade menu
  while the player stands on it and closes it when they step off.
- New `Platform` entity and a `platforms` array on `LevelDefinition` (data-driven placement).

### Changed
- **Everything costs coins, not resources.** Resources are now only *sold*; upgrades are *bought* with
  Bronze/Silver/Gold. `UpgradeDef.cost.type` (a `ResourceType`) became `cost.currency` (a `Currency`), and
  `UpgradeSystem` charges the wallet instead of the inventory.
- **Resource sell-worth order is Stone < Wood < Iron < Crystal < Ether**, expressed via each resource's
  `sell` value (coin denomination + amount) in `data/resources.ts`.
- **Removed the `[U]` upgrade hotkey.** Upgrades open/close via the upgrade platform only (`UpgradeScene` and
  `UIScene` no longer bind keys for it). HUD hint updated.
- **Return gate moved to the entry.** Each level past the first now places its always-open back-gate next to
  where the player came in (bottom-left) rather than the top-left corner. Its camp is already cleared, so the
  prior level is safe to re-farm.

### Notes
- All economy numbers (sell values, coin costs) are PLACEHOLDERS — not balanced (see `SCALING.md`).

## [0.1.4] — 2026-06-21

### Changed
- **Enemies always chase the player** across the whole map. Removed the guarded-zone / leashing model: enemies no
  longer engage only inside a `zoneRadius` and no longer return home + fast-regen. Every living enemy runs at the
  player for as long as the player is alive (still at `enemy.speedFactorVsPlayer` × current move speed).
- **Enemies can no longer move the player.** A chasing enemy now stops at a personal-space stand-off
  (`collision.playerRadius + collision.enemyRadius`) — close enough to attack, but it never overlaps or shoves the
  player.
- Removed the now-unused tunables `enemy.zoneRadius`, `enemy.returnRegenPerSecond`, and `enemy.idleRegenPerSecond`
  (see `SCALING.md`). Simplified `EnemyState` to `idle | chasing` (dropped `returning`).

### Notes
- **Returning to a previous level** is already supported: every level past the first has an always-open back-gate
  (`requiredCampId: ''`) at the top-left leading to the prior level, usable at any time.

## [0.1.3] — 2026-06-21

### Added
- **GitHub Pages deploy pipeline** (`.github/workflows/deploy.yml`): builds with `npm ci && npm run build` on every
  push to `main` (and on manual `workflow_dispatch`) and publishes `dist/` via the official Pages actions.
  Optional Supabase credentials are read from repo secrets `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

### Changed
- **Vite `base`** is now `/gatebreaker/` for production builds (the GitHub Pages project subpath); dev server stays
  at `/`.

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
