var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'hit');
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'miss');
  },
  displayGuesses: function (guesses) {
    var counterGuesses = document.getElementById('counterGuesses');
    counterGuesses.innerHTML = guesses;
  },
};
var model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships: [
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
  ],

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = 'hit';
        view.displayHit(guess);
        view.displayMessage('HIT');
        if (this.isSunk(ship)) {
          view.displayMessage('You sank my battleship');
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage('You missed');
    return false;
  },

  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== 'hit') {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip(); // locations randomly generated
      } while (this.collision(locations)); // true
      this.ships[i].locations = locations;
    }
  },

  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row;
    var col;
    if (direction === 1) {
      // generate horizontal ship:
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(
        Math.random() * (this.boardSize - (this.shipLength + 1))
      );
    } else {
      //generate vertical ship:
      row = Math.floor(
        Math.random() * (this.boardSize - (this.shipLength + 1))
      );
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // add location to array for new horizontal ship:
        newShipLocations.push(row + '' + (col + i));
      } else {
        // add location to array for new vertical ship:
        newShipLocations.push(row + i + '' + col);
      }
    }
    return newShipLocations;
  },

  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true; // there was collision
        }
      }
    }
    return false; // there was no collision
  },
};

var controller = {
  guesses: 0,

  processGuess: function (guess) {
    var location = parseGuess(guess);

    if (isNonRepeatingHitAttempt(location)) {
      if (location) {
        this.guesses++;
        var hit = model.fire(location);
        view.displayGuesses('Guesses: ' + this.guesses);
        if (hit && model.shipsSunk === model.numShips) {
          view.displayMessage(
            'You sank all my battleships, in ' + this.guesses + ' guesses'
          );
        }
      }
    }
  },
};

function parseGuess(guess) {
  var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (guess === null || guess.length !== 2) {
    alert('Ooops, please enter a letter and a number on the board.');
  } else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Ooops, isn't on the board.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert('Ooops, that-s off the board.');
    } else {
      return row + column;
    }
    return null;
  }
}

// Resuelto el Bug 1: no dejar que procese ni contabilice (guesses++) una guess que ya ha sido un hit.

function isNonRepeatingHitAttempt(attempt) {
  // sirve para no dejar que procese ni contabilice una guess que ya ha sido un hit.
  // hay que iterar por las localizaciones, ver si está entre ellas y si es así, comprobar si además está marcado como hit.
  // display: "Ya has atacado antes en este punto, prueba con otro distinto".
  for (var i = 0; i < model.numShips; i++) {
    var ship = model.ships[i];
    var indexAttempt = ship.locations.indexOf(attempt);

    if (indexAttempt >= 0) {
      // la localización del attempt sí está en el array de locations de algún barco
      var hit = ship.hits[indexAttempt];
      if (hit !== 'hit') {
        // y no está marcado el hit porque aún no fue tocado
        return true;
      } else {
        // si está marcado el hit porque ya fue tocado
        view.displayMessage(
          'You have already attacked at this point, try a different one'
        );
        return false;
      }
    } else {
      // -1 ---> la localización no está en ships.
      // Resuelto el bug 2: Facilitamos que pueda procesar también un miss devolviendo true para que el código arriba pueda continuar.
      return true;
    }
  }
}

// Posible mejora a futuro que no penalice repetir un hit ni tampoco un miss (que no permita guesses++ en caso de cualquier repetición):
function inNonRepetingAttempt(location) {
  // sirve para no dejar que procese ni contabilice una guess que ya ha sido hit o miss.
  // para ello debería almacenar en un array los misses, para poder saber cuándo se repite una location que fue miss (y seguir el mismo proceso que con un hit repetido).
}

function init() {
  var fireButton = document.getElementById('fireButton');
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById('guessInput');
  guessInput.onkeydown = handleKeyPress;

  model.generateShipLocations();
}
window.onload = init;

function handleFireButton() {
  var guessInput = document.getElementById('guessInput');
  var guess = guessInput.value;
  controller.processGuess(guess);

  guessInput.value = '';
}

function handleKeyPress(e) {
  var fireButton = document.getElementById('fireButton');
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

//View test:

// view.displayMiss('00';);
// view.displayHit('34');
// view.displayMiss('55');
// view.displayHit('12');
// view.displayMiss('25');
// view.displayHit('26');

// Fire test:
// model.fire('53');
// model.fire('06');
// model.fire('16');
// model.fire('26');
// model.fire('34');
// model.fire('24');
// model.fire('44');
// model.fire('12');
// model.fire('11');
// model.fire('10');

// Parse guess test:
// console.log(parseGuess('A0'));
// console.log(parseGuess('B6'));
// console.log(parseGuess('G3'));
// console.log(parseGuess('H0'));
// console.log(parseGuess('A7'));

// Controller test:
// controller.processGuess('A0');

// controller.processGuess('A6');
// controller.processGuess('B6');
// controller.processGuess('C6');

// controller.processGuess('C4');
// controller.processGuess('D4');
// controller.processGuess('E4');

// controller.processGuess('B0');
// controller.processGuess('B1');
// controller.processGuess('B2');
