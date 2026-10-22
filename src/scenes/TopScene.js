import Phaser from 'phaser';
import { SCREEN, TOP } from '../config.js';
import { loadTop } from '../game/leaderboard.js';
import { formatTime } from '../game/time.js';
import { THEME, outlinedStyle, textStyle } from '../render/theme.js';
import { card } from '../render/ui.js';
import { createMenu } from '../ui/menu.js';

export class TopScene extends Phaser.Scene {
  constructor() {
    super('TopScene');
  }

  create() {
    const cx = SCREEN.width / 2;
    this.add.text(cx, 50, 'Top 10', outlinedStyle(48)).setOrigin(0.5);

    const w = 420, x = cx - w / 2, y = 96, rowH = 34;
    card(this, x, y, w, TOP.size * rowH + 28);
    const entries = loadTop();
    for (let i = 0; i < TOP.size; i++) {
      const e = entries[i];
      const rowY = y + 14 + i * rowH;
      const color = e ? THEME.ink : THEME.muted;
      this.add.text(x + 28, rowY, `${i + 1}.`, textStyle(20, { color: THEME.muted }));
      this.add.text(x + 72, rowY, e ? e.name : '—', textStyle(20, { weight: i < 3 && e ? 700 : 500, color }));
      this.add.text(x + w - 28, rowY, e ? formatTime(e.tenths) : '', textStyle(20, { color })).setOrigin(1, 0);
    }

    createMenu(this, cx - 120, SCREEN.height - 76, [{ label: 'Volver', action: () => this.scene.start('MenuScene') }], { width: 240 });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
