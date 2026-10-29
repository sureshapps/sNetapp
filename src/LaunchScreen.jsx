import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {gsap} from 'gsap';
import {Activity,ArrowUpRight,Check,Shield} from 'lucide-react';
import {AnimatedGlobe} from './motion.jsx';

export function LaunchScreen({stage,onContinue}) {
  const root=useRef(null);
  useEffect(()=>{const previous=document.body.style.overflow;document.body.style.overflow='hidden';if(stage==='welcome')root.current.focus({preventScroll:true});return()=>{document.body.style.overflow=previous}},[stage]);
  useLayoutEffect(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const items=root.current.querySelectorAll('.launch-wordmark,.launch-label,.welcome-art,.welcome-title,.welcome-intro,.welcome-feature,.welcome-action,.splash-status');
      gsap.fromTo(items,{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.5,stagger:.065,ease:'power2.out',clearProps:'opacity,visibility,transform'});
      if(stage==='splash'){
        gsap.to(root.current.querySelector('.launch-orbit'),{rotation:360,repeat:-1,duration:2.6,ease:'none'});
        gsap.fromTo(root.current.querySelector('.splash-track span'),{scaleX:.25,transformOrigin:'left center'},{scaleX:1,repeat:-1,yoyo:true,duration:.9,ease:'sine.inOut'});
      }
    },root);
    return()=>media.revert();
  },[stage]);
  return <div ref={root} className={'launch-screen '+stage} tabIndex={stage==='welcome'?-1:undefined} role={stage==='welcome'?'dialog':'status'} aria-modal={stage==='welcome'?true:undefined} aria-label={stage==='welcome'?'Welcome to SNet':'Loading SNet'}>
    {stage==='splash'?<div className="splash-center"><div className="splash-symbol" aria-hidden="true"><div className="launch-orbit"/><span className="brand-mark">S<span>•</span></span></div><div className="launch-wordmark">SNet</div><p className="launch-label">A CLEARER CONNECTION.</p><div className="splash-status"><div className="splash-track" aria-hidden="true"><span/></div><p>Getting your toolkit ready…</p></div></div>:<div className="welcome-content"><div className="welcome-top"><span className="launch-wordmark">SNet</span><span className="launch-label">HELLO, CURIOUS.</span></div><div className="welcome-art" aria-hidden="true"><AnimatedGlobe/></div><div className="launch-label">WELCOME TO YOUR NETWORK TOOLKIT</div><h1 className="welcome-title" tabIndex="-1">A clearer<br/>connection<br/>starts here<span className="spark">.</span></h1><p className="welcome-intro">Get to know the connection you use every day.</p><div className="welcome-features"><div className="welcome-feature"><Activity size={19}/><div><b>Measure what matters</b><p>Speed, latency and device performance.</p></div></div><div className="welcome-feature"><Shield size={19}/><div><b>Keep your discoveries</b><p>Test results stay saved on this device.</p></div></div><div className="welcome-feature"><Check size={19}/><div><b>Stay in the know</b><p>A notification after every test.</p></div></div></div><div className="welcome-action"><button className="primary" onClick={onContinue}>Let’s get connected <ArrowUpRight size={18}/></button><p>Your network. Understood.</p></div></div>}
  </div>;
}
