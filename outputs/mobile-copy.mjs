import fs from 'node:fs';const p='src/main.jsx';let s=fs.readFileSync(p,'utf8').replace('How fast is your now?','Your speed. No guesswork.');fs.writeFileSync(p,s);
