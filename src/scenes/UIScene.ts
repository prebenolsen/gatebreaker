import Phaser from 'phaser';
import { Balance } from '../config/balance';
import { EventBus, GameEvents, type LevelChangedPayload } from '../core/EventBus';
import { HUD } from '../ui/HUD';
import { FunTextDisplay } from '../ui/FunTextDisplay';
import { getLevel } from '../data/levels';
import { inventory } from '../systems/InventorySystem';
import { world } from '../systems/WorldState';
import { getHighscoreService } from '../services';

/**
 * Persistent overlay scene: HUD, fun-text popups, and global hotkeys
 * ([U] upgrades, [H] submit score). Runs in parallel with LevelScene.
 */
export class UIScene extends Phaser.Scene {
  private hud!: HUD;
  private toast!: Phaser.GameObjects.Text;

  constructor() {
    super('UIScene');
  }

  create(): void {
    this.hud = new HUD(this);
    new FunTextDisplay(this);

    this.toast = this.add
      .text(this.scale.width / 2, 24, '', {
        fontSize: '15px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5, 0)
      .setDepth(130)
      .setAlpha(0);

    EventBus.on(GameEvents.LevelChanged, this.onLevelChanged, this);

    const kb = this.input.keyboard;
    kb?.on('keydown-U', () => this.toggleUpgrades());
    kb?.on('keydown-H', () => void this.submitScore());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off(GameEvents.LevelChanged, this.onLevelChanged, this);
    });
  }

  private onLevelChanged(p: LevelChangedPayload): void {
    const def = getLevel(p.levelId);
    this.hud.setLevelName(def ? `${def.name}  (Lv ${p.levelIndex + 1})` : p.levelId);
  }

  private toggleUpgrades(): void {
    if (this.scene.isActive('UpgradeScene')) {
      this.scene.stop('UpgradeScene');
    } else {
      this.scene.launch('UpgradeScene');
    }
  }

  private async submitScore(): Promise<void> {
    const score =
      inventory.total() * Balance.score.resourceWeight +
      world.maxLevelIndex * Balance.score.levelWeight;
    const name = window.prompt('Submit score — enter your name:', 'Player');
    if (name === null) return;
    const svc = getHighscoreService();
    try {
      await svc.submit({
        playerName: name || 'Anonymous',
        score,
        maxLevel: world.maxLevelIndex + 1,
        resourcesTotal: inventory.total(),
      });
      this.showToast(`Score ${score} submitted (${svc.backend}) ✔`);
    } catch (err) {
      console.error('[gatebreaker] score submit failed:', err);
      this.showToast('Score submit failed — see console');
    }
  }

  private showToast(message: string): void {
    this.toast.setText(message).setAlpha(1);
    this.tweens.add({ targets: this.toast, alpha: 0, delay: 2200, duration: 600 });
  }
}
