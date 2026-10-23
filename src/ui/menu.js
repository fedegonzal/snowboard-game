import { button } from '../render/ui.js';

// Lista de botones navegable con ↑/↓ y Enter. options: [{ label, action }].
export function createMenu(scene, x, y, options, { width = 280, gap = 14 } = {}) {
  let selected = 0;
  const buttons = options.map((o, i) => button(scene, x, y + i * (52 + gap), width, o.label));

  const refresh = () => buttons.forEach((b, i) => b.setSelected(i === selected));

  const keyboard = scene.input.keyboard;
  keyboard.on('keydown-UP', () => {
    selected = (selected + options.length - 1) % options.length;
    refresh();
    scene.sound.play('select');
  });
  keyboard.on('keydown-DOWN', () => {
    selected = (selected + 1) % options.length;
    refresh();
    scene.sound.play('select');
  });
  keyboard.on('keydown-ENTER', () => {
    scene.sound.play('confirm');
    options[selected].action();
  });

  refresh();
  return buttons;
}
