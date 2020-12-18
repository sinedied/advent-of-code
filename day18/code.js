const { assert } = require('console');
const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n').filter(e => e);

// part 1
const parenthesisRegex = /(.*)\((.+?)\)/;

assert(eval('1 + 2 * 3 + 4 * 5 + 6') === 71);
assert(eval('1 + (2 * 3) + (4 * (5 + 6))') === 51);
assert(eval('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2') === 13632);

let sum = entries.reduce((sum, exp) => sum += eval(exp), 0);
console.log(sum);

function eval(str) {
  // eval exp within parenthesis first
  while (/\(/.test(str)) {
    str = str.replace(
      parenthesisRegex,
      (_, rest, exp) => rest + String(eval(exp))
    );
  }

  let exp = str.split(' ')
    .map(n => /\d+/.test(n) ? parseInt(n, 10) : n);

  while (exp.length > 1) {
    const [a, op, b, ...rest] = exp;
    let res = a;
    if (op === '+')
      res += b;
    else
      res *= b;
    exp = [res, ...rest];
  }
  return exp[0];
}

// part 2
const plusRegex = /(.* |)(\d+ \+ \d+)/;
const finalPlusRegex = /^\d+ \+ \d+$/;

assert(eval2('1 + 2 * 3 + 4 * 5 + 6') === 231);
assert(eval2('1 + (2 * 3) + (4 * (5 + 6))') === 51);
assert(eval2('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2') === 23340);

sum = entries.reduce((sum, exp) => sum += eval2(exp), 0);
console.log(sum);

function eval2(str) {
  // eval exp within parenthesis first
  while (/\(/.test(str)) {
    str = str.replace(
      parenthesisRegex,
      (_, rest, exp) => rest + String(eval2(exp))
    );
  }

  // eval exp with + then
  while (/\+/.test(str) && !finalPlusRegex.test(str)) {
    str = str.replace(
      plusRegex,
      (_, rest, exp) => rest + String(eval2(exp))
    );
  }

  let exp = str.split(' ')
    .map(n => /\d+/.test(n) ? parseInt(n, 10) : n);

  while (exp.length > 1) {
    const [a, op, b, ...rest] = exp;
    let res = a;
    if (op === '+')
      res += b;
    else
      res *= b;
    exp = [res, ...rest];
  }
  return exp[0];
}
