const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n');

// part 1
let n = 0;
for (let e of entries) {
  const [rule, pass] = e.split(': ');
  const [quantifier, letter] = rule.split(' ');
  let [min, max] = quantifier.split('-');
  min = parseInt(min, 10);
  max = parseInt(max, 10);
  const count = pass.split('').filter(l => l === letter).length;
  if (count >= min && count <= max) n++;
}

console.log(n);

// part 2
n = 0;
for (let e of entries) {
  const [rule, pass] = e.split(': ');
  const [quantifier, letter] = rule.split(' ');
  let [i, j] = quantifier.split('-');
  i = parseInt(i, 10) - 1;
  j = parseInt(j, 10) - 1;
  const count = Number(pass[i] === letter) + Number(pass[j] === letter);
  if (count === 1) n++;
}

console.log(n);