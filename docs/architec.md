# Arquitectura y decisiones tecnológicas

## 1. Estado y propósito

**Documento cerrado.** Registra las decisiones técnicas para implementar [spec.md](./spec.md) como demo de clase universitaria sobre el proceso de construir un proyecto con ayuda de IA.

Criterio rector: pocos conceptos, poca configuración y código fácil de leer en clase.

## 2. Decisiones

| ID | Tema | Decisión | Motivo |
| --- | --- | --- | --- |
| ARQ-01 | Plataforma | Navegador de escritorio (Chrome o Firefox actuales), servido en localhost. Sin publicación en Internet. | Es una demo local. |
| ARQ-02 | Lenguaje | JavaScript con módulos ES, sin TypeScript. | Menos conceptos que explicar. |
| ARQ-03 | Motor | Phaser 3, instalado con npm. | Resuelve escenas, entrada de teclado, colisiones simples y cámaras múltiples para la pantalla dividida. |
| ARQ-04 | Servidor y build | Vite, sin framework de interfaz. | `npm run dev` levanta localhost; mínima configuración. |
| ARQ-05 | Interfaz | Menús, HUD y textos dibujados con Phaser, con la tipografía Fredoka. Sin HTML/CSS adicional salvo la página base. | Un solo modelo de interfaz. |
| ARQ-06 | Gráficos | Ilustraciones SVG exportadas del diseño de Figma en `public/assets/`; el resto (pista, bordes, botones) se dibuja con formas de Phaser. Los colores del jugador se aplican reemplazando colores en el SVG al cargarlo. Sin sonido. | Mantiene el juego fiel al diseño con pocos archivos. |
| ARQ-07 | Persistencia | `localStorage`, una clave con el top 10 en JSON. | Sin servidor ni base de datos. Los récords quedan ligados al navegador y al puerto. |
| ARQ-08 | Controles | Solo teclado, según MOV-02. Probar en el equipo de la demo que las pulsaciones simultáneas funcionan. | Teclado compartido entre dos personas. |
| ARQ-09 | Sin conexión | Todas las dependencias se instalan localmente, incluida la fuente (paquete `@fontsource/fredoka`); no se cargan recursos remotos. | La demo no depende de Internet en el aula. |
| ARQ-11 | Escalado | Escala `FIT` de Phaser centrada: el lienzo de 960×600 se escala a la ventana conservando la proporción. La pantalla completa usa la API del navegador a través de `scale.toggleFullscreen()`, con un único manejador de teclado en `main.js`. | Pantalla completa sin redibujar ni cambiar coordenadas. |
| ARQ-10 | Pruebas | Verificación manual con los criterios de aceptación de la especificación. Sin framework de tests. | Suficiente para el alcance de la demo. |

## 3. Estructura del proyecto

```
index.html
package.json
public/assets/       Ilustraciones SVG exportadas de Figma
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
    leaderboard.js   Lectura y escritura del top 10 en localStorage
  render/
    theme.js         Colores y estilos de texto
    assets.js        Carga de SVG y texturas del jugador por color
    trackView.js     Dibujo de la pista, el bosque y los obstáculos
    riderView.js     Dibujo del jugador y sus estados
    hud.js           Tramo, cronómetro, nombre y mensajes
    ui.js            Botones, selectores, barras y teclas para los menús
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

Abrir la dirección local que indique Vite.

## 6. Referencias

- [Diseño en Figma, página «Pista – en juego»](https://www.figma.com/design/XJvLyYUUMLWfXdVWqBHq7s/snowboard?node-id=3-2)
- [Cámaras de Phaser](https://docs.phaser.io/phaser/concepts/cameras)
- [Guía de Vite](https://vite.dev/guide/)
