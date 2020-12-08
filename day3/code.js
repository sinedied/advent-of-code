const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n');

// part 1
let x = 0;
let trees = 0;

for (let e of entries) {
  x = x % e.length;
  if (e[x] === '#') trees++;
  x += 3;
}

console.log(trees);

// part 2
const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
];

const res = slopes
  .map(s => hitTrees(s))
  .reduce((acc, val) => acc * val, 1);

console.log(res);

function hitTrees(slope) {
  let x = 0;
  let trees = 0;

  for (let y = 0; y < entries.length; y += slope[1]) {
    const e = entries[y];
    x = x % e.length;
    if (e[x] === '#') trees++;
    x += slope[0];
  }

  return trees;
}
