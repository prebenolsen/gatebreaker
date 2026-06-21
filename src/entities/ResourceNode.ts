import Phaser from 'phaser';
import { ResourceType } from '../core/types';
import { RESOURCES } from '../data/resources';

const SIZE = 30;
const RING_RADIUS = 23;
const RING_WIDTH = 6;

/**
 * A gatherable resource node: state + placeholder rendering. The node shows a
 * circular "loading" ring around the whole resource that FILLS as you gather
 * (the black ring is the empty track). While depleted, the same ring fills as
 * the respawn timer counts down. GatheringSystem drives progress/respawn.
 */
export class ResourceNode extends Phaser.GameObjects.Container {
  /** `type` overrides the base GameObject.type field (string). */
  override readonly type: ResourceType;
  /** Gather progress 0..1 toward the next yield. */
  progress = 0;
  /** Remaining respawn time in ms; >0 means depleted. */
  respawnRemaining = 0;
  private respawnTotal = 0;

  private box: Phaser.GameObjects.Rectangle;
  private icon: Phaser.GameObjects.Text;
  private ring: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, type: ResourceType) {
    super(scene, x, y);
    this.type = type;
    const def = RESOURCES[type];

    this.ring = scene.add.graphics();
    this.box = scene.add
      .rectangle(0, 0, SIZE, SIZE, def.color)
      .setStrokeStyle(2, 0x000000);
    this.icon = scene.add.text(0, 0, def.emoji, { fontSize: '20px' }).setOrigin(0.5);

    this.add([this.ring, this.box, this.icon]);
    this.setDepth(5);
    scene.add.existing(this);
    this.redraw();
  }

  get isAvailable(): boolean {
    return this.respawnRemaining <= 0;
  }

  /** Mark gathered: dim and start the respawn timer. */
  deplete(respawnMs: number): void {
    this.respawnRemaining = respawnMs;
    this.respawnTotal = respawnMs;
    this.progress = 0;
    this.box.setAlpha(0.18);
    this.icon.setAlpha(0.18);
    this.redraw();
  }

  respawn(): void {
    this.respawnRemaining = 0;
    this.respawnTotal = 0;
    this.progress = 0;
    this.box.setAlpha(1);
    this.icon.setAlpha(1);
    this.redraw();
  }

  /** Advance the respawn timer; returns true when it respawns this tick. */
  tickRespawn(dtMs: number): boolean {
    if (this.isAvailable) return false;
    this.respawnRemaining -= dtMs;
    if (this.respawnRemaining <= 0) {
      this.respawn();
      return true;
    }
    this.redraw();
    return false;
  }

  setProgress(p: number): void {
    this.progress = Phaser.Math.Clamp(p, 0, 1);
    this.redraw();
  }

  private redraw(): void {
    // Fraction + color depend on state: gathering (gold) vs respawning (blue).
    const filling = this.isAvailable;
    const frac = filling
      ? this.progress
      : this.respawnTotal > 0
        ? 1 - this.respawnRemaining / this.respawnTotal
        : 0;
    const fillColor = filling ? 0xffd166 : 0x6fa8dc;

    this.ring.clear();
    // Empty track (the "black component").
    this.ring.lineStyle(RING_WIDTH, 0x000000, 0.55);
    this.ring.beginPath();
    this.ring.arc(0, 0, RING_RADIUS, 0, Math.PI * 2);
    this.ring.strokePath();

    // Filled arc, clockwise from the top.
    if (frac > 0) {
      const start = -Math.PI / 2;
      this.ring.lineStyle(RING_WIDTH, fillColor, 1);
      this.ring.beginPath();
      this.ring.arc(0, 0, RING_RADIUS, start, start + Math.PI * 2 * frac);
      this.ring.strokePath();
    }
  }
}
