/* ═══════════════════════════════════════════════════════════════
   STREMINI AI — BEAUTIFUL OUTPUT RENDERER v2.0
   Query-type aware, visually distinct rendering system
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. QUERY TYPE DETECTION
───────────────────────────────────────── */
const OUTPUT_TYPES = {
  CODE:        'code',
  EXPLANATION: 'explanation',
  STEPS:       'steps',
  COMPARISON:  'comparison',
  RESEARCH:    'research',
  LIST:        'list',
  MATH:        'math',
  CREATIVE:    'creative',
  CHAT:        'chat',
};

function detectOutputType(userQuery, responseText) {
  const q = (userQuery || '').toLowerCase();
  const r = (responseText || '').toLowerCase();

  // Code patterns
  if (/```[\w]*\n/.test(responseText) && (responseText.match(/```/g)||[]).length >= 2) return OUTPUT_TYPES.CODE;
  if (/\b(write|build|implement|create a function|create a script|debug|fix this|refactor|code|python|javascript|typescript|react|node|rust|go|java|sql|bash)\b/.test(q)) return OUTPUT_TYPES.CODE;

  // Math/formula patterns
  if (/\$\$[\s\S]+?\$\$/.test(responseText) || /\\\([\s\S]+?\\\)/.test(responseText)) return OUTPUT_TYPES.MATH;
  if (/\b(calculate|compute|solve|equation|formula|integral|derivative|probability|statistics)\b/.test(q)) return OUTPUT_TYPES.MATH;

  // Step-by-step patterns
  if (/\bstep\s+\d+/i.test(responseText) || /^\d+\.\s+\*\*/m.test(responseText)) return OUTPUT_TYPES.STEPS;
  if (/\b(how to|how do i|guide me|walk me through|tutorial|setup|install|configure|deploy)\b/.test(q)) return OUTPUT_TYPES.STEPS;

  // Comparison patterns
  if (/\bvs\.?\b|\bversus\b|\bcompare\b|\bcomparison\b/i.test(q)) return OUTPUT_TYPES.COMPARISON;
  if ((responseText.match(/\|\s*[-:]+\s*\|/g)||[]).length > 0) return OUTPUT_TYPES.COMPARISON;

  // Research/deep explanation patterns
  if (/\b(what is|explain|describe|tell me about|overview of|history of|research|analyze|study)\b/.test(q) && responseText.length > 800) return OUTPUT_TYPES.RESEARCH;
  if ((responseText.match(/#{2,3}\s/g)||[]).length >= 3) return OUTPUT_TYPES.RESEARCH;

  // List patterns
  if (/\b(list|give me|top \d+|best \d+|recommend|suggest|options|alternatives|examples of)\b/.test(q)) return OUTPUT_TYPES.LIST;
  if ((responseText.match(/^[-*]\s/gm)||[]).length >= 5) return OUTPUT_TYPES.LIST;

  // Creative writing
  if (/\b(write a|compose|draft|story|poem|essay|blog|email|letter|creative)\b/.test(q)) return OUTPUT_TYPES.CREATIVE;

  // Short chat
  if (responseText.length < 400) return OUTPUT_TYPES.CHAT;

  return OUTPUT_TYPES.EXPLANATION;
}

/* ─────────────────────────────────────────
   2. SHARED UTILITIES
───────────────────────────────────────── */
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function inlineMd(s) {
  s = esc(s);
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`\n]+?)`/g, '<code class="si">$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

function copyToClipboard(text, btn) {
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
    .catch(() => { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); })
    .finally(() => { const orig = btn.innerHTML; btn.innerHTML = '✓ Copied'; btn.classList.add('si-copied'); setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('si-copied'); }, 2000); });
}

/* ─────────────────────────────────────────
   3. CSS INJECTION (once)
───────────────────────────────────────── */
function injectRendererStyles() {
  if (document.getElementById('si-renderer-styles')) return;
  const style = document.createElement('style');
  style.id = 'si-renderer-styles';
  style.textContent = `
/* ── STREMINI RENDERER BASE ── */
.si-root { font-family: var(--font); color: var(--tx); line-height: 1.7; }
.si-root code.si { font-family: var(--mono); font-size: 12.5px; background: var(--code-bg); border: 1px solid var(--bdr); border-radius: 4px; padding: 2px 6px; color: #b5490d; }
.si-root a { color: var(--acc); text-decoration: underline; text-underline-offset: 3px; }
.si-copied { background: #ecfdf5 !important; color: #059669 !important; border-color: #6ee7b7 !important; }

/* ── TYPE BADGE ── */
.si-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 20px; margin-bottom: 14px;
}
.si-badge-code    { background: #1e293b; color: #7dd3fc; }
.si-badge-steps   { background: #fef3c7; color: #92400e; }
.si-badge-research{ background: #ede9fe; color: #6d28d9; }
.si-badge-compare { background: #d1fae5; color: #065f46; }
.si-badge-list    { background: #fce7f3; color: #9d174d; }
.si-badge-math    { background: #e0f2fe; color: #0369a1; }
.si-badge-creative{ background: #fef9c3; color: #713f12; }
.si-badge-chat    { background: #f3f4f6; color: #374151; }

/* ── CODE OUTPUT ── */
.si-code-wrap { border-radius: 14px; overflow: hidden; border: 1px solid var(--bdr); box-shadow: 0 4px 24px rgba(0,0,0,.07); margin: 10px 0; }
.si-code-bar  { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: #0f172a; }
.si-code-lang { font-family: var(--mono); font-size: 11px; color: #7dd3fc; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.si-code-lang::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #7dd3fc; opacity: .7; }
.si-code-copy { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); color: #94a3b8; font-size: 11px; font-family: var(--font); padding: 4px 10px; border-radius: 6px; cursor: pointer; transition: all .15s; }
.si-code-copy:hover { background: rgba(255,255,255,.15); color: #e2e8f0; }
.si-code-pre  { margin: 0; background: #0f172a; padding: 18px 20px; overflow-x: auto; }
.si-code-pre code { font-family: var(--mono); font-size: 13px; line-height: 1.7; color: #e2e8f0; background: none; border: none; padding: 0; display: block; }
.si-prose-wrap { padding: 4px 0; }

/* ── STEPS OUTPUT ── */
.si-steps-list { display: flex; flex-direction: column; gap: 12px; margin: 6px 0; }
.si-step {
  display: flex; gap: 14px; align-items: flex-start;
  background: var(--bg-sub); border: 1px solid var(--bdr);
  border-radius: 12px; padding: 14px 16px;
  transition: box-shadow .2s, border-color .2s;
  animation: siStepIn .3s ease both;
}
.si-step:hover { box-shadow: 0 4px 16px rgba(0,0,0,.06); border-color: #d5cfc7; }
@keyframes siStepIn { from { opacity:0; transform: translateX(-8px); } to { opacity:1; transform:none; } }
.si-step-num {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  background: var(--tx); color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; margin-top: 1px;
}
.si-step-body { flex: 1; min-width: 0; }
.si-step-title { font-size: 14.5px; font-weight: 600; color: var(--tx); margin-bottom: 4px; line-height: 1.35; }
.si-step-desc  { font-size: 13.5px; color: var(--tx2); line-height: 1.65; }
.si-step-code  { margin-top: 10px; }

/* ── RESEARCH OUTPUT ── */
.si-research { display: flex; flex-direction: column; gap: 0; }
.si-research-section { padding: 14px 0; border-bottom: 1px solid var(--bdr-soft); }
.si-research-section:last-child { border-bottom: none; }
.si-section-head {
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 700; color: var(--tx);
  margin-bottom: 10px; letter-spacing: -.01em;
}
.si-section-head::before {
  content: ''; width: 3px; height: 18px; background: var(--acc);
  border-radius: 2px; flex-shrink: 0;
}
.si-section-body { font-size: 14.5px; color: var(--tx); line-height: 1.78; }
.si-section-body p { margin: 0 0 10px; }
.si-section-body p:last-child { margin-bottom: 0; }
.si-section-body ul, .si-section-body ol { padding-left: 20px; margin: 8px 0; }
.si-section-body li { margin-bottom: 6px; line-height: 1.65; }

/* ── COMPARISON OUTPUT ── */
.si-compare-table { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--bdr); box-shadow: 0 2px 12px rgba(0,0,0,.05); margin: 8px 0; }
.si-compare-table th { background: var(--tx); color: #fff; padding: 11px 16px; font-size: 13px; font-weight: 600; text-align: left; letter-spacing: .01em; }
.si-compare-table th:first-child { background: #2d2a26; }
.si-compare-table td { padding: 10px 16px; border-bottom: 1px solid var(--bdr-soft); font-size: 13.5px; vertical-align: top; }
.si-compare-table tr:last-child td { border-bottom: none; }
.si-compare-table tr:nth-child(even) td { background: var(--bg-sub); }
.si-compare-table td:first-child { font-weight: 600; color: var(--tx2); font-size: 13px; background: var(--bg-sub) !important; }
.si-compare-table tr:nth-child(even) td:first-child { background: var(--bg-act) !important; }
.si-compare-pros { display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap; }
.si-compare-card {
  flex: 1; min-width: 200px; border: 1.5px solid var(--bdr); border-radius: 12px;
  overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.04);
}
.si-compare-card-head { padding: 11px 15px; font-size: 14px; font-weight: 700; letter-spacing: -.01em; }
.si-compare-card-head.a { background: #0f172a; color: #7dd3fc; }
.si-compare-card-head.b { background: #1a1207; color: #fcd34d; }
.si-compare-card-body { padding: 12px 15px; }
.si-compare-card-body ul { margin: 0; padding-left: 18px; }
.si-compare-card-body li { font-size: 13.5px; color: var(--tx2); margin-bottom: 5px; line-height: 1.55; }

/* ── LIST OUTPUT ── */
.si-list { display: flex; flex-direction: column; gap: 8px; margin: 6px 0; }
.si-list-item {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 15px; border: 1px solid var(--bdr);
  border-radius: 11px; background: var(--bg);
  transition: background .15s, box-shadow .15s, border-color .15s;
  animation: siListIn .25s ease both;
}
.si-list-item:hover { background: var(--bg-sub); box-shadow: 0 2px 12px rgba(0,0,0,.05); border-color: #d5cfc7; }
@keyframes siListIn { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform:none; } }
.si-list-num {
  width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0; margin-top: 1px;
  background: var(--acc-bg); color: var(--acc); font-size: 11.5px; font-weight: 700;
  border: 1px solid var(--acc-bdr); display: flex; align-items: center; justify-content: center;
}
.si-list-bullet {
  width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0; margin-top: 1px;
  background: var(--bg-sub); border: 1px solid var(--bdr);
  display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--tx3);
}
.si-list-content { flex: 1; min-width: 0; }
.si-list-title { font-size: 14px; font-weight: 600; color: var(--tx); line-height: 1.4; margin-bottom: 2px; }
.si-list-sub   { font-size: 13px; color: var(--tx2); line-height: 1.6; }

/* ── MATH OUTPUT ── */
.si-math-wrap { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 12px; padding: 16px 18px; margin: 8px 0; }
.si-math-formula { font-family: var(--mono); font-size: 15px; color: #0369a1; font-weight: 500; letter-spacing: .02em; margin-bottom: 4px; }
.si-math-label { font-size: 11px; color: #0284c7; text-transform: uppercase; font-weight: 600; letter-spacing: .06em; margin-bottom: 8px; }

/* ── CREATIVE OUTPUT ── */
.si-creative {
  border-left: 3px solid var(--acc); padding: 2px 0 2px 20px; margin: 6px 0;
  font-family: var(--serif, Georgia, serif); font-size: 16px; line-height: 1.9; color: var(--tx);
}
.si-creative p { margin: 0 0 14px; }
.si-creative p:last-child { margin-bottom: 0; }
.si-creative em { font-style: italic; color: var(--tx2); }
.si-creative strong { font-weight: 600; }

/* ── CHAT OUTPUT ── */
.si-chat { font-size: 15px; line-height: 1.78; color: var(--tx); }
.si-chat p { margin: 0 0 10px; }
.si-chat p:last-child { margin-bottom: 0; }
.si-chat strong { font-weight: 600; }
.si-chat em { font-style: italic; color: var(--tx2); }

/* ── VERDICT / SUMMARY BOX ── */
.si-verdict {
  background: var(--acc-bg); border: 1.5px solid var(--acc-bdr);
  border-radius: 11px; padding: 13px 16px; margin-top: 14px;
  font-size: 13.5px; line-height: 1.65; color: var(--tx);
  display: flex; align-items: flex-start; gap: 10px;
}
.si-verdict-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.si-verdict-body { flex: 1; }
.si-verdict strong { color: var(--acc); font-weight: 700; display: block; margin-bottom: 3px; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }

/* ── KEY-VALUE GRID ── */
.si-kv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 8px; margin: 8px 0; }
.si-kv { background: var(--bg-sub); border: 1px solid var(--bdr); border-radius: 9px; padding: 10px 12px; }
.si-kv-key { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--tx3); margin-bottom: 3px; }
.si-kv-val { font-size: 14px; color: var(--tx); font-weight: 500; }

/* ── CALLOUT BOX ── */
.si-callout { display: flex; gap: 10px; padding: 12px 14px; border-radius: 10px; margin: 10px 0; border: 1.5px solid; }
.si-callout-note    { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
.si-callout-warning { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.si-callout-tip     { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
.si-callout-icon { font-size: 15px; flex-shrink: 0; }
.si-callout-body { font-size: 13.5px; line-height: 1.65; }

/* ── INLINE ANSWER (short fact) ── */
.si-answer-card {
  display: flex; align-items: flex-start; gap: 14px;
  background: linear-gradient(135deg, var(--bg-sub) 0%, var(--bg) 100%);
  border: 1.5px solid var(--bdr); border-radius: 14px; padding: 16px 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,.05); margin: 4px 0;
}
.si-answer-icon { font-size: 22px; flex-shrink: 0; line-height: 1; margin-top: 2px; }
.si-answer-body { flex: 1; min-width: 0; }
.si-answer-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--tx3); margin-bottom: 4px; }
.si-answer-text  { font-size: 16px; font-weight: 600; color: var(--tx); line-height: 1.4; }

/* ── COPY BUTTON (generic) ── */
.si-copy-btn {
  display: inline-flex; align-items: center; gap: 4px;
  background: none; border: 1px solid var(--bdr); cursor: pointer;
  font-size: 11.5px; color: var(--tx3); font-family: var(--font);
  padding: 4px 10px; border-radius: 6px; transition: all .15s; margin-top: 10px;
}
.si-copy-btn:hover { background: var(--bg-hov); color: var(--tx); }

/* ── DELIMITER ── */
.si-hr { border: none; border-top: 1px solid var(--bdr-soft); margin: 14px 0; }

/* ── ANIMATION STAGGER ── */
.si-step:nth-child(1) { animation-delay: .03s; }
.si-step:nth-child(2) { animation-delay: .07s; }
.si-step:nth-child(3) { animation-delay: .11s; }
.si-step:nth-child(4) { animation-delay: .15s; }
.si-step:nth-child(5) { animation-delay: .19s; }
.si-step:nth-child(6) { animation-delay: .23s; }
.si-list-item:nth-child(1) { animation-delay: .02s; }
.si-list-item:nth-child(2) { animation-delay: .05s; }
.si-list-item:nth-child(3) { animation-delay: .08s; }
.si-list-item:nth-child(4) { animation-delay: .11s; }
.si-list-item:nth-child(5) { animation-delay: .14s; }
.si-list-item:nth-child(6) { animation-delay: .17s; }
.si-list-item:nth-child(7) { animation-delay: .20s; }
.si-list-item:nth-child(8) { animation-delay: .23s; }
`;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────
   4. PARSERS
───────────────────────────────────────── */
function parseBlocks(text) {
  // Split text into code-fence blocks and prose blocks
  const segments = [];
  let lastIndex = 0;
  const re = /```([\w-]*)\n?([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) segments.push({ type: 'prose', content: text.slice(lastIndex, m.index) });
    segments.push({ type: 'code', lang: m[1] || 'plaintext', content: m[2].trim() });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) segments.push({ type: 'prose', content: text.slice(lastIndex) });
  return segments;
}

function parseStepsFromText(text) {
  const steps = [];

  // Pattern 1: "Step N — Title\nbody"
  const re1 = /step\s+(\d+)\s*[—–:.-]+\s*([^\n]+)([\s\S]*?)(?=step\s+\d+|$)/gi;
  let m;
  while ((m = re1.exec(text)) !== null) {
    const bodyRaw = m[3].trim();
    steps.push({ num: m[1], title: m[2].trim(), body: bodyRaw });
  }
  if (steps.length >= 2) return steps;

  // Pattern 2: "1. **Title**\nbody" or "1. Title"
  const re2 = /^(\d+)\.\s+(?:\*\*([^*\n]+)\*\*|([^\n]+))([\s\S]*?)(?=^\d+\.|$)/gm;
  while ((m = re2.exec(text)) !== null) {
    const title = (m[2] || m[3] || '').trim();
    const body = (m[4] || '').trim().replace(/^[-*]\s+/gm, '• ');
    if (title) steps.push({ num: m[1], title, body });
  }
  return steps;
}

function parseListItems(text) {
  const items = [];
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    // Numbered: "1. **Title**: desc" or "1. Title - desc" or "1. Title\n   desc"
    const numMatch = l.match(/^(\d+)\.\s+(?:\*\*([^*:]+)\*\*[:\s-]*(.*)|(.*))$/);
    if (numMatch) {
      const title = (numMatch[2] || numMatch[4] || '').trim();
      let sub = (numMatch[3] || '').trim();
      // Collect continuation lines
      let j = i + 1;
      while (j < lines.length && lines[j].match(/^\s{2,}|^\s*[-–]\s/) && !lines[j].match(/^\d+\.\s/)) {
        sub += (sub ? ' ' : '') + lines[j].trim().replace(/^[-–]\s*/, '');
        j++;
      }
      if (title || sub) items.push({ num: numMatch[1], title, sub, ordered: true });
      i = j; continue;
    }
    // Bullet: "- **Title**: desc" or "- Title"
    const bulMatch = l.match(/^[-*•]\s+(?:\*\*([^*:]+)\*\*[:\s-]*(.*)|(.*))$/);
    if (bulMatch) {
      const title = (bulMatch[1] || bulMatch[3] || '').trim();
      let sub = (bulMatch[2] || '').trim();
      let j = i + 1;
      while (j < lines.length && lines[j].match(/^\s{2,}/) && !lines[j].match(/^[-*•]\s/)) {
        sub += (sub ? ' ' : '') + lines[j].trim();
        j++;
      }
      if (title || sub) items.push({ title, sub, ordered: false });
      i = j; continue;
    }
    i++;
  }
  return items;
}

function parseResearchSections(text) {
  const sections = [];
  // Split by ## or ### headings
  const re = /^(#{2,3})\s+(.+)$/gm;
  let lastIndex = 0, m;
  const headings = [];
  while ((m = re.exec(text)) !== null) headings.push({ index: m.index, end: re.lastIndex, level: m[1].length, title: m[2].trim() });

  if (headings.length === 0) {
    // No headings — treat as one section with paras
    sections.push({ title: null, body: text.trim() });
    return sections;
  }

  // Text before first heading
  if (headings[0].index > 0) {
    const pre = text.slice(0, headings[0].index).trim();
    if (pre) sections.push({ title: null, body: pre });
  }

  headings.forEach((h, i) => {
    const bodyStart = h.end;
    const bodyEnd = i + 1 < headings.length ? headings[i+1].index : text.length;
    sections.push({ title: h.title, body: text.slice(bodyStart, bodyEnd).trim() });
  });
  return sections;
}

function parseTableFromText(text) {
  const lines = text.split('\n');
  const tableLines = lines.filter(l => l.trim().includes('|'));
  if (tableLines.length < 2) return null;

  const parseRow = (l) => l.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(2).filter(l => !l.match(/^[\s|:-]+$/)).map(parseRow);
  return { headers, rows };
}

/* ─────────────────────────────────────────
   5. BLOCK RENDERERS
───────────────────────────────────────── */
function buildCodeBlock(lang, code) {
  const wrap = document.createElement('div');
  wrap.className = 'si-code-wrap';

  const bar = document.createElement('div');
  bar.className = 'si-code-bar';

  const langEl = document.createElement('span');
  langEl.className = 'si-code-lang';
  langEl.textContent = lang || 'code';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'si-code-copy';
  copyBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
  copyBtn.onclick = () => copyToClipboard(code, copyBtn);

  bar.appendChild(langEl);
  bar.appendChild(copyBtn);

  const pre = document.createElement('pre');
  pre.className = 'si-code-pre';
  const codeEl = document.createElement('code');
  if (lang) codeEl.className = `language-${lang}`;
  codeEl.textContent = code;
  try { if (window.hljs) window.hljs.highlightElement(codeEl); } catch(e) {}
  pre.appendChild(codeEl);

  wrap.appendChild(bar);
  wrap.appendChild(pre);
  return wrap;
}

function buildProseInner(text) {
  // Build a simple prose div from raw text (no code fences here)
  const div = document.createElement('div');
  div.className = 'si-prose-wrap';
  const lines = text.split('\n');
  let i = 0, currentUL = null;

  const flush = () => { currentUL = null; };
  const append = (el) => { flush(); div.appendChild(el); };

  while (i < lines.length) {
    const l = lines[i].trim(); i++;
    if (!l) { flush(); continue; }

    // Callout: "> **Note:**" / "> **Tip:**" / "> **Warning:**"
    if (l.startsWith('> ')) {
      const inner = l.slice(2).trim();
      const co = document.createElement('div');
      let type = 'note', icon = 'ℹ️';
      if (/warning|caution|danger/i.test(inner)) { type='warning'; icon='⚠️'; }
      else if (/tip|hint|pro tip/i.test(inner)) { type='tip'; icon='💡'; }
      co.className = `si-callout si-callout-${type}`;
      co.innerHTML = `<span class="si-callout-icon">${icon}</span><div class="si-callout-body">${inlineMd(inner)}</div>`;
      append(co); continue;
    }

    // Headings
    const hm = l.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const tag = ['h3','h3','h4','h4'][hm[1].length-1] || 'h4';
      const h = document.createElement(tag);
      h.style.cssText = 'font-size:14.5px;font-weight:700;color:var(--tx);margin:14px 0 5px;letter-spacing:-.01em;';
      h.innerHTML = inlineMd(hm[2]);
      append(h); continue;
    }

    // HR
    if (/^---+$/.test(l)) { const hr = document.createElement('hr'); hr.className='si-hr'; append(hr); continue; }

    // Bullet
    if (/^[-*]\s/.test(l)) {
      if (!currentUL) { currentUL = document.createElement('ul'); currentUL.style.cssText='padding-left:20px;margin:6px 0;'; div.appendChild(currentUL); }
      const li = document.createElement('li');
      li.style.cssText = 'margin-bottom:5px;font-size:13.5px;line-height:1.65;color:var(--tx);';
      li.innerHTML = inlineMd(l.replace(/^[-*]\s+/,''));
      currentUL.appendChild(li); continue;
    }

    // Ordered list
    if (/^\d+[.)]\s/.test(l)) {
      if (!currentUL || currentUL.tagName !== 'OL') { flush(); currentUL = document.createElement('ol'); currentUL.style.cssText='padding-left:20px;margin:6px 0;'; div.appendChild(currentUL); }
      const li = document.createElement('li');
      li.style.cssText = 'margin-bottom:5px;font-size:13.5px;line-height:1.65;color:var(--tx);';
      li.innerHTML = inlineMd(l.replace(/^\d+[.)]\s+/,''));
      currentUL.appendChild(li); continue;
    }

    // Paragraph
    flush();
    const paraLines = [l];
    while (i < lines.length) {
      const nt = lines[i].trim();
      if (!nt || /^(#{1,4}\s|[-*]\s|\d+[.)]\s|---+$|> )/.test(nt)) break;
      paraLines.push(nt); i++;
    }
    const p = document.createElement('p');
    p.style.cssText = 'margin:0 0 8px;font-size:14.5px;line-height:1.78;color:var(--tx);';
    p.innerHTML = inlineMd(paraLines.join(' '));
    div.appendChild(p);
  }
  return div;
}

function buildBadge(type) {
  const labels = {
    code: '⌨ Code', steps: '◎ Step-by-Step', research: '◈ Deep Dive',
    comparison: '⇄ Comparison', list: '◉ Curated List', math: '∑ Math',
    creative: '✦ Creative', chat: '◇ Response', explanation: '◈ Explanation'
  };
  const badge = document.createElement('div');
  badge.className = `si-badge si-badge-${type}`;
  badge.textContent = labels[type] || '◇ Response';
  return badge;
}

/* ─────────────────────────────────────────
   6. TYPE-SPECIFIC OUTPUT BUILDERS
───────────────────────────────────────── */

function buildCodeOutput(text) {
  const root = document.createElement('div');
  root.className = 'si-root';
  root.appendChild(buildBadge('code'));

  const segments = parseBlocks(text);
  segments.forEach(seg => {
    if (seg.type === 'code') {
      root.appendChild(buildCodeBlock(seg.lang, seg.content));
    } else {
      const t = seg.content.trim();
      if (t) root.appendChild(buildProseInner(t));
    }
  });
  return root;
}

function buildStepsOutput(text) {
  const root = document.createElement('div');
  root.className = 'si-root';
  root.appendChild(buildBadge('steps'));

  // Extract intro text before first step
  const introMatch = text.match(/^([\s\S]*?)(?=step\s+1|\n1\.\s)/i);
  if (introMatch && introMatch[1].trim()) {
    root.appendChild(buildProseInner(introMatch[1].trim()));
  }

  const steps = parseStepsFromText(text);

  if (steps.length >= 2) {
    const list = document.createElement('div');
    list.className = 'si-steps-list';

    steps.forEach(step => {
      const item = document.createElement('div');
      item.className = 'si-step';

      const num = document.createElement('div');
      num.className = 'si-step-num';
      num.textContent = step.num;

      const body = document.createElement('div');
      body.className = 'si-step-body';

      const title = document.createElement('div');
      title.className = 'si-step-title';
      title.innerHTML = inlineMd(step.title);
      body.appendChild(title);

      if (step.body) {
        // Check if step body has code fence
        const hasFence = /```/.test(step.body);
        if (hasFence) {
          const codeWrap = document.createElement('div');
          codeWrap.className = 'si-step-code';
          const segs = parseBlocks(step.body);
          segs.forEach(s => {
            if (s.type === 'code') codeWrap.appendChild(buildCodeBlock(s.lang, s.content));
            else if (s.content.trim()) {
              const d = document.createElement('div');
              d.className = 'si-step-desc';
              d.innerHTML = inlineMd(s.content.trim());
              codeWrap.appendChild(d);
            }
          });
          body.appendChild(codeWrap);
        } else {
          const desc = document.createElement('div');
          desc.className = 'si-step-desc';
          desc.innerHTML = inlineMd(step.body.replace(/\n/g, ' '));
          body.appendChild(desc);
        }
      }

      item.appendChild(num);
      item.appendChild(body);
      list.appendChild(item);
    });
    root.appendChild(list);
  } else {
    // Fallback: render all segments
    const segments = parseBlocks(text);
    segments.forEach(seg => {
      if (seg.type === 'code') root.appendChild(buildCodeBlock(seg.lang, seg.content));
      else if (seg.content.trim()) root.appendChild(buildProseInner(seg.content.trim()));
    });
  }

  return root;
}

function buildResearchOutput(text) {
  const root = document.createElement('div');
  root.className = 'si-root';
  root.appendChild(buildBadge('research'));

  const sections = parseResearchSections(text);
  const container = document.createElement('div');
  container.className = 'si-research';

  sections.forEach(sec => {
    const div = document.createElement('div');
    div.className = 'si-research-section';

    if (sec.title) {
      const h = document.createElement('div');
      h.className = 'si-section-head';
      h.innerHTML = inlineMd(sec.title);
      div.appendChild(h);
    }

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'si-section-body';

    // Parse the body for code fences, tables, bullets
    const segs = parseBlocks(sec.body);
    segs.forEach(s => {
      if (s.type === 'code') {
        bodyDiv.appendChild(buildCodeBlock(s.lang, s.content));
      } else if (s.content.trim()) {
        // Check for table
        if (s.content.includes('|') && s.content.match(/\|\s*[-:]+\s*\|/)) {
          const tbl = buildCompareTable(s.content);
          if (tbl) { bodyDiv.appendChild(tbl); return; }
        }
        bodyDiv.appendChild(buildProseInner(s.content.trim()));
      }
    });

    div.appendChild(bodyDiv);
    container.appendChild(div);
  });

  root.appendChild(container);
  return root;
}

function buildCompareTable(text) {
  const parsed = parseTableFromText(text);
  if (!parsed || !parsed.headers.length) return null;

  const tbl = document.createElement('table');
  tbl.className = 'si-compare-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  parsed.headers.forEach(h => {
    const th = document.createElement('th');
    th.innerHTML = inlineMd(h);
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  tbl.appendChild(thead);

  const tbody = document.createElement('tbody');
  parsed.rows.forEach(row => {
    const tr = document.createElement('tr');
    parsed.headers.forEach((_, i) => {
      const td = document.createElement('td');
      td.innerHTML = inlineMd(row[i] || '');
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  return tbl;
}

function buildComparisonOutput(text) {
  const root = document.createElement('div');
  root.className = 'si-root';
  root.appendChild(buildBadge('comparison'));

  // Try to find table first
  const tableMatch = text.match(/\|.+\|[\s\S]*?\|[\s\S]*?\|/);
  if (tableMatch) {
    const pre = text.slice(0, text.indexOf(tableMatch[0])).trim();
    if (pre) root.appendChild(buildProseInner(pre));

    const tbl = buildCompareTable(tableMatch[0]);
    if (tbl) root.appendChild(tbl);

    const post = text.slice(text.indexOf(tableMatch[0]) + tableMatch[0].length).trim();
    if (post) {
      // Check for verdict/summary
      if (/\b(conclusion|verdict|summary|recommend|bottom line|winner|in short)\b/i.test(post)) {
        const verdict = document.createElement('div');
        verdict.className = 'si-verdict';
        verdict.innerHTML = `<span class="si-verdict-icon">💡</span><div class="si-verdict-body"><strong>Verdict</strong>${inlineMd(post.replace(/^#{1,4}\s+\S[^\n]*\n?/gm,''))}</div>`;
        root.appendChild(verdict);
      } else {
        root.appendChild(buildProseInner(post));
      }
    }
    return root;
  }

  // Fallback: render as research sections with prose
  root.appendChild(buildProseInner(text));
  return root;
}

function buildListOutput(text, ordered) {
  const root = document.createElement('div');
  root.className = 'si-root';
  root.appendChild(buildBadge('list'));

  // Intro text before list
  const lines = text.split('\n');
  let listStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^(\d+[.)]\s|[-*•]\s)/.test(lines[i].trim())) { listStart = i; break; }
  }
  if (listStart > 0) {
    const intro = lines.slice(0, listStart).join('\n').trim();
    if (intro) root.appendChild(buildProseInner(intro));
  }

  const items = parseListItems(text);

  if (items.length >= 2) {
    const list = document.createElement('div');
    list.className = 'si-list';

    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'si-list-item';
      el.style.animationDelay = `${idx * 0.04}s`;

      const bullet = document.createElement('div');
      if (item.ordered) {
        bullet.className = 'si-list-num';
        bullet.textContent = item.num || String(idx + 1);
      } else {
        bullet.className = 'si-list-bullet';
        bullet.textContent = '◆';
      }

      const content = document.createElement('div');
      content.className = 'si-list-content';

      if (item.title) {
        const t = document.createElement('div');
        t.className = 'si-list-title';
        t.innerHTML = inlineMd(item.title);
        content.appendChild(t);
      }
      if (item.sub) {
        const s = document.createElement('div');
        s.className = 'si-list-sub';
        s.innerHTML = inlineMd(item.sub);
        content.appendChild(s);
      }

      el.appendChild(bullet);
      el.appendChild(content);
      list.appendChild(el);
    });
    root.appendChild(list);
  } else {
    // Fallback to prose
    root.appendChild(buildProseInner(text));
  }

  return root;
}

function buildMathOutput(text) {
  const root = document.createElement('div');
  root.className = 'si-root';
  root.appendChild(buildBadge('math'));

  // Render math blocks distinctly, inline text as prose
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;
  let lastIndex = 0, m;
  const parts = [];
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push({ type: 'text', content: text.slice(lastIndex, m.index) });
    parts.push({ type: 'math', content: (m[1] || m[2]).trim() });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) });

  parts.forEach(part => {
    if (part.type === 'math') {
      const box = document.createElement('div');
      box.className = 'si-math-wrap';
      const lbl = document.createElement('div');
      lbl.className = 'si-math-label';
      lbl.textContent = 'Formula';
      const f = document.createElement('div');
      f.className = 'si-math-formula';
      f.textContent = part.content;
      box.appendChild(lbl);
      box.appendChild(f);
      root.appendChild(box);
    } else if (part.content.trim()) {
      root.appendChild(buildProseInner(part.content.trim()));
    }
  });

  // Also handle code fences (might contain code examples alongside math)
  return root;
}

function buildCreativeOutput(text) {
  const root = document.createElement('div');
  root.className = 'si-root';
  root.appendChild(buildBadge('creative'));

  const div = document.createElement('div');
  div.className = 'si-creative';

  const paras = text.split(/\n\n+/);
  paras.forEach(p => {
    const el = document.createElement('p');
    el.innerHTML = inlineMd(p.trim().replace(/\n/g, '<br>'));
    div.appendChild(el);
  });
  root.appendChild(div);
  return root;
}

function buildChatOutput(text) {
  const root = document.createElement('div');
  root.className = 'si-root';

  // For very short answers, show as answer card
  if (text.trim().split('\n').length <= 2 && text.length < 180) {
    const card = document.createElement('div');
    card.className = 'si-chat';
    card.innerHTML = inlineMd(text.trim());
    root.appendChild(card);
    return root;
  }

  const div = document.createElement('div');
  div.className = 'si-chat';
  const segs = parseBlocks(text);
  segs.forEach(s => {
    if (s.type === 'code') root.appendChild(buildCodeBlock(s.lang, s.content));
    else if (s.content.trim()) {
      const inner = buildProseInner(s.content.trim());
      inner.className = 'si-chat';
      div.appendChild(inner);
    }
  });
  root.appendChild(div);
  return root;
}

function buildExplanationOutput(text) {
  // Explanation = research-style but for medium-length responses
  return buildResearchOutput(text);
}

/* ─────────────────────────────────────────
   7. MAIN ENTRY POINT
───────────────────────────────────────── */
/**
 * renderSmartOutput(userQuery, responseText, container?)
 *
 * Detects the output type and renders a beautiful, structured response.
 * Returns a DOM element. Optionally appends to container.
 *
 * Usage:
 *   const el = renderSmartOutput(userQuery, aiResponse);
 *   document.querySelector('.mc').appendChild(el);
 *
 * OR stream-friendly:
 *   renderSmartOutput(userQuery, partialText, existingEl, true); // isStreaming=true
 */
function renderSmartOutput(userQuery, responseText, container, isStreaming) {
  injectRendererStyles();

  const type = isStreaming
    ? OUTPUT_TYPES.CHAT   // During streaming, always use chat (fast)
    : detectOutputType(userQuery, responseText);

  let el;
  switch (type) {
    case OUTPUT_TYPES.CODE:        el = buildCodeOutput(responseText);       break;
    case OUTPUT_TYPES.STEPS:       el = buildStepsOutput(responseText);      break;
    case OUTPUT_TYPES.RESEARCH:    el = buildResearchOutput(responseText);   break;
    case OUTPUT_TYPES.COMPARISON:  el = buildComparisonOutput(responseText); break;
    case OUTPUT_TYPES.LIST:        el = buildListOutput(responseText);       break;
    case OUTPUT_TYPES.MATH:        el = buildMathOutput(responseText);       break;
    case OUTPUT_TYPES.CREATIVE:    el = buildCreativeOutput(responseText);   break;
    case OUTPUT_TYPES.EXPLANATION: el = buildExplanationOutput(responseText);break;
    default:                       el = buildChatOutput(responseText);       break;
  }

  if (container) {
    container.innerHTML = '';
    container.appendChild(el);
  }
  return el;
}

/* ─────────────────────────────────────────
   8. STREAMING HELPER
───────────────────────────────────────── */
/**
 * During streaming: show typed text with chat renderer (fast).
 * On complete: re-render with smart type detection.
 */
function updateStreamSmart(partialText, container) {
  if (!container) return;
  injectRendererStyles();
  const div = document.createElement('div');
  div.className = 'si-root si-chat';
  div.innerHTML = inlineMd(partialText);
  container.innerHTML = '';
  container.appendChild(div);
}

function finalizeStreamSmart(userQuery, fullText, container) {
  if (!container) return;
  renderSmartOutput(userQuery, fullText, container, false);
}

/* ─────────────────────────────────────────
   9. EXPOSE GLOBALLY
───────────────────────────────────────── */
window.StreminiRenderer = {
  render: renderSmartOutput,
  updateStream: updateStreamSmart,
  finalizeStream: finalizeStreamSmart,
  detectType: detectOutputType,
  injectStyles: injectRendererStyles,
};
