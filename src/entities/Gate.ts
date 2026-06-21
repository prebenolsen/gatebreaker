import Phaser from 'phaser';
import type { GateSpawn } from '../data/levels/types';

const WIDTH = 46;
const HEIGHT = 90;

/**
 * A gate to another level. Locked (🔒) until its required camp is cleared, then
 * open (🚪). LevelScene transitions when the player overlaps an unlocked gate.
 * Rendering only; unlock state is set by the scene from WorldState.
 */
export class Gate extends Phaser.GameObjects.Container {
  readonly spawn: GateSpawn;
  unlocked: boolean;

  private frame: Phaser.GameObjects.Rectangle;
  private icon: Phaser.GameObjects.Text;
  private caption: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, spawn: GateSpawn, unlocked: boolean) {
    super(scene, spawn.x, spawn.y);
    this.spawn = spawn;
    this.unlocked = unlocked;

    this.frame = scene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x3a2f4a).setStrokeStyle(3, 0xb39ddb);
    this.icon = scene.add.text(0, -6, '🔒', { fontSize: '26px' }).setOrigin(0.5);
    this.caption = scene.add
      .text(0, HEIGHT / 2 + 12, spawn.label, {
        fontSize: '13px',
        color: '#e0d7f5',
        align: 'center',
        wordWrap: { width: 140 },
      })
      .setOrigin(0.5, 0);

    this.add([this.frame, this.icon, this.caption]);
    this.setDepth(6);
    scene.add.existing(this);
    this.refresh();
  }

  setUnlocked(unlocked: boolean): void {
    this.unlocked = unlocked;
    this.refresh();
  }

  /** Whether this gate can actually take the player somewhere. */
  get isUsable(): boolean {
    return this.unlocked && this.spawn.targetLevelId !== '';
  }

  private refresh(): void {
    this.icon.setText(this.unlocked ? '🚪' : '🔒');
    this.frame.setStrokeStyle(3, this.unlocked ? 0x9ccc65 : 0xb39ddb);
  }
}
