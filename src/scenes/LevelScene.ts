import Phaser from 'phaser';
import { Balance } from '../config/balance';
import { distance } from '../core/math';
import { EventBus, GameEvents, type EnemyKilledPayload } from '../core/EventBus';
import { getLevel, getLevelIndex, type LevelDefinition } from '../data/levels';
import { ENEMIES } from '../data/enemies';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { ResourceNode } from '../entities/ResourceNode';
import { Gate } from '../entities/Gate';
import { Platform } from '../entities/Platform';
import { upgrades } from '../systems/UpgradeSystem';
import { world } from '../systems/WorldState';
import { sellAll } from '../systems/MarketSystem';
import { CURRENCIES } from '../data/currencies';
import type { LevelContext } from '../systems/LevelContext';
import { MovementSystem } from '../systems/MovementSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { GatheringSystem } from '../systems/GatheringSystem';
import { AggroSystem } from '../systems/AggroSystem';
import { RegenSystem } from '../systems/RegenSystem';
import { GatePrompt } from '../ui/GatePrompt';

const GATE_ENTER_RANGE = 40;
const PLATFORM_RANGE = 46;

/**
 * Generic level runtime. Renders ANY level from its LevelDefinition and runs the
 * behavior systems each tick. Adding a level requires no changes here — only data.
 */
export class LevelScene extends Phaser.Scene {
  private levelId!: string;
  private def!: LevelDefinition;
  private ctx!: LevelContext;

  private movement!: MovementSystem;
  private combat!: CombatSystem;
  private gathering!: GatheringSystem;
  private aggro!: AggroSystem;
  private regen!: RegenSystem;
  private gatePrompt!: GatePrompt;

  private transitioning = false;
  private reviving = false;
  /** True while the player is standing on the sell platform (sell once per step-on). */
  private onSellPlatform = false;

  constructor() {
    super('LevelScene');
  }

  init(data: { levelId: string }): void {
    this.levelId = data.levelId;
    this.transitioning = false;
    this.reviving = false;
    this.onSellPlatform = false;
  }

  create(): void {
    const def = getLevel(this.levelId);
    if (!def) throw new Error(`Unknown level: ${this.levelId}`);
    this.def = def;
    world.unlockLevel(def.id);

    this.cameras.main.setBackgroundColor(def.backgroundColor);

    // ── Build entities from data ─────────────────────────────────────────────
    const player = new Player(
      this,
      def.playerStart.x,
      def.playerStart.y,
      upgrades.applyTo(Balance.player.base),
    );
    this.registry.set('player', player);

    const resources = def.resources.map((r) => new ResourceNode(this, r.x, r.y, r.type));

    // Skip enemies whose camp is already cleared (so cleared stays cleared).
    const enemies = def.enemies
      .filter((e) => !world.isCampCleared(e.campId))
      .map((e) => new Enemy(this, e.x, e.y, ENEMIES[e.enemyId], e.campId));

    const gates = def.gates.map(
      (g) => new Gate(this, g, world.isCampCleared(g.requiredCampId)),
    );

    const platforms = def.platforms.map((p) => new Platform(this, p));

    this.ctx = { player, enemies, resources, gates, platforms };

    // ── Systems ──────────────────────────────────────────────────────────────
    this.movement = new MovementSystem(this, this.ctx, {
      width: def.width,
      height: def.height,
    });
    this.combat = new CombatSystem(this.ctx);
    this.gathering = new GatheringSystem(this.ctx);
    this.aggro = new AggroSystem(this.ctx);
    this.regen = new RegenSystem(this.ctx);
    this.gatePrompt = new GatePrompt(this, this.ctx);

    // ── Events ───────────────────────────────────────────────────────────────
    EventBus.on(GameEvents.EnemyKilled, this.onEnemyKilled, this);
    EventBus.on(GameEvents.PlayerDied, this.onPlayerDied, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);

    EventBus.emit(GameEvents.LevelChanged, {
      levelId: def.id,
      levelIndex: getLevelIndex(def.id),
    });
  }

  override update(_time: number, delta: number): void {
    const dt = delta / 1000;
    const now = this.time.now;

    this.aggro.update(dt);
    this.movement.update(dt);
    this.combat.update(dt, now);
    this.gathering.update(dt);
    this.regen.update(dt, now);
    this.gatePrompt.update();
    this.checkPlatforms();
    this.checkGateTransition();
  }

  // ── Sell / upgrade platforms (stepped on — no key press) ────────────────────
  private checkPlatforms(): void {
    const { player, platforms } = this.ctx;

    const onSell = platforms.some(
      (p) => p.kind === 'sell' && distance(player.x, player.y, p.x, p.y) <= PLATFORM_RANGE,
    );
    // Sell the whole inventory once, on the step-on edge.
    if (onSell && !this.onSellPlatform) this.sellInventory();
    this.onSellPlatform = onSell;

    const onUpgrade = platforms.some(
      (p) => p.kind === 'upgrade' && distance(player.x, player.y, p.x, p.y) <= PLATFORM_RANGE,
    );
    const upgradeOpen = this.scene.isActive('UpgradeScene');
    if (onUpgrade && !upgradeOpen) this.scene.launch('UpgradeScene');
    else if (!onUpgrade && upgradeOpen) this.scene.stop('UpgradeScene');
  }

  private sellInventory(): void {
    const result = sellAll();
    if (result.totalUnits <= 0) return;
    const coins = Object.entries(result.gains)
      .map(([currency, amount]) => `${CURRENCIES[currency as keyof typeof CURRENCIES].emoji} ${amount}`)
      .join('  ');
    EventBus.emit(GameEvents.Notice, { message: `Sold ${result.totalUnits} resources → ${coins}` });
  }

  // ── Camp clearing → gate unlocking ─────────────────────────────────────────
  private onEnemyKilled(payload: EnemyKilledPayload): void {
    // Remove dead entities (owned here).
    this.ctx.enemies = this.ctx.enemies.filter((e) => {
      if (e.isAlive()) return true;
      e.destroy();
      return false;
    });

    const campStillActive = this.ctx.enemies.some((e) => e.campId === payload.campId);
    if (!campStillActive && payload.campId) {
      world.clearCamp(payload.campId);
      EventBus.emit(GameEvents.CampCleared, { campId: payload.campId });
      for (const gate of this.ctx.gates) {
        if (gate.spawn.requiredCampId === payload.campId) gate.setUnlocked(true);
      }
    }
  }

  // ── Player death → simple respawn at level entry (no penalty in prototype) ──
  private onPlayerDied(): void {
    if (this.reviving) return;
    this.reviving = true;
    this.time.delayedCall(900, () => {
      this.ctx.player.revive(this.def.playerStart.x, this.def.playerStart.y);
      this.reviving = false;
    });
  }

  private checkGateTransition(): void {
    if (this.transitioning) return;
    const { player, gates } = this.ctx;
    for (const gate of gates) {
      if (!gate.isUsable) continue;
      if (distance(player.x, player.y, gate.x, gate.y) <= GATE_ENTER_RANGE) {
        this.transitioning = true;
        this.scene.restart({ levelId: gate.spawn.targetLevelId });
        return;
      }
    }
  }

  private onShutdown(): void {
    // Don't leave the upgrade overlay open across a level change.
    if (this.scene.isActive('UpgradeScene')) this.scene.stop('UpgradeScene');
    EventBus.off(GameEvents.EnemyKilled, this.onEnemyKilled, this);
    EventBus.off(GameEvents.PlayerDied, this.onPlayerDied, this);
  }
}
