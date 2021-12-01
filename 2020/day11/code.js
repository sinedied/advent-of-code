const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const layout = input.split('\n'); 

// part 1
let state = [...layout].map(row => row.split(''));
let newState = state;
const width = state[0].length;
const height = state.length;

do {
  state = newState;
  newState = sim(state);
} while (!equal(state, newState));

console.log(countUsed(newState));

function countUsed(state) {
  let n = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (state[y][x] === '#')
        n++;
  return n;
} 

function equal(s1, s2) {
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (s1[y][x] !== s2[y][x]) {
        return false;
      }
  return true;
} 

function print(state) {
  state.forEach(line => console.log(line.join('')));
  console.log(new Array(width).fill('-').join(''));
}

function sim(state) {
  const newState = [...state].map(pos => [...pos]);
  newState.forEach((pos, y) => {
    pos.forEach((p, x) => {
      const n = countAdjacent(state, x, y);
      if (n === 0 && p === 'L') {
        newState[y][x] = '#';
      } else if (n >= 4 && p === '#') {
        newState[y][x] = 'L';
      }
    });
  });

  return newState;
}

function countAdjacent(state, x, y) {
  let n = 0;
  for (let i = Math.max(y - 1, 0); i <= Math.min(y + 1, height - 1); i++) {
    for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, width - 1); j++) {
      if (!(i === y && j === x) && state[i][j] === '#') n++;
    }
  }
  return n;
}

// part 2 
state = [...layout].map(row => row.split(''));
newState = state;

do {
  state = newState;
  newState = sim2(state);
} while (!equal(state, newState));

console.log(countUsed(newState));

function sim2(state) {
  const newState = [...state].map(pos => [...pos]);
  newState.forEach((pos, y) => {
    pos.forEach((p, x) => {
      const n = countAdjacent2(state, x, y);
      if (n === 0 && p === 'L') {
        newState[y][x] = '#';
      } else if (n >= 5 && p === '#') {
        newState[y][x] = 'L';
      }
    });
  });

  return newState;
}

function countAdjacent2(state, x, y) {
  let n = 0;
  const dirs = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1]
  ];
  dirs.forEach(dir => {
    let j = x + dir[0];
    let i = y + dir[1];

    while (i >= 0 && j >= 0 && i < height && j < width) {      
      if (state[i][j] === '#') {
        n++;
        break;
      } else if (state[i][j] === 'L') {
        break;
      }
      j += dir[0];
      i += dir[1];
    }
  });

  return n;
}
