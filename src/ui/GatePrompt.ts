import Phaser from 'phaser';
import { distance } from '../core/math';
import type { LevelContext } from '../systems/LevelContext';

const SHOW_RANGE = 110;

/**
 * A small floating hint near the gate the player is standing by: tells them to
 * clear the camp (locked) or that the area is open (unlocked). Transitions
 * themselves are handled by LevelScene.
 */
export class GatePrompt {
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, private ctx: LevelContext) {
    this.label = scene.add
      .text(0, 0, '', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 8, y: 4 },
        align: 'center',
      })
      .setOrigin(0.5, 1)
      .setDepth(110)
      .setVisible(false);
  }

  update(): void {
    const { player, gates } = this.ctx;
    let shown = false;
    for (const gate of gates) {
      if (distance(player.x, player.y, gate.x, gate.y) > SHOW_RANGE) continue;
      if (gate.unlocked) {
        this.label.setText(gate.isUsable ? `Enter: ${gate.spawn.label}` : 'Coming soon');
      } else {
        this.label.setText('🔒 Clear the camp to unlock');
      }
      this.label.setPosition(gate.x, gate.y - 70).setVisible(true);
      shown = true;
      break;
    }
    if (!shown) this.label.setVisible(false);
  }
}
