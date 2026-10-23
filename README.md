# Snowboard

Juego de carreras de snowboard en 2D para el navegador, para uno o dos jugadores en el mismo teclado. Es una demo para una clase universitaria sobre cómo construir un proyecto con ayuda de IA.

## Requisitos

- Node.js 20 o superior.
- Chrome o Firefox de escritorio.

## Ejecución

```
npm install
npm run dev
```

Abrir la dirección local que indica Vite (por defecto `http://localhost:5173`). Para generar una versión estática: `npm run build`, que la deja en `dist/`.

## Controles

| Acción | Jugador 1 | Jugador 2 |
| --- | --- | --- |
| Moverse | `A` / `D` | `←` / `→` |
| Acelerar | `S` | `↓` |
| Saltar | `W` | `↑` |

Si juega una sola persona, usa las flechas. Mientras se mantiene el acelerador se gana velocidad, hasta tres veces la base del tramo; al soltarlo se frena hasta detenerse en dos segundos.

En los menús se navega con las flechas y se acepta con `Enter`. `Esc` vuelve al menú. `F` activa o desactiva la pantalla completa (salvo en la preparación).

## Estructura

```
docs/            Necesidades, especificación, arquitectura, plan y tareas
public/assets/   Ilustraciones SVG exportadas de Figma y efectos de sonido (sounds/)
src/game/        Reglas del juego (sin dependencias de Phaser)
src/render/      Dibujo de la pista, el jugador, el HUD, la interfaz y los sonidos
src/scenes/      Escenas de Phaser: menú, preparación, carrera, resultado y top 10
src/config.js    Valores ajustables: velocidades, tiempos, tablas, colores y teclas
tools/           Generador de los efectos de sonido
```

Los sonidos se sintetizan con `python3 tools/generate-sounds.py` (solo biblioteca estándar).

## Documentación

- [Especificación](docs/spec.md)
- [Arquitectura](docs/architec.md)
- [Plan](docs/plan.md) y [tareas](docs/tasks.md)
- [Diseño en Figma](https://www.figma.com/design/XJvLyYUUMLWfXdVWqBHq7s/snowboard?node-id=3-2)
