//Matriz de ceros 9X9

function newMatrix() {
  let arr = new Array(9);
  for (let i = 0; i < 9; i++) {
    arr[i] = new Array(9);
  }
  for (let i = 0; i < Math.pow(9, 2); i++) {
    arr[Math.floor(i / 9)][i % 9] = 0;
  }
  return arr;
}

//---------------

// Esta función lo que hace es mezclar los numeros del array argumento

function shuffleArray(arr) {
  let curr_index = arr.length;

  while (curr_index !== 0) {
    let rand_index = Math.floor(Math.random() * curr_index);
    curr_index -= 1;

    let temp = arr[curr_index];
    arr[curr_index] = arr[rand_index];
    arr[rand_index] = temp;
  }
  return arr;
}

//--------------------------------------------------

// Chequeo de columna

function colPossible(grid, col, value) {
  for (let row = 0; row < 9; row++) {
    if (grid[row][col] === value) {
      return false;
    }
  }
  return true;
}
//--------------------------------------------------

//Chequeo de fila

function rowPossible(grid, row, value) {
  for (let col = 0; col < 9; col++) {
    if (grid[row][col] === value) {
      return false;
    }
  }
  return true;
}
//--------------------------------------------------

//Chequeo de Box 3x3

function boxPossible(grid, br, bc, value) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row + br][col + bc] === value) {
        return false;
      }
    }
  }
  return true;
}
//--------------------------------------------------

// Chequeo completo

const possible = (grid, row, col, value) => {
  return (
    colPossible(grid, col, value) &&
    rowPossible(grid, row, value) &&
    boxPossible(grid, row - (row % 3), col - (col % 3), value) &&
    value !== 0
  );
};
//--------------------------------------------------

// recorrer matriz

const matrixPos = (grid, pos) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        pos.row = row;
        pos.col = col;
        return true;
      }
    }
  }
  return false;
};
//--------------------------------------------------

//se fija si la matriz está completa

const fullGrid = (grid) => {
  return grid.every((row, i) => {
    return row.every((value, j) => {
      return value !== 0;
    });
  });
};
//--------------------------------------------------

// creación de tablero

const sudokuCreate = (grid) => {
  let pos = {
    row: 0,
    col: 0,
  };

  if (!matrixPos(grid, pos)) {
    return true;
  }

  let number_list = shuffleArray([...VARIABLES.numeros_posibles]);

  let row = pos.row;
  let col = pos.col;

  number_list.forEach((num, i) => {
    if (possible(grid, row, col, num)) {
      grid[row][col] = num;

      if (fullGrid(grid)) {
        return true;
      } else {
        if (sudokuCreate(grid)) {
          return true;
        }
      }

      grid[row][col] = 0;
    }
  });
  return fullGrid(grid);
};
//--------------------------------------------------

// Remover celdas al azar

function rand() {
  return Math.floor(Math.random() * 9);
}

const removeNumber = (grid, nivel) => {
  let res = [...grid];
  let index = nivel;

  while (index > 0) {
    let row = rand();
    let col = rand();
    while (res[row][col] === 0) {
      row = rand();
      col = rand();
    }
    res[row][col] = 0;
    index--;
  }
  return res;
};

//--------------------------------------------------

//Crear Sudoku

const genSudoku = (nivel) => {
  let sudoku = newMatrix();
  let check = sudokuCreate(sudoku);
  if (check) {
    let gameboard = removeNumber(sudoku, nivel);
    return {
      original: sudoku,
      gameboard: gameboard,
    };
  }
  return undefined;
};
//--------------------------------------------------

const sudokuCheck = (grid) => {
  let pos = {
    row: 0,
    col: 0,
  };

  if (!matrixPos(grid, pos)) {
    return true;
  }

  grid.forEach((row, i) => {
    row.forEach((num, j) => {
      if (possible(grid, i, j, num)) {
        if (fullGrid(grid)) {
          return true;
        } else {
          if (sudokuCreate(grid)) {
            return true;
          }
        }
      }
    });
  });
  return fullGrid(grid);
};
