import Phaser from 'phaser';
import type { PlatformKind, PlatformSpawn } from '../data/levels/types';

const SIZE = 76;

/** Per-kind look (placeholder primitives). */
const LOOK: Record<PlatformKind, { fill: number; stroke: number; emoji: string; caption: string }> = {
  sell: { fill: 0x4a3a18, stroke: 0xffd166, emoji: '💰', caption: 'Sell' },
  upgrade: { fill: 0x1c3a3a, stroke: 0x4fd1ff, emoji: '⬆️', caption: 'Upgrades' },
};

/**
 * A floor platform the player walks onto — no key press. `sell` cashes in the
 * inventory; `upgrade` opens the upgrade menu while stood on. LevelScene detects
 * the overlap and drives the behavior; this is rendering + identity only.
 */
export class Platform extends Phaser.GameObjects.Container {
  readonly kind: PlatformKind;

  constructor(scene: Phaser.Scene, spawn: PlatformSpawn) {
    super(scene, spawn.x, spawn.y);
    this.kind = spawn.kind;
    const look = LOOK[spawn.kind];

    const pad = scene.add
      .rectangle(0, 0, SIZE, SIZE, look.fill, 0.9)
      .setStrokeStyle(3, look.stroke);
    const icon = scene.add.text(0, -6, look.emoji, { fontSize: '26px' }).setOrigin(0.5);
    const caption = scene.add
      .text(0, SIZE / 2 - 14, look.caption, {
        fontSize: '12px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add([pad, icon, caption]);
    this.setDepth(4);
    scene.add.existing(this);
  }
}
