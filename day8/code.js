const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const prog = input.split('\n');

// part 1
const read = new Set();
let acc = 0;
let p = 0;

while (p >= 0 && p < prog.length) {
  if (read.has(p)) break;

  read.add(p);
  let inst = prog[p];
  let [microcode, value] = inst.split(' ');
  value = parseInt(value, 10);

  switch (microcode) {
    case 'acc':
      acc += value;
      ++p;
      break;
    case 'jmp':
      p += value;
      break;
    default:  // noop
      ++p;
  }
}

console.log(p);

// part 2
new Array(prog.length)
  .fill('')
  .map((_, i) => {
    const variant = prog.slice();
    const inst = prog[i];
    const newInst = inst[0] === 'j' ? inst.replace('jmp', 'nop') : inst.replace('nop', 'jmp');
    variant[i] = newInst;

    return inst[0] === 'a' ? null : variant;
  })
  .filter(p => p)
  .some((p, i) => {
    const res = exec(p);
    if (res) {
      console.log(res);
      return true;
    }
  });

function exec(prog) {
  const read = new Set();
  let acc = 0;
  let p = 0;
  
  while (p >= 0 && p < prog.length) {
    if (read.has(p)) break;
  
    read.add(p);
    let inst = prog[p];
    let [microcode, value] = inst.split(' ');
    value = parseInt(value, 10);
  
    switch (microcode) {
      case 'acc':
        acc += value;
        ++p;
        break;
      case 'jmp':
        p += value;
        break;
      default:  // noop
        ++p;
    }
  }

  return read.has(p) ? null : acc;
}
