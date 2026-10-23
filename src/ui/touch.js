import { SCREEN } from '../config.js';
import { THEME, textStyle } from '../render/theme.js';

const DEPTH = 20000;
const STICK = { radius: 64, knob: 30, deadZone: 16 }; // deadZone: desplazamiento mínimo para moverse
const BUTTON_RADIUS = 58;

// Controles táctiles de la carrera, en el panel debajo de la vista (de SCREEN.raceHeight al final).
// Mitad izquierda de la pantalla: joystick lateral que aparece donde se apoya el dedo.
// Mitad derecha: el toque va al botón más cercano, «Acelerar» (mantener) o «Saltar» (tocar).
export function createTouchControls(scene) {
  scene.input.addPointer(2); // joystick, acelerar y saltar a la vez
  const top = SCREEN.raceHeight, h = SCREEN.height - top;
  const add = (o) => o.setScrollFactor(0).setDepth(DEPTH);
  add(scene.add.rectangle(0, top, SCREEN.width, SCREEN.height, THEME.background).setOrigin(0)); // sobra hacia abajo: tapa el último píxel
  add(scene.add.rectangle(0, top, SCREEN.width, 3, THEME.ink).setOrigin(0));

  const home = { x: SCREEN.width * 0.25, y: top + h / 2 };
  const base = add(scene.add.circle(home.x, home.y, STICK.radius, THEME.white).setStrokeStyle(THEME.stroke, THEME.ink));
  const knob = add(scene.add.circle(home.x, home.y, STICK.knob, THEME.ink));
  const accelerate = button(scene, add, SCREEN.width * 0.62, home.y + 30, 'Acelerar');
  const jump = button(scene, add, SCREEN.width * 0.86, home.y - 30, 'Saltar');

  let stickId = null, accelerateId = null, jumped = false, dx = 0;
  const placeStick = (x, y) => {
    base.setPosition(x, y);
    knob.setPosition(x + dx, y);
  };

  scene.input.on('pointerdown', (p) => {
    if (p.x < SCREEN.width / 2) {
      stickId = p.id;
      placeStick(p.x, p.y);
    } else if (Math.hypot(p.x - jump.x, p.y - jump.y) < Math.hypot(p.x - accelerate.x, p.y - accelerate.y)) {
      jumped = true;
      jump.flash();
    } else {
      accelerateId = p.id;
      accelerate.setPressed(true);
    }
  });
  scene.input.on('pointermove', (p) => {
    if (p.id !== stickId) return;
    dx = Math.max(-STICK.radius, Math.min(STICK.radius, p.x - base.x));
    knob.setX(base.x + dx);
  });
  // pointerupoutside: el dedo se levantó fuera del lienzo.
  const release = (p) => {
    if (p.id === stickId) {
      stickId = null;
      dx = 0;
      placeStick(home.x, home.y);
    }
    if (p.id === accelerateId) {
      accelerateId = null;
      accelerate.setPressed(false);
    }
  };
  scene.input.on('pointerup', release);
  scene.input.on('pointerupoutside', release);

  // Misma forma que la entrada de teclado; el salto cuenta una vez por toque.
  return {
    read() {
      const input = { left: dx < -STICK.deadZone, right: dx > STICK.deadZone, accelerate: accelerateId !== null, jump: jumped };
      jumped = false;
      return input;
    },
  };
}

function button(scene, add, x, y, label) {
  const circle = add(scene.add.circle(x, y, BUTTON_RADIUS, THEME.white).setStrokeStyle(THEME.stroke, THEME.ink));
  const text = add(scene.add.text(x, y, label, textStyle(18)).setOrigin(0.5));
  const setPressed = (pressed) => {
    circle.setFillStyle(pressed ? THEME.ink : THEME.white);
    text.setColor(pressed ? '#ffffff' : '#1a1a1a');
  };
  const flash = () => {
    setPressed(true);
    scene.time.delayedCall(150, () => setPressed(false));
  };
  return { x, y, setPressed, flash };
}
