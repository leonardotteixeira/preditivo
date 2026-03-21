import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, '..', 'index.html');
let s = fs.readFileSync(p, 'utf8');

s = s.replace(/\u00e2\u20ac\u201d/g, '\u2014');
s = s.replace(/\u00e2\u20ac\u201c/g, '\u2014');
s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

const pairs = [
  ['Ã§', 'ç'],
  ['Ã£', 'ã'],
  ['Ã¡', 'á'],
  ['Ã©', 'é'],
  ['Ã­', 'í'],
  ['Ã³', 'ó'],
  ['Ãº', 'ú'],
  ['Ã¢', 'â'],
  ['Ãª', 'ê'],
  ['Ã´', 'ô'],
  ['Ã ', 'à'],
  ['Ãµ', 'õ'],
  ['Ã‡', 'Ç'],
  ['Ã•', 'Õ'],
  ['Ã‰', 'É'],
  ['Ã"', 'Ô']
];
for (const [a, b] of pairs) {
  s = s.split(a).join(b);
}

fs.writeFileSync(p, s, 'utf8');
console.log('fixed', p);
