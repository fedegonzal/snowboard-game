// Colores y estilos de texto del diseño de Figma (página «Pista – en juego»).

export const THEME = {
  background: 0xe4f0fb, // nieve fuera de la pista
  snow: 0xfbfdff,       // pista
  ink: 0x1a1a1a,        // contornos y texto
  muted: 0x5b6b78,      // texto secundario
  line: 0xb9cbd9,       // contorno de controles inactivos
  barBg: 0xdbe6ef,
  trail: 0xd3e1ec,      // huella en la nieve
  white: 0xffffff,
  sectionTint: 0.07,    // opacidad del color del tramo sobre la pista
  stroke: 2.5,
};

export const FONT = 'Fredoka';

export const hex = (color) => `#${color.toString(16).padStart(6, '0')}`;

// Estilo de texto de Phaser. weight: 500 | 600 | 700.
export function textStyle(size, { weight = 600, color = THEME.ink, ...rest } = {}) {
  return { fontFamily: FONT, fontSize: `${size}px`, fontStyle: String(weight), color: hex(color), ...rest };
}

// Texto grande con contorno, para títulos y mensajes centrales.
export function outlinedStyle(size) {
  return textStyle(size, { weight: 700, color: THEME.white, stroke: hex(THEME.ink), strokeThickness: Math.round(size / 8) });
}

export function darken(color, k) {
  const r = (color >> 16) & 255, g = (color >> 8) & 255, b = color & 255;
  return (Math.round(r * (1 - k)) << 16) | (Math.round(g * (1 - k)) << 8) | Math.round(b * (1 - k));
}

export function lighten(color, k) {
  const r = (color >> 16) & 255, g = (color >> 8) & 255, b = color & 255;
  const up = (c) => Math.round(c + (255 - c) * k);
  return (up(r) << 16) | (up(g) << 8) | up(b);
}
