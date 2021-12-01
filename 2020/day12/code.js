const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const instructions = input.split('\n').filter(e => e);

// part 1
const dirs = ['N', 'E', 'S', 'W'];
let x = 0;
let y = 0;
let dir = 'E';

instructions.forEach(inst => {
  move(inst);
  console.log({x, y});
});

console.log(Math.abs(x) + Math.abs(y));

function move(inst) {
  const code = inst[0];
  const val = parseInt(inst.slice(1), 10);
  console.log({code, val, dir});
  switch (code) {
    case 'L': turn(-val); break;
    case 'R': turn(val); break;
    case 'F': advance(dir, val); break;
    default: advance(code, val);
  }
}

function turn(val) {
  dir = dirs[(dirs.indexOf(dir) + val / 90 + 4) % 4];
}

function advance(dir, val) {
  switch (dir) {
    case 'N': y -= val; break;
    case 'S': y += val; break;
    case 'E': x += val; break;
    case 'W': x -= val; break;
  }
}

// part 2
x = 0;
y = 0;
let wx = 10;
let wy = -1;

instructions.forEach(inst => {
  move2(inst);
  console.log({x, y, wx, wy});
});

console.log(Math.abs(x) + Math.abs(y));

function move2(inst) {
  const code = inst[0];
  const val = parseInt(inst.slice(1), 10);
  console.log({code, val});
  switch (code) {
    case 'L': turn2(-val); break;
    case 'R': turn2(val); break;
    case 'F': advanceShip(val); break;
    default: advanceWP(code, val);
  }
}

function turn2(val) {
  const n = Math.abs(val / 90);
  for (let i = 0; i < n; i++) {
    let tx = wx;
    if (val > 0) {
      wx = -wy;
      wy = tx;
    } else {
      wx = wy;
      wy = -tx;
    }
  }
}

function advanceShip(val) {
  for (let i = 0; i < val; i++) {
    x += wx;
    y += wy;
  }
}

function advanceWP(dir, val) {
  switch (dir) {
    case 'N': wy -= val; break;
    case 'S': wy += val; break;
    case 'E': wx += val; break;
    case 'W': wx -= val; break;
  }
}
