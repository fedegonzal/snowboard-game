import { SUPABASE, TOP } from '../config.js';

// Top 10 compartido: tabla scores de Supabase (supabase/schema.sql) a través de su API REST.
// Se guardan todos los tiempos; entre tiempos iguales queda primero el más antiguo.

const SCORES_URL = `${SUPABASE.url}/rest/v1/scores`;

async function request(url, { headers, ...options } = {}) {
  const res = await fetch(url, { ...options, headers: { apikey: SUPABASE.key, ...headers } });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

// Los diez mejores: [{ id, name, tenths }].
export function loadTop() {
  return request(`${SCORES_URL}?select=id,name,tenths&order=tenths.asc,created_at.asc,id.asc&limit=${TOP.size}`);
}

// Inserta un tiempo y devuelve su posición (1 a 10), o null si no entra.
export async function addTime(name, tenths) {
  const [{ id }] = await request(`${SCORES_URL}?select=id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ name, tenths }),
  });
  const index = (await loadTop()).findIndex((e) => e.id === id);
  return index === -1 ? null : index + 1;
}
