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
const win_score = document.querySelector("#win-score");
const game_mistake = document.querySelector("#mistake");
const score_screen = document.querySelector("#score");
const table_screen = document.querySelector("#leaderboard-container");
const show_name = document.querySelector("#leaderboard-name");
const show_pos = document.querySelector("#leaderboard-pos");
const show_score = document.querySelector("#leaderboard-score");
const show_mistakes = document.querySelector("#leaderboard-mistakes");
const show_level = document.querySelector("#leaderboard-level");
const btn_table = document.querySelector("#btn-leaderboard");
const btn_back = document.querySelector("#btn-back");
const btn_hints = document.querySelector("#btn-hints");
const hints_screen = document.querySelector("#hints-screen");
const btn_continue = document.querySelector("#btn-continue");
const continue_screen = document.querySelector("#continue-screen");
const btn_continue_new_game = document.querySelector("#btn_new_game");

const VARIABLES = {
  nivel: ["Facil", "Medio", "Dificil", "Muy Dificil"],
  level: ["Easy", "Medium", "Hard", "Very Hard"],
  nivel_index: [29, 38, 47, 56],
  puntaje: [1.5, 2.5, 4, 6],
  numeros_posibles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  pista: ["On", "Off"],
};

const time = (seconds) => new Date(seconds * 1000).toISOString().slice(11, 19);
const setPlayerName = (name) => localStorage.setItem("player-name", name);
const getPlayerName = () => localStorage.getItem("player-name");
const setTime = (time) => localStorage.setItem("time-info", time);
const getTime = () => localStorage.getItem("time-info");
const setMistakes = (mistakes) =>
  localStorage.setItem("info-mistakes", mistakes);
const getMistakes = () => localStorage.getItem("info-mistakes");
const setScore = (score) => localStorage.setItem("info-score", score);
const getScore = () => localStorage.getItem("info-score");
const getInfoGame = () => JSON.parse(localStorage.getItem("Game-info"));
const getContainer = () => JSON.parse(localStorage.getItem("info-container"));
const getGame = () => JSON.parse(localStorage.getItem("game"));

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
let points = 0;
let scoreValue = 0;
let infoContainer = [];
let info_game = {};
let score = VARIABLES.puntaje[level_index];
let realTime = "00:00:00";
let scoreUP = 0;
let pista_index = 0;
let pista = VARIABLES.pista[pista_index];
let laguange = document.URL; // Trabajamos con document.URL y no con windows.location porqeu este ultimo nos devuelve un objeto
let isSpanish = laguange.includes("index");



 
//------------------------------------------------------

function startGame() {
  screen_start.classList.add("active2");
  game_screen.classList.add("active");

  player_name.innerHTML = input_name.value.trim(); // Muestra el nombre en la pantalla
  setPlayerName(input_name.value.trim());
//Muestra el nivel seleccionado en la pantalla
  isSpanish ? level_display.innerText = VARIABLES.nivel[level_index] : level_display.innerText = VARIABLES.level[level_index] ;
  

  // Reloj
  time(seconds);

  timer = setInterval(() => {
    if (!pause) {
      seconds = seconds + 1;
      time_display.innerHTML = time(seconds);
      realTime = time(seconds);
    }
  }, 1000);
  //------------------------------------------------------
}

function restartScreen() {
  removeTileBoard();
  removeBoard();
  removeErrors();
  clearInterval(timer);
  pause = false;
  seconds = 0;
  mistakes = 0;
  points = 0;
  scoreUP = 0;
  scoreValue = 0;
  game_mistake.innerHTML = mistakes;
  time_display.innerHTML = time(seconds);
  score_screen.innerHTML = scoreValue;

  screen_win.classList.remove("active3");
  screen_pause.classList.remove("active3");
  continue_screen.classList.remove("active3")
  game_screen.classList.remove("active");
  screen_start.classList.remove("active2");

}
//---------------------------------------

const initSudoku = () => {
  su = genSudoku(nivel);
  su_answer = [...su.gameboard];
  saveGame();

  

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
        if (pista_index == 0) {
          removeTileBoard();
          tileBoard(index);
        }
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
        if (
          checkErrors + 1 &&
          tiles[tile_select].getAttribute("data-value") == 0
        ) {
          mistakes += 1;
          game_mistake.innerHTML = mistakes;
        } else {
          points += 1;
        }
       
        systemScore();
        
        score_screen.innerHTML = scoreValue;
        
        saveGame();
        
        if (wonGame()) {
          winGame();
          saveGameInfo();
          removeGame();
          
        }
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
const removeTileBoard = () => {
  tiles.forEach((element) => element.classList.remove("tile-board"));
};

//----------------------------------------------------
// Verifiacion si ganó el juego

const wonGame = () => sudokuCheck(su_answer);

//-----------------------

// Guardamos objeto con la info necesaria

const saveGameInfo = () => {
  info_game = {
    nameGame: getPlayerName(),
    timeGame: getTime(),
    mistakesGame: getMistakes(),
    scoreGame: getScore(),
    levelGame: level_index,
  };

  localStorage.setItem("Game-info", JSON.stringify(info_game));

  infoContainer.push(info_game);

  localStorage.setItem("info-container", JSON.stringify(infoContainer));
};

//----------------------------------------

// Guardado de partida

    const saveGame = () =>{
  let game ={
    level: level_index,
    seconds: seconds,
    mistakes: mistakes,
    score2: setScore(scoreValue),
    scoreUP: scoreUP,
    su:{
      original: su.original,
      gameboard: su.gameboard,
      answer: su_answer
    }
  }
  localStorage.setItem("game", JSON.stringify(game));

  
}   
 
//-----------------------------------------

// Carga de informacion

  const loadGame = () => {
  let game = getGame();


  su = game.su;
  su_answer = su.answer;
  seconds= game.seconds;
  mistakes = game.mistakes
  scoreValue = getScore();
  scoreUP= game.scoreUP;

  time_display.innerHTML = time(seconds);
  level_display.innerText = VARIABLES.nivel[level_index];
  game_mistake.innerHTML = mistakes;
  score_screen.innerHTML = scoreValue;

 
  

 

  for (let i = 0; i < 81; i++) {
    let row = Math.floor(i / 9);
    let col = i % 9;

    tiles[i].setAttribute("data-value", su.gameboard[row][col]);
    tiles[i].innerHTML = su_answer[row][col] !==0 ? su_answer[row][col] : "";
    if (su.gameboard[row][col] !== 0) {
      tiles[i].classList.add("black-number");
    }

    if (col === 2 || col === 5) tiles[i].style.marginRight = "5px";
    if (row === 2 || row === 5) tiles[i].style.marginBottom = "5px";
  }


}; 
 
//----------------------

// Garga de datos desde el JSON

async function loadDB() 
{
  try{
  let request;
  isSpanish ? request = await fetch("./JSON/dataBase.json") : request = await fetch("../JSON/dataBase.json");
  const data = await request.json();
  infoContainer.push(...data);
  localStorage.setItem("info-container", JSON.stringify(infoContainer));
}
  catch(e){
    alert("algo salio mal...");
    console.log(e);
  }

  
}

//-------------------------------------------

// Remueve la partida guardada 

 const removeGame = () =>{
  localStorage.removeItem("game");
} 

//-----------------------------------

// Ordenar resultados para la table

const resultOrder = () => {
  let get = getContainer();
  let container = get;

  container.sort(function (a, b) {
    if (a.scoreGame < b.scoreGame) {
      return 1;
    } else if (a.scoreGame > b.scoreGame) {
      return -1;
    } else return 0;
  });
  return container;
};

//---------------------------------

//mostrar los resultados

const showResult = () => {
  let result = resultOrder();

  result.forEach((e, index) => {
    let pos = document.createElement("span");
    pos.innerHTML = index + 1;
    document.getElementById("pos-container").appendChild(pos);
    let score = document.createElement("span");
    score.innerHTML = e.scoreGame;
    document.getElementById("score-container").appendChild(score);
    let name = document.createElement("span");
    name.innerHTML = e.nameGame;
    document.getElementById("name-container").appendChild(name);
    let mistake = document.createElement("span");
    mistake.innerHTML = e.mistakesGame;
    document.getElementById("mistake-container").appendChild(mistake);
    let level = document.createElement("span");
    isSpanish ? (level.innerHTML = VARIABLES.nivel[e.levelGame]) : (level.innerHTML = VARIABLES.level[e.levelGame])
    document.getElementById("level-container").appendChild(level);
  });
};

//---------------------------------------

// Sistema de puntuacion

const systemScore = () => {
  let timeNumber = Number(realTime.replace(/:/g, ""));

  let up = points * 50 * score;

  let down = mistakes * 100;

  if (timeNumber > 0 && timeNumber <= 40) {
    up = up * 4;
    scoreUP = scoreUP + up;
    points = 0;
  } else if (timeNumber > 40 && timeNumber <= 130) {
    up = up * 2.5;
    scoreUP = scoreUP + up;
    points = 0;
  } else if (timeNumber > 130 && timeNumber <= 500) {
    up = up * 1.5;
    scoreUP = scoreUP + up;
    points = 0;
  } else {
    scoreUP = scoreUP + up;
  }

  scoreValue = scoreUP - down;


  

  return scoreValue;
};

//----------------------------------

// Pantalla final

const winGame = () => {
  game_screen.classList.remove("active");

  pause = true;
  setTime(time(seconds));

  win_time.innerHTML = time(seconds);
  win_mistakes.innerHTML = mistakes;
  //scoreValue = systemScore();
  win_score.innerHTML = scoreValue;
  setScore(scoreValue);
  setMistakes(mistakes);

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

// Eliminamos la tabla anterior

const removeTable = () =>{
  let selectElement = document.querySelector(".leaderboard-screen");
  let reFill;
  if(isSpanish){
  reFill = ` <div class="pos" id="pos-container">Posición<span id="leaderboard-pos"></span></div>
<div class="score-table" id="score-container">Puntuacion<span id="leaderboard-score"></span></div>
<div class="mistakes-table" id="mistake-container">Errores<span id="leaderboard-mistakes"></span></div>

<div class="name-table" id="name-container">Nombre<span id="leaderboard-name"></span></div>
<div class="level-table" id="level-container">Nivel<span id="leaderboard-level"></span></div>`;
}else{
  reFill = ` <div class="pos" id="pos-container">Position<span id="leaderboard-pos"></span></div>
<div class="score-table" id="score-container">Score<span id="leaderboard-score"></span></div>
<div class="mistakes-table" id="mistake-container">Mistakes<span id="leaderboard-mistakes"></span></div>

<div class="name-table" id="name-container">Player Name<span id="leaderboard-name"></span></div>
<div class="level-table" id="level-container">Level<span id="leaderboard-level"></span></div>`;
}
  selectElement.innerHTML = reFill;
}

 

//------------------------------------

//Iniciadno juego a traves del click en new_game

new_game.addEventListener("click", () => {
  if (input_name.value.trim().length == 0) {
    setTimeout(() => {
      input_name.classList.add("error");
      input_name.focus();
    }, 500);
  } else {
    initSudoku();
    startGame();
  }
});
//-----------------------------------------------

//Iniciando juego a traves de un enter en el input

input_name.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    if (input_name.value.trim().length == 0) {
      setTimeout(() => {
        input_name.classList.add("error");
        input_name.focus();
      }, 500);
    } else {
      initSudoku();
      startGame();
    }
  }
});

//---------------------------------------------

//Botón selector de niveles

 btn_level.addEventListener("click", (e) => {
  level_index + 1 > VARIABLES.nivel_index.length - 1
    ? (level_index = 0)
    : (level_index = level_index + 1);

  nivel = VARIABLES.nivel_index[level_index];
  score = VARIABLES.puntaje[level_index];
  isSpanish ? e.target.innerHTML = VARIABLES.nivel[level_index] : e.target.innerHTML = VARIABLES.level[level_index];

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
  if(isSpanish){
  Swal.fire({
    title: "Esta seguro que desea salir?",
    text: "Perderá todo el progreso",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, salir",
  }).then((result) => {
    if (result.isConfirmed) {
      removeGame();
      restartScreen();
    }
  });
  }else{
    
      Swal.fire({
        title: "Are you sure you want to leave?",
        text: "You will lose all progress",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, quit",
      }).then((result) => {
        if (result.isConfirmed) {
          removeGame();
          restartScreen();
        }
      });

    }
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

// Botón screen game - posiciones
btn_table.addEventListener("click", () => {
  screen_start.classList.add("active2");
  removeTable();
  showResult();
  table_screen.classList.remove("active2");
});

//-----------------------------------------------

// Botón volver (clasificaciones)

btn_back.addEventListener("click", () => {
  table_screen.classList.add("active2");
  screen_start.classList.remove("active2");
});
//----------------------------------

// Botón pistas

btn_hints.addEventListener("click", () => {
  pista_index + 1 > VARIABLES.pista.length - 1
    ? (pista_index = 0)
    : (pista_index = pista_index + 1);

  hints_screen.innerHTML = VARIABLES.pista[pista_index];
});

//------------------------------------

// Botón continuar juego

 btn_continue.addEventListener("click", () =>{
  continue_screen.classList.remove("active3");
  loadGame();
  startGame();

}) 

//--------------------

// Botón nuevo juego menu de continuar

 btn_continue_new_game.addEventListener("click", () =>{
  if(isSpanish){
  Swal.fire({
    title: "Esta seguro que desea salir?",
    text: "Perderá todo el progreso",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, salir",
  }).then((result) => {
    if (result.isConfirmed) {
      removeGame();
      restartScreen();
    }
  });
  }else{
    
      Swal.fire({
        title: "Are you sure you want to leave?",
        text: "You will lose all progress",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, quit",
      }).then((result) => {
        if (result.isConfirmed) {
          removeGame();
          restartScreen();
        }
      });

    }

}) 

//---------------------------------

const init = () =>{
  window.addEventListener('load', () => {
    infoContainer == "" && loadDB();
  });

   const game = getGame();

  if(game){
    continue_screen.classList.add("active3");
    screen_start.classList.add("active2");
  }
  else{
    continue_screen.classList.remove("active3");
    screen_start.classList.remove("active2");

  } 

  
  
  inputNumber();
  tileSelect();
  getPlayerName() ? (input_name.value = getPlayerName()) : input_name.focus();
  getInfoGame() && (info_game = getContainer());
  getContainer() && (infoContainer = getContainer());

}

init();





//----------------------------------------------------
