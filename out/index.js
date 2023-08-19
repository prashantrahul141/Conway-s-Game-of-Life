"use strict";
const CELL_DIMENSION = 40;
let COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
let ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);
let PLAYING = false;
let CACHED_DATA_STATE = [];
const make2DArray = (y, x) => {
    const _array = [];
    for (let i = 0; i < y; i++) {
        _array.push(new Array(x).fill(0));
    }
    return _array;
};
const wrapper = document.getElementById('wrapper');
wrapper.innerText = '';
const play_button = document.getElementById('play-button');
const inverse_button = document.getElementById('inverse-button');
const handleClickPerCell = (event, index) => {
    const thisCell = event.target;
    const cellState = thisCell.getAttribute('data-state') || 'false';
    const cellIndex = thisCell.getAttribute('data-index');
    if (cellState === 'false') {
        thisCell.setAttribute('data-state', 'true');
        thisCell.classList.add('active-cell');
        CACHED_DATA_STATE[(cellIndex - (cellIndex % COLUMNS)) / COLUMNS][cellIndex % COLUMNS] = 1;
    }
    else {
        thisCell.setAttribute('data-state', 'false');
        thisCell.classList.remove('active-cell');
        CACHED_DATA_STATE[(cellIndex - (cellIndex % COLUMNS)) / COLUMNS][cellIndex % COLUMNS] = 0;
    }
};
const createCell = (index) => {
    const cell = document.createElement('div');
    cell.setAttribute('data-state', 'false');
    cell.setAttribute('data-index', index.toString());
    cell.classList.add('cell');
    cell.onclick = (event) => handleClickPerCell(event, index);
    return cell;
};
const setPlaying = (target) => {
    PLAYING = target;
    const play_svg_pause = document.getElementById('play-button-pause');
    const play_svg_play = document.getElementById('play-button-play');
    if (PLAYING) {
        play_svg_play.classList.add('hidden');
        play_svg_pause.classList.remove('hidden');
        nextStep();
    }
    else {
        play_svg_play.classList.remove('hidden');
        play_svg_pause.classList.add('hidden');
    }
};
const createAllCells = (quantity) => {
    Array.from(Array(quantity)).map((c, index) => {
        wrapper.appendChild(createCell(index));
    });
    wrapper.style.setProperty('--columns', COLUMNS.toString());
    wrapper.style.setProperty('--rows', ROWS.toString());
    setPlaying(false);
    CACHED_DATA_STATE = make2DArray(ROWS, COLUMNS);
};
createAllCells(COLUMNS * ROWS);
const createGrid = () => {
    wrapper.innerHTML = '';
    COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
    ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);
    wrapper.style.setProperty('--columns', COLUMNS.toString());
    wrapper.style.setProperty('--rows', ROWS.toString());
    createAllCells(COLUMNS * ROWS);
};
window.onresize = createGrid;
const nextStep = () => {
    console.info('Moving next step.');
    const nextGeneration = make2DArray(ROWS, COLUMNS);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLUMNS; x++) {
            const cellState = CACHED_DATA_STATE[y][x];
            let numberOfMembersActive = 0;
            for (let i = y - 1; i < y + 2; i++) {
                for (let j = x - 1; j < x + 2; j++) {
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
                    if (!(temp_i == y && temp_j == x)) {
                        numberOfMembersActive += CACHED_DATA_STATE[temp_i][temp_j];
                    }
                }
            }
            if (cellState) {
                if (numberOfMembersActive < 2) {
                    nextGeneration[y][x] = 0;
                }
                else if (numberOfMembersActive === 3 || numberOfMembersActive === 2) {
                    nextGeneration[y][x] = 1;
                }
                else if (numberOfMembersActive > 3) {
                    nextGeneration[y][x] = 0;
                }
            }
            else {
                if (numberOfMembersActive === 3) {
                    nextGeneration[y][x] = 1;
                }
            }
        }
    }
    CACHED_DATA_STATE = nextGeneration;
    const cellElements = wrapper.childNodes;
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLUMNS; x++) {
            const indexOfCell = y * COLUMNS + x;
            const currentCellElement = cellElements[indexOfCell];
            if (CACHED_DATA_STATE[y][x]) {
                currentCellElement.classList.add('active-cell');
                currentCellElement.setAttribute('data-state', 'true');
            }
            else {
                currentCellElement.classList.remove('active-cell');
                currentCellElement.setAttribute('data-state', 'false');
            }
        }
    }
    if (PLAYING) {
        setTimeout(nextStep, 100);
    }
};
const handleClickPlayButton = (event) => {
    setPlaying(!PLAYING);
};
const handleInverseButton = () => {
    console.info('Inversing all cells.');
    const childCells = wrapper.childNodes;
    CACHED_DATA_STATE = CACHED_DATA_STATE.map((cellArray, i) => {
        return cellArray.map((cell, j) => {
            const cellElement = childCells[i * COLUMNS + j];
            if (cell) {
                cellElement.classList.remove('active-cell');
                cellElement.setAttribute('data-status', 'false');
            }
            else {
                cellElement.classList.add('active-cell');
                cellElement.setAttribute('data-status', 'true');
            }
            return Number(!cell);
        });
    });
};
inverse_button.onclick = handleInverseButton;
play_button.onclick = handleClickPlayButton;
