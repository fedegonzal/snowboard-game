import { TOP } from '../config.js';

// Top 10 guardado en localStorage. Cada entrada: { name, tenths, date }.

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isValidEntry(e) {
  return e && typeof e.name === 'string' && Number.isInteger(e.tenths) && Number.isFinite(e.date);
}

export function loadTop(storage = getStorage()) {
  try {
    const data = JSON.parse(storage?.getItem(TOP.storageKey) ?? '[]');
    return Array.isArray(data) ? data.filter(isValidEntry).slice(0, TOP.size) : [];
  } catch {
    return [];
  }
}

function saveTop(entries, storage) {
  try {
    storage?.setItem(TOP.storageKey, JSON.stringify(entries));
  } catch {
    // Sin almacenamiento disponible: el top 10 no persiste.
  }
}

// Inserta un tiempo y devuelve su posición (1 a 10), o null si no entra.
// Entre tiempos iguales queda primero el más antiguo, por eso se inserta detrás de ellos.
export function addTime(name, tenths, storage = getStorage(), date = Date.now()) {
  const entries = loadTop(storage);
  let index = entries.findIndex((e) => e.tenths > tenths);
  if (index === -1) index = entries.length;
  if (index >= TOP.size) return null;
  entries.splice(index, 0, { name, tenths, date });
  saveTop(entries.slice(0, TOP.size), storage);
  return index + 1;
}
