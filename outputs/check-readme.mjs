import fs from 'node:fs';import path from 'node:path';
const p='README.md';let s=fs.readFileSync(p,'utf8');s='<a id="top"></a>\n\n'+s;s=s.replace('[Back to top](#a-closer-look)','[Back to top](#top)').replaceAll('edge\\nSpeed','edge<br/>Speed').replaceAll('target\\nHTTP','target<br/>HTTP').replaceAll('APIs\\nNetwork','APIs<br/>Network').replaceAll('storage\\nHistory','storage<br/>History').replaceAll('companion\\n127','companion<br/>127');fs.writeFileSync(p,s);
const images=[...s.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);for(const file of images){if(!fs.existsSync(file))throw Error('Missing README image: '+file)}
const files=[...s.matchAll(/\]\(([^)#]+)\)/g)].map(m=>m[1]).filter(link=>!link.startsWith('http')&&!link.startsWith('#'));for(const file of files){if(!fs.existsSync(file))throw Error('Missing file link: '+file)}
if((s.match(/^```/gm)||[]).length%2)throw Error('Unbalanced code fences');
const invalid=s.match(/[A-Z]:[\\/]/);if(invalid)throw Error('Machine-specific path found in README');
console.log(JSON.stringify({readme:p,images:images.map(file=>({file,bytes:fs.statSync(file).size})),codeFencesBalanced:true,portablePaths:true},null,2));
