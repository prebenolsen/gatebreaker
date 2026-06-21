import Phaser from 'phaser';
import type { EnemyDef, Vec2 } from '../core/types';

const RADIUS = 16;

export type EnemyState = 'idle' | 'chasing' | 'returning';

/**
 * An enemy entity: state + placeholder rendering. Its `anchor` is its home
 * position; AggroSystem leashes it back there when the player flees. CombatSystem
 * handles its attacks. The entity only draws itself and tracks its own numbers.
 */
export class Enemy extends Phaser.GameObjects.Container {
  readonly def: EnemyDef;
  readonly campId: string;
  readonly anchor: Vec2;

  health: number;
  /** `state` overrides the base GameObject.state field (string|number). */
  override state: EnemyState = 'idle';
  /** Attack cooldown accumulator (seconds), managed by CombatSystem. */
  attackTimer = 0;

  private shape: Phaser.GameObjects.Arc;
  private bars: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, def: EnemyDef, campId: string) {
    super(scene, x, y);
    this.def = def;
    this.campId = campId;
    this.anchor = { x, y };
    this.health = def.maxHealth;

    this.shape = scene.add.circle(0, 0, RADIUS, def.color).setStrokeStyle(2, 0x000000);
    const face = scene.add.text(0, 0, def.emoji, { fontSize: '20px' }).setOrigin(0.5);
    this.bars = scene.add.graphics();

    this.add([this.shape, face, this.bars]);
    this.setDepth(8);
    scene.add.existing(this);
    this.redrawBars();
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.redrawBars();
    this.flash();
  }

  heal(amount: number): void {
    if (this.health >= this.def.maxHealth) return;
    this.health = Math.min(this.def.maxHealth, this.health + amount);
    this.redrawBars();
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  isFullHealth(): boolean {
    return this.health >= this.def.maxHealth;
  }

  private flash(): void {
    this.shape.setStrokeStyle(2, 0xff5555);
    this.scene.time.delayedCall(90, () => this.shape.setStrokeStyle(2, 0x000000));
  }

  private redrawBars(): void {
    const w = 38;
    const h = 5;
    const x = -w / 2;
    const y = -RADIUS - 12;
    const pct = Phaser.Math.Clamp(this.health / this.def.maxHealth, 0, 1);
    this.bars.clear();
    this.bars.fillStyle(0x000000, 0.6).fillRect(x - 1, y - 1, w + 2, h + 2);
    this.bars.fillStyle(0xe5534b, 1).fillRect(x, y, w * pct, h);
  }
}
