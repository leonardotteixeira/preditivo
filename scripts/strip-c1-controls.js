import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, '..', 'index.html');
let s = fs.readFileSync(p, 'utf8');

s = s.replace(/\u00c3\u008d/g, '\u00cd');
s = s.replace(/[\u0080-\u009f]/g, '');

fs.writeFileSync(p, s, 'utf8');
console.log('stripped C1 controls', p);
