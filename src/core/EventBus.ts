import Phaser from 'phaser';
import type { ResourceType } from './types';

// A single decoupled pub/sub bus so systems, scenes, and UI never hold hard
// references to each other. Combat emits, the HUD listens, etc.
export const EventBus = new Phaser.Events.EventEmitter();

export const GameEvents = {
  ResourceGathered: 'resource:gathered',
  InventoryChanged: 'inventory:changed',
  WalletChanged: 'wallet:changed',
  EnemyKilled: 'enemy:killed',
  CampCleared: 'camp:cleared',
  PlayerHealthChanged: 'player:health-changed',
  PlayerDied: 'player:died',
  LevelChanged: 'level:changed',
  UpgradePurchased: 'upgrade:purchased',
  /** Generic transient HUD message (e.g. a sale summary). */
  Notice: 'ui:notice',
} as const;

// ── Event payload shapes (documentation + type help for listeners) ───────────
export interface ResourceGatheredPayload {
  type: ResourceType;
  amount: number;
}
export interface EnemyKilledPayload {
  enemyId: string;
  campId: string;
}
export interface CampClearedPayload {
  campId: string;
}
export interface PlayerHealthPayload {
  health: number;
  maxHealth: number;
}
export interface LevelChangedPayload {
  levelId: string;
  levelIndex: number;
}
export interface NoticePayload {
  message: string;
}
