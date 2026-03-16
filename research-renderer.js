/* ═══════════════════════════════════════════════════════════════
   STREMINI — RESEARCH & MATH RENDERER BRIDGE v2.0
   Clean, beautiful math and research output rendering.
═══════════════════════════════════════════════════════════════ */

var RESEARCH_API = 'https://agentic-research.vishwajeetadkine705.workers.dev';

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

  /* ── Utilities ── */
  esc: function(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },

  inlineMath: function(text) {
    // Replace $...$ and `...` with styled math spans
    var s = window.StreminiResearch.esc(text);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<span class="rm2-math-inline">$1</span>');
    s = s.replace(/\$([^$\n]+)\$/g, '<span class="rm2-math-inline">$1</span>');
    return s;
  },

  copyToClipboard: function(text, btn) {
    var orig = btn.innerHTML;
    var ok = function() {
      btn.classList.add('rm2-copied');
      btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copied';
      setTimeout(function() { btn.classList.remove('rm2-copied'); btn.innerHTML = orig; }, 2000);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok).catch(function() { ok(); });
    else ok();
  },

  /* ── CSS Injection ── */
  injectStyles: function() {
    if (document.getElementById('rm2-styles')) return;
    var s = document.createElement('style');
    s.id = 'rm2-styles';
    s.textContent = `
/* ── WRAPPER ── */
.rm2-wrap { font-family: var(--font); }
.rm2-chip {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 20px; margin-bottom: 12px;
}
.rm2-chip-math     { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
.rm2-chip-research { background: #fffbf5; color: #b45309; border: 1px solid #fde68a; }

/* ── CARD ── */
.rm2-card {
  background: var(--bg); border: 1px solid var(--bdr);
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,.06); margin: 2px 0 6px;
}
.rm2-card-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 15px; border-bottom: 1px solid var(--bdr); background: var(--bg-sub);
}
.rm2-card-title { font-size: 12.5px; font-weight: 600; color: var(--tx2); }
.rm2-copy-btn {
  background: none; border: 1px solid var(--bdr); cursor: pointer;
  font-size: 11px; color: var(--tx3); font-family: var(--font);
  display: flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 5px; transition: all .15s;
}
.rm2-copy-btn:hover { background: var(--bg-hov); color: var(--tx); }
.rm2-copied { background: #ecfdf5 !important; color: #059669 !important; border-color: #6ee7b7 !important; }

/* ── MATH BODY ── */
.rm2-math-body {
  padding: 20px 22px; max-height: 600px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 10px;
}

/* ── MATH SECTION ── */
.rm2-section {
  border: 1px solid var(--bdr); border-radius: 10px; overflow: hidden;
}
.rm2-section-hd {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 14px; background: var(--bg-sub);
  border-bottom: 1px solid var(--bdr); font-size: 11px;
  font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--tx2);
}
.rm2-section-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--acc); flex-shrink: 0;
}
.rm2-section-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }

/* ── FORMULA BOX ── */
.rm2-formula {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid #bae6fd; border-radius: 9px; padding: 13px 16px;
  font-family: var(--mono); font-size: 15px; color: #0369a1;
  font-weight: 500; overflow-x: auto; line-height: 1.6;
}
.rm2-formula-lbl {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; color: #0284c7; margin-bottom: 5px;
  font-family: var(--font);
}

/* ── STEP ROW ── */
.rm2-step {
  display: flex; gap: 10px; align-items: flex-start;
  background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px;
  padding: 10px 12px;
}
.rm2-step-no {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: #7c3aed; color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.rm2-step-content { flex: 1; color: #312e81; font-size: 13.5px; line-height: 1.7; }

/* ── FINAL ANSWER ── */
.rm2-answer {
  background: #ecfdf5; border: 1.5px solid #6ee7b7; border-radius: 10px;
  padding: 13px 15px;
}
.rm2-answer-lbl {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; color: #059669; margin-bottom: 5px;
  font-family: var(--font);
}
.rm2-answer-val {
  font-family: var(--mono); font-size: 15px; font-weight: 600;
  color: #065f46; line-height: 1.6;
}
.rm2-answer-note { font-size: 13px; color: #047857; margin-top: 6px; line-height: 1.6; }

/* ── INLINE MATH ── */
.rm2-math-inline {
  font-family: var(--mono); font-size: 0.92em;
  background: #eef2ff; border: 1px solid #c7d2fe;
  border-radius: 4px; padding: 1px 5px; color: #4338ca;
}

/* ── PROSE ── */
.rm2-para { font-size: 13.5px; color: var(--tx); line-height: 1.78; }
.rm2-list { margin: 0 0 0 18px; display: flex; flex-direction: column; gap: 5px; }
.rm2-list li { font-size: 13px; color: var(--tx2); line-height: 1.65; }

/* ── NOTE / TIP ── */
.rm2-note {
  background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;
  padding: 10px 13px; font-size: 13px; color: #1e3a8a; line-height: 1.65;
}

/* ── RESEARCH PAPER ── */
.rm2-paper-body { padding: 22px 24px; max-height: 580px; overflow-y: auto; }
.rm2-paper-title {
  font-family: 'Lora', Georgia, serif; font-size: 18px; font-weight: 700;
  line-height: 1.35; color: var(--tx); margin-bottom: 6px; letter-spacing: -.3px;
}
.rm2-paper-meta {
  font-size: 12px; color: var(--tx3); margin-bottom: 16px;
  display: flex; gap: 12px; flex-wrap: wrap; padding-bottom: 14px;
  border-bottom: 1.5px solid var(--bdr);
}
.rm2-paper-section { margin-bottom: 18px; }
.rm2-paper-sec-hd {
  font-size: 11.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; color: #b45309; margin-bottom: 9px;
  padding-bottom: 5px; border-bottom: 1px solid var(--bdr-soft);
}
.rm2-paper-para {
  font-family: 'Lora', Georgia, serif; font-size: 14.5px;
  line-height: 1.85; color: var(--tx); margin-bottom: 10px;
  text-align: justify; hyphens: auto;
}
.rm2-paper-para:last-child { margin-bottom: 0; }
.rm2-keywords {
  background: var(--bg-sub); border: 1px solid var(--bdr-soft);
  border-radius: 7px; padding: 8px 12px;
  font-size: 12.5px; color: var(--tx2); margin-top: 8px;
}
.rm2-ref-item {
  font-size: 12.5px; line-height: 1.65; margin-bottom: 7px;
  padding-left: 20px; text-indent: -20px; color: var(--tx2);
}

/* ── DL ROW ── */
.rm2-dl-row {
  display: flex; gap: 6px; padding: 10px 16px;
  border-top: 1px solid var(--bdr-soft); background: var(--bg-sub);
}
.rm2-dl-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border: none; border-radius: 7px;
  font-family: var(--font); font-size: 11.5px; font-weight: 500;
  cursor: pointer; background: var(--tx); color: #fff; transition: all .15s;
}
.rm2-dl-btn:hover { background: #2d2a26; transform: translateY(-1px); }
`;
    document.head.appendChild(s);
  },

  /* ══════════════════════════════════════════
     MATH RENDERER — clean structured sections
  ══════════════════════════════════════════ */
  renderMath: function(content, pid) {
    var self = window.StreminiResearch;
    var body = document.createElement('div');
    body.className = 'rm2-math-body';
    body.id = pid;

    // ── Parse the raw content into logical sections ──
    var lines = content.split('\n');
    var sections = [];
    var currentSection = null;
    var currentLines = [];

    // Section header patterns to recognize
    var sectionPatterns = [
      /^#{1,3}\s+(.+)$/,                                  // ## Heading
      /^([A-Z][A-Z\s&\/\-]{3,40}):?\s*$/,                 // ALL CAPS LABEL
      /^(Problem|Given|Approach|Step[s]?|Solution|Verification|Answer|Result|Note[s]?|Check)\s*[:\-]?\s*$/i
    ];

    function isSectionHead(line) {
      var t = line.trim();
      if (t.length < 2 || t.length > 80) return false;
      for (var p of sectionPatterns) { if (p.test(t)) return true; }
      return false;
    }

    function extractTitle(line) {
      var t = line.trim();
      var m;
      if ((m = /^#{1,3}\s+(.+)$/.exec(t))) return m[1].trim();
      return t.replace(/:$/, '').trim();
    }

    function flush() {
      if (currentSection !== null || currentLines.length) {
        sections.push({ title: currentSection, lines: currentLines.slice() });
      }
      currentLines = [];
      currentSection = null;
    }

    lines.forEach(function(raw) {
      var t = raw.trim();
      if (isSectionHead(t)) {
        flush();
        currentSection = extractTitle(t);
      } else {
        currentLines.push(raw);
      }
    });
    flush();

    // If we have no named sections, create a single "Solution" section
    if (sections.length === 0 || (sections.length === 1 && !sections[0].title)) {
      sections = [{ title: 'Solution', lines: lines }];
    }

    // ── Render each section ──
    sections.forEach(function(sec) {
      var sectionLines = sec.lines.filter(function(l) { return l.trim(); });
      if (!sectionLines.length && !sec.title) return;

      var sectionEl = document.createElement('div');
      sectionEl.className = 'rm2-section';

      // Section header
      if (sec.title) {
        var hd = document.createElement('div');
        hd.className = 'rm2-section-hd';
        var dot = document.createElement('span');
        dot.className = 'rm2-section-dot';
        hd.appendChild(dot);
        hd.appendChild(document.createTextNode(sec.title));
        sectionEl.appendChild(hd);
      }

      var secBody = document.createElement('div');
      secBody.className = 'rm2-section-body';

      // ── Detect and render final answer specially ──
      var isFinalAnswer = sec.title && /^(final\s*answer|answer|result|therefore)\s*$/i.test(sec.title.trim());

      if (isFinalAnswer) {
        var ansBox = document.createElement('div');
        ansBox.className = 'rm2-answer';
        var ansLbl = document.createElement('div');
        ansLbl.className = 'rm2-answer-lbl';
        ansLbl.textContent = 'Final Answer';
        ansBox.appendChild(ansLbl);
        sectionLines.forEach(function(l) {
          var t = l.trim();
          if (!t) return;
          var isFormula = /[=+\-*/^()]/.test(t) || /\bx\s*=/.test(t) || /\$/.test(t);
          if (isFormula) {
            var val = document.createElement('div');
            val.className = 'rm2-answer-val';
            val.textContent = t.replace(/^\$|\$$/g, '').replace(/`/g, '');
            ansBox.appendChild(val);
          } else {
            var note = document.createElement('div');
            note.className = 'rm2-answer-note';
            note.innerHTML = self.inlineMath(t);
            ansBox.appendChild(note);
          }
        });
        secBody.appendChild(ansBox);
        sectionEl.appendChild(secBody);
        body.appendChild(sectionEl);
        return;
      }

      // ── Parse section lines into typed elements ──
      var stepCounter = 0;
      var currentList = null;
      var pendingFormulas = [];

      function flushFormulas() {
        if (!pendingFormulas.length) return;
        var box = document.createElement('div');
        box.className = 'rm2-formula';
        pendingFormulas.forEach(function(f, i) {
          if (i > 0) { var br = document.createElement('br'); box.appendChild(br); }
          box.appendChild(document.createTextNode(f));
        });
        secBody.appendChild(box);
        pendingFormulas = [];
      }

      function flushList() {
        currentList = null;
      }

      sectionLines.forEach(function(rawLine) {
        var t = rawLine.trim();
        if (!t) { flushFormulas(); flushList(); return; }

        // Numbered step: "1. ..." or "Step 1: ..."
        var stepMatch = /^(?:step\s*)?(\d+)[).:\s]\s+(.+)/i.exec(t);
        if (stepMatch) {
          flushFormulas(); flushList();
          stepCounter++;
          var row = document.createElement('div');
          row.className = 'rm2-step';
          var num = document.createElement('div');
          num.className = 'rm2-step-no';
          num.textContent = stepMatch[1];
          var txt = document.createElement('div');
          txt.className = 'rm2-step-content';
          txt.innerHTML = self.inlineMath(stepMatch[2]);
          row.appendChild(num); row.appendChild(txt);
          secBody.appendChild(row);
          return;
        }

        // Bullet list
        if (/^[-*•]\s/.test(t)) {
          flushFormulas();
          if (!currentList) {
            currentList = document.createElement('ul');
            currentList.className = 'rm2-list';
            secBody.appendChild(currentList);
          }
          var li = document.createElement('li');
          li.innerHTML = self.inlineMath(t.replace(/^[-*•]\s+/, ''));
          currentList.appendChild(li);
          return;
        }
        flushList();

        // Note / tip lines
        if (/^(note|tip|hint|check|verify|therefore|thus)\s*[:\-]/i.test(t)) {
          flushFormulas();
          var note = document.createElement('div');
          note.className = 'rm2-note';
          note.innerHTML = self.inlineMath(t);
          secBody.appendChild(note);
          return;
        }

        // Formula / equation line: contains math operators or = sign with variables
        var looksLikeMath = (
          /[=]/.test(t) && /[+\-*/^x²³√∫∑πθ]|[a-z]\s*[+\-*/=]|\b\d+[a-z]/.test(t)
        ) || /^\s*\$/.test(t) || /^\s*\\/.test(t);

        if (looksLikeMath) {
          var clean = t.replace(/^\$|\$$/g, '').replace(/`/g, '');
          pendingFormulas.push(clean);
          return;
        }

        // Plain prose
        flushFormulas();
        var para = document.createElement('div');
        para.className = 'rm2-para';
        para.innerHTML = self.inlineMath(t);
        secBody.appendChild(para);
      });

      flushFormulas();
      sectionEl.appendChild(secBody);
      body.appendChild(sectionEl);
    });

    return body;
  },

  /* ══════════════════════════════════════════
     RESEARCH PAPER RENDERER
  ══════════════════════════════════════════ */
  renderPaper: function(content, pid) {
    var self = window.StreminiResearch;
    var body = document.createElement('div');
    body.className = 'rm2-paper-body';
    body.id = pid;

    var lines = content.split('\n').map(function(l) { return l.trim(); });

    // Extract title (first non-empty line before "Authors:")
    var titleLine = '';
    var authorsLine = '';
    var titleIdx = -1;
    for (var i = 0; i < lines.length; i++) {
      if (/^authors?:/i.test(lines[i])) { authorsLine = lines[i]; break; }
      if (!titleLine && lines[i]) { titleLine = lines[i]; titleIdx = i; }
    }

    if (titleLine) {
      var titleEl = document.createElement('div');
      titleEl.className = 'rm2-paper-title';
      titleEl.textContent = titleLine.replace(/^#{1,3}\s*/, '');
      body.appendChild(titleEl);
    }
    if (authorsLine) {
      var metaEl = document.createElement('div');
      metaEl.className = 'rm2-paper-meta';
      authorsLine.split('|').map(function(s) { return s.trim(); }).filter(Boolean).forEach(function(seg) {
        var sp = document.createElement('span');
        sp.textContent = seg.replace(/^authors?:\s*/i, '');
        metaEl.appendChild(sp);
      });
      body.appendChild(metaEl);
    }

    // Parse sections
    var sections = [];
    var curTitle = null, curParas = [];

    function flushPaperSection() {
      if (curTitle !== null || curParas.length) {
        sections.push({ title: curTitle, paras: curParas.slice() });
      }
      curTitle = null; curParas = [];
    }

    var contentStart = authorsLine ? lines.indexOf(authorsLine) + 1 : (titleIdx >= 0 ? titleIdx + 1 : 0);
    var paraBuffer = [];

    function flushPara() {
      var txt = paraBuffer.join(' ').trim();
      paraBuffer = [];
      if (txt) curParas.push(txt);
    }

    for (var li = contentStart; li < lines.length; li++) {
      var l = lines[li];
      var isSection = /^#{1,3}\s+/.test(l) || /^(\d+)\.\s+[A-Z]/.test(l) || /^(ABSTRACT|INTRODUCTION|CONCLUSION|DISCUSSION|REFERENCES|METHODOLOGY|RESULTS|FINDINGS)\s*$/i.test(l);
      if (isSection) {
        flushPara(); flushPaperSection();
        curTitle = l.replace(/^#{1,3}\s*/, '').replace(/^\d+\.\s+/, '');
      } else if (!l) {
        flushPara();
      } else {
        paraBuffer.push(l);
      }
    }
    flushPara(); flushPaperSection();

    sections.forEach(function(sec) {
      if (!sec.title && !sec.paras.length) return;
      var secEl = document.createElement('div');
      secEl.className = 'rm2-paper-section';
      if (sec.title) {
        var hd = document.createElement('div');
        hd.className = 'rm2-paper-sec-hd';
        hd.textContent = sec.title;
        secEl.appendChild(hd);
      }
      sec.paras.forEach(function(p) {
        if (/^keywords?:/i.test(p)) {
          var kw = document.createElement('div');
          kw.className = 'rm2-keywords';
          kw.innerHTML = '<strong>Keywords:</strong> ' + self.esc(p.replace(/^keywords?:\s*/i, ''));
          secEl.appendChild(kw);
        } else if (/^\[\d+\]|^[A-Z][a-z]+,/.test(p)) {
          var ref = document.createElement('div');
          ref.className = 'rm2-ref-item';
          ref.textContent = p;
          secEl.appendChild(ref);
        } else {
          var para = document.createElement('div');
          para.className = 'rm2-paper-para';
          para.textContent = p;
          secEl.appendChild(para);
        }
      });
      body.appendChild(secEl);
    });

    return body;
  },

  /* ══════════════════════════════════════════
     MAIN RENDER ENTRY
  ══════════════════════════════════════════ */
  renderResult: async function(data, container, mode) {
    var self = window.StreminiResearch;
    self.injectStyles();

    var isMath = (data.status === 'SOLUTION' || mode === 'math');
    var content = data.content || data.solution || '';
    var pid = 'rm2_' + Date.now();

    var wrap = document.createElement('div');
    wrap.className = 'rm2-wrap';

    // ── Chip ──
    var chip = document.createElement('div');
    chip.className = 'rm2-chip ' + (isMath ? 'rm2-chip-math' : 'rm2-chip-research');
    chip.innerHTML = isMath
      ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> Math Solution'
      : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> Research Paper';
    wrap.appendChild(chip);

    // ── Card ──
    var card = document.createElement('div');
    card.className = 'rm2-card';

    var hd = document.createElement('div');
    hd.className = 'rm2-card-hd';
    var titleEl = document.createElement('div');
    titleEl.className = 'rm2-card-title';
    titleEl.textContent = isMath ? 'Math Solution' : 'Research Paper';
    var copyBtn = document.createElement('button');
    copyBtn.className = 'rm2-copy-btn';
    copyBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    copyBtn.onclick = function() {
      var el = document.getElementById(pid);
      self.copyToClipboard(el ? el.innerText : content, copyBtn);
    };
    hd.appendChild(titleEl);
    hd.appendChild(copyBtn);
    card.appendChild(hd);

    // ── Body ──
    var bodyEl = isMath
      ? self.renderMath(content, pid)
      : self.renderPaper(content, pid);
    card.appendChild(bodyEl);

    // ── Download row ──
    var dlRow = document.createElement('div');
    dlRow.className = 'rm2-dl-row';
    var dlBtn = document.createElement('button');
    dlBtn.className = 'rm2-dl-btn';
    dlBtn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt';
    dlBtn.onclick = function() {
      var el = document.getElementById(pid);
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([el ? el.innerText : content], { type: 'text/plain' }));
      a.download = 'stremini-' + (isMath ? 'math' : 'paper') + '-' + Date.now() + '.txt';
      a.click();
    };
    dlRow.appendChild(dlBtn);
    card.appendChild(dlRow);

    wrap.appendChild(card);

    if (container) {
      container.innerHTML = '';
      container.appendChild(wrap);
    }
    return wrap;
  }
};
