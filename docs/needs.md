# Juego de snowboard

Este documento describe los requerimientos y necesidades para el desarrollo de un juego de snowboard.

Es un juego simple para explicar como desarrollar con especificaciones guiadas por AI a mis alumnos en la universidad.

## De qué se trata

Se puede jugar de una o dos personas a la vez, tipo carrera. La vista será 2D, se puede mover deracha e izquierda, saltar y frenar, no se puede ir mas rapido porque eso lo define la pendiente de la pista, que estara indicada con colores (verde, azul, rojo y negro). Habrá obstáculos que pueden ser personas caidas, banderines, monticulos, y los bordes de la pista. Alrededor de la pista habra arboles como un bosque, pero nunca dentro de la pista.

El juego tendra una sola pista y la dificultad es ganarle al otro jugador en tiempo. Si juega una sola persona, el objetivo es mejorar tiempos anteriores y entrar al top 10.

Queremos que el personaje se pueda personalizar antes de la carrera: casco, campera y tabla. La tabla podria tener atributos como adherencia (vincula velocidad y maniobrabilidad).

## Mejoras tras la primera versión

- Si juega una sola persona, se usan las flechas en lugar de las letras.
- La flecha hacia abajo (y la `S`) deja de frenar y pasa a acelerar: mientras se mantiene se va cada vez más rápido, hasta cinco veces la velocidad base que marca el color de la pista. Al soltarla se frena hasta detenerse en dos segundos.
- Se puede poner el juego en pantalla completa, escalando la imagen.
