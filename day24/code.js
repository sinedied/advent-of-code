const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n').filter(e => e);

// part 1
const directions = ['e', 'se', 'sw', 'w', 'nw', 'ne'];
// uses axial coordinates
// see: https://www.redblobgames.com/grids/hexagons/
const offsets = [[-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1], [0, -1]];
const flipped = {}; // true is black

entries.forEach(line => {
  const pos = move(line).join(',');
  flipped[pos] = !flipped[pos];
});

console.log(countBlacks());

function countBlacks() {
  return Object.values(flipped).filter(c => c).length;
}

function move(line) {
  let x = 0;
  let y = 0;
  while (line.length > 0) {
    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      if (line.startsWith(dir)) {
        const offset = offsets[i];
        x += offset[0];
        y += offset[1];
        line = line.slice(dir.length);
        break;
      }
    }
  }
  return [x, y];
}

// part 2
let i;
for (i = 1; i <= 100; i++) {
  dailyFlip();
}
console.log(`Day: ${i}: ${countBlacks()}`)

function dailyFlip() {
  let toFlip = [];
  for (let pos in flipped) {
    [pos, ...getAdjacents(pos)].forEach(p => {
      if (shouldFlip(p))
        toFlip.push(p);
    });
  }
  // get unique tiles
  toFlip = [...new Set(toFlip)];
  toFlip.forEach(pos => flipped[pos] = !flipped[pos]);
}

function shouldFlip(pos) {
  const count = countAdjacents(pos);
  return (flipped[pos] && (count === 0 || count > 2)) ||
    (!flipped[pos] && count === 2);
}

function getAdjacents(pos) {
  pos = pos.split(',');
  const [x, y] = pos;
  return offsets
    .map(offset => [parseFloat(x) + offset[0], parseFloat(y) + offset[1]])
    .map(pos => pos.join(','));
}

function countAdjacents(pos) {
  const adjacents = getAdjacents(pos);
  return adjacents
    .map(p => !!flipped[p])
    .filter(c => c)
    .length;
}
