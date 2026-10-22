import { COLORS } from '../config.js';
import { outlinedStyle } from './theme.js';
import { pill } from './ui.js';

const HUD_DEPTH = 10000;

// HUD de una vista de carrera: nombre (dos personas), tramo, cronómetro y mensaje central.
// Usa setScrollFactor(0): las posiciones son relativas a la cámara de la vista.
export function createHud(scene, width, height, { name = null, jacket = 0 } = {}) {
  const objects = [];
  let y = 16;
  if (name) {
    const tag = pill(scene, 16, y, name, { fill: COLORS[jacket].value, fillAlpha: 1, color: 0xffffff });
    objects.push(tag);
    y += tag.height + 8;
  }
  const section = pill(scene, 16, y, '', { dot: 0 });
  const timer = pill(scene, 0, 16, '00:00,0', { size: 24 });
  const message = scene.add.text(width / 2, height * 0.42, '', outlinedStyle(56)).setOrigin(0.5).setAlign('center');
  objects.push(section, timer, message);
  objects.forEach((o) => o.setScrollFactor(0).setDepth(HUD_DEPTH));

  let current = { section: null, time: null, message: null };
  return {
    objects,
    update({ sectionName, sectionColor, time, text }) {
      if (current.section !== sectionName) section.setLabel(`Tramo ${sectionName.toLowerCase()}`).setDot(sectionColor);
      if (current.time !== time) timer.setLabel(time).setX(width - timer.width - 16);
      if (current.message !== text) message.setText(text);
      current = { section: sectionName, time, message: text };
    },
  };
}
