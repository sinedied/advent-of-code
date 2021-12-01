const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n');

// part 1
for (let i = 0; i < entries.length; i++) {
  for (let j = 0; j < entries.length; j++) {
    if (i !== j) {
      const a = parseInt(entries[i], 10);
      const b = parseInt(entries[j], 10);
      if (a + b === 2020) {
        console.log(a * b);
        i = j = entries.length;
      }
    }
  }
}

// part 2
for (let i = 0; i < entries.length; i++) {
  for (let j = 0; j < entries.length; j++) {
    for (let k = 0; k < entries.length; k++) {
      if (i !== j && i !== k && j !== k) {
        const a = parseInt(entries[i], 10);
        const b = parseInt(entries[j], 10);
        const c = parseInt(entries[k], 10);
        if (a + b + c === 2020) {
          console.log(a * b * c);
          i = j = k = entries.length;
        }
      }
    }
  }
}
