const fs = require('fs');const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');const entries = input.split('\n');

// part 1
const windowSize = 25;
let i = windowSize;
let invalid;

while (i < entries.length) {
  const n = parseInt(entries[i], 10);
  if (!checkNum(n, i)) {
    console.log(n);
    invalid = n;
    break;
  }
  i++;
}

function checkNum(n, idx) {
  const windowIdx = idx - windowSize;
  for (let a = windowIdx; a < idx; a++) {
    for (let b = windowIdx; b < idx; b++) {
      const n1 = parseInt(entries[a], 10);
      const n2 = parseInt(entries[b], 10);
      if (n1 !== n2 && (n1 + n2 === n)) {
        return true;
      }
    }
  }
  return false;
}

// part 2
const n = invalid;

for (i = 0; i < entries.length; i++) {
  const maxIdx = checkSuite(i);
  if (maxIdx !== null) {
    console.log({ i, maxIdx });
    const range = entries.slice(i, maxIdx + 1);
    const min = Math.min(...range);
    const max = Math.max(...range);
    console.log(min + max);
    break;
  }
}

function checkSuite(i) {
  let sum = 0;
  for (; i < entries.length; i++) {
    sum += parseInt(entries[i], 10);
    if (sum >= n) break;
  }
  return sum === n ? i : null;
}
