import { THEME } from './theme.js';

const RAIL = 12;        // ancho de los bordes de color
const MARGIN = 700;     // nieve y bosque antes de la salida y después de la meta
const FOREST = { size: 154, rowGap: 130, colGap: 140, cols: 3 };

// Cómo se apoya cada ilustración sobre su rectángulo de colisión: centrada abajo.
// originX ajusta el banderín, cuyo mástil no está en el centro de la imagen.
const OBSTACLE_SPRITES = {
  snowman: { originX: 0.5 },
  mound: { originX: 0.5 },
  flag: { originX: 0.3 },
};

export function drawTrack(scene, track) {
  const top = track.startY - MARGIN;
  const bottom = track.finishY + MARGIN;
  drawForest(scene, track, top, bottom);

  const g = scene.add.graphics().setDepth(-10);
  g.fillStyle(THEME.snow).fillRect(0, top, track.width, bottom - top);
  for (const s of track.sections) {
    g.fillStyle(s.color, THEME.sectionTint).fillRect(0, s.startY, track.width, s.endY - s.startY);
  }

  // Bordes del color de cada tramo (antes de la salida y tras la meta usan el primero y el último).
  const first = track.sections[0], last = track.sections[track.sections.length - 1];
  const bands = [{ color: first.color, startY: top, endY: first.startY }, ...track.sections, { color: last.color, startY: last.endY, endY: bottom }];
  for (const b of bands) {
    for (const x of [-RAIL, track.width]) {
      g.fillStyle(b.color).fillRect(x, b.startY, RAIL, b.endY - b.startY);
      g.lineStyle(THEME.stroke, THEME.ink).strokeRect(x, b.startY, RAIL, b.endY - b.startY);
    }
  }

  // Cambios de tramo: línea discontinua del color del tramo que empieza.
  for (const s of track.sections.slice(1)) {
    g.fillStyle(s.color);
    for (let x = 0; x < track.width; x += 22) g.fillRect(x, s.startY - 1.5, 12, 3);
  }

  // Salida: línea gruesa. Meta: banda a cuadros.
  g.fillStyle(THEME.ink).fillRect(0, track.startY - 3, track.width, 6);
  const sq = 16;
  for (let i = 0; i * sq < track.width; i++) {
    for (let j = 0; j < 2; j++) {
      g.fillStyle((i + j) % 2 ? THEME.ink : THEME.white).fillRect(i * sq, track.finishY + j * sq, sq, sq);
    }
  }

  for (const o of track.obstacles) {
    const { originX } = OBSTACLE_SPRITES[o.type];
    scene.add.image(o.x + o.w * originX, o.y + o.h, o.type).setOrigin(originX, 1).setDepth(o.y + o.h);
  }
}

// Bosque ilustrado repetido a ambos lados, con filas desplazadas para que no se vea en cuadrícula.
function drawForest(scene, track, top, bottom) {
  for (let row = 0, y = top; y < bottom; row++, y += FOREST.rowGap) {
    const off = (row % 2) * 60;
    for (let k = 0; k < FOREST.cols; k++) {
      const leftX = -RAIL - FOREST.size - k * FOREST.colGap + off * 0.3;
      const rightX = track.width + RAIL + k * FOREST.colGap - off * 0.3;
      scene.add.image(leftX, y + off, 'forest').setOrigin(0).setDepth(-20);
      scene.add.image(rightX, y + off + 40, 'forest').setOrigin(0).setDepth(-20);
    }
  }
}
