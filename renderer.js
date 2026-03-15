/* ═══════════════════════════════════════════════════════════════
   STREMINI AI — BEAUTIFUL OUTPUT RENDERER v2.1
   Query-type aware, visually distinct rendering system
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. QUERY TYPE DETECTION
───────────────────────────────────────── */
const OUTPUT_TYPES = {
  CODE:'code', EXPLANATION:'explanation', STEPS:'steps', COMPARISON:'comparison',
  RESEARCH:'research', LIST:'list', MATH:'math', CREATIVE:'creative', CHAT:'chat',
};

function detectOutputType(userQuery, responseText) {
  const q = (userQuery||'').toLowerCase();
  const r = (responseText||'');
  if (/```[\w]*\n/.test(r) && (r.match(/```/g)||[]).length>=2) return OUTPUT_TYPES.CODE;
  if (/\b(write|build|implement|create a function|create a script|debug|fix this|refactor|code|python|javascript|typescript|react|node|rust|go|java|sql|bash|snippet)\b/.test(q)) return OUTPUT_TYPES.CODE;
  if (/\$\$[\s\S]+?\$\$/.test(r)||/\\\([\s\S]+?\\\)/.test(r)) return OUTPUT_TYPES.MATH;
  if (/\b(calculate|compute|solve|equation|formula|integral|derivative|probability|statistics)\b/.test(q)) return OUTPUT_TYPES.MATH;
  if (/\b(vs\.?|versus|compare|comparison|difference between|which is better|pros and cons)\b/i.test(q)) return OUTPUT_TYPES.COMPARISON;
  if ((r.match(/\|\s*[-:]+\s*\|/g)||[]).length>0) return OUTPUT_TYPES.COMPARISON;
  if (/\b(how to|how do i|guide me|walk me through|tutorial|setup|install|configure|deploy|step by step|steps to)\b/.test(q)) return OUTPUT_TYPES.STEPS;
  if (/\bstep\s+\d+/i.test(r)&&(r.match(/step\s+\d+/gi)||[]).length>=2) return OUTPUT_TYPES.STEPS;
  if (/^\d+\.\s+\*\*/m.test(r)&&(r.match(/^\d+\./gm)||[]).length>=3) return OUTPUT_TYPES.STEPS;
  if (/\b(list|give me|top \d+|best \d+|recommend|suggest|options for|alternatives|examples of|name \d+)\b/.test(q)) return OUTPUT_TYPES.LIST;
  if ((r.match(/^[-*•]\s/gm)||[]).length>=4&&r.length<1200) return OUTPUT_TYPES.LIST;
  if (/\b(what is|explain|describe|tell me about|overview of|history of|research|analyze|elaborate|break down)\b/.test(q)&&r.length>600) return OUTPUT_TYPES.RESEARCH;
  if ((r.match(/^#{2,3}\s/gm)||[]).length>=2) return OUTPUT_TYPES.RESEARCH;
  if (/\b(write a|compose|draft|story|poem|essay|blog post|email|letter|creative|caption)\b/.test(q)) return OUTPUT_TYPES.CREATIVE;
  if (r.length<500) return OUTPUT_TYPES.CHAT;
  return OUTPUT_TYPES.EXPLANATION;
}

/* ─────────────────────────────────────────
   2. SHARED UTILITIES
───────────────────────────────────────── */
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function inlineMd(s){
  s=esc(s);
  s=s.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>');
  s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/\*([^*\n]+?)\*/g,'<em>$1</em>');
  s=s.replace(/`([^`\n]+?)`/g,'<code class="si-ic">$1</code>');
  s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}
function copyToClipboard(text,btn){
  const ok=()=>{const o=btn.textContent;btn.classList.add('si-copied');btn.textContent='✓ Copied';setTimeout(()=>{btn.classList.remove('si-copied');btn.textContent=o;},2000);};
  if(navigator.clipboard)navigator.clipboard.writeText(text).then(ok).catch(()=>{fbCopy(text);ok();});
  else{fbCopy(text);ok();}
}
function fbCopy(t){const e=document.createElement('textarea');e.value=t;e.style.cssText='position:fixed;top:-9999px';document.body.appendChild(e);e.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(e);}

/* ─────────────────────────────────────────
   3. CSS
───────────────────────────────────────── */
function injectRendererStyles(){
  if(document.getElementById('si-renderer-styles'))return;
  const s=document.createElement('style');
  s.id='si-renderer-styles';
  s.textContent=`
.si-root{font-family:var(--font);color:var(--tx);line-height:1.7;}
.si-ic{font-family:var(--mono)!important;font-size:12.5px!important;background:var(--code-bg)!important;border:1px solid var(--bdr)!important;border-radius:4px!important;padding:2px 6px!important;color:#b5490d!important;}
.si-root a{color:var(--acc);text-decoration:underline;text-underline-offset:3px;}
.si-copied{background:#ecfdf5!important;color:#059669!important;border-color:#6ee7b7!important;}

/* BADGE */
.si-badge{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:14px;}
.si-badge-code{background:#1e293b;color:#7dd3fc;}
.si-badge-steps{background:#fef3c7;color:#92400e;}
.si-badge-research,.si-badge-explanation{background:#ede9fe;color:#6d28d9;}
.si-badge-comparison{background:#d1fae5;color:#065f46;}
.si-badge-list{background:#fce7f3;color:#9d174d;}
.si-badge-math{background:#e0f2fe;color:#0369a1;}
.si-badge-creative{background:#fef9c3;color:#713f12;}
.si-badge-chat{background:#f3f4f6;color:#374151;}

/* CODE */
.si-code-wrap{border-radius:12px;overflow:hidden;border:1px solid var(--bdr);box-shadow:0 4px 20px rgba(0,0,0,.07);margin:10px 0;}
.si-code-bar{display:flex;align-items:center;justify-content:space-between;padding:9px 16px;background:#0f172a;}
.si-code-lang{font-family:var(--mono);font-size:11px;color:#7dd3fc;font-weight:600;letter-spacing:.04em;text-transform:uppercase;display:flex;align-items:center;gap:6px;}
.si-code-lang::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#7dd3fc;opacity:.6;}
.si-code-copy{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#94a3b8;font-size:11px;font-family:var(--font);padding:4px 10px;border-radius:5px;cursor:pointer;transition:all .15s;}
.si-code-copy:hover{background:rgba(255,255,255,.16);color:#e2e8f0;}
.si-code-pre{margin:0;background:#0f172a;padding:16px 20px;overflow-x:auto;}
.si-code-pre code{font-family:var(--mono);font-size:13px;line-height:1.7;color:#e2e8f0;background:none;border:none;padding:0;display:block;}

/* COMPARISON — two-column cards */
.si-cmp-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0;}
@media(max-width:520px){.si-cmp-cards{grid-template-columns:1fr;}}
.si-cmp-card{border:1.5px solid var(--bdr);border-radius:12px;overflow:hidden;}
.si-cmp-card-hd{padding:10px 15px;font-size:14px;font-weight:700;letter-spacing:-.01em;}
.si-cmp-card-hd.A{background:#0f172a;color:#7dd3fc;}
.si-cmp-card-hd.B{background:#1c1007;color:#fcd34d;}
.si-cmp-card-body{padding:12px 15px;display:flex;flex-direction:column;gap:4px;}
.si-cmp-row-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--tx3);}
.si-cmp-row-val{font-size:13.5px;color:var(--tx);line-height:1.55;padding-bottom:8px;border-bottom:1px solid var(--bdr-soft);margin-bottom:4px;}
.si-cmp-row-val:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0;}

/* COMPARISON — row table (bullet fallback) */
.si-cmp-rows{border:1px solid var(--bdr);border-radius:12px;overflow:hidden;margin:8px 0;}
.si-cmp-item{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid var(--bdr-soft);}
.si-cmp-item:last-child{border-bottom:none;}
.si-cmp-item-key{padding:11px 14px;background:var(--bg-sub);font-size:11.5px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.04em;display:flex;align-items:center;border-right:1px solid var(--bdr-soft);}
.si-cmp-item-val{padding:11px 14px;font-size:13.5px;color:var(--tx);line-height:1.6;}

/* COMPARISON — markdown table */
.si-cmp-table{width:100%;border-collapse:separate;border-spacing:0;border-radius:12px;overflow:hidden;border:1px solid var(--bdr);box-shadow:0 2px 10px rgba(0,0,0,.05);margin:8px 0;}
.si-cmp-table th{background:var(--tx);color:#fff;padding:10px 14px;font-size:13px;font-weight:600;text-align:left;}
.si-cmp-table th:first-child{background:#2d2a26;}
.si-cmp-table td{padding:9px 14px;border-bottom:1px solid var(--bdr-soft);font-size:13.5px;vertical-align:top;}
.si-cmp-table tr:last-child td{border-bottom:none;}
.si-cmp-table tr:nth-child(even) td{background:var(--bg-sub);}
.si-cmp-table td:first-child{font-weight:600;color:var(--tx2);font-size:12.5px;background:var(--bg-sub)!important;}

/* VERDICT */
.si-verdict{background:var(--acc-bg);border:1.5px solid var(--acc-bdr);border-radius:11px;padding:13px 16px;margin-top:12px;font-size:13.5px;line-height:1.65;color:var(--tx);display:flex;align-items:flex-start;gap:10px;}
.si-verdict-icon{font-size:16px;flex-shrink:0;margin-top:1px;}
.si-verdict strong{color:var(--acc);font-weight:700;display:block;margin-bottom:3px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;}

/* STEPS */
.si-steps-list{display:flex;flex-direction:column;gap:10px;margin:6px 0;}
.si-step{display:flex;gap:14px;align-items:flex-start;background:var(--bg-sub);border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;transition:box-shadow .2s,border-color .2s;animation:siStepIn .3s ease both;}
.si-step:hover{box-shadow:0 4px 16px rgba(0,0,0,.06);border-color:#d5cfc7;}
@keyframes siStepIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
.si-step:nth-child(1){animation-delay:.03s}.si-step:nth-child(2){animation-delay:.07s}.si-step:nth-child(3){animation-delay:.11s}
.si-step:nth-child(4){animation-delay:.15s}.si-step:nth-child(5){animation-delay:.19s}.si-step:nth-child(6){animation-delay:.23s}
.si-step-num{width:28px;height:28px;border-radius:8px;flex-shrink:0;background:var(--tx);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px;}
.si-step-body{flex:1;min-width:0;}
.si-step-title{font-size:14px;font-weight:600;color:var(--tx);margin-bottom:3px;line-height:1.35;}
.si-step-desc{font-size:13.5px;color:var(--tx2);line-height:1.65;}

/* RESEARCH */
.si-research{display:flex;flex-direction:column;gap:0;}
.si-research-section{padding:12px 0;border-bottom:1px solid var(--bdr-soft);}
.si-research-section:last-child{border-bottom:none;}
.si-section-head{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;color:var(--tx);margin-bottom:9px;letter-spacing:-.01em;}
.si-section-head::before{content:'';width:3px;height:17px;background:var(--acc);border-radius:2px;flex-shrink:0;}
.si-section-body{font-size:14px;color:var(--tx);line-height:1.78;}

/* LIST */
.si-list{display:flex;flex-direction:column;gap:7px;margin:6px 0;}
.si-list-item{display:flex;gap:12px;align-items:flex-start;padding:11px 14px;border:1px solid var(--bdr);border-radius:11px;background:var(--bg);transition:background .15s,box-shadow .15s,border-color .15s;animation:siListIn .25s ease both;}
.si-list-item:hover{background:var(--bg-sub);box-shadow:0 2px 10px rgba(0,0,0,.05);border-color:#d5cfc7;}
@keyframes siListIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.si-list-item:nth-child(1){animation-delay:.02s}.si-list-item:nth-child(2){animation-delay:.05s}.si-list-item:nth-child(3){animation-delay:.08s}
.si-list-item:nth-child(4){animation-delay:.11s}.si-list-item:nth-child(5){animation-delay:.14s}.si-list-item:nth-child(6){animation-delay:.17s}
.si-list-item:nth-child(7){animation-delay:.20s}.si-list-item:nth-child(8){animation-delay:.23s}
.si-list-num{width:24px;height:24px;border-radius:6px;flex-shrink:0;margin-top:1px;background:var(--acc-bg);color:var(--acc);font-size:11.5px;font-weight:700;border:1px solid var(--acc-bdr);display:flex;align-items:center;justify-content:center;}
.si-list-bullet{width:24px;height:24px;border-radius:6px;flex-shrink:0;margin-top:1px;background:var(--bg-sub);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--tx3);}
.si-list-content{flex:1;min-width:0;}
.si-list-title{font-size:14px;font-weight:600;color:var(--tx);line-height:1.4;margin-bottom:2px;}
.si-list-sub{font-size:13px;color:var(--tx2);line-height:1.6;}

/* MATH */
.si-math-wrap{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:12px;padding:14px 18px;margin:8px 0;}
.si-math-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#0284c7;margin-bottom:6px;}
.si-math-formula{font-family:var(--mono);font-size:15px;color:#0369a1;font-weight:500;}

/* CREATIVE */
.si-creative{border-left:3px solid var(--acc);padding:2px 0 2px 20px;margin:6px 0;}
.si-creative p{font-family:var(--serif,Georgia,serif);font-size:16px;line-height:1.9;margin:0 0 14px;color:var(--tx);}
.si-creative p:last-child{margin-bottom:0;}

/* PROSE */
.si-prose p{font-size:14px;line-height:1.78;margin:0 0 8px;color:var(--tx);}
.si-prose p:last-child{margin-bottom:0;}
.si-prose ul,.si-prose ol{padding-left:20px;margin:6px 0 10px;}
.si-prose li{font-size:13.5px;margin-bottom:5px;line-height:1.65;color:var(--tx);}
.si-prose h3,.si-prose h4{font-size:14px;font-weight:700;color:var(--tx);margin:12px 0 5px;letter-spacing:-.01em;}
.si-hr{border:none;border-top:1px solid var(--bdr-soft);margin:12px 0;}

/* CHAT */
.si-chat{font-size:14.5px;line-height:1.78;color:var(--tx);}
.si-chat p{margin:0 0 9px;}
.si-chat p:last-child{margin-bottom:0;}
.si-chat ul,.si-chat ol{padding-left:20px;margin:6px 0 10px;}
.si-chat li{margin-bottom:5px;line-height:1.65;}
`;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────
   4. PARSERS
───────────────────────────────────────── */
function parseBlocks(text){
  const segments=[];let lastIndex=0;
  const re=/```([\w-]*)\n?([\s\S]*?)```/g;let m;
  while((m=re.exec(text))!==null){
    if(m.index>lastIndex)segments.push({type:'prose',content:text.slice(lastIndex,m.index)});
    segments.push({type:'code',lang:m[1]||'plaintext',content:m[2].trim()});
    lastIndex=re.lastIndex;
  }
  if(lastIndex<text.length)segments.push({type:'prose',content:text.slice(lastIndex)});
  return segments;
}

function parseBulletComparison(text){
  const lines=text.split('\n').map(l=>l.trim()).filter(l=>/^[-*•]\s/.test(l));
  if(lines.length<3)return null;
  const raw0=lines[0].replace(/^[-*•]\s+/,'');
  const raw1=lines[1].replace(/^[-*•]\s+/,'');
  const e0=raw0.match(/^([^:–—]{1,30})[:\s–—]+(.+)$/);
  const e1=raw1.match(/^([^:–—]{1,30})[:\s–—]+(.+)$/);
  if(!e0||!e1)return null;
  const entityA=e0[1].trim(), entityB=e1[1].trim();
  const rows=[];
  rows.push({label:'Definition',valA:e0[2].trim(),valB:e1[2].trim()});
  for(let i=2;i<lines.length;i++){
    const raw=lines[i].replace(/^[-*•]\s+/,'');
    const lm=raw.match(/^([^:–—]{1,40})[:\s–—]+(.+)$/);
    if(!lm)continue;
    const label=lm[1].trim(), rest=lm[2].trim();
    const pats=[
      new RegExp(`${entityA}[:\\s–—]+(.+?)[;,]\\s*${entityB}[:\\s–—]+(.+)`,'i'),
      /^(.+?);\s+(.+)$/,
      /^(.+?)\s+vs\.?\s+(.+)$/i,
    ];
    let valA='',valB='';
    for(const p of pats){const m=rest.match(p);if(m){valA=m[1].trim();valB=m[2].trim();break;}}
    rows.push({label,valA:valA||rest,valB});
  }
  return{entityA,entityB,rows};
}

function parseResearchSections(text){
  const sections=[];const re=/^(#{2,3})\s+(.+)$/gm;const headings=[];let m;
  while((m=re.exec(text))!==null)headings.push({index:m.index,end:re.lastIndex,title:m[2].trim()});
  if(!headings.length){sections.push({title:null,body:text.trim()});return sections;}
  if(headings[0].index>0){const pre=text.slice(0,headings[0].index).trim();if(pre)sections.push({title:null,body:pre});}
  headings.forEach((h,i)=>{
    const bodyEnd=i+1<headings.length?headings[i+1].index:text.length;
    sections.push({title:h.title,body:text.slice(h.end,bodyEnd).trim()});
  });
  return sections;
}

function parseListItems(text){
  const items=[];const lines=text.split('\n');let i=0;
  while(i<lines.length){
    const l=lines[i].trim();
    const nm=l.match(/^(\d+)[.)]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|(.+))$/);
    if(nm){
      const title=(nm[2]||nm[4]||'').trim();let sub=(nm[3]||'').trim();i++;
      while(i<lines.length&&/^\s{2,}/.test(lines[i])&&!/^\d+[.)]\s/.test(lines[i].trim())){sub+=(sub?' ':'')+lines[i].trim().replace(/^[-–]\s*/,'');i++;}
      if(title)items.push({num:nm[1],title,sub,ordered:true});continue;
    }
    const bm=l.match(/^[-*•]\s+(?:\*\*([^*]+)\*\*[:\s\-–]+(.+)|([^:]+):\s+(.+)|(.+))$/);
    if(bm){
      const title=(bm[1]||bm[3]||bm[5]||'').trim();const sub=(bm[2]||bm[4]||'').trim();i++;
      if(title)items.push({title,sub,ordered:false});continue;
    }
    i++;
  }
  return items;
}

function parseMarkdownTable(text){
  const lines=text.split('\n').filter(l=>l.trim().includes('|'));
  if(lines.length<3)return null;
  const parseRow=l=>l.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
  const headers=parseRow(lines[0]);
  const rows=lines.slice(2).filter(l=>!/^[\s|:-]+$/.test(l)).map(parseRow);
  if(!headers.length||!rows.length)return null;
  return{headers,rows};
}

/* ─────────────────────────────────────────
   5. BLOCK BUILDERS
───────────────────────────────────────── */
function buildCodeBlock(lang,code){
  const wrap=document.createElement('div');wrap.className='si-code-wrap';
  const bar=document.createElement('div');bar.className='si-code-bar';
  const langEl=document.createElement('span');langEl.className='si-code-lang';langEl.textContent=lang||'code';
  const copyBtn=document.createElement('button');copyBtn.className='si-code-copy';copyBtn.textContent='Copy';
  copyBtn.onclick=()=>copyToClipboard(code,copyBtn);
  bar.appendChild(langEl);bar.appendChild(copyBtn);
  const pre=document.createElement('pre');pre.className='si-code-pre';
  const codeEl=document.createElement('code');
  if(lang&&lang!=='plaintext')codeEl.className=`language-${lang}`;
  codeEl.textContent=code;
  try{if(window.hljs)window.hljs.highlightElement(codeEl);}catch(e){}
  pre.appendChild(codeEl);wrap.appendChild(bar);wrap.appendChild(pre);
  return wrap;
}

function buildBadge(type){
  const labels={code:'⌨ Code',steps:'◎ Step-by-Step',research:'◈ Deep Dive',comparison:'⇄ Comparison',list:'◉ List',math:'∑ Math',creative:'✦ Creative',chat:'◇ Response',explanation:'◈ Explanation'};
  const badge=document.createElement('div');
  badge.className=`si-badge si-badge-${type}`;
  badge.textContent=labels[type]||'◇ Response';
  return badge;
}

function buildProseInner(text){
  const div=document.createElement('div');div.className='si-prose';
  const lines=text.split('\n');let i=0,currentList=null,listTag='';
  const flush=()=>{currentList=null;listTag='';};
  const append=el=>{flush();div.appendChild(el);};
  while(i<lines.length){
    const l=lines[i].trim();i++;
    if(!l){flush();continue;}
    if(/^---+$/.test(l)){const hr=document.createElement('hr');hr.className='si-hr';append(hr);continue;}
    const hm=l.match(/^(#{1,4})\s+(.+)$/);
    if(hm){const tag=['h3','h3','h4','h4'][hm[1].length-1]||'h4';const h=document.createElement(tag);h.innerHTML=inlineMd(hm[2]);append(h);continue;}
    if(/^[-*•]\s/.test(l)){
      if(listTag!=='UL'){flush();currentList=document.createElement('ul');listTag='UL';div.appendChild(currentList);}
      const li=document.createElement('li');li.innerHTML=inlineMd(l.replace(/^[-*•]\s+/,''));currentList.appendChild(li);continue;
    }
    if(/^\d+[.)]\s/.test(l)){
      if(listTag!=='OL'){flush();currentList=document.createElement('ol');listTag='OL';div.appendChild(currentList);}
      const li=document.createElement('li');li.innerHTML=inlineMd(l.replace(/^\d+[.)]\s+/,''));currentList.appendChild(li);continue;
    }
    flush();
    const paraLines=[l];
    while(i<lines.length){const nt=lines[i].trim();if(!nt||/^(#{1,4}\s|[-*•]\s|\d+[.)]\s|---+$)/.test(nt))break;paraLines.push(nt);i++;}
    const p=document.createElement('p');p.innerHTML=inlineMd(paraLines.join(' '));div.appendChild(p);
  }
  return div;
}

/* ─────────────────────────────────────────
   6. TYPE-SPECIFIC BUILDERS
───────────────────────────────────────── */
function buildCodeOutput(text){
  const root=document.createElement('div');root.className='si-root';root.appendChild(buildBadge('code'));
  parseBlocks(text).forEach(s=>{
    if(s.type==='code')root.appendChild(buildCodeBlock(s.lang,s.content));
    else if(s.content.trim())root.appendChild(buildProseInner(s.content.trim()));
  });
  return root;
}

function buildComparisonOutput(text){
  const root=document.createElement('div');root.className='si-root';root.appendChild(buildBadge('comparison'));

  // 1. Markdown table
  if(text.includes('|')&&text.match(/\|\s*[-:]+\s*\|/)){
    const tbl=parseMarkdownTable(text);
    if(tbl){
      const tableIdx=text.indexOf('|');
      const pre=text.slice(0,tableIdx).trim();
      if(pre)root.appendChild(buildProseInner(pre));
      const table=document.createElement('table');table.className='si-cmp-table';
      const thead=document.createElement('thead');const hr=document.createElement('tr');
      tbl.headers.forEach(h=>{const th=document.createElement('th');th.innerHTML=inlineMd(h);hr.appendChild(th);});
      thead.appendChild(hr);table.appendChild(thead);
      const tbody=document.createElement('tbody');
      tbl.rows.forEach(row=>{
        const tr=document.createElement('tr');
        tbl.headers.forEach((_,ci)=>{const td=document.createElement('td');td.innerHTML=inlineMd(row[ci]||'');tr.appendChild(td);});
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);root.appendChild(table);
      const lastPipe=text.lastIndexOf('|');const post=text.slice(lastPipe+1).trim();
      if(post)root.appendChild(buildVerdictOrProse(post));
      return root;
    }
  }

  // 2. Bullet-based comparison — the COMMON case
  const bc=parseBulletComparison(text);
  if(bc&&bc.rows.length>=2){
    const cards=document.createElement('div');cards.className='si-cmp-cards';
    const cardA=document.createElement('div');cardA.className='si-cmp-card';
    const hdA=document.createElement('div');hdA.className='si-cmp-card-hd A';hdA.textContent=bc.entityA;
    const bodyA=document.createElement('div');bodyA.className='si-cmp-card-body';
    const cardB=document.createElement('div');cardB.className='si-cmp-card';
    const hdB=document.createElement('div');hdB.className='si-cmp-card-hd B';hdB.textContent=bc.entityB;
    const bodyB=document.createElement('div');bodyB.className='si-cmp-card-body';

    bc.rows.forEach(row=>{
      // Add to card A
      if(row.valA){
        const lbl=document.createElement('div');lbl.className='si-cmp-row-lbl';lbl.textContent=row.label;
        const v=document.createElement('div');v.className='si-cmp-row-val';v.innerHTML=inlineMd(row.valA);
        bodyA.appendChild(lbl);bodyA.appendChild(v);
      }
      // Add to card B
      if(row.valB){
        const lbl=document.createElement('div');lbl.className='si-cmp-row-lbl';lbl.textContent=row.label;
        const v=document.createElement('div');v.className='si-cmp-row-val';v.innerHTML=inlineMd(row.valB);
        bodyB.appendChild(lbl);bodyB.appendChild(v);
      }
    });

    cardA.appendChild(hdA);cardA.appendChild(bodyA);
    cardB.appendChild(hdB);cardB.appendChild(bodyB);
    cards.appendChild(cardA);cards.appendChild(cardB);
    root.appendChild(cards);

    // Relationship row (usually the last bullet)
    const rel=bc.rows.find(r=>/relationship|summary|conclusion|in short/i.test(r.label));
    if(rel){
      const verdict=document.createElement('div');verdict.className='si-verdict';
      verdict.innerHTML=`<span class="si-verdict-icon">🔗</span><div><strong>Relationship</strong>${inlineMd((rel.valA+(rel.valB?'; '+rel.valB:'')))}</div>`;
      root.appendChild(verdict);
    }
    return root;
  }

  // 3. Fallback: key-value rows from bullets
  const items=parseListItems(text);
  if(items.length>=3){
    const rowsEl=document.createElement('div');rowsEl.className='si-cmp-rows';
    items.forEach(item=>{
      const el=document.createElement('div');el.className='si-cmp-item';
      const key=document.createElement('div');key.className='si-cmp-item-key';key.innerHTML=inlineMd(item.title);
      const val=document.createElement('div');val.className='si-cmp-item-val';val.innerHTML=inlineMd(item.sub||item.title);
      el.appendChild(key);el.appendChild(val);rowsEl.appendChild(el);
    });
    root.appendChild(rowsEl);
    return root;
  }

  root.appendChild(buildProseInner(text));
  return root;
}

function buildVerdictOrProse(text){
  if(/\b(conclusion|verdict|summary|recommend|bottom line|winner|in short|relationship)\b/i.test(text)){
    const v=document.createElement('div');v.className='si-verdict';
    v.innerHTML=`<span class="si-verdict-icon">💡</span><div><strong>Verdict</strong>${inlineMd(text.replace(/^#{1,4}\s+[^\n]+\n?/gm,'').trim())}</div>`;
    return v;
  }
  return buildProseInner(text);
}

function buildStepsOutput(text){
  const root=document.createElement('div');root.className='si-root';root.appendChild(buildBadge('steps'));
  const introMatch=text.match(/^([\s\S]*?)(?=step\s*1|\n1[\.)]\s)/i);
  if(introMatch&&introMatch[1].trim())root.appendChild(buildProseInner(introMatch[1].trim()));
  const steps=[];let m;
  const re1=/step\s+(\d+)\s*[—–:.\-]+\s*([^\n]+)([\s\S]*?)(?=step\s+\d+|$)/gi;
  while((m=re1.exec(text))!==null)steps.push({num:m[1],title:m[2].trim(),body:m[3].trim()});
  if(steps.length<2){
    const re2=/^(\d+)[.)]\s+(?:\*\*([^*\n]+)\*\*|([^\n]+))([\s\S]*?)(?=^\d+[.)]\s|$)/gm;
    while((m=re2.exec(text))!==null){const title=(m[2]||m[3]||'').trim();const body=(m[4]||'').replace(/^\n+/,'').trim();if(title)steps.push({num:m[1],title,body});}
  }
  if(steps.length>=2){
    const list=document.createElement('div');list.className='si-steps-list';
    steps.forEach(step=>{
      const item=document.createElement('div');item.className='si-step';
      const num=document.createElement('div');num.className='si-step-num';num.textContent=step.num;
      const body=document.createElement('div');body.className='si-step-body';
      const title=document.createElement('div');title.className='si-step-title';title.innerHTML=inlineMd(step.title);
      body.appendChild(title);
      if(step.body){
        if(/```/.test(step.body)){
          parseBlocks(step.body).forEach(s=>{
            if(s.type==='code')body.appendChild(buildCodeBlock(s.lang,s.content));
            else if(s.content.trim()){const d=document.createElement('div');d.className='si-step-desc';d.innerHTML=inlineMd(s.content.trim());body.appendChild(d);}
          });
        }else{const desc=document.createElement('div');desc.className='si-step-desc';desc.innerHTML=inlineMd(step.body.replace(/\n/g,' '));body.appendChild(desc);}
      }
      item.appendChild(num);item.appendChild(body);list.appendChild(item);
    });
    root.appendChild(list);
  }else{
    parseBlocks(text).forEach(s=>{
      if(s.type==='code')root.appendChild(buildCodeBlock(s.lang,s.content));
      else if(s.content.trim())root.appendChild(buildProseInner(s.content.trim()));
    });
  }
  return root;
}

function buildResearchOutput(text){
  const root=document.createElement('div');root.className='si-root';root.appendChild(buildBadge('research'));
  const sections=parseResearchSections(text);
  const container=document.createElement('div');container.className='si-research';
  sections.forEach(sec=>{
    const div=document.createElement('div');div.className='si-research-section';
    if(sec.title){const h=document.createElement('div');h.className='si-section-head';h.innerHTML=inlineMd(sec.title);div.appendChild(h);}
    const bd=document.createElement('div');bd.className='si-section-body';
    parseBlocks(sec.body).forEach(s=>{
      if(s.type==='code')bd.appendChild(buildCodeBlock(s.lang,s.content));
      else if(s.content.trim())bd.appendChild(buildProseInner(s.content.trim()));
    });
    div.appendChild(bd);container.appendChild(div);
  });
  root.appendChild(container);return root;
}

function buildListOutput(text){
  const root=document.createElement('div');root.className='si-root';root.appendChild(buildBadge('list'));
  const firstItem=text.search(/^(\d+[.)]\s|[-*•]\s)/m);
  if(firstItem>0){const intro=text.slice(0,firstItem).trim();if(intro)root.appendChild(buildProseInner(intro));}
  const items=parseListItems(text);
  if(items.length>=2){
    const list=document.createElement('div');list.className='si-list';
    items.forEach((item,idx)=>{
      const el=document.createElement('div');el.className='si-list-item';el.style.animationDelay=`${idx*0.04}s`;
      const bullet=document.createElement('div');
      if(item.ordered){bullet.className='si-list-num';bullet.textContent=item.num||String(idx+1);}
      else{bullet.className='si-list-bullet';bullet.textContent='◆';}
      const content=document.createElement('div');content.className='si-list-content';
      if(item.title){const t=document.createElement('div');t.className='si-list-title';t.innerHTML=inlineMd(item.title);content.appendChild(t);}
      if(item.sub){const s=document.createElement('div');s.className='si-list-sub';s.innerHTML=inlineMd(item.sub);content.appendChild(s);}
      el.appendChild(bullet);el.appendChild(content);list.appendChild(el);
    });
    root.appendChild(list);
  }else{root.appendChild(buildProseInner(text));}
  return root;
}

function buildMathOutput(text){
  const root=document.createElement('div');root.className='si-root';root.appendChild(buildBadge('math'));
  const re=/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;let lastIndex=0,m;
  while((m=re.exec(text))!==null){
    if(m.index>lastIndex){const t=text.slice(lastIndex,m.index).trim();if(t)root.appendChild(buildProseInner(t));}
    const box=document.createElement('div');box.className='si-math-wrap';
    const lbl=document.createElement('div');lbl.className='si-math-label';lbl.textContent='Formula';
    const f=document.createElement('div');f.className='si-math-formula';f.textContent=(m[1]||m[2]).trim();
    box.appendChild(lbl);box.appendChild(f);root.appendChild(box);lastIndex=re.lastIndex;
  }
  if(lastIndex<text.length){const t=text.slice(lastIndex).trim();if(t)root.appendChild(buildProseInner(t));}
  return root;
}

function buildCreativeOutput(text){
  const root=document.createElement('div');root.className='si-root';root.appendChild(buildBadge('creative'));
  const div=document.createElement('div');div.className='si-creative';
  text.split(/\n\n+/).forEach(para=>{const p=document.createElement('p');p.innerHTML=inlineMd(para.trim().replace(/\n/g,'<br>'));div.appendChild(p);});
  root.appendChild(div);return root;
}

function buildChatOutput(text){
  const root=document.createElement('div');root.className='si-root';
  const div=document.createElement('div');div.className='si-chat';
  parseBlocks(text).forEach(s=>{
    if(s.type==='code'){root.appendChild(div.cloneNode(true)||div);root.appendChild(buildCodeBlock(s.lang,s.content));}
    else if(s.content.trim()){const p=buildProseInner(s.content.trim());p.className='si-chat';div.appendChild(p);}
  });
  if(!div.parentNode)root.appendChild(div);
  return root;
}

/* ─────────────────────────────────────────
   7. STREAMING
───────────────────────────────────────── */
function updateStreamSmart(partialText,container){
  if(!container)return;
  injectRendererStyles();
  const div=document.createElement('div');div.className='si-root si-chat';
  div.innerHTML=inlineMd(partialText.replace(/\n/g,'<br>'));
  container.innerHTML='';container.appendChild(div);
}
function finalizeStreamSmart(userQuery,fullText,container){
  if(!container)return;
  renderSmartOutput(userQuery,fullText,container,false);
}

/* ─────────────────────────────────────────
   8. MAIN ENTRY
───────────────────────────────────────── */
function renderSmartOutput(userQuery,responseText,container,isStreaming){
  injectRendererStyles();
  const type=isStreaming?OUTPUT_TYPES.CHAT:detectOutputType(userQuery,responseText);
  let el;
  switch(type){
    case OUTPUT_TYPES.CODE:       el=buildCodeOutput(responseText);       break;
    case OUTPUT_TYPES.STEPS:      el=buildStepsOutput(responseText);      break;
    case OUTPUT_TYPES.RESEARCH:   el=buildResearchOutput(responseText);   break;
    case OUTPUT_TYPES.COMPARISON: el=buildComparisonOutput(responseText); break;
    case OUTPUT_TYPES.LIST:       el=buildListOutput(responseText);       break;
    case OUTPUT_TYPES.MATH:       el=buildMathOutput(responseText);       break;
    case OUTPUT_TYPES.CREATIVE:   el=buildCreativeOutput(responseText);   break;
    case OUTPUT_TYPES.EXPLANATION:el=buildResearchOutput(responseText);   break;
    default:                      el=buildChatOutput(responseText);       break;
  }
  if(container){container.innerHTML='';container.appendChild(el);}
  return el;
}

window.StreminiRenderer={
  render:        renderSmartOutput,
  updateStream:  updateStreamSmart,
  finalizeStream:finalizeStreamSmart,
  detectType:    detectOutputType,
  injectStyles:  injectRendererStyles,
};
