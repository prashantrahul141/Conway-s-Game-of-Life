"use strict";
// each cell's dimension
const CELL_DIMENSION = 40;
let COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
let ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);
const wrapper = document.getElementById('wrapper');
wrapper.style.setProperty('--columns', COLUMNS.toString());
wrapper.style.setProperty('--rows', ROWS.toString());
const createAllCells = (num) => { };
// incase of window resize.
const createGrid = () => {
    wrapper.innerHTML = '';
    COLUMNS = Math.floor(window.innerWidth / CELL_DIMENSION);
    ROWS = Math.floor(window.innerHeight / CELL_DIMENSION);
    // adding cells
};
window.onresize = createGrid;
