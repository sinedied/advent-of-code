const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
const entries = input.split('\n').filter(e => e);

// part 1
const parseRegex = /(.*?) \(contains (.*?,?)\)/;
const uniqueIngredients = new Set();
const uniqueAllergens = new Set();
const ingredientsCount = {};
const list = [];

entries.forEach(line => {
  let [match, ingredients, allergens] = line.match(parseRegex);
  if (!match)
    throw 'not matching! ' + line;

  ingredients = ingredients.split(' ');
  allergens = allergens.split(', ');
  list.push({ ingredients, allergens });

  allergens.forEach(a => uniqueAllergens.add(a));
  ingredients.forEach(i => uniqueIngredients.add(i));

  ingredients.forEach(i => {
    if (!ingredientsCount[i])
      ingredientsCount[i] = 0;
    ingredientsCount[i]++;
  });
});

const candidates = [];

uniqueAllergens.forEach(allergen => {
  const possibleEntries = list.filter(e => e.allergens.includes(allergen));
  const uniqueIngredients = new Set();
  list.forEach(e => e.ingredients.forEach(i => uniqueIngredients.add(i)));
  const possibleIngredients = [...uniqueIngredients].filter(i => possibleEntries.every(e => e.ingredients.includes(i)));
  candidates.push({ allergen, possibleIngredients });
});

let hasChanged = true;
const processedAllergens = new Set();

while (hasChanged) {
  hasChanged = false;
  for (let { allergen, possibleIngredients } of candidates) {
    if (possibleIngredients.length === 1 && !processedAllergens.has(allergen)) {
      processedAllergens.add(allergen);
      const ingredient = possibleIngredients[0];
      removeIngredient(allergen, ingredient);
      hasChanged = true;
      break;
    }
  }
}

console.log(candidates);

const hasAllergen = new Set();
candidates.forEach(({ possibleIngredients }) => hasAllergen.add(possibleIngredients[0]));
console.log({ hasAllergen });

const count = [...uniqueIngredients]
  .filter(i => !hasAllergen.has(i))
  .reduce((sum, i) => sum + ingredientsCount[i], 0);
console.log(count);

function removeIngredient(allergen, ingredient) {
  candidates.forEach(c => {
    if (c.allergen !== allergen)
      c.possibleIngredients = c.possibleIngredients.filter(i => i !== ingredient);
  });
} 

// part 2
const allergens = {};
candidates.forEach(({ allergen, possibleIngredients }) => allergens[possibleIngredients[0]] = allergen);
console.log({ allergens });

const result = [...hasAllergen].sort((a, b) => allergens[a].localeCompare(allergens[b])).join(',');
console.log(result);