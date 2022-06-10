// Declaraciones de constantes

const screen_start = document.querySelector("#start-screen");
const input_name = document.querySelector("#input-name");
const new_game = document.querySelector("#new-game");
const game_screen = document.querySelector("#screen-game");
const player_name = document.querySelector("#player-name");
const btn_level = document.querySelector("#btn-level");
const level_display = document.querySelector("#level");
const time_display = document.querySelector("#time");
const btn_pause = document.querySelector("#btn-pause");
const screen_pause = document.querySelector("#screen-pause");
const btn_resume = document.querySelector("#btn-return");
const btn_pause_new_game = document.querySelector("#new_game");
const tiles = document.querySelectorAll(".tile");
const numbers_inputs = document.querySelectorAll(".tile-digits");
const btn_remove = document.querySelector("#btn-remove");
const screen_win = document.querySelector("#winGame-container");
const btn_win_new_game = document.querySelector("#new-game-win");
const win_time = document.querySelector("#win-time");
const win_mistakes = document.querySelector("#win-mistakes");
const game_mistake = document.querySelector("#mistake");

const VARIABLES = {
  nivel: ["Facil", "Medio", "Dificil", "Muy Dificil"],
  nivel_index: [29, 38, 47, 56],
  puntaje: [0.25, 0.5, 0.75, 1],
  numeros_posibles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

const time = (seconds) => new Date(seconds * 1000).toISOString().slice(11, 19);

const setPlayerName = (name) => localStorage.setItem("player-name", name);
const getPlayerName = () => localStorage.getItem("player-name");

//----------------------------------------------------

//Declaraciones de variables globales
let seconds = 0;
let pause = false;
let level_index = 0;
let nivel = VARIABLES.nivel_index[level_index];
let timer = null;
let su = undefined;
let su_answer = undefined;
let tile_select = 0;
let mistakes = 0;

//------------------------------------------------------

function startGame() {
  screen_start.classList.add("active2");
  game_screen.classList.add("active");

  player_name.innerHTML = input_name.value.trim(); // Muestra el nombre en la pantalla
  setPlayerName(input_name.value.trim());
  level_display.innerText = VARIABLES.nivel[level_index]; //Muestra el nivel seleccionado en la pantalla

  // Reloj
  time(seconds);

  timer = setInterval(() => {
    if (!pause) {
      seconds = seconds + 1;
      time_display.innerHTML = time(seconds);
    }
  }, 1000);
  //------------------------------------------------------
}

function restartScreen() {
  removeBoard();
  removeErrors();
  clearInterval(timer);
  pause = false;
  seconds = 0;
  mistakes = 0;
  game_mistake.innerHTML = mistakes;
  time_display.innerHTML = time(seconds);

  screen_win.classList.remove("active3");
  screen_pause.classList.remove("active3");
  game_screen.classList.remove("active");
  screen_start.classList.remove("active2");
}
//---------------------------------------

const initSudoku = () => {
  su = genSudoku(nivel);
  su_answer = [...su.gameboard];

  // Mostrar numeros en tablero
  for (let i = 0; i < 81; i++) {
    let row = Math.floor(i / 9);
    let col = i % 9;

    tiles[i].setAttribute("data-value", su.gameboard[row][col]);
    if (su.gameboard[row][col] !== 0) {
      tiles[i].classList.add("black-number");
      tiles[i].innerHTML = su.gameboard[row][col];
    }

    if (col === 2 || col === 5) tiles[i].style.marginRight = "5px";
    if (row === 2 || row === 5) tiles[i].style.marginBottom = "5px";
  }
};

//-----------------------------

// Agregamos funcionalidad al Board (espera click y marca la casilla seleccionada)

const tileSelect = () => {
  tiles.forEach((elements, index) => {
    elements.addEventListener("click", () => {
      if (!elements.classList.contains("black-number")) {
        tiles.forEach((e) => e.classList.remove("tile-selected")); // esta linea elimina la casilla selecionada anteriormente para que solo aparezca una casilla marcada
        tile_select = index; // Esta linea lo que hace es guardar la posicion seleccionada para despues poder pasarle el numero en ese lugar.
        elements.classList.add("tile-selected");
        removeTileBoard();
        tileBoard(index);
      }
    });
  });
};
//--------------------------------
// Colocamos el número seleccionada, en la casilla guardada anteriormente

const inputNumber = () => {
  numbers_inputs.forEach((elements, index) => {
    elements.addEventListener("click", () => {
      if (!tiles[tile_select].classList.contains("black-number")) {
        tiles[tile_select].innerHTML = index + 1;
        tiles[tile_select].setAttribute("data-value", index + 1);

        let row = Math.floor(tile_select / 9);
        let col = tile_select % 9;

        su_answer[row][col] = index + 1;

        removeErrors();
        checkErrors(index + 1);
         if (checkErrors + 1 && tiles[tile_select].getAttribute("data-value") == 0) {
          mistakes += 1;
          game_mistake.innerHTML = mistakes;
        }
        console.table(su_answer); 

        wonGame() && winGame();
      }
    });
  });
};

//--------------------------------------------------------------

// Mostramos si hay números repetidos

const checkErrors = (value) => {
  const addErrors = (tile) => {
    if (Number(tile.getAttribute("data-value")) === value) {
      tile.classList.add("number-error");
      tile.classList.add("number-error-animated");
      setTimeout(() => {
        tile.classList.remove("number-error-animated");
      }, 500);
      tiles[tile_select].setAttribute("data-value", 0);

      let row = Math.floor(tile_select / 9);
      let col = tile_select % 9;

      su_answer[row][col] = 0;
    }
  };

  let row = Math.floor(tile_select / 9);
  let col = tile_select % 9;

  let box_row = row - (row % 3);
  let box_col = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let tile = tiles[9 * (box_row + i) + (box_col + j)];
      !tile.classList.contains("tile-selected") && addErrors(tile);
    }
  }

  let step = 9;

  while (tile_select - step >= 0) {
    addErrors(tiles[tile_select - step]);
    step += 9;
  }

  step = 9;

  while (tile_select + step < 81) {
    addErrors(tiles[tile_select + step]);
    step += 9;
  }

  step = 1;

  while (tile_select - step >= 9 * row) {
    addErrors(tiles[tile_select - step]);
    step += 1;
  }

  step = 1;

  while (tile_select + step < 9 * row + 9) {
    addErrors(tiles[tile_select + step]);
    step += 1;
  }
};

//------------------------------------------

//COn la misma funcion de mostrar numeros repetirdos mostramos las filas, columnas y box de la casilla seleccionada

const tileBoard = (index) => {
  let row = Math.floor(index / 9);
  let col = index % 9;

  let box_row = row - (row % 3);
  let box_col = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let tile = tiles[9 * (box_row + i) + (box_col + j)];
      tile.classList.add("tile-board");
    }
  }

  let step = 9;

  while (index - step >= 0) {
    tiles[index - step].classList.add("tile-board");
    step += 9;
  }

  step = 9;

  while (index + step < 81) {
    tiles[index + step].classList.add("tile-board");
    step += 9;
  }

  step = 1;

  while (index - step >= 9 * row) {
    tiles[index - step].classList.add("tile-board");
    step += 1;
  }

  step = 1;

  while (index + step < 9 * row + 9) {
    tiles[index + step].classList.add("tile-board");
    step += 1;
  }
};


//-----------------------------------------------------------------

//Eliminamos las ayudas anteriores
const removeTileBoard = () =>{
  tiles.forEach(element => element.classList.remove("tile-board"))
}

//----------------------------------------------------
// Verifiacion si ganó el juego

const wonGame = () => sudokuCheck(su_answer);

//-----------------------

// Pantalla final

const winGame = () => {
  game_screen.classList.remove("active");

  pause = true;
  win_time.innerHTML = time(seconds);
  win_mistakes.innerHTML = mistakes;
  screen_win.classList.add("active3");

  btn_win_new_game.addEventListener("click", () => {
    restartScreen();
  });
};

//-----------------------------------

// Eliminamos el error anterior.

const removeErrors = () => {
  tiles.forEach((e) => e.classList.remove("number-error"));
};

//----------------------------------------

//Eliminar el sudoku anterior

const removeBoard = () => {
  for (let i = 0; i < 81; i++) {
    tiles[i].innerHTML = "";
    tiles[i].classList.remove("tile-selected");
    tiles[i].classList.remove("black-number");
  }
};

//-------------------------------------

//Iniciadno juego a traves del click en new_game

new_game.addEventListener("click", () => {
  if (input_name.value.trim().length == 0) {
    setTimeout(() => {
      input_name.classList.add("error");
      input_name.focus();
    }, 500);
  } else {
    startGame();
    initSudoku();
  }
});
//-----------------------------------------------

//Iniciando juego a traves de un enter en el input

input_name.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    if (input_name.value.trim().length == 0) {
      setInterval(() => {
        input_name.classList.add("error");
        input_name.focus();
      }, 500);
    } else {
      startGame();
    }
  }
});

//---------------------------------------------

//Botón selector de niveles

btn_level.addEventListener("click", (e) => {
  if (level_index + 1 > VARIABLES.nivel_index.length - 1) {
    level_index = 0;
  } else {
    level_index = level_index + 1;
  }

  nivel = VARIABLES.nivel_index[level_index];
  e.target.innerHTML = VARIABLES.nivel[level_index];
});

//----------------------------------------

// Boton de Pausa

btn_pause.addEventListener("click", () => {
  pause = true;
  game_screen.classList.remove("active");
  screen_pause.classList.add("active3");
});

btn_resume.addEventListener("click", () => {
  pause = false;
  screen_pause.classList.remove("active3");
  game_screen.classList.add("active");
});

//------------------------------------------

//Boton Nuevo juego en menu de pausa

btn_pause_new_game.addEventListener("click", () => {
  restartScreen();
});

//-----------------------------------------------

//Boton remover casilla

btn_remove.addEventListener("click", () => {
  tiles[tile_select].innerHTML = "";
  tiles[tile_select].setAttribute("data-value", 0);

  let row = Math.floor(tile_select / 9);
  let col = tile_select % 9;

  su_answer[row][col] = 0;

  removeErrors();
});

//----------------------------------------------
inputNumber();
tileSelect();
getPlayerName() ? (input_name.value = getPlayerName()) : input_name.focus();

//----------------------------------------------------
