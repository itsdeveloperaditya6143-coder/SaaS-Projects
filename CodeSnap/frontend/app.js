// CodeSnap v2.0 PRODUCTION - simple by default, powerful in Advanced
// Backend API (deployed on Render)
const BACKEND_URL = 'https://codesnap-backend-2uj9.onrender.com';

// Optional: ping backend on load (non-blocking, app works fully offline without it)
fetch(`${BACKEND_URL}/api/health`)
  .then((r) => r.json())
  .then((d) => console.log('CodeSnap backend:', d))
  .catch(() => console.log('Backend sleeping/offline - continuing client-side only'));

const THEMES = [
  { id:'dracula', name:'Dracula', desc:'dark • purple', cat:'dark', bg:'linear-gradient(135deg,#282a36,#44475a)', card:'#282a36', color:'#f8f8f2', title:'rgba(255,255,255,.06)', light:false },
  { id:'monokai', name:'Monokai', desc:'dark • classic', cat:'dark', bg:'linear-gradient(135deg,#272822,#3e3d32)', card:'#272822', color:'#f8f8f2', title:'rgba(255,255,255,.06)', light:false },
  { id:'nord', name:'Nord', desc:'dark • ice blue', cat:'dark', bg:'linear-gradient(135deg,#2e3440,#4c566a)', card:'#2e3440', color:'#eceff4', title:'rgba(255,255,255,.06)', light:false },
  { id:'onedark', name:'One Dark', desc:'dark • github', cat:'dark', bg:'linear-gradient(135deg,#0d1117,#21262d)', card:'#161b22', color:'#e6edf3', title:'rgba(255,255,255,.06)', light:false },
  { id:'tokyo', name:'Tokyo Night', desc:'dark • neon blue', cat:'dark', bg:'linear-gradient(135deg,#1a1b26,#414868)', card:'#1a1b26', color:'#c0caf5', title:'rgba(255,255,255,.06)', light:false },
  { id:'nightowl', name:'Night Owl', desc:'dark • deep blue', cat:'dark', bg:'linear-gradient(135deg,#011627,#0b2948)', card:'#011627', color:'#d6deeb', title:'rgba(255,255,255,.07)', light:false },
  { id:'cobalt', name:'Cobalt', desc:'gradient • blue', cat:'gradient', bg:'linear-gradient(135deg,#0047ff,#00d4ff)', card:'#002884', color:'#ffffff', title:'rgba(255,255,255,.12)', light:false },
  { id:'sunset', name:'Sunset', desc:'gradient • orange', cat:'gradient', bg:'linear-gradient(135deg,#ff512f,#dd2476)', card:'#2b0a1a', color:'#ffe4e6', title:'rgba(255,255,255,.08)', light:false },
  { id:'aurora', name:'Aurora', desc:'gradient • teal purple', cat:'gradient', bg:'linear-gradient(135deg,#0f766e,#7c3aed)', card:'#1e1b4b', color:'#ffffff', title:'rgba(255,255,255,.1)', light:false },
  { id:'grape', name:'Grape', desc:'gradient • purple pink', cat:'gradient', bg:'linear-gradient(135deg,#7c3aed,#ec4899)', card:'#2e1065', color:'#fae8ff', title:'rgba(255,255,255,.1)', light:false },
  { id:'ocean', name:'Ocean', desc:'gradient • teal blue', cat:'gradient', bg:'linear-gradient(135deg,#0ea5e9,#22d3ee)', card:'#082f49', color:'#e0f2fe', title:'rgba(255,255,255,.1)', light:false },
  { id:'forest', name:'Forest', desc:'dark • green', cat:'dark', bg:'linear-gradient(135deg,#052e16,#15803d)', card:'#052e16', color:'#dcfce7', title:'rgba(255,255,255,.08)', light:false },
  { id:'charcoal', name:'Charcoal', desc:'minimal • gray', cat:'dark', bg:'#18181b', card:'#27272a', color:'#f4f4f5', title:'rgba(255,255,255,.06)', light:false },
  { id:'midnight', name:'Midnight', desc:'black-blue • sky', cat:'dark', bg:'linear-gradient(135deg,#020617,#1e3a8a)', card:'#020617', color:'#e2e8f0', title:'rgba(255,255,255,.07)', light:false },
  { id:'light', name:'GitHub Light', desc:'light • clean', cat:'light', bg:'linear-gradient(135deg,#f6f8fa,#d0d7de)', card:'#ffffff', color:'#24292f', title:'rgba(0,0,0,.05)', light:true },
  { id:'solar', name:'Solarized', desc:'light • cream', cat:'light', bg:'linear-gradient(135deg,#fdf6e3,#eee8d5)', card:'#fdf6e3', color:'#586e75', title:'rgba(0,0,0,.05)', light:true },
  { id:'venom', name:'Venom', desc:'toxic • purple green', cat:'gradient', bg:'linear-gradient(135deg,#000000,#7c3aed)', card:'#0a0a0a', color:'#a3e635', title:'rgba(163,230,53,.12)', light:false },
  { id:'blood', name:'Bloodzone', desc:'black-red • intense', cat:'gradient', bg:'linear-gradient(135deg,#000000,#dc2626)', card:'#0c0a09', color:'#fecaca', title:'rgba(255,255,255,.07)', light:false },
  { id:'cyber', name:'Cyberpunk', desc:'gradient • neon pink', cat:'gradient', bg:'linear-gradient(135deg,#ff0080,#7928ca,#00fff5)', card:'#0f0f1e', color:'#f0f0ff', title:'rgba(255,0,128,.14)', light:false },
  { id:'matrix', name:'Matrix', desc:'dark • hacker green', cat:'dark', bg:'linear-gradient(135deg,#000000,#003300)', card:'#000d00', color:'#00ff41', title:'rgba(0,255,65,.1)', light:false },
  { id:'rosepine', name:'Rosé Pine', desc:'dark • muted rose', cat:'dark', bg:'linear-gradient(135deg,#191724,#403d52)', card:'#191724', color:'#e0def4', title:'rgba(255,255,255,.07)', light:false },
  { id:'catppu', name:'Catppuccin', desc:'dark • pastel', cat:'dark', bg:'linear-gradient(135deg,#11111b,#45475a)', card:'#1e1e2e', color:'#cdd6f4', title:'rgba(255,255,255,.07)', light:false },
  { id:'synth', name:'Synthwave', desc:'gradient • retro 80s', cat:'gradient', bg:'linear-gradient(135deg,#ff71ce,#7311d6,#01cdfe)', card:'#1a0b2e', color:'#fff7e6', title:'rgba(255,113,206,.14)', light:false },
  { id:'coffee', name:'Coffee', desc:'dark • warm brown', cat:'dark', bg:'linear-gradient(135deg,#211512,#795548)', card:'#211512', color:'#efebe9', title:'rgba(255,255,255,.07)', light:false },
  { id:'ember', name:'Ember', desc:'dark • fire orange', cat:'dark', bg:'linear-gradient(135deg,#1c0a00,#c2410c)', card:'#1c0a00', color:'#fed7aa', title:'rgba(255,255,255,.07)', light:false },
  { id:'iceberg', name:'Iceberg', desc:'dark • pale blue', cat:'dark', bg:'linear-gradient(135deg,#0b1220,#334155)', card:'#0f172a', color:'#e0f2fe', title:'rgba(255,255,255,.07)', light:false },
  { id:'crimson', name:'Crimson Night', desc:'dark • deep red', cat:'dark', bg:'linear-gradient(135deg,#160404,#7f1d1d)', card:'#160404', color:'#fee2e2', title:'rgba(255,255,255,.07)', light:false },
  { id:'snow', name:'Snow', desc:'light • pure white', cat:'light', bg:'linear-gradient(135deg,#ffffff,#cbd5e1)', card:'#ffffff', color:'#0f172a', title:'rgba(0,0,0,.05)', light:true },
  { id:'mint', name:'Mint', desc:'light • fresh green', cat:'light', bg:'linear-gradient(135deg,#d1fae5,#6ee7b7)', card:'#f0fdf4', color:'#064e3b', title:'rgba(0,0,0,.05)', light:true },
  { id:'peach', name:'Peach', desc:'light • warm', cat:'light', bg:'linear-gradient(135deg,#ffedd5,#fb923c)', card:'#fff7ed', color:'#7c2d12', title:'rgba(0,0,0,.05)', light:true },
  { id:'lavender', name:'Lavender', desc:'light • soft purple', cat:'light', bg:'linear-gradient(135deg,#ede9fe,#a78bfa)', card:'#faf5ff', color:'#4c1d95', title:'rgba(0,0,0,.05)', light:true },
  { id:'candy', name:'Candy', desc:'gradient • pink pop', cat:'gradient', bg:'linear-gradient(135deg,#ff6fd8,#ffc3a0)', card:'#3b0a2a', color:'#fff0f6', title:'rgba(255,255,255,.12)', light:false },
  { id:'ultra', name:'Ultraviolet', desc:'gradient • deep space', cat:'gradient', bg:'linear-gradient(135deg,#41295a,#2f0743,#734b6d)', card:'#1a0b2e', color:'#e9d5ff', title:'rgba(255,255,255,.1)', light:false },
  { id:'sunrise', name:'Sunrise', desc:'gradient • morning', cat:'gradient', bg:'linear-gradient(135deg,#ff9966,#ff5e62)', card:'#2a0e0e', color:'#fff7ed', title:'rgba(255,255,255,.1)', light:false },
  { id:'emerald', name:'Emerald Glow', desc:'gradient • teal green', cat:'gradient', bg:'linear-gradient(135deg,#134e5e,#71b280)', card:'#022c22', color:'#d1fae5', title:'rgba(255,255,255,.1)', light:false },
  { id:'cotton', name:'Cotton Candy', desc:'gradient • soft dream', cat:'gradient', bg:'linear-gradient(135deg,#a18cd1,#fbc2eb)', card:'#241443', color:'#fdf4ff', title:'rgba(255,255,255,.12)', light:false },
];
const LANGUAGES = [
  { id:'python', name:'Python', icon:'🐍', hljs:'python', ext:'main.py', sample:'def hello():\n    print("Small steps every day compound 🚀")\n\nhello()' },
  { id:'javascript', name:'JavaScript', icon:'🟨', hljs:'javascript', ext:'app.js', sample:'function hello() {\n  console.log("Small steps every day 🚀");\n}\n\nhello();' },
  { id:'typescript', name:'TypeScript', icon:'🔷', hljs:'typescript', ext:'app.ts', sample:'function hello(name: string): void {\n  console.log(`Hello ${name} 🚀`);\n}\n\nhello("Aditya");' },
  { id:'html', name:'HTML', icon:'🌐', hljs:'xml', ext:'index.html', sample:'<div class="card">\n  <h1>Hello Aditya 🚀</h1>\n  <p>Small steps every day</p>\n</div>' },
  { id:'css', name:'CSS', icon:'🎨', hljs:'css', ext:'style.css', sample:'.card {\n  background: #12161f;\n  border-radius: 16px;\n  padding: 16px;\n}' },
  { id:'java', name:'Java', icon:'☕', hljs:'java', ext:'Main.java', sample:'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello 🚀");\n  }\n}' },
  { id:'cpp', name:'C++', icon:'⚙️', hljs:'cpp', ext:'main.cpp', sample:'#include <iostream>\nint main() {\n  std::cout << "Hello 🚀";\n  return 0;\n}' },
  { id:'c', name:'C', icon:'🔵', hljs:'c', ext:'main.c', sample:'#include <stdio.h>\nint main() {\n  printf("Hello 🚀\\n");\n  return 0;\n}' },
  { id:'go', name:'Go', icon:'🐹', hljs:'go', ext:'main.go', sample:'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello 🚀")\n}' },
  { id:'rust', name:'Rust', icon:'🦀', hljs:'rust', ext:'main.rs', sample:'fn main() {\n  println!("Hello 🚀");\n}' },
  { id:'php', name:'PHP', icon:'🐘', hljs:'php', ext:'index.php', sample:'<?php\necho "Hello 🚀";\n?>' },
  { id:'sql', name:'SQL', icon:'🗄️', hljs:'sql', ext:'query.sql', sample:'SELECT name, streak\nFROM builders\nWHERE streak > 7\nORDER BY streak DESC;' },
  { id:'bash', name:'Bash', icon:'💲', hljs:'bash', ext:'run.sh', sample:'#!/bin/bash\necho "Deploying 🚀"\npython app.py' },
  { id:'json', name:'JSON', icon:'🧾', hljs:'json', ext:'data.json', sample:'{\n  "name": "Aditya",\n  "streak": 7,\n  "project": "CodeSnap"\n}' },
];

let currentTheme = THEMES[0];
let currentLang = LANGUAGES[0];
const settings = { font:"'JetBrains Mono',monospace", fontSize:15, padding:48, radius:14, lineHeight:1.6, shadow:'deep', quality:'fhd', splitPer:35, transparent:false };

// HD / Full HD / 4K = PNG width-targeted export. Original SVG = true vector (infinite zoom, zero blur).
const QUALITY_TARGETS = {
  hd:  { width: 1280, label: 'HD',      file: 'hd',       desc: '1280px wide • small file • fast share' },
  fhd: { width: 1920, label: 'Full HD', file: 'fhd',      desc: '1920px wide • best for X/LinkedIn' },
  '4k':{ width: 3840, label: '4K Ultra',file: '4k',       desc: '3840px wide • max detail • larger file' },
  svg: { vector: true, label: 'Original',file: 'original',desc: 'Vector SVG • infinite zoom • zero blur' },
};

const $ = (id) => document.getElementById(id);
const codeInput = $('codeInput'), codeOut = $('codeOut');
const snapBg = $('snapBg'), snapCard = $('snapCard');
let debounceT = null;

function renderThemes(filter='all') {
  const grid = $('themeGrid'); grid.innerHTML = '';
  THEMES.filter(t => filter==='all' || t.cat===filter).forEach(t => {
    const d = document.createElement('div');
    d.className = 'theme' + (t.id===currentTheme.id ? ' active' : '');
    d.innerHTML = `<div class="swatch" style="background:${t.bg}"></div><div class="tname">${t.name}</div><div class="tdesc">${t.desc}</div>`;
    d.onclick = () => { currentTheme = t; renderThemes(document.querySelector('.filter.active').dataset.filter); applyTheme(); };
    grid.appendChild(d);
  });
}
function renderLangMenu() {
  const menu = $('langMenu'); menu.innerHTML = '';
  LANGUAGES.forEach(l => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lang-option' + (l.id===currentLang.id ? ' active' : '');
    b.innerHTML = `<span class="lang-icon">${l.icon}</span><span>${l.name}</span><small>.${l.ext.split('.').pop()}</small>${l.id===currentLang.id ? '<span class="tick">✓</span>' : ''}`;
    b.onclick = (e) => { e.stopPropagation(); setLanguage(l.id, false); menu.classList.remove('open'); };
    menu.appendChild(b);
  });
}
function setLanguage(id, loadSample) {
  const found = LANGUAGES.find(l => l.id===id); if (!found) return;
  currentLang = found;
  $('langIcon').textContent = found.icon; $('langName').textContent = found.name; $('langBadge').textContent = found.icon;
  if (loadSample) { codeInput.value = found.sample; $('fileName').value = found.ext; }
  else { const cur = $('fileName').value; if (cur.includes('.')) { const base = cur.substring(0, cur.lastIndexOf('.')) || 'main'; $('fileName').value = base + '.' + found.ext.split('.').pop(); } }
  renderLangMenu(); scheduleUpdate();
}
function applyTheme() {
  snapBg.style.background = settings.transparent ? 'transparent' : currentTheme.bg;
  snapCard.style.background = currentTheme.card; snapCard.style.color = currentTheme.color;
  snapCard.style.borderRadius = settings.radius + 'px';
  snapCard.className = 'snap-card shadow-' + settings.shadow;
  $('titleBar').style.background = currentTheme.title; $('titleBar').style.color = currentTheme.color;
  $('themeName').textContent = currentTheme.name;
  $('hljs-theme').href = currentTheme.light
    ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css'
    : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
  updateCode();
}
function doHighlight(text, hljsLang) {
  if (!window.hljs) { codeOut.textContent = text; return; }
  try {
    codeOut.removeAttribute('data-highlighted');
    codeOut.className = 'language-' + hljsLang;
    if (hljs.getLanguage(hljsLang)) codeOut.innerHTML = hljs.highlight(text, { language: hljsLang, ignoreIllegals: true }).value;
    else codeOut.innerHTML = hljs.highlightAuto(text).value;
    codeOut.style.background = 'transparent';
    $('hlStatus').textContent = currentLang.id + ' ✓';
  } catch(e) { codeOut.textContent = text; $('hlStatus').textContent = 'plain'; }
}
function scheduleUpdate(){ clearTimeout(debounceT); debounceT = setTimeout(updateCode, 120); }

function updateCode() {
  let text = codeInput.value || '// paste code...';
  if (text.length > 20000) { text = text.slice(0,20000); codeInput.value = text; toast('Trimmed to 20k chars for stability'); }
  const lines = text.split('\n').length;
  $('lineCount').textContent = lines; $('charCount').textContent = text.length;
  $('fileLabel').textContent = $('fileName').value || 'untitled.txt';
  $('watermark').textContent = $('waterText').value || 'Made with CodeSnap';
  doHighlight(text, currentLang.hljs);

  codeOut.style.fontSize = settings.fontSize + 'px'; codeOut.style.lineHeight = settings.lineHeight;
  codeOut.style.fontFamily = settings.font; $('lineNums').style.fontSize = settings.fontSize + 'px';
  $('lineNums').style.lineHeight = settings.lineHeight; $('lineNums').style.fontFamily = settings.font;
  $('fontVal').textContent = settings.fontSize + 'px'; $('padVal').textContent = settings.padding + 'px';
  $('radiusVal').textContent = settings.radius + 'px'; $('lhVal').textContent = settings.lineHeight.toFixed(1);
  $('splitVal').textContent = settings.splitPer;
  snapBg.style.padding = settings.padding + 'px';

  if ($('optLines').checked) { $('lineNums').style.display = 'block'; $('lineNums').innerHTML = Array.from({length: lines}, (_,i)=> i+1).join('<br>'); }
  else $('lineNums').style.display = 'none';
  $('dots').style.visibility = $('optDots').checked ? 'visible' : 'hidden';
  $('titleBar').style.display = $('optTitle').checked ? 'flex' : 'none';
  $('watermark').style.display = $('optWater').checked ? 'block' : 'none';
  const wrap = $('optWrap').checked;
  codeOut.style.whiteSpace = wrap ? 'pre-wrap' : 'pre'; codeOut.style.wordBreak = wrap ? 'break-word' : 'normal';

  // smart friendly status (no scary red)
  const pill = $('statusPill'), st = $('statusText'), hint = $('splitHint');
  if (lines <= 50) { pill.className = 'status-pill ok'; st.textContent = `${lines} lines • Ready for HD`; hint.style.display = 'none'; }
  else { pill.className = 'status-pill warn'; st.textContent = `${lines} lines • Split recommended`; hint.style.display = 'block'; $('splitCount').textContent = Math.ceil(lines / settings.splitPer); }
  syncScroll();
  requestAnimationFrame(checkWidthOverflow);
}
function checkWidthOverflow(){
  const pre=$('preOut'), hint=$('widthHint');
  if(!pre||!hint) return;
  const wrapOn=$('optWrap').checked;
  // wrap ON = never cuts horizontally
  if(wrapOn){ hint.style.display='none'; return; }
  const overflow = pre.scrollWidth > pre.clientWidth + 8;
  if(overflow){
    const overBy = pre.scrollWidth - pre.clientWidth;
    $('widthText').textContent = `Line too wide by ~${overBy}px — preview scrolls, download would cut`;
    hint.style.display='block';
    const pill=$('statusPill');
    if(pill){ pill.className='status-pill warn'; }
  } else hint.style.display='none';
}
// One-tap Fit: shrink font → shrink padding → enable wrap as last resort. No complications for user.
function fitWidthToImage(){
  const pre=$('preOut');
  if(!pre) return;
  // if already wrapped, nothing to fit
  if($('optWrap').checked){ toast('Already wrapped — fits perfectly ✓'); return; }
  let fs=settings.fontSize, pad=settings.padding;
  // try shrinking font down to 13px
  while(fs>13 && pre.scrollWidth>pre.clientWidth+8){ fs--; settings.fontSize=fs; applyThemeSilent(); }
  function applyThemeSilent(){
    codeOut.style.fontSize=settings.fontSize+'px'; $('lineNums').style.fontSize=settings.fontSize+'px';
    $('fontSize').value=settings.fontSize; $('fontVal').textContent=settings.fontSize+'px';
    // force reflow so scrollWidth updates
    void pre.offsetWidth;
  }
  if(pre.scrollWidth<=pre.clientWidth+8){
    $('padding').value=settings.padding; toast(`✅ Fitted by shrinking font to ${fs}px`);
    updateCode(); return;
  }
  // try shrinking padding
  while(pad>24 && pre.scrollWidth>pre.clientWidth+8){ pad-=4; settings.padding=pad; snapBg.style.padding=pad+'px'; $('padding').value=pad; $('padVal').textContent=pad+'px'; void pre.offsetWidth; }
  if(pre.scrollWidth<=pre.clientWidth+8){ toast(`✅ Fitted with font ${fs}px + padding ${pad}px`); updateCode(); return; }
  // last resort: enable wrap (guaranteed, best for X)
  $('optWrap').checked=true; updateCode();
  toast('✅ Auto-enabled Wrap — best for sharing on X');
}
function syncScroll(){ const pre=$('preOut'); if(pre) $('lineNums').style.transform=`translateY(${-pre.scrollTop}px)`; }
function toast(msg){ const t=$('toast'); t.textContent=msg; clearTimeout(t._h); t._h=setTimeout(()=>t.textContent='',3200); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function updateQualityHint(){
  const q = QUALITY_TARGETS[settings.quality] || QUALITY_TARGETS.fhd;
  const el = $('qualityHint');
  if (!el) return;
  if (q.vector) el.textContent = 'Original SVG • vector • infinite zoom, zero blur • best for blogs/docs';
  else el.textContent = `${q.label} • ${q.width}px wide • ${q.desc}`;
}
function computePngScale(el, targetW){
  const w = el.offsetWidth || 800;
  const h = el.offsetHeight || 400;
  let scale = targetW / w;
  // clamp: never worse than CSS (1), max 5 so true 4K width is reachable on typical cards
  scale = Math.min(5, Math.max(1, scale));
  // memory guard: cap total pixels ~24MP (mobile-safe, avoids crash/glitch)
  const MAX_PIXELS = 24000000;
  const est = (w * scale) * (h * scale);
  let capped = false;
  if (est > MAX_PIXELS) {
    scale = Math.sqrt(MAX_PIXELS / (w * h));
    capped = true;
  }
  // round to 2 decimals to avoid subpixel blur
  scale = Math.max(1, Math.round(scale * 100) / 100);
  return { scale, capped, cssW: w, cssH: h, outW: Math.round(w * scale), outH: Math.round(h * scale) };
}
async function exportOriginalSVG(suffix=''){
  // True vector export via foreignObject: text stays sharp at any zoom (no blur).
  // Assumes expandForExport() already called so full code is measurable.
  const W = snapBg.offsetWidth;
  const H = snapBg.offsetHeight;
  const clone = snapBg.cloneNode(true);
  // Inline computed styles so highlight.js colors survive (cross-origin CSS can't be read directly).
  const srcEls = [snapBg, ...snapBg.querySelectorAll('*')];
  const cloneEls = [clone, ...clone.querySelectorAll('*')];
  srcEls.forEach((src, i) => {
    try { cloneEls[i].setAttribute('style', getComputedStyle(src).cssText); } catch(e) {}
  });
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  clone.style.width = W + 'px';
  clone.style.height = H + 'px';
  clone.style.margin = '0';
  const svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><foreignObject x="0" y="0" width="${W}" height="${H}">${new XMLSerializer().serializeToString(clone)}</foreignObject></svg>`;
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const a = document.createElement('a');
  a.download = `codesnap-original${suffix}.svg`;
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return { W, H };
}
function expandForExport(){
  document.body.classList.add('exporting');
  const pre=$('preOut'), wrap=document.querySelector('.code-wrap');
  const wrapOn=$('optWrap').checked;
  const hOverflow = !wrapOn && (pre.scrollWidth > pre.clientWidth + 8);
  const saved={ preMax:pre.style.maxHeight, preOver:pre.style.overflow, wrapMax:wrap.style.maxHeight, wrapOver:wrap.style.overflow, cardMax:snapCard.style.maxWidth, ws:codeOut.style.whiteSpace, wb:codeOut.style.wordBreak, autoWrapped:false };
  pre.style.maxHeight='none'; pre.style.overflow='visible'; pre.scrollTop=0; pre.scrollLeft=0;
  wrap.style.maxHeight='none'; wrap.style.overflow='visible';
  snapCard.style.maxWidth='720px'; $('lineNums').style.transform='none';
  // FOREVER FIX horizontal: if wrap OFF but line too wide, auto-wrap ONLY for export so download never cuts.
  // Preview keeps scroll for editing, export stays post-friendly width (not ultra-wide).
  if(hOverflow){
    codeOut.style.whiteSpace='pre-wrap'; codeOut.style.wordBreak='break-word';
    saved.autoWrapped=true;
  }
  return saved;
}
function restoreAfterExport(saved){
  if(!saved) return;
  const pre=$('preOut'), wrap=document.querySelector('.code-wrap');
  pre.style.maxHeight=saved.preMax; pre.style.overflow=saved.preOver;
  wrap.style.maxHeight=saved.wrapMax; wrap.style.overflow=saved.wrapOver;
  snapCard.style.maxWidth=saved.cardMax;
  if(saved.autoWrapped){ codeOut.style.whiteSpace=saved.ws||'pre'; codeOut.style.wordBreak=saved.wb||'normal'; }
  document.body.classList.remove('exporting'); syncScroll();
}
function setLoading(on, label){
  const btn=$('downloadBtn'), split=$('splitBtn');
  if(btn) btn.disabled=on;
  if(split) split.disabled=on;
  const lbl=$('dlLabel');
  if(lbl) lbl.textContent = on ? label : (settings.quality==='svg' ? '⬇ Download SVG' : '⬇ Download PNG');
  // keep button label in sync when idle
  if(!on && lbl) {
    const q = QUALITY_TARGETS[settings.quality];
    lbl.textContent = (q && q.vector) ? '⬇ Download SVG' : '⬇ Download PNG';
  }
}

// events
codeInput.addEventListener('input', scheduleUpdate);
['fileName','waterText'].forEach(id=>$(id).addEventListener('input', scheduleUpdate));
[['fontSize','fontSize'],['padding','padding'],['radius','radius']].forEach(([id])=>{
  $(id).addEventListener('input', e=>{
    const v=parseInt(e.target.value,10);
    if(id==='fontSize') settings.fontSize=v;
    if(id==='padding') settings.padding=v;
    if(id==='radius') settings.radius=v;
    applyTheme();
  });
});
$('lineHeight').addEventListener('input', e=>{ settings.lineHeight=parseInt(e.target.value,10)/10; updateCode(); });
$('splitLines').addEventListener('input', e=>{ settings.splitPer=parseInt(e.target.value,10)||35; updateCode(); });
['optDots','optLines','optTitle','optWater','optWrap','optTransparent'].forEach(id=>$(id).addEventListener('change', ()=>{ if(id==='optTransparent') applyTheme(); else updateCode(); }));
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{ document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderThemes(b.dataset.filter); });
document.querySelectorAll('#scaleSeg button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#scaleSeg button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); settings.quality=b.dataset.quality || 'fhd'; updateQualityHint(); setLoading(false); });
document.querySelectorAll('#fontSeg button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#fontSeg button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); settings.font=b.dataset.font; updateCode(); });
document.querySelectorAll('#shadowSeg button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#shadowSeg button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); settings.shadow=b.dataset.shadow; applyTheme(); });
$('langBtn').onclick=(e)=>{ e.stopPropagation(); $('langMenu').classList.toggle('open'); };
document.addEventListener('click', ()=>$('langMenu').classList.remove('open'));
$('sampleBtn').onclick=()=>{ setLanguage(currentLang.id, true); toast('✨ '+currentLang.name+' sample loaded'); };
$('preOut').addEventListener('scroll', syncScroll);
$('splitHint').onclick=()=>{ $('exportAdv').open=true; $('splitBtn').scrollIntoView({behavior:'smooth', block:'center'}); };
$('widthHint').onclick=()=>{ fitWidthToImage(); };
$('copyBtn').onclick=async()=>{ try{ await navigator.clipboard.writeText(codeInput.value); toast('✅ Copied!'); }catch{ toast('Copy failed'); } };

$('downloadBtn').onclick=async()=>{
  if ($('downloadBtn').disabled) return;
  const lines=codeInput.value.split('\n').length;
  if(lines>250){ toast('Too tall (>250 lines) — splitting is safer'); $('exportAdv').open=true; return; }
  const qkey=settings.quality || 'fhd';
  // VECTOR: infinite zoom, zero blur
  if(qkey==='svg'){
    setLoading(true, '⏳ Building SVG...');
    const saved=expandForExport(); await sleep(180);
    try{
      const tag=`-${currentLang.id}-${Date.now().toString().slice(-5)}`;
      const { W, H } = await exportOriginalSVG(tag);
      toast(`✅ Original SVG • ${W}×${H} vector • zoom forever, zero blur ♾️`);
    }catch(e){ console.error(e); toast('SVG export failed — try Full HD'); }
    restoreAfterExport(saved); setLoading(false); return;
  }
  const target=QUALITY_TARGETS[qkey] || QUALITY_TARGETS.fhd;
  setLoading(true, '⏳ Rendering...');
  const saved=expandForExport(); await sleep(180);
  let result=null;
  try{
    const info=computePngScale(snapBg, target.width);
    result=info;
    const canvas=await html2canvas(snapBg,{scale:info.scale, backgroundColor: settings.transparent?null:undefined, useCORS:true, logging:false});
    const a=document.createElement('a');
    a.download=`codesnap-${target.file}-${currentLang.id}-${Date.now().toString().slice(-5)}.png`;
    a.href=canvas.toDataURL('image/png'); a.click();
    if(saved.autoWrapped) toast(`✅ ${target.label} • ${info.outW}×${info.outH} • auto-wrapped, nothing cut`);
    else if(info.capped) toast(`✅ ${target.label} • ${info.outW}×${info.outH} • capped for stability, still crisp`);
    else toast(`✅ ${target.label} • ${info.outW}×${info.outH} • crisp`);
  }catch(e){ console.error(e); toast('Export failed — try HD or Split'); }
  restoreAfterExport(saved); setLoading(false);
};
$('splitBtn').onclick=async()=>{
  if ($('splitBtn').disabled) return;
  const allLines=codeInput.value.split('\n'), per=settings.splitPer, total=Math.ceil(allLines.length/per);
  if(allLines.length<=per){ toast('Short code — use Download instead'); return; }
  if(total>8){ toast('Too many parts (8 max) — increase lines per image'); return; }
  const qkey=settings.quality || 'fhd';
  const isSVG = qkey==='svg';
  const target=QUALITY_TARGETS[qkey] || QUALITY_TARGETS.fhd;
  const orig=codeInput.value, saved=expandForExport();
  setLoading(true, '⏳ Exporting parts...');
  try{
    for(let i=0;i<total;i++){
      const chunk=allLines.slice(i*per,(i+1)*per).join('\n');
      doHighlight(chunk, currentLang.hljs);
      const n=chunk.split('\n').length;
      if($('optLines').checked) $('lineNums').innerHTML=Array.from({length:n},(_,k)=>i*per+k+1).join('<br>');
      $('fileLabel').textContent=($('fileName').value||'code')+` (${i+1}/${total})`;
      await sleep(280);
      if(isSVG){
        await exportOriginalSVG(`-part${i+1}-of-${total}`);
      } else {
        const info=computePngScale(snapBg, target.width);
        const canvas=await html2canvas(snapBg,{scale:info.scale, backgroundColor: settings.transparent?null:undefined, useCORS:true, logging:false});
        const a=document.createElement('a'); a.download=`codesnap-${target.file}-part${i+1}-of-${total}.png`; a.href=canvas.toDataURL('image/png'); a.click();
      }
      await sleep(350);
    }
    toast(isSVG ? `✅ ${total} SVG parts done — infinite zoom 🧵` : `✅ ${total} ${target.label} images done — post as thread 🧵`);
  }catch(e){ console.error(e); toast('Split failed'); }
  doHighlight(orig, currentLang.hljs); updateCode(); restoreAfterExport(saved); setLoading(false);
};

renderThemes(); renderLangMenu(); setLanguage('python', false); applyTheme(); updateQualityHint(); setLoading(false);

// --- PWA: service worker + install as app ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
let deferredPrompt = null;
function showInstallUI(show){
  ['installBtn','installBanner'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    if(id==='installBanner') el.style.display = show ? 'flex' : 'none';
    else el.style.display = show ? '' : 'none';
  });
}
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt=e; showInstallUI(true);
  setTimeout(()=>{ if(!window.matchMedia('(display-mode: standalone)').matches) showInstallUI(true); }, 2500);
});
async function doInstall(){
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; showInstallUI(false); }
  else {
    const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
    toast(isIOS ? 'iOS: Share → Add to Home Screen 📲' : 'Menu ⋮ → Add to Home screen / Install 📲');
    const b=document.getElementById('installBanner'); if(b) b.style.display='flex';
  }
}
['installBtn','installBtn2'].forEach(id=>{ const b=document.getElementById(id); if(b) b.onclick=doInstall; });
const ic=document.getElementById('installClose'); if(ic) ic.onclick=()=>showInstallUI(false);
window.addEventListener('appinstalled', ()=>showInstallUI(false));
// mobile tabbar: swipe-strip navigation (mobile) + anchor fallback (desktop)
function isMobileLayout(){ return window.matchMedia('(max-width: 980px)').matches; }
function scrollToCard(id){
  const strip = document.getElementById('controlsStrip');
  const el = document.getElementById(id);
  if (!el) return;
  if (isMobileLayout() && strip) {
    strip.scrollTo({ left: el.offsetLeft - 10, behavior: 'smooth' });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
document.querySelectorAll('.tabbar a').forEach(a=>a.addEventListener('click', (e)=>{
  e.preventDefault();
  document.querySelectorAll('.tabbar a').forEach(x=>x.classList.remove('active')); a.classList.add('active');
  const tab = a.dataset.tab;
  if (tab === 'code') scrollToCard('cardCode');
  else if (tab === 'style') scrollToCard('cardStyle');
  else if (tab === 'preview') {
    // preview is always visible on top in mobile — flash it + ensure top
    const pv = document.querySelector('.preview');
    if (pv) pv.scrollTo ? pv.scrollTo({ top: 0, behavior: 'smooth' }) : null;
    const sb = document.getElementById('snapBg');
    if (sb) { sb.style.transition = 'box-shadow .3s'; sb.style.boxShadow = '0 0 0 3px #a855f7'; setTimeout(()=>sb.style.boxShadow='', 700); }
  }
  else if (tab === 'export') {
    // download buttons live inside the top preview pane — scroll preview to them
    const pv = document.querySelector('.preview');
    const dl = document.getElementById('downloadBtn');
    if (pv && dl) pv.scrollTo({ top: pv.scrollHeight, behavior: 'smooth' });
    else if (dl) dl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}));
// swipe spy: highlight active tab while user swipes cards
(function(){
  const strip = document.getElementById('controlsStrip');
  if (!strip) return;
  let tick = null;
  strip.addEventListener('scroll', ()=>{
    if (!isMobileLayout() || tick) return;
    tick = setTimeout(()=>{
      tick = null;
      const cards = ['cardCode','cardStyle','cardCustomize'];
      let best = 0, bestDist = Infinity;
      cards.forEach((id, i)=>{
        const el = document.getElementById(id);
        if (!el) return;
        const d = Math.abs((el.offsetLeft - 10) - strip.scrollLeft);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      const map = ['code','style','style'];
      // cardCode -> Code, cardStyle + cardCustomize -> Style (both are styling)
      const tabForCard = map[best] || 'code';
      document.querySelectorAll('.tabbar a').forEach(x=>x.classList.toggle('active', x.dataset.tab === tabForCard));
    }, 80);
  }, { passive: true });
})();
