// Todos los valores ajustables del juego. Distancias en píxeles, tiempos en segundos.

// Celular o tablet: pantalla vertical, una sola persona y controles táctiles.
export const MOBILE = window.matchMedia('(pointer: coarse)').matches;

// En el celular el alto sigue la proporción de la pantalla (al menos 16:9) para no dejar franjas.
// raceHeight: alto de la vista de carrera; debajo van los controles táctiles (240 px).
const MOBILE_HEIGHT = Math.max(960, Math.round((540 * window.innerHeight) / window.innerWidth));
export const SCREEN = MOBILE
  ? { width: 540, height: MOBILE_HEIGHT, raceHeight: MOBILE_HEIGHT - 240 }
  : { width: 960, height: 600, raceHeight: 600 };

// Alto para el que están diseñados el menú, la preparación, el resultado y el top 10.
export const LAYOUT_HEIGHT = 600;

export const TRACK = {
  width: 400,           // ancho de la pista
  startY: 0,            // posición de la salida
  sectionLength: 4100,  // longitud de cada tramo (4 tramos ≈ 1 minuto sin errores)
  startClear: 400,      // zona libre de obstáculos tras la salida
  finishClear: 200,     // zona libre de obstáculos antes de la meta
};

// Tramos en orden de descenso. speed: velocidad de bajada; rowGap: distancia entre filas de
// obstáculos; doubleChance: probabilidad de que una fila tenga dos obstáculos.
export const SECTIONS = [
  { name: 'Verde', color: 0x2a9d4b, speed: 200, rowGap: 420, doubleChance: 0 },
  { name: 'Azul', color: 0x2b6cd6, speed: 260, rowGap: 360, doubleChance: 0.2 },
  { name: 'Rojo', color: 0xd62828, speed: 320, rowGap: 300, doubleChance: 0.35 },
  { name: 'Negro', color: 0x222222, speed: 380, rowGap: 240, doubleChance: 0.5 },
];

// Rectángulo de colisión de cada obstáculo. low: se puede superar saltando.
export const OBSTACLES = {
  snowman: { w: 34, h: 30, low: false },
  mound: { w: 70, h: 26, low: true },
  flag: { w: 14, h: 22, low: false },
};

export const RIDER = {
  size: 28,            // lado del rectángulo de colisión
  lateralSpeed: 220,   // velocidad lateral base
  turnFactor: 0.8,     // velocidad de bajada mientras se mueve lateralmente
  maxBoost: 3,         // velocidad máxima con el acelerador, en veces la del tramo
  accelTime: 6,        // tiempo de 0 a la velocidad máxima
  stopTime: 2,         // tiempo hasta detenerse al soltar el acelerador
  jumpDuration: 0.7,
  fallDuration: 2,
  immunityDuration: 1,
  edgeNudge: 4,        // separación del borde al levantarse
};

export const BOARDS = [
  { name: 'Rápida', speed: 1.1, lateral: 0.8 },
  { name: 'Equilibrada', speed: 1, lateral: 1 },
  { name: 'Ágil', speed: 0.9, lateral: 1.2 },
];

export const COLORS = [
  { name: 'Rojo', value: 0xe63946 },
  { name: 'Azul', value: 0x1d70b8 },
  { name: 'Verde', value: 0x2a9d4b },
  { name: 'Amarillo', value: 0xf4c430 },
  { name: 'Violeta', value: 0x7b2cbf },
];

export const KEYS = [
  { left: 'A', right: 'D', accelerate: 'S', jump: 'W' },
  { left: 'LEFT', right: 'RIGHT', accelerate: 'DOWN', jump: 'UP' },
];

export const RACE = {
  countdown: 3,
  endDelay: 1.5,       // espera antes de mostrar resultados
};

export const NAME = { maxLength: 10, default: 'Jugador' };

export const TOP = { size: 10 };

// Proyecto de Supabase del top 10. La clave es pública: los permisos solo dejan leer e insertar tiempos.
export const SUPABASE = {
  url: 'https://gkiakrvmstnzvlrvdipw.supabase.co',
  key: 'sb_publishable_mVdjVxNkD7gTfPzPOJk8Ug_w9b_qNC4',
};
