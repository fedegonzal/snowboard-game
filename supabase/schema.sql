-- Top 10 compartido. Ejecutar una vez en el SQL Editor del proyecto de Supabase.
-- Se guardan todos los tiempos; el top 10 es la consulta ordenada por tiempo y antigüedad.
create table scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 10),
  tenths integer not null check (tenths > 0),
  created_at timestamptz not null default now()
);

create index scores_rank on scores (tenths, created_at);

-- Con la clave pública solo se puede leer e insertar nombre y tiempo; no se puede modificar ni borrar.
alter table scores enable row level security;
create policy "leer" on scores for select to anon using (true);
create policy "insertar" on scores for insert to anon with check (true);
revoke all on scores from anon;
grant select on scores to anon;
grant insert (name, tenths) on scores to anon;
