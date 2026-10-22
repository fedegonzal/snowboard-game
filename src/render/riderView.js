import { RIDER } from '../config.js';
import { THEME } from './theme.js';
import { riderTextureKey } from './assets.js';

const SPRITE_SIZE = 56;
const JUMP_SCALE = 1.3;
const JUMP_LIFT = 14;       // cuánto sube la ilustración al saltar
const TRAIL_STEP = 8;       // distancia vertical entre puntos de la huella
const TRAIL_POINTS = 120;   // longitud de la huella visible

export function createRiderView(scene, rider) {
  const trail = scene.add.graphics().setDepth(-5);
  const shadow = scene.add.ellipse(0, 0, 44, 12, THEME.ink, 0.18).setVisible(false);
  const sprite = scene.add.image(rider.x, rider.y, riderTextureKey(rider.helmet, rider.jacket));
  const baseScale = SPRITE_SIZE / sprite.width;
  sprite.setScale(baseScale);
  const points = [{ x: rider.x, y: rider.y }];

  function updateTrail() {
    const last = points[points.length - 1];
    if (rider.y - last.y < TRAIL_STEP) return;
    // Durante el salto la tabla no toca la nieve: se corta la huella.
    points.push(rider.jumping ? { x: rider.x, y: rider.y, gap: true } : { x: rider.x, y: rider.y });
    if (points.length > TRAIL_POINTS) points.shift();
    trail.clear().lineStyle(10, THEME.trail);
    for (let i = 1; i < points.length; i++) {
      if (points[i].gap || points[i - 1].gap) continue;
      trail.lineBetween(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
    }
  }

  return {
    objects: [trail, shadow, sprite],
    update(time) {
      updateTrail();
      const bottom = rider.y + RIDER.size / 2;
      sprite.setPosition(rider.x, rider.y - (rider.jumping ? JUMP_LIFT : 0));
      sprite.setScale(baseScale * (rider.jumping ? JUMP_SCALE : 1));
      sprite.setAngle(rider.state === 'fallen' ? -100 : 0);
      sprite.setAlpha(rider.immune && Math.floor(time / 100) % 2 ? 0.35 : 1);
      // Por encima de los obstáculos que ya pasó y por debajo de los que tiene delante.
      sprite.setDepth(rider.jumping ? bottom + 1000 : bottom);
      shadow.setVisible(rider.jumping).setPosition(rider.x, bottom + 6).setDepth(bottom - 1);
    },
  };
}
