import { SECTIONS, BOARDS } from '../config.js';

// Efectos generados por tools/generate-sounds.py.
const SOUNDS = ['slide', 'crash', 'jump', 'beep', 'go', 'section', 'finish', 'win', 'select', 'confirm'];
const STATE_SOUNDS = { fallen: 'crash', finished: 'finish' };
const MAX_SPEED = Math.max(...SECTIONS.map((s) => s.speed)) * Math.max(...BOARDS.map((b) => b.speed));
const SLIDE_VOLUME = 0.5;

export function preloadSounds(scene) {
  for (const key of SOUNDS) scene.load.audio(key, `assets/sounds/${key}.wav`);
}

// Sonidos de un participante: el deslizamiento sigue la velocidad y cada cambio de estado
// (caída, salto, nuevo tramo, llegada) dispara su efecto.
export function createRiderSounds(scene, rider) {
  const slide = scene.sound.add('slide', { loop: true, volume: 0 });
  slide.play();
  scene.events.once('shutdown', () => slide.destroy());
  let prev = { state: rider.state, section: rider.section, jumping: rider.jumping };

  return {
    update() {
      const ratio = rider.jumping ? 0 : rider.speed / MAX_SPEED;
      slide.setVolume(SLIDE_VOLUME * ratio).setRate(0.8 + 0.4 * ratio);
      if (rider.state !== prev.state && STATE_SOUNDS[rider.state]) scene.sound.play(STATE_SOUNDS[rider.state]);
      if (rider.section > prev.section) scene.sound.play('section');
      if (rider.jumping && !prev.jumping) scene.sound.play('jump');
      prev = { state: rider.state, section: rider.section, jumping: rider.jumping };
    },
  };
}
