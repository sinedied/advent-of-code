const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n\n').filter(e => e);

// part 1
const p1Deck = parseDeck(entries[0]);
const p2Deck = parseDeck(entries[1]);

while (p1Deck.length > 0 && p2Deck.length > 0)
  playTurn();

const winnerDeck = p1Deck.length > 0 ? p1Deck : p2Deck;
let i = winnerDeck.length;
const result = winnerDeck.reduce((sum, c) => sum + c * i--, 0);
console.log(result);

function parseDeck(str) {
  return str
    .split('\n')
    .slice(1)
    .map(c => parseInt(c, 10));
}

function playTurn() {
  const p1Card = p1Deck.shift();
  const p2Card = p2Deck.shift();
  if (p1Card >= p2Card) {
    p1Deck.push(p1Card);
    p1Deck.push(p2Card);
  } else {
    p2Deck.push(p2Card);
    p2Deck.push(p1Card);
  }
}

// part 2
const dumpState = (p1Deck, p2Deck) => `p1 ${p1Deck.join(',')}\np2 ${p2Deck.join(',')}`;
const [_, deck] = playGame(parseDeck(entries[0]), parseDeck(entries[1]))

i = deck.length;
const result2 = deck.reduce((sum, c) => sum + c * i--, 0);
console.log(result2);

function playGame(p1Deck, p2Deck) {
  const playedStates = new Set();

  while (p1Deck.length > 0 && p2Deck.length > 0) {
    const state = dumpState(p1Deck, p2Deck);
    if (playedStates.has(state)) {
      return [0, p1Deck];
    }
    playedStates.add(state);
    playRound(p1Deck, p2Deck);
  }

  return p1Deck.length > 0 ? [0, p1Deck] : [1, p2Deck];
}

function playRound(p1Deck, p2Deck) {
  const p1Card = p1Deck.shift();
  const p2Card = p2Deck.shift();
  let roundWinner;

  if (p1Deck.length < p1Card || p2Deck.length < p2Card) {
    roundWinner = p1Card >= p2Card ? 0 : 1;
  } else {
    roundWinner = playGame(p1Deck.slice(0, p1Card), p2Deck.slice(0, p2Card))[0];
  }

  if (roundWinner === 0) {
    p1Deck.push(p1Card);
    p1Deck.push(p2Card);
  } else {
    p2Deck.push(p2Card);
    p2Deck.push(p1Card);
  }
}
