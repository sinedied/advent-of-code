const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n');
const joltages = entries.map(e => parseInt(e, 10));

// part 1
const device = Math.max(...joltages) + 3;
const diffs = { 1: 0, 2: 0, 3: 0 };
let adapters = [...joltages, device].sort((a, b) => a - b);
let j = 0;

while (adapters.length > 0) {
  const i = adapters.findIndex(a => a > j && a - j <= 3);
  if (i < 0) throw "not found!";

  const diff = adapters[i] - j;
  diffs[diff]++;
  j = adapters[i];
  adapters.splice(i, 1);
}

console.log(diffs);
console.log(diffs[1] * diffs[3]);

// part 2
adapters = [0, ...joltages, device].sort((a, b) => a - b);
let count = new Array(adapters.length).fill(0);
count[0] = 1;

for (j = 0; j < adapters.length; j++) {
  for (let i = j + 1; adapters[i] <= adapters[j] + 3; i++)
    count[i] += count[j];
}

console.log(count[adapters.length - 1]);
