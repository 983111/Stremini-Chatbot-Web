/* ═══════════════════════════════════════════════════════════════
   STREMINI — UNIFIED AGENT ROUTER v1.0
   Routes queries to the correct specialist backend and renders
   structured responses using agent-specific renderers.
   
   Covers:
   ① Research & Math     → agentic-research worker
   ② Growth Intelligence → growth-agent worker  
   ③ Strategy & Legal    → startup-strategy / legal-compliance workers
   ④ Competitive Intel   → compeititve worker
═══════════════════════════════════════════════════════════════ */

window.StreminiAgentRouter = (function() {

  /* ─── Backend URLs ─── */
  var BACKENDS = {
    research:    'https://agentic-research.vishwajeetadkine705.workers.dev',
    growth:      'https://growth-agent.vishwajeetadkine705.workers.dev',
    strategy:    'https://startup-strategy.vishwajeetadkine705.workers.dev',
    legal:       'https://legal-compliance.vishwajeetadkine705.workers.dev',
    competitive: 'https://compeititve.vishwajeetadkine705.workers.dev',
  };

  /* ─── Keyword maps for detection ─── */
  var DETECTION = {
    math: [
      'solve','calculate','compute','prove','proof','integral','derivative',
      'equation','formula','simplify','factor','differentiate','integrate',
      'theorem','lemma','algebra','calculus','matrix','determinant','eigenvalue',
      'probability','statistics','permutation','combination','binomial','limit',
      'series','sequence','converge','diverge','trigonometry','logarithm',
      'find the value','what is x','evaluate','expand','factorise'
    ],
    research: [
      'research paper','write a paper','write paper','academic paper',
      'literature review','study on','comprehensive study','overview of',
      'history of','impact of','analysis of','review of','science of',
      'theory of','effects of','examine','investigate','survey of',
      'write an essay','write a report on'
    ],
    growth: [
      'gtm strategy','go-to-market','viral loop','viral growth','growth loop',
      'ad creative','ad strategy','paid acquisition','funnel audit','cro',
      'landing page conversion','trial-to-paid','k-factor','viral coefficient',
      'growth strategy','user acquisition','retention strategy','churn',
      'growth hacking','product-led growth','plg','activation rate',
      'build our gtm','build our growth','design viral'
    ],
    strategy: [
      'business model','revenue projection','revenue model','unit economics',
      'market sizing','tam','sam','som','pitch deck','investor pitch',
      'swot analysis','swot','tows','competitive landscape','business canvas',
      'business plan','financial projection','mrr','arr','burn rate',
      'market analysis','go to market plan','startup strategy'
    ],
    legal: [
      'contract review','review this contract','terms and conditions',
      'privacy policy','gdpr','dpdp','ccpa','hipaa','compliance checklist',
      'legal risk','flag risks','red flags in contract','legal analysis',
      'terms of service','service agreement','nda','non disclosure',
      'ip clause','liability clause','payment terms contract',
      'startup legal','legal compliance'
    ],
    competitive: [
      'competitor analysis','competitive analysis','competitive intelligence',
      'monitor competitor','competitor report','competitive report',
      'threat analysis competitive','competitor strategy','battlecard',
      'compare competitors','vs competitor','market positioning',
      'competitor weakness','hiring signals','technology shift competitor',
      'deep dive on company','deep analysis of','company profile'
    ]
  };

  /* ─── Detect agent type ─── */
  function detect(text) {
    var lower = (text || '').toLowerCase();
    // Priority order matters — more specific checks first
    var order = ['math','research','legal','competitive','growth','strategy'];
    for (var i = 0; i < order.length; i++) {
      var type = order[i];
      var kws = DETECTION[type];
      for (var j = 0; j < kws.length; j++) {
        if (lower.indexOf(kws[j]) !== -1) return type;
      }
    }
    return null;
  }

  /* ─── Call a backend ─── */
  async function callBackend(url, payload) {
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Agent API ' + res.status);
    var data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  /* ─── CSS ─── */
  function injectStyles() {
    if (document.getElementById('sar-styles')) return;
    var s = document.createElement('style');
    s.id = 'sar-styles';
    s.textContent = `
/* ── Shared wrapper ── */
.sar-wrap { font-family: var(--font); }
.sar-chip { display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;
  letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:12px; }
.sar-chip-growth     { background:#fffbf5;color:#b45309;border:1px solid #fde68a; }
.sar-chip-strategy   { background:#fffbf5;color:#b45309;border:1px solid #fde68a; }
.sar-chip-legal      { background:#f5f3ff;color:#6d28d9;border:1px solid #ddd6fe; }
.sar-chip-competitive{ background:#f0f9ff;color:#0369a1;border:1px solid #bae6fd; }

/* ── Report block ── */
.sar-block { background:var(--bg);border:1px solid var(--bdr);border-radius:12px;
  overflow:hidden;box-shadow:var(--sh-sm);margin:2px 0 6px; }
.sar-block-hd { display:flex;align-items:center;justify-content:space-between;
  padding:10px 15px;border-bottom:1px solid var(--bdr);background:var(--bg-sub); }
.sar-block-title { font-size:12.5px;font-weight:600;color:var(--tx2); }
.sar-copy-btn { background:none;border:1px solid var(--bdr);cursor:pointer;font-size:11px;
  color:var(--tx3);font-family:var(--font);display:flex;align-items:center;gap:4px;
  padding:3px 9px;border-radius:4px;transition:all .15s; }
.sar-copy-btn:hover { background:var(--bg-hov);color:var(--tx); }

/* ── Section accordion ── */
.sar-body { max-height:600px;overflow-y:auto; }
.sar-section { border-bottom:1px solid var(--bdr-soft); }
.sar-section:last-child { border-bottom:none; }
.sar-sec-hd { display:flex;align-items:center;gap:9px;padding:12px 15px;cursor:pointer;
  transition:background .12s;user-select:none; }
.sar-sec-hd:hover { background:var(--bg-sub); }
.sar-sec-icon { width:26px;height:26px;border-radius:6px;display:flex;align-items:center;
  justify-content:center;flex-shrink:0; }
.sar-sec-icon svg { width:13px;height:13px; }
.sar-sec-label { font-size:13px;font-weight:600;flex:1; }
.sar-chevron { color:var(--tx3);transition:transform .18s; }
.sar-chevron.open { transform:rotate(180deg); }
.sar-sec-body { display:none;padding:0 15px 13px 50px; }
.sar-sec-body.open { display:block; }
.sar-sec-desc { font-size:13px;color:var(--tx2);line-height:1.65;margin-bottom:8px; }

/* ── KV items ── */
.sar-item { display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--bdr-soft);
  font-size:12.5px;line-height:1.5; }
.sar-item:last-child { border-bottom:none; }
.sar-item-label { font-weight:600;color:var(--tx2);min-width:150px;flex-shrink:0;font-size:12px; }
.sar-item-value { color:var(--tx);flex:1; }

/* ── Competitor cards ── */
.sar-cards-grid { display:flex;flex-direction:column;gap:9px; }
.sar-card { background:var(--bg-sub);border:1px solid var(--bdr-soft);border-radius:9px;padding:12px 14px; }
.sar-card-name { font-weight:600;font-size:13.5px;margin-bottom:7px;color:var(--tx); }
.sar-card-rows { display:flex;flex-direction:column;gap:4px; }
.sar-card-row { display:flex;gap:8px;font-size:12.5px;line-height:1.45; }
.sar-card-row-label { font-weight:600;color:var(--tx2);min-width:110px;flex-shrink:0; }
.sar-card-row-val { color:var(--tx);flex:1; }

/* ── Signal feed ── */
.sar-signal-list { display:flex;flex-direction:column;gap:7px; }
.sar-signal { display:flex;gap:11px;padding:11px 13px;background:var(--bg);border:1px solid var(--bdr-soft);
  border-radius:9px;transition:border-color .15s; }
.sar-signal:hover { border-color:#d5cfc7; }
.sar-signal-icon { width:30px;height:30px;border-radius:7px;display:flex;align-items:center;
  justify-content:center;flex-shrink:0; }
.sar-signal-body { flex:1;min-width:0; }
.sar-signal-head { display:flex;align-items:flex-start;justify-content:space-between;gap:7px;margin-bottom:3px; }
.sar-signal-title { font-size:12.5px;font-weight:600;line-height:1.4; }
.sar-signal-date  { font-size:10.5px;color:var(--tx3);flex-shrink:0; }
.sar-signal-text  { font-size:12px;color:var(--tx2);line-height:1.6; }
.sar-signal-meta  { display:flex;align-items:center;gap:6px;margin-top:5px; }
.sar-signal-co    { padding:2px 7px;background:var(--bg-sub);border-radius:8px;font-size:10.5px;
  font-weight:500;color:var(--tx2); }
.sar-impact       { padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700; }
.sar-impact-high   { background:#fff1f2;color:#be123c; }
.sar-impact-medium { background:#fffbf5;color:#b45309; }
.sar-impact-low    { background:#d1fae5;color:#065f46; }

/* ── Threat / Opportunity cards ── */
.sar-to-list { display:flex;flex-direction:column;gap:7px; }
.sar-to-card { padding:12px 14px;border-radius:9px;border-left:3px solid; }
.sar-threat-critical,.sar-threat-high   { background:#fff1f2;border-color:#be123c; }
.sar-threat-medium  { background:#fff7ed;border-color:#ea580c; }
.sar-threat-low     { background:#fffbf5;border-color:#d97706; }
.sar-opp-high   { background:#d1fae5;border-color:#059669; }
.sar-opp-medium { background:#f0fdfa;border-color:#0d9488; }
.sar-opp-low    { background:#f0f9ff;border-color:#0369a1; }
.sar-to-head    { display:flex;align-items:flex-start;justify-content:space-between;gap:7px;margin-bottom:5px; }
.sar-to-title   { font-size:13px;font-weight:600;line-height:1.4; }
.sar-severity   { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;
  padding:2px 7px;border-radius:6px;flex-shrink:0; }
.sar-sev-critical,.sar-sev-high { background:#be123c;color:#fff; }
.sar-sev-medium { background:#ea580c;color:#fff; }
.sar-sev-low    { background:#d97706;color:#fff; }
.sar-os-high    { background:#059669;color:#fff; }
.sar-os-medium  { background:#0d9488;color:#fff; }
.sar-os-low     { background:#0369a1;color:#fff; }
.sar-to-body    { font-size:12.5px;line-height:1.65;color:var(--tx); }
.sar-to-action  { margin-top:6px;padding:6px 10px;background:rgba(255,255,255,.6);border-radius:6px;
  font-size:11.5px;color:var(--tx2);font-style:italic; }

/* ── Hiring cards ── */
.sar-hiring-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
@media(max-width:520px){ .sar-hiring-grid { grid-template-columns:1fr; } }
.sar-hiring-card { background:var(--bg);border:1px solid var(--bdr-soft);border-radius:9px;padding:11px 13px; }
.sar-hiring-co   { font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;
  letter-spacing:.3px;margin-bottom:7px; }
.sar-hiring-roles { display:flex;flex-direction:column;gap:5px; }
.sar-hiring-role  { display:flex;align-items:center;justify-content:space-between;gap:7px; }
.sar-hiring-rname { font-size:12px;color:var(--tx2); }
.sar-hiring-count { font-size:11px;font-weight:600;padding:1px 7px;background:#fffbf5;
  border-radius:7px;color:#b45309;flex-shrink:0; }
.sar-hiring-signal { font-size:11px;color:var(--tx3);margin-top:5px;font-style:italic; }

/* ── Strategy rec cards ── */
.sar-recs { display:flex;flex-direction:column;gap:7px; }
.sar-rec  { background:var(--bg);border:1px solid var(--bdr-soft);border-radius:9px;
  padding:12px 14px;display:flex;gap:10px; }
.sar-rec-num  { width:24px;height:24px;border-radius:5px;background:#eef2ff;color:#4338ca;
  font-size:11.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.sar-rec-body { flex:1;min-width:0; }
.sar-rec-title { font-size:12.5px;font-weight:600;margin-bottom:3px; }
.sar-rec-desc  { font-size:12px;color:var(--tx2);line-height:1.6; }
.sar-rec-pri   { font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:7px;
  display:inline-block;margin-top:5px; }
.sar-rec-urgent { background:#fff1f2;color:#be123c; }
.sar-rec-high   { background:#fffbf5;color:#b45309; }
.sar-rec-medium { background:#f0f9ff;color:#0369a1; }
.sar-rec-low    { background:var(--bg-sub);color:var(--tx3); }

/* ── Funnel stage cards ── */
.sar-stages { display:flex;flex-direction:column;gap:7px; }
.sar-stage  { background:var(--bg-sub);border:1px solid var(--bdr-soft);border-radius:9px;padding:10px 13px; }
.sar-stage-name { font-weight:600;font-size:13px;margin-bottom:5px;display:flex;align-items:center;gap:7px; }
.sar-stage-cr   { display:inline-flex;align-items:center;padding:2px 7px;border-radius:8px;font-size:10.5px;
  font-weight:600;background:var(--bg);border:1px solid var(--bdr);color:var(--tx2); }
.sar-stage-rows { display:flex;flex-direction:column;gap:4px; }
.sar-stage-row  { display:flex;gap:8px;font-size:12.5px;line-height:1.45; }
.sar-stage-label{ font-weight:600;color:var(--tx2);min-width:100px;flex-shrink:0; }
.sar-stage-val  { color:var(--tx);flex:1; }

/* ── Creative cards ── */
.sar-creatives { display:flex;flex-direction:column;gap:8px; }
.sar-creative  { background:var(--bg-sub);border:1px solid var(--bdr-soft);border-radius:9px;padding:12px 14px; }
.sar-creative-format { display:inline-flex;align-items:center;padding:2px 8px;border-radius:9px;
  font-size:10.5px;font-weight:600;background:var(--bg);border:1px solid var(--bdr);
  color:var(--tx2);margin-bottom:6px; }
.sar-creative-angle { font-weight:600;font-size:13px;margin-bottom:7px; }
.sar-creative-rows  { display:flex;flex-direction:column;gap:4px; }
.sar-creative-row   { display:flex;gap:8px;font-size:12.5px;line-height:1.45; }
.sar-creative-label { font-weight:600;color:var(--tx2);min-width:90px;flex-shrink:0; }
.sar-creative-val   { color:var(--tx);flex:1; }

/* ── Growth loops ── */
.sar-loops { display:flex;flex-direction:column;gap:8px; }
.sar-loop  { background:var(--bg-sub);border:1px solid var(--bdr-soft);border-radius:9px;padding:12px 14px; }
.sar-loop-name { font-weight:600;font-size:13px;margin-bottom:3px; }
.sar-loop-type { font-size:11px;color:var(--tx3);margin-bottom:7px;font-style:italic; }
.sar-loop-rows { display:flex;flex-direction:column;gap:4px; }
.sar-loop-row  { display:flex;gap:8px;font-size:12.5px;line-height:1.45; }
.sar-loop-label{ font-weight:600;color:var(--tx2);min-width:120px;flex-shrink:0; }
.sar-loop-val  { color:var(--tx);flex:1; }

/* ── Legal result ── */
.sar-legal-body { padding:18px 20px;font-size:13.5px;line-height:1.8;color:var(--tx);
  max-height:560px;overflow-y:auto; }
.sar-legal-section { margin-bottom:16px; }
.sar-legal-sec-title { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;
  color:var(--tx2);margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--bdr-soft); }
.sar-legal-sec-title.danger { color:#be123c; }
.sar-legal-sec-title.ok    { color:#059669; }
.sar-legal-para { font-size:13px;line-height:1.75;color:var(--tx);margin-bottom:8px; }
.sar-legal-para:last-child { margin-bottom:0; }
.sar-legal-ul { margin:0 0 8px 18px;display:flex;flex-direction:column;gap:5px; }
.sar-legal-ul li { font-size:12.5px;line-height:1.6; }

/* ── Sources ── */
.sar-sources { padding:9px 15px;border-top:1px solid var(--bdr-soft);background:var(--bg-sub);
  display:flex;flex-wrap:wrap;gap:5px;align-items:center; }
.sar-sources-label { font-size:10.5px;font-weight:600;color:var(--tx3);text-transform:uppercase;
  letter-spacing:.3px;margin-right:4px; }
.sar-source-chip { display:inline-flex;align-items:center;gap:4px;padding:2px 7px;
  background:var(--bg);border:1px solid var(--bdr-soft);border-radius:8px;font-size:10.5px;color:var(--tx2); }
.sar-source-chip a { color:var(--acc);text-decoration:none; }

/* ── Download row ── */
.sar-dl-row { display:flex;gap:7px;flex-wrap:wrap;margin-top:7px; }
.sar-dl-btn { display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border:none;
  border-radius:7px;font-family:var(--font);font-size:12.5px;font-weight:500;cursor:pointer;
  transition:all .15s; }
.sar-dl-dark { background:var(--tx);color:#fff; }
.sar-dl-dark:hover { background:#2d2a26;transform:translateY(-1px); }
.sar-dl-blue { background:#4338ca;color:#fff; }
.sar-dl-blue:hover { background:#3730a3;transform:translateY(-1px); }
`;
    document.head.appendChild(s);
  }

  /* ─── Utility ─── */
  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ─── Section icon color map ─── */
  var SECTION_COLORS = {
    growth:      { bg:'#fffbf5', color:'#b45309' },
    strategy:    { bg:'#fffbf5', color:'#b45309' },
    legal:       { bg:'#f5f3ff', color:'#7c3aed' },
    competitive: { bg:'#f0f9ff', color:'#0369a1' },
  };

  /* ─── Build a collapsible section ─── */
  function buildSection(sec, agentType) {
    var col = SECTION_COLORS[agentType] || SECTION_COLORS.growth;
    var secEl = document.createElement('div');
    secEl.className = 'sar-section';

    var hd = document.createElement('div');
    hd.className = 'sar-sec-hd';
    hd.innerHTML =
      '<div class="sar-sec-icon" style="background:'+col.bg+';color:'+col.color+'">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
          '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3"/>' +
        '</svg>' +
      '</div>' +
      '<div class="sar-sec-label">'+esc(sec.label || 'Section')+'</div>' +
      '<svg class="sar-chevron open" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<polyline points="6 9 12 15 18 9"/></svg>';
    secEl.appendChild(hd);

    var body = document.createElement('div');
    body.className = 'sar-sec-body open';

    if (sec.content) {
      var desc = document.createElement('div');
      desc.className = 'sar-sec-desc';
      desc.textContent = sec.content;
      body.appendChild(desc);
    }

    // Specialized renders
    if (sec.competitors) {
      var grid = document.createElement('div');
      grid.className = 'sar-cards-grid';
      (sec.competitors || []).forEach(function(c) {
        var card = document.createElement('div');
        card.className = 'sar-card';
        card.innerHTML = '<div class="sar-card-name">'+esc(c.name||'')+'</div><div class="sar-card-rows">' +
          buildCardRow('Positioning', c.positioning) +
          buildCardRow('Strengths',   c.strengths)   +
          buildCardRow('Weaknesses',  c.weaknesses)  +
          buildCardRow('Pricing',     c.pricing)     +
          buildCardRow('Verdict',     c.verdict)     +
        '</div>';
        grid.appendChild(card);
      });
      body.appendChild(grid);
    } else if (sec.loops) {
      var loops = document.createElement('div');
      loops.className = 'sar-loops';
      (sec.loops || []).forEach(function(l) {
        var card = document.createElement('div');
        card.className = 'sar-loop';
        card.innerHTML =
          '<div class="sar-loop-name">'+esc(l.name||'')+'</div>' +
          '<div class="sar-loop-type">'+esc(l.type||'')+'</div>' +
          '<div class="sar-loop-rows">' +
            buildCardRow2('sar-loop', 'Mechanism', l.mechanism) +
            buildCardRow2('sar-loop', 'Trigger',   l.trigger)   +
            buildCardRow2('sar-loop', 'K-Factor',  l.viral_coefficient) +
            buildCardRow2('sar-loop', 'How to Build', l.implementation) +
          '</div>';
        loops.appendChild(card);
      });
      body.appendChild(loops);
    } else if (sec.creatives) {
      var creatives = document.createElement('div');
      creatives.className = 'sar-creatives';
      (sec.creatives || []).forEach(function(cr) {
        var card = document.createElement('div');
        card.className = 'sar-creative';
        card.innerHTML =
          '<div class="sar-creative-format">'+esc(cr.format||'')+'</div>' +
          '<div class="sar-creative-angle">'+esc(cr.angle||'')+'</div>' +
          '<div class="sar-creative-rows">' +
            buildCardRow2('sar-creative', 'Hook',       cr.hook)       +
            buildCardRow2('sar-creative', 'Body',       cr.body)       +
            buildCardRow2('sar-creative', 'CTA',        cr.cta)        +
            buildCardRow2('sar-creative', 'Hypothesis', cr.hypothesis) +
            buildCardRow2('sar-creative', 'Audience',   cr.audience)   +
          '</div>';
        creatives.appendChild(card);
      });
      body.appendChild(creatives);
    } else if (sec.stages) {
      var stages = document.createElement('div');
      stages.className = 'sar-stages';
      (sec.stages || []).forEach(function(st) {
        var card = document.createElement('div');
        card.className = 'sar-stage';
        card.innerHTML =
          '<div class="sar-stage-name">'+esc(st.name||'') +
          (st.benchmark_cr ? ' <span class="sar-stage-cr">'+esc(st.benchmark_cr)+'</span>' : '') +
          '</div><div class="sar-stage-rows">' +
            buildCardRow2('sar-stage', 'Drop-off Cause', st.drop_off_cause) +
            buildCardRow2('sar-stage', 'Fix', st.fix) +
          '</div>';
        stages.appendChild(card);
      });
      body.appendChild(stages);
    } else if (sec.signals) {
      var sigList = document.createElement('div');
      sigList.className = 'sar-signal-list';
      (sec.signals || []).forEach(function(sig) { sigList.appendChild(buildSignalEl(sig)); });
      body.appendChild(sigList);
    } else if (sec.threats) {
      var tList = document.createElement('div');
      tList.className = 'sar-to-list';
      (sec.threats || []).forEach(function(t) { tList.appendChild(buildThreatEl(t)); });
      body.appendChild(tList);
    } else if (sec.opportunities) {
      var oList = document.createElement('div');
      oList.className = 'sar-to-list';
      (sec.opportunities || []).forEach(function(o) { tList.appendChild(buildOppEl(o)); });
      body.appendChild(oList);
    } else if (sec.hiring_trends) {
      var hGrid = document.createElement('div');
      hGrid.className = 'sar-hiring-grid';
      (sec.hiring_trends || []).forEach(function(ht) {
        var card = document.createElement('div');
        card.className = 'sar-hiring-card';
        var rolesHtml = '';
        if (ht.roles) {
          ht.roles.forEach(function(r) {
            rolesHtml += '<div class="sar-hiring-role"><span class="sar-hiring-rname">'+esc(r.role||r)+'</span>' +
              (r.count ? '<span class="sar-hiring-count">'+esc(String(r.count))+'</span>' : '') + '</div>';
          });
        }
        card.innerHTML = '<div class="sar-hiring-co">'+esc(ht.company||'')+'</div>' +
          '<div class="sar-hiring-roles">'+rolesHtml+'</div>' +
          (ht.strategic_signal ? '<div class="sar-hiring-signal">'+esc(ht.strategic_signal)+'</div>' : '');
        hGrid.appendChild(card);
      });
      body.appendChild(hGrid);
    } else if (sec.recommendations) {
      var recs = document.createElement('div');
      recs.className = 'sar-recs';
      (sec.recommendations || []).forEach(function(r, i) {
        var card = document.createElement('div');
        card.className = 'sar-rec';
        var pri = (r.priority || 'medium').toLowerCase();
        card.innerHTML =
          '<div class="sar-rec-num">'+(i+1)+'</div>' +
          '<div class="sar-rec-body">' +
            '<div class="sar-rec-title">'+esc(r.title||'')+'</div>' +
            '<div class="sar-rec-desc">'+esc(r.description||'')+'</div>' +
            '<span class="sar-rec-pri sar-rec-'+pri+'">'+pri.toUpperCase()+'</span>' +
          '</div>';
        recs.appendChild(card);
      });
      body.appendChild(recs);
    } else if (sec.items) {
      (sec.items || []).forEach(function(item) {
        var d = document.createElement('div');
        d.className = 'sar-item';
        d.innerHTML = '<span class="sar-item-label">'+esc(item.label||'')+'</span>' +
                      '<span class="sar-item-value">'+esc(item.value||'')+'</span>';
        body.appendChild(d);
      });
    }

    secEl.appendChild(body);

    // Toggle
    hd.addEventListener('click', function() {
      var isOpen = body.classList.toggle('open');
      hd.querySelector('.sar-chevron').classList.toggle('open', isOpen);
    });

    return secEl;
  }

  function buildCardRow(label, val) {
    if (!val) return '';
    return '<div class="sar-card-row"><span class="sar-card-row-label">'+esc(label)+'</span>' +
           '<span class="sar-card-row-val">'+esc(val)+'</span></div>';
  }
  function buildCardRow2(prefix, label, val) {
    if (!val) return '';
    return '<div class="'+prefix+'-row">' +
           '<span class="'+prefix+'-label">'+esc(label)+'</span>' +
           '<span class="'+prefix+'-val">'+esc(val)+'</span></div>';
  }

  function buildSignalEl(sig) {
    var item = document.createElement('div');
    item.className = 'sar-signal';
    var imp = (sig.impact || 'medium').toLowerCase();
    item.innerHTML =
      '<div class="sar-signal-icon" style="background:'+(imp==='high'?'#fff1f2':imp==='low'?'#d1fae5':'#fffbf5')+'">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+(imp==='high'?'#be123c':imp==='low'?'#059669':'#b45309')+'" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
      '</div>' +
      '<div class="sar-signal-body">' +
        '<div class="sar-signal-head">' +
          '<div class="sar-signal-title">'+esc(sig.title||'')+'</div>' +
          '<div class="sar-signal-date">'+esc(sig.date||'')+'</div>' +
        '</div>' +
        '<div class="sar-signal-text">'+esc(sig.summary||sig.description||'')+'</div>' +
        '<div class="sar-signal-meta">' +
          '<span class="sar-signal-co">'+esc(sig.company||'')+'</span>' +
          '<span class="sar-impact sar-impact-'+imp+'">'+imp.toUpperCase()+' IMPACT</span>' +
        '</div>' +
      '</div>';
    return item;
  }

  function buildThreatEl(t) {
    var sev = (t.severity || 'medium').toLowerCase();
    var card = document.createElement('div');
    card.className = 'sar-to-card sar-threat-'+sev;
    card.innerHTML =
      '<div class="sar-to-head">' +
        '<div class="sar-to-title">'+esc(t.title||'')+'</div>' +
        '<span class="sar-severity sar-sev-'+sev+'">'+sev.toUpperCase()+'</span>' +
      '</div>' +
      '<div class="sar-to-body">'+esc(t.description||'')+'</div>' +
      (t.recommended_action ? '<div class="sar-to-action">💡 '+esc(t.recommended_action)+'</div>' : '');
    return card;
  }

  function buildOppEl(o) {
    var size = (o.size || 'medium').toLowerCase();
    var card = document.createElement('div');
    card.className = 'sar-to-card sar-opp-'+size;
    card.innerHTML =
      '<div class="sar-to-head">' +
        '<div class="sar-to-title">'+esc(o.title||'')+'</div>' +
        '<span class="sar-severity sar-os-'+size+'">'+size.toUpperCase()+'</span>' +
      '</div>' +
      '<div class="sar-to-body">'+esc(o.description||'')+'</div>' +
      (o.action ? '<div class="sar-to-action">🚀 '+esc(o.action)+'</div>' : '');
    return card;
  }

  /* ─── Parse raw text into sections (for legal/strategy text responses) ─── */
  function parseTextSections(content) {
    var lines = String(content || '').split(/\r?\n/);
    var sections = [];
    var currentTitle = '';
    var buf = [];

    function flush() {
      var body = buf.join('\n').trim();
      if (body || currentTitle) sections.push({ title: currentTitle || 'Section', body: body });
      buf = [];
    }

    lines.forEach(function(raw, idx) {
      var line = raw.trim();
      var isHeading = /^#{1,3}\s+/.test(line) || (/^[A-Z][A-Z\s&\/\-]{3,}$/.test(line) && line.length < 60);
      if (isHeading) {
        if (idx !== 0) flush();
        currentTitle = line.replace(/^#{1,3}\s+/, '');
        return;
      }
      buf.push(raw);
    });
    flush();
    return sections.length ? sections : [{ title: 'Response', body: String(content || '') }];
  }

  function renderTextSection(text) {
    var lines = String(text || '').split(/\r?\n/).map(function(l){ return l.trim(); }).filter(Boolean);
    if (!lines.length) return '';
    return lines.map(function(l) {
      if (/^[-*•]\s/.test(l)) return '<li>'+esc(l.replace(/^[-*•]\s+/,'').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'))+'</li>';
      if (/^\d+[\).]\s/.test(l)) return '<li>'+esc(l.replace(/^\d+[\).]\s+/,'').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'))+'</li>';
      return '<p class="sar-legal-para">'+esc(l).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')+'</p>';
    }).join('');
  }

  /* ─── Main render for structured growth/competitive reports ─── */
  function renderStructuredReport(data, agentType, mode) {
    var wrap = document.createElement('div');
    wrap.className = 'sar-wrap';

    // Chip
    var chipLabel = {
      growth: '⚡ Growth Report', strategy: '📈 Strategy Report',
      legal: '⚖️ Legal Analysis', competitive: '🔍 Intel Report'
    }[agentType] || 'Report';
    var chip = document.createElement('div');
    chip.className = 'sar-chip sar-chip-'+agentType;
    chip.textContent = chipLabel;
    wrap.appendChild(chip);

    // Block
    var block = document.createElement('div');
    block.className = 'sar-block';
    var pid = 'sar_' + Date.now();

    var hd = document.createElement('div');
    hd.className = 'sar-block-hd';
    hd.innerHTML =
      '<div class="sar-block-title">'+esc(data.title || chipLabel)+'</div>' +
      '<button class="sar-copy-btn" data-pid="'+pid+'">' +
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy' +
      '</button>';
    block.appendChild(hd);

    var body = document.createElement('div');
    body.className = 'sar-body';
    body.id = pid;

    // Render each section
    var sections = data.sections || [];
    if (!sections.length && (data.signals || data.threats || data.opportunities || data.recommendations)) {
      // competitive-style flat report — wrap in pseudo-sections
      if (data.executive_summary) {
        sections.push({ label: 'Executive Summary', content: data.executive_summary });
      }
      if (data.signals && data.signals.length) {
        sections.push({ label: 'Intelligence Signals ('+data.signals.length+')', signals: data.signals });
      }
      if (data.threats && data.threats.length) {
        sections.push({ label: 'Threats ('+data.threats.length+')', threats: data.threats });
      }
      if (data.opportunities && data.opportunities.length) {
        sections.push({ label: 'Opportunities ('+data.opportunities.length+')', opportunities: data.opportunities });
      }
      if (data.hiring_trends && data.hiring_trends.length) {
        sections.push({ label: 'Hiring Intelligence', hiring_trends: data.hiring_trends });
      }
      if (data.recommendations && data.recommendations.length) {
        sections.push({ label: 'Strategic Recommendations', recommendations: data.recommendations });
      }
    }

    sections.forEach(function(sec) {
      body.appendChild(buildSection(sec, agentType));
    });

    if (!sections.length) {
      body.innerHTML = '<div style="padding:16px;font-size:13px;color:var(--tx2)">No structured data returned.</div>';
    }

    block.appendChild(body);

    // Sources
    if (data.sources && data.sources.length) {
      var ss = document.createElement('div');
      ss.className = 'sar-sources';
      ss.innerHTML = '<span class="sar-sources-label">Sources</span>';
      data.sources.slice(0,6).forEach(function(s) {
        var chip2 = document.createElement('span');
        chip2.className = 'sar-source-chip';
        chip2.innerHTML = s.url
          ? '🔗 <a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title||s.url)+'</a>'
          : '🔗 '+esc(s.title||s);
        ss.appendChild(chip2);
      });
      block.appendChild(ss);
    }

    wrap.appendChild(block);

    // Download buttons
    var dlRow = document.createElement('div');
    dlRow.className = 'sar-dl-row';
    var dlTxt = document.createElement('button');
    dlTxt.className = 'sar-dl-btn sar-dl-dark';
    dlTxt.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt';
    dlTxt.onclick = function() {
      var el = document.getElementById(pid);
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([el ? el.innerText : JSON.stringify(data, null, 2)], { type: 'text/plain' }));
      a.download = 'stremini-'+agentType+'-'+Date.now()+'.txt';
      a.click();
    };
    var dlJson = document.createElement('button');
    dlJson.className = 'sar-dl-btn sar-dl-blue';
    dlJson.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> JSON';
    dlJson.onclick = function() {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = 'stremini-'+agentType+'-'+Date.now()+'.json';
      a.click();
    };
    dlRow.appendChild(dlTxt);
    dlRow.appendChild(dlJson);
    wrap.appendChild(dlRow);

    // Wire copy button
    setTimeout(function() {
      var btn = wrap.querySelector('.sar-copy-btn');
      if (btn) {
        btn.onclick = function() {
          var el = document.getElementById(btn.dataset.pid);
          navigator.clipboard.writeText(el ? el.innerText : '').then(function() {
            btn.textContent = 'Copied!';
            setTimeout(function() {
              btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
            }, 2000);
          }).catch(function(){});
        };
      }
    }, 50);

    return wrap;
  }

  /* ─── Render plain text result (legal/strategy fallback) ─── */
  function renderTextResult(content, agentType) {
    var wrap = document.createElement('div');
    wrap.className = 'sar-wrap';

    var chipLabel = { legal: '⚖️ Legal Analysis', strategy: '📈 Strategy Report' }[agentType] || 'Report';
    var chip = document.createElement('div');
    chip.className = 'sar-chip sar-chip-'+agentType;
    chip.textContent = chipLabel;
    wrap.appendChild(chip);

    var block = document.createElement('div');
    block.className = 'sar-block';
    var pid = 'sar_' + Date.now();

    block.innerHTML =
      '<div class="sar-block-hd">' +
        '<div class="sar-block-title">'+chipLabel+'</div>' +
        '<button class="sar-copy-btn" data-pid="'+pid+'">' +
          '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy' +
        '</button>' +
      '</div>';

    var body = document.createElement('div');
    body.className = 'sar-legal-body';
    body.id = pid;

    var sections = parseTextSections(content);
    sections.forEach(function(sec) {
      var secDiv = document.createElement('div');
      secDiv.className = 'sar-legal-section';
      var titleEl = document.createElement('div');
      titleEl.className = 'sar-legal-sec-title';
      titleEl.textContent = sec.title;
      secDiv.appendChild(titleEl);
      secDiv.innerHTML += renderTextSection(sec.body);
      body.appendChild(secDiv);
    });

    block.appendChild(body);
    wrap.appendChild(block);

    // Download
    var dlRow = document.createElement('div');
    dlRow.className = 'sar-dl-row';
    var dlBtn = document.createElement('button');
    dlBtn.className = 'sar-dl-btn sar-dl-dark';
    dlBtn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt';
    dlBtn.onclick = function() {
      var el = document.getElementById(pid);
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([el ? el.innerText : content], { type: 'text/plain' }));
      a.download = 'stremini-'+agentType+'-'+Date.now()+'.txt';
      a.click();
    };
    dlRow.appendChild(dlBtn);
    wrap.appendChild(dlRow);

    // Wire copy
    setTimeout(function() {
      var btn = wrap.querySelector('.sar-copy-btn');
      if (btn) {
        btn.onclick = function() {
          var el = document.getElementById(btn.dataset.pid);
          navigator.clipboard.writeText(el ? el.innerText : '').then(function() {
            btn.textContent = 'Copied!';
            setTimeout(function() {
              btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
            }, 2000);
          }).catch(function(){});
        };
      }
    }, 50);

    return wrap;
  }

  /* ─── Determine growth mode from query ─── */
  function detectGrowthMode(text) {
    var lower = text.toLowerCase();
    if (/competitor|competing|vs |versus|battlecard|market landscape/.test(lower)) return 'competitor';
    if (/viral|growth loop|k-factor|viral coefficient|organic growth/.test(lower)) return 'viral';
    if (/ad creative|ad copy|paid acquisition|facebook ads|google ads|campaign/.test(lower)) return 'ads';
    if (/funnel|conversion rate|landing page|trial-to-paid|drop off|cro/.test(lower)) return 'funnel';
    return 'gtm';
  }

  /* ─── Determine legal mode ─── */
  function detectLegalMode(text) {
    var lower = text.toLowerCase();
    if (/terms|tnc|terms of service|eula/.test(lower)) return 'tnc';
    if (/privacy policy|gdpr|ccpa|dpdp/.test(lower)) return 'privacy';
    if (/compliance checklist|compliance requirements/.test(lower)) return 'compliance';
    return 'contract';
  }

  /* ─── Determine strategy mode ─── */
  function detectStrategyMode(text) {
    var lower = text.toLowerCase();
    if (/revenue|mrr|arr|financial projection|unit economics/.test(lower)) return 'revenue';
    if (/market sizing|tam|sam|som/.test(lower)) return 'market';
    if (/pitch deck|investor pitch|raise|pre-seed|seed round/.test(lower)) return 'pitch';
    if (/swot|tows|strengths|weaknesses|opportunities|threats/.test(lower)) return 'swot';
    return 'business_model';
  }

  /* ─── Determine competitive mode ─── */
  function detectCompetitiveMode(text) {
    var lower = text.toLowerCase();
    if (/threat|risk from competitor/.test(lower)) return 'threats';
    if (/opportunity|gap|white space/.test(lower)) return 'opportunities';
    if (/hiring trend|talent signal/.test(lower)) return 'hiring';
    if (/deep dive|deep analysis|comprehensive analysis of/.test(lower)) return 'deep';
    if (/weekly report|strategy report/.test(lower)) return 'report';
    return 'monitor';
  }

  /* ═══════════════════════════════════
     PUBLIC INTERFACE
  ═══════════════════════════════════ */
  return {

    detect: detect,
    injectStyles: injectStyles,

    /* Main entry — call from sendMsg() */
    handle: async function(text, history, container) {
      injectStyles();
      var agentType = detect(text);
      if (!agentType) return false; // not handled

      var data, renderEl;

      try {
        /* ── Math / Research ── */
        if (agentType === 'math' || agentType === 'research') {
          if (window.StreminiResearch) {
            data = await window.StreminiResearch.call(text, agentType, history);
            renderEl = document.createElement('div');
            await window.StreminiResearch.renderResult(data, renderEl, agentType);
          } else {
            throw new Error('Research renderer not loaded. Add research-renderer.js.');
          }
        }

        /* ── Growth Intelligence ── */
        else if (agentType === 'growth') {
          var growthMode = detectGrowthMode(text);
          data = await callBackend(BACKENDS.growth, {
            query: text,
            mode: growthMode,
            history: (history || []).slice(-10),
            iteration: 0
          });
          if (data.status === 'REPORT' && data.data) {
            renderEl = renderStructuredReport(data.data, 'growth', growthMode);
          } else if (data.content) {
            renderEl = renderTextResult(data.content, 'growth');
          } else {
            throw new Error('Unexpected growth agent response');
          }
        }

        /* ── Strategy ── */
        else if (agentType === 'strategy') {
          var stratMode = detectStrategyMode(text);
          data = await callBackend(BACKENDS.strategy, {
            mode: stratMode,
            query: text,
            context: {},
            responseFormat: 'structured_actionable'
          });
          var stratContent = data.content || data.solution || '';
          if (stratContent) {
            renderEl = renderTextResult(stratContent, 'strategy');
          } else {
            throw new Error('No content from strategy agent');
          }
        }

        /* ── Legal ── */
        else if (agentType === 'legal') {
          var legalMode = detectLegalMode(text);
          data = await callBackend(BACKENDS.legal, {
            mode: legalMode,
            query: text,
            documentText: '',
            jurisdiction: 'India',
            entityType: 'startup',
            responseFormat: 'structured_actionable'
          });
          var legalContent = data.content || data.solution || '';
          if (legalContent) {
            renderEl = renderTextResult(legalContent, 'legal');
          } else {
            throw new Error('No content from legal agent');
          }
        }

        /* ── Competitive ── */
        else if (agentType === 'competitive') {
          var compMode = detectCompetitiveMode(text);
          data = await callBackend(BACKENDS.competitive, {
            query: text,
            mode: compMode,
            history: (history || []).slice(-10),
            companies: [],
            response_format: 'structured_json'
          });
          if (data.report) {
            renderEl = renderStructuredReport(data.report, 'competitive', compMode);
          } else if (data.content) {
            renderEl = renderTextResult(data.content, 'competitive');
          } else {
            throw new Error('Unexpected competitive agent response');
          }
        }

      } catch(err) {
        renderEl = document.createElement('div');
        renderEl.innerHTML = '<div style="padding:12px;color:#dc2626;font-size:13px;background:#fee2e2;border-radius:8px;border:1px solid #fecaca">Agent error: '+esc(err.message)+'</div>';
      }

      if (container && renderEl) {
        container.innerHTML = '';
        container.appendChild(renderEl);
      }

      return true; // handled
    }
  };

})();
