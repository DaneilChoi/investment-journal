/* v1.85 — connect selection, themes, market context, trades and review. */
(() => {
  const VERSION='1.85';
  data.version=VERSION;
  data.weeklyNotes=data.weeklyNotes||{};
  data.settings=data.settings||{};
  const ko=()=>lang==='ko';
  const txt=(kr,en)=>ko()?kr:en;
  const safe=value=>escapeHtml(String(value??''));
  const wk=(anchor=parseKey(selectedDate))=>weekRange(anchor);
  const noteFor=(r=wk())=>data.weeklyNotes[r.start]||(data.weeklyNotes[r.start]={watchlist:'',plan:'',signals:[],newsMemo:'',selectionMemo:'',shareStockNames:true});
  const signalDefs=[['theme','상승 테마','Rising theme'],['volume','거래량','Volume'],['value','거래대금','Turnover'],['daily','일봉 흐름','Daily chart'],['pullback','눌림 구간','Pullback'],['news','뉴스 방향','News direction']];

  Object.assign(I18N.ko,{selectionCriteria185:'이번 주 확인 기준',selectionCriteriaHelp185:'글 대신 눌러서 남길 수 있습니다.',newsMemo185:'테마·뉴스 조사 메모',newsMemoPlaceholder185:'예: 정책 발표 전후로 수소 테마 거래대금이 유지되는지 확인',selectionMemo185:'종목 선정 메모',selectionMemoPlaceholder185:'예: 거래대금 상위이면서 일봉 20일선 위의 눌림 종목',shareStockNames185:'내 ChatGPT 복기에서 종목명·테마·날짜를 함께 비교',selectionContext185:'종목 선정과 시장 맥락',recordContext185:'기록에서 연결',themeContext185:'테마 흐름',stockContext185:'실제 거래 종목',planContext185:'선정 계획',newsContext185:'뉴스 비교',chatgptContext185:'내 ChatGPT 종목·뉴스 해석',noContext185:'아직 연결할 테마나 선정 기록이 없습니다.',selectionFlow185:'종목 선택 흐름',themeRecorded185:'테마를 기록한 날',watchlistMatch185:'관심 종목 거래 일치',stockBreadth185:'거래 종목 수',editAi185:'결과 수정',deleteAi185:'결과 삭제',deleteAiConfirm185:'이 주의 ChatGPT 복기 결과를 삭제할까요?',aiDeleted185:'ChatGPT 복기 결과를 삭제했습니다.',personalBackground185:'개인 배경 사진',chooseBackground185:'사진 선택',removeBackground185:'배경 삭제',backgroundHelp185:'사진은 이 기기에만 저장되고 아주 옅게 표시됩니다.',backgroundSaved185:'개인 배경 사진을 적용했습니다.',backgroundRemoved185:'개인 배경 사진을 삭제했습니다.',backgroundTooLarge185:'사진을 저장할 공간이 부족합니다. 더 작은 사진을 선택해 주세요.',v185Summary:'주간 종목 선정 기준·테마·뉴스 맥락을 거래와 연결하고, 복기·통계·개인 ChatGPT 자료에 함께 반영했습니다.'});
  Object.assign(I18N.en,{selectionCriteria185:'Checks for this week',selectionCriteriaHelp185:'Tap instead of writing.',newsMemo185:'Theme and news research',newsMemoPlaceholder185:'e.g. Check whether hydrogen-theme turnover holds around the policy announcement',selectionMemo185:'Selection note',selectionMemoPlaceholder185:'e.g. High-turnover pullbacks above the 20-day average',shareStockNames185:'Compare tickers, themes and dates in my ChatGPT review',selectionContext185:'Selection and market context',recordContext185:'Linked from records',themeContext185:'Theme flow',stockContext185:'Traded securities',planContext185:'Selection plan',newsContext185:'News comparison',chatgptContext185:'My ChatGPT selection/news view',noContext185:'No theme or selection context is available yet.',selectionFlow185:'Selection flow',themeRecorded185:'Days with themes',watchlistMatch185:'Watchlist match',stockBreadth185:'Securities traded',editAi185:'Edit result',deleteAi185:'Delete result',deleteAiConfirm185:'Delete this week’s ChatGPT review?',aiDeleted185:'Deleted the ChatGPT review.',personalBackground185:'Personal background',chooseBackground185:'Choose photo',removeBackground185:'Remove',backgroundHelp185:'Stored only on this device and shown very lightly.',backgroundSaved185:'Applied the personal background.',backgroundRemoved185:'Removed the personal background.',backgroundTooLarge185:'Not enough device storage. Choose a smaller image.',v185Summary:'Connects weekly selection criteria, themes and news context with trades, review, statistics and the personal ChatGPT package.'});

  function extendWeeklyReport(){
    const box=document.getElementById('weeklyNote184');if(!box)return;
    let extra=document.getElementById('weeklySelection185');
    if(!extra){
      extra=document.createElement('div');extra.id='weeklySelection185';extra.className='selection-signals185';
      extra.innerHTML=`<div><b data-i18n="selectionCriteria185">이번 주 확인 기준</b><small data-i18n="selectionCriteriaHelp185">글 대신 눌러서 남길 수 있습니다.</small></div><div class="signal-chips185">${signalDefs.map(([id,kr])=>`<button type="button" class="signal-chip185" data-signal="${id}">${kr}</button>`).join('')}</div><div class="weekly-context185"><label><span data-i18n="selectionMemo185">종목 선정 메모</span><textarea id="selectionMemo185" maxlength="360" data-placeholder="selectionMemoPlaceholder185"></textarea></label><label><span data-i18n="newsMemo185">테마·뉴스 조사 메모</span><textarea id="newsMemo185" maxlength="360" data-placeholder="newsMemoPlaceholder185"></textarea></label><label class="share-context185"><input id="shareStockNames185" type="checkbox"><span data-i18n="shareStockNames185">내 ChatGPT 복기에서 종목명·테마·날짜를 함께 비교</span></label></div>`;
      box.appendChild(extra);
      extra.querySelectorAll('[data-signal]').forEach(button=>button.onclick=()=>{const note=noteFor(),set=new Set(note.signals||[]),id=button.dataset.signal;set.has(id)?set.delete(id):set.add(id);note.signals=[...set];saveData();renderWeeklySelection()});
      ['selectionMemo185','newsMemo185'].forEach(id=>extra.querySelector('#'+id).addEventListener('input',event=>{noteFor()[id==='selectionMemo185'?'selectionMemo':'newsMemo']=event.target.value.trim();saveData()}));
      extra.querySelector('#shareStockNames185').onchange=event=>{noteFor().shareStockNames=event.target.checked;saveData()};
    }
    renderWeeklySelection();
  }
  function renderWeeklySelection(){
    const extra=document.getElementById('weeklySelection185');if(!extra)return;const note=noteFor(),signals=new Set(note.signals||[]);
    extra.querySelectorAll('[data-signal]').forEach(button=>{button.classList.toggle('active',signals.has(button.dataset.signal));button.textContent=ko()?signalDefs.find(x=>x[0]===button.dataset.signal)[1]:signalDefs.find(x=>x[0]===button.dataset.signal)[2]});
    extra.querySelector('#selectionMemo185').value=note.selectionMemo||'';extra.querySelector('#newsMemo185').value=note.newsMemo||'';extra.querySelector('#shareStockNames185').checked=note.shareStockNames!==false;
  }

  function weekContext(anchor=parseKey(selectedDate)){
    const r=weekRange(anchor),note=noteFor(r),days=[],stockMap=new Map();
    for(let i=0;i<7;i++){
      const date=key(addDays(r.s,i)),journal=data.journals?.[date]||{},trades=(data.trades?.[date]||[]).filter(x=>x.type==='buy'||x.type==='sell');
      trades.forEach(trade=>{const name=String(trade.stock||trade.code||txt('미상 종목','Unknown')).trim(),id=String(trade.code||name).toUpperCase(),row=stockMap.get(id)||{name,code:trade.code||'',market:trade.market||'',buys:0,sells:0,fills:0,dates:new Set()};row.fills++;row[trade.type==='buy'?'buys':'sells']++;row.dates.add(date);stockMap.set(id,row)});
      days.push({date,theme:String(journal.theme184||'').trim(),marketAnalysis:String(journal.marketAnalysis||'').trim(),stocks:[...new Set(trades.map(x=>String(x.stock||x.code||'').trim()).filter(Boolean))]});
    }
    const stocks=[...stockMap.values()].map(x=>({...x,dates:[...x.dates]})).sort((a,b)=>b.fills-a.fills),themes=days.filter(x=>x.theme),watchTokens=String(note.watchlist||'').split(/[,/·\n]/).map(x=>x.trim().toLowerCase()).filter(Boolean),matched=stocks.filter(s=>watchTokens.some(w=>s.name.toLowerCase().includes(w)||w.includes(s.name.toLowerCase())||(s.code&&w.includes(String(s.code).toLowerCase()))));
    return{r,note,days,stocks,themes,matched,themeDays:themes.length,stockCount:stocks.length,watchCount:watchTokens.length,matchRate:watchTokens.length?Math.round(matched.length/watchTokens.length*100):null};
  }
  function compactList(values,empty='—'){return values.length?values.slice(0,6).join(' · '):empty}
  function ensureSelectionReview(){
    if(document.getElementById('selectionReview185'))return;const panel=document.createElement('section');panel.id='selectionReview185';panel.className='card selection-review185';const anchor=document.getElementById('objectiveBehaviorPanel')||document.getElementById('reviewSnapshot182');anchor?.insertAdjacentElement('afterend',panel);
  }
  function renderSelectionReview(){
    ensureSelectionReview();const box=document.getElementById('selectionReview185');if(!box)return;const c=weekContext(),ai=data.aiEpisodeAssessments?.[c.r.start],themeText=compactList(c.themes.map(x=>`${x.date.slice(5).replace('-','.')} ${x.theme}`)),stockText=compactList(c.stocks.map(x=>`${x.name} ${x.fills}${txt('회',' fills')}`)),criteria=(c.note.signals||[]).map(id=>{const d=signalDefs.find(x=>x[0]===id);return d?(ko()?d[1]:d[2]):id});
    const plan=compactList([c.note.watchlist,c.note.selectionMemo,c.note.plan].filter(Boolean));const news=c.note.newsMemo||txt('저장된 뉴스 조사 메모가 없습니다. 개인 ChatGPT 복기에서는 종목과 날짜를 기준으로 실제 뉴스를 확인하도록 요청합니다.','No saved news note. The personal ChatGPT prompt asks for dated source checks.');
    const aiText=ai?.selectionAssessment||ai?.themeAssessment||ai?.newsAssessment||'';
    box.innerHTML=`<div class="context-head185"><div><h3>${txt('종목 선정과 시장 맥락','Selection and market context')}</h3><div class="sub">${c.r.start.slice(5).replace('-','.')}–${c.r.end.slice(5).replace('-','.')} · ${txt('기존 기록을 자동 연결','linked from existing records')}</div></div><span class="context-badge185">${aiText?txt('내 ChatGPT 반영','My ChatGPT applied'):txt('기록 연결','Record link')}</span></div><div class="context-grid185"><div class="context-item185"><small>${txt('테마 흐름','Theme flow')}</small><b>${safe(themeText)}</b></div><div class="context-item185"><small>${txt('실제 거래 종목','Traded securities')}</small><b>${safe(stockText)}</b></div><div class="context-item185"><small>${txt('선정 계획·기준','Plan and criteria')}</small><p>${safe(compactList([...criteria,plan].filter(Boolean)))}</p></div><div class="context-item185"><small>${txt('뉴스 비교 메모','News context')}</small><p>${safe(news)}</p></div><div class="context-item185"><small>${txt('관심 종목과 실제 거래','Watchlist versus trades')}</small><b>${c.matchRate===null?'—':`${c.matched.length}/${c.watchCount} · ${c.matchRate}%`}</b></div><div class="context-item185"><small>${txt('읽는 방법','How to read this')}</small><p>${txt('테마나 종목 수가 늘었다는 사실만으로 좋고 나쁨을 판단하지 않습니다.','More themes or securities do not by themselves mean better or worse trading.')}</p></div></div>${aiText?`<div class="context-ai185"><b>${txt('내 ChatGPT의 종목·뉴스 해석','My ChatGPT selection/news view')}</b>${safe(aiText)}</div>`:''}`;
  }

  function selectionStatBlock(anchor){
    const c=weekContext(anchor),heights=c.days.map(d=>Math.min(52,8+(d.stocks.length*8)+(d.theme?10:0)));
    return{c,html:`<div class="selection-candles185">${c.days.map((d,i)=>`<div class="selection-candle185 ${d.theme?'theme':''} ${d.stocks.length?'trade':''}"><i style="height:${heights[i]}px"></i><span>${ko()?['일','월','화','수','목','금','토'][parseKey(d.date).getDay()]:['S','M','T','W','T','F','S'][parseKey(d.date).getDay()]}</span></div>`).join('')}</div><small>${txt('빨강은 테마 기록, 초록은 실제 거래가 있던 날입니다. 높이는 종목 수를 함께 반영합니다.','Red marks theme records; green marks trading days. Height also reflects security count.')}</small>`};
  }
  function arrowRow(label,previous,current,unit=''){
    const delta=current-previous,arrow=delta>0?'↑':delta<0?'↓':'→',kind=delta>0?'up':delta<0?'down':'';
    return `<div class="selection-flow-row185"><span><b>${label}</b><small>${previous}${unit} → ${current}${unit}</small></span><span class="arrow ${kind}">${arrow}</span></div>`;
  }
  function renderSelectionStats(){
    const behavior=document.getElementById('behaviorChanges'),objective=document.getElementById('objectiveTrendPanel');if(!behavior||!objective)return;const now=selectionStatBlock(statsAnchor),prev=selectionStatBlock(addDays(statsAnchor,-7));
    behavior.querySelector('.selection-stats185')?.remove();const visual=document.createElement('div');visual.className='selection-stats185';visual.innerHTML=`<h4>${txt('테마·종목 기록의 흐름','Theme and selection record')}</h4>${now.html}`;behavior.appendChild(visual);
    objective.querySelector('.selection-stats185')?.remove();const flow=document.createElement('div');flow.className='selection-stats185';flow.innerHTML=`<h4>${txt('종목 선택 흐름','Selection flow')}</h4><div class="selection-flow-list185">${arrowRow(txt('테마를 기록한 날','Days with themes'),prev.c.themeDays,now.c.themeDays,txt('일','d'))}${arrowRow(txt('거래 종목 수','Securities traded'),prev.c.stockCount,now.c.stockCount)}${arrowRow(txt('관심 종목 거래 일치','Watchlist matches'),prev.c.matched.length,now.c.matched.length)}</div><small>${txt('화살표는 지난주 대비 방향만 나타내며 좋고 나쁨의 평가가 아닙니다.','Arrows show direction versus last week, not quality.')}</small>`;objective.appendChild(flow);
  }

  function reviewPackage185(){
    const c=weekContext(),share=c.note.shareStockNames!==false,namedStocks=c.stocks.map((s,i)=>({security:share?s.name:`${txt('종목','Security')} ${i+1}`,ticker:share?s.code||null:null,market:s.market||null,dates:s.dates,buyFills:s.buys,sellFills:s.sells,totalFills:s.fills})),daily=c.days.filter(d=>d.theme||d.marketAnalysis||d.stocks.length).map(d=>({date:d.date,theme:d.theme||null,marketNote:d.marketAnalysis||null,traded:share?d.stocks:d.stocks.map((_,i)=>`${txt('종목','Security')} ${i+1}`)})),context={week:`${c.r.start}~${c.r.end}`,checks:(c.note.signals||[]).map(id=>signalDefs.find(x=>x[0]===id)?.[1]||id),watchlist:share?c.note.watchlist:'hidden',selectionMemo:c.note.selectionMemo||'',weeklyPlan:c.note.plan||'',userNewsMemo:c.note.newsMemo||'',dailyContext:daily,tradeSummary:namedStocks};
    const base=window.__v1822?.reviewPackage?.()||window.__v182?.reviewPackage?.()||'';
    return `${base}\n\n[종목 선정·테마·뉴스 맥락 — 사용자가 공유를 선택한 자료]\n${JSON.stringify(context,null,2)}\n\n전체 매매를 일일이 지적하지 말고 다음 연결을 우선 분석하세요.\n- 종목 선정 기준 → 당시 테마와 날짜가 확인되는 뉴스 → 실제 매매 행동 → 사용자의 복기\n- 뉴스는 날짜가 맞는 실제 자료를 확인할 수 있을 때만 언급하고, 확인할 수 없으면 '뉴스 확인 필요'라고 표시하세요.\n- 테마나 거래 횟수가 늘거나 줄었다는 사실만으로 잘하고 못했다고 평가하지 마세요.\n- 수익 예측이나 종목 추천 대신, 선정 과정에서 반복해 볼 점 하나와 수정할 점 하나를 제시하세요.\n- 기존 JSON 결과에 selectionAssessment, themeAssessment, newsAssessment, selectionStrength, selectionCaution, selectionNextAction 필드를 추가하세요.`;
  }
  function copyText(value){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(value);const el=document.createElement('textarea');el.value=value;document.body.appendChild(el);el.select();document.execCommand('copy');el.remove();return Promise.resolve()}
  function bindAiActions(){
    const copy=document.getElementById('copyReview181'),share=document.getElementById('shareReview181'),open=document.getElementById('openChatGPT181');
    if(copy)copy.onclick=async()=>{await copyText(reviewPackage185());toast(txt('종목·테마 맥락을 포함한 복기 자료를 복사했습니다.','Copied review with selection and theme context.'))};
    if(open)open.onclick=async()=>{await copyText(reviewPackage185());const popup=window.open('https://chatgpt.com/','_blank');if(popup)popup.opener=null;toast(txt('복기 자료를 복사했습니다. ChatGPT에 붙여 넣어 주세요.','Review copied. Paste it into ChatGPT.'))};
    if(share)share.onclick=async()=>{const value=reviewPackage185();if(navigator.share){try{await navigator.share({title:txt('투자 복기','Investment review'),text:value});return}catch(error){if(error.name==='AbortError')return}}await copyText(value);toast(txt('복기 자료를 복사했습니다.','Review copied.'))};
  }
  function decorateAiResult(){
    const r=wk(),box=document.getElementById('savedAiResult181');if(!box)return;box.querySelector('.ai-result-actions185')?.remove();if(!data.aiReviews?.[r.start])return;const actions=document.createElement('div');actions.className='ai-result-actions185';actions.innerHTML=`<button type="button" class="secondary" data-edit-ai185>${txt('결과 수정','Edit result')}</button><button type="button" class="secondary danger" data-delete-ai185>${txt('결과 삭제','Delete result')}</button>`;box.appendChild(actions);
    actions.querySelector('[data-edit-ai185]').onclick=()=>{const input=document.getElementById('aiResult181');input.value=data.aiReviews[r.start]?.text||'';input.classList.add('ai-result-editing185');input.focus();input.scrollIntoView({behavior:'smooth',block:'center'});document.getElementById('saveAiResult181').textContent=txt('수정 저장','Save changes')};
    actions.querySelector('[data-delete-ai185]').onclick=()=>{if(!confirm(txt('이 주의 ChatGPT 복기 결과를 삭제할까요?','Delete this week’s ChatGPT review?')))return;delete data.aiReviews[r.start];delete data.aiEpisodeAssessments[r.start];saveData();renderReview();toast(txt('ChatGPT 복기 결과를 삭제했습니다.','Deleted the ChatGPT review.'))};
  }

  function ensureBackgroundSetting(){
    if(document.getElementById('personalBackground185'))return;const card=document.querySelector('#settingsScreen>.card');if(!card)return;const row=document.createElement('div');row.id='personalBackground185';row.className='setting-row personal-bg-row185';row.innerHTML=`<span>▧ <span data-i18n="personalBackground185">개인 배경 사진</span></span><div class="personal-bg-control185"><label class="secondary"><span data-i18n="chooseBackground185">사진 선택</span><input id="personalBackgroundInput185" type="file" accept="image/*"></label><button type="button" class="secondary danger" id="removeBackground185" data-i18n="removeBackground185">배경 삭제</button><small class="personal-bg-note185" data-i18n="backgroundHelp185">사진은 이 기기에만 저장되고 아주 옅게 표시됩니다.</small></div>`;const nameInput=card.querySelector('#journalNameInput'),nameRow=nameInput?.closest('.setting-row');nameRow?.insertAdjacentElement('afterend',row);if(!nameRow)card.appendChild(row);row.querySelector('input').onchange=event=>{const file=event.target.files?.[0];if(file)compressBackground(file)};row.querySelector('#removeBackground185').onclick=()=>{delete data.settings.personalBackground185;saveData();applyBackground();toast(txt('개인 배경 사진을 삭제했습니다.','Removed the personal background.'))};
  }
  function compressBackground(file){
    const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const max=1600,scale=Math.min(1,max/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);const previous=data.settings.personalBackground185;data.settings.personalBackground185=canvas.toDataURL('image/jpeg',.68);try{saveData();applyBackground();toast(txt('개인 배경 사진을 적용했습니다.','Applied the personal background.'))}catch(_){data.settings.personalBackground185=previous;toast(txt('사진을 저장할 공간이 부족합니다. 더 작은 사진을 선택해 주세요.','Not enough device storage. Choose a smaller image.'))}};image.src=reader.result};reader.readAsDataURL(file);
  }
  function applyBackground(){const value=data.settings.personalBackground185||'';document.body.classList.toggle('has-personal-bg185',Boolean(value));value?document.body.style.setProperty('--personal-bg185',`url("${value}")`):document.body.style.removeProperty('--personal-bg185');const remove=document.getElementById('removeBackground185');if(remove)remove.disabled=!value}

  const renderCalendarBase185=renderCalendar;renderCalendar=function(){renderCalendarBase185();extendWeeklyReport()};
  const renderReviewBase185=renderReview;renderReview=function(){renderReviewBase185();renderSelectionReview();bindAiActions();decorateAiResult()};
  const renderStatsBase185=renderStats;renderStats=function(){renderStatsBase185();renderSelectionStats()};
  const applyLangBase185=applyLang;applyLang=function(){applyLangBase185();extendWeeklyReport();renderSelectionReview();bindAiActions();decorateAiResult();ensureBackgroundSetting();applyBackground();document.querySelectorAll('[data-i18n]').forEach(el=>{const value=t(el.dataset.i18n);if(value!==el.dataset.i18n)el.textContent=value});document.querySelectorAll('[data-placeholder]').forEach(el=>{const value=t(el.dataset.placeholder);if(value!==el.dataset.placeholder)el.placeholder=value});if(document.getElementById('statsScreen').classList.contains('active'))renderSelectionStats()};
  document.querySelector('#appInfoBtn .sub').textContent='v1.85 ›';document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.85';const summary=document.querySelector('#appInfoModal [data-i18n="v184Summary"]');if(summary){summary.dataset.i18n='v185Summary';summary.textContent=t('v185Summary')}
  ensureBackgroundSetting();applyBackground();extendWeeklyReport();renderSelectionReview();bindAiActions();decorateAiResult();
  window.__v185={version:VERSION,weekContext,reviewPackage:reviewPackage185,renderSelectionStats};
})();
