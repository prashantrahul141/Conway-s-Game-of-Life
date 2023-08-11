"use strict";
const CELL_DIMENSION = 40;
let COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
let ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);
let PLAYING = false;
let CACHED_DATA_STATE = [];
const prepopulate_cache = () => {
    CACHED_DATA_STATE = [];
    for (let i = 0; i < ROWS; i++) {
        CACHED_DATA_STATE.push(new Array(COLUMNS));
    }
    cacheCells();
};
const wrapper = document.getElementById('wrapper');
wrapper.innerText = '';
const play_button = document.getElementById('play-button');
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
const cacheCells = () => {
    const allCells = Array.from(wrapper.childNodes);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const _currentCell = allCells[i * j];
            CACHED_DATA_STATE[i][j] =
                _currentCell.getAttribute('data-state') === 'false' ? 0 : 1;
        }
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
    prepopulate_cache();
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
    if (PLAYING) {
        setTimeout(nextStep, 0.5);
    }
};
const handleClickPlayButton = (event) => {
    setPlaying(!PLAYING);
};
play_button.onclick = handleClickPlayButton;
