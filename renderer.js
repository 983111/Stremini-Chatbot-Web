/* ═══════════════════════════════════════════════════════════════
   STREMINI AI — CRYSTALLINE RENDERER v5.0
   Beautiful white-theme, advanced structured outputs.
   Font: Instrument Serif (display) + Plus Jakarta Sans (body) + JetBrains Mono (code)
   Design language: clean, editorial, precision-first.
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   FONT INJECTION
───────────────────────────────────────── */
(function injectFonts() {
  if (document.getElementById('cr-fonts')) return;
  const link = document.createElement('link');
  link.id = 'cr-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
})();

/* ─────────────────────────────────────────
   DOMAIN CONFIG — white editorial palette
───────────────────────────────────────── */
const DOMAIN_CONFIG = {
  math:        { label: 'Mathematics',      accent: '#2563eb', accentBg: '#eff6ff', accentBdr: '#bfdbfe', icon: '∑',  glyph: '∫∑' },
  code:        { label: 'Code',             accent: '#7c3aed', accentBg: '#f5f3ff', accentBdr: '#ddd6fe', icon: '</>',glyph: '{}' },
  research:    { label: 'Research',         accent: '#b45309', accentBg: '#fffbf5', accentBdr: '#fde68a', icon: '◈',  glyph: '§¶' },
  data:        { label: 'Data Intelligence',accent: '#0369a1', accentBg: '#f0f9ff', accentBdr: '#bae6fd', icon: '◉',  glyph: '⌁⌀' },
  finance:     { label: 'Financial Model',  accent: '#15803d', accentBg: '#f0fdf4', accentBdr: '#bbf7d0', icon: '$',  glyph: '¥€' },
  architect:   { label: 'Architecture',     accent: '#c2410c', accentBg: '#fff7ed', accentBdr: '#fed7aa', icon: '⬡',  glyph: '⬡⬢' },
  competitive: { label: 'Intel Report',     accent: '#6d28d9', accentBg: '#f5f3ff', accentBdr: '#ddd6fe', icon: '◎',  glyph: '◎◈' },
  growth:      { label: 'Growth Strategy',  accent: '#d97706', accentBg: '#fffbeb', accentBdr: '#fde68a', icon: '↑',  glyph: '↑⟶' },
  legal:       { label: 'Legal Analysis',   accent: '#be123c', accentBg: '#fff1f2', accentBdr: '#fecdd3', icon: '⚖',  glyph: '§©' },
  concept:     { label: 'Concept',          accent: '#0d9488', accentBg: '#f0fdfa', accentBdr: '#99f6e4', icon: '◈',  glyph: '◈◇' },
  general:     { label: 'Response',         accent: '#374151', accentBg: '#f9fafb', accentBdr: '#e5e7eb', icon: 'S',  glyph: '··' },
};

/* ─────────────────────────────────────────
   CSS INJECTION
───────────────────────────────────────── */
function injectStyles() {
  if (document.getElementById('cr-v5-styles')) return;
  const s = document.createElement('style');
  s.id = 'cr-v5-styles';
  s.textContent = `
/* ── RESET & ROOT ── */
.cr-root *{box-sizing:border-box;-webkit-font-smoothing:antialiased;}
.cr-root{
  font-family:'Plus Jakarta Sans',ui-sans-serif,sans-serif;
  font-size:14px;line-height:1.7;color:#111827;
  --cr-bg:#ffffff;--cr-bg2:#f9fafb;--cr-bg3:#f3f4f6;
  --cr-bdr:#e5e7eb;--cr-bdr2:#d1d5db;
  --cr-tx:#111827;--cr-tx2:#374151;--cr-tx3:#6b7280;--cr-tx4:#9ca3af;
  --cr-acc:#374151;--cr-acc-bg:#f9fafb;--cr-acc-bdr:#e5e7eb;
  --cr-serif:'Instrument Serif',Georgia,serif;
  --cr-mono:'JetBrains Mono',ui-monospace,monospace;
  --cr-r:10px;--cr-r-sm:6px;--cr-r-lg:14px;
  --cr-sh:0 1px 3px rgba(0,0,0,.05),0 4px 16px rgba(0,0,0,.06);
  --cr-sh-lg:0 4px 24px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);
}

/* ── CARD SHELL ── */
.cr-card{
  background:#fff;border:1.5px solid var(--cr-bdr);
  border-radius:16px;overflow:hidden;
  box-shadow:var(--cr-sh-lg);margin:2px 0 8px;
  transition:box-shadow .2s;
}
.cr-card:hover{box-shadow:0 8px 40px rgba(0,0,0,.10);}

/* ── CARD HEADER ── */
.cr-hd{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 20px;border-bottom:1px solid var(--cr-bdr);
  background:var(--cr-bg2);
  gap:12px;
}
.cr-hd-left{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.cr-domain-tag{
  display:inline-flex;align-items:center;gap:6px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  padding:4px 11px;border-radius:99px;white-space:nowrap;flex-shrink:0;
}
.cr-hd-title{
  font-size:13px;font-weight:600;color:var(--cr-tx2);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.cr-copy-btn{
  display:inline-flex;align-items:center;gap:5px;
  background:none;border:1px solid var(--cr-bdr2);cursor:pointer;
  font-size:11px;font-weight:500;color:var(--cr-tx3);
  font-family:'Plus Jakarta Sans',sans-serif;
  padding:5px 11px;border-radius:var(--cr-r-sm);
  transition:all .15s;white-space:nowrap;flex-shrink:0;
}
.cr-copy-btn:hover{background:var(--cr-bg3);color:var(--cr-tx);border-color:var(--cr-bdr2);}
.cr-copy-btn.cr-copied{background:#ecfdf5;color:#059669;border-color:#6ee7b7;}

/* ── SUMMARY BAR ── */
.cr-summary{
  padding:12px 20px;border-bottom:1px solid var(--cr-bdr);
  font-family:var(--cr-serif);font-style:italic;
  font-size:14.5px;line-height:1.7;color:var(--cr-tx2);
  background:#fafaf9;
}

/* ── SECTION DIVIDERS ── */
.cr-section{border-bottom:1px solid var(--cr-bdr);}
.cr-section:last-child{border-bottom:none;}
.cr-section-hd{
  display:flex;align-items:center;gap:8px;
  padding:12px 20px;cursor:pointer;
  background:#fff;transition:background .12s;user-select:none;
}
.cr-section-hd:hover{background:var(--cr-bg2);}
.cr-section-marker{
  width:3px;height:16px;border-radius:2px;flex-shrink:0;
}
.cr-section-label{
  font-size:11px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:var(--cr-tx2);flex:1;
}
.cr-section-chevron{
  color:var(--cr-tx4);transition:transform .2s;flex-shrink:0;
}
.cr-section-chevron.open{transform:rotate(180deg);}
.cr-section-body{padding:16px 20px 18px;background:#fff;}
.cr-section-body.collapsed{display:none;}

/* ── DOWNLOAD ROW ── */
.cr-dl-row{
  display:flex;gap:8px;flex-wrap:wrap;
  padding:12px 20px;border-top:1px solid var(--cr-bdr);
  background:var(--cr-bg2);
}
.cr-dl-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border:none;border-radius:var(--cr-r-sm);
  font-family:'Plus Jakarta Sans',sans-serif;font-size:11.5px;
  font-weight:600;cursor:pointer;transition:all .15s;letter-spacing:.01em;
}
.cr-dl-dark{background:#111827;color:#fff;}
.cr-dl-dark:hover{background:#1f2937;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.15);}
.cr-dl-ghost{background:#fff;color:var(--cr-tx2);border:1px solid var(--cr-bdr2);}
.cr-dl-ghost:hover{background:var(--cr-bg3);border-color:var(--cr-bdr2);}

/* ── PROSE ── */
.cr-prose{display:flex;flex-direction:column;gap:2px;}
.cr-prose p{font-size:14px;line-height:1.78;color:var(--cr-tx);margin:0 0 8px;}
.cr-prose p:last-child{margin-bottom:0;}
.cr-prose ul,.cr-prose ol{padding-left:20px;margin:4px 0 10px;}
.cr-prose li{font-size:13.5px;margin-bottom:5px;line-height:1.65;color:var(--cr-tx);}
.cr-prose h2{
  font-family:var(--cr-serif);font-style:italic;
  font-size:18px;font-weight:400;color:var(--cr-tx);
  margin:18px 0 8px;padding-bottom:6px;border-bottom:1px solid var(--cr-bdr);
  letter-spacing:-.02em;
}
.cr-prose h3{
  font-size:13.5px;font-weight:700;color:var(--cr-tx);
  margin:14px 0 6px;letter-spacing:-.01em;
  display:flex;align-items:center;gap:8px;
}
.cr-prose h3::before{content:'';display:inline-block;width:3px;height:13px;border-radius:2px;background:var(--cr-acc);flex-shrink:0;}
.cr-prose h4{font-size:12.5px;font-weight:700;color:var(--cr-tx2);margin:10px 0 4px;text-transform:uppercase;letter-spacing:.06em;}
.cr-prose h2:first-child,.cr-prose h3:first-child,.cr-prose h4:first-child{margin-top:0;}
.cr-prose hr{border:none;border-top:1px solid var(--cr-bdr);margin:14px 0;}
.cr-prose blockquote{
  border-left:3px solid var(--cr-acc);padding:10px 0 10px 16px;
  color:var(--cr-tx2);font-family:var(--cr-serif);font-style:italic;
  font-size:14.5px;line-height:1.75;margin:10px 0;
}
.cr-prose strong{font-weight:700;}
.cr-prose em{font-style:italic;color:var(--cr-tx2);}
.cr-prose code{
  font-family:var(--cr-mono);font-size:12px;
  background:#f3f4f6;border:1px solid var(--cr-bdr2);
  border-radius:4px;padding:2px 6px;color:#7c3aed;
}

/* ── CODE BLOCKS ── */
.cr-code{
  border-radius:var(--cr-r);overflow:hidden;
  border:1px solid #e5e7eb;margin:8px 0;
  box-shadow:0 2px 8px rgba(0,0,0,.06);
}
.cr-code-bar{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 16px;background:#18181b;
  border-bottom:1px solid #3f3f46;
}
.cr-code-lang{
  display:flex;align-items:center;gap:7px;
  font-family:var(--cr-mono);font-size:10.5px;color:#a1a1aa;
  font-weight:500;text-transform:lowercase;letter-spacing:.04em;
}
.cr-code-lang-dot{
  width:6px;height:6px;border-radius:50%;background:#71717a;flex-shrink:0;
}
.cr-code-copy{
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.10);
  color:#a1a1aa;font-size:11px;font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:500;padding:4px 10px;border-radius:5px;cursor:pointer;
  transition:all .15s;
}
.cr-code-copy:hover{background:rgba(255,255,255,.14);color:#d4d4d8;}
.cr-code-copy.cr-copied{background:rgba(52,211,153,.12);color:#34d399;border-color:rgba(52,211,153,.25);}
.cr-code-pre{margin:0;background:#18181b;padding:18px 20px;overflow-x:auto;}
.cr-code-pre code{
  font-family:var(--cr-mono);font-size:12.5px;line-height:1.75;
  color:#e4e4e7;background:none;border:none;padding:0;display:block;
}

/* ── MATH BLOCKS ── */
.cr-math-formula{
  background:linear-gradient(135deg,#eff6ff,#dbeafe);
  border:1px solid #bfdbfe;border-radius:var(--cr-r);
  padding:14px 18px;margin:8px 0;
  font-family:var(--cr-mono);font-size:14px;
  color:#1d4ed8;line-height:1.9;overflow-x:auto;white-space:pre-wrap;
  word-break:break-word;
}
.cr-math-formula-lbl{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;
  color:#2563eb;margin-bottom:6px;opacity:.7;
}
.cr-math-answer{
  background:linear-gradient(135deg,#f0fdf4,#dcfce7);
  border:1.5px solid #86efac;border-radius:var(--cr-r);
  padding:16px 20px;margin:10px 0;
  display:flex;flex-direction:column;gap:6px;
}
.cr-math-answer-lbl{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:#16a34a;
}
.cr-math-answer-val{
  font-family:var(--cr-mono);font-size:16px;font-weight:600;
  color:#14532d;line-height:1.65;white-space:pre-wrap;
}
.cr-math-verify{
  background:#eff6ff;border:1px solid #bfdbfe;
  border-left:3px solid #3b82f6;border-radius:0 var(--cr-r) var(--cr-r) 0;
  padding:12px 16px;font-size:13px;color:#1e40af;
  line-height:1.7;margin:8px 0;
}

/* ── STEP TIMELINE ── */
.cr-steps{display:flex;flex-direction:column;gap:0;}
.cr-step{display:flex;gap:0;align-items:stretch;}
.cr-step-rail{
  display:flex;flex-direction:column;align-items:center;
  width:48px;flex-shrink:0;padding-top:18px;
}
.cr-step-num{
  width:30px;height:30px;border-radius:50%;flex-shrink:0;
  background:var(--cr-tx);color:#fff;
  font-size:12px;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 2px 8px rgba(0,0,0,.15);
  font-family:'Plus Jakarta Sans',sans-serif;
}
.cr-step-line{
  width:1.5px;flex:1;background:var(--cr-bdr);margin-top:8px;min-height:24px;
}
.cr-step:last-child .cr-step-line{display:none;}
.cr-step-body{flex:1;padding:16px 20px 16px 0;}
.cr-step-title{
  font-size:14px;font-weight:700;color:var(--cr-tx);
  margin-bottom:6px;letter-spacing:-.01em;
}
.cr-step-desc{font-size:13.5px;color:var(--cr-tx2);line-height:1.75;}

/* ── TABLE ── */
.cr-table-wrap{
  overflow-x:auto;border-radius:var(--cr-r);
  border:1px solid var(--cr-bdr);margin:10px 0;
  box-shadow:0 1px 6px rgba(0,0,0,.04);
}
.cr-table{width:100%;border-collapse:collapse;font-size:13px;}
.cr-table thead th{
  background:#18181b;color:#f4f4f5;
  padding:11px 16px;font-size:11px;font-weight:600;text-align:left;
  letter-spacing:.05em;text-transform:uppercase;
}
.cr-table thead th:first-child{background:#111827;}
.cr-table tbody td{
  padding:10px 16px;border-bottom:1px solid var(--cr-bdr);
  vertical-align:top;color:var(--cr-tx);font-size:13px;
}
.cr-table tbody tr:last-child td{border-bottom:none;}
.cr-table tbody tr:nth-child(even) td{background:#f9fafb;}
.cr-table tbody td:first-child{font-weight:600;color:var(--cr-tx2);}

/* ── STATUS BADGES ── */
.cr-badge{padding:3px 8px;border-radius:99px;font-size:10.5px;font-weight:700;white-space:nowrap;}
.cr-badge-red{background:#fee2e2;color:#991b1b;}
.cr-badge-amber{background:#fef3c7;color:#92400e;}
.cr-badge-green{background:#d1fae5;color:#065f46;}
.cr-badge-blue{background:#dbeafe;color:#1e40af;}

/* ── LIST CARDS ── */
.cr-list{display:flex;flex-direction:column;gap:8px;}
.cr-list-item{
  display:flex;gap:14px;align-items:flex-start;
  padding:14px 16px;border:1.5px solid var(--cr-bdr);
  border-radius:var(--cr-r);background:#fff;
  transition:all .18s cubic-bezier(.16,1,.3,1);
}
.cr-list-item:hover{
  background:var(--cr-bg2);border-color:var(--cr-bdr2);
  box-shadow:0 4px 16px rgba(0,0,0,.06);transform:translateY(-1px);
}
.cr-list-num{
  width:28px;height:28px;border-radius:8px;flex-shrink:0;
  margin-top:1px;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;
  font-family:'Plus Jakarta Sans',sans-serif;
}
.cr-list-bul{
  width:28px;height:28px;border-radius:8px;flex-shrink:0;
  margin-top:1px;background:var(--cr-bg3);
  border:1px solid var(--cr-bdr);
  display:flex;align-items:center;justify-content:center;
  color:var(--cr-tx4);font-size:10px;
}
.cr-list-title{
  font-size:14px;font-weight:700;color:var(--cr-tx);
  line-height:1.4;margin-bottom:3px;letter-spacing:-.01em;
}
.cr-list-sub{font-size:13px;color:var(--cr-tx2);line-height:1.65;}

/* ── RESEARCH SECTIONS ── */
.cr-rsec{padding:18px 20px;border-bottom:1px solid var(--cr-bdr);}
.cr-rsec:last-child{border-bottom:none;}
.cr-rsec-hd{
  display:flex;align-items:center;gap:10px;
  font-size:14px;font-weight:700;color:var(--cr-tx);
  margin-bottom:10px;letter-spacing:-.01em;
}
.cr-rsec-hd-bar{width:3px;height:18px;border-radius:2px;background:var(--cr-acc);flex-shrink:0;}

/* ── CALLOUTS ── */
.cr-callout{
  display:flex;align-items:flex-start;gap:11px;
  padding:12px 16px;border-radius:var(--cr-r);
  border-left:3px solid;font-size:13.5px;line-height:1.7;margin:10px 0;
}
.cr-callout.info{background:#eff6ff;border-color:#3b82f6;color:#1e3a8a;}
.cr-callout.warn{background:#fffbeb;border-color:#f59e0b;color:#78350f;}
.cr-callout.tip{background:#ecfdf5;border-color:#10b981;color:#064e3b;}
.cr-callout.danger{background:#fef2f2;border-color:#ef4444;color:#7f1d1d;}
.cr-callout-icon{flex-shrink:0;margin-top:1px;font-size:14px;}

/* ── DIAGNOSIS ── */
.cr-diag{display:flex;flex-direction:column;gap:8px;}
.cr-diag-item{border-radius:var(--cr-r);overflow:hidden;border:1.5px solid;}
.cr-diag-item.sev-critical{border-color:#fecaca;}
.cr-diag-item.sev-high{border-color:#fdba74;}
.cr-diag-item.sev-medium{border-color:#fde68a;}
.cr-diag-item.sev-low{border-color:#bbf7d0;}
.cr-diag-item.sev-info{border-color:var(--cr-bdr);}
.cr-diag-hd{
  display:flex;align-items:center;gap:8px;
  padding:10px 14px;font-size:13px;font-weight:600;
}
.sev-critical .cr-diag-hd{background:#fee2e2;color:#7f1d1d;}
.sev-high .cr-diag-hd{background:#fff7ed;color:#9a3412;}
.sev-medium .cr-diag-hd{background:#fefce8;color:#713f12;}
.sev-low .cr-diag-hd{background:#f0fdf4;color:#14532d;}
.sev-info .cr-diag-hd{background:#f9fafb;color:var(--cr-tx2);}
.cr-diag-sev-tag{
  font-size:9.5px;font-weight:700;text-transform:uppercase;
  letter-spacing:.05em;padding:2px 8px;border-radius:99px;margin-left:auto;
}
.sev-critical .cr-diag-sev-tag{background:#fecaca;color:#7f1d1d;}
.sev-high .cr-diag-sev-tag{background:#fed7aa;color:#7c2d12;}
.sev-medium .cr-diag-sev-tag{background:#fef08a;color:#713f12;}
.sev-low .cr-diag-sev-tag{background:#bbf7d0;color:#14532d;}
.sev-info .cr-diag-sev-tag{background:var(--cr-bg3);color:var(--cr-tx3);}
.cr-diag-bd{
  padding:10px 14px;font-size:13px;color:var(--cr-tx2);
  line-height:1.7;border-top:1px solid rgba(0,0,0,.05);
}

/* ── COMPARISON TABLE ── */
.cr-compare{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0;}
@media(max-width:540px){.cr-compare{grid-template-columns:1fr;}}
.cr-cmp-col{border:1.5px solid var(--cr-bdr);border-radius:var(--cr-r);overflow:hidden;}
.cr-cmp-col-hd{
  padding:12px 16px;font-size:13.5px;font-weight:700;
  letter-spacing:-.01em;
}
.cr-cmp-col.col-a .cr-cmp-col-hd{background:#18181b;color:#f4f4f5;}
.cr-cmp-col.col-b .cr-cmp-col-hd{background:#fffbeb;color:#92400e;border-bottom:1px solid #fde68a;}
.cr-cmp-attrs{padding:12px 16px;display:flex;flex-direction:column;gap:0;}
.cr-cmp-attr{padding:8px 0;border-bottom:1px solid var(--cr-bdr);}
.cr-cmp-attr:last-child{border-bottom:none;}
.cr-cmp-attr-lbl{
  font-size:9.5px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:var(--cr-tx4);margin-bottom:2px;
}
.cr-cmp-attr-val{font-size:13.5px;color:var(--cr-tx);line-height:1.55;}

/* ── VERDICT BOX ── */
.cr-verdict{
  display:flex;align-items:flex-start;gap:12px;
  border:1.5px solid var(--cr-bdr2);border-radius:var(--cr-r);
  padding:14px 18px;margin-top:10px;background:#f9fafb;
}
.cr-verdict-icon{
  font-family:var(--cr-serif);font-style:italic;font-size:20px;
  color:var(--cr-acc);flex-shrink:0;margin-top:1px;
}
.cr-verdict strong{
  display:block;font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:var(--cr-acc);margin-bottom:4px;
}
.cr-verdict p{font-size:13.5px;color:var(--cr-tx);line-height:1.65;margin:0;}

/* ── MERMAID ── */
.cr-mermaid{
  background:var(--cr-bg2);border:1px solid var(--cr-bdr);
  border-radius:var(--cr-r);padding:20px;margin:10px 0;
  text-align:center;overflow-x:auto;
}
.cr-mermaid svg{max-width:100%;height:auto;}

/* ── CHAT SIMPLE ── */
.cr-chat{
  font-size:14px;line-height:1.8;color:var(--cr-tx);
}
.cr-chat p{margin:0 0 10px;}
.cr-chat p:last-child{margin-bottom:0;}
.cr-chat ul,.cr-chat ol{padding-left:20px;margin:5px 0 10px;}
.cr-chat li{margin-bottom:5px;line-height:1.65;}

/* ── STREAMING STATE ── */
.cr-streaming{opacity:.92;}
.cr-cursor::after{
  content:'▋';animation:cr-blink .65s step-end infinite;
  margin-left:1px;color:var(--cr-acc);
}
@keyframes cr-blink{0%,100%{opacity:1}50%{opacity:0}}

/* ── METRIC STRIP (data domain) ── */
.cr-metrics{
  display:flex;gap:0;border:1px solid var(--cr-bdr);
  border-radius:var(--cr-r);overflow:hidden;margin:10px 0;
}
.cr-metric{
  flex:1;padding:14px 16px;border-right:1px solid var(--cr-bdr);
  display:flex;flex-direction:column;gap:3px;
}
.cr-metric:last-child{border-right:none;}
.cr-metric-val{
  font-family:var(--cr-serif);font-size:22px;font-weight:400;
  color:var(--cr-tx);line-height:1.2;
}
.cr-metric-lbl{
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:var(--cr-tx3);
}
.cr-metric-delta{font-size:12px;font-weight:600;}
.cr-metric-delta.pos{color:#16a34a;}
.cr-metric-delta.neg{color:#dc2626;}

/* ── ARCHITECTURE DIAGRAM ── */
.cr-arch{border:1px solid var(--cr-bdr);border-radius:var(--cr-r);overflow:hidden;margin:10px 0;}
.cr-arch-layer{border-bottom:1px solid var(--cr-bdr);}
.cr-arch-layer:last-child{border-bottom:none;}
.cr-arch-layer-hd{
  padding:8px 14px;background:var(--cr-bg2);
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.06em;color:var(--cr-tx3);border-bottom:1px solid var(--cr-bdr);
}
.cr-arch-components{display:flex;flex-wrap:wrap;gap:6px;padding:10px 14px;}
.cr-arch-comp{
  padding:5px 12px;background:#fff;border:1.5px solid var(--cr-bdr2);
  border-radius:99px;font-size:12px;color:var(--cr-tx);font-weight:500;
  transition:all .15s;
}
.cr-arch-comp:hover{background:var(--cr-bg3);border-color:var(--cr-acc);}

/* ── SCENARIO CARDS (finance) ── */
.cr-scenarios{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:10px 0;}
@media(max-width:540px){.cr-scenarios{grid-template-columns:1fr;}}
.cr-scenario{border:1.5px solid var(--cr-bdr);border-radius:var(--cr-r);overflow:hidden;}
.cr-scenario-hd{padding:10px 14px;border-bottom:1px solid var(--cr-bdr);}
.cr-scenario.bear .cr-scenario-hd{background:#fef2f2;}
.cr-scenario.base .cr-scenario-hd{background:#fffbeb;}
.cr-scenario.bull .cr-scenario-hd{background:#f0fdf4;}
.cr-scenario-name{
  font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;
}
.bear .cr-scenario-name{color:#991b1b;}
.base .cr-scenario-name{color:#92400e;}
.bull .cr-scenario-name{color:#14532d;}
.cr-scenario-body{padding:12px 14px;display:flex;flex-direction:column;gap:5px;}
.cr-scenario-row{display:flex;gap:8px;font-size:12.5px;}
.cr-scenario-lbl{font-weight:600;color:var(--cr-tx3);min-width:80px;flex-shrink:0;}

/* ── PROGRESS / HEALTH STRIP ── */
.cr-health{
  display:flex;align-items:center;gap:14px;
  padding:14px 20px;background:var(--cr-bg2);border-bottom:1px solid var(--cr-bdr);
}
.cr-health-score{
  font-family:var(--cr-serif);font-size:32px;font-weight:400;
  line-height:1;flex-shrink:0;
}
.cr-health-lbl{font-size:12px;font-weight:600;margin-bottom:4px;}
.cr-health-bar{height:5px;background:var(--cr-bg3);border-radius:3px;overflow:hidden;flex:1;}
.cr-health-fill{height:100%;border-radius:3px;transition:width .8s ease;}
.health-critical{color:#dc2626;}.fill-critical{background:#dc2626;}
.health-risk{color:#f97316;}.fill-risk{background:#f97316;}
.health-ok{color:#f59e0b;}.fill-ok{background:#f59e0b;}
.health-good{color:#22c55e;}.fill-good{background:#22c55e;}
.health-excellent{color:#06b6d4;}.fill-excellent{background:#06b6d4;}

/* ── INSIGHT ITEMS ── */
.cr-insights{display:flex;flex-direction:column;gap:7px;}
.cr-insight{
  display:flex;gap:12px;padding:12px 14px;
  border:1px solid var(--cr-bdr);border-radius:var(--cr-r);
  background:#fff;
}
.cr-insight.pos{border-left:3px solid #22c55e;}
.cr-insight.neg{border-left:3px solid #ef4444;}
.cr-insight.neu{border-left:3px solid var(--cr-bdr2);}
.cr-insight-dot{
  width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;
}
.pos .cr-insight-dot{background:#22c55e;}
.neg .cr-insight-dot{background:#ef4444;}
.neu .cr-insight-dot{background:var(--cr-bdr2);}
.cr-insight-title{font-size:13px;font-weight:700;margin-bottom:3px;color:var(--cr-tx);}
.cr-insight-body{font-size:12.5px;color:var(--cr-tx2);line-height:1.6;}

/* ── CHIP (small domain pill inside messages) ── */
.cr-chip{
  display:inline-flex;align-items:center;gap:5px;
  padding:3px 10px;border-radius:99px;
  font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  margin-bottom:10px;
}
`;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────
   UTILITIES
───────────────────────────────────────── */
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function inlineMd(s) {
  s = esc(s);
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]{1,120})\*/g, '<em>$1</em>');
  s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--cr-acc);text-underline-offset:3px;">$1</a>');
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
    btn.innerHTML = '✓ Copied';
    setTimeout(() => { btn.classList.remove('cr-copied'); btn.innerHTML = orig; }, 2200);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok).catch(() => { fbCopy(text); ok(); });
  else { fbCopy(text); ok(); }
}

function fbCopy(t) {
  const el = document.createElement('textarea');
  el.value = t; el.style.cssText = 'position:fixed;top:-9999px';
  document.body.appendChild(el); el.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(el);
}

function healthClass(n) {
  if (n <= 35) return 'critical';
  if (n <= 55) return 'risk';
  if (n <= 72) return 'ok';
  if (n <= 88) return 'good';
  return 'excellent';
}

/* ─────────────────────────────────────────
   OUTPUT TYPE DETECTION
───────────────────────────────────────── */
function detectOutputType(userQuery, responseText) {
  const q = (userQuery || '').toLowerCase();
  const r = responseText || '';

  if (/```[\w]*\n/.test(r) && (r.match(/```/g)||[]).length >= 2) return 'code';
  if (/\$\$[\s\S]+?\$\$/.test(r) || /\\\([\s\S]+?\\\)/.test(r)) return 'math';

  const isMathDomain = /\b(solve|calculate|compute|prove|integral|derivative|equation|formula|simplify|factor|differentiate|integrate|theorem|lemma|algebra|calculus|matrix|determinant|eigenvalue|probability|statistics|permutation|binomial|limit|series|sequence|trigonometry|logarithm)\b/.test(q);
  if (isMathDomain) return 'math';

  if (/\b(vs\.?|versus|compare|comparison|difference between|which is better|pros and cons)\b/i.test(q)) return 'comparison';
  if ((r.match(/\|\s*[-:]+\s*\|/g)||[]).length > 0 && r.includes('\n')) return 'table';
  if (/\b(how to|how do i|guide|walk me through|tutorial|setup|install|configure|deploy|step by step)\b/.test(q)) return 'steps';
  if (/^Step\s+\d+/im.test(r) && (r.match(/^Step\s+\d+/gim)||[]).length >= 2) return 'steps';
  if (/^\d+\.\s+\*\*/m.test(r) && (r.match(/^\d+\./gm)||[]).length >= 3) return 'steps';
  if (/\b(why is|what's wrong|diagnose|debug|troubleshoot|root cause|not working)\b/.test(q)) return 'diagnosis';
  if (/\b(list|give me|top \d+|best \d+|recommend|suggest|options for|examples of|name \d+)\b/.test(q)) return 'list';
  if ((r.match(/^[-*•]\s/gm)||[]).length >= 4) return 'list';
  if (/\b(what is|explain|describe|tell me about|overview|history|how does|elaborate)\b/.test(q) && r.length > 400) return 'research';
  if ((r.match(/^#{2,3}\s/gm)||[]).length >= 2) return 'research';
  if (r.length < 250) return 'chat';
  if (r.length > 700) return 'research';
  return 'chat';
}

/* ─────────────────────────────────────────
   PARSERS
───────────────────────────────────────── */
function parseCodeBlocks(text) {
  const segs = []; let lastIndex = 0;
  const re = /```([\w-]*)\n?([\s\S]*?)```/g; let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) segs.push({ type:'prose', content:text.slice(lastIndex, m.index) });
    segs.push({ type:'code', lang:m[1]||'plaintext', content:m[2].trim() });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) segs.push({ type:'prose', content:text.slice(lastIndex) });
  return segs;
}

function parseTable(text) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && /^[\s|:-]+$/.test(lines[i+1].trim())) { start = i; break; }
  }
  if (start === -1) return null;
  let end = start + 2;
  while (end < lines.length && lines[end].includes('|') && lines[end].trim()) end++;
  const parseRow = l => l.trim().replace(/^\||\|$/g,'').split('|').map(c => c.trim());
  const headers = parseRow(lines[start]);
  const rows = lines.slice(start + 2, end).filter(l => !/^[\s|:-]+$/.test(l)).map(parseRow);
  if (!headers.length || !rows.length) return null;
  return { headers, rows, startLine:start, endLine:end };
}

function parseSteps(text) {
  const steps = []; let m;
  const re1 = /step\s+(\d+)\s*[—–:.\-]+\s*([^\n]+)([\s\S]*?)(?=step\s+\d+\s*[—–:.\-]|$)/gi;
  while ((m = re1.exec(text)) !== null) steps.push({ num:m[1], title:m[2].trim(), body:m[3].trim() });
  if (steps.length >= 2) return steps;
  steps.length = 0;
  const re2 = /^(\d+)[.)]\s+(?:\*\*([^*\n]+)\*\*[\s\-–:]*(.+)?|([^\n]+))([\s\S]*?)(?=^\d+[.)]\s|\Z)/gm;
  while ((m = re2.exec(text)) !== null) {
    const title = (m[2]||m[4]||'').trim();
    const inline = (m[3]||'').trim();
    const rest = (m[5]||'').replace(/^\n+/,'').trim();
    if (title) steps.push({ num:m[1], title, body:(inline+(inline&&rest?' ':'')+rest).trim() });
  }
  return steps;
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
  const sections = []; const re = /^(#{2,3})\s+(.+)$/gm;
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

/* ─────────────────────────────────────────
   BLOCK BUILDERS
───────────────────────────────────────── */
function buildCodeBlock(lang, code) {
  if (lang === 'mermaid') {
    const wrap = mkEl('div', 'cr-mermaid');
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
  const langEl = mkEl('div', 'cr-code-lang');
  langEl.innerHTML = `<span class="cr-code-lang-dot"></span>${esc(lang || 'code')}`;
  const copyBtn = mkEl('button', 'cr-code-copy', 'Copy');
  copyBtn.onclick = () => copyToClipboard(code, copyBtn);
  bar.appendChild(langEl); bar.appendChild(copyBtn);
  const pre = mkEl('pre', 'cr-code-pre');
  const codeEl = mkEl('code');
  if (lang && lang !== 'plaintext') codeEl.className = `language-${lang}`;
  codeEl.textContent = code;
  try { if (window.hljs) window.hljs.highlightElement(codeEl); } catch(e) {}
  pre.appendChild(codeEl); wrap.appendChild(bar); wrap.appendChild(pre);
  return wrap;
}

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
    if (/^---+$/.test(l)) { append(mkEl('hr')); continue; }

    if (/^(⚠️|warning:|⚠ )/i.test(l)) { const co = mkEl('div','cr-callout warn'); co.innerHTML = '<span class="cr-callout-icon">⚠️</span><span>' + inlineMd(l.replace(/^⚠️?\s*warning:?\s*/i,'')) + '</span>'; append(co); continue; }
    if (/^(💡|tip:|hint:)/i.test(l)) { const co = mkEl('div','cr-callout tip'); co.innerHTML = '<span class="cr-callout-icon">💡</span><span>' + inlineMd(l.replace(/^💡\s*tip:?\s*/i,'')) + '</span>'; append(co); continue; }
    if (/^(ℹ️|info:|note:)/i.test(l)) { const co = mkEl('div','cr-callout info'); co.innerHTML = '<span class="cr-callout-icon">ℹ️</span><span>' + inlineMd(l.replace(/^ℹ️?\s*(?:info|note):?\s*/i,'')) + '</span>'; append(co); continue; }
    if (/^(🚨|danger:|critical:)/i.test(l)) { const co = mkEl('div','cr-callout danger'); co.innerHTML = '<span class="cr-callout-icon">🚨</span><span>' + inlineMd(l.replace(/^🚨\s*(?:danger|critical):?\s*/i,'')) + '</span>'; append(co); continue; }
    if (/^> /.test(l)) { const bq = mkEl('blockquote'); bq.innerHTML = inlineMd(l.slice(2)); append(bq); continue; }

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

function buildCardShell(domain, titleText) {
  const cfg = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.general;
  const id = 'cr_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);

  const card = mkEl('div', 'cr-card');
  card.style.setProperty('--cr-acc', cfg.accent);
  card.style.setProperty('--cr-acc-bg', cfg.accentBg);
  card.style.setProperty('--cr-acc-bdr', cfg.accentBdr);

  const hd = mkEl('div', 'cr-hd');
  const left = mkEl('div', 'cr-hd-left');

  const tag = mkEl('div', 'cr-domain-tag');
  tag.style.cssText = `background:${cfg.accentBg};color:${cfg.accent};border:1px solid ${cfg.accentBdr};`;
  tag.textContent = cfg.label;

  const title = mkEl('div', 'cr-hd-title');
  title.textContent = titleText || '';

  left.appendChild(tag);
  if (titleText) left.appendChild(title);

  const copyBtn = mkEl('button', 'cr-copy-btn');
  copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`;
  copyBtn.dataset.targetId = id;
  copyBtn.onclick = () => {
    const el = document.getElementById(id);
    copyToClipboard(el ? el.innerText : '', copyBtn);
  };

  hd.appendChild(left); hd.appendChild(copyBtn);
  card.appendChild(hd);

  return { card, id, cfg };
}

function buildDownloadRow(id, domain, label) {
  const row = mkEl('div', 'cr-dl-row');

  const dlTxt = mkEl('button', 'cr-dl-btn cr-dl-dark');
  dlTxt.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download`;
  dlTxt.onclick = () => {
    const el = document.getElementById(id);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([el ? el.innerText : label||''], { type:'text/plain' }));
    a.download = `stremini-${(domain||'response')}-${Date.now()}.txt`;
    a.click();
  };

  const dlMd = mkEl('button', 'cr-dl-btn cr-dl-ghost');
  dlMd.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Markdown`;
  dlMd.onclick = () => {
    const el = document.getElementById(id);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([el ? el.innerText : label||''], { type:'text/markdown' }));
    a.download = `stremini-${(domain||'response')}-${Date.now()}.md`;
    a.click();
  };

  row.appendChild(dlTxt); row.appendChild(dlMd);
  return row;
}

/* ─────────────────────────────────────────
   DOMAIN RENDERERS
───────────────────────────────────────── */

function renderCode(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'code', 'Code Response');
  const bd = mkEl('div', ''); bd.id = id;
  bd.style.padding = '20px';
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
  });
  card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'code'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

function renderMathOutput(text) {
  const { card, id, cfg } = buildCardShell('math', 'Math Solution');
  const isMathLine = t => /[=+\-*/^²³√±∓∫∑]/.test(t) && t.length < 220;

  const sections = parseResearchSections(text);
  const body = mkEl('div', ''); body.id = id;

  sections.forEach(sec => {
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

      hd.onclick = () => {
        const open = secBody.classList.toggle('collapsed');
        chev.classList.toggle('open', !open);
      };
    } else {
      const secBody = mkEl('div', 'cr-section-body');
      buildMathBody(sec.body, secBody, false, false, cfg.accent);
      secEl.appendChild(secBody);
    }
    body.appendChild(secEl);
  });

  card.appendChild(body); card.appendChild(buildDownloadRow(id, 'math', 'Math Solution'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

function buildMathBody(text, container, isAnswer, isVerify, accent) {
  const isMathLine = t => /[=+\-*/^]/.test(t) && t.length < 200;
  const lines = text.split('\n'); let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim(); i++;
    if (!l) continue;

    if (isAnswer && isMathLine(l)) {
      const mathLines = [l];
      while (i < lines.length && isMathLine(lines[i].trim())) { mathLines.push(lines[i].trim()); i++; }
      const box = mkEl('div', 'cr-math-answer');
      box.appendChild(mkEl('div', 'cr-math-answer-lbl', 'Final Answer'));
      box.appendChild(mkEl('div', 'cr-math-answer-val', mathLines.join('\n')));
      container.appendChild(box); continue;
    }

    if (isVerify) {
      const v = mkEl('div', 'cr-math-verify');
      v.innerHTML = '<strong>✓ Verification: </strong>' + inlineMd(l);
      container.appendChild(v); continue;
    }

    if (isMathLine(l)) {
      const mathLines = [l];
      while (i < lines.length && isMathLine(lines[i].trim())) { mathLines.push(lines[i].trim()); i++; }
      const box = mkEl('div', 'cr-math-formula');
      box.appendChild(mkEl('div', 'cr-math-formula-lbl', 'Formula'));
      const fEl = document.createElement('div'); fEl.textContent = mathLines.join('\n'); box.appendChild(fEl);
      container.appendChild(box); continue;
    }

    const prose = buildProseBlock(l, accent);
    container.appendChild(prose);
  }
}

function renderResearch(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'research', domain === 'research' ? 'Research Analysis' : 'Analysis');
  const sections = parseResearchSections(text);
  const body = mkEl('div', ''); body.id = id;

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

function renderSteps(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Step-by-Step Guide');
  const steps = parseSteps(text);

  const firstStepIdx = text.search(/step\s*1|\n1[\.)]\s/i);
  if (firstStepIdx > 0) {
    const intro = text.slice(0, firstStepIdx).trim();
    if (intro) {
      const sum = mkEl('div', 'cr-summary'); sum.innerHTML = inlineMd(intro);
      card.appendChild(sum);
    }
  }

  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '20px';
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

function renderList(text, domain) {
  const items = parseListItems(text);
  const { card, id, cfg } = buildCardShell(domain||'general', `${items.length} Items`);

  const firstItem = text.search(/^(\d+[.)]\s|[-*•]\s)/m);
  if (firstItem > 0) {
    const intro = text.slice(0, firstItem).trim();
    if (intro) {
      const sum = mkEl('div', 'cr-summary'); sum.innerHTML = inlineMd(intro);
      card.appendChild(sum);
    }
  }

  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '16px 20px 20px';
  if (items.length >= 2) {
    const wrap = mkEl('div', 'cr-list');
    items.forEach((item, idx) => {
      const el = mkEl('div', 'cr-list-item');
      const bullet = mkEl('div', item.ordered ? 'cr-list-num' : 'cr-list-bul');
      if (item.ordered) {
        bullet.textContent = item.num || String(idx+1);
        bullet.style.cssText = `background:${cfg.accentBg};color:${cfg.accent};border:1px solid ${cfg.accentBdr};`;
      } else {
        bullet.innerHTML = `<svg width="8" height="8" viewBox="0 0 8 8" fill="${cfg.accent}"><circle cx="4" cy="4" r="3"/></svg>`;
      }
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

function renderComparison(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Comparison');

  if (text.includes('|') && text.match(/\|\s*[-:]+\s*\|/)) {
    const tbl = parseTable(text);
    if (tbl) {
      const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '16px 20px';
      const lines = text.split('\n');
      const pre = lines.slice(0, tbl.startLine).join('\n').trim();
      if (pre) { const sum = mkEl('div', 'cr-summary'); sum.innerHTML = inlineMd(pre); card.appendChild(sum); }
      bd.appendChild(buildTableDOM(tbl));
      const post = lines.slice(tbl.endLine).join('\n').trim();
      if (post) {
        const v = mkEl('div', 'cr-verdict');
        v.innerHTML = `<div class="cr-verdict-icon" style="color:${cfg.accent}">—</div><div><strong style="color:${cfg.accent}">Summary</strong><p>${inlineMd(post.replace(/^#{1,4}\s+[^\n]+\n?/gm,'').trim())}</p></div>`;
        bd.appendChild(v);
      }
      card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'general'));
      const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
    }
  }
  return renderResearch(text, domain);
}

function renderTable(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Data Table');
  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '16px 20px';
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

function renderDiagnosis(text, domain) {
  const { card, id, cfg } = buildCardShell(domain||'general', 'Diagnosis Report');
  const sections = parseResearchSections(text);
  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '16px 20px';
  const sevMap = {
    'critical':'critical','error':'critical','fatal':'critical',
    'high':'high','major':'high','broken':'high','risk':'high',
    'medium':'medium','warning':'medium','issue':'medium','problem':'medium',
    'low':'low','minor':'low','tip':'low','note':'low',
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
    const hd = mkEl('div', 'cr-diag-hd');
    hd.innerHTML = inlineMd(sec.title);
    const tag = mkEl('span', 'cr-diag-sev-tag'); tag.textContent = sev.toUpperCase(); hd.appendChild(tag);
    item.appendChild(hd);
    if (sec.body) {
      const fb = mkEl('div', 'cr-diag-bd');
      fb.appendChild(buildProseBlock(sec.body, cfg.accent));
      item.appendChild(fb);
    }
    diag.appendChild(item);
  });
  if (hasFindings) bd.appendChild(diag); else bd.appendChild(buildProseBlock(text, cfg.accent));
  card.appendChild(bd); card.appendChild(buildDownloadRow(id, domain||'general'));
  const root = mkEl('div', 'cr-root'); root.appendChild(card); return root;
}

function renderChat(text, domain) {
  const cfg = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.general;
  const root = mkEl('div', 'cr-root');
  root.style.setProperty('--cr-acc', cfg.accent);

  if (text.length < 200) {
    const wrap = mkEl('div', 'cr-chat');
    parseCodeBlocks(text).forEach(s => {
      if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) wrap.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
    });
    root.appendChild(wrap); return root;
  }

  const { card, id } = buildCardShell(domain||'general', '');
  const bd = mkEl('div', ''); bd.id = id; bd.style.padding = '18px 20px';
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim(), cfg.accent));
  });
  card.appendChild(bd);
  root.appendChild(card); return root;
}

/* ─────────────────────────────────────────
   MAIN RENDER ENTRY
───────────────────────────────────────── */
function renderOutput(userQuery, responseText, container, domain, isStreaming) {
  injectStyles();

  if (isStreaming) {
    const root = mkEl('div', 'cr-root cr-streaming');
    const cfg = DOMAIN_CONFIG[domain||'general']||DOMAIN_CONFIG.general;
    root.style.setProperty('--cr-acc', cfg.accent);
    const wrap = mkEl('div', 'cr-chat cr-cursor');
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

  const outType = detectOutputType(userQuery, responseText);
  const dom = domain || 'general';

  let el;
  switch (dom) {
    case 'math':
      el = renderMathOutput(responseText); break;
    case 'code':
      el = renderCode(responseText, dom); break;
    case 'data':
    case 'finance':
    case 'competitive':
    case 'architect':
    case 'growth':
    case 'legal':
    case 'concept':
    case 'research':
      if (outType === 'code') el = renderCode(responseText, dom);
      else if (outType === 'steps') el = renderSteps(responseText, dom);
      else el = renderResearch(responseText, dom);
      break;
    default:
      switch (outType) {
        case 'code':       el = renderCode(responseText, dom); break;
        case 'math':       el = renderMathOutput(responseText); break;
        case 'steps':      el = renderSteps(responseText, dom); break;
        case 'comparison': el = renderComparison(responseText, dom); break;
        case 'table':      el = renderTable(responseText, dom); break;
        case 'list':       el = renderList(responseText, dom); break;
        case 'research':   el = renderResearch(responseText, dom); break;
        case 'diagnosis':  el = renderDiagnosis(responseText, dom); break;
        default:           el = renderChat(responseText, dom); break;
      }
  }

  if (container) { container.innerHTML = ''; container.appendChild(el); }
  return el;
}

/* ─────────────────────────────────────────
   STREAMING HELPERS
───────────────────────────────────────── */
function updateStream(text, container) {
  if (!container) return;
  injectStyles();
  const root = mkEl('div', 'cr-root cr-streaming');
  const wrap = mkEl('div', 'cr-chat cr-cursor');
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
  renderOutput(userQuery, fullText, container, domain||'general', false);
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
