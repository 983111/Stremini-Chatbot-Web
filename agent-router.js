/* ═══════════════════════════════════════════════════════════════
   STREMINI — UNIFIED AGENT ROUTER v2.0
   Routes queries to the correct specialist backend and renders
   structured responses using agent-specific renderers.

   ① Research & Math       → agentic-research worker
   ② Growth Intelligence   → growth-agent worker
   ③ Strategy              → startup-strategy worker
   ④ Legal                 → legal-compliance worker
   ⑤ Competitive Intel     → compeititve worker
   ⑥ Architect             → ai-architect worker
   ⑦ Data Intelligence     → data-agent worker
   ⑧ Personal OS (ARIA)    → personal-os worker
   ⑨ Concept Explainer     → stremini-concept worker
   ⑩ Knowledge Graph       → knowledge worker
═══════════════════════════════════════════════════════════════ */

window.StreminiAgentRouter = (function() {

  var BACKENDS = {
    research:    'https://agentic-research.vishwajeetadkine705.workers.dev',
    growth:      'https://growth-agent.vishwajeetadkine705.workers.dev',
    strategy:    'https://startup-strategy.vishwajeetadkine705.workers.dev',
    legal:       'https://legal-compliance.vishwajeetadkine705.workers.dev',
    competitive: 'https://compeititve.vishwajeetadkine705.workers.dev',
    architect:   'https://ai-architect.vishwajeetadkine705.workers.dev',
    data:        'https://data-agent.vishwajeetadkine705.workers.dev',
    personalos:  'https://personal-os.vishwajeetadkine705.workers.dev',
    concept:     'https://stremini-concept.vishwajeetadkine705.workers.dev',
    knowledge:   'https://knowledge.vishwajeetadkine705.workers.dev',
  };

  var DETECTION = {
    math: ['solve','calculate','compute','prove','proof','integral','derivative','equation','formula','simplify','factor','differentiate','integrate','theorem','lemma','algebra','calculus','matrix','determinant','eigenvalue','probability','statistics','permutation','combination','binomial','limit','series','sequence','converge','diverge','trigonometry','logarithm','find the value','evaluate','expand','factorise'],
    research: ['research paper','write a paper','write paper','academic paper','literature review','study on','comprehensive study','overview of','history of','impact of','analysis of','review of','science of','theory of','effects of','examine','investigate','survey of','write an essay','write a report on'],
    legal: ['contract review','review this contract','terms and conditions','privacy policy','gdpr','dpdp','ccpa','hipaa','compliance checklist','legal risk','flag risks','red flags in contract','legal analysis','terms of service','service agreement','nda','non disclosure','ip clause','liability clause','payment terms contract','startup legal','legal compliance'],
    competitive: ['competitor analysis','competitive analysis','competitive intelligence','monitor competitor','competitor report','competitive report','threat analysis competitive','competitor strategy','battlecard','compare competitors','vs competitor','market positioning','competitor weakness','hiring signals','technology shift competitor','deep dive on company','deep analysis of','company profile'],
    growth: ['gtm strategy','go-to-market','viral loop','viral growth','growth loop','ad creative','ad strategy','paid acquisition','funnel audit','cro','landing page conversion','trial-to-paid','k-factor','viral coefficient','growth strategy','user acquisition','retention strategy','growth hacking','product-led growth','plg','build our gtm','build our growth','design viral'],
    strategy: ['business model','revenue projection','revenue model','unit economics','market sizing','tam','sam','som','pitch deck','investor pitch','swot analysis','swot','tows','competitive landscape','business canvas','business plan','financial projection','mrr','arr','burn rate','market analysis','startup strategy'],
    architect: ['system architecture','design a system','architect','rag pipeline','rag system','vector database','vector db','embedding pipeline','agent system','agentic','ai pipeline','llm pipeline','ai system design','cost analysis ai','cost per query','tokens per user','inference cost','diagnose metrics','metric diagnosis','metric drop','dau dropped','anomaly detection','root cause analysis','forecast model','data flow','architecture diagram','tech stack design','microservice','kubernetes','production system','scalable system','system design','csv analysis','analyse this data'],
    data: ['cohort analysis','retention curve','d1 retention','d7 retention','conversion funnel','funnel leak','trial conversion','signup conversion','anomaly in data','data anomaly','metric anomaly','forecast arrs','forecast mrr','scenario model','bear case','bull case','business metric','health score metric','nps score','dau mau','churn rate analysis','ltv cac','unit economics analysis','diagnose our metrics','what is wrong with our metrics','saas metrics','product metrics','growth metrics'],
    personalos: ['set a goal','my goal','help me achieve','i want to build a habit','design a habit','weekly plan','90 day plan','help me decide','i need to reflect','decision framework','personal strategy','my productivity','life goals','career goal','habit tracker','morning routine','build a routine','what should i focus on','second brain','personal os','aria','capture a note','journal entry','decision log','weekly review'],
    concept: ['explain how','how does','what is','explain the concept','explain transformer','explain attention','explain gradient descent','explain blockchain','explain tcp','explain neural network','explain diffusion','explain rag','explain vector','visualize','draw a diagram of','concept map','flow diagram','how does x work','break down','eli5','explain like im','what are the components of','walk me through','teach me'],
    knowledge: ['knowledge graph','add to my knowledge','capture this concept','connect these ideas','explore my knowledge','find gaps in my knowledge','synthesize my notes','my second brain','note taking','add a node','semantic connection','knowledge base','what patterns do you see','what am i missing','link these concepts','map my knowledge']
  };

  var DETECTION_ORDER = ['math','research','legal','competitive','architect','data','knowledge','personalos','concept','growth','strategy'];

  function detect(text) {
    var lower = (text || '').toLowerCase();
    for (var i = 0; i < DETECTION_ORDER.length; i++) {
      var type = DETECTION_ORDER[i];
      var kws = DETECTION[type];
      for (var j = 0; j < kws.length; j++) {
        if (lower.indexOf(kws[j]) !== -1) return type;
      }
    }
    return null;
  }

  async function callBackend(url, payload) {
    var res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    if (!res.ok) throw new Error('Agent API ' + res.status);
    var data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ── CSS ── */
  function injectStyles() {
    if (document.getElementById('sar-styles')) return;
    var s = document.createElement('style');
    s.id = 'sar-styles';
    s.textContent = `
.sar-wrap{font-family:var(--font);}
.sar-chip{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:12px;}
.sar-chip-growth,.sar-chip-strategy,.sar-chip-personalos{background:#fffbf5;color:#b45309;border:1px solid #fde68a;}
.sar-chip-legal,.sar-chip-concept{background:#f5f3ff;color:#6d28d9;border:1px solid #ddd6fe;}
.sar-chip-competitive,.sar-chip-data{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;}
.sar-chip-architect{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}
.sar-chip-knowledge{background:#f0fdfa;color:#0d9488;border:1px solid #99f6e4;}
.sar-block{background:var(--bg);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;box-shadow:var(--sh-sm);margin:2px 0 6px;}
.sar-block-hd{display:flex;align-items:center;justify-content:space-between;padding:10px 15px;border-bottom:1px solid var(--bdr);background:var(--bg-sub);}
.sar-block-title{font-size:12.5px;font-weight:600;color:var(--tx2);}
.sar-copy-btn{background:none;border:1px solid var(--bdr);cursor:pointer;font-size:11px;color:var(--tx3);font-family:var(--font);display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:4px;transition:all .15s;}
.sar-copy-btn:hover{background:var(--bg-hov);color:var(--tx);}
.sar-body{max-height:600px;overflow-y:auto;}
.sar-section{border-bottom:1px solid var(--bdr-soft);}
.sar-section:last-child{border-bottom:none;}
.sar-sec-hd{display:flex;align-items:center;gap:9px;padding:11px 14px;cursor:pointer;transition:background .12s;user-select:none;}
.sar-sec-hd:hover{background:var(--bg-sub);}
.sar-sec-icon{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sar-sec-icon svg{width:13px;height:13px;}
.sar-sec-label{font-size:13px;font-weight:600;flex:1;}
.sar-chevron{color:var(--tx3);transition:transform .18s;}
.sar-chevron.open{transform:rotate(180deg);}
.sar-sec-body{display:none;padding:0 14px 12px 50px;}
.sar-sec-body.open{display:block;}
.sar-sec-desc{font-size:13px;color:var(--tx2);line-height:1.65;margin-bottom:8px;}
.sar-item{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--bdr-soft);font-size:12.5px;}
.sar-item:last-child{border-bottom:none;}
.sar-item-label{font-weight:600;color:var(--tx2);min-width:150px;flex-shrink:0;font-size:12px;}
.sar-item-value{color:var(--tx);flex:1;}
.sar-health-strip{display:flex;align-items:center;gap:12px;padding:12px 15px;background:var(--bg-sub);border-bottom:1px solid var(--bdr-soft);}
.sar-health-num{font-family:'Lora',Georgia,serif;font-size:28px;font-weight:600;line-height:1;flex-shrink:0;}
.sar-health-num.score-critical{color:#dc2626;}.sar-health-num.score-risk{color:#ea580c;}.sar-health-num.score-attention{color:#d97706;}.sar-health-num.score-healthy{color:#059669;}.sar-health-num.score-excellent{color:#0891b2;}
.sar-health-label{font-size:12px;font-weight:600;margin-bottom:4px;}
.sar-health-label.score-critical{color:#dc2626;}.sar-health-label.score-risk{color:#ea580c;}.sar-health-label.score-attention{color:#d97706;}.sar-health-label.score-healthy{color:#059669;}.sar-health-label.score-excellent{color:#0891b2;}
.sar-health-track{height:6px;background:var(--bg-act);border-radius:3px;overflow:hidden;flex:1;}
.sar-health-fill{height:100%;border-radius:3px;transition:width .8s ease;}
.fill-critical{background:#dc2626;}.fill-risk{background:#ea580c;}.fill-attention{background:#d97706;}.fill-healthy{background:#059669;}.fill-excellent{background:#0891b2;}
.sar-tabs{display:flex;overflow-x:auto;border-bottom:1px solid var(--bdr);background:var(--bg-sub);padding:0 8px;}
.sar-tabs::-webkit-scrollbar{height:3px;}
.sar-tab{display:flex;align-items:center;gap:5px;padding:9px 12px;font-size:12px;font-weight:500;color:var(--tx3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap;background:none;border-left:none;border-right:none;border-top:none;font-family:var(--font);}
.sar-tab:hover{color:var(--tx2);}
.sar-tab.active{color:var(--tx);border-bottom-color:var(--tx);font-weight:600;}
.sar-tab-body{padding:16px;animation:sar-in .2s ease;}
@keyframes sar-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.sar-insights-list{display:flex;flex-direction:column;gap:8px;}
.sar-insight{display:flex;gap:10px;padding:11px 13px;background:var(--bg);border:1px solid var(--bdr-soft);border-radius:9px;}
.sar-insight.sig-positive{border-left:3px solid #059669;}.sar-insight.sig-negative{border-left:3px solid #dc2626;}.sar-insight.sig-neutral{border-left:3px solid var(--bdr);}
.sar-insight-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.sar-insight-dot-pos{background:#059669;}.sar-insight-dot-neg{background:#dc2626;}.sar-insight-dot-neu{background:var(--tx3);}
.sar-insight-title{font-size:12.5px;font-weight:600;margin-bottom:3px;}
.sar-insight-detail{font-size:12.5px;color:var(--tx2);line-height:1.6;}
.sar-flags-list{display:flex;flex-direction:column;gap:6px;}
.sar-flag{border-radius:9px;overflow:hidden;border:1px solid;}
.sar-flag-hd{display:flex;align-items:center;gap:7px;padding:9px 12px;font-size:12.5px;font-weight:600;}
.sar-flag-bd{padding:7px 12px 10px;font-size:12.5px;color:var(--tx2);line-height:1.55;}
.sar-flag.sev-high{border-color:#fecaca;}.sar-flag.sev-high .sar-flag-hd{background:#fee2e2;color:#991b1b;}
.sar-flag.sev-medium{border-color:#fed7aa;}.sar-flag.sev-medium .sar-flag-hd{background:#fff7ed;color:#c2410c;}
.sar-flag.sev-low{border-color:#fef08a;}.sar-flag.sev-low .sar-flag-hd{background:#fefce8;color:#713f12;}
.sar-sev-badge{padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;text-transform:uppercase;}
.sar-bench-table{width:100%;border-collapse:collapse;font-size:12.5px;}
.sar-bench-table th{font-size:10.5px;font-weight:600;color:var(--tx2);text-transform:uppercase;letter-spacing:.3px;padding:0 10px 8px 0;border-bottom:1px solid var(--bdr);text-align:left;}
.sar-bench-table td{padding:9px 10px 9px 0;border-bottom:1px solid var(--bdr-soft);color:var(--tx2);}
.sar-bench-table tr:last-child td{border-bottom:none;}
.sar-bench-table td:first-child{font-weight:500;color:var(--tx);}
.sar-verdict-above{background:#d1fae5;color:#065f46;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:600;}
.sar-verdict-below{background:#fee2e2;color:#991b1b;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:600;}
.sar-verdict-at{background:var(--bg-sub);color:var(--tx2);padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:600;}
.sar-exp-list{display:flex;flex-direction:column;gap:8px;}
.sar-exp{background:var(--bg-sub);border:1px solid var(--bdr-soft);border-radius:9px;padding:11px 13px;}
.sar-exp-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;gap:8px;}
.sar-exp-name{font-size:13px;font-weight:600;}
.sar-exp-tags{display:flex;gap:5px;}
.sar-effort-low{background:#d1fae5;color:#065f46;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:600;}
.sar-effort-medium{background:#fef3c7;color:#92400e;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:600;}
.sar-effort-high{background:#fee2e2;color:#991b1b;padding:2px 7px;border-radius:8px;font-size:10.5px;font-weight:600;}
.sar-exp-timeline{background:var(--bg);border:1px solid var(--bdr);color:var(--tx2);padding:2px 7px;border-radius:8px;font-size:10.5px;}
.sar-exp-rows{display:flex;flex-direction:column;gap:4px;}
.sar-exp-row{display:flex;gap:8px;font-size:12.5px;}
.sar-exp-row-lbl{font-weight:600;color:var(--tx2);min-width:100px;flex-shrink:0;}
.sar-funnel-list{display:flex;flex-direction:column;gap:5px;}
.sar-funnel-step{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:9px;border:1px solid;}
.sar-funnel-step.fs-good{background:#f0fdf4;border-color:#a7f3d0;}.sar-funnel-step.fs-warn{background:#fff7ed;border-color:#fed7aa;}.sar-funnel-step.fs-bad{background:#fee2e2;border-color:#fecaca;}
.sar-funnel-num{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.fs-good .sar-funnel-num{background:#059669;color:#fff;}.fs-warn .sar-funnel-num{background:#d97706;color:#fff;}.fs-bad .sar-funnel-num{background:#dc2626;color:#fff;}
.sar-funnel-name{font-size:13px;font-weight:500;}.sar-funnel-diag{font-size:12px;color:var(--tx2);margin-top:2px;}
.sar-funnel-rate{font-size:13px;font-weight:600;margin-left:auto;white-space:nowrap;}
.fs-good .sar-funnel-rate{color:#059669;}.fs-warn .sar-funnel-rate{color:#d97706;}.fs-bad .sar-funnel-rate{color:#dc2626;}
.sar-anomaly-list{display:flex;flex-direction:column;gap:8px;}
.sar-anomaly{border:1px solid;border-radius:9px;overflow:hidden;}
.sar-anomaly.sev-high{border-color:#fecaca;}.sar-anomaly.sev-medium{border-color:#fed7aa;}.sar-anomaly.sev-low{border-color:#fef08a;}
.sar-anomaly-hd{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;}
.sev-high .sar-anomaly-hd{background:#fee2e2;}.sev-medium .sar-anomaly-hd{background:#fff7ed;}.sev-low .sar-anomaly-hd{background:#fefce8;}
.sar-anomaly-name{font-size:13px;font-weight:600;}
.sev-high .sar-anomaly-name{color:#991b1b;}.sev-medium .sar-anomaly-name{color:#c2410c;}.sev-low .sar-anomaly-name{color:#713f12;}
.sar-anomaly-body{padding:10px 12px;display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;}
.sar-anomaly-item label{font-size:10.5px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.3px;display:block;margin-bottom:2px;}
.sar-anomaly-item span{font-size:12.5px;color:var(--tx2);}
.sar-causes-list{display:flex;flex-direction:column;gap:6px;}
.sar-cause{display:grid;grid-template-columns:36px 1fr;gap:10px;padding:11px 12px;background:var(--bg);border:1px solid var(--bdr-soft);border-radius:9px;}
.sar-cause-rank{width:28px;height:28px;border-radius:50%;background:var(--bg-sub);border:1.5px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--tx2);}
.sar-cause-rank.rank-1{background:#fffbf5;border-color:#fde68a;color:#b45309;}
.sar-cause-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;}
.sar-cause-name{font-size:12.5px;font-weight:600;}
.sar-cause-prob{background:#fffbf5;border:1px solid #fde68a;color:#b45309;padding:2px 7px;border-radius:8px;font-size:11px;font-weight:600;}
.sar-cause-detail{display:grid;grid-template-columns:1fr 1fr;gap:5px 14px;margin-top:4px;}
.sar-cause-detail label{font-size:10.5px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.3px;display:block;margin-bottom:2px;}
.sar-cause-detail span{font-size:12.5px;color:var(--tx2);}
.sar-scenarios-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
@media(max-width:520px){.sar-scenarios-grid{grid-template-columns:1fr;}}
.sar-scenario{border:1px solid var(--bdr-soft);border-radius:9px;overflow:hidden;}
.sar-scenario-hd{padding:9px 12px;border-bottom:1px solid var(--bdr-soft);}
.sar-scenario.bear .sar-scenario-hd{background:#fee2e2;}.sar-scenario.base .sar-scenario-hd{background:#fffbf5;}.sar-scenario.bull .sar-scenario-hd{background:#d1fae5;}
.sar-scenario-name{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;}
.sar-scenario.bear .sar-scenario-name{color:#991b1b;}.sar-scenario.base .sar-scenario-name{color:#b45309;}.sar-scenario.bull .sar-scenario-name{color:#065f46;}
.sar-scenario-prob{font-size:11px;color:var(--tx3);margin-top:2px;}
.sar-scenario-body{padding:10px 12px;display:flex;flex-direction:column;gap:6px;}
.sar-scenario-projs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:4px;}
.sar-proj-cell{text-align:center;padding:5px 3px;background:var(--bg-sub);border-radius:5px;}
.sar-proj-period{font-size:9.5px;color:var(--tx3);text-transform:uppercase;display:block;margin-bottom:2px;}
.sar-proj-val{font-size:12px;font-weight:600;color:var(--tx);}
.sar-scenario-row{display:flex;gap:8px;font-size:12px;}
.sar-scenario-lbl{font-weight:600;color:var(--tx2);min-width:90px;flex-shrink:0;}
.sar-milestones-list{display:flex;flex-direction:column;gap:7px;}
.sar-milestone{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;padding:11px 13px;background:var(--bg);border:1px solid var(--bdr-soft);border-radius:9px;}
.sar-ms-target{font-size:13px;font-weight:600;margin-bottom:3px;}
.sar-ms-indicator{font-size:12.5px;color:var(--tx2);margin-bottom:3px;}
.sar-ms-gap{font-size:12px;color:var(--tx3);}
.sar-pace-ontrack{background:#d1fae5;color:#065f46;padding:3px 8px;border-radius:9px;font-size:10.5px;font-weight:600;}
.sar-pace-behind{background:#fee2e2;color:#991b1b;padding:3px 8px;border-radius:9px;font-size:10.5px;font-weight:600;}
.sar-pace-ahead{background:#eff6ff;color:#1d4ed8;padding:3px 8px;border-radius:9px;font-size:10.5px;font-weight:600;}
.sar-arch-wrap{border:1px solid var(--bdr-soft);border-radius:9px;overflow:hidden;}
.sar-arch-layer{border-bottom:1px solid var(--bdr-soft);}
.sar-arch-layer:last-child{border-bottom:none;}
.sar-arch-layer-hd{display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--bg-sub);font-size:10.5px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.4px;border-bottom:1px solid var(--bdr-soft);}
.sar-arch-components{display:flex;flex-wrap:wrap;gap:5px;padding:10px 12px;}
.sar-arch-component{padding:4px 10px;background:var(--bg);border:1px solid var(--bdr);border-radius:20px;font-size:12px;color:var(--tx);font-weight:500;}
.sar-concept-outer{background:var(--bg);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;box-shadow:var(--sh-sm);}
.sar-concept-hd{padding:10px 15px;border-bottom:1px solid var(--bdr);background:var(--bg-sub);display:flex;align-items:center;justify-content:space-between;}
.sar-concept-title{font-family:'Lora',Georgia,serif;font-size:16px;font-weight:600;letter-spacing:-.3px;color:var(--tx);}
.sar-concept-sub{font-size:12.5px;color:var(--tx2);line-height:1.6;padding:10px 15px;border-bottom:1px solid var(--bdr-soft);}
.sar-concept-body{padding:16px 18px;}
.sar-section-label{font-size:10px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--tx3);margin:16px 0 8px;display:flex;align-items:center;gap:7px;}
.sar-section-label::after{content:'';flex:1;height:1px;background:var(--bdr-soft);}
.sar-key-concepts{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
.sar-concept-pill{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500;background:var(--bg);border:1.5px solid var(--bdr);color:var(--tx);}
.sar-concept-pill-dot{width:5px;height:5px;border-radius:50%;background:var(--acc);}
.sar-flow-diagram{display:flex;flex-direction:column;align-items:flex-start;gap:0;}
.sar-flow-box{background:var(--bg);border:1.5px solid var(--bdr);border-radius:9px;padding:11px 18px;font-size:13px;font-weight:500;color:var(--tx);min-width:180px;box-shadow:var(--sh-sm);}
.sar-flow-lbl{font-size:10px;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px;}
.sar-flow-desc{font-size:12px;color:var(--tx2);margin-top:3px;}
.sar-flow-arrow{display:flex;flex-direction:column;padding-left:32px;margin:2px 0;}
.sar-flow-line{width:2px;height:18px;background:var(--bdr);margin-left:12px;}
.sar-flow-head{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid var(--bdr);margin-left:9px;}
.sar-cmap-center{display:flex;justify-content:center;margin-bottom:20px;}
.sar-cmap-root{background:var(--tx);color:#fff;padding:11px 20px;border-radius:9px;font-size:13.5px;font-weight:600;box-shadow:var(--sh-sm);}
.sar-cmap-branches{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;}
.sar-cmap-branch{background:var(--bg);border:1.5px solid var(--bdr);border-radius:9px;padding:12px 14px;box-shadow:var(--sh-sm);}
.sar-cmap-branch-title{font-size:12.5px;font-weight:600;margin-bottom:6px;color:var(--tx);}
.sar-cmap-item{font-size:12px;color:var(--tx2);display:flex;align-items:flex-start;gap:5px;line-height:1.4;margin-bottom:3px;}
.sar-cmap-item::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:5px;}
.sar-timeline{display:flex;flex-direction:column;gap:0;padding:4px 0;}
.sar-tl-item{display:flex;gap:14px;}
.sar-tl-rail{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:28px;}
.sar-tl-dot{width:11px;height:11px;border-radius:50%;background:var(--acc);border:2px solid var(--bg-sub);flex-shrink:0;margin-top:4px;}
.sar-tl-line{width:2px;flex:1;background:var(--bdr);margin:3px 0;}
.sar-tl-item:last-child .sar-tl-line{display:none;}
.sar-tl-body{padding-bottom:18px;flex:1;}
.sar-tl-lbl{font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--acc);margin-bottom:2px;}
.sar-tl-title{font-size:13px;font-weight:600;margin-bottom:3px;}
.sar-tl-desc{font-size:12.5px;color:var(--tx2);line-height:1.6;}
.sar-compare-wrap{border:1px solid var(--bdr);border-radius:9px;overflow:hidden;}
.sar-compare-table{width:100%;border-collapse:collapse;font-size:12.5px;}
.sar-compare-table th{padding:9px 12px;background:var(--tx);color:#fff;text-align:left;font-size:10.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;}
.sar-compare-table td{padding:9px 12px;border-bottom:1px solid var(--bdr-soft);color:var(--tx);vertical-align:top;}
.sar-compare-table tr:last-child td{border-bottom:none;}
.sar-compare-table tr:hover td{background:var(--bg-sub);}
.sar-compare-table td:first-child{font-weight:600;color:var(--tx2);font-size:12px;}
.sar-analogy-body{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;padding:14px;}
.sar-analogy-side{padding:10px 12px;border-radius:9px;border:1.5px solid var(--bdr);background:var(--bg-sub);}
.sar-analogy-lbl{font-size:10px;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:.3px;margin-bottom:3px;}
.sar-analogy-text{font-size:13px;font-weight:500;color:var(--tx);}
.sar-analogy-arrow{font-size:18px;color:var(--tx3);text-align:center;}
.sar-explanation{background:var(--bg);border:1px solid var(--bdr);border-radius:9px;padding:16px 18px;line-height:1.8;font-size:13.5px;color:var(--tx);}
.sar-kg-stats{display:flex;gap:8px;padding:9px 13px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;margin-bottom:10px;}
.sar-kg-stat{display:flex;flex-direction:column;gap:2px;flex:1;text-align:center;}
.sar-kg-stat-n{font-family:'Lora',Georgia,serif;font-size:17px;font-weight:500;color:#7c3aed;}
.sar-kg-stat-l{font-size:10px;text-transform:uppercase;letter-spacing:.3px;color:var(--tx3);}
.sar-node-list{display:flex;flex-direction:column;gap:7px;}
.sar-node{display:flex;align-items:flex-start;gap:10px;padding:11px 13px;background:var(--bg);border:1px solid var(--bdr-soft);border-radius:9px;}
.sar-node-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ni-concept{background:#f5f3ff;}.ni-fact{background:#f0f9ff;}.ni-source{background:#f0fdfa;}.ni-question{background:#fffbf5;}.ni-idea{background:#eef2ff;}
.sar-node-title{font-size:12.5px;font-weight:600;margin-bottom:2px;}
.sar-node-desc{font-size:12px;color:var(--tx2);line-height:1.55;}
.sar-node-type{padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;text-transform:uppercase;margin-top:5px;display:inline-block;}
.ntb-concept{background:#f5f3ff;color:#7c3aed;}.ntb-fact{background:#f0f9ff;color:#0369a1;}.ntb-source{background:#f0fdfa;color:#0d9488;}.ntb-question{background:#fffbf5;color:#d97706;}.ntb-idea{background:#eef2ff;color:#4338ca;}
.sar-edge-list{display:flex;flex-direction:column;gap:5px;}
.sar-edge{display:flex;align-items:center;gap:9px;padding:8px 11px;background:var(--bg);border:1px solid var(--bdr-soft);border-radius:8px;}
.sar-edge-from,.sar-edge-to{font-size:12px;font-weight:600;color:var(--tx);padding:2px 7px;background:var(--bg-sub);border-radius:4px;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;}
.sar-edge-mid{display:flex;flex-direction:column;align-items:center;flex:1;}
.sar-edge-line{height:1px;width:100%;background:var(--bdr);}
.sar-edge-lbl{font-size:10px;color:var(--tx3);font-style:italic;}
.sar-edge-strength{font-size:10.5px;padding:2px 6px;border-radius:7px;font-weight:500;flex-shrink:0;}
.es-strong{background:#d1fae5;color:#065f46;}.es-moderate{background:#fffbf5;color:#b45309;}.es-weak{background:var(--bg-sub);color:var(--tx3);}
.sar-insight-list{display:flex;flex-direction:column;gap:7px;}
.sar-kg-insight{padding:11px 13px;border-radius:9px;border-left:3px solid;font-size:13px;line-height:1.65;}
.ib-pattern{background:#eef2ff;border-color:#4338ca;color:#312e81;}.ib-gap{background:#fffbf5;border-color:#d97706;color:#78350f;}.ib-connection{background:#f0f9ff;border-color:#0369a1;color:#0c4a6e;}.ib-contradiction{background:#fff1f2;border-color:#be123c;color:#be123c;}.ib-synthesis{background:#f0fdfa;border-color:#0d9488;color:#134e4a;}
.sar-kg-insight-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px;opacity:.7;}
.sar-suggestions-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.sar-suggestion{padding:11px 13px;background:var(--bg);border:1px solid var(--bdr-soft);border-radius:9px;cursor:pointer;transition:all .15s;}
.sar-suggestion:hover{transform:translateY(-1px);box-shadow:var(--sh-sm);border-color:#c5c0b8;}
.sar-sug-icon{font-size:17px;margin-bottom:5px;}.sar-sug-title{font-size:12.5px;font-weight:600;margin-bottom:2px;}.sar-sug-body{font-size:11.5px;color:var(--tx2);line-height:1.45;}
.sar-pos-section{background:var(--bg);border:1px solid var(--bdr);border-radius:9px;overflow:hidden;margin-bottom:8px;}
.sar-pos-sec-hd{display:flex;align-items:center;gap:8px;padding:10px 13px;background:var(--bg-sub);border-bottom:1px solid var(--bdr-soft);cursor:pointer;user-select:none;}
.sar-pos-sec-icon{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sar-pos-sec-title{font-size:13px;font-weight:600;flex:1;}
.sar-pos-chevron{color:var(--tx3);transition:transform .18s;}
.sar-pos-chevron.open{transform:rotate(90deg);}
.sar-pos-body{padding:13px 15px;}.sar-pos-body.collapsed{display:none;}
.sar-pos-kv{display:grid;grid-template-columns:auto 1fr;gap:5px 12px;align-items:start;}
.sar-pos-kv-key{font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.3px;padding-top:1px;white-space:nowrap;}
.sar-pos-kv-val{font-size:13px;color:var(--tx);line-height:1.55;}
.sar-pos-list{display:flex;flex-direction:column;gap:4px;}
.sar-pos-list-item{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--tx);line-height:1.5;}
.sar-pos-bullet{width:5px;height:5px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:6px;}
.sar-pos-step-list{display:flex;flex-direction:column;gap:0;}
.sar-pos-step{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--bdr-soft);}
.sar-pos-step:last-child{border-bottom:none;padding-bottom:0;}
.sar-pos-step-num{width:20px;height:20px;border-radius:50%;font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;color:#fff;background:var(--acc);}
.sar-pos-step-content{flex:1;font-size:13px;line-height:1.6;color:var(--tx);}
.sar-pos-step-title{font-weight:600;margin-bottom:2px;}
.sar-pos-callout{padding:9px 12px;border-radius:8px;border-left:3px solid;font-size:13px;line-height:1.6;}
.sar-pos-callout.info{background:#eff6ff;border-color:#2563eb;color:#1e3a8a;}
.sar-pos-callout.warn{background:#fffbeb;border-color:#f59e0b;color:#78350f;}
.sar-pos-callout.tip{background:#d1fae5;border-color:#059669;color:#064e3b;}
.sar-data-section{margin-bottom:14px;}
.sar-data-sec-title{font-size:10.5px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px;padding-bottom:5px;border-bottom:1px solid var(--bdr-soft);}
.sar-data-para{font-size:13px;line-height:1.75;color:var(--tx);margin-bottom:7px;}
.sar-data-ul{margin:0 0 7px 18px;display:flex;flex-direction:column;gap:5px;}
.sar-data-ul li{font-size:12.5px;line-height:1.6;color:var(--tx);}
.sar-dl-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px;}
.sar-dl-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border:none;border-radius:7px;font-family:var(--font);font-size:12.5px;font-weight:500;cursor:pointer;transition:all .15s;}
.sar-dl-dark{background:var(--tx);color:#fff;}.sar-dl-dark:hover{background:#2d2a26;transform:translateY(-1px);}
.sar-dl-blue{background:#4338ca;color:#fff;}.sar-dl-blue:hover{background:#3730a3;transform:translateY(-1px);}
.sar-dl-teal{background:#0d9488;color:#fff;}.sar-dl-teal:hover{background:#0f766e;transform:translateY(-1px);}
`;
    document.head.appendChild(s);
  }

  /* ── Shared block builder ── */
  function buildBlock(chipClass, chipLabel, title, pid) {
    var wrap = document.createElement('div'); wrap.className = 'sar-wrap';
    var chip = document.createElement('div'); chip.className = 'sar-chip sar-chip-'+chipClass; chip.textContent = chipLabel;
    wrap.appendChild(chip);
    var block = document.createElement('div'); block.className = 'sar-block';
    var hd = document.createElement('div'); hd.className = 'sar-block-hd';
    hd.innerHTML = '<div class="sar-block-title">'+esc(title)+'</div>' +
      '<button class="sar-copy-btn" data-pid="'+pid+'"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>';
    block.appendChild(hd);
    wrap.appendChild(block);
    setTimeout(function() {
      var btn = wrap.querySelector('.sar-copy-btn');
      if (btn) btn.onclick = function() {
        var el = document.getElementById(btn.dataset.pid);
        navigator.clipboard.writeText(el ? el.innerText : '').then(function() {
          btn.textContent = 'Copied!';
          setTimeout(function() { btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy'; }, 2000);
        }).catch(function(){});
      };
    }, 50);
    return { wrap:wrap, block:block };
  }

  function addDL(wrap, pid, label, extras) {
    var row = document.createElement('div'); row.className = 'sar-dl-row';
    var btn = document.createElement('button'); btn.className = 'sar-dl-btn sar-dl-dark';
    btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt';
    btn.onclick = function() {
      var el = document.getElementById(pid);
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([el ? el.innerText : label], { type:'text/plain' }));
      a.download = 'stremini-'+label.toLowerCase().replace(/\s+/g,'-')+'-'+Date.now()+'.txt';
      a.click();
    };
    row.appendChild(btn);
    if (extras) extras.forEach(function(e){ row.appendChild(e); });
    wrap.appendChild(row);
  }

  function jsonBtn(data, label) {
    var btn = document.createElement('button'); btn.className = 'sar-dl-btn sar-dl-blue';
    btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> JSON';
    btn.onclick = function() {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
      a.download = 'stremini-'+label+'-'+Date.now()+'.json';
      a.click();
    };
    return btn;
  }

  function scoreClass(n) {
    if (n <= 40) return 'critical';
    if (n <= 60) return 'risk';
    if (n <= 75) return 'attention';
    if (n <= 89) return 'healthy';
    return 'excellent';
  }

  /* ── Build section content (shared by architect + data) ── */
  function buildSecContent(sec) {
    var div = document.createElement('div');
    if (sec.content) { var d = document.createElement('div'); d.style.cssText='font-size:13px;color:var(--tx2);line-height:1.65;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--bdr-soft)'; d.textContent=sec.content; div.appendChild(d); }

    if (sec.insights && sec.insights.length) {
      var list = document.createElement('div'); list.className='sar-insights-list';
      sec.insights.forEach(function(ins) {
        var sig=(ins.signal||'neutral').toLowerCase();
        var el=document.createElement('div'); el.className='sar-insight sig-'+sig;
        el.innerHTML='<div class="sar-insight-dot sar-insight-dot-'+(sig==='positive'?'pos':sig==='negative'?'neg':'neu')+'"></div><div><div class="sar-insight-title">'+esc(ins.title||'')+'</div><div class="sar-insight-detail">'+esc(ins.detail||'')+'</div></div>';
        list.appendChild(el);
      });
      div.appendChild(list);
    }

    if (sec.flags && sec.flags.length) {
      var fl=document.createElement('div'); fl.className='sar-flags-list';
      sec.flags.forEach(function(f) {
        var sev=(f.severity||'low').toLowerCase();
        var c=document.createElement('div'); c.className='sar-flag sev-'+sev;
        c.innerHTML='<div class="sar-flag-hd">'+esc(f.metric||'')+'<span class="sar-sev-badge">'+sev+'</span></div><div class="sar-flag-bd">'+esc(f.observation||'')+(f.consequence?' — '+esc(f.consequence):'')+'</div>';
        fl.appendChild(c);
      });
      div.appendChild(fl);
    }

    if (sec.benchmarks && sec.benchmarks.length) {
      var tbl=document.createElement('table'); tbl.className='sar-bench-table';
      tbl.innerHTML='<thead><tr><th>Metric</th><th>Your Value</th><th>Industry Avg</th><th>Best-in-Class</th><th>Verdict</th></tr></thead>';
      var tb=document.createElement('tbody');
      sec.benchmarks.forEach(function(b) {
        var v=(b.verdict||'at').toLowerCase();
        var tr=document.createElement('tr');
        tr.innerHTML='<td>'+esc(b.metric||'')+'</td><td style="font-weight:600">'+esc(b.your_value||'')+'</td><td>'+esc(b.industry_avg||'—')+'</td><td>'+esc(b.best_in_class||'—')+'</td><td><span class="sar-verdict-'+v+'">'+(v==='above'?'↑ Above':v==='below'?'↓ Below':'→ At')+'</span></td>';
        tb.appendChild(tr);
      });
      tbl.appendChild(tb); div.appendChild(tbl);
    }

    if (sec.experiments && sec.experiments.length) {
      var el2=document.createElement('div'); el2.className='sar-exp-list';
      sec.experiments.forEach(function(exp) {
        var eff=(exp.effort||'medium').toLowerCase();
        var c=document.createElement('div'); c.className='sar-exp';
        c.innerHTML='<div class="sar-exp-hd"><div class="sar-exp-name">'+esc(exp.name||'')+'</div><div class="sar-exp-tags"><span class="sar-effort-'+eff+'">'+eff+'</span>'+(exp.timeline?'<span class="sar-exp-timeline">'+esc(exp.timeline)+'</span>':'')+'</div></div><div class="sar-exp-rows">'+(exp.hypothesis?'<div class="sar-exp-row"><span class="sar-exp-row-lbl">Hypothesis</span><span>'+esc(exp.hypothesis)+'</span></div>':'')+(exp.method?'<div class="sar-exp-row"><span class="sar-exp-row-lbl">Method</span><span>'+esc(exp.method)+'</span></div>':'')+(exp.metric?'<div class="sar-exp-row"><span class="sar-exp-row-lbl">Success</span><span>'+esc(exp.metric)+'</span></div>':'')+'</div>';
        el2.appendChild(c);
      });
      div.appendChild(el2);
    }

    if (sec.funnel_steps && sec.funnel_steps.length) {
      var fn=document.createElement('div'); fn.className='sar-funnel-list';
      sec.funnel_steps.forEach(function(f,i) {
        var st=(f.status||'warn').toLowerCase();
        var el3=document.createElement('div'); el3.className='sar-funnel-step fs-'+st;
        el3.innerHTML='<div class="sar-funnel-num">'+(i+1)+'</div><div style="flex:1"><div class="sar-funnel-name">'+esc(f.step||'')+'</div><div class="sar-funnel-diag">'+esc(f.diagnosis||'')+'</div></div><div class="sar-funnel-rate">'+esc(f.conversion_rate||'—')+'</div>';
        fn.appendChild(el3);
      });
      div.appendChild(fn);
    }

    if (sec.anomalies && sec.anomalies.length) {
      var al=document.createElement('div'); al.className='sar-anomaly-list';
      sec.anomalies.forEach(function(a) {
        var sev=(a.severity||'medium').toLowerCase();
        var el4=document.createElement('div'); el4.className='sar-anomaly sev-'+sev;
        el4.innerHTML='<div class="sar-anomaly-hd"><div class="sar-anomaly-name">'+esc(a.name||a.metric||'')+'</div><span class="sar-sev-badge">'+sev+'</span></div><div class="sar-anomaly-body">'+(a.magnitude?'<div class="sar-anomaly-item"><label>Magnitude</label><span>'+esc(a.magnitude)+'</span></div>':'')+(a.first_seen?'<div class="sar-anomaly-item"><label>First Seen</label><span>'+esc(a.first_seen)+'</span></div>':'')+(a.likely_cause?'<div class="sar-anomaly-item" style="grid-column:1/-1"><label>Likely Cause</label><span>'+esc(a.likely_cause)+'</span></div>':'')+'</div>';
        al.appendChild(el4);
      });
      div.appendChild(al);
    }

    if (sec.causes && sec.causes.length) {
      var cl=document.createElement('div'); cl.className='sar-causes-list';
      sec.causes.forEach(function(c) {
        var el5=document.createElement('div'); el5.className='sar-cause';
        el5.innerHTML='<div class="sar-cause-rank'+(c.rank===1?' rank-1':'')+'">'+esc(String(c.rank||'?'))+'</div><div><div class="sar-cause-top"><div class="sar-cause-name">'+esc(c.cause||'')+'</div>'+(c.probability?'<span class="sar-cause-prob">'+esc(c.probability)+'</span>':'')+'</div><div class="sar-cause-detail">'+(c.evidence?'<div><label>Evidence</label><span>'+esc(c.evidence)+'</span></div>':'')+(c.rule_out?'<div><label>Rule Out</label><span>'+esc(c.rule_out)+'</span></div>':'')+'</div></div>';
        cl.appendChild(el5);
      });
      div.appendChild(cl);
    }

    if (sec.scenarios && sec.scenarios.length) {
      var sg=document.createElement('div'); sg.className='sar-scenarios-grid';
      sec.scenarios.forEach(function(s) {
        var cls=(s.name||'').toLowerCase().includes('bear')?'bear':(s.name||'').toLowerCase().includes('bull')?'bull':'base';
        var el6=document.createElement('div'); el6.className='sar-scenario '+cls;
        el6.innerHTML='<div class="sar-scenario-hd"><div class="sar-scenario-name">'+esc(s.name||'')+'</div><div class="sar-scenario-prob">'+esc(s.probability||'')+'</div></div><div class="sar-scenario-body"><div class="sar-scenario-projs"><div class="sar-proj-cell"><span class="sar-proj-period">3M</span><span class="sar-proj-val">'+esc(s.month3||'—')+'</span></div><div class="sar-proj-cell"><span class="sar-proj-period">6M</span><span class="sar-proj-val">'+esc(s.month6||'—')+'</span></div><div class="sar-proj-cell"><span class="sar-proj-period">12M</span><span class="sar-proj-val">'+esc(s.month12||'—')+'</span></div></div>'+(s.key_assumption?'<div class="sar-scenario-row"><span class="sar-scenario-lbl">Assumption</span><span>'+esc(s.key_assumption)+'</span></div>':'')+(s.trigger?'<div class="sar-scenario-row"><span class="sar-scenario-lbl">Trigger</span><span>'+esc(s.trigger)+'</span></div>':'')+'</div>';
        sg.appendChild(el6);
      });
      div.appendChild(sg);
    }

    if (sec.milestones && sec.milestones.length) {
      var ml=document.createElement('div'); ml.className='sar-milestones-list';
      sec.milestones.forEach(function(m) {
        var pace=(m.current_pace||'on-track').toLowerCase().replace(/ /g,'-');
        var pcls='sar-pace-'+(pace.includes('track')?'ontrack':pace.includes('ahead')?'ahead':'behind');
        var el7=document.createElement('div'); el7.className='sar-milestone';
        el7.innerHTML='<div><div class="sar-ms-target">'+esc(m.target||'')+'<span style="font-weight:400;color:var(--tx3);font-size:12px"> · '+esc(m.deadline||'')+'</span></div>'+(m.leading_indicator?'<div class="sar-ms-indicator">'+esc(m.leading_indicator)+'</div>':'')+(m.gap?'<div class="sar-ms-gap">Gap: '+esc(m.gap)+'</div>':'')+'</div><span class="'+pcls+'">'+esc(pace)+'</span>';
        ml.appendChild(el7);
      });
      div.appendChild(ml);
    }

    if (sec.diagram && sec.diagram.layers) {
      var aw=document.createElement('div'); aw.className='sar-arch-wrap';
      (sec.diagram.layers||[]).forEach(function(l) {
        var layer=document.createElement('div'); layer.className='sar-arch-layer';
        layer.innerHTML='<div class="sar-arch-layer-hd">'+esc(l.name||'')+'</div><div class="sar-arch-components">'+(l.components||[]).map(function(c){ return '<span class="sar-arch-component">'+esc(c)+'</span>'; }).join('')+'</div>';
        aw.appendChild(layer);
      });
      div.appendChild(aw);
    }

    if (sec.items && sec.items.length) {
      sec.items.forEach(function(item) {
        var d=document.createElement('div'); d.className='sar-item';
        d.innerHTML='<span class="sar-item-label">'+esc(item.label||'')+'</span><span class="sar-item-value">'+esc(item.value||'')+'</span>';
        div.appendChild(d);
      });
    }

    return div;
  }

  /* ── Architect ── */
  function renderArchitect(data) {
    var pid='sar_'+Date.now();
    var built=buildBlock('architect','🏗 Architect',data.title||'Architecture Report',pid);
    var wrap=built.wrap, block=built.block;
    if (data.health_score!==undefined) {
      var sc=scoreClass(data.health_score);
      var hs=document.createElement('div'); hs.className='sar-health-strip';
      hs.innerHTML='<div class="sar-health-num score-'+sc+'">'+data.health_score+'</div><div style="flex:1"><div class="sar-health-label score-'+sc+'">'+esc(data.health_label||'')+'</div><div class="sar-health-track"><div class="sar-health-fill fill-'+sc+'" style="width:0%" id="hbar_'+pid+'"></div></div></div>';
      block.appendChild(hs);
      setTimeout(function(){ var b=document.getElementById('hbar_'+pid); if(b)b.style.width=data.health_score+'%'; }, 80);
    }
    var secs=data.sections||[];
    if (!secs.length) { var fb=document.createElement('div'); fb.style.cssText='padding:16px;font-size:13px;color:var(--tx2)'; fb.textContent=data.summary||''; block.appendChild(fb); }
    else {
      var tabBar=document.createElement('div'); tabBar.className='sar-tabs';
      var bodies=[];
      secs.forEach(function(sec,i) {
        var tab=document.createElement('button'); tab.className='sar-tab'+(i===0?' active':''); tab.textContent=sec.label||('Section '+(i+1));
        tab.onclick=function() { tabBar.querySelectorAll('.sar-tab').forEach(function(t){t.classList.remove('active');}); tab.classList.add('active'); bodies.forEach(function(b,j){b.style.display=j===i?'block':'none';}); };
        tabBar.appendChild(tab);
        var body=document.createElement('div'); body.className='sar-tab-body'; body.id=i===0?pid:''; body.style.display=i===0?'block':'none';
        body.appendChild(buildSecContent(sec));
        bodies.push(body);
      });
      block.appendChild(tabBar);
      bodies.forEach(function(b){block.appendChild(b);});
    }
    addDL(wrap,pid,data.title||'architect',[jsonBtn(data,'architect')]);
    return wrap;
  }

  /* ── Data ── */
  function renderData(data) {
    var pid='sar_'+Date.now();
    var built=buildBlock('data','📊 Data Intelligence',data.title||'Analysis Report',pid);
    var wrap=built.wrap, block=built.block;
    if (data.health_score!==undefined) {
      var hb=document.createElement('span');
      hb.style.cssText='display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11.5px;font-weight:600;background:var(--bg-sub);color:var(--tx2);border:1px solid var(--bdr);margin-left:8px;';
      hb.textContent=data.health_score+'/100 · '+(data.health_label||'');
      block.querySelector('.sar-block-title').appendChild(hb);
    }
    if (data.summary) { var sum=document.createElement('div'); sum.style.cssText='padding:11px 15px;background:#fafaf8;border-bottom:1px solid var(--bdr-soft);font-size:13px;line-height:1.65;color:var(--tx2);font-style:italic;'; sum.textContent=data.summary; block.appendChild(sum); }
    var body=document.createElement('div'); body.className='sar-body'; body.id=pid;
    function makeAccordion(sec, colBg, colTx) {
      var secEl=document.createElement('div'); secEl.className='sar-section';
      var hd=document.createElement('div'); hd.className='sar-sec-hd';
      hd.innerHTML='<div class="sar-sec-icon" style="background:'+colBg+';color:'+colTx+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="3"/></svg></div><div class="sar-sec-label">'+esc(sec.label||'Section')+'</div><svg class="sar-chevron open" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
      secEl.appendChild(hd);
      if (sec.content) { var desc=document.createElement('div'); desc.className='sar-sec-desc'; desc.textContent=sec.content; secEl.appendChild(desc); }
      var bd=document.createElement('div'); bd.className='sar-sec-body open';
      bd.appendChild(buildSecContent(sec));
      secEl.appendChild(bd);
      hd.onclick=function(){ var o=bd.classList.toggle('open'); hd.querySelector('.sar-chevron').classList.toggle('open',o); };
      return secEl;
    }
    (data.sections||[]).forEach(function(sec){ body.appendChild(makeAccordion(sec,'#eff6ff','#1d4ed8')); });
    block.appendChild(body);
    addDL(wrap,pid,data.title||'data-report',[jsonBtn(data,'data')]);
    return wrap;
  }

  /* ── Concept ── */
  function renderConcept(data, concept) {
    var pid='sar_'+Date.now();
    var wrap=document.createElement('div'); wrap.className='sar-wrap';
    var chip=document.createElement('div'); chip.className='sar-chip sar-chip-concept'; chip.textContent='💡 Concept Explainer'; wrap.appendChild(chip);
    var outer=document.createElement('div'); outer.className='sar-concept-outer';
    var hd=document.createElement('div'); hd.className='sar-concept-hd';
    hd.innerHTML='<div class="sar-concept-title">'+esc(data.title||concept||'')+'</div><button class="sar-copy-btn" data-pid="'+pid+'"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>';
    outer.appendChild(hd);
    if (data.subtitle) { var sub=document.createElement('div'); sub.className='sar-concept-sub'; sub.textContent=data.subtitle; outer.appendChild(sub); }
    var body=document.createElement('div'); body.className='sar-concept-body'; body.id=pid;
    if (data.keyConcepts&&data.keyConcepts.length) {
      var kcl=document.createElement('div'); kcl.className='sar-section-label'; kcl.textContent='Key Concepts'; body.appendChild(kcl);
      var kc=document.createElement('div'); kc.className='sar-key-concepts';
      data.keyConcepts.forEach(function(k){ kc.innerHTML+='<div class="sar-concept-pill"><div class="sar-concept-pill-dot"></div>'+esc(k)+'</div>'; });
      body.appendChild(kc);
    }
    var vt=data.vizType||'flow', viz=data.visualization;
    var vlbl={flow:'Flow Diagram',map:'Concept Map',timeline:'Timeline',compare:'Comparison',analogy:'Analogy'}[vt]||'Visualization';
    var vl=document.createElement('div'); vl.className='sar-section-label'; vl.textContent=vlbl; body.appendChild(vl);
    if (vt==='flow'&&viz) body.appendChild(buildFlow(viz));
    else if (vt==='map'&&viz) body.appendChild(buildCMap(viz));
    else if (vt==='timeline'&&viz) body.appendChild(buildTL(viz));
    else if (vt==='compare'&&viz) body.appendChild(buildCompare(viz));
    else if (vt==='analogy'&&data.analogy) body.appendChild(buildAnalogy(data.analogy));
    if (data.analogy&&vt!=='analogy') { var al2=document.createElement('div'); al2.className='sar-section-label'; al2.textContent='Real-World Analogy'; body.appendChild(al2); body.appendChild(buildAnalogy(data.analogy)); }
    if (data.explanation) { var el2=document.createElement('div'); el2.className='sar-section-label'; el2.textContent='Explanation'; body.appendChild(el2); var exp=document.createElement('div'); exp.className='sar-explanation'; exp.innerHTML=fmtExpl(data.explanation); body.appendChild(exp); }
    outer.appendChild(body); wrap.appendChild(outer);
    setTimeout(function(){ var btn=wrap.querySelector('.sar-copy-btn'); if(btn)btn.onclick=function(){ var el=document.getElementById(btn.dataset.pid); navigator.clipboard.writeText(el?el.innerText:'').then(function(){btn.textContent='Copied!';setTimeout(function(){btn.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';},2000);}).catch(function(){}); }; },50);
    addDL(wrap,pid,data.title||'concept');
    return wrap;
  }

  function buildFlow(nodes) {
    var w=document.createElement('div'); w.className='sar-flow-diagram';
    nodes.forEach(function(n,i) {
      var box=document.createElement('div'); box.className='sar-flow-box';
      box.innerHTML=(n.step?'<div class="sar-flow-lbl">Step '+esc(String(n.step))+'</div>':'')+esc(n.name||n.title||'')+(n.desc||n.description?'<div class="sar-flow-desc">'+esc(n.desc||n.description)+'</div>':'');
      w.appendChild(box);
      if(i<nodes.length-1){var a=document.createElement('div');a.className='sar-flow-arrow';a.innerHTML='<div class="sar-flow-line"></div><div class="sar-flow-head"></div>';w.appendChild(a);}
    });
    return w;
  }
  function buildCMap(data) {
    var w=document.createElement('div');
    w.innerHTML='<div class="sar-cmap-center"><div class="sar-cmap-root">'+esc(data.center||'')+'</div></div>';
    var b=document.createElement('div'); b.className='sar-cmap-branches';
    (data.branches||[]).forEach(function(br){ var c=document.createElement('div'); c.className='sar-cmap-branch'; c.innerHTML='<div class="sar-cmap-branch-title">'+esc(br.name||br.title||'')+'</div>'+(br.items||[]).map(function(i){return '<div class="sar-cmap-item">'+esc(i)+'</div>';}).join(''); b.appendChild(c); });
    w.appendChild(b); return w;
  }
  function buildTL(items) {
    var w=document.createElement('div'); w.className='sar-timeline';
    items.forEach(function(it){ var r=document.createElement('div'); r.className='sar-tl-item'; r.innerHTML='<div class="sar-tl-rail"><div class="sar-tl-dot"></div><div class="sar-tl-line"></div></div><div class="sar-tl-body">'+(it.label?'<div class="sar-tl-lbl">'+esc(it.label)+'</div>':'')+'<div class="sar-tl-title">'+esc(it.title||it.name||'')+'</div>'+(it.desc||it.description?'<div class="sar-tl-desc">'+esc(it.desc||it.description)+'</div>':'')+'</div>'; w.appendChild(r); });
    return w;
  }
  function buildCompare(data) {
    var o=document.createElement('div'); o.className='sar-compare-wrap';
    var cols=data.columns||[];
    var h='<table class="sar-compare-table"><thead><tr><th>Feature</th>'+cols.map(function(c){return '<th>'+esc(c)+'</th>';}).join('')+'</tr></thead><tbody>';
    (data.rows||[]).forEach(function(row){ h+='<tr><td>'+esc(row.feature||'')+'</td>'+cols.map(function(c){return '<td>'+esc(row[c]||'—')+'</td>';}).join('')+'</tr>'; });
    h+='</tbody></table>'; o.innerHTML=h; return o;
  }
  function buildAnalogy(a) {
    var c=document.createElement('div'); c.style.cssText='background:var(--bg);border:1.5px solid var(--bdr);border-radius:9px;overflow:hidden;';
    c.innerHTML='<div style="padding:9px 13px;background:var(--bg-sub);border-bottom:1px solid var(--bdr-soft);font-size:10.5px;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:.4px;">Think of it like…</div><div class="sar-analogy-body"><div class="sar-analogy-side"><div class="sar-analogy-lbl">Concept</div><div class="sar-analogy-text">'+esc(a.concept||'')+'</div></div><div class="sar-analogy-arrow">≈</div><div class="sar-analogy-side"><div class="sar-analogy-lbl">Analogy</div><div class="sar-analogy-text">'+esc(a.comparison||a.analogy||'')+'</div></div></div>'+(a.explanation?'<div style="padding:10px 14px;border-top:1px solid var(--bdr-soft);font-size:13px;color:var(--tx2);line-height:1.6;">'+esc(a.explanation)+'</div>':'');
    return c;
  }
  function fmtExpl(text) {
    if (typeof text==='string') return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code style="background:var(--bg-sub);padding:1px 5px;border-radius:3px;font-family:var(--mono);font-size:12.5px;">$1</code>').split(/\n\n+/).map(function(p){return '<p style="margin-bottom:8px">'+p.replace(/\n/g,'<br>')+'</p>';}).join('');
    if (Array.isArray(text)) return text.map(function(p){return '<p style="margin-bottom:8px">'+esc(p)+'</p>';}).join('');
    return esc(String(text));
  }

  /* ── Knowledge Graph ── */
  function renderKnowledge(data, mode) {
    var pid='sar_'+Date.now();
    var lbl={add:'Node Added',connect:'Connections Built',explore:'Graph Explored',gaps:'Gaps Found',synthesize:'Synthesis',teach:'User Knowledge'}[mode]||'Knowledge';
    var built=buildBlock('knowledge','🕸 Knowledge Graph',lbl,pid); var wrap=built.wrap,block=built.block;
    var bd=document.createElement('div'); bd.style.cssText='padding:16px 18px;max-height:600px;overflow-y:auto;'; bd.id=pid;
    if (data.stats&&data.stats.length){var sb=document.createElement('div');sb.className='sar-kg-stats';data.stats.forEach(function(s){sb.innerHTML+='<div class="sar-kg-stat"><div class="sar-kg-stat-n">'+esc(String(s.value))+'</div><div class="sar-kg-stat-l">'+esc(s.label)+'</div></div>';});bd.appendChild(sb);}
    if (data.summary){var sm=document.createElement('div');sm.style.cssText='font-size:13px;color:var(--tx2);line-height:1.65;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--bdr-soft);';sm.textContent=data.summary;bd.appendChild(sm);}
    function sHead(lbl2){var d=document.createElement('div');d.style.cssText='font-size:10px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px;margin:14px 0 8px;';d.textContent=lbl2;return d;}
    if(data.nodes&&data.nodes.length){bd.appendChild(sHead('Nodes'));var nl=document.createElement('div');nl.className='sar-node-list';data.nodes.forEach(function(n){var t=n.type||'concept';var el=document.createElement('div');el.className='sar-node';el.innerHTML='<div class="sar-node-icon ni-'+t+'"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx2)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg></div><div><div class="sar-node-title">'+esc(n.title||n.name||'')+'</div>'+(n.description?'<div class="sar-node-desc">'+esc(n.description)+'</div>':'')+'<span class="sar-node-type ntb-'+t+'">'+t+'</span></div>';nl.appendChild(el);});bd.appendChild(nl);}
    if(data.edges&&data.edges.length){bd.appendChild(sHead('Connections'));var el2=document.createElement('div');el2.className='sar-edge-list';data.edges.forEach(function(e){var str=(e.strength||'moderate').toLowerCase();var row=document.createElement('div');row.className='sar-edge';row.innerHTML='<div class="sar-edge-from">'+esc(e.from||'')+'</div><div class="sar-edge-mid"><div class="sar-edge-line"></div><div class="sar-edge-lbl">'+esc(e.relation||'relates to')+'</div></div><div class="sar-edge-to">'+esc(e.to||'')+'</div><span class="sar-edge-strength es-'+str+'">'+str+'</span>';el2.appendChild(row);});bd.appendChild(el2);}
    if(data.insights&&data.insights.length){bd.appendChild(sHead('Insights'));var ins=document.createElement('div');ins.className='sar-insight-list';data.insights.forEach(function(i){var t=(i.type||'connection').toLowerCase();var box=document.createElement('div');box.className='sar-kg-insight ib-'+t;box.innerHTML='<div class="sar-kg-insight-lbl">'+t+'</div>'+esc(i.text||'');ins.appendChild(box);});bd.appendChild(ins);}
    if(data.suggestions&&data.suggestions.length){bd.appendChild(sHead('Suggestions'));var sg=document.createElement('div');sg.className='sar-suggestions-grid';data.suggestions.forEach(function(s){var c=document.createElement('div');c.className='sar-suggestion';c.innerHTML='<div class="sar-sug-icon">'+esc(s.emoji||'💡')+'</div><div class="sar-sug-title">'+esc(s.title||'')+'</div><div class="sar-sug-body">'+esc(s.body||'')+'</div>';sg.appendChild(c);});bd.appendChild(sg);}
    if(data.prose){var pr=document.createElement('div');pr.style.cssText='font-size:13.5px;color:var(--tx);line-height:1.8;white-space:pre-wrap;';pr.textContent=data.prose;bd.appendChild(pr);}
    block.appendChild(bd);
    addDL(wrap,pid,'knowledge-graph',[jsonBtn(data,'knowledge')]);
    return wrap;
  }

  /* ── Personal OS ── */
  function renderPersonalOS(content, mode) {
    var pid='sar_'+Date.now();
    var lbl={chat:'ARIA Response',goals:'Goal Architecture',habits:'Habit Design',reflect:'Reflection',plan:'Strategic Plan',memory:'Memory'}[mode]||'ARIA';
    var built=buildBlock('personalos','🧠 Personal OS',lbl,pid); var wrap=built.wrap,block=built.block;
    var bd=document.createElement('div');bd.style.cssText='padding:14px 16px;max-height:580px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;';bd.id=pid;
    var secs=parsePOSSections(content);
    var accentColor={chat:'#d97706,#fffbf5',goals:'#0d9488,#f0fdfa',habits:'#7c3aed,#f5f3ff',reflect:'#be185d,#fdf2f8',plan:'#4d7c0f,#f7fee7',memory:'#475569,#f8fafc'}[mode]||'#d97706,#fffbf5';
    var colors=accentColor.split(',');
    secs.forEach(function(sec) {
      if(!sec.title&&!sec.body)return;
      var secEl=document.createElement('div');secEl.className='sar-pos-section';
      if(sec.title){
        var hd=document.createElement('div');hd.className='sar-pos-sec-hd';
        hd.innerHTML='<div class="sar-pos-sec-icon" style="background:'+colors[1]+';color:'+colors[0]+'"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg></div><div class="sar-pos-sec-title">'+esc(sec.title)+'</div><svg class="sar-pos-chevron open" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>';
        var body=document.createElement('div');body.className='sar-pos-body';
        if(sec.body)body.appendChild(buildPOSBody(sec.body));
        hd.onclick=function(){body.classList.toggle('collapsed');hd.querySelector('.sar-pos-chevron').classList.toggle('open',!body.classList.contains('collapsed'));};
        secEl.appendChild(hd);secEl.appendChild(body);
      }else{var body2=document.createElement('div');body2.className='sar-pos-body';if(sec.body)body2.appendChild(buildPOSBody(sec.body));secEl.appendChild(body2);}
      bd.appendChild(secEl);
    });
    block.appendChild(bd);
    addDL(wrap,pid,'aria-'+mode);
    return wrap;
  }

  function parsePOSSections(content) {
    var lines=content.split('\n'),secs=[],curTitle=null,buf=[];
    lines.forEach(function(raw){
      var line=raw.trim();
      var isH=/^#{1,3}\s+.+/.test(line)||(/^[A-Z][A-Z\s&,\/\-]{4,50}:?\s*$/.test(line)&&line.length<80)||(/^\d+\.\s+[A-Z]/.test(line)&&line.length<60);
      if(isH&&line.length>3){if(curTitle!==null||buf.join('').trim())secs.push({title:curTitle||'',body:buf.join('\n').trim()});buf=[];curTitle=line.replace(/^#{1,3}\s+/,'').replace(/:$/,'').trim();}
      else buf.push(raw);
    });
    if(buf.join('').trim())secs.push({title:curTitle||'',body:buf.join('\n').trim()});
    return secs;
  }

  function buildPOSBody(text) {
    var div=document.createElement('div');
    var lines=text.split('\n').map(function(l){return l.trim();}).filter(Boolean);
    var bullets=lines.filter(function(l){return /^[-*•]\s/.test(l);});
    var numbered=lines.filter(function(l){return /^\d+\.\s/.test(l);});
    var kv=lines.filter(function(l){return /^[\w\s]{3,30}:\s+\S/.test(l)&&l.length<100;});
    if(numbered.length>=2){
      var sl=document.createElement('div');sl.className='sar-pos-step-list';
      numbered.forEach(function(line,i){var c=line.replace(/^\d+\.\s+/,''),ci=c.indexOf(':'),t='',b=c;if(ci>-1&&ci<45){t=c.slice(0,ci);b=c.slice(ci+1).trim();}var s=document.createElement('div');s.className='sar-pos-step';s.innerHTML='<div class="sar-pos-step-num">'+(i+1)+'</div><div class="sar-pos-step-content">'+(t?'<div class="sar-pos-step-title">'+esc(t)+'</div>':'')+esc(b)+'</div>';sl.appendChild(s);});
      div.appendChild(sl);
    }else if(bullets.length>=2){
      var bl=document.createElement('div');bl.className='sar-pos-list';
      bullets.forEach(function(line){var it=document.createElement('div');it.className='sar-pos-list-item';it.innerHTML='<span class="sar-pos-bullet"></span><span>'+esc(line.replace(/^[-*•]\s+/,''))+'</span>';bl.appendChild(it);});
      div.appendChild(bl);
    }else if(kv.length>=2&&kv.length===lines.length){
      var kvDiv=document.createElement('div');kvDiv.className='sar-pos-kv';
      kv.forEach(function(line){var ci=line.indexOf(':'),key=line.slice(0,ci).trim(),val=line.slice(ci+1).trim();kvDiv.innerHTML+='<div class="sar-pos-kv-key">'+esc(key)+'</div><div class="sar-pos-kv-val">'+esc(val)+'</div>';});
      div.appendChild(kvDiv);
    }else{
      text.split(/\n{2,}/).forEach(function(para){if(!para.trim())return;var lower=para.toLowerCase(),p;if(lower.includes('⚠️')||lower.includes('warning:')){p=document.createElement('div');p.className='sar-pos-callout warn';p.textContent=para.trim();}else if(lower.includes('💡')||lower.includes('tip:')){p=document.createElement('div');p.className='sar-pos-callout tip';p.textContent=para.trim();}else{p=document.createElement('div');p.style.cssText='font-size:13.5px;color:var(--tx);line-height:1.75;margin-bottom:6px;';p.textContent=para.trim();}div.appendChild(p);});
    }
    return div;
  }

  /* ── Generic text/structured renderers ── */
  function renderStructured(data, agentType) {
    var pid='sar_'+Date.now();
    var lbl={growth:'⚡ Growth',strategy:'📈 Strategy',legal:'⚖️ Legal',competitive:'🔍 Intel'}[agentType]||'Report';
    var built=buildBlock(agentType,lbl,data.title||lbl,pid); var wrap=built.wrap,block=built.block;
    var body=document.createElement('div');body.className='sar-body';body.id=pid;
    var secs=data.sections||[];
    if(!secs.length&&(data.signals||data.threats||data.opportunities||data.recommendations)){
      if(data.executive_summary)secs.push({label:'Executive Summary',content:data.executive_summary});
      if(data.signals&&data.signals.length)secs.push({label:'Signals ('+data.signals.length+')',signals:data.signals});
      if(data.threats&&data.threats.length)secs.push({label:'Threats ('+data.threats.length+')',threats:data.threats});
      if(data.opportunities&&data.opportunities.length)secs.push({label:'Opportunities',opportunities:data.opportunities});
      if(data.recommendations&&data.recommendations.length)secs.push({label:'Recommendations',recommendations:data.recommendations});
    }
    function makeAccordion2(sec){
      var secEl=document.createElement('div');secEl.className='sar-section';
      var hd=document.createElement('div');hd.className='sar-sec-hd';
      var colMap={growth:'#fffbf5,#b45309',strategy:'#fffbf5,#b45309',legal:'#f5f3ff,#6d28d9',competitive:'#f0f9ff,#0369a1'};
      var cp=(colMap[agentType]||'#f5f3ff,#7c3aed').split(',');
      hd.innerHTML='<div class="sar-sec-icon" style="background:'+cp[0]+';color:'+cp[1]+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="3"/></svg></div><div class="sar-sec-label">'+esc(sec.label||'Section')+'</div><svg class="sar-chevron open" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
      secEl.appendChild(hd);
      if(sec.content){var d=document.createElement('div');d.className='sar-sec-desc';d.textContent=sec.content;secEl.appendChild(d);}
      var bd=document.createElement('div');bd.className='sar-sec-body open';bd.appendChild(buildSecContent(sec));secEl.appendChild(bd);
      hd.onclick=function(){var o=bd.classList.toggle('open');hd.querySelector('.sar-chevron').classList.toggle('open',o);};
      return secEl;
    }
    secs.forEach(function(sec){body.appendChild(makeAccordion2(sec));});
    if(!secs.length){body.innerHTML='<div style="padding:16px;font-size:13px;color:var(--tx2)">No structured data returned.</div>';}
    block.appendChild(body);
    if(data.sources&&data.sources.length){var ss=document.createElement('div');ss.style.cssText='padding:8px 14px;border-top:1px solid var(--bdr-soft);background:var(--bg-sub);display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:10.5px;color:var(--tx3);';ss.innerHTML='<span style="font-weight:700;text-transform:uppercase;letter-spacing:.3px;margin-right:4px">Sources</span>';data.sources.slice(0,5).forEach(function(s){ss.innerHTML+='<span style="background:var(--bg);border:1px solid var(--bdr-soft);border-radius:7px;padding:2px 7px;">'+esc(s.title||s.url||s)+'</span>';});block.appendChild(ss);}
    addDL(wrap,pid,agentType,[jsonBtn(data,agentType)]);
    return wrap;
  }

  function renderText(content, agentType) {
    var pid='sar_'+Date.now();
    var lbl={strategy:'📈 Strategy',legal:'⚖️ Legal',growth:'⚡ Growth',competitive:'🔍 Intel',architect:'🏗 Architect',data:'📊 Data',concept:'💡 Concept',knowledge:'🕸 Knowledge'}[agentType]||'Report';
    var built=buildBlock(agentType,lbl,lbl,pid); var wrap=built.wrap,block=built.block;
    var bd=document.createElement('div');bd.style.cssText='padding:18px 20px;max-height:560px;overflow-y:auto;';bd.id=pid;
    parsePOSSections(content).forEach(function(sec){
      var s=document.createElement('div');s.className='sar-data-section';
      if(sec.title){var t=document.createElement('div');t.className='sar-data-sec-title';t.textContent=sec.title;s.appendChild(t);}
      if(sec.body){sec.body.split(/\n{2,}/).forEach(function(para){if(!para.trim())return;var lines=para.split('\n').map(function(l){return l.trim();}).filter(Boolean);var bullets=lines.filter(function(l){return /^[-*•]\s/.test(l);});if(bullets.length>=2){var ul=document.createElement('ul');ul.className='sar-data-ul';bullets.forEach(function(b){ul.innerHTML+='<li>'+esc(b.replace(/^[-*•]\s+/,''))+'</li>';});s.appendChild(ul);}else{var p=document.createElement('div');p.className='sar-data-para';p.textContent=para.trim();s.appendChild(p);}});}
      bd.appendChild(s);
    });
    block.appendChild(bd);
    addDL(wrap,pid,agentType);
    return wrap;
  }

  /* ── Sub-mode detectors ── */
  function dArch(t){var l=t.toLowerCase();if(/rag|vector db|vector database|retrieval/.test(l))return 'rag';if(/agent system|agentic|tool use|orchestration/.test(l))return 'agent';if(/cost|token|inference cost|per user cost/.test(l))return 'cost';if(/diagnose|metric drop|dau dropped|revenue fell/.test(l))return 'diagnose';if(/anomaly|root cause|investigation/.test(l))return 'anomaly';if(/forecast|scenario|projection/.test(l))return 'forecast';if(/csv|data analysis|analyse this data/.test(l))return 'csv';return 'architecture';}
  function dData(t){var l=t.toLowerCase();if(/cohort|retention curve/.test(l))return 'cohort';if(/conversion|funnel leak|cro/.test(l))return 'conversion';if(/anomaly|root cause/.test(l))return 'anomaly';if(/forecast|scenario/.test(l))return 'forecast';if(/csv|dataset/.test(l))return 'csv';return 'diagnose';}
  function dConcept(t){var l=t.toLowerCase();if(/compare|vs|versus|difference between/.test(l))return 'compare';if(/timeline|history|evolution/.test(l))return 'timeline';if(/concept map|mindmap|map out/.test(l))return 'map';if(/analogy/.test(l))return 'analogy';return 'auto';}
  function dPersonal(t){var l=t.toLowerCase();if(/goal|achieve|milestone/.test(l))return 'goals';if(/habit|routine|daily/.test(l))return 'habits';if(/decide|decision|reflect|should i/.test(l))return 'reflect';if(/plan|90 day|weekly plan|schedule/.test(l))return 'plan';if(/memory|pattern|what do you see|store this/.test(l))return 'memory';return 'chat';}
  function dKnowledge(t){var l=t.toLowerCase();if(/connect|relationship|how does .+ relate/.test(l))return 'connect';if(/explore|query|what do i know/.test(l))return 'explore';if(/gap|missing|what am i missing/.test(l))return 'gaps';if(/synthesize|pattern|insight/.test(l))return 'synthesize';return 'add';}
  function dGrowth(t){var l=t.toLowerCase();if(/competitor|competing/.test(l))return 'competitor';if(/viral|growth loop|k-factor/.test(l))return 'viral';if(/ad creative|paid acquisition|campaign/.test(l))return 'ads';if(/funnel|conversion rate|cro/.test(l))return 'funnel';return 'gtm';}
  function dLegal(t){var l=t.toLowerCase();if(/terms|tnc|terms of service/.test(l))return 'tnc';if(/privacy policy|gdpr|ccpa/.test(l))return 'privacy';if(/compliance checklist/.test(l))return 'compliance';return 'contract';}
  function dStrategy(t){var l=t.toLowerCase();if(/revenue|mrr|arr|financial projection/.test(l))return 'revenue';if(/market sizing|tam|sam|som/.test(l))return 'market';if(/pitch deck|investor pitch|raise/.test(l))return 'pitch';if(/swot|tows/.test(l))return 'swot';return 'business_model';}
  function dCompetitive(t){var l=t.toLowerCase();if(/threat|risk from competitor/.test(l))return 'threats';if(/opportunity|gap|white space/.test(l))return 'opportunities';if(/hiring trend|talent signal/.test(l))return 'hiring';if(/deep dive|deep analysis/.test(l))return 'deep';if(/weekly report|strategy report/.test(l))return 'report';return 'monitor';}

  /* ═══════════════════════════════════════
     PUBLIC INTERFACE
  ═══════════════════════════════════════ */
  return {

    detect: detect,
    injectStyles: injectStyles,

    handle: async function(text, history, container) {
      injectStyles();
      var agentType = detect(text);
      if (!agentType) return false;

      var data, renderEl;

      try {
        if (agentType === 'math' || agentType === 'research') {
          if (!window.StreminiResearch) throw new Error('research-renderer.js not loaded.');
          data = await window.StreminiResearch.call(text, agentType, history);
          renderEl = document.createElement('div');
          await window.StreminiResearch.renderResult(data, renderEl, agentType);
        }
        else if (agentType === 'architect') {
          data = await callBackend(BACKENDS.architect, { query:text, mode:dArch(text), history:(history||[]).slice(-10), iteration:0 });
          renderEl = (data.status==='REPORT'&&data.data) ? renderArchitect(data.data) : renderText(data.content||data.solution||'','architect');
        }
        else if (agentType === 'data') {
          data = await callBackend(BACKENDS.data, { query:text, mode:dData(text), history:(history||[]).slice(-10), iteration:0 });
          renderEl = (data.status==='REPORT'&&data.data) ? renderData(data.data) : renderText(data.content||data.solution||'','data');
        }
        else if (agentType === 'concept') {
          data = await callBackend(BACKENDS.concept, { concept:text, vizType:dConcept(text), history:(history||[]).slice(-10) });
          renderEl = (data.status==='OK') ? renderConcept(data, text) : renderText(data.content||'','concept');
        }
        else if (agentType === 'knowledge') {
          var km=dKnowledge(text);
          data = await callBackend(BACKENDS.knowledge, { query:text, mode:km, history:(history||[]).slice(-10), userKnowledge:[], response_format:'structured_json' });
          renderEl = data.graph ? renderKnowledge(data.graph, km) : renderText(data.content||'','knowledge');
        }
        else if (agentType === 'personalos') {
          var pm=dPersonal(text);
          data = await callBackend(BACKENDS.personalos, { query:text, mode:pm, history:(history||[]).slice(-14), memory:{goals:[],habits:[],decisions:[],insights:[]}, context:{} });
          renderEl = renderPersonalOS(data.content||data.solution||'', pm);
        }
        else if (agentType === 'growth') {
          data = await callBackend(BACKENDS.growth, { query:text, mode:dGrowth(text), history:(history||[]).slice(-10), iteration:0 });
          renderEl = (data.status==='REPORT'&&data.data) ? renderStructured(data.data,'growth') : renderText(data.content||'','growth');
        }
        else if (agentType === 'strategy') {
          data = await callBackend(BACKENDS.strategy, { mode:dStrategy(text), query:text, context:{}, responseFormat:'structured_actionable' });
          renderEl = renderText(data.content||data.solution||'','strategy');
        }
        else if (agentType === 'legal') {
          data = await callBackend(BACKENDS.legal, { mode:dLegal(text), query:text, documentText:'', jurisdiction:'India', entityType:'startup', responseFormat:'structured_actionable' });
          renderEl = renderText(data.content||data.solution||'','legal');
        }
        else if (agentType === 'competitive') {
          data = await callBackend(BACKENDS.competitive, { query:text, mode:dCompetitive(text), history:(history||[]).slice(-10), companies:[], response_format:'structured_json' });
          renderEl = data.report ? renderStructured(data.report,'competitive') : renderText(data.content||'','competitive');
        }
      } catch(err) {
        renderEl = document.createElement('div');
        renderEl.innerHTML = '<div style="padding:12px;color:#dc2626;font-size:13px;background:#fee2e2;border-radius:8px;border:1px solid #fecaca">Agent error: '+esc(err.message)+'</div>';
      }

      if (container && renderEl) {
        container.innerHTML = '';
        container.appendChild(renderEl);
      }
      return true;
    }
  };

})();
