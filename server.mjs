import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
export function validHost(host){return typeof host==='string'&&host.length<=253&&/^(?=.{1,253}$)[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(host)&&!host.includes('..')}
const server=http.createServer(async(req,res)=>{
 res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
 const u=new URL(req.url,'http://localhost');const host=u.searchParams.get('host');
 if(req.headers.origin&&!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.origin)){res.writeHead(403);return res.end(JSON.stringify({error:'Only local SNet clients are allowed.'}))}
 if(u.pathname==='/api/health')return res.end(JSON.stringify({ok:true,platform:process.platform}));
 if(!['/api/ping','/api/trace'].includes(u.pathname)||!validHost(host)){res.writeHead(400);return res.end(JSON.stringify({error:'Enter a valid hostname or IPv4 address.'}))}
 const win=process.platform==='win32',trace=u.pathname==='/api/trace';
 try{const {stdout}=await run(trace?(win?'tracert':'traceroute'):'ping',trace?(win?['-d','-h','15','-w','500',host]:['-n','-m','15','-w','1',host]):(win?['-n','4','-w','2000',host]:['-c','4',host]),{timeout:45000,maxBuffer:65536,windowsHide:true});res.end(JSON.stringify({output:stdout}))}catch(e){res.writeHead(422);res.end(JSON.stringify({error:e.stdout||'The network command failed or is unavailable. Check the target and your system tools.'}))}
});
if(process.argv[1]&&new URL(import.meta.url).pathname.toLowerCase().endsWith(process.argv[1].replaceAll('\\','/').toLowerCase()))server.listen(8787,'127.0.0.1',()=>console.log('SNet companion running at http://127.0.0.1:8787'));
