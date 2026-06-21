import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';

// Entry point: boot the Phaser game.
const game = new Phaser.Game(gameConfig);

// Expose a debug handle for inspection/automation in dev (harmless in prod).
(window as unknown as { __gatebreaker?: Phaser.Game }).__gatebreaker = game;
