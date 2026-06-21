import type { Vec2 } from './types';

/** Euclidean distance between two points. */
export function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

/** Squared distance — cheaper when you only need to compare. */
export function distanceSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  return dx * dx + dy * dy;
}

/**
 * Step from (fromX,fromY) toward (toX,toY) by at most `maxStep` pixels.
 * Returns the new position; snaps to the target if within one step.
 */
export function moveToward(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  maxStep: number,
): Vec2 {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const d = Math.hypot(dx, dy);
  if (d <= maxStep || d === 0) return { x: toX, y: toY };
  const t = maxStep / d;
  return { x: fromX + dx * t, y: fromY + dy * t };
}

/**
 * Find the nearest item to (x,y) from a list, within `maxRange`.
 * `getPos` extracts the position from each item. Returns null if none in range.
 */
export function nearest<T>(
  x: number,
  y: number,
  items: readonly T[],
  maxRange: number,
  getPos: (item: T) => Vec2,
): T | null {
  let best: T | null = null;
  let bestSq = maxRange * maxRange;
  for (const item of items) {
    const p = getPos(item);
    const dsq = distanceSq(x, y, p.x, p.y);
    if (dsq <= bestSq) {
      bestSq = dsq;
      best = item;
    }
  }
  return best;
}
