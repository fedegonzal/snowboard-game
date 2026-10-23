import Phaser from 'phaser';
import { SCREEN, MOBILE } from '../config.js';
import { outlinedStyle } from '../render/theme.js';
import { keyHints, centerContent } from '../render/ui.js';
import { createMenu } from '../ui/menu.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    centerContent(this);
    const cx = SCREEN.width / 2;
    this.add.text(cx, 90, 'SNOWBOARD', outlinedStyle(72)).setOrigin(0.5);
    // En el celular las ilustraciones van debajo del menú y solo juega una persona.
    const art = MOBILE ? { y: 460, dx: 100 } : { y: 340, dx: cx - 150 };
    this.add.image(cx - art.dx, art.y, 'config-1');
    this.add.image(cx + art.dx, art.y, 'config-2');
    const play = (mode) => () => this.scene.start('SetupScene', { mode });
    const modes = MOBILE
      ? [{ label: 'Jugar', action: play(1) }]
      : [{ label: '1 jugador', action: play(1) }, { label: '2 jugadores', action: play(2) }];
    createMenu(this, cx - 140, 210, [
      ...modes,
      { label: 'Top 10', action: () => this.scene.start('TopScene', {}) }, // {} borra el resultado de una visita anterior
    ]);
    if (!MOBILE) keyHints(this, cx, SCREEN.height - 56, [['Flechas', 'elegir'], ['Enter', 'aceptar'], ['F', 'pantalla completa']]);
  }
}
