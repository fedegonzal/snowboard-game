# Plan de implementación

Planificación de alto nivel para construir el juego definido en [spec.md](./spec.md) con la arquitectura de [architec.md](./architec.md). Las tareas concretas de cada módulo están en [tasks.md](./tasks.md).

## 1. Estrategia

- Construir en incrementos pequeños y jugables: cada módulo termina con algo que se puede ejecutar y mostrar en clase.
- Empezar por el modo individual completo y añadir el modo de dos personas al final del núcleo de juego.
- Mantener todos los valores numéricos en `config.js` desde el principio.
- Verificar cada módulo a mano contra los criterios de aceptación (ACE) relacionados.

## 2. Módulos

| # | Módulo | Objetivo | Archivos principales | Requisitos | Depende de |
| --- | --- | --- | --- | --- | --- |
| M1 | Base del proyecto | Proyecto Vite + Phaser que arranca en localhost y muestra una escena vacía. | `index.html`, `package.json`, `src/main.js`, `src/config.js` | ARQ-01 a ARQ-04, ARQ-09 | — |
| M2 | Pista | Generar y dibujar la pista con sus cuatro tramos, bordes, árboles y obstáculos aleatorios. | `src/game/track.js`, `src/scenes/RaceScene.js` | PIS-01 a PIS-04, OBS-01 | M1 |
| M3 | Personaje y movimiento | Un participante que desciende, se mueve, frena y salta con la velocidad del tramo. | `src/game/Rider.js` | OBJ-01, MOV-01 a MOV-04 | M2 |
| M4 | Colisiones y caídas | Caídas contra obstáculos y bordes, recuperación e inmunidad. | `src/game/Rider.js`, `src/scenes/RaceScene.js` | OBS-01 a OBS-03 | M3 |
| M5 | Carrera individual | Cuenta regresiva, cronómetro, meta y salida a resultados. | `src/scenes/RaceScene.js`, `src/scenes/ResultScene.js` | CAR-01, CAR-02, CAR-04, CAR-05 | M4 |
| M6 | Top 10 | Guardar, ordenar y mostrar los mejores tiempos individuales. | `src/game/leaderboard.js`, `src/scenes/TopScene.js` | CLA-01 a CLA-03, OBJ-02 | M5 |
| M7 | Dos jugadores | Segundo participante, pantalla dividida, ganador y empate. | `src/scenes/RaceScene.js`, `src/scenes/ResultScene.js` | OBJ-03, MOV-02, OBS-04, CAR-03 | M5 |
| M8 | Menú y preparación | Menú principal, nombre, colores y tablas. | `src/scenes/MenuScene.js`, `src/scenes/SetupScene.js` | PER-01 a PER-04, sección 9 | M6, M7 |
| M10 | Presentación visual | Reemplazar la representación provisional por el diseño de Figma en todas las pantallas. | `public/assets/`, `src/render/` | VIS-01 a VIS-09 | M8 |
| M9 | Ajuste y verificación | Ajustar valores para un descenso de ~1 minuto y repasar todos los criterios de aceptación. | `src/config.js` | PIS-01, ACE-01 a ACE-07 | M10 |
| M11 | Mejoras de control y pantalla | Flechas en modo individual, acelerador en lugar de freno, pantalla completa escalada y top 10 resaltado al terminar. | `src/game/Rider.js`, `src/scenes/RaceScene.js`, `src/scenes/SetupScene.js`, `src/scenes/TopScene.js`, `src/main.js`, `index.html`, `src/config.js` | MOV-01 a MOV-03, CLA-03, sección 9, ARQ-11, ACE-05, ACE-07, ACE-08 | M9 |

## 3. Orden e hitos

```
M1 → M2 → M3 → M4 → M5 ─┬→ M6 ─┐
                        └→ M7 ─┴→ M8 → M10 → M9 → M11
```

| Hito | Tras | Resultado demostrable |
| --- | --- | --- |
| H1 | M2 | Se ve la pista completa con obstáculos distintos en cada recarga. |
| H2 | M4 | Un personaje baja la pista, esquiva, salta y cae. |
| H3 | M6 | Modo individual completo con top 10 persistente. |
| H4 | M7 | Carrera de dos personas en pantalla dividida. |
| H5 | M10 | Juego con el aspecto definitivo del diseño. |
| H6 | M9 | Juego completo, ajustado y verificado. |
| H7 | M11 | Se acelera con `↓`/`S` y se juega en pantalla completa. |

## 4. Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El teclado del aula no registra varias teclas simultáneas. | Probar en M7 en el equipo de la demo; cambiar teclas en `config.js` si hace falta. |
| La pantalla dividida complica la escena de carrera. | Usar un solo mundo con dos cámaras (architec.md, sección 4). |
| El ajuste de velocidades consume demasiado tiempo. | Fijar valores razonables en M3 y ajustar solo en M9. |
