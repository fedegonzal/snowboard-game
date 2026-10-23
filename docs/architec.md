# Arquitectura y decisiones tecnológicas

## 1. Estado y propósito

**Documento cerrado.** Registra las decisiones técnicas para implementar [spec.md](./spec.md) como demo de clase universitaria sobre el proceso de construir un proyecto con ayuda de IA.

Criterio rector: pocos conceptos, poca configuración y código fácil de leer en clase.

## 2. Decisiones

| ID | Tema | Decisión | Motivo |
| --- | --- | --- | --- |
| ARQ-01 | Plataforma | Navegador de escritorio (Chrome o Firefox actuales) y navegador del celular (Chrome en Android, Safari en iOS). Se publica en GitHub Pages con un workflow de GitHub Actions que compila con `--base=./`; también se puede servir en localhost. | Cualquiera puede jugar desde un enlace, sin instalar nada. |
| ARQ-02 | Lenguaje | JavaScript con módulos ES, sin TypeScript. | Menos conceptos que explicar. |
| ARQ-03 | Motor | Phaser 3, instalado con npm. | Resuelve escenas, entrada de teclado, colisiones simples y cámaras múltiples para la pantalla dividida. |
| ARQ-04 | Servidor y build | Vite, sin framework de interfaz. | `npm run dev` levanta localhost; mínima configuración. |
| ARQ-05 | Interfaz | Menús, HUD y textos dibujados con Phaser, con la tipografía Fredoka. Sin HTML/CSS adicional salvo la página base. | Un solo modelo de interfaz. |
| ARQ-06 | Gráficos | Ilustraciones SVG exportadas del diseño de Figma en `public/assets/`; el resto (pista, bordes, botones) se dibuja con formas de Phaser. Los colores del jugador se aplican reemplazando colores en el SVG al cargarlo. | Mantiene el juego fiel al diseño con pocos archivos. |
| ARQ-07 | Persistencia | Tabla `scores` en Supabase (Postgres), accedida con `fetch` a su API REST y la clave pública, sin SDK. Se guardan todos los tiempos; el top 10 es la consulta ordenada por tiempo y antigüedad. Los permisos solo dejan leer e insertar nombre y tiempo. El esquema está en `supabase/schema.sql`; la URL y la clave, en `config.js`. | Un único top 10 compartido entre quienes juegan en Internet, sin servidor propio. Sin validación en el servidor: quien lea el código puede enviar tiempos falsos, aceptable para la demo. |
| ARQ-08 | Controles | Teclado en la computadora, según MOV-02. Probar en el equipo de la demo que las pulsaciones simultáneas funcionan. En el celular, controles táctiles con los punteros de Phaser (`ui/touch.js`) que entregan la misma entrada `{ left, right, accelerate, jump }` que el teclado. Se detecta el celular con `matchMedia('(pointer: coarse)')` en `config.js` (`MOBILE`). | Teclado compartido entre dos personas; en el celular, la lógica de `Rider` no cambia. |
| ARQ-09 | Conexión | Todas las dependencias se instalan localmente, incluida la fuente (paquete `@fontsource/fredoka`). Solo el top 10 usa Internet; sin conexión se juega igual y el top 10 muestra un error, sin copia local. | Un solo top 10, sin dos fuentes de verdad. |
| ARQ-11 | Escalado | Escala `FIT` de Phaser centrada: el lienzo de 960×600 se escala a la ventana conservando la proporción. En el celular el lienzo es vertical, de 540 de ancho y con un alto que sigue la proporción de la pantalla (mínimo 960). Los últimos 240 px son el panel táctil. El menú, la preparación, el resultado y el top 10 están diseñados para 600 de alto y se centran verticalmente moviendo la cámara. La pantalla completa usa la API del navegador a través de `scale.toggleFullscreen()`, con un único manejador de teclado en `main.js`. | Pantalla completa sin redibujar ni cambiar coordenadas. |
| ARQ-12 | Sonido | Efectos WAV sintetizados por `tools/generate-sounds.py` (solo biblioteca estándar de Python) en `public/assets/sounds/`, reproducidos con el gestor de sonido de Phaser. El deslizamiento sigue la velocidad del jugador; caída, salto, tramo, llegada y menús disparan su efecto. | Sin archivos de audio de terceros ni licencias. |
| ARQ-10 | Pruebas | Verificación manual con los criterios de aceptación de la especificación. Sin framework de tests. | Suficiente para el alcance de la demo. |

## 3. Estructura del proyecto

```
index.html
package.json
public/assets/       Ilustraciones SVG exportadas de Figma y efectos de sonido (sounds/)
tools/               Generador de los efectos de sonido
supabase/schema.sql  Tabla y permisos del top 10
src/
  main.js            Configuración de Phaser, escalado, pantalla completa y lista de escenas
  config.js          Constantes: velocidades, tiempos, tablas, colores, teclas
  scenes/
    MenuScene.js     Menú principal
    SetupScene.js    Nombre, colores y tabla
    RaceScene.js     Carrera (1 o 2 jugadores, cámaras, cronómetro)
    ResultScene.js   Resultado, revancha y menú
    TopScene.js      Top 10
  game/
    Rider.js         Estado y movimiento de un participante
    track.js         Generación de tramos y obstáculos a partir de una semilla
    leaderboard.js   Lectura y escritura del top 10 en Supabase
  render/
    theme.js         Colores y estilos de texto
    assets.js        Carga de SVG y texturas del jugador por color
    trackView.js     Dibujo de la pista, el bosque y los obstáculos
    riderView.js     Dibujo del jugador y sus estados
    hud.js           Tramo, cronómetro, nombre y mensajes
    ui.js            Botones, selectores, barras y teclas para los menús
  ui/
    menu.js          Lista de botones navegable con teclado o toque
    touch.js         Joysticks táctiles de la carrera en el celular
    sounds.js        Carga y reproducción de los efectos de sonido
```

La lógica de `src/game/` no depende de `src/render/`: cambiar la presentación no cambia las reglas.

## 4. Notas de diseño

- **Pantalla dividida:** un solo mundo con ambos participantes y dos cámaras de Phaser, cada una siguiendo a uno.
- **Mismos obstáculos:** la pista se genera una vez por carrera y la comparten ambos participantes; la revancha genera una nueva.
- **Valores ajustables:** todos los números de la especificación (velocidades, duraciones, multiplicadores) se definen en `config.js`.
- **Tiempo:** se mide con el reloj de la escena desde el fin de la cuenta regresiva y se trunca a décimas al mostrarlo y compararlo.

## 5. Ejecución

```
npm install
npm run dev
```

Abrir la dirección local que indique Vite. Cada push a `main` publica el juego en GitHub Pages.

## 6. Referencias

- [Diseño en Figma, página «Pista – en juego»](https://www.figma.com/design/XJvLyYUUMLWfXdVWqBHq7s/snowboard?node-id=3-2)
- [Cámaras de Phaser](https://docs.phaser.io/phaser/concepts/cameras)
- [Guía de Vite](https://vite.dev/guide/)
