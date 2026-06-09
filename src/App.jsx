import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import * as d3 from 'd3';

/* ═══════════════════════════════════════════════════
   PERSONAL DATA — edit only this block
═══════════════════════════════════════════════════ */
const ME = {
  name: 'Divyank Richhariya',
  displayFirst: 'Divyank',
  displayHandle: 'divyank.',
  role: 'Full Stack Developer',
  degree: 'B.Tech CSE (AIML) · KIET · 2029',
  location: 'Delhi NCR, IN',
  bio: "I'm a 1st-year CSE undergrad who builds things — real things. From AI deepfake detectors to healthcare ecosystems to MSME compliance platforms. I vibe-code fast, learn faster, and ship.",
  github: 'https://github.com/Doremon-tech-svg',
  linkedin: 'https://www.linkedin.com/in/divyank-richhariya-97508b382',
  twitter: 'https://x.com/DivyankRic82579',
  medium: 'https://medium.com/@richhariyadivyank1',
  email: 'richhariyadivyank1@gmail.com',
  resume: 'https://drive.google.com/file/d/17A6eRY4LnWsh8_DhDKHmBP53LLpOwtye/view?usp=sharing',
};

/* ═══════════════════════════════════════════════════
   THEME VARS
═══════════════════════════════════════════════════ */
const THEMES = {
  dark: `--bg:#080A0F;--bg1:#0D1117;--bg2:#111827;--card:#0F1623;--border:#1F2937;--border2:#374151;--text:#F9FAFB;--muted:#6B7280;--dim:#374151;--accent:#7C3AED;--a2:#9D72FF;--a3:#C4B5FD;--green:#10B981;--amber:#F59E0B;--red:#EF4444;--blue:#3B82F6;`,
  light: `--bg:#FAF7F2;--bg1:#F3EFE8;--bg2:#EDE8E0;--card:#FFFFFF;--border:#D6CFC4;--border2:#B8B0A4;--text:#0A0A0A;--muted:#6B6560;--dim:#A89F96;--accent:#C94A1F;--a2:#E05A2B;--a3:#F08060;--green:#1A7A4A;--amber:#B07A10;--red:#C0392B;--blue:#1A55A0;`,
  xray: `--bg:#020912;--bg1:#040F22;--bg2:#071326;--card:#041830;--border:#0A2A50;--border2:#0D3A6E;--text:#E8F4FF;--muted:#4A7FAA;--dim:#1A3A5C;--accent:#00AAFF;--a2:#33BBFF;--a3:#99DDFF;--green:#00FF88;--amber:#FFD700;--red:#FF4466;--blue:#00AAFF;`,
};

/* ═══════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
:root{${THEMES.dark}}
[data-theme="light"]{${THEMES.light}}
[data-theme="xray"]{${THEMES.xray}}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;cursor:none}
body{background:var(--bg);color:var(--text);font-family:'Syne',sans-serif;overflow-x:hidden;line-height:1.6;transition:background .5s ease,color .4s ease}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--accent)}
.mono{font-family:'JetBrains Mono',monospace}
#cur-dot{position:fixed;top:0;left:0;width:5px;height:5px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:9999;will-change:transform;mix-blend-mode:screen}
#cur-ring{position:fixed;top:0;left:0;width:28px;height:28px;border-radius:50%;border:1px solid rgba(124,58,237,.45);pointer-events:none;z-index:9998;will-change:transform;transition:width .2s,height .2s,opacity .2s}
#cur-ring.hov{width:44px;height:44px;opacity:.55;border-color:var(--accent)}
[data-theme="light"] #cur-dot{mix-blend-mode:multiply}
[data-theme="xray"] #cur-dot{background:var(--a2);box-shadow:0 0 8px var(--a2)}
[data-theme="xray"] #cur-ring{border-color:rgba(0,170,255,.5)}
@media(hover:none){html{cursor:auto}#cur-dot,#cur-ring{display:none!important}}

@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}50%{box-shadow:0 0 28px 4px rgba(124,58,237,.22)}}
@keyframes glowL{0%,100%{box-shadow:0 0 0 0 rgba(201,74,31,0)}50%{box-shadow:0 0 24px 3px rgba(201,74,31,.18)}}
@keyframes glowX{0%,100%{box-shadow:0 0 0 0 rgba(0,170,255,0)}50%{box-shadow:0 0 24px 4px rgba(0,170,255,.25)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes orbit{0%{transform:rotate(0deg) translateX(80px) rotate(0deg)}100%{transform:rotate(360deg) translateX(80px) rotate(-360deg)}}
@keyframes scanX{0%{transform:translateX(-100%)}100%{transform:translateX(220%)}}
@keyframes waveBar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes glitchH{0%,100%{clip-path:inset(0 0 95% 0)}20%{clip-path:inset(30% 0 50% 0)}40%{clip-path:inset(70% 0 15% 0)}60%{clip-path:inset(10% 0 80% 0)}}
@keyframes glitchH2{0%,100%{clip-path:inset(0 0 95% 0)}25%{clip-path:inset(60% 0 20% 0)}50%{clip-path:inset(15% 0 70% 0)}}
@keyframes measureP{0%,100%{opacity:.5}50%{opacity:1}}

.float{animation:float 3s ease-in-out infinite}
[data-theme="xray"] section::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,170,255,.04) 39px,rgba(0,170,255,.04) 40px);pointer-events:none;z-index:0}

@media(max-width:640px){
  .hm{display:none!important}
  .sm{flex-direction:column!important}
  .g1{grid-template-columns:1fr!important}
  .pm{padding:48px 16px!important}
}
`;

/* ═══════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════ */
function LoadingScreen({ onDone }) {
  const [prog, setProg] = useState(0);
  const [lines, setLines] = useState([]);
  const [out, setOut] = useState(false);
  const cvs = useRef(null);
  const boots = [
    '> INITIALIZING PORTFOLIO v5.3...',
    '> LOADING DIVYANK.RICHHARIYA MODULE...',
    '> MOUNTING PROJECT REGISTRY...',
    '> COMPILING TECH STACK...',
    '> CALIBRATING INTERACTION ENGINE...',
    '> ALL SYSTEMS NOMINAL. WELCOME.',
  ];
  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cols = Math.floor(c.width / 14);
    const drops = Array(cols).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const id = setInterval(() => {
      ctx.fillStyle = 'rgba(2,9,18,0.08)'; ctx.fillRect(0, 0, c.width, c.height);
      drops.forEach((y, i) => {
        ctx.fillStyle = i % 7 === 0 ? '#7C3AED' : '#0A3A2A';
        ctx.font = '12px JetBrains Mono,monospace';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
        if (y * 14 > c.height && Math.random() > .975) drops[i] = 0;
        drops[i]++;
      });
    }, 50);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 5 + 1; if (p > 100) p = 100;
      setProg(Math.floor(p));
      setLines(boots.slice(0, Math.ceil((p / 100) * boots.length)));
      if (p >= 100) { clearInterval(iv); setTimeout(() => { setOut(true); setTimeout(onDone, 600); }, 300); }
    }, 60);
    return () => clearInterval(iv);
  }, []);
  return (
    <AnimatePresence>
      {!out && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: .6 }}
          style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#020912', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace' }}>
          <canvas ref={cvs} style={{ position: 'absolute', inset: 0, opacity: .22 }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', maxWidth: 460, padding: '0 32px' }}>
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 28 }}>
              <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="8" r="3" fill="#7C3AED" />
                <circle cx="6" cy="24" r="2.5" fill="#9D72FF" opacity=".8" />
                <circle cx="26" cy="24" r="2.5" fill="#9D72FF" opacity=".8" />
                <line x1="16" y1="11" x2="6.8" y2="21.5" stroke="#9D72FF" strokeWidth="1" opacity=".6" />
                <line x1="16" y1="11" x2="25.2" y2="21.5" stroke="#9D72FF" strokeWidth="1" opacity=".6" />
                <line x1="8.5" y1="24" x2="23.5" y2="24" stroke="#C4B5FD" strokeWidth=".8" opacity=".4" strokeDasharray="2 2" />
              </svg>
            </motion.div>
            <div style={{ fontSize: 10, color: '#7C3AED', letterSpacing: '.3em', marginBottom: 6 }}>NEXUS PORTFOLIO</div>
            <div style={{ fontSize: 26, fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#F9FAFB', marginBottom: 4, letterSpacing: '-.02em' }}>
              divyank<span style={{ color: '#7C3AED' }}>.</span>
            </div>
            <div style={{ fontSize: 9, color: '#374151', letterSpacing: '.2em', marginBottom: 36 }}>FULL STACK DEV · AI TINKERER · 2029</div>
            <div style={{ textAlign: 'left', background: 'rgba(124,58,237,.05)', border: '1px solid rgba(124,58,237,.2)', padding: '14px 18px', marginBottom: 24, minHeight: 110 }}>
              {lines.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .2 }}
                  style={{ fontSize: 9, color: i === lines.length - 1 ? '#9D72FF' : '#374151', marginBottom: 4, letterSpacing: '.06em' }}>
                  {l}{i === lines.length - 1 && <span style={{ animation: 'blink 1s infinite' }}>█</span>}
                </motion.div>
              ))}
            </div>
            <div style={{ height: 2, background: 'rgba(124,58,237,.15)', marginBottom: 7, overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: 'linear-gradient(to right,#7C3AED,#9D72FF)' }} animate={{ width: `${prog}%` }} transition={{ duration: .1 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#374151', letterSpacing: '.1em' }}>
              <span>LOADING EXPERIENCE</span><span style={{ color: '#9D72FF' }}>{prog}%</span>
            </div>
          </div>
          {[{ top: 14, left: 14 }, { top: 14, right: 14 }, { bottom: 14, left: 14 }, { bottom: 14, right: 14 }].map((pos, i) => (
            <svg key={i} width="22" height="22" viewBox="0 0 22 22" style={{ position: 'absolute', ...pos, opacity: .35 }}>
              <line x1="11" y1="0" x2="11" y2="8" stroke="#7C3AED" strokeWidth="1" />
              <line x1="14" y1="11" x2="22" y2="11" stroke="#7C3AED" strokeWidth="1" />
              <line x1="11" y1="14" x2="11" y2="22" stroke="#7C3AED" strokeWidth="1" />
              <line x1="0" y1="11" x2="8" y2="11" stroke="#7C3AED" strokeWidth="1" />
            </svg>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════
   X-RAY TRANSITIONS
═══════════════════════════════════════════════════ */
function XRayEnter({ active, onComplete }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!active) { setStage(0); return; }
    setStage(1);
    const t1 = setTimeout(() => setStage(2), 380);
    const t2 = setTimeout(() => setStage(3), 820);
    const t3 = setTimeout(() => { setStage(4); onComplete?.(); }, 1350);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active]);
  if (!active || stage === 0) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, pointerEvents: stage < 4 ? 'all' : 'none' }}>
      {stage === 1 && <>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', animation: 'glitchH .35s steps(1) forwards' }} />
        <div style={{ position: 'absolute', inset: 0, background: '#7C3AED', opacity: .1, animation: 'glitchH2 .35s steps(1) forwards', mixBlendMode: 'screen' }} />
        {[15, 38, 62, 77].map(y => <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: `${1 + Math.random() * 3}%`, background: 'rgba(0,170,255,.15)', mixBlendMode: 'screen' }} />)}
      </>}
      {stage === 2 && <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <motion.div initial={{ scaleX: 0, transformOrigin: 'left' }} animate={{ scaleX: 1 }} transition={{ duration: .42, ease: [0.7, 0, 0.3, 1] }} style={{ position: 'absolute', inset: 0, background: '#020912' }} />
        <motion.div initial={{ left: '-4px' }} animate={{ left: '100%' }} transition={{ duration: .42, ease: [0.7, 0, 0.3, 1] }} style={{ position: 'absolute', top: 0, bottom: 0, width: 4, background: 'var(--a2)', boxShadow: '0 0 20px 4px var(--a2)' }} />
      </div>}
      {stage === 3 && <div style={{ position: 'absolute', inset: 0, background: '#020912', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,170,255,.1) 39px,rgba(0,170,255,.1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,170,255,.07) 39px,rgba(0,170,255,.07) 40px)' }} />
        <motion.div initial={{ top: '-2px' }} animate={{ top: '100%' }} transition={{ duration: .48, ease: 'linear' }} style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(to right,transparent,var(--a2),transparent)', boxShadow: '0 0 16px 2px rgba(0,170,255,.5)' }} />
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(0,170,255,.7)', letterSpacing: '.2em', textAlign: 'center', lineHeight: 2.2 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .05 }}>INITIALIZING X-RAY SUBSYSTEM</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }} style={{ color: 'rgba(0,255,136,.6)' }}>▸ STRUCTURAL ANALYSIS READY</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .28 }} style={{ color: 'var(--a2)' }}>▸ X-RAY MODE ACTIVE_</motion.div>
        </div>
      </div>}
    </div>
  );
}
function XRayExit({ active, onComplete }) {
  useEffect(() => { if (!active) return; const t = setTimeout(() => onComplete?.(), 550); return () => clearTimeout(t); }, [active]);
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, pointerEvents: 'all', overflow: 'hidden' }}>
      <motion.div initial={{ scaleX: 0, transformOrigin: 'right' }} animate={{ scaleX: 1 }} transition={{ duration: .5, ease: [0.7, 0, 0.3, 1] }} style={{ position: 'absolute', inset: 0, background: '#080A0F' }} />
      <motion.div initial={{ right: '-4px' }} animate={{ right: '100%' }} transition={{ duration: .5, ease: [0.7, 0, 0.3, 1] }} style={{ position: 'absolute', top: 0, bottom: 0, width: 4, background: '#9D72FF', boxShadow: '0 0 20px 4px #9D72FF' }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════════ */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const pos = { x: -100, y: -100 }, lag = { x: -100, y: -100 }; let raf;
    const mv = e => { pos.x = e.clientX; pos.y = e.clientY; const t = e.target.closest('a,button,[role=button]'); ring.current?.classList.toggle('hov', !!t); };
    const tick = () => { lag.x += (pos.x - lag.x) * .1; lag.y += (pos.y - lag.y) * .1; if (dot.current) dot.current.style.transform = `translate(${pos.x - 2.5}px,${pos.y - 2.5}px)`; if (ring.current) ring.current.style.transform = `translate(${lag.x - 14}px,${lag.y - 14}px)`; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); window.addEventListener('mousemove', mv, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', mv) };
  }, []);
  return <><div id="cur-dot" ref={dot} /><div id="cur-ring" ref={ring} /></>;
}

/* ═══════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════ */
function NoiseBG() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const draw = () => { c.width = window.innerWidth; c.height = window.innerHeight; const id = ctx.createImageData(c.width, c.height); const d = id.data; for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 9; } ctx.putImageData(id, 0, 0); };
    draw(); window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: .35 }} />;
}
function GridLines({ theme }) {
  const col = theme === 'xray' ? 'rgba(0,170,255,.09)' : theme === 'light' ? 'rgba(0,0,0,.04)' : 'rgba(124,58,237,.055)';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i + 1) * 16.666}%`, width: '1px', background: `linear-gradient(to bottom,transparent 0%,${col} 30%,${col} 70%,transparent 100%)`, transition: 'background .5s' }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   THEME SWITCHER + NAV
═══════════════════════════════════════════════════ */
function Sigil({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="8" r="3" fill="var(--accent)" />
      <circle cx="6" cy="24" r="2.5" fill="var(--a3)" opacity=".8" />
      <circle cx="26" cy="24" r="2.5" fill="var(--a3)" opacity=".8" />
      <line x1="16" y1="11" x2="6.8" y2="21.5" stroke="var(--a2)" strokeWidth="1" opacity=".6" />
      <line x1="16" y1="11" x2="25.2" y2="21.5" stroke="var(--a2)" strokeWidth="1" opacity=".6" />
      <line x1="8.5" y1="24" x2="23.5" y2="24" stroke="var(--a3)" strokeWidth=".8" opacity=".4" strokeDasharray="2 2" />
    </svg>
  );
}
const NAV_IDS = ['hero', 'about', 'work', 'tech', 'vision', 'games', 'contact'];
const NAV_LABELS = ['Home', 'About', 'Work', 'Stack', 'Vision', 'Arcade', 'Contact'];
function Nav({ theme, onSwitch, scrollY }) {
  const sc = scrollY > 60;
  const jump = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const opts = [{ k: 'dark', l: '◐', t: 'DARK' }, { k: 'light', l: '☼', t: 'LIGHT' }, { k: 'xray', l: '⬡', t: 'XRAY' }];
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: sc ? (theme === 'light' ? 'rgba(250,247,242,.94)' : 'rgba(8,10,15,.94)') : 'transparent', borderBottom: sc ? '1px solid var(--border)' : '1px solid transparent', backdropFilter: sc ? 'blur(14px)' : 'none', transition: 'all .3s', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, letterSpacing: '.1em' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Sigil size={26} />
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', opacity: .9 }}>
          divyank<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
      </div>
      <div className="hm" style={{ display: 'flex', gap: 22 }}>
        {NAV_IDS.map((id, i) => (
          <button key={id} onClick={() => jump(id)} style={{ background: 'none', border: 'none', cursor: 'none', color: 'var(--muted)', fontSize: 9, letterSpacing: '.12em', fontFamily: 'JetBrains Mono,monospace', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color = 'var(--text)'} onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{NAV_LABELS[i].toUpperCase()}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,.15)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)', padding: '2px', gap: 0 }}>
        {opts.map(o => (
          <button key={o.k} onClick={() => onSwitch(o.k)} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, padding: '5px 10px', border: 'none', cursor: 'none', background: theme === o.k ? 'var(--accent)' : 'transparent', color: theme === o.k ? '#fff' : 'var(--muted)', letterSpacing: '.08em', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10 }}>{o.l}</span><span className="hm">{o.t}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   X-RAY ANNOTATIONS
═══════════════════════════════════════════════════ */
function XRayAnnotations({ active }) {
  if (!active) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .4, delay: .2 }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 400, fontFamily: 'JetBrains Mono,monospace' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <line x1="80" y1="40" x2="80" y2="90" stroke="rgba(0,170,255,.25)" strokeWidth=".2" strokeDasharray="1 1" />
        <line x1="10" y1="58" x2="90" y2="58" stroke="rgba(0,170,255,.25)" strokeWidth=".2" strokeDasharray="1 1" />
        <circle cx="50" cy="50" r="1.5" fill="none" stroke="rgba(0,170,255,.35)" strokeWidth=".3" style={{ animation: 'measureP 2s ease-in-out infinite' }} />
      </svg>
      {[{ top: '5%', right: '2%', text: 'HERO · 100vh', sub: 'z-index:10' }, { top: '12%', left: '1.5%', text: 'NOISE · α8', sub: 'canvas:fixed' }, { bottom: '7%', right: '2%', text: 'GRID · 6 col', sub: '16.6% each' }, { top: '52%', left: '1.5%', text: 'Z-STACK', sub: '0→500' }].map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: c.left ? -8 : 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 * i + .25 }}
          style={{ position: 'fixed', ...Object.fromEntries(['top', 'bottom', 'left', 'right'].filter(k => c[k]).map(k => [k, c[k]])), padding: '4px 8px', border: '1px solid rgba(0,170,255,.28)', background: 'rgba(2,9,18,.88)', fontSize: 8, lineHeight: 1.7, animation: 'measureP 3s ease-in-out infinite' }}>
          <div style={{ color: 'rgba(0,170,255,.85)', letterSpacing: '.1em' }}>{c.text}</div>
          <div style={{ color: 'rgba(0,170,255,.4)', letterSpacing: '.06em' }}>{c.sub}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MUSIC PLAYER
═══════════════════════════════════════════════════ */
function MusicPlayer({ theme }) {
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.4);
  const [exp, setExp] = useState(false);
  const audioRef = useRef(null);

  const tracks = [
    { name: 'NEURAL DRIFT', genre: 'AMBIENT', src: '/music/neural-drift.mp3' },
    { name: 'CIRCUIT FLOW', genre: 'LO-FI', src: '/music/circuit-flow.mp3' },
    { name: 'DEEP SPACE', genre: 'CHILLWAVE', src: '/music/deep-space.mp3' }
  ];
  const [track, setTrack] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
      if (playing) {
        audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, vol, track]);

  const toggle = () => setPlaying(!playing);
  const changeTrack = (idx) => {
    setTrack(idx);
    if (playing) {
      // restart playback with new track
      setTimeout(() => {
        if (audioRef.current && playing) audioRef.current.play();
      }, 50);
    }
  };

  const ac = theme === 'xray' ? '#00AAFF' : theme === 'light' ? '#C94A1F' : '#7C3AED';

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 300, fontFamily: 'JetBrains Mono,monospace' }}>
      <audio ref={audioRef} src={tracks[track].src} loop />
      <AnimatePresence>
        {exp && (
          <motion.div initial={{ opacity: 0, y: 10, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .95 }}
            style={{ marginBottom: 8, width: 248, background: theme === 'light' ? 'rgba(250,247,242,.97)' : 'rgba(8,10,15,.97)', border: `1px solid ${ac}40`, backdropFilter: 'blur(16px)', padding: 14 }}>
            <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '.15em', marginBottom: 10 }}>AMBIENT STUDIO · STATIC</div>
            {tracks.map((t, i) => (
              <div key={i} onClick={() => changeTrack(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', marginBottom: 3, cursor: 'none', background: track === i ? `${ac}12` : 'transparent', border: `1px solid ${track === i ? ac + '35' : 'transparent'}`, transition: 'all .2s' }}>
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: track === i ? ac : 'var(--muted)' }}>
                  {track === i && playing ? (<div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>{[1, 2, 3].map(b => <div key={b} style={{ width: 3, background: ac, height: '100%', animation: `waveBar ${.4 + b * .15}s ease-in-out infinite`, animationDelay: `${b * .1}s` }} />)}</div>) : `0${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: track === i ? 'var(--text)' : 'var(--muted)', letterSpacing: '.07em' }}>{t.name}</div>
                  <div style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: '.1em' }}>{t.genre}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '.1em' }}>VOL</span>
              <input type="range" min="0" max="1" step="0.01" value={vol} onChange={e => setVol(parseFloat(e.target.value))} style={{ flex: 1, height: 2, accentColor: ac, cursor: 'none' }} />
              <span style={{ fontSize: 8, color: ac }}>{Math.round(vol * 100)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 7, justifyContent: 'flex-end' }}>
        {playing && <div style={{ display: 'flex', gap: 3, alignItems: 'center', padding: '0 10px', height: 38, background: `${ac}12`, border: `1px solid ${ac}28` }}>{[1, 2, 3, 4].map(b => <div key={b} style={{ width: 3, borderRadius: 1, background: ac, animation: `waveBar ${.3 + b * .1}s ease-in-out infinite`, animationDelay: `${b * .08}s`, height: 15 }} />)}</div>}
        <button onClick={() => setExp(e => !e)} style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'light' ? 'rgba(250,247,242,.97)' : 'rgba(8,10,15,.97)', border: `1px solid ${ac}35`, cursor: 'none', color: 'var(--muted)', fontSize: 14, transition: 'all .2s' }}>♪</button>
        <button onClick={toggle} style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: playing ? ac : (theme === 'light' ? 'rgba(250,247,242,.97)' : 'rgba(8,10,15,.97)'), border: `1px solid ${ac}35`, cursor: 'none', color: playing ? '#fff' : 'var(--muted)', fontSize: 13, transition: 'all .2s', boxShadow: playing ? `0 0 18px ${ac}45` : 'none' }}>{playing ? '■' : '▶'}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */
function Hero({ theme }) {
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 800); return () => clearInterval(t); }, []);
  const copy = () => { navigator.clipboard.writeText(ME.email); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const ga = theme === 'light' ? 'glowL 3s ease-in-out infinite' : theme === 'xray' ? 'glowX 3s ease-in-out infinite' : 'glow 3s ease-in-out infinite';
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 10% 80px', position: 'relative', zIndex: 10 }}>
      {/* orbiting orb */}
      {theme !== 'light' && (
        <div style={{ position: 'absolute', top: '50%', right: '8%', width: 160, height: 160, transform: 'translateY(-60%)', pointerEvents: 'none' }} className="hm">
          <svg width="160" height="160" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="80" cy="80" r="78" fill="none" stroke={theme === 'xray' ? 'rgba(0,170,255,.14)' : 'rgba(124,58,237,.11)'} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="80" cy="80" r="52" fill="none" stroke={theme === 'xray' ? 'rgba(0,170,255,.08)' : 'rgba(124,58,237,.07)'} strokeWidth="1" />
            <circle cx="80" cy="80" r="28" fill="none" stroke={theme === 'xray' ? 'rgba(0,170,255,.18)' : 'rgba(124,58,237,.14)'} strokeWidth="1" />
            <circle cx="80" cy="80" r="4" fill="var(--accent)" />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', animation: 'orbit 6s linear infinite' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--a2)', boxShadow: `0 0 12px var(--a2)`, marginTop: 1, marginLeft: 36 }} />
          </div>
        </div>
      )}

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${theme === 'xray' ? '#00AAFF' : '#7C3AED'}`,
          boxShadow: `0 0 32px ${theme === 'xray' ? 'rgba(0,170,255,.3)' : 'rgba(124,58,237,.25)'}`,
          flexShrink: 0
        }}
      >
        <img
          src="/avatar.jpeg"
          alt={ME.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .05 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '.2em', color: 'var(--a3)', padding: '4px 12px', border: '1px solid rgba(124,58,237,.2)', background: theme === 'light' ? 'rgba(201,74,31,.06)' : 'rgba(124,58,237,.08)' }}>{ME.degree}</span>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>{ME.location}</span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }}
        style={{ fontSize: 'clamp(48px,7vw,100px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-.02em', marginBottom: 18 }}>
        <span style={{ display: 'block', color: 'var(--text)', transition: 'color .4s' }}>Divyank</span>
        <span style={{ display: 'block', WebkitTextStroke: theme === 'light' ? '1.5px rgba(10,10,10,.22)' : '1px rgba(196,181,253,.38)', color: 'transparent', transition: 'all .4s' }}>Richhariya</span>
      </motion.h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3, duration: .5 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 24, height: 1, background: 'var(--accent)' }} />
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--a3)', letterSpacing: '.15em' }}>{ME.role.toUpperCase()}</span>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 14, color: 'var(--accent)', animation: 'pulse 1s step-end infinite' }}>{tick % 2 === 0 ? '█' : ''}</span>
      </motion.div>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .6 }}
        style={{ maxWidth: 520, fontSize: 15, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 36 }}>{ME.bio}</motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: .5 }}
        className="sm" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href={ME.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'var(--accent)', color: '#fff', textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '.1em', fontWeight: 500, animation: ga }} onMouseEnter={e => e.currentTarget.style.opacity = '.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>GITHUB ↗</a>
        <a href={ME.resume} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--a2)', textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '.1em', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,.1)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>RESUME ↗</a>
        <button onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'transparent', border: '1px solid var(--border2)', color: copied ? 'var(--green)' : 'var(--text)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '.1em', cursor: 'none', transition: 'all .2s' }}>{copied ? '✓ COPIED' : ME.email}</button>
        <a href={ME.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '11px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '.1em', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>IN ↗</a>
        <a href={ME.twitter} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '11px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '.1em', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>𝕏 ↗</a>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        style={{ position: 'absolute', bottom: 40, left: '10%', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '.2em', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 16, height: 1, background: 'var(--dim)' }} />SCROLL TO BUILD
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════ */
function About() {
  const skills = ['Python', 'Flask', 'SQLite', 'SQL', 'React', 'JavaScript', 'HTML/CSS', 'C', 'C++', 'Git', 'MongoDB (learning)', 'Node.js (learning)', 'Express (learning)', 'Solidity (learning)'];
  const learning = ['Node.js + Express', 'Solidity & Web3', 'System Design', 'DSA seriously', 'Blockchain internals'];
  const clubs = [
    { name: 'CoE AI Skills Lab — KIET', role: 'Blockchain Member', active: true },
    { name: 'GDG on Campus — KIET', role: 'ML Member', active: true },
    { name: 'DevUp — KIET', role: 'Web Dev Member', active: true },
  ];
  return (
    <section id="about" style={{ padding: '120px 10%', position: 'relative', zIndex: 10 }}>
      <SL>00 / ABOUT</SL>
      <ST>The Story</ST>
      <div className="g1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 48 }}>
        <div>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.95, marginBottom: 24 }}>
            I'm Divyank — a 1st year B.Tech CSE (AIML) student at KIET Group of Institutions, Delhi NCR. I build things on the internet. Started with basic HTML, now shipping full-stack AI apps with blockchain security and ML inference.
          </p>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.95, marginBottom: 24 }}>
            I vibe-code fast, ship often, and learn by doing. Most of my stack is self-taught through projects. Currently deep in backend architecture, distributed systems thinking, and actually understanding the math behind the models I use.
          </p>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.95 }}>
            Top 10 at CodeWizards Hackathon (100+ teams). Qualified final round at Dataverse. GSSoC contributor. 5–6 hackathons and counting.
          </p>
          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '.15em', marginBottom: 14 }}>COLLEGE CLUBS</div>
            {clubs.map(c => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10 }}>
                <span style={{ color: 'var(--text)' }}>{c.name}</span>
                <span style={{ color: 'var(--a3)', letterSpacing: '.08em' }}>{c.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '.15em', marginBottom: 14 }}>SKILLS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 32 }}>
            {skills.map(s => (
              <span key={s} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, padding: '4px 10px', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: '.07em', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--a2)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>{s}</span>
            ))}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '.15em', marginBottom: 14 }}>CURRENTLY LEARNING</div>
          {learning.map((l, i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i * .2}s`, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</span>
            </div>
          ))}
          <div style={{ marginTop: 24, padding: 16, border: '1px solid var(--border)', background: 'var(--card)', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, lineHeight: 1.9 }}>
            <div style={{ color: 'var(--a3)', marginBottom: 6, letterSpacing: '.12em' }}>CURRENTLY READING</div>
            <div style={{ color: 'var(--muted)' }}>Clean Code · Robert C. Martin</div>
            <div style={{ color: 'var(--muted)' }}>Designing Data-Intensive Apps · Kleppmann</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════ */
const STATS = [
  { v: '14+', l: 'Projects Shipped', icon: '◈' }, { v: '5+', l: 'Hackathons', icon: '⚡' },
  { v: 'Top 10', l: 'CodeWizards (100+ teams)', icon: '◎' }, { v: 'GSSoC', l: 'Open Source Contributor', icon: '◆' },
  { v: '3', l: 'College Clubs', icon: '▲' }, { v: '2029', l: 'Graduation Year', icon: '◌' },
];
function Stats() {
  return (
    <section style={{ padding: '80px 10%', position: 'relative', zIndex: 10, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="g1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 1 }}>
        {STATS.map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * .07, duration: .5 }} viewport={{ once: true }}
            style={{ padding: '28px 20px', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--card)', cursor: 'default', transition: 'border-color .25s,background .4s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ fontSize: 18, marginBottom: 7, color: 'var(--accent)' }}>{s.icon}</div>
            <div style={{ fontSize: 'clamp(18px,2.5vw,28px)', fontWeight: 800, fontFamily: 'Syne,sans-serif', color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>{s.l.toUpperCase()}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════ */
const PROJECTS = [
  { id: '01', name: 'AI HealthMate', tag: 'HACKATHON', status: 'live', desc: 'Unified AI health platform: diabetes ML prediction (XGBoost) + mental health assessment. Firebase auth, FastAPI backend, Recharts dashboards. Built for hackathon with real-world relevance.', tech: ['React', 'FastAPI', 'Firebase', 'Scikit-learn', 'TailwindCSS', 'Framer Motion'], stat: 'ML + Mental Health unified', color: '#10B981', link: 'https://ai-healthmate.vercel.app/', gh: 'https://github.com/Doremon-tech-svg/ai-healthmate', xray: { type: 'full-stack', nodes: ['React UI', 'Firebase Auth', 'FastAPI', 'XGBoost', 'Firestore', 'Charts'] } },
  { id: '02', name: 'ComplianceOS', tag: 'FLAGSHIP', status: 'live', desc: 'AI-powered platform for 6.3 crore Indian MSMEs. 5 AI agents (ARIA, VEDA, SCOUT, PATHWAY, SENTINEL) for compliance, scheme discovery, document OCR, portal navigation. Multi-agent LLM orchestration.', tech: ['React', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Groq LLM', 'Razorpay'], stat: '5 AI agents · MSME platform', color: '#7C3AED', link: '#', gh: 'https://github.com/Doremon-tech-svg/ComplainceOS', xray: { type: 'multi-agent', nodes: ['ARIA', 'VEDA', 'SCOUT', 'PATHWAY', 'SENTINEL', 'DB', 'Cache'] } },
  { id: '03', name: 'Healthcare Ecosystem', tag: 'TOP 10', status: 'live', desc: 'Production-grade hackathon project. 5 AI agents, blockchain consent (Solidity+Hardhat), XGBoost+SHAP fall risk prediction, Telegram alerts, role-based UI with 11 color-coded portals.', tech: ['React', 'FastAPI', 'XGBoost', 'SHAP', 'Solidity', 'Hardhat', 'ethers.js'], stat: 'Top 10 · CodeWizards (100+ teams)', color: '#F59E0B', link: '#', gh: 'https://github.com/Doremon-tech-svg/codewizrds_deploy/', xray: { type: 'microservices', nodes: ['Triage NLP', 'Bed Flow', 'Nurse AI', 'Decision', 'Sustainability', 'Blockchain'] } },
  { id: '04', name: 'DeepTrust AI', tag: 'AI + WEB3', status: 'live', desc: 'Deepfake detection using ViT model (Hugging Face) + blockchain-hashed proof on Ethereum Sepolia. Upload a face → get AI verdict → record proof on-chain via MetaMask.', tech: ['Python', 'Flask', 'ViT Model', 'Solidity', 'Web3.js', 'MetaMask', 'Sepolia'], stat: 'ViT + Blockchain proof', color: '#EF4444', link: 'https://deeptrust-ai-eta.vercel.app/', gh: 'https://github.com/Doremon-tech-svg/Deeptrust_AI', xray: { type: 'AI+blockchain', nodes: ['Image Upload', 'ViT Inference', 'Verdict', 'MetaMask', 'Sepolia', 'Audit Log'] } },
  { id: '05', name: 'LevelUp Journal', tag: 'LIVE', status: 'live', desc: 'Developer journaling app. Mood tracking, mind state, code progress log, smart reflection suggestions, animated particle background. Flask + SQLite, fully local.', tech: ['Python', 'Flask', 'SQLite', 'SQLAlchemy', 'HTML/CSS', 'Particles.js'], stat: 'Deployed on Render', color: '#60A5FA', link: 'https://levelup-journal.onrender.com', gh: 'https://github.com/Doremon-tech-svg/levelup-journal', xray: { type: 'full-stack', nodes: ['Flask', 'SQLite', 'Jinja2', 'Particles.js', 'CRUD', 'OCR'] } },
  { id: '06', name: 'Weather Vibes', tag: 'LIVE', status: 'live', desc: 'Animated weather app. Real-time weather by city, live local time, day/night mode, gradient backgrounds. Tomorrow.io + OpenCage APIs.', tech: ['HTML5', 'CSS3', 'JavaScript', 'Tomorrow.io API', 'OpenCage API'], stat: 'Live site · API-powered', color: '#34D399', link: 'https://doremon-tech-svg.github.io/weather-vibes/', gh: 'https://github.com/Doremon-tech-svg/weather-vibes', xray: { type: 'frontend', nodes: ['HTML/CSS', 'Vanilla JS', 'Tomorrow.io', 'OpenCage', 'Geolocation', 'Animations'] } },
  { id: '07', name: 'Swachh Connect', tag: 'SIH 2025', status: 'live', desc: 'Waste management platform for SIH Hackathon. Citizens report waste, do training modules, earn certificates. Admin dashboard with stats. Flask + SQLite.', tech: ['Flask', 'SQLite', 'HTML/CSS', 'JavaScript', 'Jinja2'], stat: 'SIH Hackathon 2025', color: '#9D72FF', link: '#', gh: 'https://github.com/Doremon-tech-svg/Swachh-Connect', xray: { type: 'civic-tech', nodes: ['Flask', 'SQLite', 'Jinja2', 'File Upload', 'Admin Panel', 'Certs'] } },
  { id: '08', name: 'Group Expense App', tag: 'WIP', status: 'wip', desc: 'Splitwise-like MVP with approval-based expenses, full audit trail, JWT auth in HTTP-only cookies. Prisma + PostgreSQL. Approvals and ledger in progress.', tech: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'TanStack Query'], stat: 'MVP in progress', color: '#F59E0B', link: '#', gh: 'https://github.com/Doremon-tech-svg/Expense--tracker', xray: { type: 'full-stack', nodes: ['React', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Ledger'] } },
  { id: '09', name: 'Scholar Connect', tag: 'LIVE', status: 'live', desc: 'Scholarship finder for students. Search, filter, apply guide, document checklist. Pure HTML/CSS/JS frontend.', tech: ['HTML5', 'CSS3', 'JavaScript'], stat: 'Static · Scholarship finder', color: '#10B981', link: '#', gh: 'https://github.com/Doremon-tech-svg/Scholar-Connect', xray: { type: 'frontend', nodes: ['HTML', 'CSS', 'JS', 'Filter', 'Search', 'Static'] } },
  { id: '10', name: 'Amazon Price Tracker', tag: 'TOOL', status: 'live', desc: 'Paste an Amazon URL → get real-time price. Flask + BeautifulSoup scraper with clean responsive UI.', tech: ['Python', 'Flask', 'BeautifulSoup', 'Requests', 'HTML/CSS'], stat: 'Scraper + Flask', color: '#F59E0B', link: '#', gh: 'https://github.com/Doremon-tech-svg/amazon-price-tracker', xray: { type: 'scraper', nodes: ['Flask', 'BeautifulSoup', 'Requests', 'Parser', 'UI', 'Cache'] } },
];
function XRayArch({ project }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginTop: 18 }}>
        <div style={{ padding: 14, background: 'rgba(0,170,255,.04)', border: '1px solid rgba(0,170,255,.18)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10 }}>
          <div style={{ color: 'var(--a3)', letterSpacing: '.15em', marginBottom: 10, fontSize: 8 }}>⬡ X-RAY · {project.xray.type.toUpperCase()}</div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
            {project.xray.nodes.map((n, i) => (
              <React.Fragment key={n}>
                <div style={{ padding: '4px 9px', border: '1px solid rgba(0,170,255,.32)', color: 'var(--a3)', fontSize: 8, letterSpacing: '.07em', background: 'rgba(0,170,255,.05)', whiteSpace: 'nowrap' }}>{n}</div>
                {i < project.xray.nodes.length - 1 && <div style={{ padding: '0 4px', color: 'rgba(0,170,255,.45)', fontSize: 12 }}>→</div>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {['Latency: ~15ms', 'Status: Deployed', 'Uptime: 99.9%'].map(s => <div key={s} style={{ color: 'var(--muted)', fontSize: 8, letterSpacing: '.05em' }}>{s}</div>)}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
function Projects({ theme }) {
  const [open, setOpen] = useState(null);
  const [show, setShow] = useState(5);
  const isX = theme === 'xray';
  return (
    <section id="work" style={{ padding: '120px 10%', position: 'relative', zIndex: 10 }}>
      <SL>01 / ACTIVE STRUCTURES</SL>
      <ST>Built &amp; Shipped</ST>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, marginBottom: 40, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.06em' }}>Click any project to expand. Enable X-RAY to see architecture.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {PROJECTS.slice(0, show).map((p, i) => {
          const isO = open === p.id;
          const sC = p.status === 'live' ? 'var(--green)' : p.status === 'wip' ? 'var(--amber)' : 'var(--muted)';
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * .07, duration: .45 }} viewport={{ once: true, amount: .15 }}>
              <div onClick={() => setOpen(isO ? null : p.id)} style={{ borderTop: '1px solid var(--border)', padding: '24px 0', cursor: 'none', transition: 'padding-left .2s' }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = '10px'} onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flex: 1 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '.1em', minWidth: 22 }}>{p.id}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.01em' }}>{p.name}</h3>
                        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 7, padding: '2px 7px', border: `1px solid ${sC}`, color: sC, letterSpacing: '.12em' }}>{p.tag}</span>
                        {isX && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 7, padding: '2px 7px', border: '1px solid rgba(0,170,255,.28)', color: 'rgba(0,170,255,.7)', letterSpacing: '.1em' }}>⬡ {p.xray.type.toUpperCase()}</span>}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 580 }}>{p.desc}</p>
                      {isO && <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 5 }}>{p.tech.map(t => <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, padding: '3px 9px', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: '.07em' }}>{t}</span>)}</div>}
                      {isX && isO && <XRayArch project={p} />}
                      {isO && <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                        {p.link && p.link !== '#' && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--a2)', letterSpacing: '.1em', textDecoration: 'none' }}>LIVE DEMO ↗</a>}
                        <a href={p.gh} target="_blank" rel="noreferrer" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', textDecoration: 'none' }}>GITHUB ↗</a>
                      </div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 9, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.06em', textAlign: 'right' }}>{p.stat}</span>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 14, transform: isO ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .3s' }}>{p.status === 'live' ? '+' : '◐'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div style={{ borderTop: '1px solid var(--border)' }} />
        {show < PROJECTS.length && (
          <button onClick={() => setShow(PROJECTS.length)} style={{ marginTop: 24, padding: '10px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '.12em', cursor: 'none', alignSelf: 'center', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--a2)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
            SHOW ALL {PROJECTS.length} PROJECTS ↓
          </button>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TECH GRAPH (D3)
═══════════════════════════════════════════════════ */
const NODES = [{ id: 'Python', domain: 'ai', yrs: 3 }, { id: 'React', domain: 'frontend', yrs: 2 }, { id: 'Flask', domain: 'backend', yrs: 2 }, { id: 'JavaScript', domain: 'frontend', yrs: 3 }, { id: 'HTML/CSS', domain: 'frontend', yrs: 3 }, { id: 'C/C++', domain: 'systems', yrs: 2 }, { id: 'SQLite', domain: 'backend', yrs: 2 }, { id: 'Git', domain: 'tools', yrs: 3 }, { id: 'Node.js', domain: 'backend', yrs: 1 }, { id: 'Solidity', domain: 'web3', yrs: 1 }, { id: 'MongoDB', domain: 'backend', yrs: 1 }, { id: 'FastAPI', domain: 'backend', yrs: 1 }];
const LINKS = [{ s: 'Python', t: 'Flask', w: 4 }, { s: 'Python', t: 'FastAPI', w: 3 }, { s: 'React', t: 'JavaScript', w: 4 }, { s: 'React', t: 'HTML/CSS', w: 3 }, { s: 'Flask', t: 'SQLite', w: 3 }, { s: 'JavaScript', t: 'Node.js', w: 2 }, { s: 'Git', t: 'Python', w: 2 }, { s: 'Git', t: 'React', w: 2 }, { s: 'Solidity', t: 'JavaScript', w: 2 }, { s: 'Node.js', t: 'MongoDB', w: 2 }, { s: 'FastAPI', t: 'MongoDB', w: 2 }, { s: 'C/C++', t: 'Python', w: 2 }];
const DC = { ai: '#9D72FF', frontend: '#34D399', backend: '#60A5FA', systems: '#F59E0B', web3: '#EF4444', tools: '#6B7280' };
function TechGraph({ theme }) {
  const svgRef = useRef(null), wrapRef = useRef(null), simRef = useRef(null);
  const [filter, setFilter] = useState('All');
  const [sel, setSel] = useState(null);
  const isX = theme === 'xray', isL = theme === 'light';
  const domMap = { AI: 'ai', Frontend: 'frontend', Backend: 'backend', Systems: 'systems', Web3: 'web3', Tools: 'tools' };
  useEffect(() => {
    if (!svgRef.current || !wrapRef.current) return;
    const df = filter === 'All' ? null : domMap[filter];
    const nodes = NODES.filter(n => !df || n.domain === df).map(n => ({ ...n }));
    const ids = new Set(nodes.map(n => n.id));
    const links = LINKS.filter(l => ids.has(l.s) && ids.has(l.t)).map(l => ({ ...l, source: l.s, target: l.t }));
    if (simRef.current) simRef.current.stop();
    d3.selectAll('.__tip').remove();
    const svg = d3.select(svgRef.current); svg.selectAll('*').remove();
    const W = wrapRef.current.clientWidth || 700, H = 420;
    svg.attr('viewBox', `0 0 ${W} ${H}`);
    if (isX) { const pat = svg.append('defs').append('pattern').attr('id', 'xg').attr('width', 40).attr('height', 40).attr('patternUnits', 'userSpaceOnUse'); pat.append('path').attr('d', 'M 40 0 L 0 0 0 40').attr('fill', 'none').attr('stroke', 'rgba(0,170,255,.08)').attr('stroke-width', '.5'); svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'url(#xg)'); }
    const tip = d3.select('body').append('div').attr('class', '__tip').style('position', 'fixed').style('background', 'rgba(8,10,15,.96)').style('border', '1px solid var(--accent)').style('color', 'var(--text)').style('padding', '8px 12px').style('font-family', 'JetBrains Mono,monospace').style('font-size', '10px').style('pointer-events', 'none').style('opacity', 0).style('z-index', 200).style('letter-spacing', '.06em');
    const sim = d3.forceSimulation(nodes).force('link', d3.forceLink(links).id(d => d.id).distance(110)).force('charge', d3.forceManyBody().strength(-280)).force('center', d3.forceCenter(W / 2, H / 2)).force('collision', d3.forceCollide(36));
    simRef.current = sim;
    const lg = svg.append('g').selectAll('line').data(links).join('line').attr('stroke', d => DC[d.domain] ?? '#888').attr('stroke-opacity', isX ? .38 : .22).attr('stroke-width', d => .6 + (d.w ?? 1) * .6);
    if (isX) lg.attr('stroke-dasharray', '4 2');
    const ng = svg.append('g').selectAll('g').data(nodes).join('g').style('cursor', 'none').call(d3.drag().on('start', (e, d) => { if (!e.active) sim.alphaTarget(.3).restart(); d.fx = d.x; d.fy = d.y }).on('drag', (e, d) => { d.fx = e.x; d.fy = e.y }).on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null }));
    ng.append('circle').attr('r', 22).attr('fill', d => DC[d.domain]).attr('fill-opacity', isX ? .04 : .07).attr('stroke', d => DC[d.domain]).attr('stroke-width', .8).attr('stroke-opacity', isX ? .48 : .28).attr('stroke-dasharray', isX ? '3 2' : 'none');
    ng.append('circle').attr('r', 13).attr('fill', d => DC[d.domain]).attr('fill-opacity', isX ? .5 : .9).attr('stroke', isL ? 'var(--bg1)' : 'var(--bg)').attr('stroke-width', 1.5);
    ng.append('text').text(d => d.id).attr('text-anchor', 'middle').attr('dy', -21).attr('fill', isL ? 'rgba(10,10,10,.65)' : 'rgba(249,250,251,.65)').attr('font-size', 8).attr('font-family', 'JetBrains Mono,monospace').attr('letter-spacing', '.06em');
    ng.append('text').text(d => `${d.yrs}y`).attr('text-anchor', 'middle').attr('dy', 4).attr('fill', isL ? 'rgba(250,247,242,.9)' : 'rgba(8,10,15,.9)').attr('font-size', 7).attr('font-family', 'JetBrains Mono,monospace').attr('font-weight', 700);
    ng.on('mouseenter', (e, d) => { const conn = new Set(); links.forEach(l => { const s = typeof l.source === 'object' ? l.source.id : l.source; const t = typeof l.target === 'object' ? l.target.id : l.target; if (s === d.id) conn.add(t); if (t === d.id) conn.add(s); }); ng.attr('opacity', n => n.id === d.id || conn.has(n.id) ? 1 : .1); lg.attr('opacity', l => { const s = typeof l.source === 'object' ? l.source.id : l.source; const t = typeof l.target === 'object' ? l.target.id : l.target; return s === d.id || t === d.id ? .9 : .03; }); tip.html(`<strong style="color:${DC[d.domain]}">${d.id}</strong><br/>${d.yrs}y · ${d.domain}`).style('opacity', 1); }).on('mousemove', e => tip.style('left', (e.clientX + 13) + 'px').style('top', (e.clientY - 28) + 'px')).on('mouseleave', () => { ng.attr('opacity', 1); lg.attr('opacity', isX ? .38 : .22); tip.style('opacity', 0) }).on('click', (e, d) => setSel(s => s?.id === d.id ? null : d));
    sim.on('tick', () => { lg.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y); ng.attr('transform', d => `translate(${d.x},${d.y})`); });
    return () => { sim.stop(); d3.selectAll('.__tip').remove() };
  }, [filter, theme]);
  return (
    <section id="tech" style={{ padding: '120px 10%', position: 'relative', zIndex: 10 }}>
      <SL>02 / TECHNOLOGY NEXUS</SL>
      <ST>Skills &amp; Stack</ST>
      <div style={{ display: 'flex', gap: 7, marginTop: 38, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'AI', 'Frontend', 'Backend', 'Systems', 'Web3', 'Tools'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, padding: '5px 13px', cursor: 'none', border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`, color: filter === f ? 'var(--a2)' : 'var(--muted)', background: filter === f ? 'rgba(124,58,237,.1)' : 'transparent', letterSpacing: '.1em', transition: 'all .2s' }}>{f.toUpperCase()}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {Object.entries(DC).map(([d, c]) => <span key={d} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.09em' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }} />{d.toUpperCase()}</span>)}
        </div>
      </div>
      <div ref={wrapRef} style={{ border: '1px solid var(--border)', background: 'var(--card)', overflow: 'hidden', position: 'relative', transition: 'background .4s,border-color .4s' }}>
        {theme !== 'light' && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}><div style={{ position: 'absolute', width: '100%', height: '2px', background: `linear-gradient(to right,transparent,${isX ? 'rgba(0,170,255,.18)' : 'rgba(124,58,237,.12)'},transparent)`, animation: 'scanX 4s ease-in-out infinite' }} /></div>}
        <svg ref={svgRef} style={{ width: '100%', height: 420, display: 'block', position: 'relative', zIndex: 2 }} />
      </div>
      <AnimatePresence>
        {sel && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} style={{ marginTop: 1, padding: '14px 18px', border: `1px solid ${DC[sel.domain] ?? 'var(--accent)'}`, borderTop: 'none', background: 'var(--card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background .4s' }}>
          <div><div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.12em', marginBottom: 3 }}>SELECTED · {sel.domain.toUpperCase()}</div><div style={{ fontSize: 18, fontWeight: 600, color: DC[sel.domain] }}>{sel.id}</div><div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{sel.yrs} years learning</div></div>
          <button onClick={() => setSel(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'none', fontSize: 18 }}>✕</button>
        </motion.div>}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   VISION
═══════════════════════════════════════════════════ */
const GOALS = [
  { n: '01', t: 'Land first real freelance project', d: 'Something that pays, ships, and stays alive in production. Not a dummy project.', pct: 35 },
  { n: '02', t: 'Ship ComplianceOS to 100 MSMEs', d: 'Make it real — actual users, actual compliance problems solved. Revenue > 0.', pct: 20 },
  { n: '03', t: 'Contribute to a major open source project', d: 'Meaningful PRs merged into something people actually use. Not just README fixes.', pct: 45 },
  { n: '04', t: 'Master DSA & system design', d: 'Get to the point where I can walk into any tech interview with confidence.', pct: 30 },
  { n: '05', t: 'Build something people talk about', d: 'One project that gets traction on its own — not by pitching, just by being genuinely useful.', pct: 10 },
];
function Vision() {
  return (
    <section id="vision" style={{ padding: '120px 10%', position: 'relative', zIndex: 10 }}>
      <SL>03 / VISION TOWER</SL>
      <ST>The Long Game</ST>
      <div style={{ marginTop: 48 }}>
        {GOALS.map((g, i) => (
          <motion.div key={g.n} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * .1, duration: .5 }} viewport={{ once: true, amount: .25 }}
            style={{ borderTop: '1px solid var(--border)', padding: '26px 0', display: 'grid', gridTemplateColumns: '40px 1fr 110px', gap: 20, alignItems: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '.1em' }}>{g.n}</div>
            <div><div style={{ fontSize: 16, fontWeight: 500, marginBottom: 5 }}>{g.t}</div><div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75 }}>{g.d}</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--a3)' }}>{g.pct}%</span>
              <div style={{ width: 72, height: 2, background: 'var(--border)', borderRadius: 1 }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${g.pct}%` }} transition={{ duration: 1.1, delay: i * .1, ease: [.22, 1, .36, 1] }} viewport={{ once: true }} style={{ height: '100%', background: 'var(--accent)', borderRadius: 1 }} />
              </div>
            </div>
          </motion.div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TICKER (scrolling marquee)
═══════════════════════════════════════════════════ */
function Ticker() {
  const items = ['Python · Flask · React · FastAPI · Solidity · SQLite · PostgreSQL · MongoDB · XGBoost · ViT · LangChain · Groq · Hardhat · Web3 · TailwindCSS · Framer Motion · D3.js · Recharts · Firebase · Git ·'];
  const txt = items.join(' ');
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '14px 0', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite', width: 'max-content' }}>
        {[txt, txt].map((t, i) => (
          <span key={i} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: '.12em', paddingRight: 40 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GAMES — Tic Tac Toe
═══════════════════════════════════════════════════ */
function TicTacToe({ ac }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xNext, setXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 });
  const [wLine, setWLine] = useState(null);
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const calcW = b => { for (const [a, x, c] of lines) if (b[a] && b[a] === b[x] && b[a] === b[c]) return { w: b[a], l: [a, x, c] }; return null; };
  const res = calcW(board); const full = board.every(Boolean);
  const status = res ? `${res.w} WINS` : full ? 'DRAW' : `${xNext ? 'X' : 'O'} TURN`;
  const click = i => { if (board[i] || res) return; const n = [...board]; n[i] = xNext ? 'X' : 'O'; setBoard(n); setXNext(!xNext); const r = calcW(n); if (r) { setWLine(r.l); setScores(s => ({ ...s, [r.w]: s[r.w] + 1 })); } else if (n.every(Boolean)) setScores(s => ({ ...s, D: s.D + 1 })); };
  const reset = () => { setBoard(Array(9).fill(null)); setXNext(true); setWLine(null); };
  return (
    <div style={{ padding: 22, border: '1px solid var(--border)', background: 'var(--card)', transition: 'all .4s' }}>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.2em', marginBottom: 14 }}>TIC TAC TOE</div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
        {[['X', scores.X, '#9D72FF'], ['D', scores.D, 'var(--muted)'], ['O', scores.O, '#34D399']].map(([l, s, c]) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', padding: '7px 0', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{s}</div>
            <div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>{l === 'D' ? 'DRAW' : `PL ${l}`}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: res ? (res.w === 'X' ? '#9D72FF' : '#34D399') : full ? 'var(--muted)' : ac, letterSpacing: '.15em', marginBottom: 14, textAlign: 'center' }}>{status}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginBottom: 14 }}>
        {board.map((cell, i) => {
          const iW = wLine?.includes(i); return (
            <motion.button key={i} onClick={() => click(i)} whileTap={{ scale: .95 }} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, cursor: 'none', border: `1px solid ${iW ? ac : 'var(--border)'}`, background: iW ? `${ac}12` : 'transparent', color: cell === 'X' ? '#9D72FF' : '#34D399', transition: 'all .2s', boxShadow: iW ? `0 0 10px ${ac}35` : 'none' }}>
              {cell && <motion.span initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 14 }}>{cell}</motion.span>}
            </motion.button>
          );
        })}
      </div>
      <button onClick={reset} style={{ width: '100%', padding: '7px', fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '.15em', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'none', transition: 'all .2s' }} onMouseEnter={e => { e.target.style.borderColor = ac; e.target.style.color = 'var(--text)' }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}>NEW GAME</button>
    </div>
  );
}

/* ─ RPS ─ */
function RPS({ ac }) {
  const ch = ['🪨', '📄', '✂️'], nm = ['ROCK', 'PAPER', 'SCISSORS'];
  const [pl, setPl] = useState(null), [cpu, setCpu] = useState(null), [res, setRes] = useState(null), [sc, setSc] = useState({ p: 0, c: 0, t: 0 }), [anim, setAnim] = useState(false);
  const play = i => { if (anim) return; setAnim(true); setPl(i); setCpu(null); setRes(null); setTimeout(() => { const c = Math.floor(Math.random() * 3); setCpu(c); let r; if (i === c) r = 'TIE'; else if ((i === 0 && c === 2) || (i === 1 && c === 0) || (i === 2 && c === 1)) r = 'WIN'; else r = 'LOSE'; setRes(r); setSc(s => ({ p: s.p + (r === 'WIN' ? 1 : 0), c: s.c + (r === 'LOSE' ? 1 : 0), t: s.t + (r === 'TIE' ? 1 : 0) })); setAnim(false); }, 700); };
  const rC = res === 'WIN' ? 'var(--green)' : res === 'LOSE' ? 'var(--red)' : 'var(--amber)';
  return (
    <div style={{ padding: 22, border: '1px solid var(--border)', background: 'var(--card)', transition: 'all .4s' }}>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.2em', marginBottom: 14 }}>ROCK PAPER SCISSORS</div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
        {[['YOU', sc.p, 'var(--green)'], ['TIE', sc.t, 'var(--muted)'], ['CPU', sc.c, 'var(--red)']].map(([l, s, c]) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', padding: '7px 0', border: '1px solid var(--border)' }}><div style={{ fontSize: 13, fontWeight: 700, color: c }}>{s}</div><div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>{l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border)', marginBottom: 14, minHeight: 76 }}>
        <motion.div animate={anim ? { x: [0, 7, -4, 0] } : {}} transition={{ repeat: anim ? Infinity : 0, duration: .3 }} style={{ fontSize: 32, textAlign: 'center', minWidth: 56 }}>{pl !== null ? ch[pl] : '?'}<div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', marginTop: 3 }}>YOU</div></motion.div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: res ? 13 : 9, color: res ? rC : 'var(--dim)', letterSpacing: '.1em', transition: 'all .3s' }}>{res || 'VS'}</div>
        <div style={{ fontSize: 32, textAlign: 'center', minWidth: 56 }}>{cpu !== null ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280 }}>{ch[cpu]}</motion.div> : anim ? <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: .3 }}>?</motion.div> : '?'}<div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', marginTop: 3 }}>CPU</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
        {ch.map((c, i) => (
          <motion.button key={i} onClick={() => play(i)} whileHover={{ scale: 1.04 }} whileTap={{ scale: .95 }} style={{ padding: '13px 6px', fontSize: 22, cursor: 'none', border: `1px solid ${pl === i ? ac : 'var(--border)'}`, background: pl === i ? `${ac}10` : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all .2s' }}>
            {c}<span style={{ fontSize: 7, fontFamily: 'JetBrains Mono,monospace', color: 'var(--muted)', letterSpacing: '.07em' }}>{nm[i]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─ SNAKE ─ */
function Snake({ ac }) {
  const COLS = 20, ROWS = 15;
  const [snake, setSnake] = useState([[5, 7], [4, 7], [3, 7]]);
  const [food, setFood] = useState([12, 7]);
  const [dir, setDir] = useState([1, 0]);
  const [run, setRun] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [dead, setDead] = useState(false);
  const ref = useRef({ snake, food, dir, run, dead, score });
  ref.current = { snake, food, dir, run, dead, score };
  const nf = s => { let f; do { f = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)]; } while (s.some(p => p[0] === f[0] && p[1] === f[1])); return f; };
  const tick = useCallback(() => { const { snake: s, food: f, dir: d, dead: dd } = ref.current; if (dd) return; const h = [s[0][0] + d[0], s[0][1] + d[1]]; if (h[0] < 0 || h[0] >= COLS || h[1] < 0 || h[1] >= ROWS || s.some(p => p[0] === h[0] && p[1] === h[1])) { setDead(true); setRun(false); setBest(b => Math.max(b, ref.current.score)); return; } const ate = h[0] === f[0] && h[1] === f[1]; const ns = [h, ...s.slice(0, ate ? undefined : -1)]; setSnake(ns); if (ate) { setFood(nf(ns)); setScore(sc => sc + 1); }; }, []);
  useEffect(() => { if (!run) return; const id = setInterval(tick, 145); return () => clearInterval(id); }, [run, tick]);
  useEffect(() => { const ok = e => { const ds = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }; if (ds[e.key]) { e.preventDefault(); const nd = ds[e.key]; const { dir: cd } = ref.current; if (nd[0] !== -cd[0] || nd[1] !== -cd[1]) setDir(nd); } }; window.addEventListener('keydown', ok); return () => window.removeEventListener('keydown', ok); }, []);
  const reset = () => { const s = [[5, 7], [4, 7], [3, 7]]; setSnake(s); setFood(nf(s)); setDir([1, 0]); setScore(0); setDead(false); setRun(true); };
  const CELL = 18, snC = '#10B981';
  return (
    <div style={{ padding: 22, border: '1px solid var(--border)', background: 'var(--card)', transition: 'all .4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.2em' }}>SNAKE</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ textAlign: 'right' }}><div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{score}</div><div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>SCORE</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 700, color: ac }}>{best}</div><div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>BEST</div></div>
        </div>
      </div>
      <div style={{ position: 'relative', width: COLS * CELL, height: ROWS * CELL, border: '1px solid var(--border)', background: 'var(--bg)', overflow: 'hidden', margin: '0 auto 14px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,var(--border) 1px,transparent 1px)', backgroundSize: `${CELL}px ${CELL}px`, opacity: .25 }} />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: .8 }} style={{ position: 'absolute', width: CELL - 4, height: CELL - 4, borderRadius: '50%', background: 'var(--red)', left: food[0] * CELL + 2, top: food[1] * CELL + 2, boxShadow: '0 0 8px var(--red)' }} />
        {snake.map((seg, i) => <div key={i} style={{ position: 'absolute', width: CELL - 2, height: CELL - 2, left: seg[0] * CELL + 1, top: seg[1] * CELL + 1, background: i === 0 ? snC : `${snC}${Math.max(28, Math.floor(90 - i * 3)).toString(16)}`, border: i === 0 ? `1px solid ${snC}` : 'none', boxShadow: i === 0 ? `0 0 7px ${snC}55` : 'none', transition: 'left .13s linear,top .13s linear' }} />)}
        {(!run || dead) && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,10,15,.85)', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: dead ? 13 : 10, color: dead ? 'var(--red)' : ac, letterSpacing: '.2em', marginBottom: 10 }}>{dead ? `GAME OVER · ${score}` : 'SNAKE'}</div>
          <button onClick={reset} style={{ padding: '7px 18px', background: ac, color: '#fff', border: 'none', fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '.15em', cursor: 'none' }}>{dead ? 'RETRY' : 'START'}</button>
        </div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, maxWidth: 110, margin: '0 auto' }}>
        {[['↑', [0, -1], '2/1'], ['←', [-1, 0], '1/2'], ['↓', [0, 1], '2/3'], ['→', [1, 0], '3/2']].map(([l, nd, gr]) => (
          <button key={l} onClick={() => { if (nd[0] !== -dir[0] || nd[1] !== -dir[1]) setDir(nd); if (!run && !dead) reset(); }} style={{ padding: '5px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'none', gridColumn: l === '↑' || l === '↓' ? '2' : l === '←' ? '1' : '3', gridRow: l === '↑' ? '1' : l === '↓' ? '3' : '2', transition: 'all .15s' }} onMouseEnter={e => { e.target.style.borderColor = ac; e.target.style.color = 'var(--text)' }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

/* ─ MEMORY ─ */
function Memory({ ac }) {
  const EM = ['⚡', '◈', '◉', '▲', '◆', '★', '◎', '⬟'];
  const mk = () => [...EM, ...EM].map((e, i) => ({ id: i, emoji: e, fl: false, mt: false })).sort(() => Math.random() - .5);
  const [cards, setCards] = useState(mk());
  const [fl, setFl] = useState([]);
  const [moves, setMoves] = useState(0);
  const [mt, setMt] = useState(0);
  const [best, setBest] = useState(null);
  const [chk, setChk] = useState(false);
  const won = mt === EM.length;
  const flip = id => { if (chk || fl.length === 2) return; const card = cards.find(c => c.id === id); if (!card || card.fl || card.mt) return; const nf = [...fl, id]; setCards(p => p.map(c => c.id === id ? { ...c, fl: true } : c)); setFl(nf); if (nf.length === 2) { setMoves(m => m + 1); setChk(true); const [a, b] = nf.map(id => cards.find(c => c.id === id)); setTimeout(() => { if (a.emoji === b.emoji) { setCards(p => p.map(c => nf.includes(c.id) ? { ...c, mt: true } : c)); setMt(m => m + 1); } else { setCards(p => p.map(c => nf.includes(c.id) ? { ...c, fl: false } : c)); } setFl([]); setChk(false); }, 750); } };
  useEffect(() => { if (won) setBest(b => b === null || moves < b ? moves : b); }, [won]);
  const reset = () => { setCards(mk()); setFl([]); setMoves(0); setMt(0); setChk(false); };
  return (
    <div style={{ padding: 22, border: '1px solid var(--border)', background: 'var(--card)', transition: 'all .4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.2em' }}>MEMORY MATRIX</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ textAlign: 'right' }}><div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{moves}</div><div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>MOVES</div></div>
          {best && <div style={{ textAlign: 'right' }}><div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 700, color: ac }}>{best}</div><div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>BEST</div></div>}
        </div>
      </div>
      {won && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '10px', background: 'rgba(16,185,129,.1)', border: '1px solid var(--green)', marginBottom: 12, fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--green)', letterSpacing: '.15em' }}>✓ MATRIX SOLVED · {moves} MOVES</motion.div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5, marginBottom: 12 }}>
        {cards.map(card => (
          <motion.button key={card.id} onClick={() => flip(card.id)} whileHover={!card.fl && !card.mt ? { scale: 1.04 } : {}} whileTap={!card.fl && !card.mt ? { scale: .95 } : {}}
            style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'none', border: `1px solid ${card.mt ? ac + '55' : card.fl ? ac : 'var(--border)'}`, background: card.mt ? `${ac}09` : card.fl ? `${ac}06` : 'var(--bg)', transition: 'all .2s', boxShadow: card.mt ? `0 0 7px ${ac}28` : 'none' }}>
            <AnimatePresence mode="wait">
              {(card.fl || card.mt) ? <motion.span key="f" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ duration: .14 }}>{card.emoji}</motion.span> : <motion.span key="b" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} transition={{ duration: .14 }} style={{ fontSize: 12, color: 'var(--border2)', fontFamily: 'JetBrains Mono,monospace' }}>?</motion.span>}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <button onClick={reset} style={{ width: '100%', padding: '7px', fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '.15em', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'none', transition: 'all .2s' }} onMouseEnter={e => { e.target.style.borderColor = ac; e.target.style.color = 'var(--text)' }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}>RESET</button>
    </div>
  );
}

/* ─ REACTION ─ */
function Reaction({ ac }) {
  const [st, setSt] = useState('idle');
  const [t, setT] = useState(null);
  const [best, setBest] = useState(null);
  const [times, setTimes] = useState([]);
  const startRef = useRef(null), timerRef = useRef(null);
  const start = () => { if (st === 'ready') { clearTimeout(timerRef.current); setSt('early'); return; } if (st !== 'idle' && st !== 'result' && st !== 'early') return; setSt('wait'); const delay = 1500 + Math.random() * 3000; timerRef.current = setTimeout(() => { setSt('ready'); startRef.current = Date.now(); }, delay); };
  const hit = () => { if (st !== 'ready') { start(); return; } const ms = Date.now() - startRef.current; setT(ms); setTimes(p => [...p.slice(-4), ms]); setBest(b => b === null || ms < b ? ms : b); setSt('result'); };
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const bgM = { idle: 'var(--bg)', wait: 'rgba(239,68,68,.07)', ready: 'rgba(16,185,129,.14)', result: `${ac}10`, early: 'rgba(245,158,11,.07)' };
  const lbM = { idle: 'CLICK TO START', wait: 'WAIT FOR IT...', ready: 'CLICK NOW!', result: `${t}ms · CLICK TO RETRY`, early: 'TOO EARLY! CLICK TO RETRY' };
  const cM = { idle: 'var(--muted)', wait: 'var(--red)', ready: 'var(--green)', result: ac, early: 'var(--amber)' };
  const rating = t < 200 ? '⚡ ELITE' : t < 250 ? '◎ FAST' : t < 300 ? '◈ GOOD' : t < 400 ? '▶ AVERAGE' : '◌ SLOW';
  return (
    <div style={{ padding: 22, border: '1px solid var(--border)', background: 'var(--card)', transition: 'all .4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--muted)', letterSpacing: '.2em' }}>REACTION SPEED</div>
        {best && <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: ac }}>{best}ms BEST</div>}
      </div>
      <motion.button onClick={st === 'ready' ? hit : start} animate={{ scale: st === 'ready' ? [1, 1.02, 1] : 1 }} transition={{ repeat: st === 'ready' ? Infinity : 0, duration: .3 }}
        style={{ width: '100%', height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7, border: `2px solid ${st === 'ready' ? 'var(--green)' : st === 'early' ? 'var(--amber)' : 'var(--border)'}`, background: bgM[st], cursor: 'none', transition: 'all .3s', marginBottom: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: st === 'result' ? 18 : 9, color: cM[st], letterSpacing: '.15em', fontWeight: st === 'result' ? 700 : 400, transition: 'all .2s' }}>{st === 'ready' ? '⬟' : st === 'wait' ? '...' : st === 'early' ? '✗' : st === 'result' ? t : '▶'}</div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 7, color: cM[st], letterSpacing: '.15em', opacity: .7 }}>{lbM[st]}</div>
        {st === 'result' && <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: ac, letterSpacing: '.1em' }}>{rating}</div>}
      </motion.button>
      {times.length > 0 && <div style={{ display: 'flex', gap: 4 }}>
        {times.map((tm, i) => <div key={i} style={{ flex: 1, height: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
          <div style={{ width: '100%', background: `${ac}55`, height: `${Math.max(3, (500 - tm) / 500 * 22)}px`, transition: 'all .3s' }} />
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 6, color: 'var(--muted)' }}>{tm}</div>
        </div>)}
      </div>}
    </div>
  );
}

function GamesSection({ theme }) {
  const [active, setActive] = useState('ttt');
  const ac = theme === 'xray' ? '#00AAFF' : theme === 'light' ? '#C94A1F' : '#7C3AED';
  const games = [{ id: 'ttt', l: 'TIC TAC TOE' }, { id: 'rps', l: 'ROCK PAPER' }, { id: 'snake', l: 'SNAKE' }, { id: 'memory', l: 'MEMORY' }, { id: 'rx', l: 'REACTION' }];
  return (
    <section id="games" style={{ padding: '120px 10%', position: 'relative', zIndex: 10, borderTop: '1px solid var(--border)' }}>
      <SL>05 / ARCADE FLOOR</SL>
      <ST>Play a Game</ST>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, marginBottom: 36, maxWidth: 460 }}>Built five games from scratch because a portfolio should be fun. Zero ads, zero trackers.</p>
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, flexWrap: 'wrap', border: '1px solid var(--border)' }}>
        {games.map(g => (
          <button key={g.id} onClick={() => setActive(g.id)} style={{ flex: 1, minWidth: 72, padding: '9px 6px', fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '.1em', cursor: 'none', border: 'none', borderRight: '1px solid var(--border)', background: active === g.id ? `${ac}12` : 'transparent', color: active === g.id ? ac : 'var(--muted)', transition: 'all .2s', borderBottom: active === g.id ? `2px solid ${ac}` : '2px solid transparent' }}>{g.l}</button>
        ))}
      </div>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .22 }}>
            {active === 'ttt' && <TicTacToe ac={ac} />}
            {active === 'rps' && <RPS ac={ac} />}
            {active === 'snake' && <Snake ac={ac} />}
            {active === 'memory' && <Memory ac={ac} />}
            {active === 'rx' && <Reaction ac={ac} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════ */
function Contact() {
  const [st, setSt] = useState('idle');
  const [val, setVal] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const send = async () => {
    if (!val.trim()) return;
    setSt('sending');

    try {
      // Wait for emailjs to be available (CDN load timing)
      if (!window.emailjs) {
        throw new Error('EmailJS not loaded');
      }

      // Initialize with your public key (v4 syntax)
      window.emailjs.init({
        publicKey: 'ZL76fbUH-koHqZrBn',   // ← WITHOUT the "user_" prefix
      });

      const result = await window.emailjs.send(
        'service_f27isgh',
        'template_8we44gr',
        {
          from_name: name || 'Anonymous',
          reply_to: email || 'no-reply@portfolio.com',
          message: val,
          to_name: 'Divyank',
        }
        // No 4th argument in v4 — key is passed via init() above
      );

      console.log('EmailJS success:', result);
      setSt('sent');
    } catch (err) {
      console.error('EmailJS error:', err);
      setSt('error');
    }
  };

  return (
    <section id="contact" style={{ padding: '120px 10% 80px', position: 'relative', zIndex: 10 }}>
      <SL>06 / CONTACT FLOOR</SL>
      <ST>Ring the Bell</ST>
      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="g1">
        <div>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 28 }}>Open to collabs, hackathon teams, freelance projects, internships, or just geeking out about AI/Web3. I reply within 24h.</p>
          {[
            { l: 'EMAIL', v: ME.email, href: `mailto:${ME.email}` },
            { l: 'GITHUB', v: 'github.com/Doremon-tech-svg', href: ME.github },
            { l: 'LINKEDIN', v: 'divyank-richhariya', href: ME.linkedin },
            { l: 'TWITTER/X', v: '@DivyankRic82579', href: ME.twitter },
            { l: 'MEDIUM', v: 'medium.com/@richhariyadivyank1', href: ME.medium },
            { l: 'LOCATION', v: ME.location, href: null }
          ].map(item => (
            <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '.1em' }}>
              <span style={{ color: 'var(--dim)' }}>{item.l}</span>
              {item.href
                ? <a href={item.href} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = 'var(--a2)'} onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{item.v}</a>
                : <span style={{ color: 'var(--muted)' }}>{item.v}</span>}
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid var(--border)', padding: 26, background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--a3)', letterSpacing: '.15em' }}>QUICK MESSAGE</div>

          {st !== 'sent' ? <>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--text)', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, padding: 13, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email (so I can reply)"
              style={{ background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--text)', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, padding: 13, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
            <textarea
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="What are you building?"
              style={{ background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--text)', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, padding: 13, resize: 'none', height: 110, outline: 'none', lineHeight: 1.7 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
            {st === 'error' && (
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--red)', letterSpacing: '.1em' }}>
                ✗ SEND FAILED — try emailing directly
              </div>
            )}
            <button
              onClick={send}
              style={{ padding: 11, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'none', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '.1em', fontWeight: 500, opacity: st === 'sending' ? 0.7 : 1 }}
            >
              {st === 'sending' ? 'SENDING...' : 'SEND →'}
            </button>
          </> : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 26 }}>✓</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--green)', letterSpacing: '.1em' }}>MESSAGE RECEIVED</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Reply within 24h</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   BUILD LOG (interactive terminal)
═══════════════════════════════════════════════════ */
const LOG_CMDS = [
  { cmd: 'ls -la projects/', out: PROJECTS.map(p => `drwxr-xr-x  ${p.name.padEnd(22)}[${p.status.toUpperCase()}] ${p.stat}`).join('\n') },
  { cmd: 'cat stack.json', out: JSON.stringify({ languages: ['Python', 'JavaScript', 'C/C++'], frontend: ['React', 'HTML/CSS', 'TailwindCSS'], backend: ['Flask', 'FastAPI', 'Node.js'], databases: ['SQLite', 'MongoDB', 'PostgreSQL'], ai: ['Scikit-learn', 'ViT', 'XGBoost', 'LangChain'], web3: ['Solidity', 'Hardhat', 'ethers.js'], tools: ['Git', 'Docker'] }, null, 2) },
  { cmd: 'git log --oneline -6', out: `3f9e1c feat: deepfake detector with blockchain proof\n8d2b4a feat: ARIA onboarding agent for ComplianceOS\na1c3f8 feat: XGBoost+SHAP fall risk predictor\n7a9d3b feat: LevelUp Journal v1 shipped\ne4c8f2 feat: weather vibes API integration\n2b1d9a init: portfolio v5.3` },
  { cmd: 'cat achievements.md', out: `# Achievements\n- Top 10 · CodeWizards Hackathon (100+ teams)\n- Qualified · Dataverse Hackathon (final round)\n- GSSoC Open Source Contributor\n- 5+ Hackathons participated\n- CoE AI Skills Lab · Blockchain Member\n- GDG on Campus · ML Member\n- DevUp KIET · Web Dev Member` },
  { cmd: 'whoami', out: `Divyank Richhariya\nB.Tech CSE (AIML) · KIET · 2029\nFull Stack Developer & AI Tinkerer\n${ME.location}` },
  { cmd: 'uptime', out: `System up 693 days. 14+ projects shipped. Currently building.` },
  { cmd: 'help', out: 'Commands: ls -la projects/ | cat stack.json | git log --oneline -6 | cat achievements.md | whoami | uptime\nTip: Tab to autocomplete, ↑↓ for history' },
];
function BuildLog({ theme }) {
  const [lines, setLines] = useState([{ type: 'sys', text: `─── BUILD LOG v5.3 ─── divyank@nexus ───` }, { type: 'sys', text: 'Type a command or click a suggestion below.' }, { type: 'prompt', text: '' }]);
  const [input, setInput] = useState('');
  const [coll, setColl] = useState(false);
  const [hist, setHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef(null), inRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);
  const run = cmd => { const c = cmd.trim(); if (!c) return; const kn = LOG_CMDS.find(l => l.cmd === c || c.startsWith(l.cmd.split(' ')[0])); const out = kn ? kn.out : `zsh: command not found: ${c.split(' ')[0]}\nType 'help' for available commands.`; setLines(p => [...p.filter(l => l.type !== 'prompt'), { type: 'cmd', text: '$ ' + c }, { type: 'out', text: out }, { type: 'prompt', text: '' }]); setHist(h => [c, ...h.slice(0, 19)]); setHIdx(-1); setInput(''); };
  const onK = e => { if (e.key === 'Enter') { run(input); return; } if (e.key === 'ArrowUp') { const ni = Math.min(hIdx + 1, hist.length - 1); setHIdx(ni); setInput(hist[ni] ?? ''); return; } if (e.key === 'ArrowDown') { const ni = Math.max(hIdx - 1, -1); setHIdx(ni); setInput(ni === -1 ? '' : hist[ni] ?? ''); return; } if (e.key === 'Tab') { e.preventDefault(); const m = LOG_CMDS.find(l => l.cmd.startsWith(input)); if (m) setInput(m.cmd); } };
  const bg = theme === 'light' ? 'rgba(250,247,242,.98)' : 'rgba(8,10,15,.97)';
  const bC = theme === 'xray' ? 'var(--a2)' : 'var(--border)';
  const SUGG = ['ls -la projects/', 'cat stack.json', 'git log --oneline -6', 'cat achievements.md', 'whoami', 'help'];
  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 200, width: coll ? 48 : 370, transition: 'width .3s', fontFamily: 'JetBrains Mono,monospace' }}>
      {coll ? <button onClick={() => setColl(false)} style={{ width: 48, height: 48, borderRadius: '50%', background: bg, border: `1px solid ${bC}`, color: 'var(--a2)', cursor: 'none', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>$_</button> : (
        <div style={{ background: bg, border: `1px solid ${bC}`, boxShadow: '0 20px 60px rgba(0,0,0,.55)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', maxHeight: 340, transition: 'all .3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 11px', borderBottom: `1px solid ${bC}`, background: theme === 'xray' ? 'rgba(0,170,255,.05)' : 'rgba(124,58,237,.06)' }}>
            <div style={{ display: 'flex', gap: 5 }}>{['#EF4444', '#F59E0B', '#10B981'].map((c, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: .7 }} />)}</div>
            <span style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '.12em' }}>BUILD LOG · divyank@nexus</span>
            <button onClick={() => setColl(true)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'none', fontSize: 11 }}>─</button>
          </div>
          <div style={{ display: 'flex', gap: 3, padding: '5px 9px', flexWrap: 'wrap', borderBottom: `1px solid ${bC}` }}>
            {SUGG.map(s => <button key={s} onClick={() => run(s)} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 7, padding: '2px 6px', border: '1px solid var(--border)', color: 'var(--dim)', background: 'transparent', cursor: 'none', letterSpacing: '.05em', transition: 'all .15s' }} onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--a3)' }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--dim)' }}>{s}</button>)}
          </div>
          <div onClick={() => inRef.current?.focus()} style={{ flex: 1, overflowY: 'auto', padding: '7px 11px', display: 'flex', flexDirection: 'column', gap: 1, cursor: 'none' }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontSize: 9, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: l.type === 'cmd' ? 'var(--a2)' : l.type === 'sys' ? 'rgba(124,58,237,.55)' : 'var(--muted)' }}>
                {l.type === 'prompt' ? (<div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ color: 'var(--a3)' }}>$ </span><input ref={inRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onK} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, cursor: 'none' }} placeholder="type command…" /><span style={{ color: 'var(--accent)', animation: 'pulse 1s step-end infinite' }}>█</span></div>) : l.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION HELPERS
═══════════════════════════════════════════════════ */
function SL({ children }) { return <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '.2em', marginBottom: 9 }}>{children}</div>; }
function ST({ children }) { return <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.1, fontFamily: 'Syne,sans-serif' }}>{children}</h2>; }

/* ═══════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════ */
function Footer({ theme }) {
  const lbl = { dark: '◐ DARK', light: '☼ LIGHT', xray: '⬡ X-RAY ACTIVE' };
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '22px 10%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '.1em', position: 'relative', zIndex: 10, transition: 'border-color .4s' }}>
      <span>© 2025 Divyank Richhariya · v5.3 · Built with React</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sigil size={14} />
        <span style={{ color: theme === 'xray' ? 'var(--a2)' : 'var(--dim)', transition: 'color .3s' }}>{lbl[theme]}</span>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [scrollY, setScrollY] = useState(0);
  const [xEnter, setXEnter] = useState(false);
  const [xExit, setXExit] = useState(false);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const switchTheme = useCallback(next => {
    if (next === theme) return;
    if (next === 'xray') { setXEnter(true); setTimeout(() => setTheme('xray'), 820); return; }
    if (theme === 'xray') { setXExit(true); setTimeout(() => { setTheme(next); setXExit(false); }, 550); return; }
    setTheme(next);
  }, [theme]);
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', transition: 'background .5s ease' }}>
      <style>{G}</style>
      <LoadingScreen onDone={() => setLoaded(true)} />
      {loaded && <>
        <Cursor />
        <NoiseBG />
        <GridLines theme={theme} />
        <XRayEnter active={xEnter} onComplete={() => setXEnter(false)} />
        <XRayExit active={xExit} onComplete={() => { }} />
        <AnimatePresence>{theme === 'xray' && <XRayAnnotations active />}</AnimatePresence>
        <Nav theme={theme} onSwitch={switchTheme} scrollY={scrollY} />
        <Hero theme={theme} />
        <Ticker />
        <About />
        <Stats />
        <Projects theme={theme} />
        <TechGraph theme={theme} />
        <Vision />
        <GamesSection theme={theme} />
        <Contact />
        <Footer theme={theme} />
        <BuildLog theme={theme} />
        <MusicPlayer theme={theme} />
      </>}
    </div>
  );
}
