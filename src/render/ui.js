import { THEME, textStyle } from './theme.js';

// Piezas de interfaz del diseño: etiquetas, botones, selectores, barras y teclas.
// Cada función devuelve un Container de Phaser posicionado en (x, y) por su esquina superior izquierda.

function roundedBox(g, w, h, { fill = THEME.white, fillAlpha = 1, stroke = THEME.ink, strokeWidth = THEME.stroke, radius = 14 } = {}) {
  g.clear();
  g.fillStyle(fill, fillAlpha).fillRoundedRect(0, 0, w, h, radius);
  if (strokeWidth > 0) g.lineStyle(strokeWidth, stroke).strokeRoundedRect(0, 0, w, h, radius);
}

// Flecha < o > dibujada (Fredoka no incluye ◀ ▶).
function chevron(scene, x, y, dir, color) {
  const g = scene.add.graphics();
  g.lineStyle(2.5, color).beginPath();
  if (dir < 0) g.moveTo(x + 4, y - 5).lineTo(x - 2, y).lineTo(x + 4, y + 5);
  else g.moveTo(x - 4, y - 5).lineTo(x + 2, y).lineTo(x - 4, y + 5);
  g.strokePath();
  return g;
}

// Etiqueta redondeada con texto y punto de color opcional (tramo, cronómetro, nombre).
export function pill(scene, x, y, label, { fill = THEME.white, fillAlpha = 0.92, color = THEME.ink, size = 18, dot = null } = {}) {
  const c = scene.add.container(x, y);
  const bg = scene.add.graphics();
  const dotG = scene.add.graphics();
  const text = scene.add.text(0, 0, label, textStyle(size, { color }));
  c.add([bg, dotG, text]);
  let dotColor = dot;
  c.refresh = () => {
    const padX = 14, padY = 7, dotSize = dotColor === null ? 0 : 24;
    text.setPosition(padX + dotSize, padY);
    const w = padX * 2 + dotSize + text.width, h = padY * 2 + text.height;
    roundedBox(bg, w, h, { fill, fillAlpha, radius: h / 2 });
    dotG.clear();
    if (dotColor !== null) dotG.fillStyle(dotColor).fillCircle(padX + 8, h / 2, 8).lineStyle(2, THEME.ink).strokeCircle(padX + 8, h / 2, 8);
    c.setSize(w, h);
  };
  c.setLabel = (str) => { text.setText(str); c.refresh(); return c; };
  c.setDot = (color) => { dotColor = color; c.refresh(); return c; };
  c.setFill = (color) => { fill = color; c.refresh(); return c; };
  c.refresh();
  return c;
}

// Botón de menú; setSelected resalta la opción elegida.
export function button(scene, x, y, w, label) {
  const h = 52;
  const c = scene.add.container(x, y);
  const bg = scene.add.graphics();
  const text = scene.add.text(w / 2, h / 2, label, textStyle(24)).setOrigin(0.5);
  c.add([bg, text]);
  c.setSelected = (active) => {
    roundedBox(bg, w, h, { fill: active ? THEME.ink : THEME.white, stroke: active ? THEME.ink : THEME.line, strokeWidth: active ? 3 : 2, radius: 16 });
    text.setColor(active ? '#ffffff' : '#1a1a1a');
    return c;
  };
  c.setSelected(false);
  return c;
}

// Selector de la preparación: etiqueta, muestra de color opcional, valor y flechas.
export function selector(scene, x, y, w = 220) {
  const h = 62;
  const c = scene.add.container(x, y);
  const bg = scene.add.graphics();
  const label = scene.add.text(12, 7, '', textStyle(13, { weight: 500, color: THEME.muted }));
  const swatch = scene.add.graphics();
  const value = scene.add.text(0, 26, '', textStyle(18));
  c.add([bg, label, swatch, value]);
  let arrows = [];
  c.set = ({ label: l, value: v, swatch: sw = null, active = false }) => {
    roundedBox(bg, w, h, { stroke: active ? THEME.ink : THEME.line, strokeWidth: active ? 3 : 2 });
    label.setText(l);
    value.setText(v);
    swatch.clear();
    if (sw !== null) swatch.fillStyle(sw).fillCircle(37, 39, 9).lineStyle(2, THEME.ink).strokeCircle(37, 39, 9);
    value.setX(sw !== null ? 54 : 30);
    arrows.forEach((a) => a.destroy());
    const arrowColor = active ? THEME.ink : 0x9aaab6;
    arrows = [chevron(scene, 16, 39, -1, arrowColor), chevron(scene, w - 16, 39, 1, arrowColor)];
    c.add(arrows);
    return c;
  };
  return c;
}

// Barra de atributo de tabla. level: valor del multiplicador (0,6 a 1,3).
export function statBar(scene, x, y, label, w = 220) {
  const c = scene.add.container(x, y);
  const text = scene.add.text(0, 0, label, textStyle(13, { weight: 500, color: THEME.muted }));
  const bar = scene.add.graphics();
  const value = scene.add.text(w, 0, '', textStyle(13)).setOrigin(1, 0);
  c.add([text, bar, value]);
  const barX = 78, barW = w - barX - 40;
  c.setLevel = (level) => {
    bar.clear();
    bar.fillStyle(THEME.barBg).fillRoundedRect(barX, 4, barW, 10, 5);
    bar.fillStyle(THEME.ink).fillRoundedRect(barX, 4, Math.max(10, barW * (level - 0.6) / 0.7), 10, 5);
    value.setText(`×${String(level).replace('.', ',')}`);
    return c;
  };
  return c;
}

// Tecla con su descripción, para las ayudas.
export function keyHint(scene, x, y, key, label) {
  const c = scene.add.container(x, y);
  const bg = scene.add.graphics();
  const k = scene.add.text(10, 4, key, textStyle(15));
  const w = k.width + 20, h = k.height + 8;
  roundedBox(bg, w, h, { radius: 8 });
  const l = scene.add.text(w + 8, h / 2, label, textStyle(16, { weight: 500 })).setOrigin(0, 0.5);
  c.add([bg, k, l]);
  c.setSize(w + 8 + l.width, h);
  return c;
}

// Fila de ayudas centrada horizontalmente en cx.
export function keyHints(scene, cx, y, hints) {
  const items = hints.map(([key, label]) => keyHint(scene, 0, y, key, label));
  const gap = 24;
  let x = cx - (items.reduce((s, i) => s + i.width, 0) + gap * (items.length - 1)) / 2;
  for (const i of items) { i.setX(x); x += i.width + gap; }
  return items;
}

// Tarjeta con fondo semitransparente y contorno grueso.
export function card(scene, x, y, w, h) {
  const g = scene.add.graphics({ x, y });
  roundedBox(g, w, h, { fillAlpha: 0.7, strokeWidth: 3, radius: 24 });
  return g;
}
