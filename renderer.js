/* ═══════════════════════════════════════════════════════════════
   STREMINI AI — UNIFIED STRUCTURED RENDERER v4.0
   Handles: Code · Math · Research · Data · Finance · Architecture
            Competitive Intel · Growth · Legal · Concepts · General
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   DOMAIN → RENDERER MAPPING
───────────────────────────────────────── */
const DOMAIN_CONFIG = {
  math:        { badge: '∑ Math',          color: '#0369a1', bg: '#e0f2fe', bdr: '#bae6fd', icon: '∑' },
  code:        { badge: '⌨ Code',          color: '#7c3aed', bg: '#f5f3ff', bdr: '#ddd6fe', icon: '</>' },
  research:    { badge: '◈ Research',      color: '#b45309', bg: '#fffbf5', bdr: '#fde68a', icon: '📄' },
  data:        { badge: '📊 Data Intel',   color: '#1d4ed8', bg: '#eff6ff', bdr: '#bfdbfe', icon: '◉' },
  finance:     { badge: '$ Finance',       color: '#15803d', bg: '#f0fdf4', bdr: '#bbf7d0', icon: '$' },
  architect:   { badge: '🏗 Architect',    color: '#c2410c', bg: '#fff7ed', bdr: '#fed7aa', icon: '⬡' },
  competitive: { badge: '🔍 Intel',        color: '#6d28d9', bg: '#f5f3ff', bdr: '#ddd6fe', icon: '◎' },
  growth:      { badge: '⚡ Growth',       color: '#b45309', bg: '#fffbf5', bdr: '#fde68a', icon: '↑' },
  legal:       { badge: '⚖ Legal',        color: '#be123c', bg: '#fff1f2', bdr: '#fecdd3', icon: '⚖' },
  concept:     { badge: '💡 Concept',      color: '#0d9488', bg: '#f0fdfa', bdr: '#99f6e4', icon: '◈' },
  general:     { badge: '◇ Response',     color: '#6b6055', bg: '#fafaf8', bdr: '#e5e0d8', icon: 'S' },
};

/* ─────────────────────────────────────────
   OUTPUT TYPE DETECTION (within domain)
───────────────────────────────────────── */
function detectOutputType(userQuery, responseText) {
  const q = (userQuery || '').toLowerCase();
  const r = responseText || '';

  if (/```[\w]*\n/.test(r) && (r.match(/```/g) || []).length >= 2) return 'code';
  if (/\$\$[\s\S]+?\$\$/.test(r) || /\\\([\s\S]+?\\\)/.test(r)) return 'math';
  if (/\b(vs\.?|versus|compare|comparison|difference between|which is better|pros and cons)\b/i.test(q)) return 'comparison';
  if ((r.match(/\|\s*[-:]+\s*\|/g) || []).length > 0 && r.includes('\n')) return 'table';
  if (/\b(how to|how do i|guide|walk me through|tutorial|setup|install|configure|deploy|step by step)\b/.test(q)) return 'steps';
  if (/^Step\s+\d+/im.test(r) && (r.match(/^Step\s+\d+/gim) || []).length >= 2) return 'steps';
  if (/^\d+\.\s+\*\*/m.test(r) && (r.match(/^\d+\./gm) || []).length >= 3) return 'steps';
  if (/\b(why is|what's wrong|diagnose|debug|troubleshoot|root cause|not working)\b/.test(q)) return 'diagnosis';
  if (/\b(list|give me|top \d+|best \d+|recommend|suggest|options for|examples of|name \d+)\b/.test(q)) return 'list';
  if ((r.match(/^[-*•]\s/gm) || []).length >= 4) return 'list';
  if (/\b(what is|explain|describe|tell me about|overview|history|how does|elaborate)\b/.test(q) && r.length > 400) return 'research';
  if ((r.match(/^#{2,3}\s/gm) || []).length >= 2) return 'research';
  if (r.length < 280) return 'chat';
  if (r.length > 700) return 'research';
  return 'chat';
}

/* ─────────────────────────────────────────
   UTILITIES
───────────────────────────────────────── */
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inlineMd(s) {
  s = esc(s);
  s = s.replace(/\\\((.+?)\\\)/g, '<span class="si-math-inline">$1</span>');
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]{1,80})\*/g, '<em>$1</em>');
  s = s.replace(/`([^`\n]+?)`/g, '<code class="si-ic">$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/🔴|❌/g, '<span style="color:#dc2626">$&</span>');
  s = s.replace(/🟡|⚠️/g, '<span style="color:#d97706">$&</span>');
  s = s.replace(/🟢|✅/g, '<span style="color:#16a34a">$&</span>');
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
    btn.classList.add('si-copied');
    btn.innerHTML = '✓ Copied';
    setTimeout(() => { btn.classList.remove('si-copied'); btn.innerHTML = orig; }, 2000);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok).catch(() => { fbCopy(text); ok(); });
  else { fbCopy(text); ok(); }
}

function fbCopy(t) {
  const e = document.createElement('textarea');
  e.value = t; e.style.cssText = 'position:fixed;top:-9999px';
  document.body.appendChild(e); e.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(e);
}

/* ─────────────────────────────────────────
   CSS INJECTION
───────────────────────────────────────── */
function injectStyles() {
  if (document.getElementById('si-v4-styles')) return;
  const s = document.createElement('style');
  s.id = 'si-v4-styles';
  s.textContent = `
/* ── BASE ── */
.si-root{font-family:var(--font);color:var(--tx);line-height:1.7;}
.si-ic{font-family:var(--mono)!important;font-size:12.5px!important;background:var(--code-bg)!important;border:1px solid var(--bdr)!important;border-radius:4px!important;padding:2px 6px!important;color:#b5490d!important;}
.si-root a{color:var(--acc);text-decoration:underline;text-underline-offset:3px;}
.si-math-inline{font-family:var(--mono);font-size:.9em;background:#e0f2fe;color:#0369a1;border-radius:3px;padding:1px 4px;}
.si-copied{background:#ecfdf5!important;color:#059669!important;border-color:#6ee7b7!important;}

/* ── CARD SHELL ── */
.si-card{background:var(--bg);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,.07);margin:2px 0 6px;}
.si-card-hd{display:flex;align-items:center;justify-content:space-between;padding:10px 15px;border-bottom:1px solid var(--bdr);background:var(--bg-sub);}
.si-card-left{display:flex;align-items:center;gap:8px;}
.si-card-badge{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px;}
.si-card-title{font-size:12.5px;font-weight:600;color:var(--tx2);}
.si-copy-btn{background:none;border:1px solid var(--bdr);cursor:pointer;font-size:11px;color:var(--tx3);font-family:var(--font);display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:5px;transition:all .15s;}
.si-copy-btn:hover{background:var(--bg-hov);color:var(--tx);}
.si-card-bd{padding:18px 20px;}
.si-card-scroll{max-height:600px;overflow-y:auto;}

/* ── DOWNLOAD ROW ── */
.si-dl-row{display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--bdr-soft);background:var(--bg-sub);}
.si-dl-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border:none;border-radius:7px;font-family:var(--font);font-size:11.5px;font-weight:500;cursor:pointer;transition:all .15s;}
.si-dl-dark{background:var(--tx);color:#fff;}.si-dl-dark:hover{background:#2d2a26;transform:translateY(-1px);}
.si-dl-blue{background:#1d4ed8;color:#fff;}.si-dl-blue:hover{background:#1e40af;transform:translateY(-1px);}

/* ── PROSE ── */
.si-prose{display:flex;flex-direction:column;gap:0;}
.si-prose p{font-size:14px;line-height:1.78;margin:0 0 9px;color:var(--tx);}
.si-prose p:last-child{margin-bottom:0;}
.si-prose ul,.si-prose ol{padding-left:20px;margin:4px 0 10px;}
.si-prose li{font-size:13.5px;margin-bottom:5px;line-height:1.65;color:var(--tx);}
.si-prose h2{font-size:15px;font-weight:700;color:var(--tx);margin:16px 0 7px;letter-spacing:-.01em;padding-bottom:5px;border-bottom:1px solid var(--bdr-soft);}
.si-prose h3{font-size:14.5px;font-weight:700;color:var(--tx);margin:14px 0 6px;letter-spacing:-.01em;}
.si-prose h4{font-size:13.5px;font-weight:600;color:var(--tx2);margin:10px 0 4px;}
.si-prose h2:first-child,.si-prose h3:first-child,.si-prose h4:first-child{margin-top:0;}
.si-prose hr{border:none;border-top:1px solid var(--bdr-soft);margin:12px 0;}
.si-prose blockquote{border-left:3px solid var(--acc);padding:7px 0 7px 14px;color:var(--tx2);font-style:italic;background:var(--acc-bg);border-radius:0 6px 6px 0;margin:8px 0;}
.si-prose strong{font-weight:700;}
.si-prose em{font-style:italic;}

/* ── SUMMARY STRIP ── */
.si-summary{padding:11px 16px;background:#fafaf8;border-bottom:1px solid var(--bdr-soft);font-size:13px;line-height:1.65;color:var(--tx2);font-style:italic;}

/* ── CODE ── */
.si-code-wrap{border-radius:10px;overflow:hidden;border:1px solid var(--bdr);box-shadow:0 3px 14px rgba(0,0,0,.08);margin:8px 0;}
.si-code-bar{display:flex;align-items:center;justify-content:space-between;padding:9px 16px;background:#0f172a;}
.si-code-lang{font-family:var(--mono);font-size:11px;color:#7dd3fc;font-weight:600;letter-spacing:.04em;text-transform:uppercase;display:flex;align-items:center;gap:6px;}
.si-code-lang::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#7dd3fc;opacity:.6;}
.si-code-copy{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#94a3b8;font-size:11px;font-family:var(--font);padding:4px 10px;border-radius:5px;cursor:pointer;transition:all .15s;}
.si-code-copy:hover{background:rgba(255,255,255,.16);color:#e2e8f0;}
.si-code-pre{margin:0;background:#0f172a;padding:16px 20px;overflow-x:auto;}
.si-code-pre code{font-family:var(--mono);font-size:13px;line-height:1.7;color:#e2e8f0;background:none;border:none;padding:0;display:block;}

/* ── STEPS ── */
.si-steps{display:flex;flex-direction:column;}
.si-step{display:flex;gap:0;align-items:stretch;}
.si-step-rail{display:flex;flex-direction:column;align-items:center;width:44px;flex-shrink:0;padding-top:16px;}
.si-step-num{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:var(--tx);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.14);}
.si-step-line{width:2px;flex:1;background:var(--bdr);margin-top:6px;min-height:20px;}
.si-step:last-child .si-step-line{display:none;}
.si-step-body{flex:1;padding:14px 18px 14px 0;}
.si-step-title{font-size:14px;font-weight:700;color:var(--tx);margin-bottom:5px;}
.si-step-desc{font-size:13.5px;color:var(--tx2);line-height:1.7;}

/* ── TABLE ── */
.si-table-wrap{overflow-x:auto;border-radius:10px;border:1px solid var(--bdr);box-shadow:0 2px 10px rgba(0,0,0,.05);margin:8px 0;}
.si-table{width:100%;border-collapse:collapse;font-size:13.5px;}
.si-table th{background:var(--tx);color:#fff;padding:10px 14px;font-size:12px;font-weight:600;text-align:left;}
.si-table th:first-child{background:#2d2a26;}
.si-table td{padding:9px 14px;border-bottom:1px solid var(--bdr-soft);vertical-align:top;color:var(--tx);}
.si-table tr:last-child td{border-bottom:none;}
.si-table tr:nth-child(even) td{background:var(--bg-sub);}
.si-table td:first-child{font-weight:600;color:var(--tx2);font-size:12.5px;}

/* ── STATUS BADGES (used in tables) ── */
.si-badge-high{background:#fee2e2;color:#991b1b;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:700;white-space:nowrap;}
.si-badge-med{background:#fff7ed;color:#c2410c;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:700;white-space:nowrap;}
.si-badge-low{background:#f0fdf4;color:#15803d;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:700;white-space:nowrap;}

/* ── LIST ── */
.si-list{display:flex;flex-direction:column;gap:7px;}
.si-list-item{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid var(--bdr);border-radius:11px;background:var(--bg);transition:background .15s,box-shadow .15s,border-color .15s;}
.si-list-item:hover{background:var(--bg-sub);box-shadow:0 2px 10px rgba(0,0,0,.05);}
.si-list-num{width:26px;height:26px;border-radius:7px;flex-shrink:0;margin-top:1px;background:var(--acc-bg);color:var(--acc);font-size:12px;font-weight:700;border:1px solid var(--acc-bdr);display:flex;align-items:center;justify-content:center;}
.si-list-bul{width:26px;height:26px;border-radius:7px;flex-shrink:0;margin-top:1px;background:var(--bg-sub);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;color:var(--tx3);font-size:9px;font-weight:700;}
.si-list-content{flex:1;min-width:0;}
.si-list-title{font-size:14px;font-weight:600;color:var(--tx);line-height:1.4;margin-bottom:2px;}
.si-list-sub{font-size:13px;color:var(--tx2);line-height:1.6;}

/* ── RESEARCH SECTIONS ── */
.si-rsec{border-bottom:1px solid var(--bdr-soft);}
.si-rsec:last-child{border-bottom:none;}
.si-rsec-body{padding:14px 20px;}
.si-rsec-hd{display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:700;color:var(--tx);margin-bottom:9px;letter-spacing:-.01em;}
.si-rsec-hd::before{content:'';width:3px;height:16px;background:var(--acc);border-radius:2px;flex-shrink:0;}

/* ── MATH ── */
.si-math-box{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:11px;padding:14px 18px;margin:8px 0;}
.si-math-lbl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#0284c7;margin-bottom:6px;}
.si-math-formula{font-family:var(--mono);font-size:14px;color:#0369a1;line-height:1.8;white-space:pre-wrap;word-break:break-word;}
.si-math-answer{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #6ee7b7;border-radius:10px;padding:14px 18px;margin:10px 0;}
.si-math-answer-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#059669;margin-bottom:8px;}
.si-math-answer-val{font-family:var(--mono);font-size:16px;font-weight:700;color:#065f46;line-height:1.5;}
.si-math-verify{background:#eff6ff;border:1px solid #bfdbfe;border-left:3px solid #2563eb;border-radius:0 9px 9px 0;padding:11px 14px;font-size:13px;color:#1e3a8a;line-height:1.65;margin-top:10px;}

/* ── COMPARISON ── */
.si-cmp-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
@media(max-width:520px){.si-cmp-cols{grid-template-columns:1fr;}}
.si-cmp-col{border:1.5px solid var(--bdr);border-radius:11px;overflow:hidden;}
.si-cmp-col-hd{padding:11px 15px;font-size:13.5px;font-weight:700;}
.si-cmp-col-hd.col-a{background:#0f172a;color:#7dd3fc;}
.si-cmp-col-hd.col-b{background:#1c1007;color:#fcd34d;}
.si-cmp-col-body{padding:12px 14px;display:flex;flex-direction:column;}
.si-cmp-attr-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--tx3);margin-bottom:1px;margin-top:8px;}
.si-cmp-attr-lbl:first-child{margin-top:0;}
.si-cmp-attr-val{font-size:13.5px;color:var(--tx);line-height:1.55;padding-bottom:7px;border-bottom:1px solid var(--bdr-soft);}
.si-cmp-attr-val:last-child{border-bottom:none;padding-bottom:0;}
.si-verdict{display:flex;align-items:flex-start;gap:10px;background:var(--acc-bg);border:1.5px solid var(--acc-bdr);border-radius:10px;padding:12px 15px;margin-top:8px;}
.si-verdict-inner strong{display:block;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--acc);margin-bottom:3px;}
.si-verdict-inner p{font-size:13.5px;color:var(--tx);line-height:1.65;margin:0;}

/* ── MERMAID ── */
.si-mermaid-wrap{background:var(--bg-sub);border:1px solid var(--bdr);border-radius:11px;padding:20px;margin:10px 0;text-align:center;overflow-x:auto;}
.si-mermaid-wrap svg{max-width:100%;height:auto;}

/* ── CALLOUT ── */
.si-callout{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;border-radius:9px;border-left:3px solid;font-size:13.5px;line-height:1.65;margin:8px 0;}
.si-callout.info{background:#eff6ff;border-color:#2563eb;color:#1e3a8a;}
.si-callout.warn{background:#fffbeb;border-color:#f59e0b;color:#78350f;}
.si-callout.tip{background:#d1fae5;border-color:#059669;color:#064e3b;}
.si-callout.danger{background:#fee2e2;border-color:#dc2626;color:#991b1b;}

/* ── DIAGNOSIS ── */
.si-diag-list{display:flex;flex-direction:column;gap:8px;}
.si-diag-item{border-radius:10px;overflow:hidden;border:1px solid;}
.si-diag-item.sev-high{border-color:#fecaca;}.si-diag-item.sev-high .si-diag-hd{background:#fee2e2;color:#991b1b;}
.si-diag-item.sev-med{border-color:#fed7aa;}.si-diag-item.sev-med .si-diag-hd{background:#fff7ed;color:#c2410c;}
.si-diag-item.sev-low{border-color:#fef08a;}.si-diag-item.sev-low .si-diag-hd{background:#fefce8;color:#713f12;}
.si-diag-item.sev-info{border-color:var(--bdr);}.si-diag-item.sev-info .si-diag-hd{background:var(--bg-sub);color:var(--tx2);}
.si-diag-hd{display:flex;align-items:center;gap:8px;padding:9px 13px;font-size:13px;font-weight:600;}
.si-diag-bd{padding:9px 13px;font-size:13px;color:var(--tx2);line-height:1.65;border-top:1px solid rgba(0,0,0,.06);}
.si-sev-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;padding:2px 7px;border-radius:9px;margin-left:auto;}
.sev-high .si-sev-tag{background:#fecaca;color:#7f1d1d;}
.sev-med .si-sev-tag{background:#fed7aa;color:#7c2d12;}
.sev-low .si-sev-tag{background:#fef08a;color:#713f12;}
.sev-info .si-sev-tag{background:var(--bg-act);color:var(--tx2);}

/* ── SCENARIOS (Finance) ── */
.si-scenarios{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:10px 0;}
@media(max-width:520px){.si-scenarios{grid-template-columns:1fr;}}
.si-scenario{border:1px solid var(--bdr-soft);border-radius:9px;overflow:hidden;}
.si-scenario-hd{padding:9px 12px;border-bottom:1px solid var(--bdr-soft);}
.si-scenario.bear .si-scenario-hd{background:#fee2e2;}
.si-scenario.base .si-scenario-hd{background:#fffbf5;}
.si-scenario.bull .si-scenario-hd{background:#d1fae5;}
.si-scenario-name{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;}
.bear .si-scenario-name{color:#991b1b;}
.base .si-scenario-name{color:#b45309;}
.bull .si-scenario-name{color:#065f46;}
.si-scenario-body{padding:10px 12px;display:flex;flex-direction:column;gap:5px;}
.si-scenario-row{display:flex;gap:8px;font-size:12.5px;}
.si-scenario-lbl{font-weight:600;color:var(--tx2);min-width:80px;flex-shrink:0;}

/* ── ARCH LAYERS ── */
.si-arch-wrap{border:1px solid var(--bdr-soft);border-radius:9px;overflow:hidden;margin:10px 0;}
.si-arch-layer{border-bottom:1px solid var(--bdr-soft);}
.si-arch-layer:last-child{border-bottom:none;}
.si-arch-layer-hd{padding:7px 12px;background:var(--bg-sub);font-size:10.5px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.4px;border-bottom:1px solid var(--bdr-soft);}
.si-arch-comps{display:flex;flex-wrap:wrap;gap:5px;padding:10px 12px;}
.si-arch-comp{padding:4px 10px;background:var(--bg);border:1px solid var(--bdr);border-radius:20px;font-size:12px;color:var(--tx);font-weight:500;}

/* ── CHAT ── */
.si-chat{font-size:14.5px;line-height:1.78;color:var(--tx);}
.si-chat p{margin:0 0 9px;}.si-chat p:last-child{margin-bottom:0;}
.si-chat ul,.si-chat ol{padding-left:20px;margin:5px 0 10px;}
.si-chat li{margin-bottom:5px;line-height:1.65;}

/* ── STREAM STATE ── */
.si-streaming{opacity:.9;}
.si-typing-cursor::after{content:'▋';animation:blink .7s infinite;margin-left:1px;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
`;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────
   PARSERS
───────────────────────────────────────── */
function parseCodeBlocks(text) {
  const segments = []; let lastIndex = 0;
  const re = /```([\w-]*)\n?([\s\S]*?)```/g; let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) segments.push({ type: 'prose', content: text.slice(lastIndex, m.index) });
    segments.push({ type: 'code', lang: m[1] || 'plaintext', content: m[2].trim() });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) segments.push({ type: 'prose', content: text.slice(lastIndex) });
  return segments;
}

function parseMarkdownTable(text) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && /^[\s|:-]+$/.test(lines[i + 1].trim())) { start = i; break; }
  }
  if (start === -1) return null;
  let end = start + 2;
  while (end < lines.length && lines[end].includes('|') && lines[end].trim()) end++;
  const parseRow = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const tableLines = lines.slice(start, end);
  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(2).filter(l => !/^[\s|:-]+$/.test(l)).map(parseRow);
  if (!headers.length || !rows.length) return null;
  return { headers, rows, startLine: start, endLine: end };
}

function parseSteps(text) {
  const steps = []; let m;
  const re1 = /step\s+(\d+)\s*[—–:.\-]+\s*([^\n]+)([\s\S]*?)(?=step\s+\d+\s*[—–:.\-]|$)/gi;
  while ((m = re1.exec(text)) !== null) steps.push({ num: m[1], title: m[2].trim(), body: m[3].trim() });
  if (steps.length >= 2) return steps;
  steps.length = 0;
  const re2 = /^(\d+)[.)]\s+(?:\*\*([^*\n]+)\*\*[\s\-–:]*(.+)?|([^\n]+))([\s\S]*?)(?=^\d+[.)]\s|\Z)/gm;
  while ((m = re2.exec(text)) !== null) {
    const title = (m[2] || m[4] || '').trim();
    const inline = (m[3] || '').trim();
    const rest = (m[5] || '').replace(/^\n+/, '').trim();
    if (title) steps.push({ num: m[1], title, body: (inline + (inline && rest ? ' ' : '') + rest).trim() });
  }
  return steps;
}

function parseListItems(text) {
  const items = []; const lines = text.split('\n'); let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    const nm = l.match(/^(\d+)[.)]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|(.+))$/);
    if (nm) {
      const title = (nm[2] || nm[4] || '').trim();
      let sub = (nm[3] || '').trim(); i++;
      while (i < lines.length && /^\s{2,}/.test(lines[i]) && !/^\d+[.)]\s/.test(lines[i].trim())) {
        sub += (sub ? ' ' : '') + lines[i].trim().replace(/^[-–]\s*/, ''); i++;
      }
      if (title) items.push({ num: nm[1], title, sub, ordered: true }); continue;
    }
    const bm = l.match(/^[-*•]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|([^:]+):\s+(.+)|(.+))$/);
    if (bm) {
      const title = (bm[1] || bm[3] || bm[5] || '').trim();
      const sub = (bm[2] || bm[4] || '').trim(); i++;
      if (title) items.push({ title, sub, ordered: false }); continue;
    }
    i++;
  }
  return items;
}

function parseResearchSections(text) {
  const sections = []; const re = /^(#{2,3})\s+(.+)$/gm;
  const headings = []; let m;
  while ((m = re.exec(text)) !== null) headings.push({ index: m.index, end: re.lastIndex, title: m[2].trim() });
  if (!headings.length) {
    text.split(/\n{2,}/).filter(p => p.trim()).forEach(p => {
      sections.push({ title: null, body: p.trim() });
    });
    return sections;
  }
  if (headings[0].index > 0) {
    const pre = text.slice(0, headings[0].index).trim();
    if (pre) sections.push({ title: null, body: pre });
  }
  headings.forEach((h, i) => {
    const bodyEnd = i + 1 < headings.length ? headings[i + 1].index : text.length;
    sections.push({ title: h.title, body: text.slice(h.end, bodyEnd).trim() });
  });
  return sections;
}

/* ─────────────────────────────────────────
   BLOCK BUILDERS
───────────────────────────────────────── */
function buildCodeBlock(lang, code) {
  if (lang === 'mermaid') {
    const wrap = mkEl('div', 'si-mermaid-wrap');
    const inner = mkEl('div', 'mermaid');
    inner.textContent = code;
    wrap.appendChild(inner);
    requestAnimationFrame(() => {
      try { if (window.mermaid) mermaid.run({ nodes: [inner] }); } catch (e) {}
    });
    return wrap;
  }
  const wrap = mkEl('div', 'si-code-wrap');
  const bar = mkEl('div', 'si-code-bar');
  const langEl = mkEl('span', 'si-code-lang'); langEl.textContent = lang || 'code';
  const copyBtn = mkEl('button', 'si-code-copy');
  copyBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
  copyBtn.onclick = () => copyToClipboard(code, copyBtn);
  bar.appendChild(langEl); bar.appendChild(copyBtn);
  const pre = mkEl('pre', 'si-code-pre');
  const codeEl = mkEl('code');
  if (lang && lang !== 'plaintext') codeEl.className = `language-${lang}`;
  codeEl.textContent = code;
  try { if (window.hljs) window.hljs.highlightElement(codeEl); } catch (e) {}
  pre.appendChild(codeEl); wrap.appendChild(bar); wrap.appendChild(pre);
  return wrap;
}

function buildProseBlock(text) {
  const div = mkEl('div', 'si-prose');
  const lines = text.split('\n');
  let i = 0, currentList = null, listTag = '';

  const flush = () => { currentList = null; listTag = ''; };
  const append = el => { flush(); div.appendChild(el); };

  while (i < lines.length) {
    const l = lines[i].trim(); i++;
    if (!l) { flush(); continue; }
    if (/^---+$/.test(l)) { append(mkEl('hr')); continue; }

    if (/^(⚠️|warning:|⚠ )/i.test(l)) { const co = mkEl('div', 'si-callout warn'); co.innerHTML = inlineMd(l); append(co); continue; }
    if (/^(💡|tip:|hint:)/i.test(l)) { const co = mkEl('div', 'si-callout tip'); co.innerHTML = inlineMd(l); append(co); continue; }
    if (/^(ℹ️|info:|note:)/i.test(l)) { const co = mkEl('div', 'si-callout info'); co.innerHTML = inlineMd(l); append(co); continue; }
    if (/^(🚨|danger:|critical:)/i.test(l)) { const co = mkEl('div', 'si-callout danger'); co.innerHTML = inlineMd(l); append(co); continue; }
    if (/^> /.test(l)) { const bq = mkEl('blockquote'); bq.innerHTML = inlineMd(l.slice(2)); append(bq); continue; }

    const hm = l.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const tag = ['h2', 'h2', 'h3', 'h4'][hm[1].length - 1] || 'h4';
      const h = mkEl(tag); h.innerHTML = inlineMd(hm[2]); append(h); continue;
    }

    if (/^[-*•]\s/.test(l)) {
      if (listTag !== 'UL') { flush(); currentList = mkEl('ul'); listTag = 'UL'; div.appendChild(currentList); }
      const li = mkEl('li'); li.innerHTML = inlineMd(l.replace(/^[-*•]\s+/, '')); currentList.appendChild(li); continue;
    }
    if (/^\d+[.)]\s/.test(l)) {
      if (listTag !== 'OL') { flush(); currentList = mkEl('ol'); listTag = 'OL'; div.appendChild(currentList); }
      const li = mkEl('li'); li.innerHTML = inlineMd(l.replace(/^\d+[.)]\s+/, '')); currentList.appendChild(li); continue;
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

function buildTableDOM(tbl) {
  const tw = mkEl('div', 'si-table-wrap');
  const table = mkEl('table', 'si-table');
  const thead = mkEl('thead'); const hr = mkEl('tr');
  tbl.headers.forEach(h => { const th = mkEl('th'); th.innerHTML = inlineMd(h); hr.appendChild(th); });
  thead.appendChild(hr); table.appendChild(thead);
  const tbody = mkEl('tbody');
  tbl.rows.forEach(row => {
    const tr = mkEl('tr');
    tbl.headers.forEach((_, ci) => {
      const td = mkEl('td');
      const val = row[ci] || '';
      // Colorize risk/status cells
      if (/🔴|HIGH|CRITICAL/i.test(val)) td.innerHTML = `<span class="si-badge-high">${inlineMd(val)}</span>`;
      else if (/🟡|MEDIUM|WARNING/i.test(val)) td.innerHTML = `<span class="si-badge-med">${inlineMd(val)}</span>`;
      else if (/🟢|LOW|GOOD|OK/i.test(val)) td.innerHTML = `<span class="si-badge-low">${inlineMd(val)}</span>`;
      else td.innerHTML = inlineMd(val);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody); tw.appendChild(table);
  return tw;
}

function buildCardShell(domain, title, contentId) {
  const cfg = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.general;
  const card = mkEl('div', 'si-card');
  const hd = mkEl('div', 'si-card-hd');
  const left = mkEl('div', 'si-card-left');
  const badge = mkEl('div', 'si-card-badge');
  badge.style.cssText = `background:${cfg.bg};color:${cfg.color};border:1px solid ${cfg.bdr};`;
  badge.textContent = cfg.badge;
  const titleEl = mkEl('div', 'si-card-title'); titleEl.textContent = title;
  left.appendChild(badge); left.appendChild(titleEl);
  const copyBtn = mkEl('button', 'si-copy-btn');
  copyBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
  copyBtn.onclick = () => {
    const el = document.getElementById(contentId);
    copyToClipboard(el ? el.innerText : '', copyBtn);
  };
  hd.appendChild(left); hd.appendChild(copyBtn);
  card.appendChild(hd);
  return card;
}

function buildDownloadRow(contentId, label) {
  const row = mkEl('div', 'si-dl-row');
  const dlBtn = mkEl('button', 'si-dl-btn si-dl-dark');
  dlBtn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt';
  dlBtn.onclick = () => {
    const el = document.getElementById(contentId);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([el ? el.innerText : label], { type: 'text/plain' }));
    a.download = `stremini-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
  };
  row.appendChild(dlBtn);
  return row;
}

/* ─────────────────────────────────────────
   DOMAIN-SPECIFIC RENDERERS
───────────────────────────────────────── */

function renderCode(text, domain) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell(domain || 'code', 'Code Response', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim()));
  });
  card.appendChild(bd);
  card.appendChild(buildDownloadRow(pid, 'code'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

function renderMath(text) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell('math', 'Math Solution', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  const sections = parseResearchSections(text);

  sections.forEach(sec => {
    const isAnswer = /^(answer|final\s*answer|the\s*answer)\s*$/i.test(sec.title || '');
    const isVerify = /^(verification|verify|check)\s*$/i.test(sec.title || '');

    if (sec.title) {
      const hd = mkEl('div', 'si-rsec-hd');
      hd.innerHTML = inlineMd(sec.title);
      const secWrap = mkEl('div', 'si-rsec');
      const secBd = mkEl('div', 'si-rsec-body');
      secBd.appendChild(hd);
      buildMathSectionBody(sec.body, secBd, isAnswer, isVerify);
      secWrap.appendChild(secBd);
      bd.appendChild(secWrap);
    } else {
      buildMathSectionBody(sec.body, bd, false, false);
    }
  });

  card.appendChild(bd);
  card.appendChild(buildDownloadRow(pid, 'math-solution'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

function buildMathSectionBody(text, container, isAnswer, isVerify) {
  if (!text) return;
  const lines = text.split('\n');
  let i = 0;
  const isMathLine = t => /[=+\-*/^²³√±∓∫∑]/.test(t) && t.length < 200;

  while (i < lines.length) {
    const l = lines[i].trim(); i++;
    if (!l) continue;

    if (isAnswer && isMathLine(l)) {
      const mathLines = [l];
      while (i < lines.length && isMathLine(lines[i].trim())) { mathLines.push(lines[i].trim()); i++; }
      const box = mkEl('div', 'si-math-answer');
      box.appendChild(mkEl('div', 'si-math-answer-lbl', 'Final Answer'));
      box.appendChild(mkEl('div', 'si-math-answer-val', esc(mathLines.join('\n'))));
      container.appendChild(box);
      continue;
    }

    if (isVerify) {
      const verLines = [l];
      while (i < lines.length && lines[i].trim()) { verLines.push(lines[i].trim()); i++; }
      const v = mkEl('div', 'si-math-verify');
      v.innerHTML = '<strong>✓ Verification:</strong> ' + inlineMd(verLines.join(' '));
      container.appendChild(v);
      continue;
    }

    if (isMathLine(l)) {
      const mathLines = [l];
      while (i < lines.length && isMathLine(lines[i].trim())) { mathLines.push(lines[i].trim()); i++; }
      const box = mkEl('div', 'si-math-box');
      box.appendChild(mkEl('div', 'si-math-lbl', 'Formula'));
      box.appendChild(mkEl('div', 'si-math-formula', esc(mathLines.join('\n'))));
      container.appendChild(box);
      continue;
    }

    const prose = buildProseBlock(l);
    container.appendChild(prose);
  }
}

function renderResearch(text, domain) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell(domain || 'research', 'Analysis', pid);

  // Check for tables in the response - extract and render them inline
  const sections = parseResearchSections(text);
  const bd = mkEl('div', 'si-card-scroll'); bd.id = pid;

  sections.forEach(sec => {
    const secWrap = mkEl('div', 'si-rsec');
    const secBd = mkEl('div', 'si-rsec-body');
    if (sec.title) {
      const hd = mkEl('div', 'si-rsec-hd');
      hd.innerHTML = inlineMd(sec.title);
      secBd.appendChild(hd);
    }
    // Render body, handling tables inline
    const bodyLines = sec.body.split('\n');
    const tbl = parseMarkdownTable(sec.body);
    if (tbl) {
      const preLines = bodyLines.slice(0, tbl.startLine).join('\n').trim();
      const postLines = bodyLines.slice(tbl.endLine).join('\n').trim();
      if (preLines) secBd.appendChild(buildProseBlock(preLines));
      secBd.appendChild(buildTableDOM(tbl));
      if (postLines) secBd.appendChild(buildProseBlock(postLines));
    } else {
      parseCodeBlocks(sec.body).forEach(s => {
        if (s.type === 'code') secBd.appendChild(buildCodeBlock(s.lang, s.content));
        else if (s.content.trim()) secBd.appendChild(buildProseBlock(s.content.trim()));
      });
    }
    secWrap.appendChild(secBd);
    bd.appendChild(secWrap);
  });

  card.appendChild(bd);
  card.appendChild(buildDownloadRow(pid, domain || 'research'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

function renderSteps(text, domain) {
  const pid = 'si_' + Date.now();
  const steps = parseSteps(text);
  const card = buildCardShell(domain || 'general', `${steps.length || '?'} Steps`, pid);

  const firstStepIdx = text.search(/step\s*1|\n1[\.)]\s/i);
  if (firstStepIdx > 0) {
    const intro = text.slice(0, firstStepIdx).trim();
    if (intro) card.appendChild(mkEl('div', 'si-summary', inlineMd(intro)));
  }

  const bd = mkEl('div', 'si-card-bd'); bd.style.padding = '0'; bd.id = pid;
  if (steps.length >= 2) {
    const wrap = mkEl('div', 'si-steps');
    steps.forEach(step => {
      const item = mkEl('div', 'si-step');
      const rail = mkEl('div', 'si-step-rail');
      const num = mkEl('div', 'si-step-num'); num.textContent = step.num;
      rail.appendChild(num); rail.appendChild(mkEl('div', 'si-step-line'));
      const body = mkEl('div', 'si-step-body');
      body.appendChild(mkEl('div', 'si-step-title', inlineMd(step.title)));
      if (step.body) {
        if (/```/.test(step.body)) {
          parseCodeBlocks(step.body).forEach(s => {
            if (s.type === 'code') body.appendChild(buildCodeBlock(s.lang, s.content));
            else if (s.content.trim()) body.appendChild(mkEl('div', 'si-step-desc', inlineMd(s.content.trim())));
          });
        } else {
          body.appendChild(mkEl('div', 'si-step-desc', inlineMd(step.body.replace(/\n/g, ' '))));
        }
      }
      item.appendChild(rail); item.appendChild(body); wrap.appendChild(item);
    });
    bd.appendChild(wrap);
  } else {
    bd.style.padding = '18px 20px';
    parseCodeBlocks(text).forEach(s => {
      if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim()));
    });
  }
  card.appendChild(bd);
  card.appendChild(buildDownloadRow(pid, 'steps'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

function renderList(text, domain) {
  const pid = 'si_' + Date.now();
  const items = parseListItems(text);
  const card = buildCardShell(domain || 'general', `${items.length} Items`, pid);

  const firstItem = text.search(/^(\d+[.)]\s|[-*•]\s)/m);
  if (firstItem > 0) {
    const intro = text.slice(0, firstItem).trim();
    if (intro) card.appendChild(mkEl('div', 'si-summary', inlineMd(intro)));
  }

  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  if (items.length >= 2) {
    const wrap = mkEl('div', 'si-list');
    items.forEach((item, idx) => {
      const el = mkEl('div', 'si-list-item');
      const bullet = mkEl('div', item.ordered ? 'si-list-num' : 'si-list-bul');
      bullet.textContent = item.ordered ? (item.num || String(idx + 1)) : '◆';
      const content = mkEl('div', 'si-list-content');
      if (item.title) content.appendChild(mkEl('div', 'si-list-title', inlineMd(item.title)));
      if (item.sub) content.appendChild(mkEl('div', 'si-list-sub', inlineMd(item.sub)));
      el.appendChild(bullet); el.appendChild(content); wrap.appendChild(el);
    });
    bd.appendChild(wrap);
  } else {
    bd.appendChild(buildProseBlock(text));
  }
  card.appendChild(bd);
  card.appendChild(buildDownloadRow(pid, 'list'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

function renderComparison(text, domain) {
  const pid = 'si_' + Date.now();

  // Prefer table rendering
  if (text.includes('|') && text.match(/\|\s*[-:]+\s*\|/)) {
    const tbl = parseMarkdownTable(text);
    if (tbl) {
      const card = buildCardShell(domain || 'general', tbl.headers.slice(1).join(' vs ') || 'Comparison', pid);
      const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
      const lines = text.split('\n');
      const pre = lines.slice(0, tbl.startLine).join('\n').trim();
      if (pre) bd.appendChild(buildProseBlock(pre));
      bd.appendChild(buildTableDOM(tbl));
      const post = lines.slice(tbl.endLine).join('\n').trim();
      if (post) {
        const v = mkEl('div', 'si-verdict');
        v.innerHTML = '<div class="si-verdict-inner"><strong>💡 Summary</strong><p>' + inlineMd(post.replace(/^#{1,4}\s+[^\n]+\n?/gm, '').trim()) + '</p></div>';
        bd.appendChild(v);
      }
      card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'comparison'));
      const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
    }
  }

  // Fallback: prose comparison
  return renderResearch(text, domain);
}

function renderTable(text, domain) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell(domain || 'general', 'Data Table', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  const tbl = parseMarkdownTable(text);
  if (tbl) {
    const lines = text.split('\n');
    const pre = lines.slice(0, tbl.startLine).join('\n').trim();
    if (pre) bd.appendChild(buildProseBlock(pre));
    bd.appendChild(buildTableDOM(tbl));
    const post = lines.slice(tbl.endLine).join('\n').trim();
    if (post) bd.appendChild(buildProseBlock(post));
  } else {
    bd.appendChild(buildProseBlock(text));
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'table'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

function renderDiagnosis(text, domain) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell(domain || 'general', 'Diagnosis', pid);
  const sections = parseResearchSections(text);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  const sevMap = { 'critical': 'high', 'error': 'high', 'bug': 'high', 'broken': 'high', 'high risk': 'high', 'warning': 'med', 'issue': 'med', 'problem': 'med', 'medium': 'med', 'fix': 'med', 'note': 'low', 'tip': 'low', 'low': 'low', 'info': 'info' };
  const findings = mkEl('div', 'si-diag-list');
  let hasFindings = false;
  sections.forEach(sec => {
    if (!sec.title) { bd.appendChild(buildProseBlock(sec.body)); return; }
    hasFindings = true;
    const titleLow = sec.title.toLowerCase();
    let sev = 'info';
    for (const [k, v] of Object.entries(sevMap)) { if (titleLow.includes(k)) { sev = v; break; } }
    const finding = mkEl('div', `si-diag-item sev-${sev}`);
    const hd = mkEl('div', 'si-diag-hd'); hd.innerHTML = inlineMd(sec.title);
    const tag = mkEl('span', 'si-sev-tag'); tag.textContent = sev === 'med' ? 'MEDIUM' : sev.toUpperCase(); hd.appendChild(tag);
    finding.appendChild(hd);
    if (sec.body) { const fb = mkEl('div', 'si-diag-bd'); fb.appendChild(buildProseBlock(sec.body)); finding.appendChild(fb); }
    findings.appendChild(finding);
  });
  if (hasFindings) bd.appendChild(findings);
  else bd.appendChild(buildProseBlock(text));
  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'diagnosis'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

function renderChat(text, domain) {
  const pid = 'si_' + Date.now();
  if (text.length < 200) {
    const root = mkEl('div', 'si-root');
    const wrap = mkEl('div', 'si-chat'); wrap.id = pid;
    parseCodeBlocks(text).forEach(s => {
      if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) wrap.appendChild(buildProseBlock(s.content.trim()));
    });
    root.appendChild(wrap); return root;
  }
  const card = buildCardShell(domain || 'general', 'Response', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim()));
  });
  card.appendChild(bd);
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

/* ─────────────────────────────────────────
   MAIN RENDER ENTRY POINT
───────────────────────────────────────── */
function renderOutput(userQuery, responseText, container, domain, isStreaming) {
  injectStyles();

  if (isStreaming) {
    const root = mkEl('div', 'si-root si-streaming');
    const wrap = mkEl('div', 'si-chat si-typing-cursor');
    parseCodeBlocks(responseText).forEach(s => {
      if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) {
        const p = mkEl('p'); p.innerHTML = inlineMd(s.content.trim()); wrap.appendChild(p);
      }
    });
    root.appendChild(wrap);
    if (container) { container.innerHTML = ''; container.appendChild(root); }
    return root;
  }

  // Determine output type
  const outType = detectOutputType(userQuery, responseText);
  const dom = domain || 'general';

  let el;
  switch (dom) {
    case 'math':
      el = renderMath(responseText);
      break;
    case 'code':
      el = renderCode(responseText, dom);
      break;
    case 'data':
    case 'finance':
    case 'competitive':
    case 'architect':
    case 'growth':
    case 'legal':
    case 'concept':
    case 'research':
      // For these domains, use section-aware rendering regardless of detected type
      if (outType === 'code') el = renderCode(responseText, dom);
      else if (outType === 'steps') el = renderSteps(responseText, dom);
      else if (outType === 'list' && dom !== 'data' && dom !== 'finance') el = renderList(responseText, dom);
      else el = renderResearch(responseText, dom);
      break;
    default:
      switch (outType) {
        case 'code': el = renderCode(responseText, dom); break;
        case 'steps': el = renderSteps(responseText, dom); break;
        case 'comparison': el = renderComparison(responseText, dom); break;
        case 'table': el = renderTable(responseText, dom); break;
        case 'list': el = renderList(responseText, dom); break;
        case 'research': el = renderResearch(responseText, dom); break;
        case 'diagnosis': el = renderDiagnosis(responseText, dom); break;
        default: el = renderChat(responseText, dom); break;
      }
  }

  if (container) { container.innerHTML = ''; container.appendChild(el); }
  return el;
}

/* ─────────────────────────────────────────
   STREAMING UPDATER
───────────────────────────────────────── */
function updateStream(text, container) {
  if (!container) return;
  injectStyles();
  const root = mkEl('div', 'si-root si-streaming');
  const wrap = mkEl('div', 'si-chat si-typing-cursor');
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) {
      const p = mkEl('p'); p.innerHTML = inlineMd(s.content.trim()); wrap.appendChild(p);
    }
  });
  root.appendChild(wrap);
  container.innerHTML = ''; container.appendChild(root);
}

function finalizeStream(userQuery, fullText, container, domain) {
  if (!container) return;
  renderOutput(userQuery, fullText, container, domain || 'general', false);
}

/* ─────────────────────────────────────────
   PUBLIC API
───────────────────────────────────────── */
window.StreminiRenderer = {
  render:         renderOutput,
  updateStream:   updateStream,
  finalizeStream: finalizeStream,
  detectType:     detectOutputType,
  injectStyles,
  DOMAIN_CONFIG,
};
