import { Balance } from '../config/balance';
import { distance, nearest } from '../core/math';
import { RESOURCES } from '../data/resources';
import type { LevelContext } from './LevelContext';
import { inventory } from './InventorySystem';

/**
 * Auto-gathering. When the player stands within gatherRange of an available node,
 * progress accrues (scaled by gatherSpeed). On completion the node yields into the
 * inventory and starts its respawn timer. Depleted nodes tick back to life.
 */
export class GatheringSystem {
  constructor(private ctx: LevelContext) {}

  update(dt: number): void {
    const { player, resources } = this.ctx;

    // Tick respawns for depleted nodes (the node animates its respawn ring).
    for (const node of resources) {
      if (!node.isAvailable) node.tickRespawn(dt * 1000);
    }

    if (!player.isAlive()) return;

    // Gather the nearest in-range available node.
    const open = resources.filter((n) => n.isAvailable);
    const node = nearest(player.x, player.y, open, Balance.player.gatherRange, (n) => ({
      x: n.x,
      y: n.y,
    }));
    if (!node) return;

    // Guard: only gather if actually within range (nearest already enforces this).
    if (distance(player.x, player.y, node.x, node.y) > Balance.player.gatherRange) return;

    const def = RESOURCES[node.type];
    const ratePerSecond = player.stats.gatherSpeed / def.gatherSeconds;
    node.setProgress(node.progress + ratePerSecond * dt);

    if (node.progress >= 1) {
      const yieldAmount = Math.max(
        1,
        Math.round(Balance.resources.defaultYield * (1 + player.stats.resourceBonus)),
      );
      inventory.add(node.type, yieldAmount);
      node.deplete(def.respawnSeconds * 1000);
    }
  }
}
