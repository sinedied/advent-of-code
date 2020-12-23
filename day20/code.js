const { assert } = require('console');
const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n\n').filter(e => e);

// part 1
const tiles = {};
entries.forEach(str => {
  const lines = str.split('\n');
  const [_, i] = lines.shift().match(/Tile (\d+):/); 
  const data = lines.map(l => l.split(''));
  const top = data[0].join('');
  const bottom = data[data.length - 1].join('');
  const left = data.map(l => l[0]).join('');
  const right = data.map(l => l[l.length - 1]).join('');
  // we only need the 4 sides
  tiles[i] = [top, right, bottom, left];
});

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;
let tries = 0;

function solve() {
  const size = Math.sqrt(Object.keys(tiles).length);
  const states = [{ free: Object.keys(tiles), grid: genGrid(size), current: 0 }];

  while (states.length > 0) {
    const state = states.pop();
    const { free, grid } = state;
  
    if (free.length === 0) {
      // bingo!
      const last = size - 1;
      const result = grid[0][0].id *
        grid[0][last].id *
        grid[last][0].id *
        grid[last][last].id;
      console.log({ result });
      return grid;
    }
  
    generatePossibleStates(state, states, size);
  }
  console.log({ tries });
}

function generatePossibleStates(state, states, size) {
  const { free, grid, current } = state;
  const x = current % size;
  const y = Math.floor(current / size);
  free.forEach(id => {
    // add all possible next states
    genAllPositions(tiles[id])
      .filter(tile => canFit(tile, state, current, size))
      .forEach(tile => {
        const newGrid = copy(grid);
        newGrid[y][x] = { id, tile};
        const newFree = free.filter(i => i !== id);
        states.push({
          free: newFree,
          grid: newGrid,
          current: current + 1
        });
        tries++;
    });
  });
}

function canFit(tile, state, pos, size) {
  const { grid } = state;
  const x = pos % size;
  const y = Math.floor(pos / size);
  const fitTop = (y === 0) || !grid[y - 1][x] ||
    tile[TOP] === grid[y - 1][x].tile[BOTTOM];
  const fitRight = (x === size - 1) || !grid[y][x + 1] ||
    tile[RIGHT] === grid[y][x + 1].tile[LEFT]
  const fitBottom = (y === size - 1) || !grid[y + 1][x] ||
    tile[BOTTOM] === grid[y + 1][x].tile[TOP];
  const fitLeft = (x === 0) || !grid[y][x - 1] ||
    tile[LEFT] === grid[y][x - 1].tile[RIGHT];
  return fitTop && fitRight && fitBottom && fitLeft;
}

function rotate(tile) {
  const [a, b, c, d] = tile;
  return [reverse(d), a, reverse(b), c];
}
assert(rotate(['12', '24', '34', '13']).join('') === '31124234', 'rotate');

function flipV(tile) {
  const [a, b, c, d] = tile;
  return [c, reverse(b), a, reverse(d)];
}
assert(flipV(['12', '24', '34', '13']).join('') === '34421231', 'flipV');

function flipH(tile) {
  const [a, b, c, d] = tile;
  return [reverse(a), d, reverse(c), b];
}
assert(flipH(['12', '24', '34', '13']).join('') === '21134324', 'flipH');

function reverse(edge) {
  return edge.split('').reverse().join('');
}

function genAllPositions(tile) {
  const positions = [];
  for (let i = 0; i < 2; i++) {
    positions.push(tile);
    const tileFV = flipV(tile);
    positions.push(tileFV);
    positions.push(flipH(tile));
    positions.push(flipH(tileFV));
    tile = rotate(tile);
  }
  return positions;
}

function genGrid(size) {
  return new Array(size)
    .fill(0)
    .map(_ => new Array(size).fill(null));
}

function copy(grid) {
  return grid.map(row => [...row]);
}

const solvedGrid = solve();

// part 2