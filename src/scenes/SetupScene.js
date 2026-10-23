import Phaser from 'phaser';
import { BOARDS, COLORS, NAME, SCREEN, MOBILE } from '../config.js';
import { THEME, textStyle } from '../render/theme.js';
import { riderTextureKey } from '../render/assets.js';
import { card, pill, selector, statBar, keyHints, centerContent } from '../render/ui.js';
import { createMenu } from '../ui/menu.js';

// Teclas de navegación por participante (KeyboardEvent.code).
const ARROWS = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
const WASD = { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' };

const NAME_CHAR = /^[\p{L}\p{N} _-]$/u;
const ROW_LABELS = { name: 'Nombre', helmet: 'Casco', jacket: 'Campera', board: 'Tabla' };
const OPTION_COUNT = { helmet: COLORS.length, jacket: COLORS.length, board: BOARDS.length };

export class SetupScene extends Phaser.Scene {
  constructor() {
    super('SetupScene');
  }

  init(data) {
    this.mode = data.mode;
    this.rows = this.mode === 1 ? ['name', 'helmet', 'jacket', 'board'] : ['helmet', 'jacket', 'board'];
    this.controls = this.mode === 1 ? [ARROWS] : [WASD, ARROWS];
    this.players = this.controls.map((_, i) => ({
      name: this.mode === 1 ? NAME.default : `Jugador ${i + 1}`,
      helmet: i,
      jacket: i + 1,
      board: 1,
    }));
    this.selectedRow = this.players.map(() => 0);
  }

  create() {
    centerContent(this);
    this.add.text(32, 20, 'Preparación', textStyle(36, { weight: 700 }));
    const cardW = this.mode === 1 ? Math.min(520, SCREEN.width - 32) : 432;
    const cardH = 440;
    const firstX = this.mode === 1 ? (SCREEN.width - cardW) / 2 : 32;
    this.views = this.players.map((_, i) => this.createCard(i, firstX + i * (cardW + 32), 80, cardW, cardH));
    // En el celular no hay teclado: se toca «Correr» o «Volver» debajo de la tarjeta.
    if (MOBILE) {
      createMenu(this, SCREEN.width / 2 - 140, 540, [
        { label: 'Correr', action: () => this.start() },
        { label: 'Volver', action: () => this.scene.start('MenuScene') },
      ]);
    } else {
      keyHints(this, SCREEN.width / 2, SCREEN.height - 52, [['Enter', 'correr'], ['Esc', 'volver']]);
    }

    this.input.keyboard.on('keydown', (e) => this.handleKey(e));
    this.refresh();
  }

  // Tarjeta de un participante: ilustración, vista previa y opciones.
  createCard(i, x, y, w, h) {
    card(this, x, y, w, h);
    const tag = pill(this, x + 16, y + 16, '', { fillAlpha: 1, color: 0xffffff });
    const preview = this.add.image(x + 100, y + 148, riderTextureKey(0, 0));

    const ox = x + 196, ow = w - 196 - 16;
    const keys = MOBILE ? 'Tocá una opción para cambiarla' : this.controls[i] === WASD ? 'Teclas: W A S D' : 'Teclas: flechas';
    this.add.text(ox, y + 18, keys, textStyle(13, { weight: 500, color: THEME.muted }));
    const selectors = this.rows.map((_, r) => selector(this, ox, y + 42 + r * 70, ow));
    // Tocar la mitad izquierda de un selector retrocede y la derecha avanza.
    selectors.forEach((s, r) => s.on('pointerup', (p, localX) => this.tap(i, r, localX < ow / 2 ? -1 : 1)));
    const statsY = y + 42 + this.rows.length * 70 + 4;
    const speed = statBar(this, ox, statsY, 'Velocidad', ow);
    const lateral = statBar(this, ox, statsY + 24, 'Lateral', ow);
    return { tag, preview, selectors, speed, lateral };
  }

  handleKey(e) {
    this.sound.play(e.code === 'Enter' ? 'confirm' : 'select');
    if (e.code === 'Enter') return this.start();
    if (e.code === 'Escape') return this.scene.start('MenuScene');

    this.controls.forEach((keys, i) => {
      const row = this.rows[this.selectedRow[i]];
      if (e.code === keys.up) this.selectedRow[i] = (this.selectedRow[i] + this.rows.length - 1) % this.rows.length;
      else if (e.code === keys.down) this.selectedRow[i] = (this.selectedRow[i] + 1) % this.rows.length;
      else if (row !== 'name' && e.code === keys.left) this.change(i, row, -1);
      else if (row !== 'name' && e.code === keys.right) this.change(i, row, 1);
      else if (row === 'name') this.editName(i, e);
    });
    this.refresh();
  }

  change(i, row, delta) {
    const n = OPTION_COUNT[row];
    this.players[i][row] = (this.players[i][row] + delta + n) % n;
  }

  editName(i, e) {
    const p = this.players[i];
    if (e.code === 'Backspace') p.name = p.name.slice(0, -1);
    else if (NAME_CHAR.test(e.key) && p.name.length < NAME.maxLength) p.name += e.key;
  }

  tap(i, r, delta) {
    this.sound.play('select');
    this.selectedRow[i] = r;
    const row = this.rows[r];
    if (row === 'name') this.promptName(i);
    else this.change(i, row, delta);
    this.refresh();
  }

  // Pide el nombre con el teclado del sistema (en el celular no hay teclado físico).
  promptName(i) {
    const p = this.players[i];
    const name = window.prompt('Nombre', p.name);
    if (name !== null) p.name = [...name].filter((c) => NAME_CHAR.test(c)).join('').slice(0, NAME.maxLength);
  }

  refresh() {
    this.players.forEach((p, i) => {
      const view = this.views[i];
      const tag = this.mode === 1 ? p.name.trim() || NAME.default : p.name;
      view.tag.setFill(COLORS[p.jacket].value).setLabel(tag);
      view.preview.setTexture(riderTextureKey(p.helmet, p.jacket));
      this.rows.forEach((row, r) => view.selectors[r].set({ ...this.describe(p, row), active: r === this.selectedRow[i] }));
      const board = BOARDS[p.board];
      view.speed.setLevel(board.speed);
      view.lateral.setLevel(board.lateral);
    });
  }

  describe(p, row) {
    const label = ROW_LABELS[row];
    if (row === 'name') return { label, value: `${p.name}_` };
    if (row === 'board') return { label, value: BOARDS[p.board].name };
    return { label, value: COLORS[p[row]].name, swatch: COLORS[p[row]].value };
  }

  start() {
    const players = this.players.map((p) => ({ ...p, name: p.name.trim() || NAME.default }));
    this.scene.start('RaceScene', { mode: this.mode, players });
  }
}
