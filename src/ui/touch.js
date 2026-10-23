import { SCREEN } from '../config.js';
import { THEME } from '../render/theme.js';

const DEPTH = 20000;
const STICK = { radius: 64, knob: 30, deadZone: 16 }; // deadZone: desplazamiento mínimo para que cuente

// Controles táctiles de la carrera, en el panel debajo de la vista (de SCREEN.raceHeight al final).
// Dos joysticks que aparecen donde se apoya el dedo, uno por mitad de la pantalla:
// izquierdo, movimiento lateral; derecho, abajo acelera (mantener) y arriba salta (una vez por empujón).
export function createTouchControls(scene) {
  scene.input.addPointer(1); // un dedo por joystick
  const top = SCREEN.raceHeight, y = top + (SCREEN.height - top) / 2;
  const add = (o) => o.setScrollFactor(0).setDepth(DEPTH);
  add(scene.add.rectangle(0, top, SCREEN.width, SCREEN.height, THEME.background).setOrigin(0)); // sobra hacia abajo: tapa el último píxel
  add(scene.add.rectangle(0, top, SCREEN.width, 3, THEME.ink).setOrigin(0));

  const lateral = stick(scene, add, SCREEN.width * 0.25, y, 'x');
  const vertical = stick(scene, add, SCREEN.width * 0.75, y, 'y');
  const sticks = [lateral, vertical];

  scene.input.on('pointerdown', (p) => (p.x < SCREEN.width / 2 ? lateral : vertical).press(p));
  scene.input.on('pointermove', (p) => sticks.forEach((s) => s.move(p)));
  // pointerupoutside: el dedo se levantó fuera del lienzo.
  const release = (p) => sticks.forEach((s) => s.release(p));
  scene.input.on('pointerup', release);
  scene.input.on('pointerupoutside', release);

  // Misma forma que la entrada de teclado; el salto cuenta al pasar hacia arriba, como JustDown.
  let wasUp = false;
  return {
    read() {
      const up = vertical.offset() < -STICK.deadZone;
      const input = {
        left: lateral.offset() < -STICK.deadZone,
        right: lateral.offset() > STICK.deadZone,
        accelerate: vertical.offset() > STICK.deadZone,
        jump: up && !wasUp,
      };
      wasUp = up;
      return input;
    },
  };
}

// Joystick de un solo eje (axis: 'x' | 'y'); offset() es el desplazamiento de la perilla.
function stick(scene, add, homeX, homeY, axis) {
  const base = add(scene.add.circle(homeX, homeY, STICK.radius, THEME.white).setStrokeStyle(THEME.stroke, THEME.ink));
  const knob = add(scene.add.circle(homeX, homeY, STICK.knob, THEME.ink));
  let id = null, offset = 0;
  const place = (x, y) => {
    base.setPosition(x, y);
    knob.setPosition(x, y);
  };
  return {
    offset: () => offset,
    press(p) {
      if (id !== null) return; // ya lo maneja otro dedo
      id = p.id;
      place(p.x, p.y);
    },
    move(p) {
      if (p.id !== id) return;
      offset = Math.max(-STICK.radius, Math.min(STICK.radius, p[axis] - base[axis]));
      knob[axis] = base[axis] + offset;
    },
    release(p) {
      if (p.id !== id) return;
      id = null;
      offset = 0;
      place(homeX, homeY);
    },
  };
}
