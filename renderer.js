/* ═══════════════════════════════════════════════════════════════
   STREMINI AI — CRYSTALLINE RENDERER v6.0
   Stunning, editorial-grade outputs. Auto-diagrams, rich cards,
   animated reveals, beautiful typography, structured intelligence.
═══════════════════════════════════════════════════════════════ */

/* ─── FONT INJECTION ─── */
(function injectFonts() {
  if (document.getElementById('cr-fonts')) return;
  const link = document.createElement('link');
  link.id = 'cr-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
})();

/* ─── DOMAIN CONFIG ─── */
const DOMAIN_CONFIG = {
  math:        { label:'Mathematics',       accent:'#3b5bdb', accentBg:'#edf2ff', accentBdr:'#bac8ff', icon:'∑',   gradient:'linear-gradient(135deg,#edf2ff,#dbe4ff)' },
  code:        { label:'Code',              accent:'#7048e8', accentBg:'#f3f0ff', accentBdr:'#d0bfff', icon:'</>',  gradient:'linear-gradient(135deg,#f3f0ff,#e5dbff)' },
  research:    { label:'Research',          accent:'#c76b1a', accentBg:'#fff8f0', accentBdr:'#ffd8a8', icon:'◈',    gradient:'linear-gradient(135deg,#fff8f0,#ffe8cc)' },
  data:        { label:'Data Intelligence', accent:'#0c7abf', accentBg:'#e8f4fd', accentBdr:'#a5d8ff', icon:'◉',   gradient:'linear-gradient(135deg,#e8f4fd,#c5e7fa)' },
  finance:     { label:'Financial',         accent:'#1a7f4b', accentBg:'#ebfbf0', accentBdr:'#8ce99a', icon:'$',    gradient:'linear-gradient(135deg,#ebfbf0,#c3fae8)' },
  architect:   { label:'Architecture',      accent:'#c2410c', accentBg:'#fff4ed', accentBdr:'#ffc078', icon:'⬡',   gradient:'linear-gradient(135deg,#fff4ed,#ffe0b2)' },
  competitive: { label:'Intel Report',      accent:'#6d28d9', accentBg:'#f5f3ff', accentBdr:'#c4b5fd', icon:'◎',   gradient:'linear-gradient(135deg,#f5f3ff,#ede9fe)' },
  growth:      { label:'Growth Strategy',   accent:'#b45309', accentBg:'#fffbeb', accentBdr:'#fde68a', icon:'↑',   gradient:'linear-gradient(135deg,#fffbeb,#fef3c7)' },
  legal:       { label:'Legal Analysis',    accent:'#be123c', accentBg:'#fff1f2', accentBdr:'#fda4af', icon:'⚖',   gradient:'linear-gradient(135deg,#fff1f2,#ffe4e6)' },
  concept:     { label:'Concept',           accent:'#0d9488', accentBg:'#f0fdfa', accentBdr:'#5eead4', icon:'◈',   gradient:'linear-gradient(135deg,#f0fdfa,#ccfbf1)' },
  general:     { label:'StreminiAI',        accent:'#374151', accentBg:'#f9fafb', accentBdr:'#d1d5db', icon:'S',   gradient:'linear-gradient(135deg,#f9fafb,#f3f4f6)' },
};

/* ─── MERMAID DIAGRAM AUTO-GENERATION ─── */
const DIAGRAM_TRIGGERS = {
  flowchart: [
    /\b(flow|flowchart|workflow|process flow|decision tree|control flow)\b/i,
    /\b(steps to|how to|pipeline|sequence of)\b/i,
  ],
  architecture: [
    /\b(system design|architecture|microservice|tech stack|infrastructure|deployment)\b/i,
    /\b(backend|frontend|database|api|server|client)\b/i,
  ],
  sequence: [
    /\b(sequence diagram|interaction|request.*(response|flow)|api call|http|authentication flow)\b/i,
    /\b(user.*clicks|user.*sends|service.*returns|component.*calls)\b/i,
  ],
  class: [
    /\b(class diagram|oop|inheritance|interface|extends|implements|uml)\b/i,
  ],
  er: [
    /\b(entity.*relation|database schema|erd|db design|table.*relation)\b/i,
  ],
  mindmap: [
    /\b(mindmap|concept map|brain.*map|knowledge.*map|topic.*map)\b/i,
  ],
  pie: [
    /\b(pie chart|percentage breakdown|distribution|proportion)\b/i,
  ],
  gantt: [
    /\b(gantt|timeline|roadmap|schedule|sprint|project plan)\b/i,
  ],
};

function detectDiagramType(text) {
  const lower = (text||'').toLowerCase();
  for (const [type, patterns] of Object.entries(DIAGRAM_TRIGGERS)) {
    if (patterns.some(p => p.test(lower))) return type;
  }
  return null;
}

function generateMermaidFromContent(text, type, userQuery) {
  /* Attempt to extract meaningful mermaid from structured content */
  const q = (userQuery||'').toLowerCase();

  if (type === 'flowchart') {
    const steps = [];
    const stepRe = /^(?:Step\s*(\d+)|(\d+)[.)]\s+)\s*[\*\*]*([^\n*]+)[\*\*]*/gm;
    let m;
    while ((m = stepRe.exec(text)) !== null) {
      const label = (m[3]||'').trim().replace(/[:\-–]+$/, '').slice(0, 35);
      if (label) steps.push(label);
    }
    if (steps.length >= 2) {
      let code = 'flowchart TD\n';
      steps.forEach((s, i) => {
        const id = `S${i}`;
        const nextId = `S${i+1}`;
        const shape = i === 0 ? `([${s}])` : i === steps.length-1 ? `([${s}])` : `[${s}]`;
        code += `  ${id}${shape}\n`;
        if (i < steps.length-1) code += `  ${id} --> ${nextId}\n`;
      });
      return code;
    }
  }

  if (type === 'sequence') {
    const actors = [];
    const messages = [];
    const lines = text.split('\n').filter(l => l.trim());
    lines.forEach(l => {
      const m = l.match(/(\w+)\s*(sends?|calls?|returns?|requests?|responds?)\s+(?:to\s+)?(\w+)/i);
      if (m) messages.push({ from: m[1], action: m[2], to: m[3] });
    });
    if (messages.length >= 2) {
      const participants = [...new Set(messages.flatMap(m => [m.from, m.to]))].slice(0, 5);
      let code = 'sequenceDiagram\n';
      participants.forEach(p => code += `  participant ${p}\n`);
      messages.slice(0, 8).forEach(m => {
        const arrow = /return|respond/i.test(m.action) ? '-->>' : '->>';
        code += `  ${m.from}${arrow}${m.to}: ${m.action}\n`;
      });
      return code;
    }
  }

  /* Mindmap for concept/research */
  if (type === 'mindmap') {
    const sections = [];
    const re = /^#{2,3}\s+(.+)$/gm;
    let m;
    while ((m = re.exec(text)) !== null) sections.push(m[1].trim().slice(0, 30));
    if (sections.length >= 2) {
      const topic = (userQuery||'Topic').replace(/\b(explain|what is|tell me about|describe)\b/gi,'').trim().slice(0, 25) || 'Main Topic';
      let code = `mindmap\n  root((${topic}))\n`;
      sections.slice(0, 6).forEach(s => code += `    ${s}\n`);
      return code;
    }
  }

  return null;
}

/* ─── CSS INJECTION ─── */
function injectStyles() {
  if (document.getElementById('cr-v6-styles')) return;
  const s = document.createElement('style');
  s.id = 'cr-v6-styles';
  s.textContent = `
/* ══ ANIMATIONS ══ */
@keyframes cr-fadeUp   {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes cr-fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes cr-slideIn  {from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes cr-fillBar  {from{width:0}to{width:var(--w)}}
@keyframes cr-blink    {0%,100%{opacity:1}50%{opacity:0}}
@keyframes cr-pulse    {0%,100%{box-shadow:0 0 0 0 var(--ping-color,rgba(59,91,219,0.3))}70%{box-shadow:0 0 0 8px transparent}}
@keyframes cr-spin     {to{transform:rotate(360deg)}}
@keyframes cr-shimmer  {0%{background-position:-200% 0}100%{background-position:200% 0}}

/* ══ ROOT ══ */
.cr-root{
  font-family:'DM Sans',ui-sans-serif,sans-serif;
  font-size:14px;line-height:1.72;color:#111827;
  --cr-bg:#fff;--cr-bg2:#f9fafb;--cr-bg3:#f3f4f6;
  --cr-bdr:#e5e7eb;--cr-bdr2:#d1d5db;
  --cr-tx:#0f172a;--cr-tx2:#374151;--cr-tx3:#6b7280;--cr-tx4:#9ca3af;
  --cr-acc:#374151;--cr-acc-bg:#f9fafb;--cr-acc-bdr:#e5e7eb;
  --cr-serif:'Playfair Display',Georgia,serif;
  --cr-mono:'JetBrains Mono',ui-monospace,monospace;
  --cr-r:12px;--cr-r-sm:7px;--cr-r-lg:16px;
  --cr-sh:0 1px 4px rgba(0,0,0,.05),0 6px 24px rgba(0,0,0,.07);
  --cr-sh-lg:0 4px 32px rgba(0,0,0,.09),0 1px 6px rgba(0,0,0,.05);
}
.cr-root *{box-sizing:border-box;-webkit-font-smoothing:antialiased;}

/* ══ CARD ══ */
.cr-card{
  background:#fff;
  border:1.5px solid var(--cr-bdr);
  border-radius:18px;
  overflow:hidden;
  box-shadow:var(--cr-sh-lg);
  margin:2px 0 10px;
  animation:cr-fadeUp .35s cubic-bezier(.16,1,.3,1) both;
  position:relative;
}
.cr-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--cr-acc),color-mix(in srgb,var(--cr-acc) 60%,transparent));
}

/* ══ CARD HEADER ══ */
.cr-hd{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 20px;border-bottom:1.5px solid var(--cr-bdr);
  background:linear-gradient(180deg,var(--cr-bg2),var(--cr-bg));
  gap:12px;
}
.cr-hd-left{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.cr-hd-actions{display:flex;align-items:center;gap:7px;flex-shrink:0;}

.cr-domain-orb{
  width:32px;height:32px;border-radius:10px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:700;
  box-shadow:0 2px 8px rgba(0,0,0,.10);
}
.cr-domain-tag{
  font-family:'DM Sans',sans-serif;
  font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  padding:4px 11px;border-radius:99px;white-space:nowrap;
}
.cr-hd-title{
  font-family:var(--cr-serif);
  font-size:14.5px;font-weight:400;font-style:italic;
  color:var(--cr-tx2);flex:1;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}

/* ══ ACTION BUTTONS ══ */
.cr-btn{
  display:inline-flex;align-items:center;gap:5px;
  background:none;border:1.5px solid var(--cr-bdr2);cursor:pointer;
  font-size:11px;font-weight:600;color:var(--cr-tx3);
  font-family:'DM Sans',sans-serif;
  padding:5px 12px;border-radius:7px;
  transition:all .18s;white-space:nowrap;
}
.cr-btn:hover{background:var(--cr-bg3);color:var(--cr-tx);border-color:var(--cr-bdr2);transform:translateY(-1px);}
.cr-btn.cr-copied{background:#ecfdf5;color:#059669;border-color:#6ee7b7;}
.cr-btn-icon{width:26px;height:26px;border-radius:7px;border:1.5px solid var(--cr-bdr2);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--cr-tx3);transition:all .15s;}
.cr-btn-icon:hover{background:var(--cr-bg3);color:var(--cr-tx);border-color:var(--cr-bdr2);}

/* ══ SUMMARY BAR ══ */
.cr-summary{
  padding:13px 22px;
  border-bottom:1.5px solid var(--cr-bdr);
  font-family:var(--cr-serif);font-style:italic;
  font-size:15px;line-height:1.75;color:var(--cr-tx2);
  background:var(--cr-bg2);
  position:relative;
}
.cr-summary::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:var(--cr-acc);
}

/* ══ SECTION ACCORDIONS ══ */
.cr-section{border-bottom:1px solid var(--cr-bdr);}
.cr-section:last-child{border-bottom:none;}
.cr-section-hd{
  display:flex;align-items:center;gap:10px;
  padding:12px 20px;cursor:pointer;
  background:#fff;transition:background .15s;user-select:none;
}
.cr-section-hd:hover{background:var(--cr-bg2);}
.cr-section-marker{
  width:3px;height:18px;border-radius:2px;flex-shrink:0;
  transition:height .2s;
}
.cr-section-hd:hover .cr-section-marker{height:22px;}
.cr-section-label{
  font-size:11px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:var(--cr-tx2);flex:1;
}
.cr-section-chevron{color:var(--cr-tx4);transition:transform .22s;flex-shrink:0;}
.cr-section-chevron.open{transform:rotate(180deg);}
.cr-section-body{padding:18px 22px 20px;background:#fff;animation:cr-fadeIn .2s ease both;}
.cr-section-body.collapsed{display:none;}

/* ══ DOWNLOAD BAR ══ */
.cr-dl-row{
  display:flex;gap:8px;flex-wrap:wrap;
  padding:12px 20px;border-top:1.5px solid var(--cr-bdr);
  background:var(--cr-bg2);
}
.cr-dl-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border:none;border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:11.5px;
  font-weight:600;cursor:pointer;transition:all .18s;letter-spacing:.01em;
}
.cr-dl-dark{background:#111827;color:#fff;}
.cr-dl-dark:hover{background:#1f2937;transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.2);}
.cr-dl-ghost{background:#fff;color:var(--cr-tx2);border:1.5px solid var(--cr-bdr2);}
.cr-dl-ghost:hover{background:var(--cr-bg3);transform:translateY(-1px);}

/* ══ DIAGRAM CARD ══ */
.cr-diagram-card{
  border:1.5px solid var(--cr-bdr);border-radius:14px;
  overflow:hidden;margin:12px 0;
  box-shadow:0 2px 12px rgba(0,0,0,.06);
  animation:cr-fadeUp .4s cubic-bezier(.16,1,.3,1) .1s both;
}
.cr-diagram-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 16px;background:var(--cr-bg2);
  border-bottom:1px solid var(--cr-bdr);
}
.cr-diagram-label{
  display:flex;align-items:center;gap:8px;
  font-size:10.5px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:var(--cr-tx3);
}
.cr-diagram-label-dot{
  width:7px;height:7px;border-radius:50%;
  background:var(--cr-acc);
}
.cr-diagram-body{
  background:#fff;padding:20px;
  display:flex;justify-content:center;align-items:center;
  min-height:80px;overflow-x:auto;
}
.cr-diagram-body svg{max-width:100%;height:auto;}
.cr-diagram-fallback{
  font-family:var(--cr-mono);font-size:12px;
  color:var(--cr-tx2);white-space:pre;
  background:var(--cr-bg2);padding:14px 18px;
  border-radius:8px;overflow-x:auto;line-height:1.65;
  border:1px solid var(--cr-bdr);
}
.cr-mermaid-wrap{
  background:linear-gradient(135deg,#f8faff,#f3f0ff);
  border:1px solid var(--cr-bdr);border-radius:12px;
  padding:20px;margin:12px 0;overflow-x:auto;
  display:flex;justify-content:center;
}
.cr-mermaid-wrap svg{max-width:100%;height:auto;}

/* ══ PROSE ══ */
.cr-prose{display:flex;flex-direction:column;gap:4px;}
.cr-prose p{font-size:14px;line-height:1.82;color:var(--cr-tx);margin:0 0 8px;}
.cr-prose p:last-child{margin-bottom:0;}
.cr-prose ul,.cr-prose ol{padding-left:22px;margin:5px 0 10px;}
.cr-prose li{font-size:13.5px;margin-bottom:6px;line-height:1.7;color:var(--cr-tx);}
.cr-prose h2{
  font-family:var(--cr-serif);font-style:italic;
  font-size:19px;font-weight:400;color:var(--cr-tx);
  margin:20px 0 10px;padding-bottom:8px;
  border-bottom:2px solid var(--cr-bdr);
  letter-spacing:-.02em;line-height:1.35;
}
.cr-prose h3{
  font-size:13.5px;font-weight:700;color:var(--cr-tx);
  margin:16px 0 7px;letter-spacing:-.01em;
  display:flex;align-items:center;gap:9px;
}
.cr-prose h3::before{
  content:'';display:inline-block;width:4px;height:15px;
  border-radius:2px;background:var(--cr-acc);flex-shrink:0;
}
.cr-prose h4{
  font-size:12px;font-weight:700;color:var(--cr-tx3);
  margin:12px 0 5px;text-transform:uppercase;letter-spacing:.07em;
}
.cr-prose h2:first-child,.cr-prose h3:first-child,.cr-prose h4:first-child{margin-top:0;}
.cr-prose hr{border:none;border-top:1.5px solid var(--cr-bdr);margin:16px 0;}
.cr-prose blockquote{
  border-left:3px solid var(--cr-acc);padding:12px 0 12px 18px;
  color:var(--cr-tx2);font-family:var(--cr-serif);font-style:italic;
  font-size:15px;line-height:1.75;margin:12px 0;
  background:var(--cr-acc-bg);border-radius:0 8px 8px 0;
}
.cr-prose strong{font-weight:700;}
.cr-prose em{font-style:italic;color:var(--cr-tx2);}
.cr-prose a{color:var(--cr-acc);text-decoration-color:color-mix(in srgb,var(--cr-acc) 40%,transparent);text-underline-offset:3px;}
.cr-prose code{
  font-family:var(--cr-mono);font-size:12px;
  background:var(--cr-bg3);border:1px solid var(--cr-bdr2);
  border-radius:5px;padding:2px 7px;color:var(--cr-acc);
  letter-spacing:.02em;
}

/* ══ CALLOUTS ══ */
.cr-callout{
  display:flex;align-items:flex-start;gap:12px;
  padding:13px 17px;border-radius:10px;
  border-left:3px solid;font-size:13.5px;line-height:1.72;
  margin:10px 0;animation:cr-slideIn .25s ease both;
}
.cr-callout.info{background:#eff6ff;border-color:#3b82f6;color:#1e3a8a;}
.cr-callout.warn{background:#fffbeb;border-color:#f59e0b;color:#78350f;}
.cr-callout.tip {background:#ecfdf5;border-color:#10b981;color:#064e3b;}
.cr-callout.danger{background:#fef2f2;border-color:#ef4444;color:#7f1d1d;}
.cr-callout-icon{flex-shrink:0;font-size:15px;margin-top:1px;}

/* ══ CODE BLOCKS ══ */
.cr-code{
  border-radius:12px;overflow:hidden;
  border:1px solid #e5e7eb;margin:10px 0;
  box-shadow:0 3px 12px rgba(0,0,0,.08);
}
.cr-code-bar{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 16px;background:#1c1917;
  border-bottom:1px solid #292524;
}
.cr-code-lang{
  display:flex;align-items:center;gap:8px;
  font-family:var(--cr-mono);font-size:10.5px;color:#a8a29e;
  font-weight:500;text-transform:lowercase;letter-spacing:.04em;
}
.cr-code-dots{display:flex;gap:5px;}
.cr-code-dot{width:9px;height:9px;border-radius:50%;}
.cr-code-dot:nth-child(1){background:#ef4444;}
.cr-code-dot:nth-child(2){background:#f59e0b;}
.cr-code-dot:nth-child(3){background:#22c55e;}
.cr-code-copy{
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);
  color:#a8a29e;font-size:11px;font-family:'DM Sans',sans-serif;
  font-weight:500;padding:4px 11px;border-radius:6px;cursor:pointer;
  transition:all .15s;
}
.cr-code-copy:hover{background:rgba(255,255,255,.12);color:#e7e5e4;}
.cr-code-copy.cr-copied{background:rgba(52,211,153,.12);color:#34d399;border-color:rgba(52,211,153,.25);}
.cr-code-pre{margin:0;background:#1c1917;padding:18px 20px;overflow-x:auto;}
.cr-code-pre code{
  font-family:var(--cr-mono);font-size:12.5px;line-height:1.8;
  color:#e7e5e4;background:none;border:none;padding:0;display:block;
}

/* ══ MATH BLOCKS ══ */
.cr-math-formula{
  background:linear-gradient(135deg,#edf2ff,#dbe4ff);
  border:1.5px solid #bac8ff;border-radius:12px;
  padding:16px 20px;margin:10px 0;
  font-family:var(--cr-mono);font-size:14px;color:#3b5bdb;
  line-height:2;overflow-x:auto;white-space:pre-wrap;word-break:break-word;
}
.cr-math-formula-lbl{
  font-family:'DM Sans',sans-serif;
  font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;
  color:#4c6ef5;margin-bottom:8px;opacity:.8;
}
.cr-math-answer{
  background:linear-gradient(135deg,#ebfbee,#d3f9d8);
  border:2px solid #74c69d;border-radius:14px;
  padding:18px 22px;margin:12px 0;
  box-shadow:0 4px 16px rgba(26,127,79,.12);
}
.cr-math-answer-lbl{
  font-family:'DM Sans',sans-serif;
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:#1a7f4b;margin-bottom:8px;
  display:flex;align-items:center;gap:7px;
}
.cr-math-answer-lbl::before{content:'✓';font-size:13px;}
.cr-math-answer-val{
  font-family:var(--cr-mono);font-size:18px;font-weight:600;
  color:#145a32;line-height:1.9;white-space:pre-wrap;
}
.cr-math-verify{
  background:#eff6ff;border:1px solid #bac8ff;
  border-left:3px solid #4c6ef5;border-radius:0 10px 10px 0;
  padding:12px 18px;font-size:13.5px;color:#1e3a8a;
  line-height:1.7;margin:10px 0;
}

/* ══ STEP TIMELINE ══ */
.cr-steps{display:flex;flex-direction:column;gap:0;}
.cr-step{display:flex;gap:0;align-items:stretch;animation:cr-fadeUp .3s ease both;}
.cr-step:nth-child(1){animation-delay:.05s}
.cr-step:nth-child(2){animation-delay:.10s}
.cr-step:nth-child(3){animation-delay:.15s}
.cr-step:nth-child(4){animation-delay:.20s}
.cr-step:nth-child(5){animation-delay:.25s}
.cr-step-rail{
  display:flex;flex-direction:column;align-items:center;
  width:52px;flex-shrink:0;padding-top:18px;
}
.cr-step-num{
  width:34px;height:34px;border-radius:50%;flex-shrink:0;
  background:var(--cr-tx);color:#fff;
  font-size:13px;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 3px 10px rgba(0,0,0,.18);
  font-family:'DM Sans',sans-serif;
  border:2px solid var(--cr-bg);
  position:relative;z-index:1;
}
.cr-step-line{
  width:2px;flex:1;margin-top:8px;min-height:28px;
  background:linear-gradient(to bottom,var(--cr-bdr2),var(--cr-bdr));
}
.cr-step:last-child .cr-step-line{display:none;}
.cr-step-body{flex:1;padding:16px 20px 20px 0;}
.cr-step-title{
  font-size:14.5px;font-weight:700;color:var(--cr-tx);
  margin-bottom:7px;letter-spacing:-.01em;line-height:1.35;
}
.cr-step-desc{font-size:13.5px;color:var(--cr-tx2);line-height:1.78;}

/* ══ TABLE ══ */
.cr-table-wrap{
  overflow-x:auto;border-radius:12px;
  border:1.5px solid var(--cr-bdr);margin:12px 0;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
}
.cr-table{width:100%;border-collapse:collapse;font-size:13px;}
.cr-table thead th{
  background:#1c1917;color:#f5f5f4;
  padding:12px 16px;font-size:10.5px;font-weight:700;text-align:left;
  letter-spacing:.06em;text-transform:uppercase;
}
.cr-table thead th:first-child{border-radius:0;}
.cr-table tbody td{
  padding:11px 16px;border-bottom:1px solid var(--cr-bdr);
  vertical-align:top;color:var(--cr-tx);font-size:13.5px;
  transition:background .12s;
}
.cr-table tbody tr:last-child td{border-bottom:none;}
.cr-table tbody tr:nth-child(even) td{background:#f9fafb;}
.cr-table tbody tr:hover td{background:var(--cr-acc-bg);}
.cr-table tbody td:first-child{font-weight:600;color:var(--cr-tx2);}

/* ══ BADGES ══ */
.cr-badge{padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:700;white-space:nowrap;letter-spacing:.02em;}
.cr-badge-red   {background:#fee2e2;color:#991b1b;}
.cr-badge-amber {background:#fef3c7;color:#92400e;}
.cr-badge-green {background:#d1fae5;color:#065f46;}
.cr-badge-blue  {background:#dbeafe;color:#1e40af;}

/* ══ LIST CARDS ══ */
.cr-list{display:flex;flex-direction:column;gap:9px;}
.cr-list-item{
  display:flex;gap:14px;align-items:flex-start;
  padding:15px 18px;border:1.5px solid var(--cr-bdr);
  border-radius:12px;background:#fff;
  transition:all .2s cubic-bezier(.16,1,.3,1);
  animation:cr-fadeUp .3s ease both;
}
.cr-list-item:nth-child(1){animation-delay:.04s}
.cr-list-item:nth-child(2){animation-delay:.08s}
.cr-list-item:nth-child(3){animation-delay:.12s}
.cr-list-item:nth-child(4){animation-delay:.16s}
.cr-list-item:nth-child(5){animation-delay:.20s}
.cr-list-item:hover{
  background:var(--cr-acc-bg);border-color:var(--cr-acc);
  box-shadow:0 6px 20px rgba(0,0,0,.08);transform:translateY(-2px);
}
.cr-list-num{
  width:30px;height:30px;border-radius:9px;flex-shrink:0;
  margin-top:2px;display:flex;align-items:center;justify-content:center;
  font-size:12.5px;font-weight:700;font-family:'DM Sans',sans-serif;
}
.cr-list-title{
  font-size:14.5px;font-weight:700;color:var(--cr-tx);
  line-height:1.35;margin-bottom:4px;letter-spacing:-.01em;
}
.cr-list-sub{font-size:13px;color:var(--cr-tx2);line-height:1.7;}

/* ══ RESEARCH SECTIONS ══ */
.cr-rsec{padding:20px 22px;border-bottom:1px solid var(--cr-bdr);}
.cr-rsec:last-child{border-bottom:none;}
.cr-rsec-hd{
  display:flex;align-items:center;gap:11px;
  font-size:15px;font-weight:700;color:var(--cr-tx);
  margin-bottom:12px;letter-spacing:-.01em;
}
.cr-rsec-hd-bar{width:4px;height:20px;border-radius:2px;background:var(--cr-acc);flex-shrink:0;}

/* ══ METRIC STRIP ══ */
.cr-metrics{
  display:flex;gap:0;border:1.5px solid var(--cr-bdr);
  border-radius:14px;overflow:hidden;margin:12px 0;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
}
.cr-metric{
  flex:1;padding:16px 18px;border-right:1px solid var(--cr-bdr);
  display:flex;flex-direction:column;gap:4px;
  transition:background .15s;
}
.cr-metric:hover{background:var(--cr-bg2);}
.cr-metric:last-child{border-right:none;}
.cr-metric-val{
  font-family:var(--cr-serif);font-size:24px;font-weight:400;
  color:var(--cr-tx);line-height:1.2;letter-spacing:-.02em;
}
.cr-metric-lbl{
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:var(--cr-tx4);
}
.cr-metric-delta{font-size:12px;font-weight:600;margin-top:2px;}
.cr-metric-delta.pos{color:#16a34a;}
.cr-metric-delta.neg{color:#dc2626;}

/* ══ KEY-VALUE GRID ══ */
.cr-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:10px 0;}
.cr-kv-item{
  border:1.5px solid var(--cr-bdr);border-radius:11px;
  padding:12px 14px;background:#fff;
  display:flex;flex-direction:column;gap:4px;
  transition:all .18s;
}
.cr-kv-item:hover{border-color:var(--cr-acc);background:var(--cr-acc-bg);transform:translateY(-1px);}
.cr-kv-key{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--cr-tx4);}
.cr-kv-val{font-size:14px;font-weight:600;color:var(--cr-tx);line-height:1.4;}

/* ══ VERDICT / SUMMARY BOX ══ */
.cr-verdict{
  display:flex;align-items:flex-start;gap:14px;
  border:2px solid var(--cr-bdr2);border-radius:12px;
  padding:16px 20px;margin-top:14px;background:var(--cr-bg2);
}
.cr-verdict-glyph{
  font-family:var(--cr-serif);font-style:italic;font-size:22px;
  color:var(--cr-acc);flex-shrink:0;margin-top:2px;width:28px;text-align:center;
}
.cr-verdict strong{
  display:block;font-size:9.5px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:var(--cr-acc);margin-bottom:5px;
}
.cr-verdict p{font-size:13.5px;color:var(--cr-tx);line-height:1.72;margin:0;}

/* ══ DIAGNOSIS ══ */
.cr-diag{display:flex;flex-direction:column;gap:9px;}
.cr-diag-item{border-radius:12px;overflow:hidden;border:1.5px solid;}
.cr-diag-item.sev-critical{border-color:#fecaca;}
.cr-diag-item.sev-high    {border-color:#fdba74;}
.cr-diag-item.sev-medium  {border-color:#fde68a;}
.cr-diag-item.sev-low     {border-color:#86efac;}
.cr-diag-item.sev-info    {border-color:var(--cr-bdr);}
.cr-diag-hd{
  display:flex;align-items:center;gap:9px;
  padding:11px 16px;font-size:13.5px;font-weight:700;
}
.sev-critical .cr-diag-hd{background:#fee2e2;color:#7f1d1d;}
.sev-high     .cr-diag-hd{background:#fff7ed;color:#9a3412;}
.sev-medium   .cr-diag-hd{background:#fefce8;color:#713f12;}
.sev-low      .cr-diag-hd{background:#f0fdf4;color:#14532d;}
.sev-info     .cr-diag-hd{background:#f9fafb;color:var(--cr-tx2);}
.cr-diag-sev-tag{
  font-size:9.5px;font-weight:700;text-transform:uppercase;
  letter-spacing:.05em;padding:2px 9px;border-radius:99px;margin-left:auto;
}
.sev-critical .cr-diag-sev-tag{background:#fecaca;color:#7f1d1d;}
.sev-high     .cr-diag-sev-tag{background:#fed7aa;color:#7c2d12;}
.sev-medium   .cr-diag-sev-tag{background:#fef08a;color:#713f12;}
.sev-low      .cr-diag-sev-tag{background:#bbf7d0;color:#14532d;}
.sev-info     .cr-diag-sev-tag{background:var(--cr-bg3);color:var(--cr-tx3);}
.cr-diag-bd{
  padding:12px 16px;font-size:13.5px;color:var(--cr-tx2);
  line-height:1.75;border-top:1px solid rgba(0,0,0,.05);
}

/* ══ COMPARE COLUMNS ══ */
.cr-compare{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}
@media(max-width:540px){.cr-compare{grid-template-columns:1fr;}}
.cr-cmp-col{border:1.5px solid var(--cr-bdr);border-radius:14px;overflow:hidden;}
.cr-cmp-col.col-a .cr-cmp-col-hd{background:#1c1917;color:#f5f5f4;}
.cr-cmp-col.col-b .cr-cmp-col-hd{background:#fffbeb;color:#92400e;border-bottom:1.5px solid #fde68a;}
.cr-cmp-col-hd{padding:14px 18px;font-size:14px;font-weight:700;letter-spacing:-.01em;}
.cr-cmp-attrs{padding:14px 18px;display:flex;flex-direction:column;gap:0;}
.cr-cmp-attr{padding:10px 0;border-bottom:1px solid var(--cr-bdr);}
.cr-cmp-attr:last-child{border-bottom:none;}
.cr-cmp-attr-lbl{
  font-size:9.5px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:var(--cr-tx4);margin-bottom:3px;
}
.cr-cmp-attr-val{font-size:14px;color:var(--cr-tx);line-height:1.6;}

/* ══ STREAMING CURSOR ══ */
.cr-streaming{opacity:.95;}
.cr-cursor::after{
  content:'▋';animation:cr-blink .65s step-end infinite;
  margin-left:2px;color:var(--cr-acc);
}

/* ══ CHAT SIMPLE ══ */
.cr-chat{
  font-size:14px;line-height:1.82;color:var(--cr-tx);
}

/* ══ ARCHITECTURE DIAGRAM ══ */
.cr-arch{border:1.5px solid var(--cr-bdr);border-radius:14px;overflow:hidden;margin:12px 0;}
.cr-arch-layer{border-bottom:1px solid var(--cr-bdr);}
.cr-arch-layer:last-child{border-bottom:none;}
.cr-arch-layer-hd{
  padding:9px 16px;background:var(--cr-bg2);
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:var(--cr-tx3);border-bottom:1px solid var(--cr-bdr);
}
.cr-arch-components{display:flex;flex-wrap:wrap;gap:7px;padding:12px 16px;}
.cr-arch-comp{
  padding:5px 13px;background:#fff;border:1.5px solid var(--cr-bdr2);
  border-radius:99px;font-size:12.5px;color:var(--cr-tx);font-weight:500;
  transition:all .18s;cursor:default;
}
.cr-arch-comp:hover{background:var(--cr-acc-bg);border-color:var(--cr-acc);transform:translateY(-1px);}

/* ══ HEALTH STRIP ══ */
.cr-health{
  display:flex;align-items:center;gap:16px;
  padding:16px 22px;background:var(--cr-bg2);border-bottom:1.5px solid var(--cr-bdr);
}
.cr-health-score{
  font-family:var(--cr-serif);font-size:36px;font-weight:400;
  line-height:1;flex-shrink:0;letter-spacing:-.03em;
}
.cr-health-lbl{font-size:12.5px;font-weight:700;margin-bottom:5px;}
.cr-health-bar{height:6px;background:var(--cr-bg3);border-radius:3px;overflow:hidden;flex:1;}
.cr-health-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(.16,1,.3,1);width:0;}
.health-critical{color:#dc2626;}.fill-critical{background:linear-gradient(90deg,#dc2626,#f87171);}
.health-risk    {color:#f97316;}.fill-risk    {background:linear-gradient(90deg,#f97316,#fb923c);}
.health-ok      {color:#f59e0b;}.fill-ok      {background:linear-gradient(90deg,#f59e0b,#fbbf24);}
.health-good    {color:#22c55e;}.fill-good    {background:linear-gradient(90deg,#22c55e,#4ade80);}
.health-excellent{color:#06b6d4;}.fill-excellent{background:linear-gradient(90deg,#06b6d4,#22d3ee);}

/* ══ INSIGHT ITEMS ══ */
.cr-insights{display:flex;flex-direction:column;gap:8px;}
.cr-insight{
  display:flex;gap:13px;padding:13px 16px;
  border:1.5px solid var(--cr-bdr);border-radius:12px;
  background:#fff;transition:all .18s;
}
.cr-insight:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);transform:translateY(-1px);}
.cr-insight.pos{border-left:3px solid #22c55e;}
.cr-insight.neg{border-left:3px solid #ef4444;}
.cr-insight.neu{border-left:3px solid var(--cr-bdr2);}
.cr-insight-dot{
  width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:5px;
}
.pos .cr-insight-dot{background:#22c55e;}
.neg .cr-insight-dot{background:#ef4444;}
.neu .cr-insight-dot{background:var(--cr-bdr2);}
.cr-insight-title{font-size:13.5px;font-weight:700;margin-bottom:4px;color:var(--cr-tx);}
.cr-insight-body{font-size:13px;color:var(--cr-tx2);line-height:1.65;}

/* ══ INLINE CHIP ══ */
.cr-chip{
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 12px;border-radius:99px;
  font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  margin-bottom:12px;
}

/* ══ TAG PILLS ══ */
.cr-tags{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;}
.cr-tag{
  padding:3px 11px;border-radius:99px;font-size:11px;font-weight:500;
  background:var(--cr-bg3);color:var(--cr-tx2);border:1px solid var(--cr-bdr);
}
`;
  document.head.appendChild(s);
}

/* ─── UTILITIES ─── */
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function inlineMd(s) {
  s = esc(s);
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]{1,140})\*/g, '<em>$1</em>');
  s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

function mkEl(tag, cls, html) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html !== undefined) el.innerHTML = html;
  return el;
}

function copyToClipboard(text, btn) {
  const orig = btn.innerHTML;
  const ok = () => {
    btn.classList.add('cr-copied');
    btn.innerHTML = '✓ Copied!';
    setTimeout(() => { btn.classList.remove('cr-copied'); btn.innerHTML = orig; }, 2200);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok).catch(() => { fbCopy(text); ok(); });
  else { fbCopy(text); ok(); }
}

function fbCopy(t) {
  const ta = document.createElement('textarea');
  ta.value = t; ta.style.cssText = 'position:fixed;top:-9999px';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
}

function healthClass(n) {
  if (n <= 35) return 'critical';
  if (n <= 55) return 'risk';
  if (n <= 72) return 'ok';
  if (n <= 88) return 'good';
  return 'excellent';
}

/* ─── CARD SHELL BUILDER ─── */
function buildCardShell(domain, titleText) {
  const cfg = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.general;
  const id = 'cr_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);

  const card = mkEl('div', 'cr-card');
  card.style.setProperty('--cr-acc', cfg.accent);
  card.style.setProperty('--cr-acc-bg', cfg.accentBg);
  card.style.setProperty('--cr-acc-bdr', cfg.accentBdr);

  const hd = mkEl('div', 'cr-hd');
  const left = mkEl('div', 'cr-hd-left');

  const orb = mkEl('div', 'cr-domain-orb');
  orb.textContent = cfg.icon;
  orb.style.cssText = `background:${cfg.gradient};color:${cfg.accent};border:1.5px solid ${cfg.accentBdr};`;

  const tag = mkEl('div', 'cr-domain-tag');
  tag.style.cssText = `background:${cfg.accentBg};color:${cfg.accent};border:1px solid ${cfg.accentBdr};`;
  tag.textContent = cfg.label;

  left.appendChild(orb);
  left.appendChild(tag);

  if (titleText) {
    const title = mkEl('div', 'cr-hd-title');
    title.textContent = titleText;
    left.appendChild(title);
  }

  const actions = mkEl('div', 'cr-hd-actions');
  const copyBtn = mkEl('button', 'cr-btn');
  copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`;
  copyBtn.dataset.targetId = id;
  copyBtn.onclick = () => {
    const el = document.getElementById(id);
    copyToClipboard(el ? el.innerText : '', copyBtn);
  };
  actions.appendChild(copyBtn);

  hd.appendChild(left);
  hd.appendChild(actions);
  card.appendChild(hd);

  return { card, id, cfg };
}

function buildDownloadRow(id, domain) {
  const row = mkEl('div', 'cr-dl-row');

  const dlTxt = mkEl('button', 'cr-dl-btn cr-dl-dark');
  dlTxt.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download`;
  dlTxt.onclick = () => {
    const el = document.getElementById(id);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([el ? el.innerText : ''], { type:'text/plain' }));
    a.download = `stremini-${domain||'response'}-${Date.now()}.txt`;
    a.click();
  };

  const dlMd = mkEl('button', 'cr-dl-btn cr-dl-ghost');
  dlMd.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Markdown`;
  dlMd.onclick = () => {
    const el = document.getElementById(id);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([el ? el.innerText : ''], { type:'text/markdown' }));
    a.download = `stremini-${domain||'response'}-${Date.now()}.md`;
    a.click();
  };

  row.appendChild(dlTxt);
  row.appendChild(dlMd);
  return row;
}

/* ─── DIAGRAM BUILDER ─── */
async function buildDiagramCard(mermaidCode, label, accent) {
  const card = mkEl('div', 'cr-diagram-card');
  if (accent) card.style.setProperty('--cr-acc', accent);

  const header = mkEl('div', 'cr-diagram-header');
  const lbl = mkEl('div', 'cr-diagram-label');
  const dot = mkEl('span', 'cr-diagram-label-dot');
  const labelText = mkEl('span', '', label || 'Diagram');
  lbl.appendChild(dot);
  lbl.appendChild(labelText);

  const copyBtn = mkEl('button', 'cr-btn');
  copyBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy code`;
  copyBtn.onclick = () => copyToClipboard(mermaidCode, copyBtn);

  header.appendChild(lbl);
  header.appendChild(copyBtn);
  card.appendChild(header);

  const body = mkEl('div', 'cr-diagram-body');

  if (window.mermaid) {
    try {
      const uid = 'mmd_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
      const cleanCode = mermaidCode.trim();
      const result = await window.mermaid.render(uid, cleanCode);
      body.innerHTML = result.svg || result;
    } catch(e) {
      const fb = mkEl('div', 'cr-diagram-fallback');
      fb.textContent = mermaidCode;
      body.appendChild(fb);
    }
  } else {
    const fb = mkEl('div', 'cr-diagram-fallback');
    fb.textContent = mermaidCode;
    body.appendChild(fb);
  }

  card.appendChild(body);
  return card;
}

/* ─── PARSERS ─── */
function parseCodeBlocks(text) {
  const segs = []; let lastIndex = 0;
  const re = /```([\w-]*)\n?([\s\S]*?)```/g; let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) segs.push({ type:'prose', content:text.slice(lastIndex, m.index) });
    segs.push({ type:'code', lang:(m[1]||'').toLowerCase(), content:m[2].trim() });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) segs.push({ type:'prose', content:text.slice(lastIndex) });
  return segs;
}

function parseTable(text) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && /^[\s|:-]+$/.test(lines[i+1]?.trim()||'')) {
      start = i; break;
    }
  }
  if (start === -1) return null;
  let end = start + 2;
  while (end < lines.length && lines[end]?.includes('|') && lines[end]?.trim()) end++;
  const parseRow = l => l.trim().replace(/^\||\|$/g,'').split('|').map(c => c.trim());
  const headers = parseRow(lines[start]);
  const rows = lines.slice(start+2, end).filter(l => !/^[\s|:-]+$/.test(l)).map(parseRow);
  if (!headers.length || !rows.length) return null;
  return { headers, rows, startLine:start, endLine:end };
}

function parseSteps(text) {
  const steps = [];
  const re2 = /^(\d+)[.)]\s+(?:\*\*([^*\n]+)\*\*[\s\-–:]*(.+)?|([^\n]+))([\s\S]*?)(?=^\d+[.)]\s|\Z)/gm;
  let m;
  while ((m = re2.exec(text)) !== null) {
    const title = (m[2]||m[4]||'').trim();
    const inline = (m[3]||'').trim();
    const rest = (m[5]||'').replace(/^\n+/,'').trim();
    if (title) steps.push({ num:m[1], title, body:(inline+(inline&&rest?' ':'')+rest).trim() });
  }
  if (steps.length >= 2) return steps;

  const steps2 = [];
  const re3 = /step\s+(\d+)\s*[—–:\-]+\s*([^\n]+)([\s\S]*?)(?=step\s+\d+\s*[—–:\-]|$)/gi;
  while ((m = re3.exec(text)) !== null) {
    steps2.push({ num:m[1], title:m[2].trim(), body:(m[3]||'').trim() });
  }
  return steps2.length >= 2 ? steps2 : [];
}

function parseListItems(text) {
  const items = []; const lines = text.split('\n'); let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    const nm = l.match(/^(\d+)[.)]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|(.+))$/);
    if (nm) {
      const title = (nm[2]||nm[4]||'').trim();
      let sub = (nm[3]||'').trim(); i++;
      while (i < lines.length && /^\s{2,}/.test(lines[i]) && !/^\d+[.)]\s/.test(lines[i].trim())) {
        sub += (sub ? ' ':'') + lines[i].trim().replace(/^[-–]\s*/,''); i++;
      }
      if (title) items.push({ num:nm[1], title, sub, ordered:true }); continue;
    }
    const bm = l.match(/^[-*•]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|([^:]+):\s+(.+)|(.+))$/);
    if (bm) {
      const title = (bm[1]||bm[3]||bm[5]||'').trim();
      const sub = (bm[2]||bm[4]||'').trim(); i++;
      if (title) items.push({ title, sub, ordered:false }); continue;
    }
    i++;
  }
  return items;
}

function parseResearchSections(text) {
  const sections = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  const headings = []; let m;
  while ((m = re.exec(text)) !== null) headings.push({ index:m.index, end:re.lastIndex, title:m[2].trim() });
  if (!headings.length) {
    text.split(/\n{2,}/).filter(p => p.trim()).forEach(p => sections.push({ title:null, body:p.trim() }));
    return sections;
  }
  if (headings[0].index > 0) {
    const pre = text.slice(0, headings[0].index).trim();
    if (pre) sections.push({ title:null, body:pre });
  }
  headings.forEach((h, i) => {
    const bodyEnd = i+1 < headings.length ? headings[i+1].index : text.length;
    sections.push({ title:h.title, body:text.slice(h.end, bodyEnd).trim() });
  });
  return sections;
}

/* ─── PROSE BUILDER ─── */
function buildProseBlock(text, accentColor) {
  const div = mkEl('div', 'cr-prose');
  if (accentColor) div.style.setProperty('--cr-acc', accentColor);
  const lines = text.split('\n');
  let i = 0, currentList = null, listTag = '';

  const flush = () => { currentList = null; listTag = ''; };
  const append = el => { flush(); div.appendChild(el); };

  while (i < lines.length) {
    const l = lines[i].trim(); i++;
    if (!l) { flush(); continue; }

    // Callouts
    if (/^⚠️|^warning:/i.test(l)) {
      const co = mkEl('div','cr-callout warn');
      co.innerHTML = '<span class="cr-callout-icon">⚠️</span><span>' + inlineMd(l.replace(/^⚠️?\s*warning:?\s*/i,'')) + '</span>';
      append(co); continue;
    }
    if (/^💡|^tip:/i.test(l)) {
      const co = mkEl('div','cr-callout tip');
      co.innerHTML = '<span class="cr-callout-icon">💡</span><span>' + inlineMd(l.replace(/^💡\s*tip:?\s*/i,'')) + '</span>';
      append(co); continue;
    }
    if (/^ℹ️|^info:|^note:/i.test(l)) {
      const co = mkEl('div','cr-callout info');
      co.innerHTML = '<span class="cr-callout-icon">ℹ️</span><span>' + inlineMd(l.replace(/^ℹ️?\s*(?:info|note):?\s*/i,'')) + '</span>';
      append(co); continue;
    }
    if (/^🚨|^danger:|^critical:/i.test(l)) {
      const co = mkEl('div','cr-callout danger');
      co.innerHTML = '<span class="cr-callout-icon">🚨</span><span>' + inlineMd(l.replace(/^🚨\s*(?:danger|critical):?\s*/i,'')) + '</span>';
      append(co); continue;
    }
    if (/^> /.test(l)) { const bq = mkEl('blockquote'); bq.innerHTML = inlineMd(l.slice(2)); append(bq); continue; }
    if (/^---+$/.test(l)) { append(mkEl('hr')); continue; }

    const hm = l.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const tag = ['h2','h2','h3','h4'][hm[1].length-1]||'h4';
      const h = mkEl(tag); h.innerHTML = inlineMd(hm[2]); append(h); continue;
    }

    if (/^[-*•]\s/.test(l)) {
      if (listTag !== 'UL') { flush(); currentList = mkEl('ul'); listTag='UL'; div.appendChild(currentList); }
      const li = mkEl('li'); li.innerHTML = inlineMd(l.replace(/^[-*•]\s+/,'')); currentList.appendChild(li); continue;
    }
    if (/^\d+[.)]\s/.test(l)) {
      if (listTag !== 'OL') { flush(); currentList = mkEl('ol'); listTag='OL'; div.appendChild(currentList); }
      const li = mkEl('li'); li.innerHTML = inlineMd(l.replace(/^\d+[.)]\s+/,'')); currentList.appendChild(li); continue;
    }

    flush();
    const paraLines = [l];
    while (i < lines.length) {
      const nt = lines[i].trim();
      if (!nt || /^(#{1,4}\s|[-*•]\s|\d+[.)]\s|---+$|> )/.test(nt)) break;
      paraLines.push(nt); i++;
    }
    const p = mkEl('p'); p.innerHTML = inlineMd(paraLines.join(' ')); div.appendChild(p);
  }
  return div;
}

/* ─── CODE BLOCK BUILDER ─── */
function buildCodeBlock(lang, code) {
  if (lang === 'mermaid') {
    const wrap = mkEl('div', 'cr-mermaid-wrap');
    const inner = mkEl('div', 'mermaid');
    inner.textContent = code;
    wrap.appendChild(inner);
    requestAnimationFrame(() => {
      try { if (window.mermaid) mermaid.run({ nodes:[inner] }); } catch(e) {}
    });
    return wrap;
  }

  const wrap = mkEl('div', 'cr-code');
  const bar = mkEl('div', 'cr-code-bar');
  const dots = mkEl('div', 'cr-code-dots');
  dots.innerHTML = '<span class="cr-code-dot"></span><span class="cr-code-dot"></span><span class="cr-code-dot"></span>';
  const langEl = mkEl('div', 'cr-code-lang');
  langEl.innerHTML = `<span style="opacity:.5">~/</span>${esc(lang || 'code')}`;
  const langWrap = mkEl('div', '');
  langWrap.style.cssText = 'display:flex;align-items:center;gap:12px;';
  langWrap.appendChild(dots);
  langWrap.appendChild(langEl);

  const copyBtn = mkEl('button', 'cr-code-copy', 'Copy');
  copyBtn.onclick = () => copyToClipboard(code, copyBtn);
  bar.appendChild(langWrap);
  bar.appendChild(copyBtn);

  const pre = mkEl('pre', 'cr-code-pre');
  const codeEl = mkEl('code');
  if (lang && lang !== 'plaintext') codeEl.className = `language-${lang}`;
  codeEl.textContent = code;
  try { if (window.hljs) window.hljs.highlightElement(codeEl); } catch(e) {}
  pre.appendChild(codeEl);
  wrap.appendChild(bar);
  wrap.appendChild(pre);
  return wrap;
}

/* ─── TABLE DOM BUILDER ─── */
function buildTableDOM(tbl) {
  const tw = mkEl('div', 'cr-table-wrap');
  const table = mkEl('table', 'cr-table');
  const thead = mkEl('thead'); const hr = mkEl('tr');
  tbl.headers.forEach(h => { const th = mkEl('th'); th.innerHTML = inlineMd(h); hr.appendChild(th); });
  thead.appendChild(hr); table.appendChild(thead);
  const tbody = mkEl('tbody');
  tbl.rows.forEach(row => {
    const tr = mkEl('tr');
    tbl.headers.forEach((_, ci) => {
      const td = mkEl('td'); const val = row[ci]||'';
      if (/🔴|CRITICAL|HIGH RISK/i.test(val)) td.innerHTML = `<span class="cr-badge cr-badge-red">${inlineMd(val)}</span>`;
      else if (/🟡|MEDIUM|WARNING/i.test(val)) td.innerHTML = `<span class="cr-badge cr-badge-amber">${inlineMd(val)}</span>`;
      else if (/🟢|LOW|GOOD|OK/i.test(val)) td.innerHTML = `<span class="cr-badge cr-badge-green">${inlineMd(val)}</span>`;
      else td.innerHTML = inlineMd(val);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody); tw.appendChild(table);
  return tw;
}

/* ─── OUTPUT TYPE DETECTION ─── */
function detectOutputType(userQuery, responseText) {
  const q = (userQuery||'').toLowerCase();
  const r = responseText||'';
  if (/```[\w]*\n/.test(r) && (r.match(/```/g)||[]).length >= 2) return 'code';
  if (/\$\$[\s\S]+?\$\$|\\\([\s\S]+?\\\)/.test(r)) return 'math';
  const isMathQ = /\b(solve|calculate|compute|prove|integral|derivative|equation|formula|simplify|factor|differentiate|integrate|theorem|lemma|algebra|calculus|matrix|eigenvalue|probability|statistics|permutation|binomial|limit|series|trigonometry|logarithm)\b/.test(q);
  if (isMathQ) return 'math';
  if (/\b(vs\.?|versus|compare|comparison|difference between|which is better|pros and cons)\b/i.test(q)) return 'comparison';
  if ((r.match(/\|\s*[-:]+\s*\|/g)||[]).length > 0) return 'table';
  if (/\b(how to|how do i|guide|walk me through|tutorial|setup|install|configure|deploy|step by step|steps to)\b/.test(q)) return 'steps';
  if (/^Step\s+\d+/im.test(r) && (r.match(/^Step\s+\d+/gim)||[]).length >= 2) return 'steps';
  if (/^\d+\.\s+\*\*/m.test(r) && (r.match(/^\d+\./gm)||[]).length >= 3) return 'steps';
  if (/\b(diagnose|debug|troubleshoot|root cause|not working|why is|what's wrong)\b/.test(q)) return 'diagnosis';
  if (/\b(list|give me|top \d+|best \d+|recommend|suggest|examples of|name \d+)\b/.test(q)) return 'list';
  if ((r.match(/^[-*•]\s/gm)||[]).length >= 4) return 'list';
  if ((r.match(/^#{2,3}\s/gm)||[]).length >= 2) return 'research';
  if (r.length > 600) return 'research';
  return 'chat';
}

/* ─── DOMAIN RENDERERS ─── */

async function renderCode(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'code', 'Code Response');
  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '20px';
  const segs = parseCodeBlocks(text);
  for (const s of segs) {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'code'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

async function renderMathOutput(text) {
  const { card, id, cfg } = buildCardShell('math', 'Math Solution');
  const sections = parseResearchSections(text);
  const body = mkEl('div', ''); body.id = id;

  for (const sec of sections) {
    const isAnswer = /^(answer|final\s*answer|the\s*answer)\s*$/i.test(sec.title||'');
    const isVerify = /^(verification|verify|check)\s*$/i.test(sec.title||'');
    const secEl = mkEl('div', 'cr-section');

    if (sec.title) {
      const hd = mkEl('div', 'cr-section-hd');
      const marker = mkEl('span', 'cr-section-marker');
      marker.style.background = isAnswer ? '#16a34a' : isVerify ? '#2563eb' : cfg.accent;
      const lbl = mkEl('span', 'cr-section-label'); lbl.textContent = sec.title;
      const chev = mkEl('span', 'cr-section-chevron open');
      chev.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
      hd.appendChild(marker); hd.appendChild(lbl); hd.appendChild(chev);
      const secBody = mkEl('div', 'cr-section-body');
      buildMathBody(sec.body, secBody, isAnswer, isVerify, cfg.accent);
      secEl.appendChild(hd); secEl.appendChild(secBody);
      hd.onclick = () => { const open = secBody.classList.toggle('collapsed'); chev.classList.toggle('open', !open); };
    } else {
      const secBody = mkEl('div', 'cr-section-body');
      buildMathBody(sec.body, secBody, false, false, cfg.accent);
      secEl.appendChild(secBody);
    }
    body.appendChild(secEl);
  }
  card.appendChild(body); card.appendChild(buildDownloadRow(id, 'math'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

function buildMathBody(text, container, isAnswer, isVerify, accent) {
  const isMathLine = t => /[=+\-*/^]/.test(t) && t.length < 200;
  const lines = text.split('\n'); let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim(); i++;
    if (!l) continue;
    if (isAnswer && isMathLine(l)) {
      const af = [l];
      while (i < lines.length && isMathLine(lines[i].trim())) { af.push(lines[i].trim()); i++; }
      const box = mkEl('div', 'cr-math-answer');
      box.appendChild(mkEl('div', 'cr-math-answer-lbl', 'Final Answer'));
      box.appendChild(mkEl('div', 'cr-math-answer-val', af.join('\n')));
      container.appendChild(box); continue;
    }
    if (isVerify) {
      const v = mkEl('div', 'cr-math-verify');
      v.innerHTML = '<strong>✓ Verification: </strong>' + inlineMd(l);
      container.appendChild(v); continue;
    }
    if (isMathLine(l)) {
      const mf = [l];
      while (i < lines.length && isMathLine(lines[i].trim())) { mf.push(lines[i].trim()); i++; }
      const box = mkEl('div', 'cr-math-formula');
      box.appendChild(mkEl('div', 'cr-math-formula-lbl', 'Formula'));
      const fEl = document.createElement('div'); fEl.textContent = mf.join('\n'); box.appendChild(fEl);
      container.appendChild(box); continue;
    }
    container.appendChild(buildProseBlock(l, accent));
  }
}

async function renderResearch(text, domain, userQuery) {
  const { card, id, cfg } = buildCardShell(domain||'research', '');
  const sections = parseResearchSections(text);

  // Check for auto-diagram opportunity
  const diagType = detectDiagramType(userQuery||'');
  let diagramEl = null;
  if (diagType) {
    const mermaidCode = generateMermaidFromContent(text, diagType, userQuery);
    if (mermaidCode) {
      const labelMap = { flowchart:'Flow Diagram', architecture:'System Architecture', sequence:'Sequence Diagram', mindmap:'Mind Map', class:'Class Diagram', er:'ER Diagram', pie:'Distribution Chart', gantt:'Timeline' };
      diagramEl = await buildDiagramCard(mermaidCode, labelMap[diagType]||'Diagram', cfg.accent);
    }
  }

  const body = mkEl('div', ''); body.id = id;

  if (diagramEl) {
    const dWrap = mkEl('div', ''); dWrap.style.cssText = 'padding:16px 20px 4px;';
    dWrap.appendChild(diagramEl);
    body.appendChild(dWrap);
  }

  sections.forEach(sec => {
    const rsec = mkEl('div', 'cr-rsec');
    if (sec.title) {
      const hd = mkEl('div', 'cr-rsec-hd');
      const bar = mkEl('span', 'cr-rsec-hd-bar'); bar.style.background = cfg.accent;
      const lbl = document.createElement('span'); lbl.innerHTML = inlineMd(sec.title);
      hd.appendChild(bar); hd.appendChild(lbl); rsec.appendChild(hd);
    }
    const tbl = parseTable(sec.body);
    if (tbl) {
      const lines = sec.body.split('\n');
      const pre = lines.slice(0, tbl.startLine).join('\n').trim();
      const post = lines.slice(tbl.endLine).join('\n').trim();
      if (pre) rsec.appendChild(buildProseBlock(pre, cfg.accent));
      rsec.appendChild(buildTableDOM(tbl));
      if (post) rsec.appendChild(buildProseBlock(post, cfg.accent));
    } else {
      parseCodeBlocks(sec.body).forEach(s => {
        if (s.type === 'code') rsec.appendChild(buildCodeBlock(s.lang, s.content));
        else if (s.content.trim()) rsec.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
      });
    }
    body.appendChild(rsec);
  });

  card.appendChild(body); card.appendChild(buildDownloadRow(id, domain||'research'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

async function renderSteps(text, domain, userQuery) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Step-by-Step Guide');
  const steps = parseSteps(text);

  // Intro summary
  const firstStepIdx = text.search(/step\s*1|\n1[\.)]\s/i);
  if (firstStepIdx > 0) {
    const intro = text.slice(0, firstStepIdx).trim();
    if (intro) {
      const sum = mkEl('div', 'cr-summary'); sum.innerHTML = inlineMd(intro);
      card.appendChild(sum);
    }
  }

  // Auto flowchart for steps
  if (steps.length >= 2 && window.mermaid) {
    const stepTitles = steps.map(s => s.title.replace(/[{}\[\]]/g,'').slice(0,32));
    let code = 'flowchart TD\n';
    stepTitles.forEach((t, i) => {
      const cls = i === 0 ? `([${t}])` : i === steps.length-1 ? `([${t}])` : `[${t}]`;
      code += `  S${i}${cls}\n`;
      if (i < stepTitles.length-1) code += `  S${i} --> S${i+1}\n`;
    });
    try {
      const dCard = await buildDiagramCard(code, 'Process Flow', cfg.accent);
      const dWrap = mkEl('div', ''); dWrap.style.cssText = 'padding:14px 20px 4px;';
      dWrap.appendChild(dCard);
      card.appendChild(dWrap);
    } catch(e) {}
  }

  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '18px 20px 22px';
  if (steps.length >= 2) {
    const wrap = mkEl('div', 'cr-steps');
    steps.forEach(step => {
      const item = mkEl('div', 'cr-step');
      const rail = mkEl('div', 'cr-step-rail');
      const num = mkEl('div', 'cr-step-num'); num.textContent = step.num;
      num.style.background = cfg.accent;
      rail.appendChild(num); rail.appendChild(mkEl('div', 'cr-step-line'));
      const body = mkEl('div', 'cr-step-body');
      body.appendChild(mkEl('div', 'cr-step-title', inlineMd(step.title)));
      if (step.body) {
        if (/```/.test(step.body)) {
          parseCodeBlocks(step.body).forEach(s => {
            if (s.type === 'code') body.appendChild(buildCodeBlock(s.lang, s.content));
            else if (s.content.trim()) body.appendChild(mkEl('div', 'cr-step-desc', inlineMd(s.content.trim())));
          });
        } else {
          body.appendChild(mkEl('div', 'cr-step-desc', inlineMd(step.body.replace(/\n/g,' '))));
        }
      }
      item.appendChild(rail); item.appendChild(body); wrap.appendChild(item);
    });
    bd.appendChild(wrap);
  } else {
    parseCodeBlocks(text).forEach(s => {
      if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
    });
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'general'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

async function renderList(text, domain) {
  const items = parseListItems(text);
  const { card, id, cfg } = buildCardShell(domain||'general', `${items.length || ''} Results`.trim());

  const firstItem = text.search(/^(\d+[.)]\s|[-*•]\s)/m);
  if (firstItem > 0) {
    const intro = text.slice(0, firstItem).trim();
    if (intro) { const sum = mkEl('div', 'cr-summary'); sum.innerHTML = inlineMd(intro); card.appendChild(sum); }
  }

  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '16px 20px 20px';
  if (items.length >= 2) {
    const wrap = mkEl('div', 'cr-list');
    items.forEach((item, idx) => {
      const el = mkEl('div', 'cr-list-item');
      const bullet = mkEl('div', item.ordered ? 'cr-list-num' : 'cr-list-num');
      bullet.textContent = item.ordered ? (item.num||String(idx+1)) : '·';
      bullet.style.cssText = `background:${cfg.accentBg};color:${cfg.accent};border:1.5px solid ${cfg.accentBdr};`;
      const content = mkEl('div', '');
      if (item.title) content.appendChild(mkEl('div', 'cr-list-title', inlineMd(item.title)));
      if (item.sub) content.appendChild(mkEl('div', 'cr-list-sub', inlineMd(item.sub)));
      el.appendChild(bullet); el.appendChild(content); wrap.appendChild(el);
    });
    bd.appendChild(wrap);
  } else {
    bd.appendChild(buildProseBlock(text, cfg.accent));
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'general'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

async function renderComparison(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Comparison');

  if (text.includes('|') && text.match(/\|\s*[-:]+\s*\|/)) {
    const tbl = parseTable(text);
    if (tbl) {
      const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '18px 20px';
      const lines = text.split('\n');
      const pre = lines.slice(0, tbl.startLine).join('\n').trim();
      if (pre) { const sum = mkEl('div', 'cr-summary'); sum.innerHTML = inlineMd(pre); card.appendChild(sum); }
      bd.appendChild(buildTableDOM(tbl));
      const post = lines.slice(tbl.endLine).join('\n').trim();
      if (post) {
        const v = mkEl('div', 'cr-verdict');
        v.innerHTML = `<div class="cr-verdict-glyph" style="color:${cfg.accent}">—</div><div><strong style="color:${cfg.accent}">Verdict</strong><p>${inlineMd(post.replace(/^#{1,4}\s+[^\n]+\n?/gm,'').trim())}</p></div>`;
        bd.appendChild(v);
      }
      card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'general'));
      const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
    }
  }
  return renderResearch(text, domain, '');
}

async function renderTable(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Data Table');
  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '18px 20px';
  const tbl = parseTable(text);
  if (tbl) {
    const lines = text.split('\n');
    const pre = lines.slice(0, tbl.startLine).join('\n').trim();
    if (pre) bd.appendChild(buildProseBlock(pre, cfg.accent));
    bd.appendChild(buildTableDOM(tbl));
    const post = lines.slice(tbl.endLine).join('\n').trim();
    if (post) bd.appendChild(buildProseBlock(post, cfg.accent));
  } else {
    bd.appendChild(buildProseBlock(text, cfg.accent));
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'general'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

async function renderDiagnosis(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Diagnosis');
  const sections = parseResearchSections(text);
  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '18px 20px';
  const sevMap = {
    'critical':'critical','error':'critical','fatal':'critical',
    'high':'high','major':'high','broken':'high','risk':'high',
    'medium':'medium','warning':'medium','issue':'medium','problem':'medium',
    'low':'low','minor':'low','tip':'low',
    'info':'info','note':'info'
  };
  const diag = mkEl('div', 'cr-diag');
  let hasFindings = false;
  sections.forEach(sec => {
    if (!sec.title) { bd.appendChild(buildProseBlock(sec.body, cfg.accent)); return; }
    hasFindings = true;
    const titleLow = sec.title.toLowerCase();
    let sev = 'info';
    for (const [k,v] of Object.entries(sevMap)) { if (titleLow.includes(k)) { sev = v; break; } }
    const item = mkEl('div', `cr-diag-item sev-${sev}`);
    const hd = mkEl('div', 'cr-diag-hd'); hd.innerHTML = inlineMd(sec.title);
    const tag = mkEl('span', 'cr-diag-sev-tag'); tag.textContent = sev.toUpperCase(); hd.appendChild(tag);
    item.appendChild(hd);
    if (sec.body) { const fb = mkEl('div', 'cr-diag-bd'); fb.appendChild(buildProseBlock(sec.body, cfg.accent)); item.appendChild(fb); }
    diag.appendChild(item);
  });
  if (hasFindings) bd.appendChild(diag); else bd.appendChild(buildProseBlock(text, cfg.accent));
  card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'general'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

async function renderChat(text, domain) {
  const cfg = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.general;
  const root = mkEl('div', 'cr-root');
  root.style.setProperty('--cr-acc', cfg.accent);

  if (text.length < 180) {
    const wrap = mkEl('div', 'cr-chat');
    parseCodeBlocks(text).forEach(s => {
      if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) wrap.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
    });
    root.appendChild(wrap); return root;
  }

  const { card, id } = buildCardShell(domain||'general', '');
  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '20px 22px';
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
  });
  card.appendChild(bd);
  root.appendChild(card); return root;
}

/* ─── MAIN RENDER ENTRY ─── */
async function renderOutput(userQuery, responseText, container, domain, isStreaming) {
  injectStyles();

  if (isStreaming) {
    const root = mkEl('div', 'cr-root cr-streaming');
    const cfg = DOMAIN_CONFIG[domain||'general']||DOMAIN_CONFIG.general;
    root.style.setProperty('--cr-acc', cfg.accent);
    const wrap = mkEl('div', 'cr-chat cr-cursor');
    parseCodeBlocks(responseText).forEach(s => {
      if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) { const p = mkEl('p'); p.innerHTML = inlineMd(s.content.trim()); wrap.appendChild(p); }
    });
    root.appendChild(wrap);
    if (container) { container.innerHTML = ''; container.appendChild(root); }
    return root;
  }

  const outType = detectOutputType(userQuery, responseText);
  const dom = domain || 'general';

  let el;
  try {
    // Domain-specific overrides
    switch (dom) {
      case 'math':
        el = await renderMathOutput(responseText); break;
      case 'code':
        el = await renderCode(responseText, dom); break;
      default: {
        switch (outType) {
          case 'code':       el = await renderCode(responseText, dom); break;
          case 'math':       el = await renderMathOutput(responseText); break;
          case 'steps':      el = await renderSteps(responseText, dom, userQuery); break;
          case 'comparison': el = await renderComparison(responseText, dom); break;
          case 'table':      el = await renderTable(responseText, dom); break;
          case 'list':       el = await renderList(responseText, dom); break;
          case 'research':   el = await renderResearch(responseText, dom, userQuery); break;
          case 'diagnosis':  el = await renderDiagnosis(responseText, dom); break;
          default:           el = await renderChat(responseText, dom); break;
        }
      }
    }
  } catch(err) {
    console.warn('Renderer error:', err);
    el = await renderChat(responseText, dom);
  }

  if (container) { container.innerHTML = ''; container.appendChild(el); }

  // Animate health bars after render
  requestAnimationFrame(() => {
    container?.querySelectorAll('.cr-health-fill').forEach(bar => {
      const w = bar.style.getPropertyValue('--w') || bar.dataset.w || '0%';
      bar.style.width = w;
    });
  });

  return el;
}

/* ─── STREAMING HELPERS ─── */
function updateStream(text, container) {
  if (!container) return;
  injectStyles();
  const root = mkEl('div', 'cr-root cr-streaming');
  const wrap = mkEl('div', 'cr-chat cr-cursor');
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) { const p = mkEl('p'); p.innerHTML = inlineMd(s.content.trim()); wrap.appendChild(p); }
  });
  root.appendChild(wrap);
  container.innerHTML = ''; container.appendChild(root);
}

async function finalizeStream(userQuery, fullText, container, domain) {
  if (!container) return;
  await renderOutput(userQuery, fullText, container, domain||'general', false);
}

/* ─── STANDALONE DIAGRAM RENDERER ─── */
async function renderDiagram(mermaidCode, label, container, accent) {
  injectStyles();
  const card = await buildDiagramCard(mermaidCode, label, accent||'#374151');
  if (container) { container.innerHTML = ''; container.appendChild(card); }
  return card;
}

/* ─── PUBLIC API ─── */
window.StreminiRenderer = {
  render:         renderOutput,
  updateStream,
  finalizeStream,
  renderDiagram,
  detectType:     detectOutputType,
  detectDiagram:  detectDiagramType,
  injectStyles,
  DOMAIN_CONFIG,
  buildDiagramCard,
  buildProseBlock,
  buildCodeBlock,
};
