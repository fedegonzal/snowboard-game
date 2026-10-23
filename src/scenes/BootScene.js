import Phaser from 'phaser';
import { preloadAssets, createRiderTextures } from '../render/assets.js';
import { preloadSounds } from '../render/sounds.js';

// Carga las ilustraciones y los sonidos, y prepara las texturas del jugador antes del menú.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    preloadAssets(this);
    preloadSounds(this);
  }

  create() {
    createRiderTextures(this).then(() => this.scene.start('MenuScene'));
  }
}
