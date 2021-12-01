const fs = require('fs');const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');const groups = input.split('\n\n');

// part 1
let sum = 0;

groups.forEach(group => {
  const persons = group.split('\n');
  const yesSet = new Set();

  persons.forEach(p => {
    const yes = p.split('');
    yes.forEach(y => yesSet.add(y));
  });

  sum += yesSet.size;
});

console.log(sum);


// part 2
sum = 0;

groups.forEach(group => {
  const persons = group.split('\n');
  const yesMap = {};

  persons.forEach(p => {
    const yes = p.split('');
    yes.forEach(y => {
      if (yesMap[y]) yesMap[y]++;
      else yesMap[y] = 1;
    });
  });

  sum += Object.values(yesMap).filter(n => n === persons.length).length;
});

console.log(sum);