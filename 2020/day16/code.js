const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n\n').filter(e => e);

// part 1
const [rulesRaw, myTicketRaw, othersRaw] = entries;
const ruleRegex = /(.*?): (\d+)-(\d+) or (\d+)-(\d+)/;
const rules = {};
const myTicket = myTicketRaw
  .split('\n')[1]
  .split(',')
  .map(v => parseInt(v, 10));
const others = othersRaw
  .split('\n')
  .slice(1)
  .map(t => t.split(',').map(v => parseInt(v, 10)));

rulesRaw
  .split('\n')
  .forEach(rule => {
    const [_, name, min1, max1, min2, max2] = rule.match(ruleRegex);
    rules[name] = [
      [parseInt(min1, 10), parseInt(max1, 10)],
      [parseInt(min2, 10), parseInt(max2, 10)],
    ]
  });

let error = 0;
others.forEach(t => {
  const i = invalid(t);
  error += i !== null ? i : 0;
});
console.log(error);

function invalid(ticket) {
  for (const v of ticket) {
    let valid = false;
    for (const name in rules) {
      const ranges = rules[name];
      if (inRanges(v, ranges)) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      return v;
    }
  };
  return null;
}

function inRanges(v, ranges) {
  return within(v, ranges[0][0], ranges[0][1]) ||
  within(v, ranges[1][0], ranges[1][1]);
}

function within(v, min, max) {
  return v >= min && v <= max;
}

// part 2
const validTickets = others.filter(t => !invalid(t));
const positions = {};
const order = [];

for (const name in rules) {
  positions[name] = [];
  const ranges = rules[name];
  let i = 0;

  while (i < validTickets[0].length) {
    if (validTickets.every(t => inRanges(t[i], ranges))) {
      positions[name].push(i);
    }
    i++;
  }

  order[positions[name].length - 1] = name;
}

for (let i = 0; i < order.length - 1; i++) {
  const name = order[i];
  const toRemove = positions[name][0];

  for (let j = i + 1; j < order.length; j++) {
    const key = order[j];
    positions[key] = positions[key].filter(p => p !== toRemove);
  }
}

console.log(positions);

// We don't have all positions as there's some overlap in order, but we have all 'departure*' :]
const dep = Object.keys(rules).filter(n => n.startsWith('departure'));

let res = myTicket[positions[dep[0]][0]];
dep.slice(1).forEach(d => {
  res *= myTicket[positions[d][0]];
});

console.log(res);
