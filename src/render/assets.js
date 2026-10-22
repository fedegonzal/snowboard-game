import { COLORS } from '../config.js';
import { darken, lighten, hex } from './theme.js';

// Ilustraciones exportadas de Figma. size: tamaño al que se rasteriza cada SVG.
const IMAGES = {
  snowman: { width: 43, height: 77 },
  mound: { width: 80, height: 36 },
  flag: { width: 24, height: 44 },
  forest: { width: 154, height: 154 },
  'config-1': { width: 168, height: 168 },
  'config-2': { width: 168, height: 168 },
  trophy: { width: 140, height: 140 },
};

export const RIDER_TEXTURE_SIZE = 112;

// Colores del jugador en player.svg (variante «Rojo» del componente de Figma).
const RIDER_SVG_COLORS = { helmet: '#C4303C', body: '#EF7E87', sleeves: '#E63946', sleeveShade: '#AD2B35' };

export function preloadAssets(scene) {
  for (const [key, size] of Object.entries(IMAGES)) scene.load.svg(key, `assets/${key}.svg`, size);
  scene.load.text('player-svg', 'assets/player.svg');
}

export function riderTextureKey(helmet, jacket) {
  return `rider-${helmet}-${jacket}`;
}

// Crea una textura del jugador por cada combinación de casco y campera.
// Devuelve una promesa que se cumple cuando todas están listas.
export function createRiderTextures(scene) {
  const base = scene.cache.text.get('player-svg')
    .replace('width="64" height="64"', `width="${RIDER_TEXTURE_SIZE}" height="${RIDER_TEXTURE_SIZE}"`);
  const pending = [];
  COLORS.forEach((helmetColor, helmet) => {
    COLORS.forEach((jacketColor, jacket) => {
      const key = riderTextureKey(helmet, jacket);
      const svg = base
        .replaceAll(RIDER_SVG_COLORS.helmet, hex(darken(helmetColor.value, 0.15)))
        .replaceAll(RIDER_SVG_COLORS.body, hex(lighten(jacketColor.value, 0.35)))
        .replaceAll(RIDER_SVG_COLORS.sleeves, hex(jacketColor.value))
        .replaceAll(RIDER_SVG_COLORS.sleeveShade, hex(darken(jacketColor.value, 0.25)));
      pending.push(new Promise((resolve) => scene.textures.once(`addtexture-${key}`, resolve)));
      scene.textures.addBase64(key, `data:image/svg+xml;base64,${btoa(svg)}`);
    });
  });
  return Promise.all(pending);
}
