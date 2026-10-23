import Phaser from 'phaser';
import { SCREEN } from '../config.js';
import { outlinedStyle } from '../render/theme.js';
import { keyHints } from '../render/ui.js';
import { createMenu } from '../ui/menu.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const cx = SCREEN.width / 2;
    this.add.text(cx, 90, 'SNOWBOARD', outlinedStyle(72)).setOrigin(0.5);
    this.add.image(150, 340, 'config-1');
    this.add.image(SCREEN.width - 150, 340, 'config-2');
    createMenu(this, cx - 140, 210, [
      { label: '1 jugador', action: () => this.scene.start('SetupScene', { mode: 1 }) },
      { label: '2 jugadores', action: () => this.scene.start('SetupScene', { mode: 2 }) },
      { label: 'Top 10', action: () => this.scene.start('TopScene') },
    ]);
    keyHints(this, cx, SCREEN.height - 56, [['Flechas', 'elegir'], ['Enter', 'aceptar'], ['F', 'pantalla completa']]);
  }
}
