import { Balance } from '../config/balance';
import { distance, moveToward } from '../core/math';
import type { Enemy } from '../entities/Enemy';
import type { LevelContext } from './LevelContext';

/**
 * Enemy aggro + leashing. The moment the player enters a camp's guarded ZONE
 * (zoneRadius around the enemy's anchor), the enemy engages IMMEDIATELY and
 * chases at a speed slightly above the player's current move speed — so it can
 * always catch up. If the player leaves the zone, the enemy STOPS, RETURNS home,
 * and FAST-REGENS, never following indefinitely.
 */
export class AggroSystem {
  constructor(private ctx: LevelContext) {}

  update(dt: number): void {
    const { player } = this.ctx;
    const { zoneRadius } = Balance.enemy;
    const chaseSpeed = player.stats.moveSpeed * Balance.enemy.speedFactorVsPlayer;

    for (const enemy of this.ctx.enemies) {
      if (!enemy.isAlive()) continue;

      const distFromHome = distance(enemy.x, enemy.y, enemy.anchor.x, enemy.anchor.y);
      const playerInZone =
        player.isAlive() &&
        distance(enemy.anchor.x, enemy.anchor.y, player.x, player.y) <= zoneRadius;

      // Decide state. Entering the zone engages immediately; leaving it returns.
      if (playerInZone) {
        enemy.state = 'chasing';
      } else if (enemy.state === 'chasing') {
        enemy.state = 'returning';
      } else if (enemy.state !== 'returning') {
        enemy.state = 'idle';
      }

      // Act on state.
      switch (enemy.state) {
        case 'chasing':
          this.stepToward(enemy, player.x, player.y, chaseSpeed * dt);
          break;
        case 'returning':
          this.stepToward(enemy, enemy.anchor.x, enemy.anchor.y, chaseSpeed * dt);
          enemy.heal(Balance.enemy.returnRegenPerSecond * dt);
          if (distFromHome <= 1) {
            enemy.setPosition(enemy.anchor.x, enemy.anchor.y);
            enemy.state = 'idle';
          }
          break;
        case 'idle':
          if (!enemy.isFullHealth()) enemy.heal(Balance.enemy.idleRegenPerSecond * dt);
          break;
      }
    }
  }

  private stepToward(enemy: Enemy, tx: number, ty: number, step: number): void {
    const next = moveToward(enemy.x, enemy.y, tx, ty, step);
    enemy.setPosition(next.x, next.y);
  }
}
