const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n').filter(e => e);

// part 1
assert(transform(7, 8) === 5764801, 'transform card');
assert(findLoop(7, 5764801) === 8, 'findLoop card');
assert(findLoop(7, 17807724) === 11, 'findLoop door');
assert(genEncryptionKey(5764801, 17807724) === 14897079, 'genEncryptionKey');

const [cardKey, doorKey] = entries.map(s => parseInt(s, 10));
console.log(genEncryptionKey(cardKey, doorKey));

function genEncryptionKey(cardKey, doorKey) {
  const cardLoop = findLoop(7, cardKey);
  const doorLoop = findLoop(7, doorKey);
  const cardEncKey = transform(doorKey, cardLoop);
  const doorEncKey = transform(cardKey, doorLoop);
  console.log({cardLoop, doorLoop, cardEncKey, doorEncKey});
  assert(cardEncKey === doorEncKey, 'encKey');
  return cardEncKey;
}

function transform(subject, n) {
  let value = 1;
  for (let i = 0; i < n; i++) {
    value *= subject;
    value %= 20201227;
  }
  return value;
}

function findLoop(subject, key) {
  let value = 1;
  let n = 0;
  while (value !== key) {
    value *= subject;
    value %= 20201227;
    ++n;
    if (n % 100000000 === 0)
      console.log(n)
  }
  return n;
}

// part 2

