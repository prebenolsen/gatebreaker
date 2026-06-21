import Phaser from 'phaser';
import { EventBus, GameEvents, type PlayerHealthPayload } from '../core/EventBus';
import { inventory } from '../systems/InventorySystem';
import { wallet } from '../systems/WalletSystem';
import { RESOURCES } from '../data/resources';
import { CURRENCIES } from '../data/currencies';

/**
 * Top-left heads-up display: player health bar, resource counts, coin purse,
 * current level, and a controls hint. Lives in the parallel UIScene and updates
 * via events.
 */
export class HUD {
  private healthText: Phaser.GameObjects.Text;
  private healthBar: Phaser.GameObjects.Graphics;
  private resourceText: Phaser.GameObjects.Text;
  private walletText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private health = 1;
  private maxHealth = 1;

  constructor(private scene: Phaser.Scene) {
    const panel = scene.add.graphics();
    panel.fillStyle(0x000000, 0.35).fillRoundedRect(10, 10, 340, 116, 8);
    panel.setScrollFactor(0).setDepth(100);

    this.levelText = scene.add
      .text(22, 18, '', { fontSize: '16px', color: '#ffffff', fontStyle: 'bold' })
      .setScrollFactor(0)
      .setDepth(101);

    this.healthBar = scene.add.graphics().setScrollFactor(0).setDepth(101);
    this.healthText = scene.add
      .text(22, 44, '', { fontSize: '13px', color: '#e8fce8' })
      .setScrollFactor(0)
      .setDepth(102);

    this.resourceText = scene.add
      .text(22, 74, '', { fontSize: '14px', color: '#ffe9b0', lineSpacing: 4 })
      .setScrollFactor(0)
      .setDepth(101);

    this.walletText = scene.add
      .text(22, 100, '', { fontSize: '14px', color: '#ffe9b0', lineSpacing: 4 })
      .setScrollFactor(0)
      .setDepth(101);

    EventBus.on(GameEvents.PlayerHealthChanged, this.onHealth, this);
    EventBus.on(GameEvents.InventoryChanged, this.refreshResources, this);
    EventBus.on(GameEvents.WalletChanged, this.refreshWallet, this);

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off(GameEvents.PlayerHealthChanged, this.onHealth, this);
      EventBus.off(GameEvents.InventoryChanged, this.refreshResources, this);
      EventBus.off(GameEvents.WalletChanged, this.refreshWallet, this);
    });

    this.refreshResources();
    this.refreshWallet();
    this.drawHealth();
  }

  setLevelName(name: string): void {
    this.levelText.setText(name);
  }

  private onHealth(p: PlayerHealthPayload): void {
    this.health = p.health;
    this.maxHealth = p.maxHealth;
    this.drawHealth();
  }

  private drawHealth(): void {
    const x = 22;
    const y = 46;
    const w = 200;
    const h = 14;
    const pct = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1);
    this.healthBar.clear();
    this.healthBar.fillStyle(0x222222, 1).fillRect(x, y, w, h);
    this.healthBar.fillStyle(0x39d353, 1).fillRect(x, y, w * pct, h);
    this.healthBar.lineStyle(1, 0x000000).strokeRect(x, y, w, h);
    this.healthText.setPosition(x + w + 8, y);
    this.healthText.setText(`${Math.ceil(this.health)} / ${Math.ceil(this.maxHealth)}`);
  }

  private refreshResources(): void {
    const parts = inventory
      .snapshot()
      .map((r) => `${RESOURCES[r.type].emoji} ${RESOURCES[r.type].label}: ${r.amount}`);
    this.resourceText.setText(parts.join('    '));
  }

  private refreshWallet(): void {
    const parts = wallet
      .snapshot()
      .map((c) => `${CURRENCIES[c.currency].emoji} ${c.amount}`);
    this.walletText.setText(parts.join('    '));
  }
}
