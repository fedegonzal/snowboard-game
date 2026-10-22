// Los tiempos se comparan y muestran en décimas de segundo, truncando.

export function toTenths(ms) {
  return Math.floor(ms / 100);
}

// 623 décimas → "01:02,3"
export function formatTime(tenths) {
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor(tenths / 10) % 60;
  const tenth = tenths % 10;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${tenth}`;
}
