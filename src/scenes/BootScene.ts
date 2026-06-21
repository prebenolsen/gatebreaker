import Phaser from 'phaser';
import { FIRST_LEVEL_ID } from '../data/levels';
import { getHighscoreService } from '../services';

/**
 * Boot: no heavy assets (we use placeholder primitives). Initializes the
 * highscore service, launches the persistent UI overlay, then starts Level 1.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    // Pick highscore backend up front (Supabase if env vars present, else local).
    const svc = getHighscoreService();
    console.info(`[gatebreaker] highscore backend: ${svc.backend}`);

    // UIScene runs in parallel and persists across level changes.
    this.scene.launch('UIScene');
    this.scene.start('LevelScene', { levelId: FIRST_LEVEL_ID });
  }
}
