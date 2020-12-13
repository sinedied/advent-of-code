cookie="cookie: session=53616c7465645f5fe5db14d48e75f224915d7edecc80fa61b73800b6e8ebe6b0b40e73a325a54a249e7e6896182d66de"
n=$1
mkdir day$n;
echo "const fs = require('fs');\n\
const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');\n\
const entries = input.split('\\\\n').filter(e => e);\n\
\n\
// part 1\n\
\n\n\
// part 2\n\
" > day$n/code.js
curl https://adventofcode.com/2020/day/$n/input -o day$n/input.txt -H "$cookie"
open https://adventofcode.com/2020/day/$n
code day$n/code.js
