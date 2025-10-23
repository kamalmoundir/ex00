const gridSize = 4;
let grid = [];
let score = 0;

const gridContainer = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');

function init() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  score = 0;
  updateScore(0);
  addRandomTile();
  addRandomTile();
  renderGrid();
}

function updateScore(points) {
  score += points;
  scoreDisplay.textContent = score;
}

function addRandomTile() {
  const emptyCells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === 0) emptyCells.push({ r, c });
    }
  }
  if (emptyCells.length === 0) return;

  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function renderGrid() {
  gridContainer.innerHTML = '';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const value = grid[r][c];
      const cell = document.createElement('div');
      // base class + value-based tile class
      if (value === 0) {
        cell.className = 'grid-cell tile-empty';
        cell.textContent = '';
      } else {
        cell.className = 'grid-cell tile-' + value;
        cell.textContent = value;
      }
      gridContainer.appendChild(cell);
    }
  }
}

function move(direction) {
  let moved = false;
  let totalPoints = 0;

  for (let i = 0; i < gridSize; i++) {
    // Get one row or column depending on direction
    let line = getLine(i, direction);

    if (direction === 'right' || direction === 'down') line.reverse();

    // Merge tiles
    const { mergedLine, pointsGained } = mergeLine(line);
    totalPoints += pointsGained;

    if (direction === 'right' || direction === 'down') mergedLine.reverse();

    // Write the updated line back to the grid
    if (setLine(i, mergedLine, direction)) moved = true;
  }

  if (moved) {
    updateScore(totalPoints);
    addRandomTile();
    renderGrid();

    if (isGameOver()) alert(`Game Over! Your score: ${score}`);
  }
}

// Merge a single line (e.g., [2, 2, 4, 0])
function mergeLine(line) {
  let filtered = line.filter(val => val !== 0);
  let pointsGained = 0;

  for (let k = 0; k < filtered.length - 1; k++) {
    if (filtered[k] === filtered[k + 1]) {
      filtered[k] *= 2;
      pointsGained += filtered[k];
      filtered.splice(k + 1, 1);
    }
  }

  while (filtered.length < gridSize) filtered.push(0);

  return { mergedLine: filtered, pointsGained };
}

// Return one line from grid
function getLine(index, direction) {
  const line = [];
  for (let j = 0; j < gridSize; j++) {
    const value =
      direction === 'left' || direction === 'right' ? grid[index][j] : grid[j][index];
    line.push(value);
  }
  return line;
}

function setLine(index, newLine, direction) {
  let moved = false;

  for (let j = 0; j < gridSize; j++) {
    let oldVal, newVal;

    if (direction === 'up' || direction === 'down') {
      oldVal = grid[j][index];
      newVal = direction === 'up' ? newLine[j] : newLine[gridSize - 1 - j];
      grid[j][index] = newVal;
    } else {
      oldVal = grid[index][j];
      newVal = direction === 'left' ? newLine[j] : newLine[gridSize - 1 - j];
      grid[index][j] = newVal;
    }

    if (oldVal !== newVal) moved = true;
  }

  return moved;
}

function isGameOver() {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === 0) return false;
      if (c < gridSize - 1 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

// Keyboard events
document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft': move('left'); break;
    case 'ArrowRight': move('right'); break;
    case 'ArrowUp': move('up'); break;
    case 'ArrowDown': move('down'); break;
  }
});

restartButton.addEventListener('click', init);

init();
