const fs = require('fs');
const assert = require('assert').strict;
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n');

// part 1
const time = parseInt(entries[0], 10);
const buses = entries[1].split(',')
  .filter(b => b !== 'x')
  .map(b => parseInt(b, 10));

const times = buses.map(b => time / b);
const diffs = buses.map((b, i) => time - Math.ceil(times[i]) * b);
const min = Math.max(...diffs);
const bus = buses[diffs.indexOf(min)];
console.log({min, bus});
console.log(-min * bus);

// part 2
function calc(entries) {
  const all = entries.split(',')
  .map(b => b !== 'x' ? parseInt(b, 10) : null);
  const ids = all.filter(e => e);
  let t = ids[0];
  let inc = ids[0];
  let i = 1;
  
  while (i < ids.length) {
    t += inc;
    const b = ids[i];
    const ib = all.indexOf(b);
    if ((t + ib) % b === 0) {
      inc = inc * b;
      i++;
    }
  }
  return t;
}

assert(calc(fs.readFileSync(__dirname + '/test.txt', 'utf-8').split('\n')[1]) === 1068781);
assert(calc('67,7,59,61') === 754018);
assert(calc('67,x,7,59,61') === 779210);
assert(calc('67,7,x,59,61') === 1261476);
assert(calc('1789,37,47,1889') === 1202161486);

console.log(calc(entries[1]));
