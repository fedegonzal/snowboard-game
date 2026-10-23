import Phaser from 'phaser';
import { SCREEN, TOP, COLORS } from '../config.js';
import { loadTop } from '../game/leaderboard.js';
import { formatTime } from '../game/time.js';
import { THEME, outlinedStyle, textStyle } from '../render/theme.js';
import { card } from '../render/ui.js';
import { createMenu } from '../ui/menu.js';

export class TopScene extends Phaser.Scene {
  constructor() {
    super('TopScene');
  }

  // result: datos para ResultScene cuando se llega desde una carrera que entró al top 10.
  create({ result }) {
    const cx = SCREEN.width / 2;
    this.add.text(cx, 50, 'Top 10', outlinedStyle(48)).setOrigin(0.5);

    const w = 420, x = cx - w / 2, y = 96, rowH = 34;
    card(this, x, y, w, TOP.size * rowH + 28);
    const status = this.add.text(cx, y + 30, 'Cargando…', textStyle(20, { weight: 500, color: THEME.muted })).setOrigin(0.5, 0);
    let left = false;
    this.events.once('shutdown', () => (left = true));
    loadTop().then(
      (entries) => {
        if (left) return;
        status.destroy();
        this.drawRows(entries, result, x, y, w, rowH);
      },
      (err) => {
        console.error(err);
        if (!left) status.setText('No se pudo cargar el top 10.');
      },
    );

    const next = result
      ? { label: 'Continuar', action: () => this.scene.start('ResultScene', result) }
      : { label: 'Volver', action: () => this.scene.start('MenuScene') };
    createMenu(this, cx - 120, SCREEN.height - 76, [next], { width: 240 });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }

  drawRows(entries, result, x, y, w, rowH) {
    for (let i = 0; i < TOP.size; i++) {
      const e = entries[i];
      const rowY = y + 14 + i * rowH;
      const mine = i + 1 === result?.topPosition;
      if (mine) this.add.graphics().fillStyle(COLORS[result.players[0].jacket].value).fillRoundedRect(x + 14, rowY - 3, w - 28, rowH - 2, 12);
      const color = mine ? THEME.white : e ? THEME.ink : THEME.muted;
      this.add.text(x + 28, rowY, `${i + 1}.`, textStyle(20, { color: mine ? THEME.white : THEME.muted }));
      this.add.text(x + 72, rowY, e ? e.name : '—', textStyle(20, { weight: i < 3 && e ? 700 : 500, color }));
      this.add.text(x + w - 28, rowY, e ? formatTime(e.tenths) : '', textStyle(20, { color })).setOrigin(1, 0);
    }
  }
}
