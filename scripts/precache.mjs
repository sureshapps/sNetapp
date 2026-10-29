import {readdir,readFile,writeFile} from 'node:fs/promises';
const files=['/','/manifest.webmanifest','/icon.svg','/icon-192.png','/icon-512.png',...(await readdir('dist/assets')).map(f=>'/assets/'+f)];
let sw=await readFile('public/sw.js','utf8');
sw=sw.replace("const CACHE='snet-v1'",`const CACHE='snet-${Date.now()}'`).replace("['/','/icon.svg','/manifest.webmanifest']",JSON.stringify(files));
await writeFile('dist/sw.js',sw);console.log(`Precached ${files.length} PWA files`);
