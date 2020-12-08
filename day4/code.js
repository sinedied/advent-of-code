const fs = require('fs'); const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8'); const passports = input.split('\n\n');

// part 1
let valid = 0;
const mandatoryKeys = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid'
];

passports.forEach(passport => {
  const props = passport
    .replace(/\n/g, ' ')
    .split(' ')
    .reduce((map, prop) => {
      const [k, v] = prop.split(':');
      map[k] = v;
      return map;
    }, {});

  if (mandatoryKeys.every(key => props[key])) valid++;
});

console.log(valid);

// part 2
valid = 0;

const within = (val, min, max) => {
  const n = parseInt(val, 10);
  return n >= min && n <= max
};
const has4digits = val => /^\d{4}$/.test(val);
const hgtValid = val => {
  const match = val.match(/^(\d+)(cm|in)$/);
  if (!match) return false;

  const [_, height, unit] = match;
  if (unit === 'cm') return within(height, 150, 193);
  return within(height, 59, 76);
};

passports.forEach(passport => {
  const props = passport
    .replace(/\n/g, ' ')
    .split(' ')
    .reduce((map, prop) => {
      const [k, v] = prop.split(':');
      map[k] = v;
      return map;
    }, {});

  if (!mandatoryKeys.every(key => props[key])) return;

  const checkByr = has4digits(props.byr) && within(props.byr, 1920, 2002);
  const checkIyr = has4digits(props.iyr) && within(props.iyr, 2010, 2020);
  const checkEyr = has4digits(props.eyr) && within(props.eyr, 2020, 2030);
  const checkHgt = hgtValid(props.hgt);
  const checkHcl = /^#(\d|[a-f]){6}$/.test(props.hcl);
  const checkEcl = /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(props.ecl);
  const checkPid = /^\d{9}$/.test(props.pid);

  if (
    checkByr
    && checkIyr
    && checkEyr
    && checkHgt
    && checkHcl
    && checkEcl
    && checkPid
  ) valid++;
});

console.log(valid);

