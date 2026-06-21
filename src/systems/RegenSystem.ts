import { Balance } from '../config/balance';
import type { LevelContext } from './LevelContext';

/**
 * Player out-of-combat health regeneration. Once the player hasn't been hit (or
 * attacked) for `outOfCombatDelay`, health ticks back up.
 */
export class RegenSystem {
  constructor(private ctx: LevelContext) {}

  update(dt: number, now: number): void {
    const { player } = this.ctx;
    if (!player.isAlive()) return;
    if (player.isInCombat(now)) return;
    player.heal(Balance.player.regen.perSecond * dt);
  }
}
