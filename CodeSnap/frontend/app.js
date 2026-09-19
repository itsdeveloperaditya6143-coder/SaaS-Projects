// CodeSnap v2.0 PRODUCTION - simple by default, powerful in Advanced
// Backend API (deployed on Render)
const BACKEND_URL = 'https://codesnap-backend-2uj9.onrender.com';

// Optional: ping backend on load (non-blocking, app works fully offline without it)
fetch(`${BACKEND_URL}/api/health`)
  .then((r) => r.json())
  .then((d) => console.log('CodeSnap backend:', d))
  .catch(() => console.log('Backend sleeping/offline - continuing client-side only'));

const THEMES = [
  // ── DARK (16) ──
  { id:'dracula', name:'Dracula', desc:'dark • purple', cat:'dark', bg:'linear-gradient(135deg,#282a36,#44475a)', card:'#282a36', color:'#f8f8f2', title:'rgba(255,255,255,.06)', light:false },
  { id:'monokai', name:'Monokai', desc:'dark • classic', cat:'dark', bg:'linear-gradient(135deg,#272822,#3e3d32)', card:'#272822', color:'#f8f8f2', title:'rgba(255,255,255,.06)', light:false },
  { id:'nord', name:'Nord', desc:'dark • ice blue', cat:'dark', bg:'linear-gradient(135deg,#2e3440,#4c566a)', card:'#2e3440', color:'#eceff4', title:'rgba(255,255,255,.06)', light:false },
  { id:'onedark', name:'One Dark', desc:'dark • github', cat:'dark', bg:'linear-gradient(135deg,#0d1117,#21262d)', card:'#161b22', color:'#e6edf3', title:'rgba(255,255,255,.06)', light:false },
  { id:'tokyo', name:'Tokyo Night', desc:'dark • neon blue', cat:'dark', bg:'linear-gradient(135deg,#1a1b26,#414868)', card:'#1a1b26', color:'#c0caf5', title:'rgba(255,255,255,.06)', light:false },
  { id:'nightowl', name:'Night Owl', desc:'dark • deep blue', cat:'dark', bg:'linear-gradient(135deg,#011627,#0b2948)', card:'#011627', color:'#d6deeb', title:'rgba(255,255,255,.07)', light:false },
  { id:'forest', name:'Forest', desc:'dark • green', cat:'dark', bg:'linear-gradient(135deg,#052e16,#15803d)', card:'#052e16', color:'#dcfce7', title:'rgba(255,255,255,.08)', light:false },
  { id:'charcoal', name:'Charcoal', desc:'minimal • gray', cat:'dark', bg:'#18181b', card:'#27272a', color:'#f4f4f5', title:'rgba(255,255,255,.06)', light:false },
  { id:'midnight', name:'Midnight', desc:'black-blue • sky', cat:'dark', bg:'linear-gradient(135deg,#020617,#1e3a8a)', card:'#020617', color:'#e2e8f0', title:'rgba(255,255,255,.07)', light:false },
  { id:'matrix', name:'Matrix', desc:'dark • hacker green', cat:'dark', bg:'linear-gradient(135deg,#000000,#003300)', card:'#000d00', color:'#00ff41', title:'rgba(0,255,65,.1)', light:false },
  { id:'rosepine', name:'Rosé Pine', desc:'dark • muted rose', cat:'dark', bg:'linear-gradient(135deg,#191724,#403d52)', card:'#191724', color:'#e0def4', title:'rgba(255,255,255,.07)', light:false },
  { id:'catppu', name:'Catppuccin', desc:'dark • pastel', cat:'dark', bg:'linear-gradient(135deg,#11111b,#45475a)', card:'#1e1e2e', color:'#cdd6f4', title:'rgba(255,255,255,.07)', light:false },
  { id:'coffee', name:'Coffee', desc:'dark • warm brown', cat:'dark', bg:'linear-gradient(135deg,#211512,#795548)', card:'#211512', color:'#efebe9', title:'rgba(255,255,255,.07)', light:false },
  { id:'ember', name:'Ember', desc:'dark • fire orange', cat:'dark', bg:'linear-gradient(135deg,#1c0a00,#c2410c)', card:'#1c0a00', color:'#fed7aa', title:'rgba(255,255,255,.07)', light:false },
  { id:'iceberg', name:'Iceberg', desc:'dark • pale blue', cat:'dark', bg:'linear-gradient(135deg,#0b1220,#334155)', card:'#0f172a', color:'#e0f2fe', title:'rgba(255,255,255,.07)', light:false },
  { id:'crimson', name:'Crimson Night', desc:'dark • deep red', cat:'dark', bg:'linear-gradient(135deg,#160404,#7f1d1d)', card:'#160404', color:'#fee2e2', title:'rgba(255,255,255,.07)', light:false },

  // ── LIGHT (6) ──
  { id:'light', name:'GitHub Light', desc:'light • clean', cat:'light', bg:'linear-gradient(135deg,#f6f8fa,#d0d7de)', card:'#ffffff', color:'#24292f', title:'rgba(0,0,0,.05)', light:true },
  { id:'solar', name:'Solarized', desc:'light • cream', cat:'light', bg:'linear-gradient(135deg,#fdf6e3,#eee8d5)', card:'#fdf6e3', color:'#586e75', title:'rgba(0,0,0,.05)', light:true },
  { id:'snow', name:'Snow', desc:'light • pure white', cat:'light', bg:'linear-gradient(135deg,#ffffff,#cbd5e1)', card:'#ffffff', color:'#0f172a', title:'rgba(0,0,0,.05)', light:true },
  { id:'mint', name:'Mint', desc:'light • fresh green', cat:'light', bg:'linear-gradient(135deg,#d1fae5,#6ee7b7)', card:'#f0fdf4', color:'#064e3b', title:'rgba(0,0,0,.05)', light:true },
  { id:'peach', name:'Peach', desc:'light • warm', cat:'light', bg:'linear-gradient(135deg,#ffedd5,#fb923c)', card:'#fff7ed', color:'#7c2d12', title:'rgba(0,0,0,.05)', light:true },
  { id:'lavender', name:'Lavender', desc:'light • soft purple', cat:'light', bg:'linear-gradient(135deg,#ede9fe,#a78bfa)', card:'#faf5ff', color:'#4c1d95', title:'rgba(0,0,0,.05)', light:true },

  // ── GRADIENT (14) ──
  { id:'cobalt', name:'Cobalt', desc:'gradient • blue', cat:'gradient', bg:'linear-gradient(135deg,#0047ff,#00d4ff)', card:'#002884', color:'#ffffff', title:'rgba(255,255,255,.12)', light:false },
  { id:'sunset', name:'Sunset', desc:'gradient • orange', cat:'gradient', bg:'linear-gradient(135deg,#ff512f,#dd2476)', card:'#2b0a1a', color:'#ffe4e6', title:'rgba(255,255,255,.08)', light:false },
  { id:'aurora', name:'Aurora', desc:'gradient • teal purple', cat:'gradient', bg:'linear-gradient(135deg,#0f766e,#7c3aed)', card:'#1e1b4b', color:'#ffffff', title:'rgba(255,255,255,.1)', light:false },
  { id:'grape', name:'Grape', desc:'gradient • purple pink', cat:'gradient', bg:'linear-gradient(135deg,#7c3aed,#ec4899)', card:'#2e1065', color:'#fae8ff', title:'rgba(255,255,255,.1)', light:false },
  { id:'ocean', name:'Ocean', desc:'gradient • teal blue', cat:'gradient', bg:'linear-gradient(135deg,#0ea5e9,#22d3ee)', card:'#082f49', color:'#e0f2fe', title:'rgba(255,255,255,.1)', light:false },
  { id:'venom', name:'Venom', desc:'toxic • purple green', cat:'gradient', bg:'linear-gradient(135deg,#000000,#7c3aed)', card:'#0a0a0a', color:'#a3e635', title:'rgba(163,230,53,.12)', light:false },
  { id:'blood', name:'Bloodzone', desc:'black-red • intense', cat:'gradient', bg:'linear-gradient(135deg,#000000,#dc2626)', card:'#0c0a09', color:'#fecaca', title:'rgba(255,255,255,.07)', light:false },
  { id:'candy', name:'Candy', desc:'gradient • pink pop', cat:'gradient', bg:'linear-gradient(135deg,#ff6fd8,#ffc3a0)', card:'#3b0a2a', color:'#fff0f6', title:'rgba(255,255,255,.12)', light:false },
  { id:'ultra', name:'Ultraviolet', desc:'gradient • deep space', cat:'gradient', bg:'linear-gradient(135deg,#41295a,#2f0743,#734b6d)', card:'#1a0b2e', color:'#e9d5ff', title:'rgba(255,255,255,.1)', light:false },
  { id:'sunrise', name:'Sunrise', desc:'gradient • morning', cat:'gradient', bg:'linear-gradient(135deg,#ff9966,#ff5e62)', card:'#2a0e0e', color:'#fff7ed', title:'rgba(255,255,255,.1)', light:false },
  { id:'emerald', name:'Emerald Glow', desc:'gradient • teal green', cat:'gradient', bg:'linear-gradient(135deg,#134e5e,#71b280)', card:'#022c22', color:'#d1fae5', title:'rgba(255,255,255,.1)', light:false },
  { id:'cotton', name:'Cotton Candy', desc:'gradient • soft dream', cat:'gradient', bg:'linear-gradient(135deg,#a18cd1,#fbc2eb)', card:'#241443', color:'#fdf4ff', title:'rgba(255,255,255,.12)', light:false },
  { id:'synth', name:'Synthwave', desc:'gradient • retro 80s', cat:'gradient', bg:'linear-gradient(135deg,#ff71ce,#7311d6,#01cdfe)', card:'#1a0b2e', color:'#fff7e6', title:'rgba(255,113,206,.14)', light:false },
  { id:'embergrad', name:'Fire Gradient', desc:'gradient • flame', cat:'gradient', bg:'linear-gradient(135deg,#f97316,#dc2626,#991b1b)', card:'#1c0505', color:'#fed7aa', title:'rgba(249,115,22,.12)', light:false },

  // ── GAMING (5) ── NEW
  { id:'rgb', name:'RGB Fury', desc:'gaming • rainbow', cat:'gaming', bg:'linear-gradient(135deg,#ff0000,#ff8800,#00ff00,#0088ff,#8800ff)', card:'#0a0a12', color:'#f0f0ff', title:'rgba(255,255,255,.08)', light:false },
  { id:'razer', name:'Razer', desc:'gaming • neon green', cat:'gaming', bg:'linear-gradient(135deg,#000000,#0a1a0a,#003300)', card:'#0d0d0d', color:'#44d62c', title:'rgba(68,214,44,.1)', light:false },
  { id:'ps5', name:'PlayStation', desc:'gaming • blue white', cat:'gaming', bg:'linear-gradient(135deg,#003087,#0070d1,#00aaff)', card:'#001845', color:'#e8f4ff', title:'rgba(0,170,255,.1)', light:false },
  { id:'xbox', name:'Xbox', desc:'gaming • green dark', cat:'gaming', bg:'linear-gradient(135deg,#0e7a0d,#107c10,#0a4a0a)', card:'#0a0a0a', color:'#9dff00', title:'rgba(157,255,0,.08)', light:false },
  { id:'esports', name:'Esports', desc:'gaming • neon purple', cat:'gaming', bg:'linear-gradient(135deg,#0d0221,#150734,#3b0764)', card:'#0d0221', color:'#ff2bd4', title:'rgba(255,43,212,.1)', light:false },

  // ── CYBERPUNK (5) ── NEW
  { id:'cp2077', name:'Cyberpunk 2077', desc:'cyber • yellow black', cat:'cyberpunk', bg:'linear-gradient(135deg,#0a0a0a,#1a1a0a,#2a2a00)', card:'#0c0c08', color:'#fcee09', title:'rgba(252,238,9,.1)', light:false },
  { id:'bladerunner', name:'Blade Runner', desc:'cyber • orange teal', cat:'cyberpunk', bg:'linear-gradient(135deg,#0f0f0a,#1a2a2a,#ff6a00)', card:'#0a1010', color:'#00e5ff', title:'rgba(0,229,255,.1)', light:false },
  { id:'neoncity', name:'Neon City', desc:'cyber • pink cyan', cat:'cyberpunk', bg:'linear-gradient(135deg,#0a0014,#1a0028,#ff00aa)', card:'#0a0014', color:'#00ffff', title:'rgba(0,255,255,.12)', light:false },
  { id:'glitch', name:'Glitch', desc:'cyber • distorted', cat:'cyberpunk', bg:'linear-gradient(135deg,#000000,#110022,#001133)', card:'#050510', color:'#ff0044', title:'rgba(255,0,68,.12)', light:false },
  { id:'chrome', name:'Chrome', desc:'cyber • metallic', cat:'cyberpunk', bg:'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', card:'#0a0a1a', color:'#e2e2e2', title:'rgba(200,200,220,.08)', light:false },

  // ── RETRO (5) ── NEW
  { id:'retrowave', name:'Retrowave', desc:'retro • 80s synth', cat:'retro', bg:'linear-gradient(135deg,#ff00ff,#0000ff,#ff00ff)', card:'#1a0030', color:'#ff69b4', title:'rgba(255,0,255,.1)', light:false },
  { id:'terminal', name:'Old Terminal', desc:'retro • green CRT', cat:'retro', bg:'linear-gradient(135deg,#000a00,#001a00,#002200)', card:'#000a00', color:'#00ff00', title:'rgba(0,255,0,.08)', light:false },
  { id:'amber', name:'Amber Monitor', desc:'retro • amber CRT', cat:'retro', bg:'linear-gradient(135deg,#0a0500,#1a0800,#2a0c00)', card:'#0a0500', color:'#ff8c00', title:'rgba(255,140,0,.08)', light:false },
  { id:'retromac', name:'Retro Mac', desc:'retro • beige', cat:'retro', bg:'linear-gradient(135deg,#c4b69c,#a89880,#d4c5a9)', card:'#d4c5a9', color:'#1a1a1a', title:'rgba(0,0,0,.06)', light:true },
  { id:'win95', name:'Windows 95', desc:'retro • teal', cat:'retro', bg:'linear-gradient(135deg,#008080,#006666,#009999)', card:'#c0c0c0', color:'#000000', title:'rgba(0,0,0,.08)', light:true },

  // ── NATURE (5) ── NEW
  { id:'deepforest', name:'Deep Forest', desc:'nature • dark green', cat:'nature', bg:'linear-gradient(135deg,#0b1a0b,#1a3a1a,#0a2a0a)', card:'#0b1a0b', color:'#90ee90', title:'rgba(144,238,144,.08)', light:false },
  { id:'deepocean', name:'Deep Ocean', desc:'nature • abyss blue', cat:'nature', bg:'linear-gradient(135deg,#000428,#001845,#001d3d)', card:'#000428', color:'#4fc3f7', title:'rgba(79,195,247,.08)', light:false },
  { id:'aurorasky', name:'Aurora Sky', desc:'nature • northern lights', cat:'nature', bg:'linear-gradient(135deg,#0a1628,#0d3b66,#00b4d8,#7b2cbf)', card:'#0a1628', color:'#c8b6ff', title:'rgba(200,182,255,.08)', light:false },
  { id:'volcano', name:'Volcano', desc:'nature • lava red', cat:'nature', bg:'linear-gradient(135deg,#1a0000,#3d0000,#ff4500)', card:'#0d0000', color:'#ff6b35', title:'rgba(255,107,53,.1)', light:false },
  { id:'desert', name:'Desert', desc:'nature • warm sand', cat:'nature', bg:'linear-gradient(135deg,#c2b280,#d4a574,#8b6914)', card:'#c2b280', color:'#3d2b1f', title:'rgba(61,43,31,.08)', light:true },

  // ── KAWAII (5) ── NEW
  { id:'sakura', name:'Sakura', desc:'kawaii • pink blossom', cat:'kawaii', bg:'linear-gradient(135deg,#ffb7c5,#ff69b4,#ffc0cb)', card:'#fff0f5', color:'#c71585', title:'rgba(199,21,133,.06)', light:true },
  { id:'mintcandy', name:'Mint Candy', desc:'kawaii • fresh mint', cat:'kawaii', bg:'linear-gradient(135deg,#b2f5ea,#81e6d9,#4fd1c5)', card:'#e6fffa', color:'#234e52', title:'rgba(35,78,82,.06)', light:true },
  { id:'lollipop', name:'Lollipop', desc:'kawaii • rainbow', cat:'kawaii', bg:'linear-gradient(135deg,#ff6b6b,#feca57,#48dbfb,#ff9ff3)', card:'#fff5f5', color:'#2d3436', title:'rgba(0,0,0,.04)', light:true },
  { id:'jellyfish', name:'Jellyfish', desc:'kawaii • sea glow', cat:'kawaii', bg:'linear-gradient(135deg,#667eea,#764ba2,#f093fb)', card:'#1a1040', color:'#e0c3fc', title:'rgba(224,195,252,.1)', light:false },
  { id:'pompurin', name:'Pompurin', desc:'kawaii • custard', cat:'kawaii', bg:'linear-gradient(135deg,#ffd966,#f6d365,#fda085)', card:'#fff8e1', color:'#5d4037', title:'rgba(93,64,55,.06)', light:true },

  // ── NEON (4) ── NEW
  { id:'neonpink', name:'Neon Pink', desc:'neon • hot pink', cat:'neon', bg:'linear-gradient(135deg,#0a0014,#1a0028)', card:'#0d001a', color:'#ff1493', title:'rgba(255,20,147,.12)', light:false },
  { id:'neongreen', name:'Neon Green', desc:'neon • electric', cat:'neon', bg:'linear-gradient(135deg,#000a00,#001a00)', card:'#000d00', color:'#39ff14', title:'rgba(57,255,20,.1)', light:false },
  { id:'neonblue', name:'Neon Blue', desc:'neon • electric blue', cat:'neon', bg:'linear-gradient(135deg,#000014,#000028)', card:'#00000d', color:'#00bfff', title:'rgba(0,191,255,.1)', light:false },
  { id:'neonpurple', name:'Neon Purple', desc:'neon • violet glow', cat:'neon', bg:'linear-gradient(135deg,#0a001a,#140030)', card:'#0a0014', color:'#bf00ff', title:'rgba(191,0,255,.12)', light:false },

  // ── MINIMAL (4) ── NEW
  { id:'purewhite', name:'Pure White', desc:'minimal • clean', cat:'minimal', bg:'#ffffff', card:'#ffffff', color:'#111827', title:'rgba(0,0,0,.04)', light:true },
  { id:'paper', name:'Paper', desc:'minimal • off-white', cat:'minimal', bg:'#fafafa', card:'#f5f5f5', color:'#1a1a1a', title:'rgba(0,0,0,.04)', light:true },
  { id:'ink', name:'Ink', desc:'minimal • black', cat:'minimal', bg:'#000000', card:'#111111', color:'#f5f5f5', title:'rgba(255,255,255,.06)', light:false },
  { id:'slate', name:'Slate', desc:'minimal • gray', cat:'minimal', bg:'#1e293b', card:'#334155', color:'#f1f5f9', title:'rgba(255,255,255,.06)', light:false },

  // ── FILM (4) ── NEW
  { id:'noir', name:'Noir', desc:'film • black white', cat:'film', bg:'linear-gradient(135deg,#0a0a0a,#1a1a1a,#2a2a2a)', card:'#0a0a0a', color:'#d4d4d4', title:'rgba(255,255,255,.06)', light:false },
  { id:'technicolor', name:'Technicolor', desc:'film • vivid 70s', cat:'film', bg:'linear-gradient(135deg,#8b0000,#ff8c00,#006400)', card:'#1a0800', color:'#ffd700', title:'rgba(255,215,0,.1)', light:false },
  { id:'vintage', name:'Vintage', desc:'film • sepia tone', cat:'film', bg:'linear-gradient(135deg,#d4a574,#c49a6c,#a0522d)', card:'#c49a6c', color:'#3e2723', title:'rgba(62,39,35,.08)', light:true },
  { id:'hollywood', name:'Hollywood', desc:'film • golden hour', cat:'film', bg:'linear-gradient(135deg,#1a0a00,#3d1c00,#c68642)', card:'#1a0a00', color:'#ffd599', title:'rgba(255,213,153,.1)', light:false },
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

let currentTheme = THEMES.find(t => t.id === 'light');
let currentLang = LANGUAGES[0];
const settings = { font:"'JetBrains Mono',monospace", fontSize:13, padding:48, radius:10, lineHeight:1.3, shadow:'deep', quality:'fhd', splitPer:35 };

// HD / Full HD / 4K / 8K = PNG width-targeted export. 8K = max sharpness, zero blur on zoom.
const QUALITY_TARGETS = {
  hd:  { width: 1280, label: 'HD',      file: 'hd',       desc: '1280px wide • small file • fast share' },
  fhd: { width: 1920, label: 'Full HD', file: 'fhd',      desc: '1920px wide • best for X/LinkedIn' },
  '4k':{ width: 3840, label: '4K Ultra',file: '4k',       desc: '3840px wide • max detail • larger file' },
  '8k':{ width: 7680, label: '8K Ultra',file: '8k',       desc: '7680px wide • sharpest • desktop recommended' },
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
    d.onclick = () => { currentTheme = t; renderThemes(document.querySelector('.filter.active').dataset.filter); applyTheme(); if(typeof gtag==='function') gtag('event','theme_change',{theme_name:t.name,theme_cat:t.cat}); };
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
  if(typeof gtag==='function') gtag('event','language_change',{language:found.name});
  $('langIcon').textContent = found.icon; $('langName').textContent = found.name; $('langBadge').textContent = found.icon;
  if (loadSample) { codeInput.value = found.sample; $('fileName').value = found.ext; }
  else { const cur = $('fileName').value; if (cur.includes('.')) { const base = cur.substring(0, cur.lastIndexOf('.')) || 'main'; $('fileName').value = base + '.' + found.ext.split('.').pop(); } }
  renderLangMenu(); scheduleUpdate();
}
function applyTheme() {
  snapBg.style.background = currentTheme.bg;
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

// visual line counting: when wrap is on, long lines create extra rows
function getCharsPerLine(){
  const pre=$('preOut');
  if(!pre||!pre.clientWidth) return 80;
  const codeW=pre.clientWidth-12;
  const charW=settings.fontSize*0.6;
  return Math.max(20,Math.floor(codeW/charW));
}
function countVisualLines(text){
  const raw=text.split('\n');
  const cpl=getCharsPerLine();
  let n=0;
  for(const l of raw) n+=Math.max(1,Math.ceil((l.length||1)/cpl));
  return n;
}
function buildLineNums(text){
  const raw=text.split('\n');
  const cpl=getCharsPerLine();
  const nums=[];
  for(let i=0;i<raw.length;i++){
    const rows=Math.max(1,Math.ceil((raw[i].length||1)/cpl));
    for(let j=0;j<rows;j++) nums.push(j===0?String(i+1):'');
  }
  return nums;
}

function updateCode() {
  let text = codeInput.value || '// paste code...';
  if (text.length > 20000) { text = text.slice(0,20000); codeInput.value = text; toast('Trimmed to 20k chars for stability'); }
  const rawLines = text.split('\n').length;
  const wrap = true;
  const lines = wrap ? countVisualLines(text) : rawLines;
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
  snapCard.style.padding = '0';

  if ($('optLines').checked) {
    $('lineNums').style.visibility = 'visible';
    const nums = wrap ? buildLineNums(text) : Array.from({length:rawLines},(_,i)=>String(i+1));
    $('lineNums').innerHTML = nums.map(n=>n||'&nbsp;').join('<br>');
  }
  else $('lineNums').style.visibility = 'hidden';
  $('dots').style.visibility = $('optDots').checked ? 'visible' : 'hidden';
  $('titleBar').style.display = $('optTitle').checked ? 'flex' : 'none';
  $('watermark').style.display = $('optWater').checked ? 'block' : 'none';
  codeOut.style.whiteSpace = wrap ? 'pre-wrap' : 'pre'; codeOut.style.wordBreak = wrap ? 'break-word' : 'normal';

  // smart friendly status (no scary red)
  const pill = $('statusPill'), st = $('statusText'), hint = $('splitHint');
  if (lines <= 50) { pill.className = 'status-pill ok'; st.textContent = `${lines} lines • Ready for HD`; hint.style.display = 'none'; }
  else { pill.className = 'status-pill warn'; st.textContent = `${lines} lines • Split recommended`; hint.style.display = 'block'; $('splitCount').textContent = Math.ceil(rawLines / settings.splitPer); }
  syncScroll();
  requestAnimationFrame(checkWidthOverflow);
}
function checkWidthOverflow(){
  const pre=$('preOut'), hint=$('widthHint');
  if(!pre||!hint) return;
  const wrapOn=true;
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
// Wrap is always on now — nothing to fit.
function fitWidthToImage(){
  toast('Already wrapped — fits perfectly ✓');
}
function syncScroll(){ const pre=$('preOut'); if(pre) $('lineNums').style.transform=`translateY(${-pre.scrollTop}px)`; }
function toast(msg){ const t=$('toast'); t.textContent=msg; clearTimeout(t._h); t._h=setTimeout(()=>t.textContent='',3200); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function updateQualityHint(){
  const q = QUALITY_TARGETS[settings.quality] || QUALITY_TARGETS.fhd;
  const txt = `${q.label} • ${q.width}px wide • ${q.desc}`;
  const el = $('qualityHint');
  if (el) el.textContent = txt;
  const m = $('qualityHintMobile');
  if (m) m.textContent = txt;
}
function computePngScale(el, targetW){
  const w = el.offsetWidth || 800;
  const h = el.offsetHeight || 400;
  let scale = targetW / w;
  // clamp: never worse than CSS (1), max 10 so true 8K width is reachable on typical cards
  scale = Math.min(10, Math.max(1, scale));
  // memory guard: HD/FHD/4K cap at 24MP (mobile-safe), 8K allows up to 64MP (desktop).
  // Beyond that we auto-cap instead of crashing with a blank/glitched image.
  const MAX_PIXELS = targetW >= 7000 ? 64000000 : 24000000;
  const est = (w * scale) * (h * scale);
  let capped = false;
  if (est > MAX_PIXELS) {
    scale = Math.sqrt(MAX_PIXELS / (w * h));
    capped = true;
  }
  // absolute browser canvas limits (Chrome ~16384px per side)
  const outW0 = w * scale, outH0 = h * scale;
  if (outW0 > 8000 || outH0 > 16000) {
    scale = Math.min(8000 / w, 16000 / h);
    capped = true;
  }
  // round to 2 decimals to avoid subpixel blur
  scale = Math.max(1, Math.round(scale * 100) / 100);
  return { scale, capped, cssW: w, cssH: h, outW: Math.round(w * scale), outH: Math.round(h * scale) };
}
async function renderPng(snapEl, scale){
  // backgroundColor:null is the white-corners fix: canvas itself stays transparent
  // so the rounded 18px corners never get a white matte. Image mode paints the
  // theme gradient via the element itself; PNG mode paints nothing outside the card.
  const canvas = await html2canvas(snapEl, { scale, backgroundColor: null, useCORS: true, logging: false });
  return canvas;
}
function expandForExport(){
  document.body.classList.add('exporting');
  const pre=$('preOut'), wrap=document.querySelector('.code-wrap');
  const wrapOn=true;
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
function setLoading(on, label, btnId){
  const ids = ['downloadBtn', 'pngBtn', 'splitBtn'];
  ids.forEach(id => { const b = $(id); if (b) b.disabled = on; });
  if (on && label && btnId) {
    const lbl = btnId === 'pngBtn' ? $('pngLabel') : btnId === 'downloadBtn' ? $('dlLabel') : null;
    if (lbl) lbl.textContent = label;
  } else if (!on) {
    if ($('dlLabel')) $('dlLabel').textContent = '🖼️ Image';
    if ($('pngLabel')) $('pngLabel').textContent = '✨ PNG';
  }
}

// events
codeInput.addEventListener('input', scheduleUpdate);
['fileName','waterText'].forEach(id=>$(id).addEventListener('input', scheduleUpdate));
[['fontSize','fontSize'],['padding','padding'],['radius','radius']].forEach(([id,key])=>{
  $(id).addEventListener('input', e=>{
    const v=parseInt(e.target.value,10);
    settings[key]=v;
    applyTheme();
  });
});
$('lineHeight').addEventListener('input', e=>{ settings.lineHeight=parseInt(e.target.value,10)/10; updateCode(); });
$('splitLines').addEventListener('input', e=>{ settings.splitPer=parseInt(e.target.value,10)||35; updateCode(); });
['optDots','optLines','optTitle','optWater'].forEach(id=>$(id).addEventListener('change', ()=>{ updateCode(); }));
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{ document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderThemes(b.dataset.filter); });
document.querySelectorAll('#scaleSeg button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#scaleSeg button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); settings.quality=b.dataset.quality || 'fhd'; updateQualityHint(); setLoading(false); if(typeof gtag==='function') gtag('event','quality_change',{quality:b.dataset.quality}); });
document.querySelectorAll('#fontSeg button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#fontSeg button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); settings.font=b.dataset.font; updateCode(); });
document.querySelectorAll('#shadowSeg button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#shadowSeg button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); settings.shadow=b.dataset.shadow; applyTheme(); });
$('langBtn').onclick=(e)=>{ e.stopPropagation(); $('langMenu').classList.toggle('open'); };
document.addEventListener('click', ()=>$('langMenu').classList.remove('open'));
$('sampleBtn').onclick=()=>{ setLanguage(currentLang.id, true); toast('✨ '+currentLang.name+' sample loaded'); };
$('preOut').addEventListener('scroll', syncScroll);
$('splitHint').onclick=()=>{ $('exportAdv').open=true; $('splitBtn').scrollIntoView({behavior:'smooth', block:'center'}); };
$('widthHint').onclick=()=>{ fitWidthToImage(); };

// mobile export wiring (duplicated controls in scrollable area)
document.querySelectorAll('.mexport .quality-seg button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.mexport .quality-seg button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  settings.quality=b.dataset.quality || 'fhd';
  // sync desktop selector too
  document.querySelectorAll('#scaleSeg button').forEach(x=>{ x.classList.toggle('active', x.dataset.quality===b.dataset.quality); });
  updateQualityHint(); setLoading(false);
  if(typeof gtag==='function') gtag('event','quality_change',{quality:b.dataset.quality});
});
document.querySelectorAll('.mexport .splitLines').forEach(el=>el.oninput=()=>{ settings.splitPer=+el.value; document.querySelectorAll('.splitVal').forEach(v=>v.textContent=el.value); });
document.querySelectorAll('.mexport .splitBtn').forEach(el=>el.onclick=()=>{ if($('splitBtn')) $('splitBtn').click(); });
document.querySelectorAll('.mexport .dl').forEach(el=>el.onclick=()=>doExport(false));
document.querySelectorAll('.mexport .png').forEach(el=>el.onclick=()=>doExport(true));

// --- shared export core (background fix: backgroundColor:null removes the white matte around corners) ---
async function doExport(transparent){
  const lines=codeInput.value.split('\n').length;
  if(lines>250){ toast('Too tall (>250 lines) — splitting is safer'); $('exportAdv').open=true; return; }
  const qkey=settings.quality || 'fhd';
  const target=QUALITY_TARGETS[qkey] || QUALITY_TARGETS.fhd;
  if(qkey==='8k' && lines>120){ toast('8K + long code may be heavy — Split is safer'); }
  const tag = transparent ? 'png' : 'image';
  setLoading(true, qkey==='8k' ? '⏳ Rendering 8K (takes a few sec)...' : '⏳ Rendering...', tag);
  const saved=expandForExport(); await sleep(180);
  try{
    const info=computePngScale(snapBg, target.width);
    let canvas=null;
    try {
      // transparent: render card only (no bg, no shadow, transparent outside) → logo on any platform
      // image: full snapBg (gradient bg + card) → polished look, no white corners
      const renderEl = transparent ? snapCard : snapBg;
      canvas=await renderPng(renderEl, info.scale);
    } catch(e8k) {
      console.warn('High-res render failed, falling back:', e8k);
      if(qkey==='8k'){
        const fb=computePngScale(snapBg, QUALITY_TARGETS['4k'].width);
        const renderEl = transparent ? snapCard : snapBg;
        canvas=await renderPng(renderEl, fb.scale);
        const a=document.createElement('a');
        a.download=`codesnap-4k-fallback-${transparent?'png':'img'}-${currentLang.id}-${Date.now().toString().slice(-5)}.png`;
        a.href=canvas.toDataURL('image/png'); a.click();
        toast(`⚠️ 8K ran out of memory — gave you 4K ${fb.outW}×${fb.outH} instead • try Split for long code`);
        restoreAfterExport(saved); setLoading(false); return;
      }
      throw e8k;
    }
    const a=document.createElement('a');
    a.download=`codesnap-${target.file}-${transparent?'png':'img'}-${currentLang.id}-${Date.now().toString().slice(-5)}.png`;
    a.href=canvas.toDataURL('image/png'); a.click();
    if(typeof gtag==='function') gtag('event','download',{mode:transparent?'png':'image',quality:qkey,language:currentLang.id,theme:currentTheme.name,lines:lines});
    const modeLabel = transparent ? 'transparent card' : 'full image';
    if(saved.autoWrapped) toast(`✅ ${target.label} • ${info.outW}×${info.outH} • ${modeLabel} • auto-wrapped`);
    else if(info.capped) toast(`✅ ${target.label} • ${info.outW}×${info.outH} • ${modeLabel} • capped for stability`);
    else toast(`✅ ${target.label} • ${info.outW}×${info.outH} • ${modeLabel} • crisp`);
  }catch(e){ console.error(e); toast('Export failed — try Full HD or Split'); }
  restoreAfterExport(saved); setLoading(false);
}

$('downloadBtn').onclick = () => doExport(false);  // Image = full card + gradient bg, no white corners
$('pngBtn').onclick     = () => doExport(true);    // PNG   = card only, transparent outside
$('splitBtn').onclick=async()=>{
  if ($('splitBtn').disabled) return;
  const allLines=codeInput.value.split('\n'), per=settings.splitPer, total=Math.ceil(allLines.length/per);
  if(allLines.length<=per){ toast('Short code — use Download instead'); return; }
  if(total>8){ toast('Too many parts (8 max) — increase lines per image'); return; }
  const qkey=settings.quality || 'fhd';
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
      const info=computePngScale(snapBg, target.width);
      let canvas=null;
      try {
        canvas=await renderPng(snapBg, info.scale);
      } catch(ePart) {
        console.warn('Part render failed, trying 4K fallback:', ePart);
        const fb=computePngScale(snapBg, QUALITY_TARGETS['4k'].width);
        canvas=await renderPng(snapBg, fb.scale);
      }
      const a=document.createElement('a'); a.download=`codesnap-${target.file}-part${i+1}-of-${total}.png`; a.href=canvas.toDataURL('image/png'); a.click();
      await sleep(350);
    }
    toast(`✅ ${total} ${target.label} images done — post as thread 🧵`);
  }catch(e){ console.error(e); toast('Split failed'); }
  doHighlight(orig, currentLang.hljs); updateCode(); restoreAfterExport(saved); setLoading(false);
};

renderThemes(document.querySelector('.filter.active')?.dataset.filter || 'light'); renderLangMenu(); setLanguage('python', false); applyTheme(); updateQualityHint(); setLoading(false);

// Mobile-only padding override: default 14px, min 5px
if(isMobileLayout()){
  settings.padding=14;
  $('padding').min='5'; $('padding').value='14'; $('padVal').textContent='14px';
  applyTheme();
}

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
// mobile: vertical scroll navigation (no tab bar, no horizontal swipe)
function isMobileLayout(){ return window.matchMedia('(max-width: 980px)').matches; }
function scrollToCard(id){
  const strip = document.getElementById('controlsStrip');
  const el = document.getElementById(id);
  if (!el) return;
  if (isMobileLayout() && strip) {
    strip.scrollTo({ top: el.offsetTop - strip.offsetTop - 8, behavior: 'smooth' });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
// tabbar disabled — mobile uses vertical scroll, no tab bar needed
// (kept in HTML for potential future use)
// scroll spy: highlight active section while user scrolls controls (mobile vertical, desktop sidebar)
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
        // vertical scroll: measure top distance
        const d = Math.abs(el.offsetTop - strip.offsetTop - strip.scrollTop);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      const map = ['code','style','style'];
      const tabForCard = map[best] || 'code';
      document.querySelectorAll('.tabbar a').forEach(x=>x.classList.toggle('active', x.dataset.tab === tabForCard));
    }, 80);
  }, { passive: true });
})();
