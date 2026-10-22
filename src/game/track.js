import { TRACK, SECTIONS, OBSTACLES } from '../config.js';

// Generador pseudoaleatorio con semilla (mulberry32): la misma semilla da la misma pista.
export function createRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed() {
  return Math.floor(Math.random() * 2 ** 32);
}

const OBSTACLE_TYPES = Object.keys(OBSTACLES);

function between(rng, min, max) {
  return min + rng() * (max - min);
}

// Coloca un obstáculo al azar dentro de [minX, maxX] horizontalmente, centrado en y.
function makeObstacle(rng, y, minX, maxX) {
  const type = OBSTACLE_TYPES[Math.floor(rng() * OBSTACLE_TYPES.length)];
  const { w, h, low } = OBSTACLES[type];
  const x = between(rng, minX, maxX - w);
  return { type, low, x, y: y - h / 2, w, h };
}

function generateObstacles(rng, sections, finishY) {
  const obstacles = [];
  const half = TRACK.width / 2;
  for (const section of sections) {
    let y = Math.max(section.startY, TRACK.startY + TRACK.startClear);
    for (; y < Math.min(section.endY, finishY - TRACK.finishClear); y += section.rowGap) {
      if (rng() < section.doubleChance) {
        // Dos obstáculos, uno en cada mitad: siempre queda espacio para pasar.
        obstacles.push(makeObstacle(rng, y, 0, half));
        obstacles.push(makeObstacle(rng, y, half, TRACK.width));
      } else {
        obstacles.push(makeObstacle(rng, y, 0, TRACK.width));
      }
    }
  }
  return obstacles;
}

export function generateTrack(seed = randomSeed()) {
  const rng = createRng(seed);
  const sections = SECTIONS.map((s, i) => ({
    ...s,
    startY: TRACK.startY + i * TRACK.sectionLength,
    endY: TRACK.startY + (i + 1) * TRACK.sectionLength,
  }));
  const finishY = sections[sections.length - 1].endY;

  return {
    seed,
    width: TRACK.width,
    startY: TRACK.startY,
    finishY,
    sections,
    obstacles: generateObstacles(rng, sections, finishY),
  };
}

// Índice del tramo en el que se encuentra la coordenada y.
export function sectionIndexAt(track, y) {
  const i = track.sections.findIndex((s) => y < s.endY);
  return i === -1 ? track.sections.length - 1 : i;
}
