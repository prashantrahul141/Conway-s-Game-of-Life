// each cell's dimension.
const CELL_DIMENSION = 40;

let COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
let ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);
let PLAYING = false;
let CACHED_DATA_STATE: Array<Array<number>> = [];

const prepopulate_cache = () => {
  CACHED_DATA_STATE = [];
  for (let i = 0; i < ROWS; i++) {
    CACHED_DATA_STATE.push(new Array(COLUMNS));
  }

  cacheCells();
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

// cache all cells state.
const cacheCells = () => {
  const allCells = Array.from(wrapper.childNodes);

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const _currentCell = allCells[i * j] as HTMLDivElement;

      CACHED_DATA_STATE[i][j] =
        _currentCell.getAttribute('data-state') === 'false' ? 0 : 1;
    }
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
  prepopulate_cache();
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
  if (PLAYING) {
    setTimeout(nextStep, 0.5);
  }
};
// handleCell for play button.
const handleClickPlayButton = (event: MouseEvent) => {
  setPlaying(!PLAYING);
  // changing playing state variable.
};

play_button.onclick = handleClickPlayButton;
