const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n').filter(e => e);

// part 1
let state = [[...entries].map(row => row.split(''))];
for (let i = 0; i < 6; i++) {
  state = sim(state);
}

console.log(countActive(state));

function makeInactiveArray(size) {
  return new Array(size).fill('.');
}

function makeInactiveMatrix(size) {
  return new Array(size)
    .fill([])
    .map(_ => makeInactiveArray(size));
}

function copy(state) {
  const newState = [];
  state.forEach(depth => {
    newState.push([...depth].map(row => [...row]));
  });
  return newState;
}

// expand matrix by size 1 in all dimensions+directions
function expand(state) {
  const newSize = state[0].length + 2;
  const newState = [];
  const newDepths = [];
  
  state.forEach(depth => {
    const newRows = [];
    depth.forEach(rows => {
      // expand x
      newRows.push(['.', ...rows, '.']);
    });
    // expand y
    const newDepth = [];
    newDepth.push(makeInactiveArray(newSize));
    newDepth.push(...newRows);
    newDepth.push(makeInactiveArray(newSize));
    newDepths.push(newDepth);
  });
  // expand z
  newState.push(makeInactiveMatrix(newSize));
  newState.push(...newDepths);
  newState.push(makeInactiveMatrix(newSize));

  return newState;
}

function countActive(state) {
  const depth = state.length;
  const size = state[0].length;
  let n = 0;
  for (let z = 0; z < depth; z++)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (state[z][y][x] === '#')
          n++;
  return n;
}

function sim(state) {
  state = expand(state);
  const newState = copy(state);
  const depth = state.length;
  const size = state[0].length;

  for (let z = 0; z < depth; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cube = state[z][y][x];
        const n = countAdjacent(state, x, y, z);
        if (n === 3 && cube === '.') {
          newState[z][y][x] = '#';
        } else if ((n < 2 || n > 3) && cube === '#') {
          newState[z][y][x] = '.';
        }
      }
    }
  }
  return newState;
}

function countAdjacent(state, x, y, z) {
  const depth = state.length;
  const size = state[0].length;
  let n = 0;
  for (let i = Math.max(z - 1, 0); i <= Math.min(z + 1, depth - 1); i++)
    for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, size - 1); j++)
      for (let k = Math.max(x - 1, 0); k <= Math.min(x + 1, size - 1); k++)
        if (!(i === z && j === y && k === x) && state[i][j][k] === '#')
          n++;
  return n;
}

// part 2
state = [[[...entries].map(row => row.split(''))]];
for (let i = 0; i < 6; i++) {
  state = sim2(state);
}

console.log(countActive2(state));

// here I named the 4th dimension "time" :]
function makeInactiveTime(depth, size) {
  return new Array(depth)
    .fill([])
    .map(_ => makeInactiveMatrix(size));
}

function copy2(state) {
  const newState = [];
  state.forEach(times => {
    const newDepths = [];
    times.forEach(depth => {
      newDepths.push([...depth].map(row => [...row]));
    });
    newState.push(newDepths);
  });
  return newState;
}

// expand matrix by size 1 in all dimensions+directions
function expand2(state) {
  const newDepth = state[0].length + 2;
  const newSize = state[0][0].length + 2;
  const newState = [];
  const newTimes = [];
  
  state.forEach(time => {
    const newTime = [];
    const newDepths = [];
    time.forEach(depth => {
      const newRows = [];
      depth.forEach(rows => {
        // expand x
        newRows.push(['.', ...rows, '.']);
      });
      // expand y
      const newDepth = [];
      newDepth.push(makeInactiveArray(newSize));
      newDepth.push(...newRows);
      newDepth.push(makeInactiveArray(newSize));
      newDepths.push(newDepth);
    });
    // expand z
    newTime.push(makeInactiveMatrix(newSize));
    newTime.push(...newDepths);
    newTime.push(makeInactiveMatrix(newSize));
    newTimes.push(newTime);
  });
  // expand w
  newState.push(makeInactiveTime(newDepth, newSize));
  newState.push(...newTimes);
  newState.push(makeInactiveTime(newDepth, newSize));

  return newState;
}

function countActive2(state) {
  const duration = state.length;
  const depth = state[0].length;
  const size = state[0][0].length;
  let n = 0;
  for (let w = 0; w < duration; w++)
    for (let z = 0; z < depth; z++)
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
          if (state[w][z][y][x] === '#')
            n++;
  return n;
}

function sim2(state) {
  state = expand2(state);
  const newState = copy2(state);
  const duration = state.length;
  const depth = state[0].length;
  const size = state[0][0].length;

  for (let w = 0; w < duration; w++) {
    for (let z = 0; z < depth; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const cube = state[w][z][y][x];
          const n = countAdjacent2(state, x, y, z, w);
          if (n === 3 && cube === '.') {
            newState[w][z][y][x] = '#';
          } else if ((n < 2 || n > 3) && cube === '#') {
            newState[w][z][y][x] = '.';
          }
        }
      }
    }
  }
  return newState;
}

function countAdjacent2(state, x, y, z, w) {
  const duration = state.length;
  const depth = state[0].length;
  const size = state[0][0].length;
  let n = 0;
  for (let h = Math.max(w - 1, 0); h <= Math.min(w + 1, duration - 1); h++)
    for (let i = Math.max(z - 1, 0); i <= Math.min(z + 1, depth - 1); i++)
      for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, size - 1); j++)
        for (let k = Math.max(x - 1, 0); k <= Math.min(x + 1, size - 1); k++)
          if (!(h === w && i === z && j === y && k === x) && state[h][i][j][k] === '#')
            n++;
  return n;
}
