import React, {useLayoutEffect, useRef} from 'react';
import {gsap} from 'gsap';

// One scoped motion system; every animation is reverted when its screen leaves.
export function useAppMotion(root, page, busy, result, toast, launchStage) {
  useLayoutEffect(() => {
    if (launchStage !== 'ready') return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = root.current;
      const elements = scope.querySelectorAll('.app-welcome .eyebrow, .app-welcome h1, .app-welcome p, .page-heading > div, .quick-test, .mobile-section-title, .mobile-connection, .mobile-recent, .test-panel, .test-options, .detail-grid > .panel, .history-actions, .history-list details, .empty');
      if (elements.length) gsap.fromTo(elements, {autoAlpha:0, y:16}, {autoAlpha:1, y:0, duration:.48, stagger:.045, ease:'power2.out', clearProps:'opacity,visibility,transform'});
      const cards = scope.querySelectorAll('.app-tool');
      if (cards.length) gsap.fromTo(cards, {autoAlpha:0, y:18, scale:.97}, {autoAlpha:1, y:0, scale:1, duration:.45, stagger:.055, delay:.12, ease:'power2.out', clearProps:'opacity,visibility,transform'});
      const active = scope.querySelector('.bottom-item.active svg');
      if (active) gsap.fromTo(active, {y:3, scale:.85}, {y:0, scale:1, duration:.4, ease:'back.out(1.7)', clearProps:'transform'});
    }, root);
    return () => media.revert();
  }, [root, page, launchStage]);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', context => {
      const scope = root.current;
      let pressed = null;
      context.add('release', () => {
        if (!pressed) return;
        const button = pressed;
        pressed = null;
        gsap.to(button, {scale:1, duration:.24, ease:'back.out(1.6)', overwrite:'auto', clearProps:'transform'});
      });
      context.add('press', event => {
        const button = event.target.closest?.('button:not(:disabled)');
        if (!button || !scope.contains(button)) return;
        context.release();
        pressed = button;
        gsap.to(button, {scale:.965, duration:.1, ease:'power2.out', overwrite:'auto'});
      });
      scope.addEventListener('pointerdown', context.press);
      window.addEventListener('pointerup', context.release);
      window.addEventListener('pointercancel', context.release);
      return () => {
        scope.removeEventListener('pointerdown', context.press);
        window.removeEventListener('pointerup', context.release);
        window.removeEventListener('pointercancel', context.release);
      };
    }, root);
    return () => media.revert();
  }, [root, page]);

  useLayoutEffect(() => {
    if (!busy) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const dot = root.current.querySelector('.phase .status-dot');
      if (dot) gsap.to(dot, {opacity:.25, scale:.8, duration:.65, repeat:-1, yoyo:true, ease:'sine.inOut'});
    }, root);
    return () => media.revert();
  }, [root, busy]);

  useLayoutEffect(() => {
    if (!result) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const block = root.current.querySelector('.result-block');
      if (block) gsap.fromTo(block, {autoAlpha:0, y:12}, {autoAlpha:1, y:0, duration:.4, ease:'power2.out', clearProps:'opacity,visibility,transform'});
    }, root);
    return () => media.revert();
  }, [root, result]);

  useLayoutEffect(() => {
    if (!toast) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const element = root.current.querySelector('.toast');
      if (element) gsap.fromTo(element, {opacity:0}, {opacity:1, duration:.2, clearProps:'opacity'});
    }, root);
    return () => media.revert();
  }, [root, toast]);
}

const colors = ['#8052ff','#a888ff','#ffb829','#15846e','#e0cbff'];
const particles = Array.from({length:900}, (_,i) => {
  const y = 1 - 2*(i+.5)/900;
  const radius = Math.sqrt(1-y*y);
  const angle = i*2.3999632297;
  return {x:radius*Math.cos(angle), y, z:radius*Math.sin(angle), color:colors[i%colors.length], solid:i%8===0};
});

export function AnimatedGlobe() {
  const canvasRef = useRef(null);
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const drawing = canvas.getContext('2d');
    if (!drawing) return;
    const state = {turn:0};
    let lastDraw = -Infinity;
    const draw = (force=false) => {
      const now = performance.now();
      if (!force && now-lastDraw < 1000/30) return;
      lastDraw = now;
      drawing.clearRect(0,0,600,600);
      const cosine = Math.cos(state.turn), sine = Math.sin(state.turn);
      const projected = particles.map(p => {
        const depth = p.z*cosine-p.x*sine;
        return {...p, depth, px:300+(p.x*cosine+p.z*sine)*222, py:288+(p.y*.965-depth*.16)*217};
      }).sort((a,b)=>a.depth-b.depth);
      for (const p of projected) {
        const size = 1.25+(p.depth+1)*1.2;
        drawing.globalAlpha = .2+(p.depth+1)*.36;
        drawing.strokeStyle = p.color;
        drawing.fillStyle = p.color;
        drawing.lineWidth = .5+(p.depth+1)*.25;
        drawing.beginPath();
        drawing.moveTo(p.px,p.py-size);
        drawing.lineTo(p.px+size*.86,p.py+size*.6);
        drawing.lineTo(p.px-size*.86,p.py+size*.6);
        drawing.closePath();
        if(p.solid) drawing.fill(); else drawing.stroke();
      }
      drawing.globalAlpha = 1;
      canvas.dataset.rotation = state.turn.toFixed(3);
    };
    draw(true);
    const media = gsap.matchMedia();
    media.add({motion:'(prefers-reduced-motion: no-preference)', reduced:'(prefers-reduced-motion: reduce)'}, context => {
      if (context.conditions.reduced) {
        state.turn = .3;
        canvas.dataset.motion = 'reduced';
        draw(true);
        return;
      }
      const spin = gsap.fromTo(state, {turn:0}, {turn:Math.PI*2, duration:42, ease:'none', repeat:-1, paused:true, onUpdate:()=>draw()});
      let visible = true;
      const sync = () => {
        const running = visible && !document.hidden;
        canvas.dataset.motion = running?'running':'paused';
        if(running) spin.play(); else spin.pause();
      };
      const observer = new IntersectionObserver(entries => {visible=entries[0].isIntersecting;sync()}, {threshold:.05});
      observer.observe(canvas);
      document.addEventListener('visibilitychange',sync);
      sync();
      return () => {observer.disconnect();document.removeEventListener('visibilitychange',sync)};
    });
    return () => media.revert();
  }, []);
  return <canvas ref={canvasRef} className="constellation gsap-globe" width="600" height="600" aria-hidden="true"/>;
}
