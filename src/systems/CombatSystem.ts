import { Balance } from '../config/balance';
import { distance, nearest } from '../core/math';
import { EventBus, GameEvents } from '../core/EventBus';
import type { Enemy } from '../entities/Enemy';
import type { LevelContext } from './LevelContext';

/**
 * Auto-combat. When the player is within attackRange of an enemy, both sides
 * trade attacks on their own cooldowns. Dead enemies are removed and emit
 * EnemyKilled (used for camp-clearing / gate unlocking / scoring).
 */
export class CombatSystem {
  constructor(private ctx: LevelContext) {}

  update(dt: number, now: number): void {
    const { player } = this.ctx;
    if (!player.isAlive()) return;

    // ── Player attacks nearest enemy in range ────────────────────────────────
    const live = this.ctx.enemies.filter((e) => e.isAlive());
    const target = nearest(player.x, player.y, live, Balance.player.attackRange, (e) => ({
      x: e.x,
      y: e.y,
    }));

    player.attackTimer -= dt;
    if (target && player.attackTimer <= 0) {
      target.takeDamage(player.stats.damage);
      player.attackTimer = 1 / player.stats.attackSpeed;
      player.lastCombatTime = now; // attacking counts as in-combat (blocks regen)
      if (!target.isAlive()) this.killEnemy(target);
    }

    // ── Enemies that are engaged attack the player ───────────────────────────
    for (const enemy of this.ctx.enemies) {
      if (!enemy.isAlive()) continue;
      enemy.attackTimer -= dt;
      const inRange =
        distance(player.x, player.y, enemy.x, enemy.y) <= Balance.enemy.attackRange;
      const engaged = enemy.state === 'chasing';
      if (engaged && inRange && enemy.attackTimer <= 0) {
        player.takeDamage(enemy.def.damage, enemy.def.damageType, now);
        enemy.attackTimer = 1 / enemy.def.attackSpeed;
        if (!player.isAlive()) break;
      }
    }
  }

  private killEnemy(enemy: Enemy): void {
    // The enemy is now at 0 HP (isAlive() === false). We emit and let the scene,
    // which owns entity lifecycle, splice + destroy it and check camp clearing.
    EventBus.emit(GameEvents.EnemyKilled, { enemyId: enemy.def.id, campId: enemy.campId });
  }
}
