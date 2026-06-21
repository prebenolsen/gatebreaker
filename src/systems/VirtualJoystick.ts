import Phaser from 'phaser';

const DEAD_ZONE = 12; // px of slack before movement starts
const MAX_RANGE = 70; // px from origin for full speed

/**
 * Invisible on-screen joystick for touch/mouse. Press-and-hold ANYWHERE to set
 * the origin at the touch point; dragging from there yields a direction vector
 * whose magnitude (0..1) scales movement speed. Releasing stops movement.
 *
 * Exposes a vector consumed by MovementSystem; renders nothing (invisible).
 */
export class VirtualJoystick {
  private active = false;
  private origin = { x: 0, y: 0 };
  private vec = { x: 0, y: 0 };

  constructor(scene: Phaser.Scene) {
    const input = scene.input;
    input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    input.on(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    input.on(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onUp, this);

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
      input.off(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
      input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this);
      input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onUp, this);
    });
  }

  /** Current input vector; components in [-1, 1], length scales speed. */
  get(): { x: number; y: number } {
    return this.vec;
  }

  private onDown(pointer: Phaser.Input.Pointer): void {
    this.active = true;
    this.origin = { x: pointer.x, y: pointer.y };
    this.vec = { x: 0, y: 0 };
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (!this.active) return;
    const dx = pointer.x - this.origin.x;
    const dy = pointer.y - this.origin.y;
    const d = Math.hypot(dx, dy);
    if (d < DEAD_ZONE) {
      this.vec = { x: 0, y: 0 };
      return;
    }
    const mag = Math.min((d - DEAD_ZONE) / (MAX_RANGE - DEAD_ZONE), 1);
    this.vec = { x: (dx / d) * mag, y: (dy / d) * mag };
  }

  private onUp(): void {
    this.active = false;
    this.vec = { x: 0, y: 0 };
  }
}
