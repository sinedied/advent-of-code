const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const test = '389125467';

// part 1
let cups = input.split('').map(n => parseInt(n, 10));
let current = cups[0];
move(100);
console.log(getFinalOrder().join(''));

function move(n) {
  for (let i = 0; i < n; i++) {
    // console.log(`-- move ${i + 1} --`);
    // console.log({ cups: cups.join(' '), current });

    let currentIdx = cups.indexOf(current);
    const picks = pick(currentIdx + 1);
    const dest = findDestination(current, picks);
    const destIdx = cups.indexOf(dest);
    // console.log({ picks, dest });
    
    cups.splice(destIdx + 1, 0, ...picks);
    currentIdx = cups.indexOf(current);
    currentIdx = (currentIdx + 1) % cups.length;
    current = cups[currentIdx];
  }
  // console.log(`-- final --`);
  // console.log({ cups: cups.join(' '), current });
}

function pick(startIdx) {
  const picks = [];
  for (let i = 0; i < 3; i++) {
    const idx = startIdx < cups.length ? startIdx : 0;
    picks.push(cups.splice(idx, 1)[0]);
  }
  return picks;
}

function findDestination(current, picks) {
  let dest = current;
  do {
    dest--;
    if (dest <= 0)
      dest = cups.length + picks.length;
  } while (picks.includes(dest));
  return dest;
}

function getFinalOrder() {
  const start = cups.indexOf(1);
  const final = [];
  for (let i = 1; i < cups.length; i++) {
    const idx = (start + i) % cups.length;
    final.push(cups[idx]);
  }
  return final;
}

// part 2
const SIZE = 1000000;
cups = input.split('').map(n => parseInt(n, 10));
for (let i = cups.length + 1; i <= SIZE; i++)
  cups.push(i);

// holds index of next cup for every number,
// creating a "virtual" linked list :]
const next = new Array(SIZE + 1);
for (let i = 0; i < SIZE; i++) {
  next[cups[i]] = (i + 1) % SIZE;
}

current = cups[0];
move2(10000000);

const stars = pick2(1)[0];
console.log({ stars });
console.log(stars[0] * stars[1]);

function move2(n) {
  for (let i = 0; i < n; i++) {
    const [picks, picksIdx] = pick2(current);
    const dest = findDestination2(current, picks, picksIdx);
    insert(dest, picks, picksIdx);
    current = cups[next[current]];
  }
}

function pick2(current) {
  const nextIdx = next[current];
  const picks = [];
  let idx = nextIdx;
  for (let i = 0; i < 3; i++) {
    const n = cups[idx];
    picks.push(n);
    idx = next[n];
  }
  next[current] = idx;
  return [picks, nextIdx];
}

function findDestination2(current, picks) {
  let dest = current;
  do {
    dest--;
    if (dest <= 0)
      dest = cups.length;
  } while (picks.includes(dest));
  return dest;
}

function insert(dest, picks, picksIdx) {
  const previousDest = next[dest];
  next[dest] = picksIdx;
  next[picks[2]] = previousDest;
}
