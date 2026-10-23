import Phaser from 'phaser';
import { SCREEN, COLORS } from '../config.js';
import { formatTime } from '../game/time.js';
import { outlinedStyle, textStyle } from '../render/theme.js';
import { card, pill } from '../render/ui.js';
import { createMenu } from '../ui/menu.js';

// data: { mode, players, results: [{ name, tenths }], topPosition, winner: 0 | 1 | 'tie' | null }
export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create(data) {
    const cx = SCREEN.width / 2;
    this.add.text(cx, 56, this.title(data), outlinedStyle(52)).setOrigin(0.5);

    const w = 460, x = cx - w / 2, y = 110, h = 250;
    card(this, x, y, w, h);
    if (this.showTrophy(data)) {
      this.add.image(x + 90, y + h / 2, 'trophy');
      this.sound.play('win');
    }

    const listX = this.showTrophy(data) ? x + 180 : x + 40;
    data.results.forEach((r, i) => {
      const rowY = y + 50 + i * 56;
      pill(this, listX, rowY, r.name, { fill: COLORS[data.players[i].jacket].value, fillAlpha: 1, color: 0xffffff });
      this.add.text(x + w - 32, rowY + 4, formatTime(r.tenths), textStyle(26)).setOrigin(1, 0);
    });
    this.add.text(listX, y + h - 60, this.summary(data), textStyle(18, { weight: 500, wordWrap: { width: x + w - 32 - listX } }));

    createMenu(this, cx - 140, 390, [
      { label: 'Revancha', action: () => this.scene.start('RaceScene', { mode: data.mode, players: data.players }) },
      { label: 'Menú', action: () => this.scene.start('MenuScene') },
    ]);
  }

  showTrophy({ mode, topPosition, winner }) {
    return mode === 1 ? topPosition !== null : winner !== 'tie';
  }

  title({ mode, results, winner }) {
    if (mode === 1) return '¡Llegada!';
    if (winner === 'tie') return '¡Empate!';
    return `¡Gana ${results[winner].name}!`;
  }

  summary({ mode, results, topPosition, winner }) {
    if (mode === 1) return topPosition ? `Entraste al top 10 en el puesto ${topPosition}.` : 'No entraste al top 10.';
    if (winner === 'tie') return 'Llegaron con el mismo tiempo en décimas.';
    return `${results[winner].name} cruzó primero la meta.`;
  }
}
