# ¡Bienvenid@ al proyecto BATTLESHIP GAME o hundir el barco!

## ¿Qué estoy aprendiendo con este proyecto?

- Estoy afianzando los conceptos aprendidos hasta ahora en el divertido y completísimo manual Head First Javascript Programing (de Freeman & Robson), que desde ya recomiendo a todo el mundo con interés en aprender bien -pero bien de verdad- Javascript.

- Después de haber leído el capítulo 8 del manual HFJS y haber practicado el contenido en local, me animo a plantear y desarrollar esta aplicación web para afianzar los conocimientos adquiridos hasta el momento.

- La aplicación está planteada desde la Programación Orientada a Objetos (POO), de modo que queda dividida en 3 grandes objetos: model, controller y view, cada cual con sus propias responsabilidades separadas.
La responsabilidad de "model" es almacenar el estado del juego e implementar la lógica que modifica ese estado.
El objeto "view" es el encargado de actualizar la vista cuando el estado del juego cambia.
"Controller" se encarga de engarzar todo el juego, de modo que garantice que la jugada del jugador ha sido enviada al "model" y checkear que el juego se ha completado.

## Pasos para creación de la app:

1º - Crear la estructura del HTML y conseguir que se visualice el tablero, las imágenes de tocado ("hit")/ fuera("miss"), los mensajes y el formulario para introducir la jugada con CSS.

2º Organizar el proyecto en objetos (POO) con responsabilidades separadas e implementar cada uno de ellos. Serán 3:
  - View
  - Model
  - Controler