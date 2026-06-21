import Phaser from 'phaser';
import { Balance } from '../config/balance';
import type { LevelContext } from './LevelContext';
import { VirtualJoystick } from './VirtualJoystick';

const EDGE_MARGIN = 20;

/**
 * MANUAL player movement. The player is driven by the keyboard (WASD / arrow
 * keys) AND a touch/mouse virtual joystick (hold anywhere to steer). The game
 * does NOT auto-walk. Combat and gathering trigger automatically by proximity
 * once the player walks close to an enemy or resource.
 *
 * Also resolves "personal space": the player can't pass through enemies or
 * resource nodes (a slight overlap is allowed).
 */
export class MovementSystem {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: Record<string, Phaser.Input.Keyboard.Key>;
  private joystick: VirtualJoystick;

  constructor(
    scene: Phaser.Scene,
    private ctx: LevelContext,
    private bounds: { width: number; height: number },
  ) {
    const kb = scene.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = kb.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
    this.joystick = new VirtualJoystick(scene);
  }

  update(dt: number): void {
    const { player } = this.ctx;
    if (!player.isAlive()) return;

    // Combine keyboard (±1 per axis) and joystick (0..1) input.
    let vx = 0;
    let vy = 0;
    if (this.left()) vx -= 1;
    if (this.right()) vx += 1;
    if (this.up()) vy -= 1;
    if (this.down()) vy += 1;
    const j = this.joystick.get();
    vx += j.x;
    vy += j.y;

    const len = Math.hypot(vx, vy);
    if (len > 1e-3) {
      const scale = Math.min(len, 1); // partial joystick tilt → slower
      const step = player.stats.moveSpeed * dt * scale;
      player.setPosition(player.x + (vx / len) * step, player.y + (vy / len) * step);
    }

    this.resolveCollisions();
    this.clampToBounds();
  }

  /** Push the player out of any entity it has penetrated (personal space). */
  private resolveCollisions(): void {
    const { player, enemies, resources } = this.ctx;
    const c = Balance.collision;
    for (let iter = 0; iter < 2; iter++) {
      for (const e of enemies) {
        if (e.isAlive()) {
          this.separate(e.x, e.y, c.playerRadius + c.enemyRadius - c.allowedOverlap);
        }
      }
      for (const n of resources) {
        if (n.isAvailable) {
          this.separate(n.x, n.y, c.playerRadius + c.resourceRadius - c.allowedOverlap);
        }
      }
    }
  }

  private separate(bx: number, by: number, minDist: number): void {
    const { player } = this.ctx;
    const dx = player.x - bx;
    const dy = player.y - by;
    const d = Math.hypot(dx, dy);
    if (d === 0) {
      player.setPosition(player.x + minDist, player.y);
    } else if (d < minDist) {
      const k = (minDist - d) / d;
      player.setPosition(player.x + dx * k, player.y + dy * k);
    }
  }

  private clampToBounds(): void {
    const { player } = this.ctx;
    player.setPosition(
      Phaser.Math.Clamp(player.x, EDGE_MARGIN, this.bounds.width - EDGE_MARGIN),
      Phaser.Math.Clamp(player.y, EDGE_MARGIN, this.bounds.height - EDGE_MARGIN),
    );
  }

  private left(): boolean {
    return this.cursors.left.isDown || this.wasd.A.isDown;
  }
  private right(): boolean {
    return this.cursors.right.isDown || this.wasd.D.isDown;
  }
  private up(): boolean {
    return this.cursors.up.isDown || this.wasd.W.isDown;
  }
  private down(): boolean {
    return this.cursors.down.isDown || this.wasd.S.isDown;
  }
}
