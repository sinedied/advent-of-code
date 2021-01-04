const { assert } = require('console');
const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n\n').filter(e => e);

// part 1
const tiles = {};
const tileVariants = {};
const fullTiles = {};
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
  // generate all variants
  tileVariants[i] = genAllPositions(tiles[i]);
  // used only for part 2
  fullTiles[i] = data;
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
    tileVariants[id]
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

function genGrid(width, height) {
  height = height || width;
  return new Array(height)
    .fill(0)
    .map(_ => new Array(width).fill(null));
}

function copy(grid) {
  return grid.map(row => [...row]);
}

const solvedGrid = solve();

// part 2
const monster = [
  '                  # '.split(''),
  '#    ##    ##    ###'.split(''),
  ' #  #  #  #  #  #   '.split('')
];

const tileSize = solvedGrid[0][0].tile[0].length;
const fullSize = solvedGrid.length * tileSize;
let fullImage = rotateMat(buildImage());
fullImage = removeBorders(fullImage, tileSize);
let imageWithMonsters = copy(fullImage);
searchMonsters(fullImage);
// printMat(imageWithMonsters);
console.log(countRough(imageWithMonsters))

function removeBorders(image, tileSize) {
  const size = image.length;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (
        x % tileSize === 0 || (x + 1) % tileSize === 0 ||
        y % tileSize === 0 || (y + 1) % tileSize === 0
      )
        image[y][x] = null; 
  return image
    .map(r => r.filter(v => v))
    .filter(c => c.length);
}

function searchMonsters(image) {
  // make the monster a "tile" for variant generation
  fullTiles[0] = monster;
  const monsterVariants = [...Array(8).keys()].map(i => getFullTileVariant(0, i));
  monsterVariants.some(m => searchMonster(image, m));
}

function searchMonster(image, monster) {
  let hasMonster = false;
  const fullSize = image.length;
  const monsterHeight = monster.length;
  const monsterWidth = monster[0].length;
  for (let y = 0; y < fullSize - monsterHeight; y++) {
    for (let x = 0; x < fullSize - monsterWidth; x++) {
      if (matchMonster(image, monster, x, y)) {
        writeMonster(imageWithMonsters, monster, x, y);
        hasMonster = true;
      }
    }
  }
  return hasMonster;
}

function matchMonster(image, monster, x, y) {
  const monsterHeight = monster.length;
  const monsterWidth = monster[0].length;
  for (let my = 0; my < monsterHeight; my++)
    for (let mx = 0; mx < monsterWidth; mx++)
      if (monster[my][mx] !== ' ' && monster[my][mx] !== image[y + my][x + mx])
        return false;
  return true;
}

function writeMonster(image, monster, x, y) {
  const monsterHeight = monster.length;
  const monsterWidth = monster[0].length;
  for (let my = 0; my < monsterHeight; my++)
    for (let mx = 0; mx < monsterWidth; mx++)
      if (monster[my][mx] !== ' ')
        image[y + my][x + mx] = 'O';
}

function printMat(mat) {
  console.log(
    mat.map(
      r => r.map(t => t === null ? ' ' : t).join('')
    )
    .join('\n')
  );
}

function buildImage() {
  // Uncomment next lines to see tiles with spaces
  // let tileSize = solvedGrid[0][0].tile[0].length + 1;
  // let fullSize = solvedGrid.length * tileSize;
  const fullImage = genGrid(fullSize);
  let y = 0;
  let x = 0;
  solvedGrid.forEach(row => {
    row.forEach(tile => {
      const fullTile = sidesToFullTile(tile);
      placeFullTile(fullImage, fullTile, x, y);
      x = (x + tileSize) % fullSize;
    });
    y = (y + tileSize) % fullSize;
  });
  return fullImage;
}

function placeFullTile(fullImage, fullTile, x, y) {
  for (let i = 0; i < tileSize; i++)
    for (let j = 0; j < tileSize; j++)
      fullImage[y + i][x + j] = fullTile[i][j];
}

function reverseCopy(a) {
  return a.slice().reverse();
}

function flipMatH(mat) {
  return mat.map(row => reverseCopy(row));
}

function flipMatV(mat) {
  return reverseCopy(mat);
}

function rotateMat(mat) {
  const height = mat.length;
  const width = mat[0].length;
  const newMat = genGrid(height, width);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      newMat[x][height - 1 - y] = mat[y][x];
  return newMat;
}

function sidesToFullTile(pos) {
  const { id, tile } = pos;
  const variantIdx = tileVariants[id]
    .map(s => s.join(''))
    .indexOf(tile.join(''));
  return getFullTileVariant(id, variantIdx);
}

function getFullTileVariant(id, variantIdx) {
  const baseTile = fullTiles[id];
  switch (variantIdx) {
    case 1: return flipMatV(baseTile);
    case 2: return flipMatH(baseTile);
    case 3: return flipMatH(flipMatV(baseTile));
    case 4: return rotateMat(baseTile);
    case 5: return flipMatV(rotateMat(baseTile));
    case 6: return flipMatH(rotateMat(baseTile));
    case 7: return flipMatH(flipMatV(rotateMat(baseTile)));
    default: return baseTile; // 0
  }
}

// check reconstitued tile match for all variants
const firstTileId = Object.keys(tileVariants)[0];
tileVariants[firstTileId].forEach((v, i) => {
  const fullTile = getFullTileVariant(firstTileId, i);
  const top = fullTile[0].join('');
  const bottom = fullTile[fullTile.length - 1].join('');
  const left = fullTile.map(l => l[0]).join('');
  const right = fullTile.map(l => l[l.length - 1]).join('');
  const sides = [top, right, bottom, left];
  assert(v.join('') === sides.join(''), 'variant ' + i);
});

function countRough(image) {
  const size = image.length;
  let count = 0;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (image[y][x] === '#')
        count++;
  return count;
}