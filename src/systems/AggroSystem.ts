import { Balance } from '../config/balance';
import { distance, moveToward } from '../core/math';
import type { LevelContext } from './LevelContext';

/**
 * Enemy chase AI. Every living enemy on the map ALWAYS runs toward the player —
 * there are no guarded zones and no leashing back home. They keep chasing at a
 * speed slightly above the player's current move speed so they can always catch up.
 *
 * Crucially, an enemy STOPS at a personal-space "stand-off" distance (the moment
 * its body would touch the player's). That keeps it close enough to attack while
 * never overlapping the player — so an enemy can never shove or push the player
 * around. CombatSystem handles the actual attacks once the enemy is in range.
 */
export class AggroSystem {
  constructor(private ctx: LevelContext) {}

  update(dt: number): void {
    const { player } = this.ctx;
    const chaseSpeed = player.stats.moveSpeed * Balance.enemy.speedFactorVsPlayer;
    // Stop just as the two bodies touch: in attack range, but no overlap — so the
    // player-vs-enemy separation in MovementSystem is never triggered by an enemy.
    const standoff = Balance.collision.playerRadius + Balance.collision.enemyRadius;

    for (const enemy of this.ctx.enemies) {
      if (!enemy.isAlive()) continue;

      // No one to chase: hold position.
      if (!player.isAlive()) {
        enemy.state = 'idle';
        continue;
      }

      enemy.state = 'chasing';
      const dist = distance(enemy.x, enemy.y, player.x, player.y);
      // Cap the step so the enemy settles at the stand-off ring instead of pushing in.
      const step = Math.min(chaseSpeed * dt, dist - standoff);
      if (step > 0) {
        const next = moveToward(enemy.x, enemy.y, player.x, player.y, step);
        enemy.setPosition(next.x, next.y);
      }
    }
  }
}
