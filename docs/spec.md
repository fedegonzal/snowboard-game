# Especificación funcional del juego de snowboard

## 1. Estado y alcance

**Documento cerrado.** Línea base funcional derivada de [needs.md](./needs.md), simplificada para una demo de clase universitaria cuyo objetivo es mostrar el proceso de construir un proyecto con ayuda de IA, no producir un juego completo.

Criterio general: ante la duda, se elige la opción más simple de implementar y de explicar. Lo que no figura aquí queda fuera de alcance.

Las decisiones técnicas están en [architec.md](./architec.md).

## 2. Concepto

| ID | Requisito |
| --- | --- |
| OBJ-01 | Juego de carreras de snowboard en 2D, con vista desde arriba y descenso vertical: el personaje baja por la pantalla y la pista se desplaza. Personajes y objetos se dibujan como ilustraciones planas (ver sección 10). |
| OBJ-02 | Modo individual: completar el descenso en el menor tiempo posible y entrar en el top 10. |
| OBJ-03 | Modo de dos personas: en el mismo teclado, con pantalla dividida en dos mitades verticales (izquierda y derecha). Gana quien cruce primero la meta; igualdad a décimas de segundo es empate. |

## 3. Pista

| ID | Requisito |
| --- | --- |
| PIS-01 | Una única pista recta con salida y meta. Un descenso sin errores a la velocidad base dura aproximadamente un minuto. |
| PIS-02 | La pista tiene cuatro tramos consecutivos de igual longitud, coloreados verde, azul, rojo y negro. Cada tramo tiene una velocidad base mayor que el anterior. |
| PIS-03 | Hay un bosque decorativo a ambos lados, fuera de la pista. Los bordes de la pista no se pueden atravesar. |
| PIS-04 | Los obstáculos se colocan al azar al empezar cada carrera. En modo de dos personas, ambas reciben la misma distribución. |

## 4. Controles y movimiento

| ID | Requisito |
| --- | --- |
| MOV-01 | Acciones: izquierda, derecha, acelerar y saltar. No hay acción para frenar: se frena soltando el acelerador. |
| MOV-02 | Teclas: persona 1 usa `A`/`D` (lateral), `S` (acelerar), `W` (saltar). Persona 2 usa las flechas `←`/`→`, `↓` y `↑`. En modo individual se usan las flechas. |
| MOV-03 | Mientras se mantiene el acelerador, la velocidad de descenso crece de forma lineal hasta un máximo de tres veces la velocidad base del tramo actual. Al soltarlo, baja de forma lineal hasta detenerse en dos segundos. Mientras se mueve lateralmente, el descenso se reduce a un 80 %. Tras una caída se parte de velocidad cero. |
| MOV-04 | El salto se puede usar en cualquier momento y dura 0,7 segundos; durante el salto se ignoran los obstáculos bajos (montículos). |

## 5. Obstáculos y caídas

| ID | Requisito |
| --- | --- |
| OBS-01 | Tipos de obstáculo: montículos (se evitan saltando o esquivando), y muñecos de nieve y banderines (solo se evitan esquivando). |
| OBS-02 | Chocar con un obstáculo o con el borde provoca una caída: el personaje queda detenido dos segundos y luego continúa desde el mismo punto. No se suman penalizaciones al tiempo. |
| OBS-03 | Tras levantarse, el personaje es inmune a caídas durante un segundo (se muestra parpadeando). |
| OBS-04 | Los participantes no interactúan entre sí: pueden superponerse sin efecto. |

## 6. Carrera

| ID | Requisito |
| --- | --- |
| CAR-01 | Cada carrera empieza con una cuenta regresiva de tres segundos; durante ella nadie puede moverse. |
| CAR-02 | Se muestra el cronómetro en formato `MM:SS,d` (por ejemplo `01:02,3`), truncando a décimas. |
| CAR-03 | En modo de dos personas, cuando alguien llega a la meta se anuncia su llegada; la otra persona sigue hasta llegar. La carrera termina cuando ambas llegan. |
| CAR-04 | No hay límite de tiempo, abandono ni pausa. Se puede volver al menú con `Esc`, descartando la carrera. |
| CAR-05 | Al terminar se muestra el resultado y las opciones «Revancha» (nueva distribución de obstáculos) y «Menú». |

## 7. Personalización y nombre

| ID | Requisito |
| --- | --- |
| PER-01 | Antes de correr, cada participante elige el color de casco, el color de campera (entre cinco colores cada uno) y una de tres tablas. |
| PER-02 | Casco y campera solo cambian la apariencia. |
| PER-03 | Tablas: **Rápida** (velocidad ×1,1; movimiento lateral ×0,8), **Equilibrada** (×1; ×1) y **Ágil** (velocidad ×0,9; movimiento lateral ×1,2). |
| PER-04 | En modo individual se escribe un nombre de 1 a 10 caracteres (por defecto «Jugador»), que se usa en el top 10. En modo de dos personas se usan «Jugador 1» y «Jugador 2». |

## 8. Top 10

| ID | Requisito |
| --- | --- |
| CLA-01 | Solo el modo individual registra tiempos. Se guardan los diez mejores en el navegador del equipo. |
| CLA-02 | Una persona puede ocupar varias posiciones. Entre tiempos iguales queda primero el más antiguo; un tiempo igual al décimo no entra. |
| CLA-03 | El top 10 se puede ver desde el menú principal. Si un tiempo entra al top 10, al terminar la carrera se muestra la tabla con esa posición resaltada en el color de la campera, y luego el resultado. |

## 9. Pantallas

1. **Menú:** «1 jugador», «2 jugadores», «Top 10».
2. **Preparación:** nombre (individual), colores y tabla de cada participante.
3. **Carrera:** vista individual o pantalla dividida, con cronómetro y tramo actual.
4. **Resultado:** tiempos, ganador o posición en el top 10, «Revancha» y «Menú».

En cualquier pantalla, salvo la de preparación (donde se escribe el nombre), la tecla `F` activa o desactiva la pantalla completa. El juego se escala para ocupar la ventana o la pantalla manteniendo su proporción.

## 10. Presentación visual

El diseño de referencia está en Figma, página «Pista – en juego» del archivo [snowboard](https://www.figma.com/design/XJvLyYUUMLWfXdVWqBHq7s/snowboard?node-id=3-2), que incluye los componentes y las pantallas de preparación, carrera individual y carrera de dos personas.

| ID | Requisito |
| --- | --- |
| VIS-01 | Estilo ilustrado plano con contorno negro grueso, sobre fondo de nieve celeste claro. Tipografía Fredoka. |
| VIS-02 | Pista blanca con un tinte suave del color del tramo, bordes gruesos del color del tramo y una línea discontinua en cada cambio de tramo. Línea de salida y meta visibles. |
| VIS-03 | Bosque ilustrado repetido a ambos lados de la pista. |
| VIS-04 | Obstáculos: muñeco de nieve, montículo y banderín, con las ilustraciones del diseño. |
| VIS-05 | Jugador: ilustración del snowboarder con el casco y la campera en los colores elegidos. Deja una huella en la nieve. |
| VIS-06 | Estados del jugador: al saltar se agranda y proyecta una sombra; al caer queda tumbado; durante la inmunidad parpadea. |
| VIS-07 | Interfaz de carrera: etiqueta del tramo actual con su color arriba a la izquierda, cronómetro arriba a la derecha y mensajes grandes en el centro (cuenta regresiva, «¡Caída!», llegada). En dos personas, cada vista muestra además el nombre del participante sobre su color. |
| VIS-08 | Preparación: una tarjeta por participante con la vista previa del jugador en sus colores arriba a la izquierda, selectores de casco, campera y tabla con la fila activa resaltada, barras de velocidad y movimiento lateral de la tabla y ayuda de teclas. |
| VIS-09 | Menú, resultado y top 10 siguen el mismo estilo; el resultado muestra un trofeo al ganador o al entrar en el top 10. |

## 11. Criterios de aceptación

| ID | Situación | Resultado esperado |
| --- | --- | --- |
| ACE-01 | Se inicia una carrera de dos personas. | Pantalla dividida, cuenta regresiva de tres segundos y salida simultánea. |
| ACE-02 | Se compara la pista de ambas personas y luego se pide revancha. | Ambas tienen los mismos obstáculos; la revancha tiene una distribución distinta. |
| ACE-03 | Un personaje choca con un obstáculo o un borde. | Queda detenido dos segundos, continúa desde el mismo punto y parpadea un segundo sin poder caer. |
| ACE-04 | Un personaje salta sobre un montículo. | No cae. Un muñeco de nieve o un banderín sí lo hacen caer aunque salte. |
| ACE-05 | Se mantiene el acelerador y luego se suelta. | La velocidad crece hasta tres veces la base del tramo y, al soltar, se detiene en dos segundos (MOV-03). |
| ACE-08 | Se pulsa `F` en el menú o en la carrera. | El juego pasa a pantalla completa escalado sin deformarse; otra pulsación lo devuelve a la ventana. |
| ACE-06 | Ambas personas llegan con el mismo tiempo en décimas. | Se declara empate. |
| ACE-07 | Un tiempo individual entra en el top 10. | Se muestra la tabla con su posición resaltada; se guarda, se mantiene tras recargar la página y la lista nunca supera diez entradas. |

## 12. Fuera de alcance

Sonido, animaciones elaboradas, juego en red, mandos o controles táctiles, accesibilidad avanzada, límite de tiempo, pausa, curvas o rampas en la pista, desbloqueos y clasificación compartida entre equipos.
