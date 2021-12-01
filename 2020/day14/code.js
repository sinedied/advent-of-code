const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n').filter(e => e);

// part 1
const memParse = /mem\[(\d+)\] = (\d+)/
let mem = [];
let mask;

entries.forEach(inst => {
  if (inst.startsWith('mask')) {
    mask = inst.split(' = ')[1].split('');
    return;
  }
  const [_, address, value] = inst.match(memParse);
  const masked = applyMask(mask, value);
  mem[address] = masked;
});

let sum = mem.reduce((acc, v) => acc + v, 0);
console.log(sum);

function applyMask(mask, value) {
  const bin = dec2bin(value);
  mask.forEach((bit, i) => {
    if (bit === '0')
      bin[i] = 0;
    else if (bit === '1')
      bin[i] = 1;
  })
  return bin2dec(bin);
}

function dec2bin(dec){
  return (dec >>> 0).toString(2).padStart(36, '0').split('');
}

function bin2dec(bin) {
  return parseInt(bin.join(''), 2);
}

// part 2
mem = {};

entries.forEach(inst => {
  if (inst.startsWith('mask')) {
    mask = inst.split(' = ')[1].split('');
    return;
  }
  const [_, address, value] = inst.match(memParse);
  const masked = applyMask2(mask, address);
  const adresses = genValues(masked);
  adresses.forEach(a => mem[a] = parseInt(value, 10));
});

function applyMask2(mask, value) {
  const bin = dec2bin(value);
  mask.forEach((bit, i) => {
    if (bit === 'X')
      bin[i] = 'X';
    else if (bit === '1')
      bin[i] = 1;
  })
  return bin;
}

function genValues(bin) {
  let values = [[]];
  while (bin.length > 0) {
    const bit = bin.shift();
    if (bit === 'X') {
      const v1 = values.map(v => v.concat([1]));
      values.forEach(v => v.push(0));
      values = values.concat(v1);
    } else {
      values.forEach(v => v.push(bit));
    }
  }
  return values.map(v => bin2dec(v));
}

sum = 0;
for (const address in mem)
  sum += mem[address];
// reduce on sparse arrays seems to use too much memory :?
// sum = mem.reduce((acc, v) => acc + v, 0);
console.log(sum);
