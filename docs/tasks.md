# Tareas

Tareas concretas por módulo de [plan.md](./plan.md). Marcar con `[x]` al completar.

Las tareas visuales de M2 a M8 se resolvieron primero de forma provisional y se completan en M10 con el diseño de Figma. Las tareas sin marcar requieren verificación manual en el navegador o en el equipo de la demo.

## M1. Base del proyecto

- [x] Crear `package.json` con Vite y Phaser 3 como dependencias y los scripts `dev` y `build`.
- [x] Crear `index.html` con un contenedor para el juego y la carga de `src/main.js`.
- [x] Crear `src/config.js` con las constantes iniciales: tamaño de pantalla, velocidades por tramo, multiplicadores de giro y freno, duración del salto, caída e inmunidad, tablas, colores y teclas.
- [x] Crear `src/main.js` con la configuración de Phaser y la lista de escenas.
- [x] Crear escenas vacías: `MenuScene`, `SetupScene`, `RaceScene`, `ResultScene`, `TopScene`.
- [x] Comprobar que `npm install` y `npm run dev` abren el juego en localhost sin cargar recursos remotos.

## M2. Pista

- [x] En `track.js`, definir la longitud total y los cuatro tramos (verde, azul, rojo, negro) de igual longitud.
- [x] Implementar un generador aleatorio con semilla para colocar obstáculos.
- [x] Generar muñecos de nieve, montículos y banderines dentro de la pista, dejando espacio para pasar.
- [x] Generar árboles a ambos lados, siempre fuera de la pista.
- [x] Dibujar en `RaceScene` la pista con formas geométricas: fondo de cada tramo con su color, bordes, árboles, obstáculos, salida y meta. *(lógica hecha; visual provisional)*
- [x] Comprobar que cada carrera nueva produce una distribución distinta (H1).

## M3. Personaje y movimiento

- [x] Crear la clase `Rider` con posición, velocidad, tabla, colores y estado (corriendo, saltando, caído, terminado).
- [x] Dibujar el personaje con formas: tabla, campera y casco. *(lógica hecha; visual provisional)*
- [x] Hacer que la cámara siga al personaje en su descenso.
- [x] Calcular la velocidad según el tramo actual y el multiplicador de la tabla.
- [x] Movimiento lateral con `A`/`D`, reduciendo la velocidad al 80 % mientras se mantiene.
- [x] Freno con `S`, reduciendo la velocidad al 40 % mientras se mantiene.
- [x] Volver de inmediato a la velocidad del tramo al soltar las teclas.
- [x] Salto con `W` durante medio segundo, con una indicación visual (por ejemplo, aumentar el tamaño). *(lógica hecha; visual provisional)*
- [x] Mostrar el tramo actual en pantalla.

## M4. Colisiones y caídas

- [x] Detectar el choque con obstáculos usando rectángulos simples.
- [x] Ignorar muñecos de nieve y montículos durante el salto; los banderines siempre provocan caída.
- [x] Detectar el contacto con los bordes y evitar que el personaje salga de la pista.
- [x] Al caer, detener el personaje dos segundos con una indicación visual. *(lógica hecha; visual provisional)*
- [x] Al levantarse, continuar desde el mismo punto con un segundo de inmunidad y parpadeo. *(lógica hecha; visual provisional)*
- [x] Evitar que el mismo obstáculo provoque una nueva caída al recuperarse.
- [x] Verificar ACE-03 y ACE-04.

## M5. Carrera individual

- [x] Cuenta regresiva de tres segundos con el personaje bloqueado.
- [x] Cronómetro desde el fin de la cuenta regresiva, con formato `MM:SS,d` truncado a décimas.
- [x] Detectar la llegada a la meta y detener el cronómetro.
- [x] `Esc` vuelve al menú descartando la carrera.
- [x] `ResultScene`: mostrar el tiempo y los botones «Revancha» y «Menú».
- [x] «Revancha» inicia una carrera nueva con otra distribución de obstáculos y la misma configuración.
- [x] Verificar ACE-05.

## M6. Top 10

- [x] En `leaderboard.js`, leer y escribir el top 10 en `localStorage` como JSON, tolerando datos ausentes o corruptos.
- [x] Insertar un tiempo nuevo respetando el orden: menor tiempo primero y, entre iguales, el más antiguo.
- [x] Limitar a diez entradas; un tiempo igual al décimo no entra.
- [x] Registrar solo carreras individuales terminadas.
- [x] Mostrar en `ResultScene` si el tiempo entró al top 10 y en qué posición.
- [x] `TopScene`: listar posición, nombre y tiempo, con opción de volver al menú.
- [x] Verificar ACE-07 recargando la página.

## M7. Dos jugadores

- [x] Crear dos `Rider` sobre la misma pista generada.
- [x] Asignar las flechas `←`/`→`, `↓`, `↑` a la persona 2.
- [x] Configurar dos cámaras en mitades izquierda y derecha, cada una siguiendo a un participante.
- [x] Asegurar que los participantes no colisionan entre sí.
- [x] Anunciar la llegada de quien termina primero y dejar que la otra persona siga.
- [x] Terminar la carrera cuando ambas llegan y mostrar ganador o empate a décimas en `ResultScene`.
- [ ] Probar pulsaciones simultáneas de ambas personas en el teclado de la demo.
- [ ] Verificar ACE-01, ACE-02 y ACE-06.

## M8. Menú y preparación

- [x] `MenuScene`: opciones «1 jugador», «2 jugadores» y «Top 10», navegables con teclado.
- [x] `SetupScene`: en modo individual, campo de nombre de 1 a 10 caracteres con «Jugador» por defecto.
- [x] Selección de color de casco y campera entre cinco colores, con vista previa del personaje. *(lógica hecha; visual provisional)*
- [x] Selección de tabla Rápida, Equilibrada o Ágil, mostrando sus efectos.
- [x] En modo de dos personas, preparación para ambas con nombres «Jugador 1» y «Jugador 2».
- [x] Pasar la configuración elegida a `RaceScene`.

## M10. Presentación visual

- [x] Exportar de Figma las ilustraciones (jugador, muñeco de nieve, montículo, banderín, bosque, ilustraciones de preparación y trofeo) a `public/assets/`.
- [x] Instalar la fuente Fredoka de forma local y esperar a que cargue antes de iniciar el juego.
- [x] `theme.js`: colores de fondo, pista, tramos, contorno y estilos de texto.
- [x] `assets.js`: cargar los SVG y generar una textura del jugador por combinación de casco y campera.
- [x] Ajustar los tamaños de colisión de obstáculos y jugador a las ilustraciones.
- [x] `trackView.js`: pista con tinte por tramo, bordes de color, cambios de tramo, salida, meta, bosque y obstáculos.
- [x] `riderView.js`: jugador con sus colores, huella en la nieve, salto con sombra, caída tumbada y parpadeo de inmunidad.
- [x] `hud.js`: etiqueta de tramo, cronómetro, nombre en dos personas y mensajes centrales.
- [x] `ui.js` y escenas: menú, preparación con tarjetas y vista previa, resultado con trofeo y top 10 en el estilo del diseño.
- [x] Quitar la representación provisional (`placeholders.js`).
- [x] Comparar cada pantalla con el diseño de Figma.

## M9. Ajuste y verificación

- [x] Ajustar longitud de la pista y velocidades para que un descenso sin errores dure aproximadamente un minuto.
- [x] Ajustar la densidad de obstáculos por tramo para que la dificultad crezca de verde a negro.
- [ ] Recorrer ACE-01 a ACE-07 y anotar el resultado de cada uno.
- [ ] Probar en Chrome y Firefox en el equipo de la demo.
- [ ] Revisar que no queden funciones fuera de alcance (spec.md, sección 12).

## M11. Mejoras de control y pantalla

- [x] Actualizar necesidades, especificación, arquitectura, plan y README con las mejoras.
- [x] En modo individual, usar las flechas en la carrera y en la ayuda de teclas de la preparación.
- [x] Reemplazar el freno por el acelerador: la velocidad crece de forma lineal hasta 3× la base del tramo mientras se mantiene `↓`/`S`.
- [x] Al soltar el acelerador, frenar de forma lineal hasta detenerse en dos segundos; tras una caída partir de cero.
- [x] Escalar el juego a la ventana con la escala `FIT` de Phaser.
- [x] Alternar la pantalla completa con `F`, salvo en la preparación, y mostrarlo en la ayuda del menú.
- [x] Al entrar al top 10, mostrar la tabla con la posición resaltada antes del resultado.
- [x] Alargar el salto a 0,7 s y hacer que el muñeco de nieve no se pueda saltar.
- [ ] Verificar ACE-05, ACE-07 y ACE-08.
