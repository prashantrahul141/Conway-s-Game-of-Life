// each cell's dimension.
const CELL_DIMENSION = 40;

let COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
let ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);
let PLAYING = false;
let CACHED_DATA_STATE: Array<Array<number>> = [];

// make 2d array
const make2DArray = (y: number, x: number) => {
  const _array: Array<Array<number>> = [];

  for (let i = 0; i < y; i++) {
    _array.push(new Array(x).fill(0));
  }
  return _array;
};

// parent wrapper element.
const wrapper = document.getElementById('wrapper') as HTMLDivElement;
wrapper.innerText = '';

// play button element.
const play_button = document.getElementById('play-button') as HTMLButtonElement;

// handleclick for cells.
const handleClickPerCell = (event: MouseEvent, index: number) => {
  const thisCell = event.target as HTMLDivElement;
  const cellState = thisCell.getAttribute('data-state') || 'false';
  const cellIndex = thisCell.getAttribute('data-index') as unknown as number;

  if (cellState === 'false') {
    thisCell.setAttribute('data-state', 'true');
    thisCell.classList.add('active-cell');
    CACHED_DATA_STATE[(cellIndex - (cellIndex % COLUMNS)) / COLUMNS][
      cellIndex % COLUMNS
    ] = 1;
  } else {
    thisCell.setAttribute('data-state', 'false');
    thisCell.classList.remove('active-cell');
    CACHED_DATA_STATE[(cellIndex - (cellIndex % COLUMNS)) / COLUMNS][
      cellIndex % COLUMNS
    ] = 0;
  }
};

// creates indiviual cell.
const createCell = (index: number) => {
  const cell = document.createElement('div');
  cell.setAttribute('data-state', 'false');
  cell.setAttribute('data-index', index.toString());
  cell.classList.add('cell');
  cell.onclick = (event) => handleClickPerCell(event, index);
  return cell;
};

// helper function to set playing variable and update states.
const setPlaying = (target: boolean) => {
  PLAYING = target;
  const play_svg_pause = document.getElementById(
    'play-button-pause'
  ) as HTMLElement;
  const play_svg_play = document.getElementById(
    'play-button-play'
  ) as HTMLElement;

  // changing button svg.
  if (PLAYING) {
    play_svg_play.classList.add('hidden');
    play_svg_pause.classList.remove('hidden');

    nextStep();
  } else {
    play_svg_play.classList.remove('hidden');
    play_svg_pause.classList.add('hidden');
  }
};

// creates all cell with given quantity.
const createAllCells = (quantity: number) => {
  Array.from(Array(quantity)).map((c, index) => {
    wrapper.appendChild(createCell(index));
  });
  wrapper.style.setProperty('--columns', COLUMNS.toString());
  wrapper.style.setProperty('--rows', ROWS.toString());
  setPlaying(false);
  CACHED_DATA_STATE = make2DArray(ROWS, COLUMNS);
};

// create initial cells.
createAllCells(COLUMNS * ROWS);

// creates intire grid incase of windows resizing.
const createGrid = () => {
  wrapper.innerHTML = '';

  COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
  ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);

  wrapper.style.setProperty('--columns', COLUMNS.toString());
  wrapper.style.setProperty('--rows', ROWS.toString());

  createAllCells(COLUMNS * ROWS);
};

// on window resize, recreate all cells.
window.onresize = createGrid;

// move forward the simulation.
const nextStep = () => {
  console.info('Moving next step.');
  const nextGeneration = make2DArray(ROWS, COLUMNS);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      const cellState = CACHED_DATA_STATE[y][x];
      let numberOfMembersActive = 0;

      // count sum.
      // by looping around the original cell.
      for (let i = y - 1; i < y + 2; i++) {
        for (let j = x - 1; j < x + 2; j++) {
          // ignoring end cells vertically.
          let temp_i, temp_j;
          switch (i) {
            case -1:
              temp_i = ROWS - 1;
              break;

            case ROWS:
              temp_i = 0;
              break;

            default:
              temp_i = i;
          }

          // ignoring end cells horizontally.
          switch (j) {
            case -1:
              temp_j = COLUMNS - 1;
              break;

            case COLUMNS:
              temp_j = 0;
              break;

            default:
              temp_j = j;
          }

          // // ignore if its original cell itself.
          if (!(temp_i == y && temp_j == x)) {
            numberOfMembersActive += CACHED_DATA_STATE[temp_i][temp_j];
          }
        }
      }
      // checking for current state of the current cell
      if (cellState) {
        // if cell is active.
        // Rule 1.
        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if (numberOfMembersActive < 2) {
          nextGeneration[y][x] = 0;
        }

        // Rule 2.
        // Any live cell with two or three live neighbours lives on to the next generation.
        else if (numberOfMembersActive === 3 || numberOfMembersActive === 2) {
          nextGeneration[y][x] = 1;
        }

        // Rule 3.
        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        else if (numberOfMembersActive > 3) {
          nextGeneration[y][x] = 0;
        }
      } else {
        // if cell is not active.
        // Rule 4.
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (numberOfMembersActive === 3) {
          nextGeneration[y][x] = 1;
        }
      }
    }
  }

  // updating cache data.
  CACHED_DATA_STATE = nextGeneration;

  // renders.
  const cellElements = wrapper.childNodes;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      const indexOfCell = y * COLUMNS + x;
      const currentCellElement = cellElements[indexOfCell] as HTMLDivElement;
      if (CACHED_DATA_STATE[y][x]) {
        currentCellElement.classList.add('active-cell');
        currentCellElement.setAttribute('data-state', 'true');
      } else {
        currentCellElement.classList.remove('active-cell');
        currentCellElement.setAttribute('data-state', 'false');
      }
    }
  }

  if (PLAYING) {
    setTimeout(nextStep, 100);
  }
};

// handleCell for play button.
const handleClickPlayButton = (event: MouseEvent) => {
  setPlaying(!PLAYING);
  // changing playing state variable.
};

play_button.onclick = handleClickPlayButton;
