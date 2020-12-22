const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n\n').filter(e => e);

// part 1
let rules = {};
let regex = parseRules(entries[0]);
let n = 0;
entries[1]
  .split('\n')
  .forEach(s => {
    if (regex.test(s))
      n++;
  });
console.log(n);

function parseRules(str) {
  const ruleRegex = /(\d+): (.+)/;
  const lines = str.split('\n');
  lines.forEach(line => {
    const [_, i, rule] = line.match(ruleRegex);
    rules[i] = rule;
  });
  const finalRule = inferRule(rules['0']);
  return new RegExp(`^${finalRule}$`);
}

function inferRule(rule) {
  if (rule[0] === '"') {
    return rule[1];
  } else if (/\|/.test(rule)) {
    const options = rule.split(' | ');
    return `(${inferRule(options[0])}|${inferRule(options[1])})`;
  }
  const numbers = rule.split(' ');
  return numbers.reduce((res, i) => res + inferRule(rules[i]), '');
}

// part 2
const MAX_LOOPS = 10;
let num11 = 0;
let num8 = 0;
rules = {};
regex = parseRules2(entries[0]);
n = 0;
entries[1]
  .split('\n')
  .forEach(s => {
    if (regex.test(s))
      n++;
  });
console.log(n);

function parseRules2(str) {
  const ruleRegex = /(\d+): (.+)/;
  const lines = str.split('\n');
  lines.forEach(line => {
    const [_, i, rule] = line.match(ruleRegex);
    rules[i] = rule;
  });
  rules['8'] = '42 | 42 8';
  rules['11'] = '42 31 | 42 11 31';
  const finalRule = inferRule2(rules['0']);
  return new RegExp(`^${finalRule}$`);
}

function inferRule2(rule) {
  if (rule[0] === '"') {
    return rule[1];
  } else if (/\|/.test(rule)) {
    const options = rule.split(' | ');
    return `(${inferRule2(options[0])}|${inferRule2(options[1])})`;
  }
  const numbers = rule.split(' ');
  return numbers.reduce((res, i) => {
    if (i === '11') {
      if (num11 < MAX_LOOPS) {
        num11++;
        const result = res + inferRule2(rules[i]);
        num11--;
        return result;
      }
      return res;
    } else if (i === '8') {
      if (num8 < MAX_LOOPS) {
        num8++;
        const result = res + inferRule2(rules[i]);
        num8--;
        return result;
      }
      return res;
    }
    return res + inferRule2(rules[i])
  }, '');
}