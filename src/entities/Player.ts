import Phaser from 'phaser';
import { DamageType, type PlayerStats } from '../core/types';
import { Balance } from '../config/balance';
import { EventBus, GameEvents } from '../core/EventBus';

const RADIUS = 18;

/**
 * The player entity: state + placeholder rendering (a circle + emoji + health bar).
 * Behavior lives in the systems; the player only knows how to draw itself, take
 * damage, and regen. Stats come from balance + upgrades (set via setStats()).
 */
export class Player extends Phaser.GameObjects.Container {
  stats: PlayerStats;
  health: number;
  /** Timestamp (ms) of the last time the player was hit — drives out-of-combat regen. */
  lastCombatTime = -Infinity;
  /** Attack cooldown accumulator (seconds), managed by CombatSystem. */
  attackTimer = 0;

  private shape: Phaser.GameObjects.Arc;
  private bars: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, stats: PlayerStats) {
    super(scene, x, y);
    this.stats = stats;
    this.health = stats.maxHealth;

    this.shape = scene.add.circle(0, 0, RADIUS, 0x4fd1ff).setStrokeStyle(2, 0xffffff);
    const face = scene.add.text(0, 0, '🧙', { fontSize: '22px' }).setOrigin(0.5);
    this.bars = scene.add.graphics();

    this.add([this.shape, face, this.bars]);
    this.setDepth(10);
    scene.add.existing(this);
    this.redrawBars();
  }

  /** Re-apply stats (e.g. after an upgrade). Keeps current health ratio. */
  setStats(stats: PlayerStats): void {
    const ratio = this.health / this.stats.maxHealth;
    this.stats = stats;
    this.health = Math.min(stats.maxHealth, Math.max(1, ratio * stats.maxHealth));
    this.redrawBars();
  }

  takeDamage(amount: number, type: DamageType, now: number): void {
    const reduction = type === DamageType.Physical ? this.stats.armor : this.stats.magicResist;
    const dmg = Math.max(Balance.combat.minDamage, amount - reduction);
    this.health = Math.max(0, this.health - dmg);
    this.lastCombatTime = now;
    this.redrawBars();
    this.flash(0xff5555);
    this.emitHealth();
    if (this.health <= 0) EventBus.emit(GameEvents.PlayerDied);
  }

  heal(amount: number): void {
    if (this.health >= this.stats.maxHealth) return;
    this.health = Math.min(this.stats.maxHealth, this.health + amount);
    this.redrawBars();
    this.emitHealth();
  }

  /** True if hit within the out-of-combat regen delay. */
  isInCombat(now: number): boolean {
    return now - this.lastCombatTime < Balance.player.regen.outOfCombatDelay;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  /** Reset for a respawn / new level. */
  revive(x: number, y: number): void {
    this.setPosition(x, y);
    this.health = this.stats.maxHealth;
    this.lastCombatTime = -Infinity;
    this.redrawBars();
    this.emitHealth();
  }

  private emitHealth(): void {
    EventBus.emit(GameEvents.PlayerHealthChanged, {
      health: this.health,
      maxHealth: this.stats.maxHealth,
    });
  }

  private flash(color: number): void {
    this.shape.setFillStyle(color);
    this.scene.time.delayedCall(90, () => this.shape.setFillStyle(0x4fd1ff));
  }

  private redrawBars(): void {
    const w = 44;
    const h = 6;
    const x = -w / 2;
    const y = -RADIUS - 14;
    const pct = Phaser.Math.Clamp(this.health / this.stats.maxHealth, 0, 1);
    this.bars.clear();
    this.bars.fillStyle(0x000000, 0.6).fillRect(x - 1, y - 1, w + 2, h + 2);
    this.bars.fillStyle(0x39d353, 1).fillRect(x, y, w * pct, h);
  }
}
