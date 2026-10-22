import Phaser from 'phaser';
import { preloadAssets, createRiderTextures } from '../render/assets.js';

// Carga las ilustraciones y prepara las texturas del jugador antes del menú.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    preloadAssets(this);
  }

  create() {
    createRiderTextures(this).then(() => this.scene.start('MenuScene'));
  }
}
