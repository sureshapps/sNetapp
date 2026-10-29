import fs from 'node:fs';
const p='src/main.jsx';let s=fs.readFileSync(p,'utf8');
s="import {LaunchScreen} from './LaunchScreen.jsx';\n"+s;
s=s.replace('Activity,ArrowDown,','Bell,Activity,ArrowDown,');
s=s.replace("[toast,setToast]=useState('')","[toast,setToast]=useState(null)");
s=s.replace('const abort=useRef(null);',"const[launchStage,setLaunchStage]=useState('splash'),[notices,setNotices]=useState(()=>read('snet-notifications',[]));const firstLaunch=useRef(!read('snet-welcomed',false));const greeted=useRef(false);const pageRef=useRef(page);pageRef.current=page;const abort=useRef(null);");
s=s.replace('useAppMotion(appRoot,page,busy,result,toast);','useAppMotion(appRoot,page,busy,result,toast,launchStage);');
s=s.replace("setTimeout(()=>setToast(''),3500)","setTimeout(()=>setToast(null),6500)");
const effects=`
useEffect(()=>{
 let active=true;const timers=[];const delay=ms=>new Promise(resolve=>timers.push(setTimeout(resolve,ms)));
 Promise.all([delay(900),Promise.race([document.fonts?.ready||Promise.resolve(),delay(1800)])]).then(()=>{if(active)setLaunchStage(firstLaunch.current?'welcome':'ready')});
 return()=>{active=false;timers.forEach(clearTimeout)};
},[]);
useEffect(()=>{save('snet-notifications',notices)},[notices]);
useEffect(()=>{if(page==='notifications')setNotices(items=>items.some(n=>!n.read)?items.map(n=>({...n,read:true})):items)},[page]);
useEffect(()=>{if(launchStage==='ready'&&!greeted.current){greeted.current=true;addNotice('welcome',firstLaunch.current?'Welcome to SNet':'Welcome back to SNet','Your toolkit is ready. Choose a tool to explore your connection.','home');requestAnimationFrame(()=>appRoot.current.querySelector('.brand')?.focus({preventScroll:true}))}},[launchStage]);
function addNotice(kind,title,message,route='history',resultId=null){const notice={id:crypto.randomUUID(),kind,title,message,route,resultId,date:new Date().toISOString(),read:pageRef.current==='notifications'};setNotices(items=>[notice,...items].slice(0,50));setToast({...notice})}
function openNotice(n){navigate(n.route||'home');if(n.resultId)requestAnimationFrame(()=>{const item=document.getElementById('result-'+n.resultId);if(item){item.open=true;item.scrollIntoView({block:'center'})}})}
function finishWelcome(){save('snet-welcomed',true);setLaunchStage('ready')}
`;
s=s.replace('function navigate(id){',effects+'\nfunction navigate(id){');
s=s.replace('abort.current?.abort();setBusy(false);','abort.current?.abort();abort.current=null;setBusy(false);');
s=s.replace("save('snet-history',next);return next})}","save('snet-history',next);return next});addNotice('success',(services.find(s=>s.id===type)?.name||'Test')+' complete',summary,'history',row.id)}");
s=s.replace('setNet(fields)}catch(e)',"setNet(fields);addNotice('success','Network lookup complete','Your public connection details have been refreshed.','network')}catch(e)");
s=s.replace("setError('Public network details are unavailable. Check your connection and try again.')","setError('Public network details are unavailable. Check your connection and try again.');addNotice('error','Network lookup failed','Check your connection and try again.','network')");
s=s.replaceAll('setResult(data);record(', 'signal.throwIfAborted();setResult(data);record(').replace('setResult(d);record(', 'signal.throwIfAborted();setResult(d);record(');
const oldCatch="catch(e){if(signal.aborted){setPhase('Test stopped')}else{setError(e.name==='TimeoutError'?'The measurement server timed out. Check your connection, firewall or VPN, then try again.':e.message);setPhase('Test could not complete')}}";
const newCatch="catch(e){if(signal.aborted){if(abort.current===controller)setPhase('Test stopped');addNotice('info',(service?.name||'Test')+' stopped','No completed result was saved.',page)}else{const message=e.name==='TimeoutError'?'The measurement server timed out. Check your connection, firewall or VPN, then try again.':e.message;if(abort.current===controller){setError(message);setPhase('Test could not complete')}addNotice('error',(service?.name||'Test')+' could not complete',message,page)}}";
if(!s.includes(oldCatch))throw Error('Test catch missing');s=s.replace(oldCatch,newCatch);
s=s.replace("const notify=t=>setToast(t)","const notify=t=>setToast({id:crypto.randomUUID(),kind:'info',message:t})");
s=s.replace('<div className="app" ref={appRoot}><nav','<div className="app" ref={appRoot}><div className="app-body" inert={launchStage!==\'ready\'?true:undefined} aria-hidden={launchStage!==\'ready\'}><nav');
s=s.replace('<button className="header-settings" aria-label="Open settings"',`<button className="header-notifications" aria-label={'Notifications'+(notices.some(n=>!n.read)?', unread messages':'')} onClick={()=>navigate('notifications')}><Bell size={20}/>{notices.some(n=>!n.read)&&<span className="notification-count">{Math.min(9,notices.filter(n=>!n.read).length)}</span>}</button><button className="header-settings" aria-label="Open settings"`);
s=s.replace("settings:'Settings'","settings:'Settings',notifications:'Notifications'");
const inbox=`{page==='notifications'&&<><div className="page-heading compact"><div><div className="eyebrow">YOUR SNET UPDATES</div><h1>Notifications<span className="spark">.</span></h1><p>Every discovery, in one place.</p></div></div><div className="inbox-toolbar"><span>{notices.length} {notices.length===1?'update':'updates'}</span>{notices.length>0&&<button className="text-button" onClick={()=>{if(confirm('Clear all notifications?'))setNotices([])}}><Trash2 size={14}/>Clear all</button>}</div><section className="notification-list" aria-label="Notification inbox">{notices.length?notices.map(n=><button className={'notification-item '+n.kind} key={n.id} onClick={()=>openNotice(n)}><span className="notification-icon">{n.kind==='success'?<Check size={19}/>:n.kind==='welcome'?<Bell size={19}/>:<Info size={19}/>}</span><span className="notification-copy"><b>{n.title}</b><span>{n.message}</span><time dateTime={n.date}>{new Date(n.date).toLocaleString()}</time></span><ChevronRight size={16}/></button>):<div className="empty"><Bell size={36}/><h2>All caught up<span className="spark">.</span></h2><p>Your test updates will appear here.</p></div>}</section></>}
`;
s=s.replace("{page==='settings'&&",inbox+"{page==='settings'&&");
s=s.replace('<details key={h.id}>','<details key={h.id} id={\'result-\'+h.id}>');
s=s.replace('<h2>Data & privacy</h2>',`<h2>Welcome & updates</h2><p className="muted">Welcome messages and test outcomes appear inside SNet. Open the bell to revisit them. No browser notification permission is needed.</p><button className="secondary" onClick={()=>{setToast(null);setLaunchStage('welcome')}}>Show welcome screen <ArrowUpRight size={16}/></button><hr/><h2>Data & privacy</h2>`);
const oldToast='<nav className="bottom-nav"';
const tail='{toast&&<div className="toast" role="status"><Info size={17}/>{toast}</div>}</div>}';
const replacement=`</div>{toast&&launchStage==='ready'&&<div className={'toast notification-toast '+toast.kind} role={toast.kind==='error'?'alert':'status'} aria-atomic="true"><span className="toast-icon">{toast.kind==='success'?<Check size={19}/>:toast.kind==='welcome'?<Bell size={19}/>:<Info size={19}/>}</span><div>{toast.title&&<b>{toast.title}</b>}<span>{toast.message}</span>{toast.title&&<button className="toast-action" onClick={()=>{navigate('notifications');setToast(null)}}>View updates <ChevronRight size={12}/></button>}</div><button className="toast-dismiss" aria-label="Dismiss notification" onClick={()=>setToast(null)}><X size={16}/></button></div>}{launchStage!=='ready'&&<LaunchScreen key={launchStage} stage={launchStage} onContinue={finishWelcome}/>}</div>}`;
if(!s.includes(tail))throw Error('Toast tail missing');s=s.replace(tail,replacement);
fs.writeFileSync(p,s);
let motion=fs.readFileSync('src/motion.jsx','utf8').replace('root, page, busy, result, toast)', 'root, page, busy, result, toast, launchStage)');motion=motion.replace('const media = gsap.matchMedia();',"if (launchStage !== 'ready') return;\n    const media = gsap.matchMedia();");motion=motion.replace('}, [root, page]);','}, [root, page, launchStage]);');fs.writeFileSync('src/motion.jsx',motion);
