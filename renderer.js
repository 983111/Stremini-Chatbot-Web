/* ═══════════════════════════════════════════════════════════════════════
   STREMINI — BEAUTIFUL RENDERER v7.0
   Claude-level output quality: stunning diagrams, LaTeX math, rich
   code blocks, animated cards, elegant typography.

   DROP-IN REPLACEMENT for renderer.js — paste into your index.html
   <script> block or load as a separate file BEFORE the main app script.

   CDN dependencies (already in your index.html):
     • mermaid@10          → diagrams
     • katex@0.16.9        → math rendering
     • katex auto-render   → inline math
     • highlight.js 11.9   → code syntax
   No new CDN deps needed.
═══════════════════════════════════════════════════════════════════════ */

/* ─── 0. FONT & GLOBAL STYLE INJECTION ──────────────────────────────── */
(function injectGlobalStyles() {
  if (document.getElementById('br7-global')) return;
  const s = document.createElement('style');
  s.id = 'br7-global';
  s.textContent = `
/* ── ANIMATIONS ── */
@keyframes br7-fadeUp   { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
@keyframes br7-fadeIn   { from { opacity:0 } to { opacity:1 } }
@keyframes br7-slideR   { from { opacity:0; transform:translateX(-10px) } to { opacity:1; transform:none } }
@keyframes br7-pop      { 0%{transform:scale(.94)} 60%{transform:scale(1.02)} 100%{transform:scale(1)} }
@keyframes br7-shimmer  { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
@keyframes br7-spin     { to { transform: rotate(360deg) } }
@keyframes br7-pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
@keyframes br7-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes br7-drawLine { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
@keyframes br7-barFill  { from{width:0} to{width:var(--w,0%)} }

/* ── ROOT CARD ── */
.br7 {
  font-family: 'DM Sans', ui-sans-serif, sans-serif;
  font-size: 14px;
  line-height: 1.72;
  color: var(--tx, #0d0d0f);
  --br7-acc:    #e8622a;
  --br7-acc2:   #ff7a40;
  --br7-bg:     #ffffff;
  --br7-bg2:    #f7f7f8;
  --br7-bg3:    #f0f0f5;
  --br7-bdr:    #e5e5ea;
  --br7-bdr2:   #d1d1d6;
  --br7-tx:     #0d0d0f;
  --br7-tx2:    #48484a;
  --br7-tx3:    #8e8e93;
  --br7-tx4:    #aeaeb2;
  --br7-green:  #34c759;
  --br7-red:    #ff3b30;
  --br7-blue:   #007aff;
  --br7-purple: #af52de;
  --br7-serif:  'Lora', Georgia, serif;
  --br7-mono:   'JetBrains Mono', ui-monospace, monospace;
  --br7-r:      12px;
  --br7-r-sm:   7px;
  --br7-r-lg:   18px;
  --br7-sh:     0 1px 4px rgba(0,0,0,.06), 0 8px 28px rgba(0,0,0,.08);
  --br7-sh-lg:  0 4px 40px rgba(0,0,0,.10), 0 1px 8px rgba(0,0,0,.06);
}
.br7 * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

/* ── OUTER WRAPPER CARD ── */
.br7-card {
  background: #fff;
  border: 1.5px solid var(--br7-bdr);
  border-radius: var(--br7-r-lg);
  overflow: hidden;
  box-shadow: var(--br7-sh-lg);
  margin: 4px 0 12px;
  animation: br7-fadeUp .38s cubic-bezier(.16,1,.3,1) both;
  position: relative;
}
.br7-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--br7-acc), var(--br7-acc2), var(--br7-acc));
  background-size: 200% 100%;
  animation: br7-shimmer 3s linear infinite;
}

/* ── CARD HEADER ── */
.br7-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1.5px solid var(--br7-bdr);
  background: linear-gradient(180deg, var(--br7-bg2) 0%, var(--br7-bg) 100%);
  gap: 12px;
}
.br7-hd-left  { display:flex; align-items:center; gap:10px; flex:1; min-width:0; }
.br7-hd-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }

.br7-type-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 13px; border-radius: 99px;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase;
  border: 1.5px solid; white-space: nowrap;
  animation: br7-pop .3s ease both;
}
.br7-hd-title {
  font-family: var(--br7-serif);
  font-size: 14px; font-weight: 400; font-style: italic;
  color: var(--br7-tx2); flex: 1;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* ── BUTTONS ── */
.br7-btn {
  display: inline-flex; align-items: center; gap: 5px;
  background: none; border: 1.5px solid var(--br7-bdr2); cursor: pointer;
  font-size: 11px; font-weight: 600; color: var(--br7-tx3);
  font-family: 'DM Sans', sans-serif;
  padding: 5px 11px; border-radius: 7px;
  transition: all .18s; white-space: nowrap;
}
.br7-btn:hover { background: var(--br7-bg3); color: var(--br7-tx); border-color: var(--br7-bdr2); transform: translateY(-1px); }
.br7-btn.copied { background: #ecfdf5; color: #059669; border-color: #6ee7b7; }

/* ── SUMMARY STRIP ── */
.br7-summary {
  padding: 13px 22px; border-bottom: 1.5px solid var(--br7-bdr);
  font-family: var(--br7-serif); font-style: italic;
  font-size: 14.5px; line-height: 1.8; color: var(--br7-tx2);
  background: var(--br7-bg2); position: relative;
}
.br7-summary::before {
  content: ''; position: absolute; left:0; top:0; bottom:0; width: 3px;
  background: var(--br7-acc);
}

/* ── SECTION ACCORDIONS ── */
.br7-section { border-bottom: 1px solid var(--br7-bdr); }
.br7-section:last-child { border-bottom: none; }
.br7-sec-hd {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 20px; cursor: pointer;
  background: #fff; transition: background .15s; user-select: none;
}
.br7-sec-hd:hover { background: var(--br7-bg2); }
.br7-sec-bar { width: 3px; height: 18px; border-radius: 2px; flex-shrink: 0; background: var(--br7-acc); transition: height .2s; }
.br7-sec-hd:hover .br7-sec-bar { height: 22px; }
.br7-sec-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--br7-tx2); flex:1; }
.br7-chevron { color: var(--br7-tx4); transition: transform .22s; flex-shrink:0; }
.br7-chevron.open { transform: rotate(180deg); }
.br7-sec-body { padding: 18px 22px 20px; background: #fff; animation: br7-fadeIn .2s ease both; }
.br7-sec-body.collapsed { display: none; }

/* ── DOWNLOAD BAR ── */
.br7-dl-row {
  display: flex; gap: 8px; flex-wrap: wrap;
  padding: 11px 20px; border-top: 1.5px solid var(--br7-bdr);
  background: var(--br7-bg2);
}
.br7-dl-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border: none; border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 11.5px;
  font-weight: 600; cursor: pointer; transition: all .18s;
}
.br7-dl-dark { background: #0d0d0f; color: #fff; }
.br7-dl-dark:hover { background: #2d2a26; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,.18); }
.br7-dl-ghost { background: #fff; color: var(--br7-tx2); border: 1.5px solid var(--br7-bdr2); }
.br7-dl-ghost:hover { background: var(--br7-bg3); transform: translateY(-1px); }

/* ════════════════════════════════════════════
   CODE BLOCKS  — dark terminal look
════════════════════════════════════════════ */
.br7-code-wrap {
  border-radius: var(--br7-r); overflow: hidden;
  border: 1px solid #3a3a3c; margin: 10px 0;
  box-shadow: 0 4px 20px rgba(0,0,0,.20);
  animation: br7-fadeUp .3s ease .06s both;
}
.br7-code-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 16px; background: #2c2c2e;
  border-bottom: 1px solid #3a3a3c;
}
.br7-code-dots { display: flex; gap: 6px; }
.br7-code-dot  { width: 11px; height: 11px; border-radius: 50%; }
.br7-code-dot:nth-child(1) { background: #ff5f57; }
.br7-code-dot:nth-child(2) { background: #ffbd2e; }
.br7-code-dot:nth-child(3) { background: #28c840; }
.br7-code-lang {
  font-family: var(--br7-mono); font-size: 11px; font-weight: 500;
  color: #8e8e93; text-transform: lowercase; letter-spacing: .04em;
}
.br7-code-copy {
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.14);
  color: #8e8e93; font-size: 11px; font-family: 'DM Sans', sans-serif;
  font-weight: 600; padding: 4px 11px; border-radius: 6px; cursor: pointer;
  transition: all .15s; display: flex; align-items: center; gap: 5px;
}
.br7-code-copy:hover  { background: rgba(255,255,255,.13); color: #e8e8ea; }
.br7-code-copy.copied { background: rgba(52,199,89,.15); color: #34c759; border-color: rgba(52,199,89,.3); }
.br7-code-pre { margin:0; background: #1c1c1e; padding: 18px 20px; overflow-x: auto; }
.br7-code-pre code {
  font-family: var(--br7-mono); font-size: 13px; line-height: 1.75;
  color: #e8e8ea; background: none; border: none; padding: 0; display: block;
}
/* Line numbers hint */
.br7-code-pre.has-nums { padding-left: 0; }

/* ════════════════════════════════════════════
   MATH / LaTeX  — KaTeX styled beautifully
════════════════════════════════════════════ */
.br7-math-block {
  background: linear-gradient(135deg, #f0f4ff, #e8eeff);
  border: 1.5px solid #c7d2fe; border-radius: 12px;
  padding: 18px 22px; margin: 12px 0;
  overflow-x: auto; text-align: center;
  box-shadow: 0 2px 12px rgba(99,102,241,.10);
  animation: br7-fadeUp .3s ease both;
}
.br7-math-block .katex { font-size: 1.25em; }
.br7-math-block .katex-display { margin: 0; }

.br7-math-answer {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 2px solid #6ee7b7; border-radius: 14px;
  padding: 18px 24px; margin: 14px 0;
  box-shadow: 0 4px 20px rgba(16,185,129,.12);
  animation: br7-pop .35s ease both;
}
.br7-math-answer-lbl {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: #059669; margin-bottom: 10px;
  display: flex; align-items: center; gap: 7px;
}
.br7-math-answer-lbl::before { content: '✓'; font-size: 14px; }
.br7-math-answer .katex { font-size: 1.4em; color: #065f46; }
.br7-math-answer .katex-display { margin: 0; }

.br7-math-step {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 16px; margin: 8px 0;
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
  border: 1px solid #ddd6fe; border-radius: 10px;
  animation: br7-slideR .25s ease both;
}
.br7-math-step-num {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  background: #7c3aed; color: #fff;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.br7-math-step-body { flex: 1; }
.br7-math-step-title { font-size: 12.5px; font-weight: 700; color: #4c1d95; margin-bottom: 5px; }
.br7-math-step-expr { font-family: var(--br7-mono); font-size: 13px; color: #5b21b6; background: rgba(124,58,237,.08); border-radius: 7px; padding: 7px 10px; margin-top: 6px; overflow-x:auto; }

.br7-math-inline { font-style: italic; color: #4338ca; }

/* ════════════════════════════════════════════
   DIAGRAMS  — Mermaid with beautiful wrapper
════════════════════════════════════════════ */
.br7-diagram-card {
  border: 1.5px solid var(--br7-bdr); border-radius: 14px;
  overflow: hidden; margin: 14px 0;
  box-shadow: 0 2px 16px rgba(0,0,0,.07);
  animation: br7-fadeUp .4s ease .1s both;
}
.br7-diagram-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 18px; background: var(--br7-bg2);
  border-bottom: 1px solid var(--br7-bdr);
}
.br7-diagram-lbl {
  display: flex; align-items: center; gap: 8px;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--br7-tx3);
}
.br7-diagram-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--br7-acc);
  animation: br7-pulse 2s ease infinite;
}
.br7-diagram-body {
  background: #fafafa;
  padding: 22px 18px;
  display: flex; justify-content: center; align-items: center;
  overflow-x: auto; min-height: 80px;
  /* subtle grid background for diagrams */
  background-image: radial-gradient(circle, #e5e5ea 1px, transparent 1px);
  background-size: 24px 24px;
  background-color: #fafafa;
}
.br7-diagram-body svg {
  max-width: 100%; height: auto;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,.08));
}
.br7-diagram-fallback {
  font-family: var(--br7-mono); font-size: 12px; color: var(--br7-tx2);
  white-space: pre; overflow-x: auto; padding: 16px 18px;
  background: #1c1c1e; color: #e8e8ea; border-radius: 8px; line-height: 1.65;
}
.br7-diagram-err {
  padding: 14px 18px; font-size: 13px; color: var(--br7-tx3);
  display: flex; align-items: center; gap: 8px;
}

/* ════════════════════════════════════════════
   STEP TIMELINE
════════════════════════════════════════════ */
.br7-steps { display: flex; flex-direction: column; }
.br7-step { display: flex; gap: 0; align-items: stretch; }
.br7-step { animation: br7-fadeUp .3s ease both; }
.br7-step:nth-child(1){animation-delay:.04s}
.br7-step:nth-child(2){animation-delay:.09s}
.br7-step:nth-child(3){animation-delay:.14s}
.br7-step:nth-child(4){animation-delay:.19s}
.br7-step:nth-child(5){animation-delay:.24s}
.br7-step:nth-child(n+6){animation-delay:.28s}

.br7-step-rail { display:flex; flex-direction:column; align-items:center; width:52px; flex-shrink:0; padding-top:16px; }
.br7-step-num {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink:0;
  background: var(--br7-acc); color: #fff;
  font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(232,98,42,.35);
  border: 2.5px solid #fff; position: relative; z-index:1;
}
.br7-step-line {
  width: 2px; flex:1; min-height: 32px; margin-top: 6px;
  background: linear-gradient(to bottom, var(--br7-bdr2), var(--br7-bdr));
}
.br7-step:last-child .br7-step-line { display:none; }
.br7-step-body { flex:1; padding: 14px 18px 20px 0; }
.br7-step-title { font-size: 14.5px; font-weight: 700; color: var(--br7-tx); margin-bottom: 7px; letter-spacing: -.01em; line-height: 1.35; }
.br7-step-desc  { font-size: 13.5px; color: var(--br7-tx2); line-height: 1.78; }

/* ════════════════════════════════════════════
   NUMBERED LIST CARDS
════════════════════════════════════════════ */
.br7-list { display:flex; flex-direction:column; gap:10px; }
.br7-list-item {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 14px 18px; border: 1.5px solid var(--br7-bdr);
  border-radius: 12px; background: #fff;
  transition: all .22s cubic-bezier(.16,1,.3,1);
  animation: br7-fadeUp .3s ease both;
}
.br7-list-item:hover {
  border-color: var(--br7-acc); background: #fff8f5;
  box-shadow: 0 6px 24px rgba(232,98,42,.10); transform: translateY(-2px);
}
.br7-list-num {
  width: 32px; height: 32px; border-radius: 10px; flex-shrink:0;
  background: linear-gradient(135deg, #fff1eb, #ffe0d0);
  color: var(--br7-acc); border: 1.5px solid #ffd0b8;
  font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin-top: 2px;
}
.br7-list-title { font-size: 14.5px; font-weight: 700; color: var(--br7-tx); margin-bottom: 4px; letter-spacing: -.01em; }
.br7-list-sub   { font-size: 13px; color: var(--br7-tx2); line-height: 1.72; }

/* ════════════════════════════════════════════
   COMPARISON TABLE  — dark header
════════════════════════════════════════════ */
.br7-table-wrap {
  overflow-x: auto; border-radius: 12px;
  border: 1.5px solid var(--br7-bdr); margin: 12px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  animation: br7-fadeIn .3s ease both;
}
.br7-table { width:100%; border-collapse:collapse; font-size: 13.5px; }
.br7-table thead th {
  background: #1c1c1e; color: #f5f5f7;
  padding: 12px 16px; text-align: left;
  font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
}
.br7-table tbody td {
  padding: 11px 16px; border-bottom: 1px solid var(--br7-bdr);
  vertical-align: top; color: var(--br7-tx); transition: background .12s;
}
.br7-table tbody tr:last-child td { border-bottom: none; }
.br7-table tbody tr:nth-child(even) td { background: #f9f9fb; }
.br7-table tbody tr:hover td { background: #fff1eb; }
.br7-table tbody td:first-child { font-weight: 600; color: var(--br7-tx2); }

/* ════════════════════════════════════════════
   PROSE  — beautiful, editorial
════════════════════════════════════════════ */
.br7-prose { display:flex; flex-direction:column; gap:0; }
.br7-prose p   { font-size:14px; line-height:1.84; color:var(--br7-tx); margin:0 0 10px; }
.br7-prose p:last-child { margin-bottom:0; }
.br7-prose ul,.br7-prose ol { padding-left:24px; margin: 6px 0 12px; }
.br7-prose li  { font-size:13.5px; margin-bottom:6px; line-height:1.72; color:var(--br7-tx); }
.br7-prose h2  {
  font-family: var(--br7-serif); font-style:italic;
  font-size: 20px; font-weight:400; color: var(--br7-tx);
  margin: 22px 0 10px; padding-bottom: 8px;
  border-bottom: 2px solid var(--br7-bdr);
  letter-spacing: -.02em; line-height:1.3;
}
.br7-prose h3  {
  font-size: 13.5px; font-weight: 700; color: var(--br7-tx);
  margin: 18px 0 7px; display: flex; align-items: center; gap: 9px;
}
.br7-prose h3::before {
  content: ''; display: inline-block; width: 4px; height: 15px;
  border-radius: 2px; background: var(--br7-acc); flex-shrink:0;
}
.br7-prose h4  { font-size:12px; font-weight:700; color:var(--br7-tx3); margin:14px 0 5px; text-transform:uppercase; letter-spacing:.07em; }
.br7-prose h2:first-child,.br7-prose h3:first-child,.br7-prose h4:first-child { margin-top:0; }
.br7-prose hr  { border:none; border-top:1.5px solid var(--br7-bdr); margin:16px 0; }
.br7-prose blockquote {
  border-left: 3px solid var(--br7-acc); padding: 11px 0 11px 18px;
  color: var(--br7-tx2); font-family: var(--br7-serif); font-style:italic;
  font-size: 15px; line-height: 1.78; margin: 12px 0;
  background: #fff8f5; border-radius: 0 9px 9px 0;
}
.br7-prose strong { font-weight:700; }
.br7-prose em     { font-style:italic; color:var(--br7-tx2); }
.br7-prose a      { color: var(--br7-acc); text-underline-offset:3px; }
.br7-prose code   {
  font-family: var(--br7-mono); font-size: 12.5px;
  background: #f4f4f6; border: 1px solid #e5e5ea;
  border-radius: 5px; padding: 2px 7px; color: #c0410c; letter-spacing:.02em;
}

/* ════════════════════════════════════════════
   CALLOUTS
════════════════════════════════════════════ */
.br7-callout {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 13px 17px; border-radius: 11px;
  border-left: 3px solid; font-size: 13.5px; line-height: 1.72;
  margin: 10px 0; animation: br7-slideR .25s ease both;
}
.br7-callout-icon { flex-shrink:0; font-size: 16px; margin-top: 1px; }
.br7-callout.info   { background: #eff6ff; border-color: #3b82f6; color: #1e3a8a; }
.br7-callout.warn   { background: #fffbeb; border-color: #f59e0b; color: #78350f; }
.br7-callout.tip    { background: #ecfdf5; border-color: #10b981; color: #064e3b; }
.br7-callout.danger { background: #fef2f2; border-color: #ef4444; color: #7f1d1d; }

/* ════════════════════════════════════════════
   KEY-VALUE GRID
════════════════════════════════════════════ */
.br7-kv-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:10px; margin:10px 0; }
.br7-kv-item {
  border: 1.5px solid var(--br7-bdr); border-radius: 11px;
  padding: 12px 14px; background: #fff;
  display: flex; flex-direction:column; gap:4px;
  transition: all .18s;
}
.br7-kv-item:hover { border-color: var(--br7-acc); background: #fff8f5; transform: translateY(-1px); }
.br7-kv-key { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--br7-tx4); }
.br7-kv-val { font-size:14px; font-weight:600; color:var(--br7-tx); line-height:1.4; }

/* ════════════════════════════════════════════
   VERDICT / SUMMARY BOX
════════════════════════════════════════════ */
.br7-verdict {
  display: flex; align-items: flex-start; gap: 14px;
  border: 2px solid var(--br7-bdr2); border-radius: 12px;
  padding: 16px 20px; margin-top: 14px; background: var(--br7-bg2);
}
.br7-verdict-icon { font-size: 22px; flex-shrink:0; }
.br7-verdict-label { font-size: 9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.09em; color:var(--br7-acc); margin-bottom:5px; }
.br7-verdict-text  { font-size: 13.5px; color: var(--br7-tx); line-height: 1.72; }

/* ════════════════════════════════════════════
   CURSOR (streaming)
════════════════════════════════════════════ */
.br7-cursor::after {
  content: '▋'; animation: br7-blink .65s step-end infinite;
  margin-left: 2px; color: var(--br7-acc);
}

/* ════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════ */
@media (max-width: 520px) {
  .br7-kv-grid { grid-template-columns: 1fr 1fr; }
}
`;
  document.head.appendChild(s);
})();

/* ─── 1. UTILITIES ───────────────────────────────────────────────────── */
const BR7 = {

  esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  /* Render KaTeX or fallback */
  katex(tex, display = false) {
    if (window.katex) {
      try { return window.katex.renderToString(tex, { displayMode: display, throwOnError: false }); }
      catch(e) {}
    }
    return display
      ? `<div style="font-family:monospace;color:#3730a3;padding:10px">\\[${this.esc(tex)}\\]</div>`
      : `<span style="font-family:monospace;color:#4338ca">\\(${this.esc(tex)}\\)</span>`;
  },

  /* Inline markdown → HTML with math support */
  inline(s) {
    if (!s) return '';
    s = this.esc(s);
    // Inline math \(...\) and $...$
    s = s.replace(/\\\((.+?)\\\)/g, (_, t) => this.katex(t, false));
    s = s.replace(/(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)/g, (_, t) => this.katex(t, false));
    // Markdown
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*\n]{1,160})\*/g, '<em>$1</em>');
    s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  },

  copy(text, btn) {
    const orig = btn.innerHTML;
    const ok = () => {
      btn.classList.add('copied'); btn.textContent = '✓ Copied';
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2200);
    };
    navigator.clipboard ? navigator.clipboard.writeText(text).then(ok).catch(ok)
                        : (this._fbCopy(text), ok());
  },

  _fbCopy(t) {
    const ta = document.createElement('textarea');
    ta.value = t; ta.style.cssText = 'position:fixed;top:-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  },

  /* ── Code block DOM ── */
  codeBlock(lang, code) {
    /* Special: mermaid → diagram card */
    if (lang === 'mermaid') return this.mermaidCard(code, 'Diagram');

    const wrap = this.el('div', 'br7-code-wrap');
    const bar  = this.el('div', 'br7-code-bar');

    // Dots
    const dots = this.el('div', 'br7-code-dots');
    dots.innerHTML = '<span class="br7-code-dot"></span><span class="br7-code-dot"></span><span class="br7-code-dot"></span>';

    const langEl = this.el('div', 'br7-code-lang', this.esc(lang || 'code'));

    const barLeft = this.el('div', '');
    barLeft.style.cssText = 'display:flex;align-items:center;gap:12px;';
    barLeft.appendChild(dots); barLeft.appendChild(langEl);

    const copyBtn = this.el('button', 'br7-code-copy', '📋 Copy');
    copyBtn.onclick = () => this.copy(code, copyBtn);

    bar.appendChild(barLeft); bar.appendChild(copyBtn);

    const pre = this.el('pre', 'br7-code-pre');
    const codeEl = this.el('code');
    if (lang) codeEl.className = `language-${lang}`;
    codeEl.textContent = code;
    try { if (window.hljs) window.hljs.highlightElement(codeEl); } catch(e) {}
    pre.appendChild(codeEl);

    wrap.appendChild(bar); wrap.appendChild(pre);
    return wrap;
  },

  /* ── Mermaid diagram card ── */
  mermaidCard(code, label, accent) {
    const card = this.el('div', 'br7-diagram-card');
    const hd   = this.el('div', 'br7-diagram-hd');
    const lbl  = this.el('div', 'br7-diagram-lbl');
    const dot  = this.el('span', 'br7-diagram-dot');
    if (accent) dot.style.background = accent;
    lbl.appendChild(dot);
    lbl.appendChild(document.createTextNode(label || 'Diagram'));

    const copyBtn = this.el('button', 'br7-btn', '📋 Code');
    copyBtn.onclick = () => this.copy(code, copyBtn);
    hd.appendChild(lbl); hd.appendChild(copyBtn);
    card.appendChild(hd);

    const body = this.el('div', 'br7-diagram-body');

    if (window.mermaid) {
      const uid = 'mmd_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
      window.mermaid.render(uid, code.trim()).then(r => {
        body.style.backgroundImage = 'radial-gradient(circle, #e5e5ea 1px, transparent 1px)';
        body.innerHTML = r.svg || r;
        const svg = body.querySelector('svg');
        if (svg) { svg.style.cssText = 'max-width:100%;height:auto;'; svg.removeAttribute('width'); }
      }).catch(() => {
        body.innerHTML = '';
        const fb = this.el('div', 'br7-diagram-fallback', this.esc(code));
        body.appendChild(fb);
      });
    } else {
      body.appendChild(this.el('div', 'br7-diagram-fallback', this.esc(code)));
    }
    card.appendChild(body);
    return card;
  },

  /* ── Display math block ── */
  mathBlock(tex) {
    const d = this.el('div', 'br7-math-block');
    d.innerHTML = this.katex(tex, true);
    return d;
  },

  /* ── Callout ── */
  callout(type, icon, text) {
    const d = this.el('div', `br7-callout ${type}`);
    d.innerHTML = `<span class="br7-callout-icon">${icon}</span><span>${this.inline(text)}</span>`;
    return d;
  },

  /* ── Parse fenced code blocks from markdown text ── */
  parseSegments(text) {
    const segs = []; let last = 0;
    const re = /```([\w-]*)\n?([\s\S]*?)```/g; let m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) segs.push({ type:'prose', content: text.slice(last, m.index) });
      segs.push({ type:'code', lang:(m[1]||'').toLowerCase(), content: m[2].trim() });
      last = re.lastIndex;
    }
    if (last < text.length) segs.push({ type:'prose', content: text.slice(last) });
    return segs;
  },

  /* ── Detect if line is a table ── */
  isTableSep(line) {
    return /^\s*\|?[\s:|-]+\|[\s:|-]+\|?[\s:|-]*$/.test(line||'');
  },

  parseTable(text) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].includes('|') && this.isTableSep(lines[i+1])) {
        const parseRow = l => l.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
        const headers = parseRow(lines[i]);
        let end = i + 2;
        while (end < lines.length && lines[end].includes('|') && lines[end].trim()) end++;
        const rows = lines.slice(i+2, end).filter(l => !/^\s*\|?[\s:|-]+\|/.test(l)).map(parseRow);
        if (headers.length && rows.length) return { headers, rows, start:i, end };
      }
    }
    return null;
  },

  tableDOM(tbl) {
    const wrap = this.el('div', 'br7-table-wrap');
    const t = this.el('table', 'br7-table');
    const thead = this.el('thead');
    const hr = this.el('tr');
    tbl.headers.forEach(h => { const th = this.el('th'); th.innerHTML = this.inline(h); hr.appendChild(th); });
    thead.appendChild(hr); t.appendChild(thead);
    const tbody = this.el('tbody');
    tbl.rows.forEach(row => {
      const tr = this.el('tr');
      tbl.headers.forEach((_, ci) => {
        const td = this.el('td'); td.innerHTML = this.inline(row[ci]||''); tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody); wrap.appendChild(t);
    return wrap;
  },

  /* ── Full prose renderer — handles all markdown patterns ── */
  proseDOM(text, accentColor) {
    const div = this.el('div', 'br7-prose');
    if (accentColor) div.style.setProperty('--br7-acc', accentColor);
    const lines = text.split('\n');
    let i = 0;
    let curList = null, listTag = '';
    const flush = () => { curList = null; listTag = ''; };
    const push = el => { flush(); div.appendChild(el); };

    while (i < lines.length) {
      const raw = lines[i], t = raw.trim(); i++;
      if (!t) { flush(); continue; }

      /* Display math $$...$$ */
      if (t.startsWith('$$') && !t.endsWith('$$')) {
        const mLines = [t.slice(2)];
        while (i < lines.length && !lines[i].trim().endsWith('$$')) { mLines.push(lines[i]); i++; }
        if (i < lines.length) { const last = lines[i].trim(); mLines.push(last.slice(0,-2)); i++; }
        push(this.mathBlock(mLines.join('\n').trim()));
        continue;
      }
      if (t === '$$' || (t.startsWith('$$') && t.endsWith('$$') && t.length > 4)) {
        const tex = t === '$$' ? '' : t.slice(2,-2).trim();
        push(this.mathBlock(tex)); continue;
      }
      /* Display math \[...\] */
      if (t === '\\[') {
        const mLines = [];
        while (i < lines.length && lines[i].trim() !== '\\]') { mLines.push(lines[i]); i++; }
        i++; push(this.mathBlock(mLines.join('\n').trim())); continue;
      }

      /* Callouts */
      if (/^⚠️\s*|^warning:\s*/i.test(t)) { push(this.callout('warn','⚠️', t.replace(/^⚠️\s*|^warning:\s*/i,''))); continue; }
      if (/^💡\s*|^tip:\s*/i.test(t))     { push(this.callout('tip','💡', t.replace(/^💡\s*|^tip:\s*/i,''))); continue; }
      if (/^ℹ️\s*|^note:\s*/i.test(t))    { push(this.callout('info','ℹ️', t.replace(/^ℹ️\s*|^note:\s*/i,''))); continue; }
      if (/^🚨\s*|^danger:\s*/i.test(t))  { push(this.callout('danger','🚨', t.replace(/^🚨\s*|^danger:\s*/i,''))); continue; }

      /* Blockquote */
      if (/^> /.test(t)) { const bq = this.el('blockquote'); bq.innerHTML = this.inline(t.slice(2)); push(bq); continue; }

      /* HR */
      if (/^---+$/.test(t)) { push(this.el('hr')); continue; }

      /* Headings */
      const hm = t.match(/^(#{1,4})\s+(.+)$/);
      if (hm) {
        const tag = ['h2','h2','h3','h4'][hm[1].length-1]||'h4';
        const h = this.el(tag); h.innerHTML = this.inline(hm[2]); push(h); continue;
      }

      /* Tables */
      if (t.includes('|') && i < lines.length && this.isTableSep(lines[i])) {
        const parseRow = l => l.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
        const headers = parseRow(t); i++;
        const rows = [];
        while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
          if (!this.isTableSep(lines[i])) rows.push(parseRow(lines[i]));
          i++;
        }
        if (rows.length) push(this.tableDOM({ headers, rows }));
        continue;
      }

      /* Unordered list */
      if (/^[-*•]\s/.test(t)) {
        if (listTag !== 'UL') { flush(); curList = this.el('ul'); listTag='UL'; div.appendChild(curList); }
        const li = this.el('li'); li.innerHTML = this.inline(t.replace(/^[-*•]\s+/,'')); curList.appendChild(li); continue;
      }

      /* Ordered list */
      if (/^\d+[.)]\s/.test(t)) {
        if (listTag !== 'OL') { flush(); curList = this.el('ol'); listTag='OL'; div.appendChild(curList); }
        const li = this.el('li'); li.innerHTML = this.inline(t.replace(/^\d+[.)]\s+/,'')); curList.appendChild(li); continue;
      }

      flush();
      /* Paragraph — collect lines */
      const paras = [t];
      while (i < lines.length) {
        const nt = lines[i].trim();
        if (!nt || /^(#{1,4}\s|[-*•]\s|\d+[.)]\s|---+$|> |\$\$|\\\[)/.test(nt)) break;
        if (nt.includes('|') && i+1 < lines.length && this.isTableSep(lines[i+1])) break;
        paras.push(nt); i++;
      }
      const p = this.el('p'); p.innerHTML = this.inline(paras.join(' ')); div.appendChild(p);
    }
    return div;
  },

  /* ── Card shell ── */
  cardShell(label, color, bgColor, borderColor, icon, title) {
    const card = this.el('div', 'br7-card br7');
    if (color) card.style.setProperty('--br7-acc', color);

    const hd = this.el('div', 'br7-hd');
    const left = this.el('div', 'br7-hd-left');

    const badge = this.el('div', 'br7-type-badge');
    badge.style.cssText = `background:${bgColor||'#fff1eb'};color:${color||'#e8622a'};border-color:${borderColor||'#ffd0b8'};`;
    badge.innerHTML = `<span>${icon||'◈'}</span> ${this.esc(label||'Response')}`;

    left.appendChild(badge);

    if (title) {
      const t = this.el('div', 'br7-hd-title'); t.textContent = title; left.appendChild(t);
    }

    const right = this.el('div', 'br7-hd-right');
    const pid = 'br7_' + Date.now();
    const copyBtn = this.el('button', 'br7-btn');
    copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`;
    copyBtn.onclick = () => {
      const el = document.getElementById(pid);
      this.copy(el ? el.innerText : '', copyBtn);
    };
    right.appendChild(copyBtn);

    hd.appendChild(left); hd.appendChild(right);
    card.appendChild(hd);

    return { card, pid };
  },

  dlRow(pid, label) {
    const row = this.el('div', 'br7-dl-row');
    const dlTxt = this.el('button', 'br7-dl-btn br7-dl-dark');
    dlTxt.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt`;
    dlTxt.onclick = () => {
      const el = document.getElementById(pid);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([el ? el.innerText : ''], { type:'text/plain' }));
      a.download = `stremini-${label||'response'}-${Date.now()}.txt`;
      a.click();
    };
    const dlMd = this.el('button', 'br7-dl-btn br7-dl-ghost');
    dlMd.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Markdown`;
    dlMd.onclick = () => {
      const el = document.getElementById(pid);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([el ? el.innerText : ''], { type:'text/markdown' }));
      a.download = `stremini-${label||'response'}-${Date.now()}.md`;
      a.click();
    };
    row.appendChild(dlTxt); row.appendChild(dlMd);
    return row;
  },
};

/* ─── 2. DOMAIN CONFIG ───────────────────────────────────────────────── */
const DOMAIN_CFG = {
  math:        { label:'Math Solution',     icon:'∑',   color:'#4338ca', bg:'#eef2ff', bdr:'#c7d2fe' },
  code:        { label:'Code',              icon:'</>',  color:'#7c3aed', bg:'#f5f3ff', bdr:'#ddd6fe' },
  research:    { label:'Research',          icon:'◈',    color:'#c26a1a', bg:'#fff7ed', bdr:'#fed7aa' },
  data:        { label:'Data Intelligence', icon:'◉',    color:'#0369a1', bg:'#e0f2fe', bdr:'#bae6fd' },
  finance:     { label:'Financial',         icon:'$',    color:'#15803d', bg:'#dcfce7', bdr:'#86efac' },
  architect:   { label:'Architecture',      icon:'⬡',    color:'#c2410c', bg:'#ffedd5', bdr:'#fdba74' },
  competitive: { label:'Intel Report',      icon:'◎',    color:'#6d28d9', bg:'#f5f3ff', bdr:'#c4b5fd' },
  growth:      { label:'Growth Strategy',   icon:'↑',    color:'#b45309', bg:'#fef3c7', bdr:'#fde68a' },
  legal:       { label:'Legal',             icon:'⚖',    color:'#be123c', bg:'#ffe4e6', bdr:'#fda4af' },
  concept:     { label:'Concept',           icon:'💡',   color:'#0d9488', bg:'#ccfbf1', bdr:'#5eead4' },
  general:     { label:'StreminiAI',        icon:'S',    color:'#e8622a', bg:'#fff1eb', bdr:'#ffd0b8' },
};

/* ─── 3. OUTPUT TYPE DETECTOR ────────────────────────────────────────── */
function detectType(query, text) {
  const q = (query||'').toLowerCase();
  const t = text||'';
  const fences = (t.match(/```/g)||[]).length;
  if (fences >= 2 && !/```mermaid/i.test(t)) {
    const langs = t.match(/```(\w+)/g)||[];
    if (langs.some(l => /mermaid/.test(l))) {} else return 'code';
  }
  const isMathQ = /\b(solve|calculate|compute|prove|integral|derivative|equation|formula|simplify|differentiate|integrate|theorem|lemma|algebra|calculus|matrix|eigenvalue|probability|statistics|permutation|binomial|limit|series|trigonometry|logarithm)\b/.test(q);
  if (isMathQ || /\$\$.+?\$\$|\\\[.+?\\\]/s.test(t)) return 'math';
  if (/\b(vs\.?|versus|compare|which is better|pros and cons|difference between)\b/i.test(q)) return 'comparison';
  if (/\|[\s-]+\|/.test(t)) return 'table';
  if (/\b(how to|step.?by.?step|tutorial|guide|setup|install|configure|deploy)\b/.test(q)) return 'steps';
  const stepLines = (t.match(/^(Step\s*\d+|\d+[.)]\s+\*\*)/gm)||[]).length;
  if (stepLines >= 2) return 'steps';
  if (/\b(diagnose|debug|troubleshoot|not working|root cause)\b/.test(q)) return 'diagnosis';
  if (/\b(list|top \d+|best \d+|recommend|suggest|give me examples)\b/.test(q) || (t.match(/^\d+\.\s+\*\*/gm)||[]).length >= 3) return 'list';
  const h2count = (t.match(/^## /gm)||[]).length;
  if (h2count >= 2 || t.length > 700) return 'research';
  return 'chat';
}

/* ─── 4. SECTION SPLITTER ────────────────────────────────────────────── */
function splitSections(text) {
  const lines = text.split('\n');
  const sections = [];
  let cur = { title: null, lines: [] };
  for (const raw of lines) {
    const t = raw.trim();
    const hm = t.match(/^(#{2,3})\s+(.+)$/);
    if (hm) {
      if (cur.lines.join('').trim() || cur.title) sections.push(cur);
      cur = { title: hm[2].trim(), lines: [] };
    } else {
      cur.lines.push(raw);
    }
  }
  if (cur.lines.join('').trim() || cur.title) sections.push(cur);
  return sections;
}

/* ─── 5. STEP PARSER ─────────────────────────────────────────────────── */
function parseSteps(text) {
  const steps = [];
  const re = /^(?:Step\s*(\d+)\s*[—–:\-]+\s*(.+)|(\d+)[.)]\s+(?:\*\*([^*]+)\*\*[:\s\-–]*(.+)?|(.+)))([\s\S]*?)(?=^(?:Step\s*\d+|(?:\d+)[.)]\s)|$)/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    const num   = m[1]||m[3]||'?';
    const title = (m[2]||m[4]||m[6]||'').trim();
    const extra = (m[5]||'').trim();
    const rest  = (m[7]||'').trim();
    if (title) steps.push({ num, title, body: (extra + (extra&&rest?' ':'')+rest).trim() });
  }
  return steps.length >= 2 ? steps : [];
}

/* ─── 6. LIST PARSER ─────────────────────────────────────────────────── */
function parseListItems(text) {
  const items = []; let i = 0;
  const lines = text.split('\n');
  while (i < lines.length) {
    const l = lines[i].trim();
    const nm = l.match(/^(\d+)[.)]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|(.+))$/);
    if (nm) {
      const title = (nm[2]||nm[4]||'').trim();
      let sub = (nm[3]||'').trim(); i++;
      while (i < lines.length && /^\s{2,}/.test(lines[i]) && !/^\d+[.)]\s/.test(lines[i].trim())) {
        sub += (sub?' ':'') + lines[i].trim().replace(/^[-–•]\s*/,''); i++;
      }
      if (title) items.push({ num:nm[1], title, sub }); continue;
    }
    const bm = l.match(/^[-*•]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|([^:]+):\s*(.+)|(.+))$/);
    if (bm) {
      const title = (bm[1]||bm[3]||bm[5]||'').trim();
      const sub   = (bm[2]||bm[4]||'').trim(); i++;
      if (title) items.push({ title, sub }); continue;
    }
    i++;
  }
  return items;
}

/* ─── 7. AUTO MERMAID GENERATOR ──────────────────────────────────────── */
function autoMermaid(text, query) {
  const q = (query||'').toLowerCase();
  const sanitize = s => '"' + String(s||'').replace(/["`{}\[\]]/g,"'").trim().slice(0,38) + '"';

  /* Steps → flowchart */
  const steps = parseSteps(text);
  if (steps.length >= 3) {
    let code = 'flowchart TD\n';
    steps.forEach((s,i) => {
      const safe = sanitize(s.title);
      const shape = i===0||i===steps.length-1 ? `([${safe}])` : `[${safe}]`;
      code += `  S${i}${shape}\n`;
      if (i < steps.length-1) code += `  S${i} --> S${i+1}\n`;
    });
    return { code, label:'Process Flow' };
  }

  /* Headings → mindmap */
  const h2s = [...text.matchAll(/^## (.+)$/gm)].map(m => m[1].trim()).slice(0,6);
  if (h2s.length >= 3 && /\b(explain|concept|overview|what is|how does)\b/.test(q)) {
    const topic = query.replace(/\b(explain|what is|how does|tell me about)\b/gi,'').trim().slice(0,28) || 'Overview';
    let code = `mindmap\n  root((${sanitize(topic)}))\n`;
    h2s.forEach(h => { code += `    ${sanitize(h)}\n`; });
    return { code, label:'Concept Map' };
  }

  /* Architecture keywords → layered diagram */
  if (/\b(architect|system design|pipeline|infrastructure|backend|microservice)\b/.test(q)) {
    const comps = [...text.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*(?:Service|Layer|Module|DB|Cache|Queue|API|Gateway)\b/g)]
      .map(m => m[0].trim()).filter((v,i,a)=>a.indexOf(v)===i).slice(0,6);
    if (comps.length >= 3) {
      let code = 'flowchart TB\n  Client([Client])\n';
      comps.forEach((c,i) => { code += `  N${i}[${sanitize(c)}]\n`; });
      comps.forEach((_,i) => { if (i===0) code += `  Client --> N0\n`; else code += `  N${i-1} --> N${i}\n`; });
      return { code, label:'System Architecture' };
    }
  }

  return null;
}

/* ─── 8. RENDERERS ───────────────────────────────────────────────────── */

/* MATH */
async function renderMath(text, domain) {
  const cfg = DOMAIN_CFG.math;
  const { card, pid } = BR7.cardShell(cfg.label, cfg.color, cfg.bg, cfg.bdr, cfg.icon, '');

  const body = BR7.el('div', ''); body.id = pid;
  const sections = splitSections(text);

  for (const sec of sections) {
    const secText = sec.lines.join('\n');
    const isAnswer  = /^(answer|final\s*answer|the\s*answer)$/i.test(sec.title||'');
    const isVerify  = /^(verification?|verify|check)$/i.test(sec.title||'');
    const isSolution= /^(solution|solve|proof|derivation)$/i.test(sec.title||'');

    const secEl = BR7.el('div', 'br7-section');

    if (sec.title) {
      const hd  = BR7.el('div', 'br7-sec-hd');
      const bar = BR7.el('span', 'br7-sec-bar');
      bar.style.background = isAnswer ? '#059669' : isVerify ? '#2563eb' : cfg.color;
      const lbl = BR7.el('span', 'br7-sec-label', sec.title);
      const chev = BR7.el('span', 'br7-chevron open');
      chev.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
      hd.appendChild(bar); hd.appendChild(lbl); hd.appendChild(chev);
      const bd = BR7.el('div', 'br7-sec-body');
      buildMathBody(secText, bd, isAnswer, isVerify, cfg.color);
      secEl.appendChild(hd); secEl.appendChild(bd);
      hd.onclick = () => { const open = bd.classList.toggle('collapsed'); chev.classList.toggle('open', !open); };
    } else {
      const bd = BR7.el('div', 'br7-sec-body');
      buildMathBody(secText, bd, false, false, cfg.color);
      secEl.appendChild(bd);
    }
    body.appendChild(secEl);
  }

  card.appendChild(body); card.appendChild(BR7.dlRow(pid, 'math'));
  const root = BR7.el('div', 'br7'); root.appendChild(card); return root;
}

function buildMathBody(text, container, isAnswer, isVerify, accent) {
  const isMath = t => /[=+\-*/^]/.test(t) && t.length < 240;
  const lines = text.split('\n'); let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim(); i++;
    if (!t) continue;

    /* Display math $$...$$ */
    if (t.startsWith('$$')) {
      const tex = t === '$$' ? '' : t.slice(2, t.endsWith('$$') ? -2 : undefined).trim();
      const mLines = tex ? [tex] : [];
      if (!tex) { while (i < lines.length && !lines[i].trim().endsWith('$$')) { mLines.push(lines[i]); i++; } if(i<lines.length){const last=lines[i].trim();mLines.push(last.slice(0,-2));i++;} }
      const box = BR7.el('div', 'br7-math-block');
      box.innerHTML = BR7.katex(mLines.join('\n').trim(), true);
      container.appendChild(box); continue;
    }

    /* \[ display math */
    if (t === '\\[') {
      const mLines = [];
      while (i < lines.length && lines[i].trim() !== '\\]') { mLines.push(lines[i]); i++; }
      i++;
      const box = BR7.el('div', 'br7-math-block');
      box.innerHTML = BR7.katex(mLines.join('\n').trim(), true);
      container.appendChild(box); continue;
    }

    /* Final answer box */
    if (isAnswer && isMath(t)) {
      const aLines = [t];
      while (i < lines.length && isMath(lines[i].trim())) { aLines.push(lines[i].trim()); i++; }
      const box = BR7.el('div', 'br7-math-answer');
      const lbl = BR7.el('div', 'br7-math-answer-lbl', 'Final Answer');
      const val = BR7.el('div', '');
      val.innerHTML = BR7.katex(aLines.join(' \\ ').trim(), true);
      box.appendChild(lbl); box.appendChild(val);
      container.appendChild(box); continue;
    }

    /* Math step */
    if (/^(Step|step)\s*\d+/.test(t) || /^\d+[.)]\s/.test(t)) {
      const sm = t.match(/^(?:Step\s*(\d+)\s*[—–:\-]+\s*(.+)|(\d+)[.)]\s+(.+))$/i);
      const num = sm ? (sm[1]||sm[3]||'?') : '?';
      const title = sm ? (sm[2]||sm[4]||t).trim() : t;
      const exprLines = [];
      while (i < lines.length && lines[i].trim() && !/^Step\s*\d+/i.test(lines[i].trim()) && !/^\d+[.)]\s/.test(lines[i].trim())) {
        exprLines.push(lines[i].trim()); i++;
      }
      const step = BR7.el('div', 'br7-math-step');
      const numEl = BR7.el('div', 'br7-math-step-num', num);
      const bdy = BR7.el('div', 'br7-math-step-body');
      bdy.appendChild(BR7.el('div', 'br7-math-step-title', BR7.inline(title)));
      if (exprLines.length) {
        const expr = BR7.el('div', 'br7-math-step-expr');
        expr.innerHTML = BR7.katex(exprLines.join('\n'), exprLines.length > 1);
        bdy.appendChild(expr);
      }
      step.appendChild(numEl); step.appendChild(bdy);
      container.appendChild(step); continue;
    }

    /* Inline math or prose */
    if (isMath(t)) {
      const box = BR7.el('div', 'br7-math-block');
      box.innerHTML = BR7.katex(t, true);
      container.appendChild(box); continue;
    }

    /* Prose */
    const para = BR7.el('p'); para.style.cssText = 'font-size:14px;line-height:1.82;color:var(--br7-tx);margin:0 0 8px';
    para.innerHTML = BR7.inline(t);
    container.appendChild(para);
  }
}

/* CODE */
async function renderCode(text, domain) {
  const cfg = DOMAIN_CFG[domain]||DOMAIN_CFG.code;
  const { card, pid } = BR7.cardShell(cfg.label, cfg.color, cfg.bg, cfg.bdr, cfg.icon, '');
  const body = BR7.el('div', ''); body.id = pid; body.style.padding = '20px';
  BR7.parseSegments(text).forEach(s => {
    if (s.type === 'code') body.appendChild(BR7.codeBlock(s.lang, s.content));
    else if (s.content.trim()) body.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
  });
  card.appendChild(body); card.appendChild(BR7.dlRow(pid, 'code'));
  const root = BR7.el('div', 'br7'); root.appendChild(card); return root;
}

/* STEPS */
async function renderSteps(text, domain, query) {
  const cfg = DOMAIN_CFG[domain]||DOMAIN_CFG.general;
  const { card, pid } = BR7.cardShell(`${cfg.label} — Guide`, cfg.color, cfg.bg, cfg.bdr, '📋', '');

  /* Intro */
  const firstStep = text.search(/^(Step\s*\d+|\d+[.)]\s)/m);
  if (firstStep > 0) {
    const intro = text.slice(0, firstStep).trim();
    if (intro) { const s = BR7.el('div', 'br7-summary'); s.innerHTML = BR7.inline(intro); card.appendChild(s); }
  }

  /* Auto flowchart */
  const diag = autoMermaid(text, query);
  if (diag) {
    const dWrap = BR7.el('div', ''); dWrap.style.padding = '16px 20px 4px';
    dWrap.appendChild(BR7.mermaidCard(diag.code, diag.label, cfg.color));
    card.appendChild(dWrap);
  }

  const body = BR7.el('div', ''); body.id = pid; body.style.padding = '18px 20px 22px';
  const steps = parseSteps(text);

  if (steps.length >= 2) {
    const wrap = BR7.el('div', 'br7-steps');
    steps.forEach(step => {
      const item = BR7.el('div', 'br7-step');
      const rail = BR7.el('div', 'br7-step-rail');
      const num  = BR7.el('div', 'br7-step-num', step.num);
      num.style.background = cfg.color;
      num.style.boxShadow  = `0 4px 14px ${cfg.color}55`;
      rail.appendChild(num); rail.appendChild(BR7.el('div', 'br7-step-line'));
      const bdy = BR7.el('div', 'br7-step-body');
      bdy.appendChild(BR7.el('div', 'br7-step-title', BR7.inline(step.title)));
      if (step.body) {
        if (/```/.test(step.body)) {
          BR7.parseSegments(step.body).forEach(s => {
            if (s.type==='code') bdy.appendChild(BR7.codeBlock(s.lang, s.content));
            else if (s.content.trim()) bdy.appendChild(BR7.el('div', 'br7-step-desc', BR7.inline(s.content.trim())));
          });
        } else {
          bdy.appendChild(BR7.el('div', 'br7-step-desc', BR7.inline(step.body.replace(/\n/g,' '))));
        }
      }
      item.appendChild(rail); item.appendChild(bdy); wrap.appendChild(item);
    });
    body.appendChild(wrap);
  } else {
    BR7.parseSegments(text).forEach(s => {
      if (s.type==='code') body.appendChild(BR7.codeBlock(s.lang, s.content));
      else if (s.content.trim()) body.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
    });
  }

  card.appendChild(body); card.appendChild(BR7.dlRow(pid, 'guide'));
  const root = BR7.el('div', 'br7'); root.appendChild(card); return root;
}

/* LIST */
async function renderList(text, domain) {
  const cfg = DOMAIN_CFG[domain]||DOMAIN_CFG.general;
  const items = parseListItems(text);
  const { card, pid } = BR7.cardShell(cfg.label, cfg.color, cfg.bg, cfg.bdr, cfg.icon, '');

  const firstBullet = text.search(/^(\d+[.)]\s|[-*•]\s)/m);
  if (firstBullet > 0) {
    const intro = text.slice(0, firstBullet).trim();
    if (intro) { const s = BR7.el('div', 'br7-summary'); s.innerHTML = BR7.inline(intro); card.appendChild(s); }
  }

  const body = BR7.el('div', ''); body.id = pid; body.style.padding = '16px 20px 20px';

  if (items.length >= 2) {
    const wrap = BR7.el('div', 'br7-list');
    items.forEach((item, idx) => {
      const el  = BR7.el('div', 'br7-list-item');
      const num = BR7.el('div', 'br7-list-num', item.num || String(idx+1));
      num.style.cssText = `background:${cfg.bg};color:${cfg.color};border-color:${cfg.bdr};`;
      const content = BR7.el('div', '');
      if (item.title) content.appendChild(BR7.el('div', 'br7-list-title', BR7.inline(item.title)));
      if (item.sub)   content.appendChild(BR7.el('div', 'br7-list-sub',   BR7.inline(item.sub)));
      el.appendChild(num); el.appendChild(content); wrap.appendChild(el);
    });
    body.appendChild(wrap);
  } else {
    body.appendChild(BR7.proseDOM(text, cfg.color));
  }

  card.appendChild(body); card.appendChild(BR7.dlRow(pid, 'list'));
  const root = BR7.el('div', 'br7'); root.appendChild(card); return root;
}

/* RESEARCH / GENERIC LONG FORM */
async function renderResearch(text, domain, query) {
  const cfg = DOMAIN_CFG[domain]||DOMAIN_CFG.general;
  const { card, pid } = BR7.cardShell(cfg.label, cfg.color, cfg.bg, cfg.bdr, cfg.icon, '');

  /* Auto diagram */
  const diag = autoMermaid(text, query);
  if (diag) {
    const dWrap = BR7.el('div', ''); dWrap.style.padding = '16px 20px 4px';
    dWrap.appendChild(BR7.mermaidCard(diag.code, diag.label, cfg.color));
    card.appendChild(dWrap);
  }

  const body = BR7.el('div', ''); body.id = pid;
  const sections = splitSections(text);

  sections.forEach(sec => {
    const secEl = BR7.el('div', 'br7-section');

    if (sec.title) {
      const hd  = BR7.el('div', 'br7-sec-hd');
      const bar = BR7.el('span', 'br7-sec-bar');
      bar.style.background = cfg.color;
      const lbl  = BR7.el('span', 'br7-sec-label', sec.title);
      const chev = BR7.el('span', 'br7-chevron open');
      chev.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
      hd.appendChild(bar); hd.appendChild(lbl); hd.appendChild(chev);
      const bd = BR7.el('div', 'br7-sec-body');
      const secText = sec.lines.join('\n');
      BR7.parseSegments(secText).forEach(s => {
        if (s.type==='code') bd.appendChild(BR7.codeBlock(s.lang, s.content));
        else if (s.content.trim()) bd.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
      });
      secEl.appendChild(hd); secEl.appendChild(bd);
      hd.onclick = () => { const open = bd.classList.toggle('collapsed'); chev.classList.toggle('open', !open); };
    } else {
      const bd = BR7.el('div', 'br7-sec-body');
      const secText = sec.lines.join('\n');
      BR7.parseSegments(secText).forEach(s => {
        if (s.type==='code') bd.appendChild(BR7.codeBlock(s.lang, s.content));
        else if (s.content.trim()) bd.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
      });
      secEl.appendChild(bd);
    }
    body.appendChild(secEl);
  });

  card.appendChild(body); card.appendChild(BR7.dlRow(pid, domain||'report'));
  const root = BR7.el('div', 'br7'); root.appendChild(card); return root;
}

/* COMPARISON */
async function renderComparison(text, domain) {
  const cfg = DOMAIN_CFG[domain]||DOMAIN_CFG.general;
  const { card, pid } = BR7.cardShell('Comparison', cfg.color, cfg.bg, cfg.bdr, '⚖', '');

  const body = BR7.el('div', ''); body.id = pid; body.style.padding = '18px 20px';
  const tbl  = BR7.parseTable(text);

  if (tbl) {
    const allLines = text.split('\n');
    const pre  = allLines.slice(0, tbl.start).join('\n').trim();
    const post = allLines.slice(tbl.end).join('\n').trim();
    if (pre) { const s = BR7.el('div', 'br7-summary'); s.innerHTML = BR7.inline(pre); card.appendChild(s); }
    body.appendChild(BR7.tableDOM(tbl));
    if (post) {
      const v = BR7.el('div', 'br7-verdict');
      v.innerHTML = `<span class="br7-verdict-icon">—</span><div><div class="br7-verdict-label" style="color:${cfg.color}">Verdict</div><div class="br7-verdict-text">${BR7.inline(post.replace(/^#+\s*/gm,'').trim())}</div></div>`;
      body.appendChild(v);
    }
  } else {
    BR7.parseSegments(text).forEach(s => {
      if (s.type==='code') body.appendChild(BR7.codeBlock(s.lang, s.content));
      else if (s.content.trim()) body.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
    });
  }

  card.appendChild(body); card.appendChild(BR7.dlRow(pid, 'comparison'));
  const root = BR7.el('div', 'br7'); root.appendChild(card); return root;
}

/* CHAT (short, no card) */
async function renderChat(text, domain) {
  const cfg = DOMAIN_CFG[domain]||DOMAIN_CFG.general;
  const root = BR7.el('div', 'br7');
  root.style.setProperty('--br7-acc', cfg.color);

  if (text.length < 200 && !/```/.test(text)) {
    /* Short: just styled prose, no card */
    const wrap = BR7.el('div', '');
    wrap.appendChild(BR7.proseDOM(text, cfg.color));
    root.appendChild(wrap);
    return root;
  }

  /* Medium: card without heavy section splits */
  const { card, pid } = BR7.cardShell(cfg.label, cfg.color, cfg.bg, cfg.bdr, cfg.icon, '');
  const body = BR7.el('div', ''); body.id = pid; body.style.padding = '18px 22px';
  BR7.parseSegments(text).forEach(s => {
    if (s.type==='code') body.appendChild(BR7.codeBlock(s.lang, s.content));
    else if (s.content.trim()) body.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
  });
  card.appendChild(body);
  root.appendChild(card);
  return root;
}

/* ─── 9. MAIN ENTRY POINTS ───────────────────────────────────────────── */

/**
 * renderOutput(userQuery, responseText, container, domain, isStreaming)
 * Drop-in replacement for window.StreminiRenderer.render(...)
 */
async function renderOutput(userQuery, responseText, container, domain, isStreaming) {
  /* Streaming: fast prose preview with cursor */
  if (isStreaming) {
    const cfg = DOMAIN_CFG[domain]||DOMAIN_CFG.general;
    const root = BR7.el('div', 'br7 br7-cursor');
    root.style.setProperty('--br7-acc', cfg.color);
    const wrap = BR7.el('div', '');
    BR7.parseSegments(responseText).forEach(s => {
      if (s.type==='code') wrap.appendChild(BR7.codeBlock(s.lang, s.content));
      else if (s.content.trim()) wrap.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
    });
    root.appendChild(wrap);
    if (container) { container.innerHTML = ''; container.appendChild(root); }
    return root;
  }

  const dom = domain || 'general';
  const type = detectType(userQuery, responseText);
  let el;

  try {
    switch(type) {
      case 'math':       el = await renderMath(responseText, dom); break;
      case 'code':       el = await renderCode(responseText, dom); break;
      case 'steps':      el = await renderSteps(responseText, dom, userQuery); break;
      case 'comparison': el = await renderComparison(responseText, dom); break;
      case 'table':      el = await renderComparison(responseText, dom); break;
      case 'list':       el = await renderList(responseText, dom); break;
      case 'research':   el = await renderResearch(responseText, dom, userQuery); break;
      case 'diagnosis':  el = await renderResearch(responseText, dom, userQuery); break;
      default:           el = await renderChat(responseText, dom); break;
    }
  } catch(err) {
    console.warn('[BR7] Render error:', err);
    el = await renderChat(responseText, dom);
  }

  if (container) { container.innerHTML = ''; container.appendChild(el); }

  /* KaTeX post-pass */
  if (window.renderMathInElement) {
    try {
      renderMathInElement(container || el, {
        delimiters: [
          { left:'$$',  right:'$$',  display:true  },
          { left:'\\[', right:'\\]', display:true  },
          { left:'$',   right:'$',   display:false },
          { left:'\\(', right:'\\)', display:false },
        ],
        throwOnError: false,
      });
    } catch(e) {}
  }

  return el;
}

/* Streaming helpers — compatible with index.html */
function updateStream(text, container) {
  const cfg = DOMAIN_CFG.general;
  const root = BR7.el('div', 'br7 br7-cursor');
  const wrap = BR7.el('div', '');
  BR7.parseSegments(text).forEach(s => {
    if (s.type==='code') wrap.appendChild(BR7.codeBlock(s.lang, s.content));
    else if (s.content.trim()) wrap.appendChild(BR7.proseDOM(s.content.trim(), cfg.color));
  });
  root.appendChild(wrap);
  if (container) { container.innerHTML = ''; container.appendChild(root); }
}

async function finalizeStream(userQuery, fullText, container, domain) {
  if (!container) return;
  await renderOutput(userQuery, fullText, container, domain||'general', false);
}

/* ─── 10. PUBLIC API (mirrors StreminiRenderer) ──────────────────────── */
window.StreminiRenderer = {
  render:         renderOutput,
  updateStream,
  finalizeStream,
  detectType,
  DOMAIN_CFG,
  BR7,
};

/* ─── 11. PATCH index.html's renderMd + postRender ──────────────────── */
/*
   The renderer above is self-contained but your index.html also calls
   renderMd() and postRender() inline. Patch those so mermaid diagrams
   in plain markdown responses also look beautiful.
*/
(function patchInlineRenderer() {
  const _origRenderMd = window.renderMd;
  if (typeof _origRenderMd !== 'function') return; /* loaded before app.js – nothing to patch yet */

  window.renderMd = function(raw) {
    if (!raw) return '';
    /* Let the original produce HTML, then we'll post-process it */
    return _origRenderMd(raw);
  };
})();

/* Improve postRender to run KaTeX more aggressively */
const _origPostRender = window.postRender;
window.postRender = function(el) {
  if (_origPostRender) _origPostRender(el);
  if (!el) return;

  /* Re-run mermaid on any unwrapped mermaid pres */
  el.querySelectorAll('pre.mermaid:not([data-processed="true"])').forEach(pre => {
    const code = pre.textContent.trim();
    if (!code || !window.mermaid) return;
    pre.setAttribute('data-processed','true');

    let wrap = pre.closest('.mermaid-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'br7-diagram-card';
      const hd   = document.createElement('div'); hd.className = 'br7-diagram-hd';
      const lbl  = document.createElement('div'); lbl.className = 'br7-diagram-lbl';
      const dot  = document.createElement('span'); dot.className = 'br7-diagram-dot';
      lbl.appendChild(dot); lbl.appendChild(document.createTextNode('Diagram'));
      hd.appendChild(lbl); wrap.appendChild(hd);
      const body = document.createElement('div'); body.className = 'br7-diagram-body';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(body);
    }

    const body = wrap.querySelector('.br7-diagram-body') || wrap;
    const uid = 'mmd_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    window.mermaid.render(uid, code).then(r => {
      body.innerHTML = r.svg || r;
      const svg = body.querySelector('svg');
      if (svg) { svg.style.cssText = 'max-width:100%;height:auto;'; svg.removeAttribute('width'); }
      body.style.backgroundImage = 'radial-gradient(circle, #e5e5ea 1px, transparent 1px)';
      body.style.backgroundSize  = '24px 24px';
      body.style.backgroundColor = '#fafafa';
    }).catch(() => {
      body.innerHTML = `<div class="br7-diagram-fallback">${BR7.esc(code)}</div>`;
    });
  });

  /* KaTeX pass */
  if (window.renderMathInElement) {
    try {
      renderMathInElement(el, {
        delimiters: [
          { left:'$$', right:'$$', display:true },
          { left:'\\[', right:'\\]', display:true },
          { left:'$', right:'$', display:false },
          { left:'\\(', right:'\\)', display:false },
        ],
        throwOnError: false,
      });
    } catch(e) {}
  }
};

console.log('[StreminiRenderer v7] Beautiful renderer loaded ✓');
