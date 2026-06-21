import Phaser from 'phaser';
import { Balance } from '../config/balance';
import { FUN_FACTS } from '../config/funFacts';

/**
 * Periodically shows a fun, unrelated fact while the player farms. Purely
 * cosmetic — scheduled on a randomized timer and faded in/out. Cadence comes
 * from balance.funText.
 */
export class FunTextDisplay {
  private label: Phaser.GameObjects.Text;
  private timer?: Phaser.Time.TimerEvent;

  constructor(private scene: Phaser.Scene) {
    const { width, height } = scene.scale;
    this.label = scene.add
      .text(width / 2, height - 56, '', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 14, y: 8 },
        align: 'center',
        wordWrap: { width: width * 0.7 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(120)
      .setAlpha(0);

    this.scheduleNext();
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.timer?.remove());
  }

  private scheduleNext(): void {
    const { minIntervalMs, maxIntervalMs } = Balance.funText;
    const delay = Phaser.Math.Between(minIntervalMs, maxIntervalMs);
    this.timer = this.scene.time.delayedCall(delay, () => this.show());
  }

  private show(): void {
    const fact = FUN_FACTS[Phaser.Math.Between(0, FUN_FACTS.length - 1)];
    this.label.setText(`💡 ${fact}`);
    this.scene.tweens.add({
      targets: this.label,
      alpha: 1,
      duration: 400,
      yoyo: true,
      hold: Balance.funText.durationMs,
      onComplete: () => this.scheduleNext(),
    });
  }
}
