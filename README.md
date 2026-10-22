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
| Frenar | `S` | `↓` |
| Saltar | `W` | `↑` |

En los menús se navega con las flechas y se acepta con `Enter`. `Esc` vuelve al menú.

## Estructura

```
docs/            Necesidades, especificación, arquitectura, plan y tareas
public/assets/   Ilustraciones SVG exportadas de Figma
src/game/        Reglas del juego (sin dependencias de Phaser)
src/render/      Dibujo de la pista, el jugador, el HUD y la interfaz
src/scenes/      Escenas de Phaser: menú, preparación, carrera, resultado y top 10
src/config.js    Valores ajustables: velocidades, tiempos, tablas, colores y teclas
```

## Documentación

- [Especificación](docs/spec.md)
- [Arquitectura](docs/architec.md)
- [Plan](docs/plan.md) y [tareas](docs/tasks.md)
- [Diseño en Figma](https://www.figma.com/design/XJvLyYUUMLWfXdVWqBHq7s/snowboard?node-id=3-2)
