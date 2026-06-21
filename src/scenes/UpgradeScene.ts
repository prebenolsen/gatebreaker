import Phaser from 'phaser';
import { Balance } from '../config/balance';
import { UpgradePanel } from '../ui/UpgradePanel';
import { upgrades } from '../systems/UpgradeSystem';
import type { Player } from '../entities/Player';

/**
 * Overlay scene for buying upgrades with coins (placeholder economy). Opened and
 * closed by the player stepping on/off the upgrade platform (see LevelScene) — it
 * has no hotkey of its own. Purchasing immediately re-applies the player's stats.
 */
export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0).setDepth(200);
    const panelX = width / 2 - 230;
    const panelY = 120;

    this.add
      .text(width / 2, 70, 'Upgrades', {
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(201);

    this.add
      .text(width / 2, 104, 'Step off the platform to close — costs/effects are placeholders', {
        fontSize: '13px',
        color: '#9fb0c8',
      })
      .setOrigin(0.5)
      .setDepth(201);

    new UpgradePanel(this, panelX, panelY, () => this.applyStats());
  }

  /** Re-apply upgraded stats to the live player (if a level is active). */
  private applyStats(): void {
    const player = this.registry.get('player') as Player | undefined;
    player?.setStats(upgrades.applyTo(Balance.player.base));
  }
}
