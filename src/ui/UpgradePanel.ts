import Phaser from 'phaser';
import { UPGRADES } from '../data/upgrades';
import { RESOURCES } from '../data/resources';
import { upgrades } from '../systems/UpgradeSystem';

/**
 * Builds the interactive upgrade list for the UpgradeScene. Each row shows the
 * upgrade, current level, and next cost, with a clickable Buy button. Costs and
 * effects are placeholders (data/upgrades.ts).
 */
export class UpgradePanel {
  private rows: Phaser.GameObjects.Container[] = [];

  constructor(
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
    private onChange: () => void,
  ) {
    this.build();
  }

  refresh(): void {
    this.rows.forEach((r) => r.destroy());
    this.rows = [];
    this.build();
  }

  private build(): void {
    const rowHeight = 64;
    UPGRADES.forEach((def, i) => {
      const ry = this.y + i * rowHeight;
      const container = this.scene.add.container(this.x, ry).setDepth(201);

      const level = upgrades.getLevel(def.id);
      const maxed = upgrades.isMaxed(def);
      const cost = upgrades.nextCost(def);
      const res = RESOURCES[def.cost.type];
      const affordable = upgrades.canAfford(def);

      const bg = this.scene.add
        .rectangle(0, 0, 460, rowHeight - 10, 0x1c2230)
        .setOrigin(0, 0)
        .setStrokeStyle(1, 0x33405a);

      const title = this.scene.add.text(12, 8, `${def.label}  (Lv ${level}/${def.maxLevel})`, {
        fontSize: '15px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      const desc = this.scene.add.text(12, 30, def.description, {
        fontSize: '12px',
        color: '#9fb0c8',
      });

      const buy = this.scene.add
        .text(340, 14, maxed ? 'MAX' : `Buy ${cost} ${res.emoji}`, {
          fontSize: '14px',
          color: maxed ? '#888' : affordable ? '#0d1117' : '#ffb4b4',
          backgroundColor: maxed ? '#333' : affordable ? '#39d353' : '#5a2730',
          padding: { x: 12, y: 8 },
        })
        .setOrigin(0, 0);

      if (!maxed) {
        buy.setInteractive({ useHandCursor: true });
        buy.on('pointerdown', () => {
          if (upgrades.purchase(def.id)) {
            this.refresh();
            this.onChange();
          }
        });
      }

      container.add([bg, title, desc, buy]);
      this.rows.push(container);
    });
  }
}
