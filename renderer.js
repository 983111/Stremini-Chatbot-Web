/* ═══════════════════════════════════════════════════════════════
   STREMINI AI — STRUCTURED OUTPUT RENDERER v3.0
   Every response is structured, beautiful, and agent-quality.
   Each response type gets its own visual identity and layout.
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   QUERY TYPE DETECTION
───────────────────────────────────────── */
const OUTPUT_TYPES = {
  CODE: 'code', EXPLANATION: 'explanation', STEPS: 'steps',
  COMPARISON: 'comparison', RESEARCH: 'research', LIST: 'list',
  MATH: 'math', CREATIVE: 'creative', CHAT: 'chat', TABLE: 'table',
  DIAGNOSIS: 'diagnosis', STRATEGY: 'strategy'
};

function detectOutputType(userQuery, responseText) {
  const q = (userQuery || '').toLowerCase();
  const r = (responseText || '');
  const rLow = r.toLowerCase();

  // Code: fenced blocks or code keywords
  if (/```[\w]*\n/.test(r) && (r.match(/```/g) || []).length >= 2) return OUTPUT_TYPES.CODE;
  if (/\b(write|build|implement|create a function|create a script|debug|fix this|refactor|code|python|javascript|typescript|react|node|rust|go|java|sql|bash|snippet|program|script|function|class|algorithm)\b/.test(q)) return OUTPUT_TYPES.CODE;

  // Math
  if (/\$\$[\s\S]+?\$\$/.test(r) || /\\\([\s\S]+?\\\)/.test(r)) return OUTPUT_TYPES.MATH;
  if (/\b(calculate|compute|solve|equation|formula|integral|derivative|probability|statistics|theorem|prove|proof)\b/.test(q)) return OUTPUT_TYPES.MATH;

  // Comparison: vs/compare
  if (/\b(vs\.?|versus|compare|comparison|difference between|which is better|pros and cons|pros vs cons)\b/i.test(q)) return OUTPUT_TYPES.COMPARISON;
  if ((r.match(/\|\s*[-:]+\s*\|/g) || []).length > 0) return OUTPUT_TYPES.TABLE;

  // Steps
  if (/\b(how to|how do i|guide me|walk me through|tutorial|setup|install|configure|deploy|step by step|steps to|procedure)\b/.test(q)) return OUTPUT_TYPES.STEPS;
  if (/step\s+\d+/i.test(r) && (r.match(/step\s+\d+/gi) || []).length >= 2) return OUTPUT_TYPES.STEPS;
  if (/^\d+\.\s+\*\*/m.test(r) && (r.match(/^\d+\./gm) || []).length >= 3) return OUTPUT_TYPES.STEPS;

  // Diagnosis / Problem analysis
  if (/\b(why is|what's wrong|diagnose|debug|troubleshoot|root cause|analyze the issue|problem with|not working|fix this|error in)\b/.test(q)) return OUTPUT_TYPES.DIAGNOSIS;

  // Strategy / Plan
  if (/\b(strategy|plan|roadmap|approach|framework|design a|build a plan|create a strategy)\b/.test(q) && r.length > 500) return OUTPUT_TYPES.STRATEGY;

  // List
  if (/\b(list|give me|top \d+|best \d+|recommend|suggest|options for|alternatives|examples of|name \d+|what are|enumerate)\b/.test(q)) return OUTPUT_TYPES.LIST;
  if ((r.match(/^[-*•]\s/gm) || []).length >= 4 && r.length < 1200) return OUTPUT_TYPES.LIST;

  // Research / Explanation
  if (/\b(what is|explain|describe|tell me about|overview of|history of|research|analyze|elaborate|break down|how does|summarize)\b/.test(q) && r.length > 600) return OUTPUT_TYPES.RESEARCH;
  if ((r.match(/^#{2,3}\s/gm) || []).length >= 2) return OUTPUT_TYPES.RESEARCH;

  // Creative
  if (/\b(write a|compose|draft|story|poem|essay|blog post|email|letter|creative|caption|narrative)\b/.test(q)) return OUTPUT_TYPES.CREATIVE;

  // Chat / short
  if (r.length < 300) return OUTPUT_TYPES.CHAT;
  if (r.length > 800) return OUTPUT_TYPES.RESEARCH;
  return OUTPUT_TYPES.CHAT;
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
  s = s.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`\n]+?)`/g, '<code class="si-ic">$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

function copyToClipboard(text, btn) {
  const ok = () => {
    const orig = btn.innerHTML;
    btn.classList.add('si-copied');
    btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copied';
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

function mkEl(tag, cls, html) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html !== undefined) el.innerHTML = html;
  return el;
}

/* ─────────────────────────────────────────
   CSS INJECTION
───────────────────────────────────────── */
function injectRendererStyles() {
  if (document.getElementById('si-renderer-styles')) return;
  const s = document.createElement('style');
  s.id = 'si-renderer-styles';
  s.textContent = `
/* ── BASE ── */
.si-root { font-family: var(--font); color: var(--tx); line-height: 1.7; }
.si-ic { font-family: var(--mono) !important; font-size: 12.5px !important; background: var(--code-bg) !important; border: 1px solid var(--bdr) !important; border-radius: 4px !important; padding: 2px 6px !important; color: #b5490d !important; }
.si-root a { color: var(--acc); text-decoration: underline; text-underline-offset: 3px; }
.si-math-inline { font-family: var(--mono); font-size: 0.91em; background: #e0f2fe; color: #0369a1; border-radius: 3px; padding: 1px 4px; }
.si-copied { background: #ecfdf5 !important; color: #059669 !important; border-color: #6ee7b7 !important; }

/* ── RESPONSE CARD SHELL ── */
.si-card {
  background: var(--bg);
  border: 1px solid var(--bdr);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  margin: 2px 0 6px;
}
.si-card-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid var(--bdr);
  background: var(--bg-sub);
}
.si-card-left { display: flex; align-items: center; gap: 8px; }
.si-card-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 20px;
}
.si-card-title { font-size: 12.5px; font-weight: 600; color: var(--tx2); }
.si-copy-btn {
  background: none; border: 1px solid var(--bdr); cursor: pointer;
  font-size: 11px; color: var(--tx3); font-family: var(--font);
  display: flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 5px; transition: all .15s;
}
.si-copy-btn:hover { background: var(--bg-hov); color: var(--tx); }
.si-card-bd { padding: 18px 20px; }
.si-card-bd-scrollable { padding: 0; max-height: 560px; overflow-y: auto; }

/* Badge color variants */
.si-badge-code    { background: #0f172a; color: #7dd3fc; }
.si-badge-steps   { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.si-badge-research{ background: #ede9fe; color: #6d28d9; border: 1px solid #ddd6fe; }
.si-badge-comparison { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.si-badge-list    { background: #fce7f3; color: #9d174d; border: 1px solid #fbcfe8; }
.si-badge-math    { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
.si-badge-creative{ background: #fef9c3; color: #713f12; border: 1px solid #fef08a; }
.si-badge-chat    { background: var(--bg-act); color: var(--tx2); border: 1px solid var(--bdr); }
.si-badge-table   { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.si-badge-diagnosis { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.si-badge-strategy { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

/* ── CODE ── */
.si-code-wrap { border-radius: 10px; overflow: hidden; border: 1px solid var(--bdr); box-shadow: 0 3px 14px rgba(0,0,0,.08); margin: 8px 0; }
.si-code-bar { display: flex; align-items: center; justify-content: space-between; padding: 9px 16px; background: #0f172a; }
.si-code-lang { font-family: var(--mono); font-size: 11px; color: #7dd3fc; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.si-code-lang::before { content:''; display:inline-block; width:7px; height:7px; border-radius:50%; background:#7dd3fc; opacity:.6; }
.si-code-copy { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); color: #94a3b8; font-size: 11px; font-family: var(--font); padding: 4px 10px; border-radius: 5px; cursor: pointer; transition: all .15s; }
.si-code-copy:hover { background: rgba(255,255,255,.16); color: #e2e8f0; }
.si-code-pre { margin: 0; background: #0f172a; padding: 16px 20px; overflow-x: auto; }
.si-code-pre code { font-family: var(--mono); font-size: 13px; line-height: 1.7; color: #e2e8f0; background: none; border: none; padding: 0; display: block; }

/* ── PROSE ── */
.si-prose { display: flex; flex-direction: column; gap: 0; }
.si-prose p { font-size: 14px; line-height: 1.78; margin: 0 0 8px; color: var(--tx); }
.si-prose p:last-child { margin-bottom: 0; }
.si-prose ul, .si-prose ol { padding-left: 20px; margin: 4px 0 10px; }
.si-prose li { font-size: 13.5px; margin-bottom: 5px; line-height: 1.65; color: var(--tx); }
.si-prose h3 { font-size: 14.5px; font-weight: 700; color: var(--tx); margin: 14px 0 6px; letter-spacing: -.01em; }
.si-prose h4 { font-size: 13.5px; font-weight: 600; color: var(--tx2); margin: 10px 0 4px; }
.si-prose hr { border: none; border-top: 1px solid var(--bdr-soft); margin: 12px 0; }
.si-prose blockquote { border-left: 3px solid var(--acc); padding: 7px 0 7px 14px; color: var(--tx2); font-style: italic; background: var(--acc-bg); border-radius: 0 6px 6px 0; margin: 8px 0; }

/* ── STEPS ── */
.si-steps-wrap { display: flex; flex-direction: column; gap: 0; }
.si-step {
  display: flex; gap: 0; align-items: stretch;
  animation: siStepIn .3s ease both;
}
@keyframes siStepIn { from { opacity:0; transform:translateX(-6px) } to { opacity:1; transform:none } }
.si-step:nth-child(1){animation-delay:.04s}.si-step:nth-child(2){animation-delay:.09s}
.si-step:nth-child(3){animation-delay:.14s}.si-step:nth-child(4){animation-delay:.19s}
.si-step:nth-child(5){animation-delay:.24s}.si-step:nth-child(6){animation-delay:.29s}
.si-step-rail { display: flex; flex-direction: column; align-items: center; width: 44px; flex-shrink: 0; padding-top: 16px; }
.si-step-num {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: var(--tx); color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,.14);
}
.si-step-line { width: 2px; flex: 1; background: var(--bdr); margin-top: 6px; min-height: 20px; }
.si-step:last-child .si-step-line { display: none; }
.si-step-body { flex: 1; padding: 14px 18px 14px 0; }
.si-step-title { font-size: 14px; font-weight: 700; color: var(--tx); margin-bottom: 5px; line-height: 1.35; }
.si-step-desc { font-size: 13.5px; color: var(--tx2); line-height: 1.7; }
.si-step-code { margin-top: 10px; }

/* ── COMPARISON TWO-COLUMN ── */
.si-cmp-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
@media(max-width:520px){ .si-cmp-cols { grid-template-columns: 1fr; } }
.si-cmp-col { border: 1.5px solid var(--bdr); border-radius: 11px; overflow: hidden; }
.si-cmp-col-hd { padding: 11px 15px; font-size: 13.5px; font-weight: 700; letter-spacing: -.01em; }
.si-cmp-col-hd.col-a { background: #0f172a; color: #7dd3fc; }
.si-cmp-col-hd.col-b { background: #1c1007; color: #fcd34d; }
.si-cmp-col-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 2px; }
.si-cmp-attr-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--tx3); margin-bottom: 1px; margin-top: 7px; }
.si-cmp-attr-lbl:first-child { margin-top: 0; }
.si-cmp-attr-val { font-size: 13.5px; color: var(--tx); line-height: 1.55; padding-bottom: 7px; border-bottom: 1px solid var(--bdr-soft); }
.si-cmp-attr-val:last-child { border-bottom: none; padding-bottom: 0; }
.si-verdict {
  display: flex; align-items: flex-start; gap: 10px;
  background: var(--acc-bg); border: 1.5px solid var(--acc-bdr);
  border-radius: 10px; padding: 12px 15px; margin-top: 8px;
}
.si-verdict-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
.si-verdict-inner strong { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--acc); margin-bottom: 3px; }
.si-verdict-inner p { font-size: 13.5px; color: var(--tx); line-height: 1.65; margin: 0; }

/* ── MARKDOWN TABLE ── */
.si-table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--bdr); box-shadow: 0 2px 10px rgba(0,0,0,.05); margin: 8px 0; }
.si-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.si-table th { background: var(--tx); color: #fff; padding: 10px 14px; font-size: 12.5px; font-weight: 600; text-align: left; }
.si-table th:first-child { background: #2d2a26; }
.si-table td { padding: 9px 14px; border-bottom: 1px solid var(--bdr-soft); vertical-align: top; color: var(--tx); }
.si-table tr:last-child td { border-bottom: none; }
.si-table tr:nth-child(even) td { background: var(--bg-sub); }
.si-table td:first-child { font-weight: 600; color: var(--tx2); font-size: 12.5px; }

/* ── LIST ── */
.si-list-wrap { display: flex; flex-direction: column; gap: 7px; }
.si-list-item {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 14px; border: 1px solid var(--bdr); border-radius: 11px;
  background: var(--bg); transition: background .15s, box-shadow .15s, border-color .15s;
  animation: siListIn .25s ease both;
}
.si-list-item:hover { background: var(--bg-sub); box-shadow: 0 2px 10px rgba(0,0,0,.05); border-color: #d5cfc7; }
@keyframes siListIn { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:none } }
.si-list-item:nth-child(1){animation-delay:.02s}.si-list-item:nth-child(2){animation-delay:.05s}
.si-list-item:nth-child(3){animation-delay:.08s}.si-list-item:nth-child(4){animation-delay:.11s}
.si-list-item:nth-child(5){animation-delay:.14s}.si-list-item:nth-child(6){animation-delay:.17s}
.si-list-item:nth-child(7){animation-delay:.20s}.si-list-item:nth-child(8){animation-delay:.23s}
.si-list-num {
  width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0; margin-top: 1px;
  background: var(--acc-bg); color: var(--acc); font-size: 12px; font-weight: 700;
  border: 1px solid var(--acc-bdr); display: flex; align-items: center; justify-content: center;
}
.si-list-bullet {
  width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0; margin-top: 1px;
  background: var(--bg-sub); border: 1px solid var(--bdr); display: flex; align-items: center;
  justify-content: center; color: var(--tx3); font-size: 9px; font-weight: 700;
}
.si-list-content { flex: 1; min-width: 0; }
.si-list-title { font-size: 14px; font-weight: 600; color: var(--tx); line-height: 1.4; margin-bottom: 2px; }
.si-list-sub { font-size: 13px; color: var(--tx2); line-height: 1.6; }

/* ── RESEARCH / EXPLANATION ── */
.si-research-wrap { display: flex; flex-direction: column; gap: 0; }
.si-research-section { padding: 14px 20px; border-bottom: 1px solid var(--bdr-soft); }
.si-research-section:last-child { border-bottom: none; }
.si-section-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 13.5px; font-weight: 700; color: var(--tx); margin-bottom: 9px; letter-spacing: -.01em;
}
.si-section-head::before {
  content: ''; width: 3px; height: 16px; background: var(--acc);
  border-radius: 2px; flex-shrink: 0;
}
.si-section-body { font-size: 14px; color: var(--tx); line-height: 1.78; }

/* ── MATH ── */
.si-math-formula-box {
  background: linear-gradient(135deg,#f0f9ff,#e0f2fe);
  border: 1px solid #bae6fd; border-radius: 11px; padding: 14px 18px; margin: 8px 0;
}
.si-math-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #0284c7; margin-bottom: 6px; }
.si-math-formula { font-family: var(--mono); font-size: 15px; color: #0369a1; font-weight: 500; }
.si-math-block { font-family: var(--mono); font-size: 14px; background: linear-gradient(135deg,#f0f9ff,#e0f2fe); border: 1px solid #bae6fd; border-radius: 10px; padding: 12px 16px; color: #0369a1; margin: 10px 0; text-align: center; }
.si-mermaid-wrap { background: var(--bg-sub); border: 1px solid var(--bdr); border-radius: 11px; padding: 20px; margin: 10px 0; text-align: center; overflow-x: auto; }
.si-mermaid-wrap svg { max-width: 100%; height: auto; }

/* ── CREATIVE ── */
.si-creative-wrap { border-left: 3px solid var(--acc); padding: 4px 0 4px 20px; margin: 4px 0; }
.si-creative-wrap p { font-family: 'Lora', Georgia, serif; font-size: 16px; line-height: 1.9; margin: 0 0 14px; color: var(--tx); }
.si-creative-wrap p:last-child { margin-bottom: 0; }

/* ── DIAGNOSIS ── */
.si-diag-wrap { display: flex; flex-direction: column; gap: 8px; }
.si-diag-finding {
  border-radius: 10px; overflow: hidden; border: 1px solid;
}
.si-diag-finding.sev-high { border-color: #fecaca; }
.si-diag-finding.sev-medium { border-color: #fed7aa; }
.si-diag-finding.sev-low { border-color: #fef08a; }
.si-diag-finding.sev-info { border-color: var(--bdr); }
.si-diag-hd {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 13px; font-size: 13px; font-weight: 600;
}
.sev-high .si-diag-hd { background: #fee2e2; color: #991b1b; }
.sev-medium .si-diag-hd { background: #fff7ed; color: #c2410c; }
.sev-low .si-diag-hd { background: #fefce8; color: #713f12; }
.sev-info .si-diag-hd { background: var(--bg-sub); color: var(--tx2); }
.si-diag-bd { padding: 9px 13px; font-size: 13px; color: var(--tx2); line-height: 1.65; border-top: 1px solid rgba(0,0,0,.06); }
.si-sev-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .3px; padding: 2px 7px; border-radius: 9px; margin-left: auto; }
.sev-high .si-sev-tag { background: #fecaca; color: #7f1d1d; }
.sev-medium .si-sev-tag { background: #fed7aa; color: #7c2d12; }
.sev-low .si-sev-tag { background: #fef08a; color: #713f12; }
.sev-info .si-sev-tag { background: var(--bg-act); color: var(--tx2); }

/* ── STRATEGY ── */
.si-strategy-section { padding: 12px 20px; border-bottom: 1px solid var(--bdr-soft); }
.si-strategy-section:last-child { border-bottom: none; }
.si-strategy-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.si-strategy-step-badge {
  width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0;
  background: #f0fdf4; border: 1.5px solid #86efac; color: #15803d;
  font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
}
.si-strategy-title { font-size: 13.5px; font-weight: 700; color: var(--tx); letter-spacing: -.01em; }
.si-strategy-body { font-size: 13.5px; color: var(--tx2); line-height: 1.75; }

/* ── CHAT ── */
.si-chat-wrap { font-size: 14.5px; line-height: 1.78; color: var(--tx); }
.si-chat-wrap p { margin: 0 0 9px; }
.si-chat-wrap p:last-child { margin-bottom: 0; }
.si-chat-wrap ul, .si-chat-wrap ol { padding-left: 20px; margin: 5px 0 10px; }
.si-chat-wrap li { margin-bottom: 5px; line-height: 1.65; }

/* ── INLINE ELEMENTS ── */
.si-callout {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 14px; border-radius: 9px; border-left: 3px solid;
  font-size: 13.5px; line-height: 1.65; margin: 8px 0;
}
.si-callout.info { background: #eff6ff; border-color: #2563eb; color: #1e3a8a; }
.si-callout.warn { background: #fffbeb; border-color: #f59e0b; color: #78350f; }
.si-callout.tip  { background: #d1fae5; border-color: #059669; color: #064e3b; }

/* ── SUMMARY STRIP ── */
.si-summary-strip {
  padding: 11px 16px; background: #fafaf8; border-bottom: 1px solid var(--bdr-soft);
  font-size: 13px; line-height: 1.65; color: var(--tx2); font-style: italic;
}

/* ── DOWNLOAD ROW ── */
.si-dl-row { display: flex; gap: 6px; flex-wrap: wrap; padding: 10px 16px; border-top: 1px solid var(--bdr-soft); background: var(--bg-sub); }
.si-dl-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border: none; border-radius: 7px;
  font-family: var(--font); font-size: 11.5px; font-weight: 500;
  cursor: pointer; transition: all .15s;
}
.si-dl-dark { background: var(--tx); color: #fff; }
.si-dl-dark:hover { background: #2d2a26; transform: translateY(-1px); }
.si-dl-blue { background: #1d4ed8; color: #fff; }
.si-dl-blue:hover { background: #1e40af; transform: translateY(-1px); }
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
  // "Step N — Title" format
  const re1 = /step\s+(\d+)\s*[—–:.\-]+\s*([^\n]+)([\s\S]*?)(?=step\s+\d+\s*[—–:.\-]|$)/gi;
  while ((m = re1.exec(text)) !== null) steps.push({ num: m[1], title: m[2].trim(), body: m[3].trim() });
  if (steps.length >= 2) return steps;
  // "N. **Title** — desc" format
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
      const firstLine = p.split('\n')[0];
      const dot = firstLine.indexOf('.');
      const title = dot > 0 && dot < 55 ? firstLine.slice(0, dot).trim() : null;
      sections.push({ title, body: p.trim() });
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
    wrap.innerHTML = `<div class="mermaid">${esc(code)}</div>`;
    requestAnimationFrame(() => {
      try { if (window.mermaid) mermaid.run({ nodes: [wrap.querySelector('.mermaid')] }); } catch (e) {}
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

    // Callouts
    if (/^(⚠️|warning:|note:)/i.test(l)) {
      const co = mkEl('div', 'si-callout warn'); co.innerHTML = inlineMd(l); append(co); continue;
    }
    if (/^(💡|tip:)/i.test(l)) {
      const co = mkEl('div', 'si-callout tip'); co.innerHTML = inlineMd(l); append(co); continue;
    }
    if (/^(ℹ️|info:)/i.test(l)) {
      const co = mkEl('div', 'si-callout info'); co.innerHTML = inlineMd(l); append(co); continue;
    }

    // Blockquote
    if (/^> /.test(l)) {
      const bq = mkEl('blockquote'); bq.innerHTML = inlineMd(l.slice(2)); append(bq); continue;
    }

    // Headings
    const hm = l.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const tag = ['h3', 'h3', 'h4', 'h4'][hm[1].length - 1] || 'h4';
      const h = mkEl(tag); h.innerHTML = inlineMd(hm[2]); append(h); continue;
    }

    // UL
    if (/^[-*•]\s/.test(l)) {
      if (listTag !== 'UL') { flush(); currentList = mkEl('ul'); listTag = 'UL'; div.appendChild(currentList); }
      const li = mkEl('li'); li.innerHTML = inlineMd(l.replace(/^[-*•]\s+/, '')); currentList.appendChild(li); continue;
    }

    // OL
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

function buildCardShell(badgeClass, badgeLabel, cardTitle, contentId) {
  const card = mkEl('div', 'si-card');
  const hd = mkEl('div', 'si-card-hd');
  const left = mkEl('div', 'si-card-left');
  const badge = mkEl('div', `si-card-badge si-badge-${badgeClass}`);
  badge.textContent = badgeLabel;
  const title = mkEl('div', 'si-card-title');
  title.textContent = cardTitle;
  left.appendChild(badge); left.appendChild(title);
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
   TYPE-SPECIFIC BUILDERS
───────────────────────────────────────── */

// ── CODE ──
function buildCodeOutput(text) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell('code', '⌨ Code', 'Code Response', pid);
  const bd = mkEl('div', 'si-card-bd');
  bd.id = pid;
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim()));
  });
  card.appendChild(bd);
  card.appendChild(buildDownloadRow(pid, 'code'));
  const root = mkEl('div', 'si-root'); root.appendChild(card);
  return root;
}

// ── STEPS ──
function buildStepsOutput(text) {
  const pid = 'si_' + Date.now();
  const steps = parseSteps(text);
  const card = buildCardShell('steps', '◎ Step-by-Step', `${steps.length || '?'} Steps`, pid);

  // Summary / intro
  const firstStepIdx = text.search(/step\s*1|\n1[\.)]\s/i);
  if (firstStepIdx > 0) {
    const intro = text.slice(0, firstStepIdx).trim();
    if (intro) card.appendChild(mkEl('div', 'si-summary-strip', inlineMd(intro)));
  }

  const bd = mkEl('div', 'si-card-bd'); bd.style.padding = '0'; bd.id = pid;
  if (steps.length >= 2) {
    const wrap = mkEl('div', 'si-steps-wrap');
    steps.forEach(step => {
      const item = mkEl('div', 'si-step');
      item.style.animationDelay = `${(parseInt(step.num) - 1) * 0.06}s`;
      const rail = mkEl('div', 'si-step-rail');
      const num = mkEl('div', 'si-step-num'); num.textContent = step.num;
      const line = mkEl('div', 'si-step-line');
      rail.appendChild(num); rail.appendChild(line);
      const body = mkEl('div', 'si-step-body');
      const title = mkEl('div', 'si-step-title'); title.innerHTML = inlineMd(step.title);
      body.appendChild(title);
      if (step.body) {
        if (/```/.test(step.body)) {
          const sc = mkEl('div', 'si-step-code');
          parseCodeBlocks(step.body).forEach(s => {
            if (s.type === 'code') sc.appendChild(buildCodeBlock(s.lang, s.content));
            else if (s.content.trim()) { const d = mkEl('div', 'si-step-desc'); d.innerHTML = inlineMd(s.content.trim()); sc.appendChild(d); }
          });
          body.appendChild(sc);
        } else {
          const desc = mkEl('div', 'si-step-desc'); desc.innerHTML = inlineMd(step.body.replace(/\n/g, ' ')); body.appendChild(desc);
        }
      }
      item.appendChild(rail); item.appendChild(body);
      wrap.appendChild(item);
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
  const root = mkEl('div', 'si-root'); root.appendChild(card);
  return root;
}

// ── COMPARISON ──
function buildComparisonOutput(text) {
  const pid = 'si_' + Date.now();

  // Check for markdown table first
  if (text.includes('|') && text.match(/\|\s*[-:]+\s*\|/)) {
    const tbl = parseMarkdownTable(text);
    if (tbl) {
      const card = buildCardShell('comparison', '⇄ Comparison', tbl.headers.slice(1).join(' vs ') || 'Comparison', pid);
      const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
      const lines = text.split('\n');
      const pre = lines.slice(0, tbl.startLine).join('\n').trim();
      if (pre) bd.appendChild(buildProseBlock(pre));
      const tableWrap = mkEl('div', 'si-table-wrap');
      const table = mkEl('table', 'si-table');
      const thead = mkEl('thead'); const hr = mkEl('tr');
      tbl.headers.forEach(h => { const th = mkEl('th'); th.innerHTML = inlineMd(h); hr.appendChild(th); });
      thead.appendChild(hr); table.appendChild(thead);
      const tbody = mkEl('tbody');
      tbl.rows.forEach(row => {
        const tr = mkEl('tr');
        tbl.headers.forEach((_, ci) => { const td = mkEl('td'); td.innerHTML = inlineMd(row[ci] || ''); tr.appendChild(td); });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody); tableWrap.appendChild(table); bd.appendChild(tableWrap);
      const post = lines.slice(tbl.endLine).join('\n').trim();
      if (post) {
        const v = mkEl('div', 'si-verdict');
        v.innerHTML = '<span class="si-verdict-icon">💡</span><div class="si-verdict-inner"><strong>Summary</strong><p>' + inlineMd(post.replace(/^#{1,4}\s+[^\n]+\n?/gm, '').trim()) + '</p></div>';
        bd.appendChild(v);
      }
      card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'comparison'));
      const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
    }
  }

  // Two-column card layout from bullet comparison
  const card = buildCardShell('comparison', '⇄ Comparison', 'Side-by-Side', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  const lines = text.split('\n');
  // Find two entity names from first two bullets
  const bullets = lines.filter(l => /^[-*•]\s/.test(l.trim()));
  let entityA = 'Option A', entityB = 'Option B';
  const e0 = (bullets[0] || '').replace(/^[-*•]\s+/, '');
  const e1 = (bullets[1] || '').replace(/^[-*•]\s+/, '');
  const n0 = e0.match(/^([^:–—]{2,30})[:\s–—]/);
  const n1 = e1.match(/^([^:–—]{2,30})[:\s–—]/);
  if (n0 && n1) { entityA = n0[1].trim(); entityB = n1[1].trim(); }

  const cols = mkEl('div', 'si-cmp-cols');
  const colA = mkEl('div', 'si-cmp-col');
  const hdA = mkEl('div', 'si-cmp-col-hd col-a'); hdA.textContent = entityA;
  const bodyA = mkEl('div', 'si-cmp-col-body');
  const colB = mkEl('div', 'si-cmp-col');
  const hdB = mkEl('div', 'si-cmp-col-hd col-b'); hdB.textContent = entityB;
  const bodyB = mkEl('div', 'si-cmp-col-body');

  // Parse bullets as attributes
  const attrs = [];
  bullets.forEach(b => {
    const raw = b.replace(/^[-*•]\s+/, '');
    const kvm = raw.match(/^([^:–—]{2,40})[:\s–—]+(.+)$/);
    if (!kvm) return;
    const label = kvm[1].trim(); const rest = kvm[2].trim();
    // Try to split rest into A|B values
    const splitPat = [
      /^(.+?);\s+(.+)$/,
      /^(.+?)\s+vs\.?\s+(.+)$/i,
      /^(.+?),\s+while\s+(.+)$/i,
      /^(.+?)\s+whereas\s+(.+)$/i,
    ];
    let valA = '', valB = '';
    for (const p of splitPat) { const m = rest.match(p); if (m) { valA = m[1].trim(); valB = m[2].trim(); break; } }
    if (!valA) valA = rest;
    attrs.push({ label, valA, valB });
  });

  attrs.slice(0, 8).forEach(attr => {
    if (attr.valA) {
      bodyA.appendChild(mkEl('div', 'si-cmp-attr-lbl', esc(attr.label)));
      bodyA.appendChild(mkEl('div', 'si-cmp-attr-val', inlineMd(attr.valA)));
    }
    if (attr.valB) {
      bodyB.appendChild(mkEl('div', 'si-cmp-attr-lbl', esc(attr.label)));
      bodyB.appendChild(mkEl('div', 'si-cmp-attr-val', inlineMd(attr.valB)));
    }
  });

  colA.appendChild(hdA); colA.appendChild(bodyA);
  colB.appendChild(hdB); colB.appendChild(bodyB);
  cols.appendChild(colA); cols.appendChild(colB);
  bd.appendChild(cols);

  // Summary / verdict
  const summaryLine = lines.filter(l => /\b(summary|verdict|conclusion|recommend|in short|bottom line)\b/i.test(l)).pop();
  if (summaryLine) {
    const v = mkEl('div', 'si-verdict');
    v.innerHTML = '<span class="si-verdict-icon">💡</span><div class="si-verdict-inner"><strong>Verdict</strong><p>' + inlineMd(summaryLine.replace(/^[-*•#>]\s*/, '')) + '</p></div>';
    bd.appendChild(v);
  }

  // Fallback: if no attrs, just render prose
  if (!attrs.length) { bd.innerHTML = ''; bd.appendChild(buildProseBlock(text)); }

  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'comparison'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── TABLE ──
function buildTableOutput(text) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell('table', '⊞ Table', 'Data Table', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  const lines = text.split('\n');
  const tbl = parseMarkdownTable(text);
  if (tbl) {
    const pre = lines.slice(0, tbl.startLine).join('\n').trim();
    if (pre) bd.appendChild(buildProseBlock(pre));
    const tw = mkEl('div', 'si-table-wrap');
    const table = mkEl('table', 'si-table');
    const thead = mkEl('thead'); const hr = mkEl('tr');
    tbl.headers.forEach(h => { const th = mkEl('th'); th.innerHTML = inlineMd(h); hr.appendChild(th); });
    thead.appendChild(hr); table.appendChild(thead);
    const tbody = mkEl('tbody');
    tbl.rows.forEach(row => {
      const tr = mkEl('tr');
      tbl.headers.forEach((_, ci) => { const td = mkEl('td'); td.innerHTML = inlineMd(row[ci] || ''); tr.appendChild(td); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody); tw.appendChild(table); bd.appendChild(tw);
    const post = lines.slice(tbl.endLine).join('\n').trim();
    if (post) bd.appendChild(buildProseBlock(post));
  } else {
    bd.appendChild(buildProseBlock(text));
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'table'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── LIST ──
function buildListOutput(text) {
  const pid = 'si_' + Date.now();
  const items = parseListItems(text);
  const card = buildCardShell('list', '◉ List', `${items.length} Items`, pid);

  const firstItem = text.search(/^(\d+[.)]\s|[-*•]\s)/m);
  if (firstItem > 0) {
    const intro = text.slice(0, firstItem).trim();
    if (intro) card.appendChild(mkEl('div', 'si-summary-strip', inlineMd(intro)));
  }

  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  if (items.length >= 2) {
    const wrap = mkEl('div', 'si-list-wrap');
    items.forEach((item, idx) => {
      const el = mkEl('div', 'si-list-item');
      el.style.animationDelay = `${idx * 0.04}s`;
      const bullet = mkEl('div', item.ordered ? 'si-list-num' : 'si-list-bullet');
      bullet.textContent = item.ordered ? (item.num || String(idx + 1)) : '◆';
      const content = mkEl('div', 'si-list-content');
      if (item.title) { const t = mkEl('div', 'si-list-title'); t.innerHTML = inlineMd(item.title); content.appendChild(t); }
      if (item.sub) { const s = mkEl('div', 'si-list-sub'); s.innerHTML = inlineMd(item.sub); content.appendChild(s); }
      el.appendChild(bullet); el.appendChild(content); wrap.appendChild(el);
    });
    bd.appendChild(wrap);
  } else {
    bd.appendChild(buildProseBlock(text));
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'list'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── RESEARCH / EXPLANATION ──
function buildResearchOutput(text) {
  const pid = 'si_' + Date.now();
  const sections = parseResearchSections(text);
  const card = buildCardShell('research', '◈ Deep Dive', 'Analysis', pid);

  const bd = mkEl('div', 'si-card-bd-scrollable'); bd.id = pid;
  const wrap = mkEl('div', 'si-research-wrap');
  sections.forEach(sec => {
    const div = mkEl('div', 'si-research-section');
    if (sec.title) {
      const h = mkEl('div', 'si-section-head'); h.innerHTML = inlineMd(sec.title); div.appendChild(h);
    }
    const sbd = mkEl('div', 'si-section-body');
    parseCodeBlocks(sec.body).forEach(s => {
      if (s.type === 'code') sbd.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) sbd.appendChild(buildProseBlock(s.content.trim()));
    });
    div.appendChild(sbd); wrap.appendChild(div);
  });
  bd.appendChild(wrap);
  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'research'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── MATH ──
function buildMathOutput(text) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell('math', '∑ Math', 'Solution', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;
  let lastIndex = 0; let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      const t = text.slice(lastIndex, m.index).trim();
      if (t) bd.appendChild(buildProseBlock(t));
    }
    const box = mkEl('div', 'si-math-formula-box');
    box.appendChild(mkEl('div', 'si-math-label', 'Formula'));
    const f = mkEl('div', 'si-math-formula'); f.textContent = (m[1] || m[2]).trim();
    box.appendChild(f); bd.appendChild(box);
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    const t = text.slice(lastIndex).trim();
    if (t) bd.appendChild(buildProseBlock(t));
  }
  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'math'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── CREATIVE ──
function buildCreativeOutput(text) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell('creative', '✦ Creative', 'Written Piece', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  const wrap = mkEl('div', 'si-creative-wrap');
  text.split(/\n\n+/).forEach(para => {
    if (!para.trim()) return;
    const p = mkEl('p'); p.innerHTML = inlineMd(para.trim().replace(/\n/g, '<br>')); wrap.appendChild(p);
  });
  bd.appendChild(wrap);
  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'creative'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── DIAGNOSIS ──
function buildDiagnosisOutput(text) {
  const pid = 'si_' + Date.now();
  const card = buildCardShell('diagnosis', '⚡ Diagnosis', 'Problem Analysis', pid);

  // Parse sections as findings
  const sections = parseResearchSections(text);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;

  const sevMap = {
    'critical': 'high', 'error': 'high', 'bug': 'high', 'broken': 'high',
    'warning': 'medium', 'issue': 'medium', 'problem': 'medium', 'fix': 'medium',
    'note': 'low', 'tip': 'low', 'suggestion': 'low', 'info': 'info'
  };

  const findings = mkEl('div', 'si-diag-wrap');
  let hasFindings = false;

  sections.forEach(sec => {
    if (!sec.title) {
      // Render intro prose
      bd.appendChild(buildProseBlock(sec.body));
      return;
    }
    hasFindings = true;
    const titleLow = sec.title.toLowerCase();
    let sev = 'info';
    for (const [k, v] of Object.entries(sevMap)) { if (titleLow.includes(k)) { sev = v; break; } }
    const finding = mkEl('div', `si-diag-finding sev-${sev}`);
    const hd = mkEl('div', 'si-diag-hd');
    hd.innerHTML = inlineMd(sec.title);
    const tag = mkEl('span', 'si-sev-tag'); tag.textContent = sev === 'info' ? 'INFO' : sev.toUpperCase(); hd.appendChild(tag);
    finding.appendChild(hd);
    if (sec.body) {
      const fb = mkEl('div', 'si-diag-bd');
      fb.appendChild(buildProseBlock(sec.body));
      finding.appendChild(fb);
    }
    findings.appendChild(finding);
  });

  if (hasFindings) bd.appendChild(findings);
  else bd.appendChild(buildProseBlock(text));

  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'diagnosis'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── STRATEGY ──
function buildStrategyOutput(text) {
  const pid = 'si_' + Date.now();
  const sections = parseResearchSections(text);
  const card = buildCardShell('strategy', '◈ Strategy', 'Strategic Plan', pid);

  const bd = mkEl('div', 'si-card-bd-scrollable'); bd.id = pid;

  sections.forEach((sec, i) => {
    const div = mkEl('div', 'si-strategy-section');
    if (sec.title) {
      const hd = mkEl('div', 'si-strategy-hd');
      const badge = mkEl('div', 'si-strategy-step-badge'); badge.textContent = i + 1;
      const title = mkEl('div', 'si-strategy-title'); title.innerHTML = inlineMd(sec.title);
      hd.appendChild(badge); hd.appendChild(title); div.appendChild(hd);
    }
    const sbd = mkEl('div', 'si-strategy-body');
    parseCodeBlocks(sec.body).forEach(s => {
      if (s.type === 'code') sbd.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) sbd.appendChild(buildProseBlock(s.content.trim()));
    });
    div.appendChild(sbd); bd.appendChild(div);
  });

  card.appendChild(bd); card.appendChild(buildDownloadRow(pid, 'strategy'));
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

// ── CHAT ──
function buildChatOutput(text) {
  const pid = 'si_' + Date.now();
  // Only show card shell for longer responses; keep short ones minimal
  if (text.length < 200) {
    const root = mkEl('div', 'si-root');
    const wrap = mkEl('div', 'si-chat-wrap');
    parseCodeBlocks(text).forEach(s => {
      if (s.type === 'code') wrap.appendChild(buildCodeBlock(s.lang, s.content));
      else if (s.content.trim()) wrap.appendChild(buildProseBlock(s.content.trim()));
    });
    root.appendChild(wrap);
    return root;
  }
  const card = buildCardShell('chat', '◇ Response', 'StreminiAI', pid);
  const bd = mkEl('div', 'si-card-bd'); bd.id = pid;
  parseCodeBlocks(text).forEach(s => {
    if (s.type === 'code') bd.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) bd.appendChild(buildProseBlock(s.content.trim()));
  });
  card.appendChild(bd);
  const root = mkEl('div', 'si-root'); root.appendChild(card); return root;
}

/* ─────────────────────────────────────────
   STREAMING (lightweight live render)
───────────────────────────────────────── */
function updateStreamSmart(partialText, container) {
  if (!container) return;
  injectRendererStyles();
  // During streaming: show raw formatted text, not card
  const div = mkEl('div', 'si-root');
  const chat = mkEl('div', 'si-chat-wrap');
  // Simple inline render for streaming
  partialText.split(/\n\n+/).forEach(para => {
    if (!para.trim()) return;
    if (/```/.test(para)) {
      parseCodeBlocks(para).forEach(s => {
        if (s.type === 'code') chat.appendChild(buildCodeBlock(s.lang, s.content));
        else if (s.content.trim()) { const p = mkEl('p'); p.innerHTML = inlineMd(s.content.trim()); chat.appendChild(p); }
      });
    } else {
      const p = mkEl('p'); p.innerHTML = inlineMd(para.trim()); chat.appendChild(p);
    }
  });
  div.appendChild(chat);
  container.innerHTML = ''; container.appendChild(div);
}

function finalizeStreamSmart(userQuery, fullText, container) {
  if (!container) return;
  renderSmartOutput(userQuery, fullText, container, false);
}

/* ─────────────────────────────────────────
   MAIN ENTRY POINT
───────────────────────────────────────── */
function renderSmartOutput(userQuery, responseText, container, isStreaming) {
  injectRendererStyles();
  const type = isStreaming ? OUTPUT_TYPES.CHAT : detectOutputType(userQuery, responseText);
  let el;
  switch (type) {
    case OUTPUT_TYPES.CODE:       el = buildCodeOutput(responseText);       break;
    case OUTPUT_TYPES.STEPS:      el = buildStepsOutput(responseText);      break;
    case OUTPUT_TYPES.COMPARISON: el = buildComparisonOutput(responseText); break;
    case OUTPUT_TYPES.TABLE:      el = buildTableOutput(responseText);      break;
    case OUTPUT_TYPES.LIST:       el = buildListOutput(responseText);       break;
    case OUTPUT_TYPES.RESEARCH:   el = buildResearchOutput(responseText);   break;
    case OUTPUT_TYPES.EXPLANATION:el = buildResearchOutput(responseText);   break;
    case OUTPUT_TYPES.MATH:       el = buildMathOutput(responseText);       break;
    case OUTPUT_TYPES.CREATIVE:   el = buildCreativeOutput(responseText);   break;
    case OUTPUT_TYPES.DIAGNOSIS:  el = buildDiagnosisOutput(responseText);  break;
    case OUTPUT_TYPES.STRATEGY:   el = buildStrategyOutput(responseText);   break;
    default:                      el = buildChatOutput(responseText);       break;
  }
  if (container) { container.innerHTML = ''; container.appendChild(el); }
  return el;
}

window.StreminiRenderer = {
  render:        renderSmartOutput,
  updateStream:  updateStreamSmart,
  finalizeStream: finalizeStreamSmart,
  detectType:    detectOutputType,
  injectStyles:  injectRendererStyles,
};
