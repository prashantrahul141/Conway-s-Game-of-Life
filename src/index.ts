// each cell's dimension.
const CELL_DIMENSION = 40;

let COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
let ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);

// parent wrapper element.
const wrapper = document.getElementById('wrapper') as HTMLDivElement;

const handleClick = (event: MouseEvent, index: number) => {
  const thisCell = event.target as HTMLDivElement;
  const cellState = thisCell.getAttribute('data-state') || 'false';

  if (cellState === 'false') {
    thisCell.setAttribute('data-state', 'true');
    thisCell.classList.add('active-cell');
  } else {
    thisCell.setAttribute('data-state', 'false');
    thisCell.classList.remove('active-cell');
  }
};

// creates indiviual cell.
const createCell = (index: number) => {
  const cell = document.createElement('div');
  cell.setAttribute('data-state', 'false');
  cell.classList.add('cell');
  cell.onclick = (event) => handleClick(event, index);
  return cell;
};

// creates all cell with given quantity.
const createAllCells = (quantity: number) => {
  Array.from(Array(quantity)).map((c, index) => {
    wrapper.appendChild(createCell(index));
  });
  wrapper.style.setProperty('--columns', COLUMNS.toString());
  wrapper.style.setProperty('--rows', ROWS.toString());
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
