const fs = require('fs');const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');const entries = input.split('\n');

// part 1
const mainRe = /^(.*) bags contain(( (\d+) (.*?) bags?,?)+| no.*)\.$/;
const subRe = / (\d+) (.*?) bags?,?/g;
const containedBy = {};

entries.forEach(entry => {
  const [_, container, bags] = entry.match(mainRe);
  let match = null;
  while (match = subRe.exec(bags)) {
    const [hasBag, number, color] = match;
    if (hasBag && number !== 0) {
      if (!containedBy[color]) containedBy[color] = new Set();
      containedBy[color].add(container);
    }
  }
});

let done = new Set();
function count(bag) {
  let sum = 0;
  const bags = containedBy[bag] || [];
  bags.forEach(b => {
    if (!done.has(b)) {
      done.add(b);
      sum++;
    }
    sum += count(b);
  });
  return sum;
}

console.log(count('shiny gold'));

// part 2
const contains = {};

entries.forEach(entry => {
  const [_, container, bags] = entry.match(mainRe);
  if (!contains[container]) contains[container] = {};

  let match = null;
  while (match = subRe.exec(bags)) {
    const [hasBag, number, color] = match;
    if (hasBag && number !== 0) {
      contains[container][color] = parseInt(number, 10);
    }
  }
});

function countAll(bag) {
  let sum = 0;
  const bags = contains[bag] || [];
  Object.keys(bags).forEach(b => {
    sum += contains[bag][b] + contains[bag][b] * countAll(b);
  });
  return sum;
}

console.log(countAll('shiny gold'));
