import Phaser from 'phaser';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import { SCREEN } from './config.js';
import { FONT, THEME, hex } from './render/theme.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { SetupScene } from './scenes/SetupScene.js';
import { RaceScene } from './scenes/RaceScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import { TopScene } from './scenes/TopScene.js';

// Phaser dibuja los textos en un canvas: la fuente debe estar cargada antes de empezar.
Promise.all([500, 600, 700].map((w) => document.fonts.load(`${w} 20px ${FONT}`))).then(() => {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: SCREEN.width,
    height: SCREEN.height,
    backgroundColor: hex(THEME.background),
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, MenuScene, SetupScene, RaceScene, ResultScene, TopScene],
  });
  // F alterna la pantalla completa, salvo en la preparación, donde se escribe el nombre.
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF' && !game.scene.isActive('SetupScene')) game.scale.toggleFullscreen();
  });
});
