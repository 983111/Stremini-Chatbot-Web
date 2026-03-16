/* ═══════════════════════════════════════════════════════════════
   STREMINI — RESEARCH & MATH RENDERER v3.0
   Handles full structured math output: sections, steps, formulas,
   diagrams, classifications, lemmas. No max-height truncation.
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
    var lower = (text||'').toLowerCase();
    for (var i=0;i<RESEARCH_KEYWORDS.length;i++) if (lower.indexOf(RESEARCH_KEYWORDS[i])!==-1) return 'research';
    for (var j=0;j<MATH_KEYWORDS.length;j++) if (lower.indexOf(MATH_KEYWORDS[j])!==-1) return 'math';
    return null;
  },

  call: async function(query, mode, history) {
    var res = await fetch(RESEARCH_API, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({query:query, mode:mode, history:(history||[]).slice(-10), iteration:0})
    });
    if (!res.ok) throw new Error('Research API '+res.status);
    var data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },

  esc: function(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); },

  cleanMath: function(t) {
    return t
      .replace(/plusminus|\\pm/g,'±').replace(/minusminus/g,'∓')
      .replace(/sqrt\(([^)]+)\)/g,'√($1)').replace(/\bsqrt\b/g,'√')
      .replace(/\^2(?=[^a-zA-Z]|$)/g,'²').replace(/\^3(?=[^a-zA-Z]|$)/g,'³')
      .replace(/\!=|≠/g,'≠').replace(/<=/g,'≤').replace(/>=/g,'≥')
      .replace(/=>/g,'⟹').replace(/\binfty\b/g,'∞')
      .replace(/\btheta\b/g,'θ').replace(/\bpi\b/g,'π')
      .replace(/\balpha\b/g,'α').replace(/\bbeta\b/g,'β')
      .replace(/\bsigma\b/g,'σ').replace(/\bdelta\b/g,'δ');
  },

  inline: function(text) {
    var self = window.StreminiResearch;
    var s = self.esc(text);
    s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    s = s.replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
    s = s.replace(/`([^`]+)`/g,'<span class="rm3-mono">$1</span>');
    s = s.replace(/\$([^$\n]+)\$/g,'<span class="rm3-mono">$1</span>');
    s = s.replace(/plusminus|\\pm/g,'±').replace(/sqrt\(([^)]+)\)/g,'√($1)').replace(/\!=|!=/g,'≠');
    return s;
  },

  copyText: function(text, btn) {
    var orig = btn.innerHTML;
    var ok = function() {
      btn.classList.add('rm3-copied');
      btn.innerHTML = '✓ Copied';
      setTimeout(function(){ btn.classList.remove('rm3-copied'); btn.innerHTML = orig; }, 2000);
    };
    try { navigator.clipboard.writeText(text).then(ok).catch(ok); } catch(e) { ok(); }
  },

  injectStyles: function() {
    if (document.getElementById('rm3-styles')) return;
    var s = document.createElement('style');
    s.id = 'rm3-styles';
    s.textContent = `
.rm3-wrap{font-family:var(--font);}
.rm3-chip{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:12px;}
.rm3-chip-math{background:#f5f3ff;color:#6d28d9;border:1px solid #ddd6fe;}
.rm3-chip-research{background:#fffbf5;color:#b45309;border:1px solid #fde68a;}
.rm3-card{background:var(--bg);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);}
.rm3-card-hd{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--bdr);background:var(--bg-sub);}
.rm3-card-title{font-size:12.5px;font-weight:600;color:var(--tx2);}
.rm3-copy-btn{background:none;border:1px solid var(--bdr);cursor:pointer;font-size:11px;color:var(--tx3);font-family:var(--font);display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:5px;transition:all .15s;}
.rm3-copy-btn:hover{background:var(--bg-hov);color:var(--tx);}
.rm3-copied{background:#ecfdf5!important;color:#059669!important;border-color:#6ee7b7!important;}
.rm3-body{padding:0;}
.rm3-section{border-bottom:1px solid var(--bdr-soft);}
.rm3-section:last-child{border-bottom:none;}
.rm3-section-hd{display:flex;align-items:center;gap:8px;padding:9px 16px;cursor:pointer;background:var(--bg-sub);border-bottom:1px solid var(--bdr-soft);transition:background .12s;user-select:none;}
.rm3-section-hd:hover{background:var(--bg-hov);}
.rm3-section-dot{width:7px;height:7px;border-radius:50%;background:var(--acc);flex-shrink:0;}
.rm3-section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--tx2);flex:1;}
.rm3-chevron{color:var(--tx3);transition:transform .18s;flex-shrink:0;}
.rm3-chevron.open{transform:rotate(180deg);}
.rm3-section-body{padding:14px 18px;display:flex;flex-direction:column;gap:10px;}
.rm3-section-body.collapsed{display:none;}
.rm3-section.is-answer .rm3-section-hd{background:#f0fdf4;border-color:#bbf7d0;}
.rm3-section.is-answer .rm3-section-dot{background:#059669;}
.rm3-section.is-answer .rm3-section-label{color:#15803d;}
.rm3-section.is-verify .rm3-section-hd{background:#f0f9ff;border-color:#bae6fd;}
.rm3-section.is-verify .rm3-section-dot{background:#0369a1;}
.rm3-section.is-verify .rm3-section-label{color:#075985;}
.rm3-formula{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:10px;padding:13px 16px;font-family:var(--mono);font-size:14px;color:#0369a1;line-height:1.8;overflow-x:auto;white-space:pre-wrap;word-break:break-word;}
.rm3-answer-box{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #6ee7b7;border-radius:10px;padding:15px 18px;}
.rm3-answer-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#059669;margin-bottom:8px;font-family:var(--font);}
.rm3-answer-formula{font-family:var(--mono);font-size:15px;font-weight:600;color:#065f46;line-height:1.9;white-space:pre-wrap;word-break:break-word;}
.rm3-answer-note{font-size:13px;color:#047857;margin-top:8px;line-height:1.7;}
.rm3-step{display:flex;gap:10px;align-items:flex-start;background:#faf5ff;border:1px solid #e9d5ff;border-radius:9px;padding:11px 13px;}
.rm3-step-no{width:24px;height:24px;border-radius:50%;flex-shrink:0;background:#7c3aed;color:#fff;font-size:11.5px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.rm3-step-body{flex:1;min-width:0;}
.rm3-step-title{font-size:13px;font-weight:700;color:#4c1d95;margin-bottom:4px;}
.rm3-step-content{font-size:13.5px;color:#3b1e6e;line-height:1.75;}
.rm3-step-formulas{margin-top:8px;display:flex;flex-direction:column;gap:5px;}
.rm3-step-formula{font-family:var(--mono);font-size:13px;color:#0369a1;background:#eff6ff;border:1px solid #bfdbfe;border-radius:7px;padding:8px 11px;white-space:pre-wrap;word-break:break-word;}
.rm3-lemma{background:var(--bg-sub);border:1px solid var(--bdr);border-left:3px solid #7c3aed;border-radius:0 9px 9px 0;padding:11px 14px;}
.rm3-lemma-title{font-size:11.5px;font-weight:700;color:#6d28d9;margin-bottom:5px;}
.rm3-lemma-body{font-size:13.5px;color:var(--tx2);line-height:1.7;}
.rm3-lemma-line{font-family:var(--mono);font-size:13px;color:#0369a1;margin:4px 0;}
.rm3-classify{display:flex;flex-direction:column;gap:6px;}
.rm3-classify-item{display:flex;gap:10px;align-items:flex-start;padding:9px 12px;border-radius:8px;border:1px solid;}
.rm3-classify-item.case-pos{background:#f0fdf4;border-color:#bbf7d0;}
.rm3-classify-item.case-zero{background:#fffbf5;border-color:#fde68a;}
.rm3-classify-item.case-neg{background:#fef2f2;border-color:#fecaca;}
.rm3-classify-cond{font-family:var(--mono);font-size:12px;font-weight:700;flex-shrink:0;min-width:60px;padding-top:1px;}
.case-pos .rm3-classify-cond{color:#15803d;}
.case-zero .rm3-classify-cond{color:#b45309;}
.case-neg .rm3-classify-cond{color:#dc2626;}
.rm3-classify-text{font-size:13px;line-height:1.6;color:var(--tx);}
.rm3-list{display:flex;flex-direction:column;gap:5px;padding-left:4px;}
.rm3-list-item{display:flex;gap:9px;align-items:flex-start;font-size:13.5px;color:var(--tx);line-height:1.65;}
.rm3-list-dot{width:5px;height:5px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:7px;}
.rm3-mono{font-family:var(--mono);font-size:.9em;background:var(--code-bg);border:1px solid var(--bdr);border-radius:3px;padding:1px 5px;color:#b5490d;}
.rm3-para{font-size:13.5px;color:var(--tx);line-height:1.8;}
.rm3-note{background:#eff6ff;border:1px solid #bfdbfe;border-left:3px solid #2563eb;border-radius:0 8px 8px 0;padding:10px 13px;font-size:13px;color:#1e3a8a;line-height:1.65;}
.rm3-rule{border:none;border-top:2px dashed var(--bdr);margin:6px 0;opacity:.4;}
.rm3-diagram{border:1px solid var(--bdr);border-radius:10px;overflow:hidden;background:var(--bg-sub);}
.rm3-diagram-bar{display:flex;align-items:center;gap:6px;padding:7px 12px;border-bottom:1px solid var(--bdr);background:var(--bg);font-size:10.5px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.4px;}
.rm3-diagram-content{padding:16px;display:flex;justify-content:center;overflow-x:auto;min-height:60px;align-items:center;}
.rm3-diagram-content svg{max-width:100%;height:auto;}
.rm3-diagram-fallback{font-family:var(--mono);font-size:11.5px;color:var(--tx2);white-space:pre;overflow-x:auto;padding:12px;background:var(--bg-sub);line-height:1.6;}
.rm3-dl-row{display:flex;gap:6px;padding:10px 16px;border-top:1px solid var(--bdr-soft);background:var(--bg-sub);}
.rm3-dl-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border:none;border-radius:7px;font-family:var(--font);font-size:11.5px;font-weight:500;cursor:pointer;background:var(--tx);color:#fff;transition:all .15s;}
.rm3-dl-btn:hover{background:#2d2a26;transform:translateY(-1px);}
/* Paper */
.rm3-paper-bd{padding:22px 24px;}
.rm3-paper-title{font-family:'Lora',Georgia,serif;font-size:18px;font-weight:700;line-height:1.35;color:var(--tx);margin-bottom:6px;}
.rm3-paper-meta{font-size:12px;color:var(--tx3);margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;padding-bottom:14px;border-bottom:1.5px solid var(--bdr);}
.rm3-paper-sec-hd{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#b45309;margin:16px 0 9px;padding-bottom:5px;border-bottom:1px solid var(--bdr-soft);}
.rm3-paper-para{font-family:'Lora',Georgia,serif;font-size:14.5px;line-height:1.85;color:var(--tx);margin-bottom:10px;text-align:justify;}
.rm3-keywords{background:var(--bg-sub);border:1px solid var(--bdr-soft);border-radius:7px;padding:8px 12px;font-size:12.5px;color:var(--tx2);margin-top:8px;}
.rm3-ref-item{font-size:12.5px;line-height:1.65;margin-bottom:7px;padding-left:20px;text-indent:-20px;color:var(--tx2);}
`;
    document.head.appendChild(s);
  },

  /* ── Split raw content into named sections ── */
  splitSections: function(raw) {
    var diagrams = [];
    var stripped = raw.replace(/<diagram\s+type=["']?(\w+)["']?\s+title=["']?([^"'>]*)["']?\s*>([\s\S]*?)<\/diagram>/gi,
      function(_, dtype, dtitle, dcode) {
        var idx = diagrams.length;
        diagrams.push({ type:dtype.trim(), title:dtitle.trim(), code:dcode.trim() });
        return '\n__DIAGRAM_'+idx+'__\n';
      });

    var lines = stripped.split('\n');
    var sections = [], curLabel = null, curLines = [];

    var HEADS = [
      /^(PROBLEM\s*RESTATEMENT|PROBLEM)\s*$/i,
      /^(GIVEN\s*(?:&|AND)\s*FIND|GIVEN)\s*$/i,
      /^(SOLUTION|PROOF|DERIVATION)\s*$/i,
      /^(ANSWER|FINAL\s*ANSWER|THE\s*ANSWER)\s*$/i,
      /^(VERIFICATION|VERIFY|CHECK)\s*$/i,
      /^(KEY\s*CONCEPTS?|CONCEPTS?\s*USED|SUMMARY)\s*$/i,
      /^(EXAMPLE[S]?)\s*$/i,
      /^(NOTE[S]?|REMARK[S]?)\s*$/i,
      /^#{1,3}\s+.+$/
    ];

    function isHead(t) {
      if (!t || t.length < 3 || t.length > 70) return false;
      for (var i=0;i<HEADS.length;i++) if (HEADS[i].test(t)) return true;
      if (/^[A-Z][A-Z0-9\s&\/\-]+$/.test(t) && t.length>4 && t.length<60 && !t.endsWith('.')) return true;
      return false;
    }
    function getLabel(t) { return t.replace(/^#{1,3}\s+/,'').replace(/:$/,'').trim(); }

    lines.forEach(function(raw) {
      var t = raw.trim();
      if (isHead(t)) {
        sections.push({label:curLabel, lines:curLines.slice()});
        curLabel = getLabel(t); curLines = [];
      } else {
        curLines.push(raw);
      }
    });
    sections.push({label:curLabel, lines:curLines.slice()});
    sections = sections.filter(function(s){ return s.label || s.lines.join('').trim(); });
    return {sections:sections, diagrams:diagrams};
  },

  isMathLine: function(t) {
    if (!t) return false;
    return (/[=]/.test(t) && (/[+\-*/^]/.test(t) || /[a-z]\*[a-z]/i.test(t) || /\b(sqrt|x₁|x₂|D\s*=|b\^2|2\*a)\b/.test(t)))
      || /^\s*[A-Za-z]\s*[+\-*/=]/.test(t)
      || /\$[^$]+\$/.test(t)
      || /\^[0-9]/.test(t)
      || /[²³√±∓∫∑πθ]/.test(t);
  },

  buildDiagram: async function(diag) {
    var self = window.StreminiResearch;
    var wrap = document.createElement('div'); wrap.className='rm3-diagram';
    var bar = document.createElement('div'); bar.className='rm3-diagram-bar';
    bar.textContent = diag.title || diag.type;
    wrap.appendChild(bar);
    var content = document.createElement('div'); content.className='rm3-diagram-content';
    if (window.mermaid) {
      try {
        var code = diag.code.replace(/\{([^}]+)\}/g,'[$1]').trim();
        var uid = 'rm3d_'+Date.now()+'_'+Math.random().toString(36).slice(2);
        var result = await window.mermaid.render(uid, code);
        content.innerHTML = result.svg || result;
      } catch(e) {
        var fb = document.createElement('div'); fb.className='rm3-diagram-fallback'; fb.textContent=diag.code; content.appendChild(fb);
      }
    } else {
      var fb2 = document.createElement('div'); fb2.className='rm3-diagram-fallback'; fb2.textContent=diag.code; content.appendChild(fb2);
    }
    wrap.appendChild(content);
    return wrap;
  },

  renderSectionBody: async function(lines, diagrams, isAnswer) {
    var self = window.StreminiResearch;
    var C = document.createElement('div'); C.className='rm3-section-body';
    var i=0, bulletEl=null, classifyEls=[];

    function flushBullets(){ if(bulletEl){C.appendChild(bulletEl);bulletEl=null;} }
    function flushClassify(){
      if(!classifyEls.length)return;
      var cl=document.createElement('div');cl.className='rm3-classify';
      classifyEls.forEach(function(x){cl.appendChild(x);});
      C.appendChild(cl); classifyEls=[];
    }

    function isStep(t){ return /^step\s+\d+\s*[—–\-:]/i.test(t)||/^\d+[.)]\s+/.test(t); }
    function isClassify(t){ return /^(if|when|case)\s+(D|discriminant)\s*[><=!]/i.test(t)||/^[-*•]\s+(two distinct|one real|complex conjugate|one repeated)/i.test(t); }
    function isLemma(t){ return /^(lemma|theorem|corollary|proposition)\s*/i.test(t); }

    while (i<lines.length) {
      var raw=lines[i], t=raw.trim(); i++;

      if (!t) { flushBullets(); flushClassify(); continue; }

      if (/^__DIAGRAM_(\d+)__$/.test(t)) {
        flushBullets(); flushClassify();
        var dIdx=parseInt(t.match(/\d+/)[0]);
        if (diagrams[dIdx]) { var dEl=await self.buildDiagram(diagrams[dIdx]); C.appendChild(dEl); }
        continue;
      }

      if (/^[=\-─━]{4,}$/.test(t)) {
        flushBullets(); flushClassify();
        var hr=document.createElement('hr');hr.className='rm3-rule';C.appendChild(hr);
        continue;
      }

      if (/^(note|tip|remark|recall)\s*[:\-]/i.test(t)) {
        flushBullets(); flushClassify();
        var no=document.createElement('div');no.className='rm3-note';no.innerHTML=self.inline(t);C.appendChild(no);
        continue;
      }

      if (isClassify(t)) {
        flushBullets();
        var cls='case-pos';
        if (/D\s*=\s*0/.test(t)) cls='case-zero';
        else if (/D\s*</.test(t)||/complex|no real/i.test(t)) cls='case-neg';
        var ci=document.createElement('div');ci.className='rm3-classify-item '+cls;
        var cond=document.createElement('div');cond.className='rm3-classify-cond';
        var cm=t.match(/D\s*[><=!]+\s*0/)||[];
        cond.textContent=cm[0]||(cls==='case-zero'?'D = 0':cls==='case-neg'?'D < 0':'D > 0');
        var ctxt=document.createElement('div');ctxt.className='rm3-classify-text';
        ctxt.innerHTML=self.inline(t.replace(/^[-*•]\s*/,'').replace(/^(if|when)\s+(D\s*[><=!]+\s*0)[,\s]*/i,''));
        ci.appendChild(cond);ci.appendChild(ctxt);
        classifyEls.push(ci);
        continue;
      }
      flushClassify();

      if (/^[-*•]\s/.test(t)) {
        if (!bulletEl){bulletEl=document.createElement('div');bulletEl.className='rm3-list';}
        var bi=document.createElement('div');bi.className='rm3-list-item';
        var bd=document.createElement('div');bd.className='rm3-list-dot';
        var bt=document.createElement('div');bt.innerHTML=self.inline(t.replace(/^[-*•]\s+/,''));
        bi.appendChild(bd);bi.appendChild(bt);bulletEl.appendChild(bi);
        continue;
      }
      flushBullets();

      if (isLemma(t)) {
        var lemTitle=t, lemLines=[];
        while(i<lines.length&&lines[i].trim()&&!isStep(lines[i].trim())) { lemLines.push(lines[i].trim()); i++; }
        var lem=document.createElement('div');lem.className='rm3-lemma';
        var lt=document.createElement('div');lt.className='rm3-lemma-title';lt.innerHTML=self.inline(lemTitle);lem.appendChild(lt);
        var lb=document.createElement('div');lb.className='rm3-lemma-body';
        lemLines.forEach(function(ll){
          if(self.isMathLine(ll)){var fe=document.createElement('div');fe.className='rm3-lemma-line';fe.textContent=self.cleanMath(ll);lb.appendChild(fe);}
          else{var pe=document.createElement('div');pe.style.cssText='font-size:13px;line-height:1.7;margin:3px 0;';pe.innerHTML=self.inline(ll);lb.appendChild(pe);}
        });
        lem.appendChild(lb);C.appendChild(lem);
        continue;
      }

      if (isStep(t)) {
        var sm=/^step\s+(\d+)\s*[—–\-:]+\s*(.*)/i.exec(t)||/^(\d+)[.)]\s+(?:\*\*([^*]+)\*\*[\s\-–:]*(.*)|(.*))/.exec(t);
        var sNum='', sTitle='', sRest='';
        if (sm) {
          sNum=sm[1]; sTitle=(sm[2]||sm[4]||'').replace(/^\*\*|\*\*$/g,'').trim(); sRest=(sm[3]||'').trim();
        }
        var stepEl=document.createElement('div');stepEl.className='rm3-step';
        var sNo=document.createElement('div');sNo.className='rm3-step-no';sNo.textContent=sNum;
        var sBody=document.createElement('div');sBody.className='rm3-step-body';
        if(sTitle){var sTit=document.createElement('div');sTit.className='rm3-step-title';sTit.innerHTML=self.inline(sTitle);sBody.appendChild(sTit);}
        if(sRest){var sC=document.createElement('div');sC.className='rm3-step-content';sC.innerHTML=self.inline(sRest);sBody.appendChild(sC);}
        var sf=[], sp=[];
        while(i<lines.length){var nt=lines[i].trim();if(!nt||isStep(nt)||isLemma(nt)||/^__DIAGRAM_/.test(nt)||/^[A-Z][A-Z\s&\/\-]{3,}$/.test(nt))break;if(self.isMathLine(nt))sf.push(nt);else sp.push(nt);i++;}
        if(sp.length){var spr=document.createElement('div');spr.className='rm3-step-content';spr.innerHTML=self.inline(sp.join(' '));sBody.appendChild(spr);}
        if(sf.length){var sfW=document.createElement('div');sfW.className='rm3-step-formulas';sf.forEach(function(fl){var fe=document.createElement('div');fe.className='rm3-step-formula';fe.textContent=self.cleanMath(fl);sfW.appendChild(fe);});sBody.appendChild(sfW);}
        stepEl.appendChild(sNo);stepEl.appendChild(sBody);C.appendChild(stepEl);
        continue;
      }

      if (isAnswer && self.isMathLine(t)) {
        var af=[t];
        while(i<lines.length&&(self.isMathLine(lines[i].trim())||/^[=\-─]{4,}$/.test(lines[i].trim())||!lines[i].trim())){var nl=lines[i].trim();i++;if(self.isMathLine(nl))af.push(nl);}
        var ab=document.createElement('div');ab.className='rm3-answer-box';
        var al=document.createElement('div');al.className='rm3-answer-lbl';al.textContent='Final Answer';ab.appendChild(al);
        var fLines=[],nLines=[];
        af.forEach(function(fl){
          var cl=self.cleanMath(fl);
          if(/[=±√x₁x₂]/.test(cl)||/\b[a-z]\s*[+\-*/=]/.test(cl))fLines.push(cl);else nLines.push(fl);
        });
        if(fLines.length){var af2=document.createElement('div');af2.className='rm3-answer-formula';af2.textContent=fLines.join('\n');ab.appendChild(af2);}
        if(nLines.length){var an=document.createElement('div');an.className='rm3-answer-note';an.innerHTML=self.inline(nLines.join(' '));ab.appendChild(an);}
        C.appendChild(ab);
        continue;
      }

      if (self.isMathLine(t)) {
        var mf=[t];
        while(i<lines.length&&self.isMathLine(lines[i].trim())){mf.push(lines[i].trim());i++;}
        var fb=document.createElement('div');fb.className='rm3-formula';
        fb.textContent=mf.map(function(l){return self.cleanMath(l);}).join('\n');
        C.appendChild(fb);
        continue;
      }

      // Prose paragraph
      var pl=[t];
      while(i<lines.length){var nt2=lines[i].trim();if(!nt2||isStep(nt2)||isLemma(nt2)||isClassify(nt2)||/^[-*•]\s/.test(nt2)||/^__DIAGRAM_/.test(nt2)||self.isMathLine(nt2))break;pl.push(nt2);i++;}
      var pp=document.createElement('div');pp.className='rm3-para';pp.innerHTML=self.inline(pl.join(' '));C.appendChild(pp);
    }

    flushBullets();
    flushClassify();
    return C;
  },

  renderResult: async function(data, container, mode) {
    var self = window.StreminiResearch;
    self.injectStyles();

    var isMath = (data.status==='SOLUTION'||mode==='math');
    var content = data.content||data.solution||'';
    var pid = 'rm3_'+Date.now();

    var wrap=document.createElement('div');wrap.className='rm3-wrap';

    var chip=document.createElement('div');
    chip.className='rm3-chip '+(isMath?'rm3-chip-math':'rm3-chip-research');
    chip.innerHTML=isMath
      ?'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> Math Solution'
      :'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> Research Paper';
    wrap.appendChild(chip);

    var card=document.createElement('div');card.className='rm3-card';

    var hd=document.createElement('div');hd.className='rm3-card-hd';
    var ht=document.createElement('div');ht.className='rm3-card-title';ht.textContent=isMath?'Math Solution':'Research Paper';
    var cb=document.createElement('button');cb.className='rm3-copy-btn';
    cb.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    cb.onclick=function(){var el=document.getElementById(pid);self.copyText(el?el.innerText:content,cb);};
    hd.appendChild(ht);hd.appendChild(cb);card.appendChild(hd);

    if (isMath) {
      var parsed=self.splitSections(content);
      var sections=parsed.sections, diagrams=parsed.diagrams;
      var hasLabels=sections.filter(function(s){return s.label;}).length>1;
      var body=document.createElement('div');body.className='rm3-body';body.id=pid;

      for(var si=0;si<sections.length;si++){
        var sec=sections[si];
        var label=sec.label||'';
        var isAnswer=/^(answer|final\s*answer|the\s*answer)\s*$/i.test(label);
        var isVerify=/^(verification|verify|check)\s*$/i.test(label);

        if(!hasLabels){
          var fb3=await self.renderSectionBody(sec.lines,diagrams,false);
          fb3.id=pid;body.appendChild(fb3);
        } else {
          var secEl=document.createElement('div');
          secEl.className='rm3-section'+(isAnswer?' is-answer':isVerify?' is-verify':'');
          if(label){
            var shd=document.createElement('div');shd.className='rm3-section-hd';
            var sdot=document.createElement('span');sdot.className='rm3-section-dot';
            var slbl=document.createElement('span');slbl.className='rm3-section-label';slbl.textContent=label;
            var schev=document.createElement('span');schev.className='rm3-chevron open';
            schev.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
            shd.appendChild(sdot);shd.appendChild(slbl);shd.appendChild(schev);
            (function(chevEl,sEl){
              var open=true;
              shd.onclick=function(){
                open=!open;
                chevEl.classList.toggle('open',open);
                var sb=sEl.querySelector('.rm3-section-body');
                if(sb)sb.classList.toggle('collapsed',!open);
              };
            })(schev,secEl);
            secEl.appendChild(shd);
          }
          var secBody=await self.renderSectionBody(sec.lines,diagrams,isAnswer);
          secEl.appendChild(secBody);
          body.appendChild(secEl);
        }
      }
      card.appendChild(body);
    } else {
      // Research paper — simpler flat layout
      var bd=document.createElement('div');bd.className='rm3-paper-bd';bd.id=pid;
      var plines=content.split('\n').map(function(l){return l.trim();});
      var titleDone=false, metaDone=false, curSecHd=null;

      plines.forEach(function(l){
        if(!l) return;
        if(!titleDone && !/^authors?:/i.test(l)){
          var tEl=document.createElement('div');tEl.className='rm3-paper-title';tEl.textContent=l.replace(/^#{1,3}\s*/,'');bd.appendChild(tEl);titleDone=true;return;
        }
        if(/^authors?:/i.test(l)){
          var mEl=document.createElement('div');mEl.className='rm3-paper-meta';
          l.split('|').map(function(s){return s.trim();}).filter(Boolean).forEach(function(seg){var sp=document.createElement('span');sp.textContent=seg.replace(/^authors?:\s*/i,'');mEl.appendChild(sp);});
          bd.appendChild(mEl);metaDone=true;return;
        }
        if(/^#{1,3}\s+/.test(l)||/^(\d+)\.\s+[A-Z]/.test(l)||/^(ABSTRACT|INTRODUCTION|CONCLUSION|DISCUSSION|REFERENCES|METHODOLOGY|RESULTS)\s*$/i.test(l)){
          var shd2=document.createElement('div');shd2.className='rm3-paper-sec-hd';shd2.textContent=l.replace(/^#{1,3}\s*/,'').replace(/^\d+\.\s*/,'');bd.appendChild(shd2);return;
        }
        if(/^keywords?:/i.test(l)){
          var kw=document.createElement('div');kw.className='rm3-keywords';kw.innerHTML='<strong>Keywords:</strong> '+window.StreminiResearch.esc(l.replace(/^keywords?:\s*/i,''));bd.appendChild(kw);return;
        }
        if(/^\[\d+\]|^[A-Z][a-z]+,/.test(l)){
          var ref=document.createElement('div');ref.className='rm3-ref-item';ref.textContent=l;bd.appendChild(ref);return;
        }
        var pp2=document.createElement('div');pp2.className='rm3-paper-para';pp2.textContent=l;bd.appendChild(pp2);
      });
      card.appendChild(bd);
    }

    var dlRow=document.createElement('div');dlRow.className='rm3-dl-row';
    var dlBtn=document.createElement('button');dlBtn.className='rm3-dl-btn';
    dlBtn.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt';
    dlBtn.onclick=function(){
      var el=document.getElementById(pid);
      var a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([el?el.innerText:content],{type:'text/plain'}));
      a.download='stremini-'+(isMath?'math':'paper')+'-'+Date.now()+'.txt';
      a.click();
    };
    dlRow.appendChild(dlBtn);card.appendChild(dlRow);
    wrap.appendChild(card);

    if(container){container.innerHTML='';container.appendChild(wrap);}
    return wrap;
  }
};
