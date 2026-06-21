import Phaser from 'phaser';
import { Balance } from './balance';
import { BootScene } from '../scenes/BootScene';
import { LevelScene } from '../scenes/LevelScene';
import { UIScene } from '../scenes/UIScene';
import { UpgradeScene } from '../scenes/UpgradeScene';

// Phaser game configuration. Scenes are registered here; BootScene runs first.
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#0e0e14',
  width: Balance.world.width,
  height: Balance.world.height,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // No Arcade physics needed — movement/collision are handled by our systems.
  scene: [BootScene, LevelScene, UIScene, UpgradeScene],
};

// This is an always-running auto/idle game — keep the loop alive when the tab
// loses focus instead of hard-pausing. `disableVisibilityChange` is a valid
// runtime option but is missing from Phaser's GameConfig typings.
(gameConfig as Phaser.Types.Core.GameConfig & { disableVisibilityChange?: boolean })
  .disableVisibilityChange = true;
