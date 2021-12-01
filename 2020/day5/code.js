const fs = require('fs');const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');const entries = input.split('\n');

// part 1
let highest = 0;

entries.forEach(pass => {
  pass = pass.split('');
  const part1 = pass.slice(0, 8);
  const part2 = pass.slice(7);
  const row = binpart(part1, 'FB', 0, 7);
  const col = binpart(part2, 'LR', 0, 3);
  const id = row * 8 + col;
  if (id > highest) highest = id;

  console.log({row, col, id})
});

function binpart(str, sep, val, p) {
  if (p === 0) return str[0] === sep[0] ? val - 1: val;

  const half = Math.pow(2, p) / 2;
  if (str[0] === sep[1]) {
    return binpart(str.slice(1), sep, val + half, p - 1);
  }
  return binpart(str.slice(1), sep, val, p - 1);
} 

console.log(highest);

// part 2
let list = new Array(highest + 1).fill(false);

entries.forEach(pass => {
  pass = pass.split('');
  const part1 = pass.slice(0, 8);
  const part2 = pass.slice(7);
  const row = binpart(part1, 'FB', 0, 7);
  const col = binpart(part2, 'LR', 0, 3);
  const id = row * 8 + col;
  list[id] = true;
});

for (let i = 8; i < highest - 7; i++) {
  if (!list[i] && list[i - 1] && list[i + 1]) {
    console.log(i);
    break;
  }
}
