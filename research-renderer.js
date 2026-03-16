/* ═══════════════════════════════════════════════════════════════
   STREMINI — RESEARCH & MATH RENDERER BRIDGE
   Detects research/math queries and routes them to the agentic
   research backend, then renders structured paper/math output.
═══════════════════════════════════════════════════════════════ */

var RESEARCH_API = 'https://agentic-research.vishwajeetadkine705.workers.dev';

/* ─── Detection ─── */
var RESEARCH_KEYWORDS = [
  'research paper','write a paper','write paper','academic paper','literature review',
  'study on','comprehensive study','overview of','history of','impact of',
  'analysis of','review of','science of','theory of','effects of',
  'examine','investigate','survey of'
];

var MATH_KEYWORDS = [
  'solve','calculate','compute','prove','proof','integral','derivative',
  'equation','formula','simplify','factor','differentiate','integrate',
  'theorem','lemma','algebra','calculus','matrix','determinant','eigenvalue',
  'probability','statistics','permutation','combination','binomial','limit',
  'series','sequence','converge','diverge','trigonometry','logarithm'
];

window.StreminiResearch = {

  detect: function(text) {
    var lower = (text || '').toLowerCase();
    for (var i = 0; i < RESEARCH_KEYWORDS.length; i++) {
      if (lower.indexOf(RESEARCH_KEYWORDS[i]) !== -1) return 'research';
    }
    for (var j = 0; j < MATH_KEYWORDS.length; j++) {
      if (lower.indexOf(MATH_KEYWORDS[j]) !== -1) return 'math';
    }
    return null;
  },

  call: async function(query, mode, history) {
    var res = await fetch(RESEARCH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, mode: mode, history: (history || []).slice(-10), iteration: 0 })
    });
    if (!res.ok) throw new Error('Research API ' + res.status);
    var data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },

  /* ── Shared utils ── */
  esc: function(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },

  formatInlineMath: function(text) {
    var frag = document.createDocumentFragment();
    var re = /(\$[^$]+\$|`[^`]+`)/g;
    var last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var span = document.createElement('span');
      span.className = 'rm-math-inline';
      span.textContent = m[0].replace(/^[$`]|[$`]$/g, '');
      frag.appendChild(span);
      last = re.lastIndex;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  },

  /* ── Diagram parser ── */
  parseContent: function(content) {
    var parts = [];
    var re = /<diagram\s+type=["']?(\w+)["']?\s+title=["']?([^"'>]*)["']?\s*>([\s\S]*?)<\/diagram>/gi;
    var last = 0, m;
    while ((m = re.exec(content)) !== null) {
      if (m.index > last) parts.push({ kind: 'text', txt: content.slice(last, m.index) });
      parts.push({ kind: 'diagram', dtype: m[1], title: m[2], code: m[3].trim() });
      last = m.index + m[0].length;
    }
    if (last < content.length) parts.push({ kind: 'text', txt: content.slice(last) });
    return parts;
  },

  renderDiagram: async function(part) {
    var dw = document.createElement('div');
    dw.className = 'rm-diagram-wrap';
    dw.innerHTML = '<div class="rm-diagram-bar">' +
      '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> ' +
      window.StreminiResearch.esc(part.title || part.dtype) +
      '</div>';
    var dr = document.createElement('div');
    dr.className = 'rm-diagram-render';
    try {
      if (window.mermaid) {
        var uid = 'rm_d_' + Date.now() + Math.random().toString(36).slice(2);
        var result = await window.mermaid.render(uid, part.code);
        dr.innerHTML = result.svg || result;
      } else {
        dr.textContent = part.code;
      }
    } catch(e) {
      dr.className = 'rm-diagram-err';
      dr.textContent = 'Diagram error: ' + e.message;
    }
    dw.appendChild(dr);
    return dw;
  },

  /* ── Math DOM builder ── */
  normalizeMathSection: function(raw) {
    var key = raw.toLowerCase().replace(/[^a-z\s]/g,'').trim();
    if (!key) return 'Explanation';
    if (/(problem|question)/.test(key)) return 'Problem';
    if (/(given|data|known)/.test(key)) return 'Given';
    if (/(approach|plan|strategy|method)/.test(key)) return 'Approach';
    if (/(step|solution|work)/.test(key)) return 'Step-by-step';
    if (/(check|verify|validation)/.test(key)) return 'Verification';
    if (/(final|answer|result|therefore)/.test(key)) return 'Final Answer';
    if (/(note|intuition|insight|tip)/.test(key)) return 'Notes';
    return raw.trim();
  },

  createMathSection: function(container, sectionName) {
    var sec = document.createElement('div');
    sec.className = 'rm-math-section';
    var hd = document.createElement('div');
    hd.className = 'rm-math-section-h';
    hd.innerHTML = '<span class="rm-math-dot"></span>' + window.StreminiResearch.esc(sectionName);
    var bd = document.createElement('div');
    bd.className = 'rm-math-section-b';
    sec.appendChild(hd);
    sec.appendChild(bd);
    container.appendChild(sec);
    return bd;
  },

  appendMathBlock: function(target, line, state) {
    var self = window.StreminiResearch;
    if (!line) { state.currentList = null; return; }

    if (/^[-*•]\s+/.test(line)) {
      if (!state.currentList) {
        state.currentList = document.createElement('ul');
        state.currentList.className = 'rm-math-list';
        target.appendChild(state.currentList);
      }
      var li = document.createElement('li');
      li.appendChild(self.formatInlineMath(line.replace(/^[-*•]\s+/, '')));
      state.currentList.appendChild(li);
      return;
    }
    state.currentList = null;

    var stepMatch = /^(?:step\s*)?(\d+)[\).:-]\s+(.+)/i.exec(line);
    if (stepMatch) {
      var row = document.createElement('div');
      row.className = 'rm-math-step';
      row.innerHTML = '<span class="rm-math-step-no">' + stepMatch[1] + '</span>';
      var txt = document.createElement('div');
      txt.className = 'rm-math-step-txt';
      txt.appendChild(self.formatInlineMath(stepMatch[2]));
      row.appendChild(txt);
      target.appendChild(row);
      return;
    }

    if (/^(final answer|answer|result|therefore)\s*[:\-]/i.test(line)) {
      var fin = document.createElement('div');
      fin.className = 'rm-math-final';
      fin.appendChild(self.formatInlineMath(line));
      target.appendChild(fin);
      return;
    }

    if (/^(note|tip|intuition)\s*[:\-]/i.test(line)) {
      var note = document.createElement('div');
      note.className = 'rm-math-note';
      note.appendChild(self.formatInlineMath(line));
      target.appendChild(note);
      return;
    }

    if (/[=:].*[+\-*/^()]/.test(line) || /\b(sum|integral|sqrt|lim|theta|sigma|pi|alpha|beta)\b/i.test(line)) {
      var eq = document.createElement('div');
      eq.className = 'rm-math-eq';
      eq.textContent = line;
      target.appendChild(eq);
      return;
    }

    var p = document.createElement('div');
    p.className = 'rm-math-para';
    p.appendChild(self.formatInlineMath(line));
    target.appendChild(p);
  },

  buildMathDOM: async function(allParts) {
    var self = window.StreminiResearch;
    var container = document.createElement('div');
    container.className = 'rm-math-doc';

    var lines = [];
    for (var i = 0; i < allParts.length; i++) {
      var p = allParts[i];
      if (p.kind === 'diagram') {
        p.el = await self.renderDiagram(p);
        lines.push({ type: 'diagram', el: p.el });
      } else {
        p.txt.split('\n').forEach(function(l) { lines.push({ type: 'line', txt: l.trim() }); });
      }
    }

    var firstLine = '';
    for (var k = 0; k < lines.length; k++) {
      if (lines[k].type === 'line' && lines[k].txt) { firstLine = lines[k].txt; break; }
    }

    var header = document.createElement('div');
    header.className = 'rm-math-header';
    header.innerHTML = '<div class="rm-math-kicker">Math solution</div>' +
      '<div class="rm-math-title"></div>';
    header.querySelector('.rm-math-title').textContent = firstLine.replace(/^#{1,3}\s*/, '');
    container.appendChild(header);

    var sectionName = 'Explanation';
    var sectionBody = self.createMathSection(container, sectionName);
    var state = { currentList: null };

    lines.forEach(function(item, idx) {
      if (item.type === 'diagram') {
        state.currentList = null;
        if (item.el) sectionBody.appendChild(item.el);
        return;
      }
      var line = item.txt;
      if (!line) { state.currentList = null; return; }
      if (idx === 0 && line === firstLine) return;

      var headingMatch = /^#{1,3}\s+(.+)$/.exec(line) || /^([A-Za-z][A-Za-z\s]{1,30})\s*:\s*$/.exec(line);
      if (headingMatch) {
        sectionName = self.normalizeMathSection(headingMatch[1]);
        sectionBody = self.createMathSection(container, sectionName);
        state.currentList = null;
        return;
      }

      var explicitMatch = /^(problem|given|approach|steps?|verification|final answer|result|notes?)\s*:\s*(.+)$/i.exec(line);
      if (explicitMatch) {
        var targetSection = self.normalizeMathSection(explicitMatch[1]);
        if (targetSection !== sectionName) {
          sectionName = targetSection;
          sectionBody = self.createMathSection(container, sectionName);
        }
        self.appendMathBlock(sectionBody, explicitMatch[2], state);
        return;
      }

      self.appendMathBlock(sectionBody, line, state);
    });

    return container;
  },

  /* ── Research/Paper DOM builder ── */
  renderLine: function(l, state) {
    var self = window.StreminiResearch;
    if (!l) return;
    if (/^[━─=\-]{3,}$/.test(l)) return;
    if (/^(MINDMAP|FLOWCHART|TIMELINE|GRAPH|SEQUENCE)\s/i.test(l)) return;

    function getTarget() { return state.section || state.container; }
    function flushPara() {
      if (!state.para.length) return;
      var text = state.para.join(' ').trim();
      state.para = [];
      if (!text) return;
      if (/^keywords:/i.test(text)) {
        var kb = document.createElement('div');
        kb.className = 'rm-keywords';
        kb.innerHTML = '<strong>Keywords:</strong> ' + self.esc(text.replace(/^keywords:\s*/i,''));
        getTarget().appendChild(kb);
      } else {
        var p = document.createElement('p');
        p.className = 'rm-para';
        p.textContent = text;
        getTarget().appendChild(p);
      }
    }

    if (/^REFERENCES\s*$/i.test(l)) {
      flushPara();
      state.inRefs = true;
      var sec = document.createElement('div');
      sec.className = 'rm-section';
      var h = document.createElement('div');
      h.className = 'rm-section-heading';
      h.textContent = 'References';
      sec.appendChild(h);
      state.container.appendChild(sec);
      state.section = sec;
      state.refsDiv = sec;
      return;
    }

    if (state.inRefs) {
      flushPara();
      var ri = document.createElement('div');
      ri.className = 'rm-ref-item';
      var last = state.refsDiv.lastElementChild;
      var isNewRef = /^\[\d+\]/.test(l) || /^[A-Z][a-zA-Z]+,/.test(l);
      if (isNewRef || !last || !last.classList.contains('rm-ref-item')) {
        ri.textContent = l;
        state.refsDiv.appendChild(ri);
      } else {
        last.textContent += ' ' + l;
      }
      return;
    }

    if (/^ABSTRACT\s*$/i.test(l)) {
      flushPara();
      var sec2 = document.createElement('div');
      sec2.className = 'rm-section';
      var h2 = document.createElement('div');
      h2.className = 'rm-section-heading';
      h2.textContent = 'Abstract';
      sec2.appendChild(h2);
      state.container.appendChild(sec2);
      state.section = sec2;
      return;
    }

    var mjMatch = /^(\d+)\.\s+(.+)$/.exec(l);
    if (mjMatch) {
      flushPara();
      var sec3 = document.createElement('div');
      sec3.className = 'rm-section';
      var h3 = document.createElement('div');
      h3.className = 'rm-section-heading';
      h3.textContent = mjMatch[1] + '. ' + mjMatch[2];
      sec3.appendChild(h3);
      state.container.appendChild(sec3);
      state.section = sec3;
      return;
    }

    var sbMatch = /^(\d+\.\d+)\s+(.+)$/.exec(l);
    if (sbMatch) {
      flushPara();
      var sh = document.createElement('div');
      sh.className = 'rm-sub-heading';
      sh.textContent = sbMatch[1] + ' ' + sbMatch[2];
      getTarget().appendChild(sh);
      return;
    }

    if (/^keywords:/i.test(l)) {
      flushPara();
      var kb2 = document.createElement('div');
      kb2.className = 'rm-keywords';
      kb2.innerHTML = '<strong>Keywords:</strong> ' + self.esc(l.replace(/^keywords:\s*/i,''));
      getTarget().appendChild(kb2);
      return;
    }

    state.para.push(l);
  },

  buildPaperDOM: async function(allParts) {
    var self = window.StreminiResearch;
    var container = document.createElement('div');

    for (var i = 0; i < allParts.length; i++) {
      if (allParts[i].kind === 'diagram') {
        allParts[i].el = await self.renderDiagram(allParts[i]);
      }
    }

    var allLines = [];
    for (var pi = 0; pi < allParts.length; pi++) {
      var part = allParts[pi];
      if (part.kind === 'text') {
        part.txt.split('\n').map(function(l){ return l.trim(); }).forEach(function(l){ allLines.push(l); });
      } else {
        allLines.push('__DIAGRAM__');
      }
    }

    var authorsIdx = -1;
    for (var ai = 0; ai < allLines.length; ai++) {
      if (/^authors:/i.test(allLines[ai])) { authorsIdx = ai; break; }
    }
    var titleIdx = 0;
    if (authorsIdx > 0) {
      for (var ti = authorsIdx - 1; ti >= 0; ti--) {
        if (allLines[ti].trim()) { titleIdx = ti; break; }
      }
    }

    if (authorsIdx > 0) {
      var tb = document.createElement('div');
      tb.className = 'rm-title-block';
      var th = document.createElement('div');
      th.className = 'rm-main-title';
      th.textContent = allLines[titleIdx];
      tb.appendChild(th);
      var metaText = allLines[authorsIdx];
      var tm = document.createElement('div');
      tm.className = 'rm-meta';
      metaText.split('|').map(function(s){ return s.trim(); }).filter(Boolean).forEach(function(seg){
        var sp = document.createElement('span');
        sp.textContent = seg;
        tm.appendChild(sp);
      });
      tb.appendChild(tm);
      container.appendChild(tb);
    }

    var state = {
      container: container,
      section: null,
      para: [],
      inRefs: false,
      refsDiv: null
    };

    var contentStartIdx = authorsIdx >= 0 ? authorsIdx + 1 : 0;
    var globalIdx = 0;

    function flushParaFinal() {
      if (!state.para.length) return;
      var text = state.para.join(' ').trim();
      state.para = [];
      if (!text) return;
      var p = document.createElement('p');
      p.className = 'rm-para';
      p.textContent = text;
      (state.section || container).appendChild(p);
    }

    for (var pi2 = 0; pi2 < allParts.length; pi2++) {
      var part2 = allParts[pi2];
      if (part2.kind === 'diagram') {
        flushParaFinal();
        if (part2.el) (state.section || container).appendChild(part2.el);
        globalIdx++;
      } else {
        var lines2 = part2.txt.split('\n').map(function(l){ return l.trim(); });
        for (var li2 = 0; li2 < lines2.length; li2++) {
          if (globalIdx >= contentStartIdx) {
            self.renderLine(lines2[li2], state);
          }
          globalIdx++;
        }
      }
    }
    flushParaFinal();
    return container;
  },

  /* ── Main render entry ── */
  renderResult: async function(data, container, mode) {
    var self = window.StreminiResearch;
    var isMath = (data.status === 'SOLUTION' || mode === 'math');
    var content = data.content || data.solution || '';

    var wrap = document.createElement('div');
    wrap.className = 'rm-wrap';

    // Header chip
    var chip = document.createElement('div');
    chip.className = isMath ? 'rm-chip rm-chip-math' : 'rm-chip rm-chip-research';
    chip.innerHTML = isMath
      ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> Math Solution'
      : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> Research Paper';
    wrap.appendChild(chip);

    // Paper block
    var block = document.createElement('div');
    block.className = 'rm-paper-block';

    var hd = document.createElement('div');
    hd.className = 'rm-paper-hd';
    var pid = 'rm_' + Date.now();
    hd.innerHTML = '<span class="rm-paper-hd-label">' + (isMath ? 'Solution' : 'Paper') + '</span>' +
      '<button class="rm-copy-btn" data-pid="' + pid + '">' +
      '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>';

    var body = document.createElement('div');
    body.className = isMath ? 'rm-paper-bd rm-math-bd' : 'rm-paper-bd';
    body.id = pid;

    var parts = self.parseContent(content);
    var domContent;
    if (isMath) {
      domContent = await self.buildMathDOM(parts);
    } else {
      domContent = await self.buildPaperDOM(parts);
    }
    body.appendChild(domContent);

    block.appendChild(hd);
    block.appendChild(body);
    wrap.appendChild(block);

    // Download button
    var dlRow = document.createElement('div');
    dlRow.className = 'rm-dl-row';
    var dlBtn = document.createElement('button');
    dlBtn.className = 'rm-dl-btn';
    dlBtn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt';
    dlBtn.onclick = function() {
      var el = document.getElementById(pid);
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([el ? el.innerText : content], { type: 'text/plain' }));
      a.download = 'stremini-' + Date.now() + '.txt';
      a.click();
    };
    dlRow.appendChild(dlBtn);
    wrap.appendChild(dlRow);

    if (container) {
      container.innerHTML = '';
      container.appendChild(wrap);

      // Wire copy button
      setTimeout(function() {
        var btn = wrap.querySelector('.rm-copy-btn');
        if (btn) {
          btn.onclick = function() {
            var el = document.getElementById(btn.dataset.pid);
            if (!el) return;
            navigator.clipboard.writeText(el.innerText || '').then(function() {
              btn.textContent = 'Copied!';
              setTimeout(function() {
                btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
              }, 2000);
            }).catch(function(){});
          };
        }
      }, 50);
    }
    return wrap;
  },

  /* ── CSS injection ── */
  injectStyles: function() {
    if (document.getElementById('rm-styles')) return;
    var s = document.createElement('style');
    s.id = 'rm-styles';
    s.textContent = `
.rm-wrap { font-family: var(--font); }
.rm-chip { display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:12px; }
.rm-chip-research { background:#fffbf5;color:#b45309;border:1px solid #fde68a; }
.rm-chip-math { background:#f5f3ff;color:#6d28d9;border:1px solid #ddd6fe; }

.rm-paper-block { background:var(--bg);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;box-shadow:var(--sh-sm); }
.rm-paper-hd { display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--bdr);background:var(--bg-sub); }
.rm-paper-hd-label { font-size:12.5px;font-weight:600;color:var(--tx2); }
.rm-copy-btn { background:none;border:1px solid var(--bdr);cursor:pointer;font-size:11px;color:var(--tx3);font-family:var(--font);display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:4px;transition:all .15s; }
.rm-copy-btn:hover { background:var(--bg-hov);color:var(--tx); }

.rm-paper-bd { padding:24px 28px;font-family:'Lora',Georgia,serif;font-size:15px;line-height:1.9;color:var(--tx);max-height:560px;overflow-y:auto; }
.rm-math-bd { font-family:var(--font)!important;font-size:14.5px;line-height:1.78;background:linear-gradient(180deg,var(--bg) 0%,var(--bg-sub) 100%); }

.rm-title-block { text-align:center;padding-bottom:20px;border-bottom:2px solid var(--bdr);margin-bottom:22px; }
.rm-main-title { font-family:'Lora',Georgia,serif;font-size:19px;font-weight:700;line-height:1.35;margin-bottom:10px;letter-spacing:-.3px; }
.rm-meta { font-family:var(--font);font-size:12px;color:var(--tx3);display:flex;gap:16px;justify-content:center;flex-wrap:wrap; }

.rm-section { margin-bottom:20px; }
.rm-section-heading { font-family:var(--font);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#b45309;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--bdr-soft); }
.rm-sub-heading { font-family:var(--font);font-size:13px;font-weight:600;color:var(--tx);margin:14px 0 7px; }
.rm-para { margin-bottom:12px;text-align:justify;hyphens:auto; }
.rm-keywords { background:var(--bg-sub);border:1px solid var(--bdr-soft);border-radius:6px;padding:8px 12px;margin-bottom:14px;font-size:12.5px;color:var(--tx2);font-family:var(--font); }
.rm-keywords strong { color:var(--tx);margin-right:4px; }
.rm-ref-item { font-size:13px;line-height:1.65;margin-bottom:7px;padding-left:22px;text-indent:-22px;color:var(--tx2);font-family:var(--font); }

.rm-diagram-wrap { margin:16px 0;border:1px solid var(--bdr);border-radius:10px;overflow:hidden;background:var(--bg-sub); }
.rm-diagram-bar { display:flex;align-items:center;gap:6px;padding:6px 12px;border-bottom:1px solid var(--bdr);font-family:var(--font);font-size:11px;font-weight:600;color:var(--tx2);text-transform:uppercase;letter-spacing:.4px; }
.rm-diagram-render { padding:16px;display:flex;justify-content:center;overflow-x:auto; }
.rm-diagram-render svg { max-width:100%;height:auto; }
.rm-diagram-err { padding:10px 14px;font-family:var(--mono);font-size:11.5px;color:#dc2626;background:#fee2e2; }

/* Math DOM styles */
.rm-math-doc { display:flex;flex-direction:column;gap:12px; }
.rm-math-header { border:1px solid #ddd6fe;background:linear-gradient(180deg,#f5f3ff,#eef2ff);border-radius:10px;padding:13px 15px; }
.rm-math-kicker { font-size:11px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.7px;margin-bottom:5px; }
.rm-math-title { font-family:var(--font);font-size:20px;font-weight:700;line-height:1.35;color:#1f1b4d;letter-spacing:-.2px; }
.rm-math-section { border:1px solid #e5e7eb;background:var(--bg);border-radius:10px;overflow:hidden; }
.rm-math-section-h { display:flex;align-items:center;gap:7px;padding:9px 13px;background:var(--bg-sub);border-bottom:1px solid #e5e7eb;font-size:11.5px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px; }
.rm-math-dot { width:7px;height:7px;border-radius:50%;background:#818cf8;flex-shrink:0; }
.rm-math-section-b { padding:11px 13px;display:flex;flex-direction:column;gap:8px; }
.rm-math-para { font-size:14.5px;color:var(--tx);line-height:1.75; }
.rm-math-list { margin:0 0 0 18px;display:flex;flex-direction:column;gap:5px;color:var(--tx); }
.rm-math-list li { padding-left:2px;line-height:1.6; }
.rm-math-step { display:flex;gap:8px;align-items:flex-start;padding:9px 11px;border:1px solid #ddd6fe;background:#f5f3ff;border-radius:8px; }
.rm-math-step-no { font-size:11.5px;font-weight:700;color:#5b21b6;background:#ede9fe;border-radius:999px;min-width:21px;height:21px;display:inline-flex;align-items:center;justify-content:center; }
.rm-math-step-txt { flex:1;color:#312e81;line-height:1.68; }
.rm-math-eq { font-family:var(--mono);font-size:13px;background:#111827;color:#f9fafb;border-radius:7px;padding:9px 12px;overflow-x:auto;line-height:1.6; }
.rm-math-note { background:#eff6ff;border:1px solid #bfdbfe;border-radius:7px;padding:9px 12px;color:#1e3a8a; }
.rm-math-final { background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;border-radius:9px;padding:11px 13px;font-weight:600;line-height:1.65; }
.rm-math-inline { font-family:var(--mono);background:#eef2ff;border:1px solid #c7d2fe;border-radius:4px;padding:0 5px;font-size:.92em;color:#312e81; }

.rm-dl-row { margin-top:8px; }
.rm-dl-btn { display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border:none;border-radius:7px;font-family:var(--font);font-size:12.5px;font-weight:500;cursor:pointer;background:var(--tx);color:#fff;transition:all .15s; }
.rm-dl-btn:hover { background:#2d2a26;transform:translateY(-1px); }
`;
    document.head.appendChild(s);
  }
};
