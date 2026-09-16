/* Investment Journal v1.81
   Local-first review episodes, priority principles, personalized learning,
   personal ChatGPT handoff, and update readiness. */
(() => {
  const RELEASE='1.83.2';
  Object.assign(I18N.ko,{
    v181Summary:'매매 구간 복기, 핵심 원칙, 맞춤 학습과 개인 ChatGPT 공유 준비를 추가했습니다.',
    nextVersion:'온라인 AI는 사용자가 명시적으로 선택한 경우에만 연결합니다.',
    episodeReview:'종목별 매매 구간 복기',episodeReviewHelp:'같은 종목의 진입부터 청산까지 자동으로 묶습니다. 이유는 구간마다 한 번만 선택하세요.',
    noEpisodes:'이번 주에 복기할 매매 구간이 없습니다.',reviewReason:'접근 이유',optionalMemo:'선택 메모',strategyChanged:'전략 변경',
    keyQuestions:'이번 주 핵심 복기',keyQuestionsHelp:'기록에서 가장 중요한 질문만 최대 3개 보여드립니다.',noQuestions:'확인할 거래가 더 쌓이면 핵심 질문을 보여드립니다.',
    weeklyPrinciples:'이번 주 핵심 원칙',weeklyPrinciplesHelp:'최우선 1개와 주의 원칙 2개만 먼저 봅니다.',priorityOne:'최우선',watchPrinciple:'주의',makePriority:'최우선으로',principleVault:'원칙 보관함',
    tailoredLearning:'나를 위한 학습 추천',tailoredLearningHelp:'현재는 기기 내 기록으로 고릅니다. 온라인 연결 시 출처가 있는 글·영상으로 확장됩니다.',
    suggestedAction:'추천 행동',helpfulCase:'도움되는 사례',learningTopic:'이번 주 학습 주제',matchedQuote:'맞춤 투자 문구',matchedTerm:'관련 주식 용어',
    aiReviewConnection:'복기 연결 방식',onDeviceMode:'기기 내 행동 분석',onDeviceModeHelp:'자동·무료·외부 전송 없음',chatgptMode:'내 ChatGPT로 복기',chatgptModeHelp:'개인정보를 뺀 요약을 공유',apiMode:'개인 API 정밀 복기',apiModeHelp:'안전한 개인 연결 프로그램 준비 후 제공',
    openChatGPT:'ChatGPT로 복기',copyPackage:'복기 자료 복사',packageCopied:'개인정보를 뺀 복기 자료를 복사했습니다.',sharePackage:'복기 자료 공유',
    aiResult:'ChatGPT 복기 결과 보관',aiResultPlaceholder:'ChatGPT에서 받은 복기 결과를 여기에 붙여 넣어 보관할 수 있습니다.',saveAiResult:'결과 저장',aiResultSaved:'개인 ChatGPT 복기 결과를 기기에 저장했습니다.',
    privacyPackage:'종목명·계좌정보·원본 사진·CSV는 공유 자료에 포함하지 않습니다.',localGuideSource:'기기 내 맞춤 추천',updateAvailable:'새로운 투자일지 버전이 있습니다.',updateNow:'업데이트',
    overallReasonReplaced:'매매 이유는 투자복기의 종목별 매매 구간에서 한 번만 선택합니다.'
  });
  Object.assign(I18N.en,{
    v181Summary:'Adds trade-episode reviews, priority principles, tailored learning, and a personal ChatGPT handoff.',
    nextVersion:'Online AI connects only when the user explicitly chooses it.',
    episodeReview:'Review by trade episode',episodeReviewHelp:'Trades are grouped from entry to exit. Choose a reason only once per episode.',
    noEpisodes:'No trade episode is available for this week.',reviewReason:'Approach',optionalMemo:'Optional note',strategyChanged:'Strategy changed',
    keyQuestions:'Key questions this week',keyQuestionsHelp:'Shows no more than three important questions from your records.',noQuestions:'Key questions will appear as more verified trades accumulate.',
    weeklyPrinciples:'Priority principles this week',weeklyPrinciplesHelp:'See one priority and two watch principles first.',priorityOne:'Priority',watchPrinciple:'Watch',makePriority:'Make priority',principleVault:'Principle vault',
    tailoredLearning:'Learning selected for me',tailoredLearningHelp:'Currently selected from on-device records. Online mode will add sourced articles and videos.',
    suggestedAction:'Suggested action',helpfulCase:'Helpful example',learningTopic:'Weekly topic',matchedQuote:'Tailored investing line',matchedTerm:'Related market term',
    aiReviewConnection:'Review connection',onDeviceMode:'On-device behavior analysis',onDeviceModeHelp:'Automatic, free, nothing sent out',chatgptMode:'Review with my ChatGPT',chatgptModeHelp:'Share a privacy-scrubbed summary',apiMode:'Personal API precision review',apiModeHelp:'Available after a secure personal connector',
    openChatGPT:'Review in ChatGPT',copyPackage:'Copy review package',packageCopied:'Copied a privacy-scrubbed review package.',sharePackage:'Share review package',
    aiResult:'Save ChatGPT review',aiResultPlaceholder:'Paste a review received from ChatGPT to keep it on this device.',saveAiResult:'Save result',aiResultSaved:'Saved the personal ChatGPT review on this device.',
    privacyPackage:'Security names, account details, source photos, and CSV files are excluded.',localGuideSource:'On-device tailored guide',updateAvailable:'A new Investment Journal version is available.',updateNow:'Update',
    overallReasonReplaced:'Choose one reason per trade episode in Investment Review.'
  });

  data.episodeReviews=data.episodeReviews||{};
  data.reviewAnswers=data.reviewAnswers||{};
  data.principleFocus=data.principleFocus||{};
  data.aiReviews=data.aiReviews||{};
  data.aiMode=data.aiMode||'chatgpt';
  data.aiPreparationHashes=data.aiPreparationHashes||{};
  data.principles=(data.principles||[]).map((p,i)=>({...p,id:p.id||`principle_legacy_${i}`}));
  data.version=RELEASE;

  const review=document.getElementById('reviewScreen');
  const objective=document.getElementById('objectiveBehaviorPanel');
  objective.insertAdjacentHTML('afterend',`
    <div class="card" id="episodeReviewCard"><div class="v181-card-head"><div><h3 data-i18n="episodeReview">종목별 매매 구간 복기</h3><div class="sub" data-i18n="episodeReviewHelp"></div></div><span class="mode-badge">기기 내 자동 묶기</span></div><div id="episodeReviewList" class="episode-list"></div></div>
    <div class="card" id="keyQuestionCard"><div class="v181-card-head"><div><h3 data-i18n="keyQuestions">이번 주 핵심 복기</h3><div class="sub" data-i18n="keyQuestionsHelp"></div></div><span class="mode-badge">최대 3개</span></div><div id="keyQuestionList" class="question-list"></div></div>
    <div class="card" id="principleFocusCard"><div class="v181-card-head"><div><h3 data-i18n="weeklyPrinciples">이번 주 핵심 원칙</h3><div class="sub" data-i18n="weeklyPrinciplesHelp"></div></div></div><div id="principleFocusList" class="principle-focus-grid"></div></div>`);

  const improvement=review.querySelector('.improvement-guide');
  improvement.insertAdjacentHTML('beforebegin',`
    <div class="card" id="tailoredLearningCard"><div class="v181-card-head"><div><h3 data-i18n="tailoredLearning">나를 위한 학습 추천</h3><div class="sub" data-i18n="tailoredLearningHelp"></div></div><span class="mode-badge" data-i18n="localGuideSource">기기 내 맞춤 추천</span></div><div id="tailoredLearning" class="learning-path"></div></div>
    <div class="card" id="aiReviewCard"><div class="v181-card-head"><div><h3 data-i18n="aiReviewConnection">복기 연결 방식</h3><div class="sub" id="aiReviewWeek"></div></div><span class="mode-badge chatgpt">개인 ChatGPT</span></div><div class="learning-actions"><button class="primary" style="width:auto" id="openChatGPT181" data-i18n="openChatGPT">ChatGPT로 복기</button><button class="secondary" id="shareReview181" data-i18n="sharePackage">복기 자료 공유</button><button class="secondary" id="copyReview181" data-i18n="copyPackage">복기 자료 복사</button></div><div class="privacy-note" data-i18n="privacyPackage"></div><div class="ai-result-box"><textarea id="aiResult181" data-placeholder="aiResultPlaceholder" placeholder="ChatGPT에서 받은 복기 결과를 여기에 붙여 넣어 보관할 수 있습니다."></textarea><button class="secondary" id="saveAiResult181" data-i18n="saveAiResult">결과 저장</button><div id="savedAiResult181" style="margin-top:10px"></div></div></div>`);
  improvement.style.display='none';

  const legacyReason=document.getElementById('tradeReason')?.closest('.journal-card');
  if(legacyReason){legacyReason.style.display='none';const tradeWrap=document.getElementById('tradeTableWrap');tradeWrap.insertAdjacentHTML('afterend',`<div class="privacy-note" data-i18n="overallReasonReplaced">${t('overallReasonReplaced')}</div>`)}

  const principleVault=document.getElementById('principleList')?.closest('.card');
  if(principleVault){principleVault.classList.add('principle-vault','collapsed');principleVault.querySelector('h3').dataset.i18n='principleVault';principleVault.querySelector('h3').textContent=t('principleVault');principleVault.querySelector('h3').onclick=()=>principleVault.classList.toggle('collapsed')}

  const settingsCard=document.querySelector('#settingsScreen .card');
  const backupRow=document.getElementById('exportBtn')?.closest('.setting-row');
  backupRow?.insertAdjacentHTML('beforebegin',`<div class="setting-row" style="display:block"><div class="v181-card-head"><b data-i18n="aiReviewConnection">복기 연결 방식</b></div><div id="aiModeGrid181" class="ai-mode-grid"><button class="ai-mode-card" data-mode="local"><b data-i18n="onDeviceMode">기기 내 행동 분석</b><span data-i18n="onDeviceModeHelp"></span></button><button class="ai-mode-card" data-mode="chatgpt"><b data-i18n="chatgptMode">내 ChatGPT로 복기</b><span data-i18n="chatgptModeHelp"></span></button><button class="ai-mode-card" data-mode="api" disabled><b data-i18n="apiMode">개인 API 정밀 복기</b><span data-i18n="apiModeHelp"></span></button></div></div>`);
  document.body.insertAdjacentHTML('beforeend',`<div id="updateBanner181" class="update-banner"><span data-i18n="updateAvailable">새로운 투자일지 버전이 있습니다.</span><button id="updateNow181" data-i18n="updateNow">업데이트</button></div>`);

  function simpleHash(value){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
  function reviewWeek(){return weekRange(parseKey(selectedDate))}
  function allRowsUntil(end){const aliases=buildStockAliases(),rows=[];Object.keys(data.trades||{}).filter(d=>d<=end).sort().forEach(date=>(data.trades[date]||[]).forEach((trade,index)=>{if(trade.type!=='buy'&&trade.type!=='sell')return;rows.push({date,index,trade,id:tradeIdentity(trade,aliases),time:tradeTime(trade),seconds:secondsOf(tradeTime(trade))})}));return rows.sort((a,b)=>a.date.localeCompare(b.date)||(a.seconds??999999)-(b.seconds??999999)||a.index-b.index)}
  function buildEpisodes(range=reviewWeek()){
    const states={},episodes=[];
    allRowsUntil(range.end).forEach(row=>{
      const s=states[row.id]||(states[row.id]={qty:0,current:null,seq:0,closed:0});
      const qty=Math.max(0,Number(row.trade.qty)||0);
      if(row.trade.type==='buy'){
        if(!s.current||s.qty<=0){s.seq++;const token=`${row.id}|${row.date}|${row.time||row.index}|${s.seq}`;s.current={id:`episode_${simpleHash(token)}`,stock:row.trade.stock||row.trade.code||row.id,code:row.trade.code||'',currency:row.trade.currency||'KRW',market:row.trade.market||'',start:row.date,end:'',rows:[],unknownStart:false,reentry:s.closed>0};episodes.push(s.current);s.qty=0}
        const label=s.qty>0?(lang==='ko'?'추가 매수':'Add'):(s.current.reentry?(lang==='ko'?'재진입':'Re-entry'):(lang==='ko'?'첫 진입':'Entry'));
        s.current.rows.push({...row,label});s.qty+=qty;
      }else{
        if(!s.current){s.seq++;const token=`${row.id}|unknown|${row.date}|${row.time||row.index}|${s.seq}`;s.current={id:`episode_${simpleHash(token)}`,stock:row.trade.stock||row.trade.code||row.id,code:row.trade.code||'',currency:row.trade.currency||'KRW',market:row.trade.market||'',start:row.date,end:'',rows:[],unknownStart:true,reentry:false};episodes.push(s.current)}
        const partial=s.qty>qty,label=s.qty<=0?(lang==='ko'?'이전 보유 매도':'Sell from prior holding'):(partial?(lang==='ko'?'부분 매도':'Partial exit'):(lang==='ko'?'전량 매도':'Exit'));
        s.current.rows.push({...row,label});s.qty=Math.max(0,s.qty-qty);
        if(s.qty===0){s.current.end=row.date;s.current=null;s.closed++}
      }
    });
    return episodes.filter(ep=>ep.rows.some(x=>x.date>=range.start&&x.date<=range.end));
  }
  function episodeReasonOptions(){return lang==='ko'?[['','이유 선택'],['breakout','돌파'],['pullback','눌림목'],['support','지지선'],['news','뉴스·공시'],['theme','테마·수급'],['leader','주도주'],['scalp','단기 대응'],['carry','기존 보유'],['other','기타']]:[['','Choose approach'],['breakout','Breakout'],['pullback','Pullback'],['support','Support'],['news','News'],['theme','Theme / flow'],['leader','Market leader'],['scalp','Scalp'],['carry','Existing holding'],['other','Other']]}
  function renderEpisodes181(){
    const box=document.getElementById('episodeReviewList'),episodes=buildEpisodes();
    if(!episodes.length){box.innerHTML=`<div class="sub">${t('noEpisodes')}</div>`;return}
    box.innerHTML=episodes.slice(-15).map(ep=>{const saved=data.episodeReviews[ep.id]||{},buy=ep.rows.filter(x=>x.trade.type==='buy').reduce((s,x)=>s+Number(x.trade.qty||0),0),sell=ep.rows.filter(x=>x.trade.type==='sell').reduce((s,x)=>s+Number(x.trade.qty||0),0),period=ep.start.slice(5).replace('-','.')+(ep.end&&ep.end!==ep.start?`–${ep.end.slice(5).replace('-','.')}`:''),flow=ep.rows.map(x=>`<span class="flow-chip ${x.trade.type}">${x.label} ${Number(x.trade.qty||0).toLocaleString()}</span>`).join(''),opts=episodeReasonOptions().map(([v,n])=>`<option value="${v}" ${saved.reason===v?'selected':''}>${n}</option>`).join('');return `<div class="episode-card" data-id="${ep.id}"><div class="episode-top"><div><div class="episode-stock">${escapeHtml(ep.stock)} ${ep.code?`<small>${escapeHtml(ep.code)}</small>`:''}</div><div class="episode-meta">${period} · ${ep.rows.length}${lang==='ko'?'회':' fills'} · ${lang==='ko'?'매수':'Buy'} ${buy.toLocaleString()} / ${lang==='ko'?'매도':'Sell'} ${sell.toLocaleString()}</div></div><span class="episode-state">${ep.end?(lang==='ko'?'청산':'Closed'):(lang==='ko'?'보유 연결':'Carried')}</span></div><div class="episode-flow">${flow}</div><div class="episode-review"><select class="episode-reason" aria-label="${t('reviewReason')}">${opts}</select><input class="episode-note" maxlength="80" value="${escapeHtml(saved.note||'')}" placeholder="${t('optionalMemo')}"></div><div class="question-options"><button class="secondary episode-change ${saved.changed?'active':''}" type="button">↔ ${t('strategyChanged')}</button></div></div>`}).join('');
    box.querySelectorAll('.episode-card').forEach(card=>{const id=card.dataset.id,reason=card.querySelector('.episode-reason'),note=card.querySelector('.episode-note'),change=card.querySelector('.episode-change'),persist=()=>{data.episodeReviews[id]={reason:reason.value,note:note.value.trim(),changed:change.classList.contains('active'),updatedAt:new Date().toISOString()};saveData()};reason.onchange=persist;note.onchange=persist;change.onclick=()=>{change.classList.toggle('active');persist()}})
  }

  function questionSet(){const r=reviewWeek(),report=objectiveBehaviorReport(parseKey(selectedDate)),episodes=buildEpisodes(r),questions=[];
    if(!report.rows.length)return questions;
    if(report.lossRapid)questions.push({id:'loss_reentry',text:lang==='ko'?`손실 매도 뒤 10분 안에 다시 진입한 ${report.lossRapid}회는 계획된 대응이었나요?`:`Were the ${report.lossRapid} re-entries within 10 minutes of a losing sell planned?`,options:lang==='ko'?['계획됨','조급했음','기억 안 남']:['Planned','Rushed','Unsure']});
    else if(report.rapid)questions.push({id:'reentry',text:lang==='ko'?`10분 이내 재진입 ${report.rapid}회는 분할 전략이었나요, 조급한 재진입이었나요?`:`Were the ${report.rapid} quick re-entries planned scaling or rushed re-entry?`,options:lang==='ko'?['분할 전략','조급한 재진입','둘 다 있음']:['Planned scaling','Rushed','Both']});
    if(report.sizeUps)questions.push({id:'size_up',text:lang==='ko'?`30분 안에 매수금액을 키운 ${report.sizeUps}회에서 최대 수량을 미리 정했나요?`:`Did you set a maximum size before the ${report.sizeUps} rapid size increases?`,options:lang==='ko'?['정했음','정하지 않음','일부만']:['Yes','No','Sometimes']});
    if(report.topShare>=.55)questions.push({id:'concentration',text:lang==='ko'?`한 종목에 거래가 ${Math.round(report.topShare*100)}% 집중된 것은 의도한 선택이었나요?`:`Was the ${Math.round(report.topShare*100)}% concentration in one security intentional?`,options:lang==='ko'?['의도함','흐름에 끌림','확인 필요']:['Intentional','Followed momentum','Review needed']});
    const missing=episodes.filter(ep=>!(data.episodeReviews[ep.id]?.reason)).length;if(missing)questions.push({id:'missing_reason',text:lang==='ko'?`${missing}개 매매 구간의 접근 이유가 비어 있습니다. 가장 중요했던 구간 하나만 먼저 고를까요?`:`${missing} episodes have no approach selected. Review the most important one first?`,options:lang==='ko'?['지금 선택','나중에','판단 어려움']:['Choose now','Later','Hard to tell']});
    if(report.topPsych)questions.push({id:'psych',text:lang==='ko'?`거래 중 ‘${psychLabel(report.topPsych[0])}’ 상태가 판단 속도에 영향을 주었나요?`:`Did feeling “${psychLabel(report.topPsych[0])}” affect your decision speed?`,options:lang==='ko'?['영향 있음','영향 없음','모르겠음']:['Yes','No','Unsure']});
    return questions.slice(0,3)}
  function setQuestionAnswer181(week,id,value){data.reviewAnswers[week]=data.reviewAnswers[week]||{};data.reviewAnswers[week][id]={value,at:new Date().toISOString()};saveData();renderQuestions181()}
  function renderQuestions181(){const box=document.getElementById('keyQuestionList'),r=reviewWeek(),questions=questionSet(),saved=data.reviewAnswers[r.start]||{};box.innerHTML=questions.length?questions.map((q,i)=>`<div class="question-item"><b>${i+1}. ${escapeHtml(q.text)}</b><div class="question-options">${q.options.map(o=>`<button class="secondary ${saved[q.id]?.value===o?'active':''}" data-id="${q.id}" data-value="${encodeURIComponent(o)}">${escapeHtml(o)}</button>`).join('')}</div></div>`).join(''):`<div class="sub">${t('noQuestions')}</div>`;box.querySelectorAll('button').forEach(b=>b.onclick=()=>setQuestionAnswer181(r.start,b.dataset.id,decodeURIComponent(b.dataset.value)))}

  function principleScore181(p,r){let score=p.source==='suggested'?1:0;Object.entries(p.statuses||{}).forEach(([d,status])=>{if(d<addDays(parseKey(r.end),-28).toISOString().slice(0,10)||d>r.end)return;const days=Math.max(0,Math.round((parseKey(r.end)-parseKey(d))/86400000)),weight=days<=7?3:days<=14?2:1;if(status==='missed')score+=5*weight;if(status==='kept')score+=weight;if(status==='na')score-=1});const report=objectiveBehaviorReport(parseKey(selectedDate)),tokens=report.action.split(/\s+/).filter(x=>x.length>1);if(tokens.some(x=>p.text.includes(x)))score+=7;return score}
  function rankedPrinciples181(){const r=reviewWeek(),list=[...(data.principles||[])],chosen=data.principleFocus[r.start],ranked=list.sort((a,b)=>(a.id===chosen?-100000:0)+(principleScore181(b,r)-principleScore181(a,r))+(b.id===chosen?100000:0));return ranked}
  function setPrincipleFocus181(id){data.principleFocus[reviewWeek().start]=id;saveData();renderPrincipleFocus181();renderPersonalCover()}
  function renderPrincipleFocus181(){const box=document.getElementById('principleFocusList');if(!box)return;const ranked=rankedPrinciples181(),focusId=data.principleFocus[reviewWeek().start]||ranked[0]?.id;if(!ranked.length){box.innerHTML=`<div class="sub">${t('noSuggestion')}</div>`;return}const ordered=[ranked.find(p=>p.id===focusId),...ranked.filter(p=>p.id!==focusId)].filter(Boolean).slice(0,3);box.innerHTML=ordered.map((p,i)=>`<div class="focus-principle ${i===0?'primary-focus':''}"><small>${i===0?'🎯 '+t('priorityOne'):'👀 '+t('watchPrinciple')}</small><b>${escapeHtml(p.text)}</b>${i?`<button class="secondary" data-id="${p.id}">${t('makePriority')}</button>`:''}</div>`).join('');box.querySelectorAll('button').forEach(b=>b.onclick=()=>setPrincipleFocus181(b.dataset.id))}

  function learningModel181(){const report=objectiveBehaviorReport(parseKey(selectedDate));if(report.lossRapid)return lang==='ko'?{quote:'손실 뒤에는 속도보다 기준을 먼저 회복하세요.',term:'복수 매매',termDesc:'손실을 빨리 만회하려는 감정이 계획보다 앞서는 거래입니다.',example:'손실 매도 뒤 같은 종목에 바로 재진입하기보다 10분 동안 진입 근거와 최대 수량을 다시 확인합니다.',action:'손실 후 같은 종목은 10분 기다리기',topic:'손실 후 의사결정 · 감정적 재진입'}:{quote:'After a loss, restore your rules before your speed.',term:'Revenge trading',termDesc:'Trading driven by the urge to recover a loss quickly.',example:'After a losing exit, wait ten minutes and recheck the thesis and maximum size before re-entry.',action:'Wait ten minutes after a loss before re-entering',topic:'Post-loss decisions · emotional re-entry'};
    if(report.rapid)return lang==='ko'?{quote:'빠른 재진입일수록 이유는 더 짧고 분명해야 합니다.',term:'재진입',termDesc:'청산한 종목을 다시 매수해 새로운 포지션을 만드는 행동입니다.',example:'분할 전략이라면 재진입 가격과 횟수를 주문 전에 정하고, 즉흥 진입과 구분해 기록합니다.',action:'재진입 전 계획 여부 한 번 확인하기',topic:'재진입 규칙 · 분할 전략'}:{quote:'The faster the re-entry, the clearer its reason should be.',term:'Re-entry',termDesc:'Opening a new position in a security after an exit.',example:'For planned scaling, set re-entry price and count before the order and distinguish it from an impulsive entry.',action:'Confirm whether re-entry was planned',topic:'Re-entry rules · scaling'};
    if(report.sizeUps)return lang==='ko'?{quote:'확신이 커질수록 수량의 상한은 먼저 정해져 있어야 합니다.',term:'포지션 사이징',termDesc:'한 번의 판단에 배정할 자금과 수량을 미리 제한하는 과정입니다.',example:'추가 매수 전 보유금액과 최대 허용수량을 확인해 감정에 따른 비중 확대를 막습니다.',action:'추가 매수 전 최대 수량 확인하기',topic:'포지션 사이징 · 추가 매수'}:{quote:'As conviction grows, the size limit should already be set.',term:'Position sizing',termDesc:'Predefining the capital and quantity assigned to one decision.',example:'Check current exposure and maximum quantity before adding to prevent emotion-led size increases.',action:'Check maximum size before adding',topic:'Position sizing · adding'};
    if(report.topShare>=.55)return lang==='ko'?{quote:'집중은 전략이지만, 횟수 제한이 없으면 습관이 됩니다.',term:'거래 집중도',termDesc:'전체 거래가 특정 종목이나 시간대에 몰린 정도입니다.',example:'주도주 집중은 유지하되 한 종목의 하루 최대 진입 횟수를 정해 과잉매매를 막습니다.',action:'한 종목 하루 최대 거래횟수 정하기',topic:'집중 매매 · 과잉매매'}:{quote:'Concentration can be a strategy; without limits it becomes a habit.',term:'Trade concentration',termDesc:'How much activity is clustered in one security or time window.',example:'Keep the focus thesis but set a daily entry limit for one security.',action:'Set a daily trade-count limit per security',topic:'Concentration · overtrading'};
    return lang==='ko'?{quote:'좋은 복기는 결과보다 다음 행동을 한 가지 분명하게 만듭니다.',term:'과정 중심 복기',termDesc:'수익보다 계획·수량·진입·청산 과정을 기준으로 거래를 돌아보는 방식입니다.',example:'가장 원칙을 잘 지킨 매매 하나와 다음에 바꿀 행동 하나만 표시합니다.',action:'계획 거래와 즉흥 거래 구분하기',topic:'과정 평가 · 거래 계획'}:{quote:'A useful review makes one next action clearer than the result.',term:'Process review',termDesc:'Reviewing the plan, size, entry, and exit rather than judging by profit alone.',example:'Mark one trade that followed the rule and one behavior to change next.',action:'Separate planned and unplanned trades',topic:'Process evaluation · trade planning'}}
  function renderLearning181(){const box=document.getElementById('tailoredLearning'),g=learningModel181();box.innerHTML=`<div class="learning-tile"><small>💬 ${t('matchedQuote')}</small><b>“${escapeHtml(g.quote)}”</b><p>${t('localGuideSource')}</p></div><div class="learning-tile"><small>💡 ${t('matchedTerm')}</small><b>${escapeHtml(g.term)}</b><p>${escapeHtml(g.termDesc)}</p></div><div class="learning-tile"><small>📖 ${t('helpfulCase')}</small><b>${escapeHtml(g.example)}</b></div><div class="learning-tile"><small>🎯 ${t('suggestedAction')}</small><b>${escapeHtml(g.action)}</b><p>${t('learningTopic')}: ${escapeHtml(g.topic)}</p></div>`}
  function renderHomeLearning181(){const g=learningModel181();const quote=document.getElementById('dailyQuote'),author=document.getElementById('quoteAuthor'),word=document.getElementById('termWord'),desc=document.getElementById('termDesc');if(quote)quote.textContent=`“${g.quote}”`;if(author)author.textContent=t('localGuideSource');if(word)word.textContent=g.term;if(desc)desc.textContent=g.termDesc}

  function reviewPackage181(){const r=reviewWeek(),report=objectiveBehaviorReport(parseKey(selectedDate)),episodes=buildEpisodes(r),answers=data.reviewAnswers[r.start]||{},g=learningModel181(),anonymous=episodes.map((ep,i)=>({security:`${lang==='ko'?'종목':'Security'} ${i+1}`,period:`${ep.start}~${ep.end||(lang==='ko'?'보유 중':'open')}`,fills:ep.rows.length,buyQuantity:ep.rows.filter(x=>x.trade.type==='buy').reduce((s,x)=>s+Number(x.trade.qty||0),0),sellQuantity:ep.rows.filter(x=>x.trade.type==='sell').reduce((s,x)=>s+Number(x.trade.qty||0),0),approach:data.episodeReviews[ep.id]?.reason||'not selected',strategyChanged:Boolean(data.episodeReviews[ep.id]?.changed)}));const facts={week:`${r.start}~${r.end}`,tradeCount:report.rows.length,verifiedSourceRatio:Math.round(report.sourceRatio*100),quickReentries:report.rapid,quickReentriesAfterLoss:report.lossRapid,sizeIncreases:report.sizeUps,peakTradingHour:report.peak?.[0]||null,topSecurityShare:Math.round(report.topShare*100),psychology:report.topPsych?psychLabel(report.topPsych[0]):null};return `당신은 수익 결과가 아니라 투자 과정과 심리 변화를 돕는 복기 코치입니다.\n\n다음 자료는 계좌정보·종목명·원본 CSV·사진을 제거한 주간 요약입니다. 관찰된 사실과 해석을 구분하고, 근거가 부족하면 단정하지 마세요.\n\n[객관적 요약]\n${JSON.stringify(facts,null,2)}\n\n[익명화된 매매 구간]\n${JSON.stringify(anonymous,null,2)}\n\n[사용자 답변]\n${JSON.stringify(Object.fromEntries(Object.entries(answers).map(([k,v])=>[k,v.value])),null,2)}\n\n다음 형식으로 한국어 약 10줄로 답해주세요.\n1. 관찰된 행동 사실\n2. 가능한 심리·행동 해석과 신뢰도\n3. 최우선으로 고칠 원칙 1개\n4. 주의할 원칙 2개\n5. 다음 거래에서 할 구체적 행동 1개\n6. 도움이 되는 실제 사례의 유형\n7. 오늘의 맞춤 투자 문구 1개\n8. 실제 거래와 연결된 주식 용어 1개와 설명\n9. 더 공부할 주제 1개\n10. 분석에 부족한 정보\n\n현재 기기 내 추천 주제: ${g.topic}`}
  function copyText181(text){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);const a=document.createElement('textarea');a.value=text;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();return Promise.resolve()}
  async function copyPackage181(){const r=reviewWeek(),text=reviewPackage181(),hash=simpleHash(text);await copyText181(text);data.aiPreparationHashes[r.start]={hash,at:new Date().toISOString()};saveData();toast(t('packageCopied'));return text}
  async function sharePackage181(){const text=reviewPackage181();if(navigator.share){try{await navigator.share({title:t('aiReviewConnection'),text});return}catch(e){if(e.name==='AbortError')return}}await copyPackage181()}
  async function openChatGPT181(){const text=reviewPackage181(),copying=copyText181(text),popup=window.open('https://chatgpt.com/','_blank');if(popup)popup.opener=null;await copying;const r=reviewWeek();data.aiPreparationHashes[r.start]={hash:simpleHash(text),at:new Date().toISOString()};saveData();toast(t('packageCopied'));if(!popup)toast(t('popupBlocked'))}
  function saveAiResult181(){const r=reviewWeek(),text=document.getElementById('aiResult181').value.trim();if(!text)return;data.aiReviews[r.start]={text,source:'personal-chatgpt',at:new Date().toISOString()};saveData();renderAiResult181();toast(t('aiResultSaved'))}
  function renderAiResult181(){const r=reviewWeek(),saved=data.aiReviews[r.start],box=document.getElementById('savedAiResult181');document.getElementById('aiReviewWeek').textContent=`${r.start.slice(5).replace('-','.')}–${r.end.slice(5).replace('-','.')}`;box.innerHTML=saved?`<div class="ai-result-saved"><span class="mode-badge chatgpt">${lang==='ko'?'내 ChatGPT 결과':'My ChatGPT result'}</span>\n${escapeHtml(saved.text)}</div>`:''}
  function renderAiModes181(){document.querySelectorAll('#aiModeGrid181 .ai-mode-card').forEach(b=>b.classList.toggle('active',b.dataset.mode===data.aiMode))}
  document.querySelectorAll('#aiModeGrid181 .ai-mode-card:not(:disabled)').forEach(b=>b.onclick=()=>{data.aiMode=b.dataset.mode;saveData();renderAiModes181()});
  document.getElementById('copyReview181').onclick=copyPackage181;document.getElementById('shareReview181').onclick=sharePackage181;document.getElementById('openChatGPT181').onclick=openChatGPT181;document.getElementById('saveAiResult181').onclick=saveAiResult181;

  const renderReviewBefore181=renderReview;
  renderReview=function(){renderReviewBefore181();renderEpisodes181();renderQuestions181();renderPrincipleFocus181();renderLearning181();renderAiResult181()};
  const renderPrinciplesBefore181=renderPrinciples;
  renderPrinciples=function(){renderPrinciplesBefore181();renderPrincipleFocus181()};
  const renderPersonalCoverBefore181=renderPersonalCover;
  renderPersonalCover=function(){renderPersonalCoverBefore181();const ranked=rankedPrinciples181(),focusId=data.principleFocus[weekRange(new Date()).start]||ranked[0]?.id,focus=(data.principles||[]).find(p=>p.id===focusId);if(focus)document.getElementById('coverPrincipleText').textContent=focus.text};
  const renderDailyLearningBefore181=renderDailyLearning;
  renderDailyLearning=function(){renderDailyLearningBefore181();renderHomeLearning181()};
  const applyLangBefore181=applyLang;
  applyLang=function(){applyLangBefore181();document.querySelectorAll('[data-i18n]').forEach(el=>{const value=t(el.dataset.i18n);if(value!==el.dataset.i18n)el.innerHTML=value});document.querySelectorAll('[data-placeholder]').forEach(el=>{const value=t(el.dataset.placeholder);if(value!==el.dataset.placeholder)el.placeholder=value});if(principleVault?.querySelector('h3'))principleVault.querySelector('h3').textContent=t('principleVault');renderAiModes181();renderReview();renderHomeLearning181()};

  function newer181(remote,current){const parse=x=>{const p=String(x||'').split('.').map(Number);if(p[0]===1&&p[1]===9)p[1]=90;return p};const a=parse(remote),b=parse(current);for(let i=0;i<Math.max(a.length,b.length);i++){if((a[i]||0)>(b[i]||0))return true;if((a[i]||0)<(b[i]||0))return false}return false}
  async function checkUpdate181(){try{const response=await fetch(`version.json?${Date.now()}`,{cache:'no-store'});if(!response.ok)return;const remote=await response.json(),current=document.querySelector('meta[name="app-version"]')?.content||RELEASE,banner=document.getElementById('updateBanner181');banner.classList.toggle('show',newer181(remote.version,current))}catch(_){}}
  document.getElementById('updateNow181').onclick=async()=>{if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.getRegistration();if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});if(reg.installing||reg.waiting)await Promise.race([new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),new Promise(resolve=>setTimeout(resolve,4000))])}}const url=new URL(location.href);url.searchParams.set('updated',Date.now());location.replace(url.href)};
  window.addEventListener('online',checkUpdate181);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate181()});setTimeout(checkUpdate181,1200);

  window.__v181={buildEpisodes:()=>buildEpisodes(),reviewPackage:reviewPackage181,questionSet:questionSet,release:RELEASE};
  renderAiModes181();
})();
