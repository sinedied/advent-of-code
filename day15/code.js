const { assert } = require('console');
const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split(',').map(e => parseInt(e, 10));

// part 1
function calc(numbers, target = 2020) {
  let last = numbers[numbers.length - 1];
  let i = 0;
  let turn = {};
  let curr;

  setTurn = (n, i) => {
    if (turn[n] === undefined) {
      turn[n] = [i + 1, null];
    } else {
      turn[n][1] = turn[n][0];
      turn[n][0] = i + 1;
    }
  }
  numbers.forEach(n => setTurn(n, i++));
  
  while (i < target) {
    if (turn[last][1] === null) {
      curr = 0;
    } else {
      curr = turn[last][0] - turn[last][1];
    }
    setTurn(curr, i);
    last = curr;
    i++;

    if (i % 1000000 === 0)
      console.log('calculated ' + i);
  }
  return curr;
}

assert(calc([0,3,6]) === 436);
assert(calc([1,3,2]) === 1);
assert(calc([2,1,3]) === 10);
assert(calc([1,2,3]) === 27);
assert(calc([2,3,1]) === 78);
assert(calc([3,2,1]) === 438);
assert(calc([3,1,2]) === 1836);

console.log(calc(entries));

// part 2
// take a coffee, takes a few min :)
console.log(calc(entries, 30000000));
