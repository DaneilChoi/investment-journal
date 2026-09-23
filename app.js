/* Investment Journal v1.9 */
/* Investment Journal v1.81
   Local-first review episodes, priority principles, personalized learning,
   personal ChatGPT handoff, and update readiness. */
(() => {
  const RELEASE='1.9';
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

/* Investment Journal v1.82 — automatic episode judgment and 30-second review */
(() => {
  const RELEASE='1.82.1';
  Object.assign(I18N.ko,{
    v182Summary:'사용자 입력을 줄이고, 거래 흐름에서 반복 행동과 다음 행동을 자동으로 먼저 제시합니다.',
    nextVersion:'온라인 AI와 서버 배포는 v1.9에서 안전하게 연결합니다.',
    episodeReview:'종목별 매매 구간 자동 복기',episodeReviewHelp:'매매 이유를 다시 입력하지 않아도 거래 순서·재진입·수량 변화에서 기기가 먼저 판단합니다.',
    snapshotTitle:'30초 투자 복기',evidenceDetails:'판단 근거와 균형 나침반',episodeDetails:'종목별 자동 판단',principleDetails:'최우선 원칙',learningDetails:'도움 자료와 내 ChatGPT',
    localJudge:'기기 내 1차 판단',chatgptJudge:'내 ChatGPT 판단',feedbackPrompt:'이 판단이 내 상황과 맞나요?',agree:'맞아요',disagree:'다른 것 같아요',feedbackAccepted:'✓ 맞는 판단으로 저장했습니다. 다음 복기 신뢰도에 반영됩니다.',feedbackRejected:'↻ 다른 해석이 필요하다고 저장했습니다. 다음 판단과 ChatGPT 복기 자료에 반영됩니다.'
  });
  Object.assign(I18N.en,{
    v182Summary:'Reduces manual input and surfaces repeated behavior and one next action from the trade flow.',
    nextVersion:'Online AI and server deployment are postponed to v1.9 for a secure connection.',
    episodeReview:'Automatic review by trade episode',episodeReviewHelp:'The device makes a first judgment from order, re-entry, and size changes without asking you to re-enter reasons.',
    snapshotTitle:'30-second investment review',evidenceDetails:'Evidence and balance compass',episodeDetails:'Automatic episode judgments',principleDetails:'Priority principle',learningDetails:'Helpful material and my ChatGPT',
    localJudge:'On-device first pass',chatgptJudge:'My ChatGPT judgment',feedbackPrompt:'Does this fit what happened?',agree:'Yes',disagree:'Not quite',feedbackAccepted:'✓ Saved as confirmed and used in the next review.',feedbackRejected:'↻ Saved as needing another interpretation and included in the next ChatGPT review.'
  });

  data.episodeAssessmentFeedback=data.episodeAssessmentFeedback||{};
  data.aiEpisodeAssessments=data.aiEpisodeAssessments||{};
  data.version=RELEASE;

  const review=document.getElementById('reviewScreen');
  const title=review?.querySelector('.section-title');
  if(title&&!document.getElementById('reviewSnapshot182'))title.insertAdjacentHTML('afterend','<div class="card review-snapshot182" id="reviewSnapshot182"></div>');

  function makeDetails(id,label,nodes){
    if(!review||document.getElementById(id))return;
    const valid=nodes.map(x=>typeof x==='string'?document.querySelector(x):x).filter(Boolean);
    if(!valid.length)return;
    const details=document.createElement('details');details.id=id;details.className='review-details182';
    details.innerHTML=`<summary>${label}</summary><div class="details-body182"></div>`;
    review.appendChild(details);const body=details.querySelector('.details-body182');valid.forEach(node=>body.appendChild(node));
  }
  makeDetails('evidenceDetails182','📊 '+(lang==='ko'?'판단 근거와 균형 나침반':'Evidence and balance compass'),['.review-radar-card','#objectiveBehaviorPanel']);
  makeDetails('episodeDetails182','🔎 '+(lang==='ko'?'종목별 자동 판단':'Automatic episode judgments'),['#episodeReviewCard']);
  makeDetails('principleDetails182','🎯 '+(lang==='ko'?'최우선 원칙':'Priority principle'),['#principleFocusCard','#reviewScreen .card:has(#principleSuggestion)','#reviewScreen .principle-vault']);
  makeDetails('learningDetails182','🧠 '+(lang==='ko'?'도움 자료와 내 ChatGPT':'Helpful material and my ChatGPT'),['#tailoredLearningCard','#aiReviewCard']);
  const evidenceDetails=document.getElementById('evidenceDetails182');if(evidenceDetails){evidenceDetails.open=true;evidenceDetails.classList.add('always-open182')}

  function reviewRange(){return weekRange(parseKey(selectedDate))}
  function patternOf(report){
    if(report.lossRapid)return'lossRapid';if(report.rapid)return'rapid';if(report.sizeUps)return'sizeUps';if(report.rows.length>=8&&report.topShare>=.55)return'concentration';return'stable';
  }
  function historyFor(pattern){const base=parseKey(selectedDate),reports=[];for(let i=0;i<4;i++)reports.push(objectiveBehaviorReport(addDays(base,-7*i)));return{reports,count:reports.filter(r=>patternOf(r)===pattern).length}}
  function emotionalCare(report){
    const state=report.topPsych?.[0];
    const ko={recover:'손실을 만회하고 싶은 마음이 올라온 날에는 자신을 탓하기보다 다음 주문 한 번의 속도를 늦추세요.',impatient:'조급함은 능력의 문제가 아니라 속도를 조절하라는 신호입니다. 다음 주문 한 번만 천천히 확인하세요.',anxious:'불안했던 판단을 실패로 낙인찍지 마세요. 수량을 줄이고 확인 시간을 확보하면 됩니다.',excited:'흥분이 올라온 순간을 알아챈 것부터 변화의 시작입니다. 다음에는 주문 전 한 호흡만 더 두세요.',tired:'피곤한 날의 실수는 의지 부족이 아닙니다. 거래 횟수를 줄이는 것도 좋은 원칙입니다.',calm:'차분함을 유지한 흐름은 분명한 강점입니다. 같은 준비 순서를 다음 거래에도 이어가세요.'};
    const en={recover:'When the urge to recover rises, do not blame yourself; slow down just the next order.',impatient:'Impatience is a signal to adjust speed, not a verdict on ability. Slow down one decision.',anxious:'Do not label an anxious decision as personal failure. Reduce size and create time to check.',excited:'Noticing excitement is already the start of change. Add one breath before the next order.',tired:'Mistakes on a tired day are not a lack of willpower. Trading less can be a sound rule.',calm:'Maintaining calm is a real strength. Repeat the same preparation sequence next time.'};
    return state?(lang==='ko'?ko:en)[state]:(lang==='ko'?'마음이 급해졌을 가능성은 있지만 기록만으로 단정하지 않습니다. 실수는 능력의 평가가 아니라 다음 행동 하나를 고칠 자료입니다.':'The record may suggest urgency, but it is not enough to conclude how you felt. A mistake is data for one better action, not a judgment of ability.');
  }
  function localAssessment(report){
    const pattern=patternOf(report),hist=historyFor(pattern),repeat=pattern!=='stable'&&hist.count>=2;
    const facts={lossRapid:`${report.lossRapid}${lang==='ko'?'회 손실 후 빠른 재진입':' fast re-entries after a loss'}`,rapid:`${report.rapid}${lang==='ko'?'회 10분 내 재진입':' re-entries within 10 minutes'}`,sizeUps:`${report.sizeUps}${lang==='ko'?'회 짧은 시간 안의 매수금액 확대':' quick buy-size increases'}`,concentration:`${Math.round(report.topShare*100)}%${lang==='ko'?'가 한 종목에 집중':' concentrated in one security'}`,stable:lang==='ko'?`${report.rows.length}건의 거래에서 뚜렷한 반복 위험은 아직 확인되지 않았습니다.`:`No clear repeated risk was found in ${report.rows.length} trades.`};
    const strengths=report.sourceRatio>=.8?(lang==='ko'?'확인된 자료가 충분해 거래 흐름을 비교할 수 있습니다.':'Verified source coverage is strong enough to compare the flow.'):(lang==='ko'?'기록을 이어가며 행동을 확인하려는 점이 강점입니다.':'Continuing to record and review is a strength.');
    const cautions={lossRapid:lang==='ko'?'손실 직후의 재진입이 만회 행동으로 굳어지는지 살펴볼 필요가 있습니다.':'Watch whether post-loss re-entry is becoming a recovery habit.',rapid:lang==='ko'?'빠른 재진입이 계획된 분할인지 즉흥 대응인지 구분할 필요가 있습니다.':'Separate planned scaling from rushed re-entry.',sizeUps:lang==='ko'?'확신이 커질 때 수량 상한도 함께 커지는 패턴을 주의하세요.':'Watch whether size limits expand with conviction.',concentration:lang==='ko'?'집중 전략이 과잉매매로 넘어가지 않도록 횟수 경계가 필요합니다.':'A trade-count boundary can keep focus from turning into overtrading.',stable:lang==='ko'?'현재는 행동을 단정하기보다 다음 기록을 더 관찰합니다.':'Keep observing rather than forcing a conclusion.'};
    const icons={lossRapid:['📉','⚡','🔄','⏱️'],rapid:['↩️','⚡','🔄','🧭'],sizeUps:['🛒','➕','📈','🛡️'],concentration:['🎯','🔁','🔁','🚧'],stable:['📝','🔍','🧭','🌱']};
    const response=data.episodeAssessmentFeedback[report.key]||'',responseNote=response==='yes'?(lang==='ko'?' 사용자가 이전 판단이 맞다고 확인했습니다.':' The user confirmed the prior judgment.'):response==='no'?(lang==='ko'?' 사용자가 이전 해석과 다르다고 표시해 단정을 보류합니다.':' The user marked the prior interpretation as different, so the conclusion is held lightly.'):'',confidence=response==='yes'&&report.confidence==='medium'?'high':response==='no'?'observing':report.confidence;
    return{observedFact:facts[pattern],strength:strengths,caution:(repeat?(lang==='ko'?`최근 4주 중 ${hist.count}주 반복되었습니다. `:`Repeated in ${hist.count} of the last 4 weeks. `):'')+cautions[pattern]+responseNote,interpretation:report.interpretation,emotionalCare:emotionalCare(report),nextAction:report.action,priorityPrinciple:report.action,confidence,repeat,repeatCount:hist.count,pattern,icons:icons[pattern],source:'local'};
  }
  function currentAssessment(){const r=reviewRange(),saved=data.aiEpisodeAssessments[r.start];return saved?{...localAssessment(objectiveBehaviorReport(parseKey(selectedDate))),...saved,source:'personal-chatgpt'}:localAssessment(objectiveBehaviorReport(parseKey(selectedDate)))}
  function confidenceLabel(v){return lang==='ko'?({high:'높음',medium:'보통',observing:'관찰 중'}[v]||v):({high:'High',medium:'Medium',observing:'Observing'}[v]||v)}

  function renderSnapshot182(){
    const box=document.getElementById('reviewSnapshot182');if(!box)return;const a=currentAssessment(),r=reviewRange(),feedback=data.episodeAssessmentFeedback[r.start]||'';
    box.innerHTML=`<div class="snapshot-head182"><div><div class="snapshot-kicker182">${r.start.slice(5).replace('-','.')}–${r.end.slice(5).replace('-','.')} · ${t('snapshotTitle')}</div><div class="snapshot-title182">${escapeHtml(a.repeat?(lang==='ko'?'반복된 흐름 하나를 먼저 멈춰요':'Pause one repeated pattern first'):(lang==='ko'?'이번 주 행동을 한눈에 봅니다':'Your week at a glance'))}</div></div><span class="judge-badge182 ${a.source==='personal-chatgpt'?'chatgpt':''}">${a.source==='personal-chatgpt'?t('chatgptJudge'):t('localJudge')} · ${confidenceLabel(a.confidence)}</span></div><div class="story182">${a.icons.map((x,i)=>`${i?'<span class="story-arrow182">→</span>':''}<span class="story-node182 ${a.repeat&&i===2?'story-repeat182':''}">${x}</span>`).join('')}</div><div class="snapshot-lines182"><div class="snapshot-line182"><span>👍</span><b>${lang==='ko'?'잘한 점':'Strength'}</b><span>${escapeHtml(a.strength)}</span></div><div class="snapshot-line182"><span>⚠️</span><b>${lang==='ko'?'돌아볼 점':'Review'}</b><span>${escapeHtml(a.caution)}</span></div><div class="snapshot-line182"><span>🎯</span><b>${lang==='ko'?'다음 행동':'Next'}</b><span>${escapeHtml(a.nextAction)}</span></div></div><div class="care182">💛 ${escapeHtml(a.emotionalCare)}</div><div class="feedback182"><small>${t('feedbackPrompt')}</small><button class="secondary ${feedback==='yes'?'active':''}" aria-pressed="${feedback==='yes'}" data-feedback="yes">${feedback==='yes'?'✓ ':''}${t('agree')}</button><button class="secondary ${feedback==='no'?'active':''}" aria-pressed="${feedback==='no'}" data-feedback="no">${feedback==='no'?'✓ ':''}${t('disagree')}</button>${feedback?`<div class="feedback-status182" role="status">${feedback==='yes'?t('feedbackAccepted'):t('feedbackRejected')}</div>`:''}</div>`;
    box.querySelectorAll('[data-feedback]').forEach(b=>b.onclick=()=>{data.episodeAssessmentFeedback[r.start]=b.dataset.feedback;saveData();renderSnapshot182()});
  }

  function episodeJudgment(ep){
    const rows=ep.rows||[],adds=rows.filter((x,i)=>x.trade.type==='buy'&&i>0).length,verified=rows.filter(x=>isHtsTrade(x.trade)||x.trade.ocr?.verified).length;
    let observation=lang==='ko'?`${rows.length}회 체결 흐름`:`${rows.length}-fill sequence`,interpretation=lang==='ko'?'계획된 분할인지 즉흥 대응인지는 기록만으로 단정하지 않습니다.':'The record alone cannot prove whether scaling was planned or impulsive.',action=lang==='ko'?'다음 진입 전 최대 횟수 확인':'Check the maximum entry count before the next entry';
    if(ep.reentry){observation+=lang==='ko'?' · 청산 후 재진입':' · re-entry after exit';interpretation=lang==='ko'?'청산 뒤 다시 들어간 구간으로, 같은 판단을 반복했는지 우선 확인할 대상입니다.':'This episode reopened after an exit and is the first place to check for a repeated decision.';action=lang==='ko'?'재진입 전 10분 멈춤':'Pause 10 minutes before re-entry'}
    else if(adds>=2){observation+=lang==='ko'?` · 추가 매수 ${adds}회`:` · ${adds} adds`;interpretation=lang==='ko'?'짧은 구간에서 수량을 늘린 흐름이 있어 사전 상한 여부를 살펴봅니다.':'Multiple adds make the pre-set size limit worth checking.';action=lang==='ko'?'추가 매수 전 최대 수량 확인':'Check maximum size before adding'}
    return{observation,interpretation,action,confidence:verified===rows.length&&rows.length>=3?'high':rows.length>=2?'medium':'observing'};
  }
  function renderEpisodes182(){
    const box=document.getElementById('episodeReviewList');if(!box)return;const episodes=window.__v181?.buildEpisodes?.()||[];
    if(!episodes.length){box.innerHTML=`<div class="sub">${t('noEpisodes')}</div>`;return}
    const focus=[...episodes].sort((a,b)=>Number(b.reentry)-Number(a.reentry)||b.rows.length-a.rows.length)[0];
    const aiRows=data.aiEpisodeAssessments[reviewRange().start]?.episodeAssessments||[];
    box.innerHTML=episodes.slice(-15).map((ep,index)=>{const local=episodeJudgment(ep),ai=aiRows.find(x=>Number(x.episode)===index+1),j=ai?{observation:ai.observedFact||local.observation,interpretation:ai.interpretation||ai.caution||local.interpretation,action:ai.nextAction||local.action,confidence:ai.confidence||local.confidence}:local,saved=data.episodeAssessmentFeedback[ep.id]||'',buy=ep.rows.filter(x=>x.trade.type==='buy').length,sell=ep.rows.filter(x=>x.trade.type==='sell').length;return`<div class="episode-card auto-episode182 ${ep.id===focus.id?'focus':''}" data-id="${ep.id}"><div class="episode-top"><div><div class="episode-stock">${escapeHtml(ep.stock)} ${ep.code?`<small>${escapeHtml(ep.code)}</small>`:''}</div><div class="episode-meta">${ep.start.slice(5).replace('-','.')} · ${lang==='ko'?'매수':'Buy'} ${buy} / ${lang==='ko'?'매도':'Sell'} ${sell}</div></div><span class="episode-state">${ai?t('chatgptJudge'):(ep.id===focus.id?(lang==='ko'?'우선 복기':'Review first'):confidenceLabel(j.confidence))}</span></div><span class="auto-label182">${lang==='ko'?'관찰된 사실':'Observed fact'}</span><p class="auto-copy182">${escapeHtml(j.observation)}</p><div class="episode-judgment182"><div><b>${lang==='ko'?'가능한 해석':'Possible interpretation'}</b><br>${escapeHtml(j.interpretation)}</div><div><b>${lang==='ko'?'다음 행동':'Next action'}</b><br>${escapeHtml(j.action)}</div></div><div class="episode-feedback182"><button class="secondary ${saved==='yes'?'active':''}" aria-pressed="${saved==='yes'}" data-answer="yes">${saved==='yes'?'✓ ':''}${t('agree')}</button><button class="secondary ${saved==='no'?'active':''}" aria-pressed="${saved==='no'}" data-answer="no">${saved==='no'?'✓ ':''}${t('disagree')}</button>${saved?`<div class="feedback-status182" role="status">${saved==='yes'?t('feedbackAccepted'):t('feedbackRejected')}</div>`:''}</div></div>`}).join('');
    box.querySelectorAll('.auto-episode182').forEach(card=>card.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{data.episodeAssessmentFeedback[card.dataset.id]=b.dataset.answer;saveData();renderEpisodes182()}));
  }

  function package182(){
    const report=objectiveBehaviorReport(parseKey(selectedDate)),episodes=window.__v181?.buildEpisodes?.()||[],model=localAssessment(report);
    const anonymous=episodes.map((ep,i)=>({episode:i+1,fills:ep.rows.length,reentry:Boolean(ep.reentry),open:!ep.end,sequence:ep.rows.map(x=>x.trade.type),verifiedFills:ep.rows.filter(x=>isHtsTrade(x.trade)||x.trade.ocr?.verified).length}));
    const feedbackByEpisode=episodes.map((ep,i)=>({episode:i+1,userFeedback:data.episodeAssessmentFeedback[ep.id]||'not answered'})),facts={tradeCount:report.rows.length,verifiedSourcePercent:Math.round(report.sourceRatio*100),quickReentries:report.rapid,quickReentriesAfterLoss:report.lossRapid,sizeIncreases:report.sizeUps,topSecuritySharePercent:Math.round(report.topShare*100),recordedPsychology:report.topPsych?psychLabel(report.topPsych[0]):null,repeatedInLastFourWeeks:model.repeatCount,overallUserFeedback:data.episodeAssessmentFeedback[report.key]||'not answered'};
    return `당신은 수익 예측이 아니라 투자자의 행동 변화와 마음 회복을 돕는 복기 코치입니다. 관찰 사실과 해석을 분리하고, 심리를 단정하거나 사용자를 비난하지 마세요. 사용자가 맞다고 한 해석은 근거로 활용하고, 다르다고 한 해석은 그대로 반복하지 말고 대안을 검토하세요. 전체 다음 행동은 딱 하나만 고르세요. 각 익명 매매구간도 사용자가 이유를 다시 입력하지 않도록 거래 흐름만으로 판단하되 근거가 부족하면 단정하지 마세요.\n\n종목명·종목코드·계좌정보·가격·원본 CSV·사진을 제거한 요약:\n${JSON.stringify({facts,anonymousEpisodes:anonymous,userFeedbackByEpisode:feedbackByEpisode},null,2)}\n\n설명문 없이 아래 JSON 형식만 반환하세요. episodeAssessments는 입력된 익명 구간 번호와 같은 순서로 작성하세요.\n${JSON.stringify({observedFact:'전체 관찰 사실',strength:'잘한 점',caution:'가장 중요한 반복 위험',interpretation:'가능한 전체 해석',emotionalCare:'마음을 다독이되 행동 변화를 돕는 문장',nextAction:'다음 거래의 구체적 행동 1개',priorityPrinciple:'최우선 원칙 1개',confidence:'high 또는 medium 또는 observing',episodeAssessments:[{episode:1,observedFact:'해당 구간의 관찰 사실',interpretation:'가능한 해석',nextAction:'이 구간에서 배울 행동',emotionalCare:'필요한 경우 짧은 회복 문장',confidence:'high 또는 medium 또는 observing'}],quote:'맞춤 문구',term:'관련 용어',caseSuggestion:'도움될 사례 유형',learningTopic:'학습 주제'},null,2)}`;
  }
  function copyText182(text){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);const el=document.createElement('textarea');el.value=text;document.body.appendChild(el);el.select();document.execCommand('copy');el.remove();return Promise.resolve()}
  function parseAi182(text){let clean=text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');const start=clean.indexOf('{'),end=clean.lastIndexOf('}');if(start<0||end<start)return null;try{const o=JSON.parse(clean.slice(start,end+1));if(!o.observedFact||!o.nextAction||!o.emotionalCare)return null;return o}catch(_){return null}}
  async function copyPackage182(){const text=package182();await copyText182(text);toast(t('packageCopied'));return text}
  async function openChatGPT182(){const text=package182(),copying=copyText182(text),popup=window.open('https://chatgpt.com/','_blank');if(popup)popup.opener=null;await copying;toast(t('packageCopied'));if(!popup)toast(t('popupBlocked'))}
  async function sharePackage182(){const text=package182();if(navigator.share){try{await navigator.share({title:t('aiReviewConnection'),text});return}catch(e){if(e.name==='AbortError')return}}await copyText182(text);toast(t('packageCopied'))}
  function saveAi182(){const input=document.getElementById('aiResult181'),text=input?.value.trim();if(!text)return;const r=reviewRange(),parsed=parseAi182(text);data.aiReviews[r.start]={text,source:'personal-chatgpt',at:new Date().toISOString()};if(parsed)data.aiEpisodeAssessments[r.start]={...parsed,source:'personal-chatgpt',icons:localAssessment(objectiveBehaviorReport(parseKey(selectedDate))).icons,at:new Date().toISOString()};saveData();renderReview();toast(parsed?(lang==='ko'?'내 ChatGPT 판단을 복기에 반영했습니다.':'Applied your ChatGPT judgment to the review.'):t('aiResultSaved'))}
  const copy=document.getElementById('copyReview181'),share=document.getElementById('shareReview181'),open=document.getElementById('openChatGPT181'),save=document.getElementById('saveAiResult181');
  if(copy)copy.onclick=copyPackage182;if(share)share.onclick=sharePackage182;if(open)open.onclick=openChatGPT182;if(save)save.onclick=saveAi182;
  document.querySelector('#aiReviewCard .privacy-note')?.insertAdjacentHTML('afterend',`<div class="ai-format-tip182">${lang==='ko'?'복사된 익명 요약을 내 ChatGPT에 보내고, 받은 JSON 결과를 아래에 붙이면 상단 복기에 반영됩니다.':'Send the copied anonymous summary to your ChatGPT, then paste the JSON result below to apply it.'}</div>`);

  function recommendedPrinciple182(){
    const r=reviewRange(),dismissed=new Set(data.dismissedPrinciples||[]),choices=[];
    const currentAi=data.aiEpisodeAssessments[r.start];if(currentAi?.priorityPrinciple)choices.push({text:currentAi.priorityPrinciple,source:lang==='ko'?'이번 주 내 ChatGPT 판단':'This week · My ChatGPT'});
    Object.keys(data.aiEpisodeAssessments||{}).filter(k=>k<r.start).sort().reverse().slice(0,4).forEach(k=>{const p=data.aiEpisodeAssessments[k]?.priorityPrinciple;if(p)choices.push({text:p,source:lang==='ko'?'이전 내 ChatGPT 판단':'Earlier · My ChatGPT'})});
    for(let i=0;i<5;i++){const report=objectiveBehaviorReport(addDays(parseKey(selectedDate),-7*i));if(report.rows.length)choices.push({text:report.action,source:i===0?(lang==='ko'?'이번 주 거래 판단':'This week’s trades'):(lang==='ko'?`${i}주 전 거래 판단`:`Trades ${i} week${i>1?'s':''} ago`)})}
    (lang==='ko'?['매수 전에 최대 손실과 최대 수량을 먼저 확인하기','재진입 전에 10분 동안 판단 근거 다시 확인하기','한 종목의 하루 최대 거래횟수 정하기']:['Check maximum loss and position size before buying','Recheck the reason for ten minutes before re-entry','Set a daily trade-count limit for one security']).forEach(text=>choices.push({text,source:lang==='ko'?'기기 내 기본 제안':'On-device starter principle'}));
    return choices.find(x=>x.text&&!dismissed.has(x.text));
  }
  window.focusRecommended182=id=>{data.principleFocus[reviewRange().start]=id;saveData();renderReview();toast(lang==='ko'?'이번 주 최우선 원칙으로 정했습니다.':'Set as this week’s priority principle.')};
  function renderPrincipleSuggestion182(){
    const box=document.getElementById('principleSuggestion');if(!box)return;const suggestion=recommendedPrinciple182();if(!suggestion){box.innerHTML=`<div class="sub">${t('noSuggestion')}</div>`;return}const existing=(data.principles||[]).find(p=>p.text===suggestion.text),action=existing?`<button class="primary" style="width:auto" onclick="focusRecommended182('${existing.id}')">🎯 ${lang==='ko'?'이번 주 최우선으로':'Make this week’s priority'}</button>`:`<button class="primary" style="width:auto" onclick="acceptPrincipleSuggestion('${encodeURIComponent(suggestion.text)}')">✓ ${t('addMyPrinciple')}</button>`;
    box.innerHTML=`<span class="principle-source182">${escapeHtml(suggestion.source)}</span><div class="suggestion-text">“${escapeHtml(suggestion.text)}”</div><div class="suggestion-actions">${action}<button class="secondary" onclick="dismissPrincipleSuggestion('${encodeURIComponent(suggestion.text)}')">${t('skipSuggestion')}</button></div><div class="principle-note182">${lang==='ko'?'이번 주 기록이 적으면 이전 기록과 저장된 ChatGPT 판단을 먼저 살펴봅니다.':'When this week is sparse, earlier records and saved ChatGPT judgments are checked first.'}</div>`;
  }
  renderPrincipleSuggestion=renderPrincipleSuggestion182;

  const previousRender=renderReview;
  renderReview=function(){previousRender();renderEpisodes182();renderSnapshot182();renderPrincipleSuggestion182()};
  const previousLang=applyLang;
  applyLang=function(){previousLang();document.querySelector('#evidenceDetails182>summary').textContent='📊 '+t('evidenceDetails');document.querySelector('#episodeDetails182>summary').textContent='🔎 '+t('episodeDetails');document.querySelector('#principleDetails182>summary').textContent='🎯 '+t('principleDetails');document.querySelector('#learningDetails182>summary').textContent='🧠 '+t('learningDetails');renderReview()};

  window.__v182={release:RELEASE,assessment:currentAssessment,reviewPackage:package182,parseAiResult:parseAi182};
  // The final script performs one complete startup render after all extensions load.
})();

/* v1.82.2: do not ask for approval on every trade episode. */
(() => {
  const VERSION='1.82.2';
  data.version=VERSION;
  const isKo=()=>lang==='ko';
  const safe=value=>escapeHtml(String(value??''));
  const week=()=>weekRange(parseKey(selectedDate));
  const report=()=>objectiveBehaviorReport(parseKey(selectedDate));
  const episodes=()=>window.__v181?.buildEpisodes?.()||[];
  function summary(){
    const r=report(),a=window.__v182.assessment(),hasRows=r.rows.length>0;
    const headline=!hasRows?(isKo()?'이번 주는 매매 기록이 없습니다.':'No trades recorded this week.'):
      r.lossRapid?(isKo()?`손실 뒤 10분 안에 재진입한 거래가 ${r.lossRapid}회 있습니다.`:`There ${r.lossRapid===1?'was':'were'} ${r.lossRapid} re-entries within 10 minutes of a loss.`):
      r.rapid?(isKo()?`매도 뒤 10분 안에 재진입한 거래가 ${r.rapid}회 있습니다.`:`There ${r.rapid===1?'was':'were'} ${r.rapid} quick re-entries after a sale.`):
      r.sizeUps?(isKo()?`짧은 시간에 매수 규모를 키운 거래가 ${r.sizeUps}회 있습니다.`:`Buy size increased quickly ${r.sizeUps} time${r.sizeUps===1?'':'s'}.`):
      isKo()?'뚜렷한 반복 행동은 아직 확인되지 않았습니다.':'No clear repeated behavior was found yet.';
    const evidence=!hasRows?(isKo()?'매매가 있는 날의 기록이 쌓이면 비교합니다.':'Comparison starts when trade records are available.'):
      isKo()?`이번 주 거래 ${r.rows.length}건 · 출처 확인 ${r.confirmed}건 · 빠른 재진입 ${r.rapid}회`:`${r.rows.length} trades · ${r.confirmed} verified · ${r.rapid} quick re-entries`;
    const source=a.source==='personal-chatgpt'?(isKo()?'내 ChatGPT 해석':'My ChatGPT interpretation'):(isKo()?'기기 내 분석':'On-device analysis');
    const action=hasRows?a.nextAction:(isKo()?'매매가 있었다면 기록을 입력하고, 없었다면 휴식일로 남기기':'Record any trades, or keep this as a rest day.');
    const box=document.getElementById('reviewSnapshot182');if(!box)return;
    box.innerHTML=`<div class="snapshot-head182"><div><div class="snapshot-kicker182">${week().start.slice(5).replace('-','.')}–${week().end.slice(5).replace('-','.')} · ${isKo()?'이번 주 복기':'Weekly review'}</div><div class="snapshot-title182">${safe(headline)}</div></div><span class="judge-badge182 ${a.source==='personal-chatgpt'?'chatgpt':''}">${source}</span></div><div class="plain-summary182"><div class="summary-point182"><b>${isKo()?'확인된 근거':'Verified facts'}</b><strong>${safe(evidence)}</strong></div><div class="summary-point182"><b>${isKo()?'가능한 해석':'Possible interpretation'}</b><small>${safe(a.caution)}</small></div><div class="summary-point182"><b>${isKo()?'다음 거래에서 한 가지만':'One thing for the next trade'}</b><strong>${safe(action)}</strong></div></div><div class="care182">${safe(a.emotionalCare)}</div>`;
  }
  function comparison(ep,ai){
    const fills=ep.rows.length,reentry=Boolean(ep.reentry),facts=ai?.facts||ai?.objectiveFacts||{};
    const hasFill=facts.fills!==undefined&&facts.fills!==null&&Number.isFinite(Number(facts.fills)),hasReentry=typeof facts.reentry==='boolean';
    const mismatch=(hasFill&&Number(facts.fills)!==fills)||(hasReentry&&facts.reentry!==reentry);
    if(!ai)return{kind:'local',label:isKo()?'기기 내 1차 해석':'On-device first pass',note:isKo()?'개인 ChatGPT 결과가 아직 없어 객관적 체결 흐름만 표시합니다.':'No personal ChatGPT result is saved; showing recorded trade facts only.'};
    if(mismatch)return{kind:'caution',label:isKo()?'AI 설명과 거래 사실이 다릅니다':'AI result conflicts with the trade record',note:isKo()?'체결 건수나 재진입 여부가 원자료와 달라 AI 해석을 확정하지 않았습니다.':'Fill count or re-entry status differs from the trade record; the AI interpretation is not treated as verified.'};
    if(hasFill&&hasReentry)return{kind:'verified',label:isKo()?'체결 사실과 AI 설명이 일치합니다':'AI facts match the trade record',note:isKo()?'체결 건수와 재진입 여부를 대조했습니다. 매매 동기와 감정은 이 비교로 증명되지 않습니다.':'Fill count and re-entry status match. Motive and emotion are not proven by this check.'};
    return{kind:'local',label:isKo()?'AI 해석의 사실 대조는 제한적입니다':'AI interpretation has limited fact checking',note:isKo()?'기존 AI 결과에는 대조할 수치가 없어 해석과 객관적 사실을 따로 보여줍니다.':'The saved AI result has no structured facts to compare, so interpretation and recorded facts remain separate.'};
  }
  function renderEpisodes(){
    const box=document.getElementById('episodeReviewList');if(!box)return;
    const list=episodes(),aiRows=data.aiEpisodeAssessments?.[week().start]?.episodeAssessments||[];
    if(!list.length){box.innerHTML=`<div class="sub">${isKo()?'이번 주에 복기할 매매 구간이 없습니다.':'No trade episode this week.'}</div>`;return}
    box.innerHTML=list.slice(-15).map((ep,i)=>{
      const ai=aiRows.find(x=>Number(x.episode)===i+1),check=comparison(ep,ai),buy=ep.rows.filter(x=>x.trade.type==='buy').length,sell=ep.rows.filter(x=>x.trade.type==='sell').length;
      const observed=isKo()?`체결 ${ep.rows.length}건 · 매수 ${buy}건 · 매도 ${sell}건${ep.reentry?' · 청산 후 재진입':''}`:`${ep.rows.length} fills · ${buy} buys · ${sell} sells${ep.reentry?' · re-entry after exit':''}`;
      const interpretation=ai?.interpretation||ai?.caution||(isKo()?'AI 결과가 없으므로 매매 동기나 실수 여부는 단정하지 않습니다.':'Without an AI result, motive or mistake is not inferred.');
      return`<div class="episode-card auto-episode182"><div class="episode-top"><div><div class="episode-stock">${safe(ep.stock)} ${ep.code?`<small>${safe(ep.code)}</small>`:''}</div><div class="episode-meta">${ep.start.slice(5).replace('-','.')} · ${ep.end?(isKo()?'청산':'Closed'):(isKo()?'보유 중':'Open')}</div></div><span class="episode-state">${ai?(isKo()?'내 ChatGPT':'My ChatGPT'):(isKo()?'기기 내 사실':'On-device facts')}</span></div><div class="crosscheck182"><div><b>${isKo()?'객관적 거래 사실':'Recorded trade facts'}</b>${safe(observed)}</div><div><b>${isKo()?'종목별 해석':'Episode interpretation'}</b>${safe(interpretation)}</div><div><span class="status182 ${check.kind==='local'?'':check.kind}">${safe(check.label)}</span><div class="sub">${safe(check.note)}</div></div></div></div>`;
    }).join('');
  }
  const group=['episodeDetails182','principleDetails182','learningDetails182'].map(id=>document.getElementById(id)).filter(Boolean);
  group.forEach(details=>details.addEventListener('toggle',()=>{if(details.open)group.forEach(other=>{if(other!==details)other.open=false})}));
  const oldRender=renderReview;
  renderReview=function(){oldRender();summary();renderEpisodes()};
  const oldApply=applyLang;
  applyLang=function(){oldApply();summary();renderEpisodes()};
  const oldSave=document.getElementById('saveAiResult181')?.onclick;
  if(oldSave)document.getElementById('saveAiResult181').onclick=function(event){oldSave.call(this,event);renderReview()};
  function reviewPackage(){const dates=week(),choices=Object.entries(data.journals||{}).filter(([day])=>day>=dates.start&&day<=dates.end).map(([,j])=>({goodActions:j.goodActions||[],cautionActions:j.cautionActions||[],psychState:j.psychState||null}));return window.__v182.reviewPackage()+`\n\n${isKo()?'사용자가 직접 선택한 주간 행동·상태(원문 자유글은 개인정보 보호를 위해 제외):':'Weekly actions and states selected by the user (raw free text is omitted for privacy):'}\n${JSON.stringify(choices)}\n\n${isKo()?'전체 기록을 복기하여 잘한 점 하나, 수정할 점 하나, 다음 거래에서 할 방법 하나, 공부할 질문 하나를 중심으로 답하세요. 종목별 지적 목록은 만들지 마세요. 각 episodeAssessments 항목에는 사실 대조를 위한 facts: {fills: 체결건수, reentry: 청산 후 재진입 여부(boolean)}를 추가하세요.':'Review the overall record: one strength, one point to change, one practical next step, and one learning question. Do not produce a stock-by-stock list of criticism. For fact checks add facts: {fills: number of fills, reentry: boolean} to each episodeAssessments item.'}`}
  async function copyPackage(){const value=reviewPackage();if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(value);else{const field=document.createElement('textarea');field.value=value;document.body.appendChild(field);field.select();document.execCommand('copy');field.remove()}toast(isKo()?'익명 복기 자료를 복사했습니다.':'Anonymous review copied.');return value}
  document.getElementById('copyReview181').onclick=copyPackage;
  document.getElementById('openChatGPT181').onclick=async()=>{await copyPackage();const popup=window.open('https://chatgpt.com/','_blank');if(popup)popup.opener=null};
  document.getElementById('shareReview181').onclick=async()=>{const text=reviewPackage();if(navigator.share){try{await navigator.share({title:isKo()?'투자 복기':'Investment review',text});return}catch(e){if(e.name==='AbortError')return}}await copyPackage()};
  window.__v1822={comparison,summary,renderEpisodes,reviewPackage};
  // Review is rendered once after the complete app is ready.
})();

/* v1.83 — one whole-person review, weekly realized return, visual polish */
(() => {
  const VERSION='1.9';
  data.version=VERSION;
  Object.assign(I18N.ko,{weeklyReturn:'주간 실현손익',v182Summary:'전체 행동 복기와 다음 행동을 중심으로 정리했습니다.'});
  Object.assign(I18N.en,{weeklyReturn:'Weekly realized P&L',v182Summary:'Focuses on the overall behavior review and one next action.'});
  const isKo=()=>lang==='ko';
  const safe=x=>escapeHtml(String(x??''));
  const range=()=>weekRange(parseKey(selectedDate));
  function journalSignals(){
    const r=range(),entries=Object.entries(data.journals||{}).filter(([day])=>day>=r.start&&day<=r.end).map(([,j])=>j||{}),good=new Set(),caution=new Set(),states=[];
    entries.forEach(j=>{(j.goodActions||[]).forEach(x=>good.add(x));(j.cautionActions||[]).forEach(x=>caution.add(x));if(j.psychState)states.push(j.psychState);const well=String(j.goodPoint||''),change=String(j.badPoint||'');if(/계획|plan/i.test(well))good.add('plan');if(/원칙|규칙|discipline|rule/i.test(well))good.add('discipline');if(/기다|인내|patient|wait/i.test(well))good.add('patience');if(/추격|chase/i.test(change))caution.add('chasing');if(/충동|조급|impuls|rush/i.test(change))caution.add('impulse');if(/반복|재진입|repeat|re.?entry/i.test(change))caution.add('repeat')});
    return{entries,good,caution,states};
  }
  function guidance(){
    const r=objectiveBehaviorReport(parseKey(selectedDate)),s=journalSignals(),ai=data.aiEpisodeAssessments?.[range().start],recorded=s.entries.length>0,hasTrades=r.rows.length>0;
    const positive=s.good.has('plan')?(isKo()?'계획을 지킨 행동을 스스로 기록했습니다.':'You recorded a decision that followed your plan.'):
      s.good.has('discipline')?(isKo()?'원칙을 지킨 행동을 기록했습니다.':'You recorded a decision that followed your rule.'):
      s.good.has('patience')?(isKo()?'기다린 행동을 기록했습니다.':'You recorded a patient decision.'):
      isKo()?'잘한 행동을 단정할 기록은 아직 부족합니다.':'Not enough evidence yet to name a strength.';
    const concern=s.caution.has('impulse')?(isKo()?'충동적인 결정이 있었는지 돌아볼 필요가 있습니다.':'It may help to revisit an impulsive decision.'):
      s.caution.has('repeat')?(isKo()?'반복 행동을 주의 대상으로 표시했습니다.':'You marked repeated behavior as a concern.'):
      s.caution.has('chasing')?(isKo()?'추격 진입을 주의 행동으로 기록했습니다.':'You marked chasing as a caution.'):
      r.lossRapid?(isKo()?`손실 뒤 10분 내 재진입이 ${r.lossRapid}회 확인됐습니다.`:`${r.lossRapid} post-loss quick re-entries were recorded.`):
      isKo()?'고칠 행동을 단정할 근거가 부족합니다.':'There is not enough evidence to name a behavior to change.';
    const action=r.lossRapid?(isKo()?'손실 매도 뒤에는 같은 종목 주문을 10분만 미루고 이유를 다시 확인해 보세요.':'After a losing exit, wait ten minutes before re-entering and recheck your reason.'):
      s.caution.has('chasing')?(isKo()?'오르는 종목은 주문 전에 목표 가격과 최대 수량을 먼저 적어 보세요.':'Before chasing a rising stock, write down your target price and maximum size.'):
      s.caution.has('repeat')||r.rapid?(isKo()?'재진입 전에 직전 매도 이유가 바뀌었는지 한 번 확인해 보세요.':'Before re-entry, check whether the reason for the last exit has changed.'):
      isKo()?'다음 거래 전 계획·최대 수량·멈출 기준을 한 줄로 적어 보세요.':'Before the next trade, write one line for your plan, maximum size, and stop condition.';
    const study=r.lossRapid||s.caution.has('repeat')?(isKo()?'손실 뒤 재진입이 계획된 판단인지 구분하는 법':'How to distinguish planned re-entry from reacting to a loss'):
      s.caution.has('chasing')?(isKo()?'추격매수와 계획매수의 차이':'The difference between chasing and a planned entry'):
      isKo()?'거래 결과보다 과정을 복기하는 방법':'How to review the process rather than only the result';
    const question=isKo()?`“${study}”에 대해 내 거래 기록을 바탕으로 질문해 보세요.`:`Ask about “${study}” using your own trading record.`;
    return{strength:ai?.strength||positive,caution:ai?.caution||concern,action:ai?.nextAction||action,care:ai?.emotionalCare||(isKo()?'실수는 사람에 대한 평가가 아닙니다. 다음 결정 하나를 더 차분히 만드는 자료로 사용하세요.':'A mistake is not a judgment of you. Use it to make the next decision calmer.'),study:ai?.learningTopic||study,case:ai?.caseSuggestion||question,source:ai?(isKo()?'내 ChatGPT 결과':'My ChatGPT result'):(isKo()?`기기 내 제안 · 기록 ${recorded?s.entries.length:0}일 · 거래 ${hasTrades?r.rows.length:0}건`:`On-device suggestion · ${s.entries.length} journal days · ${r.rows.length} trades`)};
  }
  function renderOverall(){
    const g=guidance(),box=document.getElementById('reviewSnapshot182');if(!box)return;
    box.innerHTML=`<div class="snapshot-head182"><div><div class="snapshot-kicker182">${range().start.slice(5).replace('-','.')}–${range().end.slice(5).replace('-','.')} · ${isKo()?'전체 투자 복기':'Whole-week review'}</div><div class="snapshot-title182">${isKo()?'기록을 바탕으로 다음 한 걸음을 정합니다.':'One next step from your records.'}</div></div><span class="judge-badge182">${safe(g.source)}</span></div><div class="plain-summary182"><div class="summary-point182"><b>${isKo()?'잘한 점':'What went well'}</b><strong>${safe(g.strength)}</strong></div><div class="summary-point182"><b>${isKo()?'고칠 점':'What to change'}</b><strong>${safe(g.caution)}</strong></div><div class="summary-point182"><b>${isKo()?'다음 행동 하나':'One next action'}</b><strong>${safe(g.action)}</strong></div></div><div class="care182">${safe(g.care)}</div>`;
    const panel=document.getElementById('guidance183');if(panel){panel.innerHTML=`<h3>${isKo()?'배움과 실천 제안':'Learn and practice'}</h3><div class="guidance-grid183"><div class="guidance-block183"><b>${isKo()?'이번 주 질문':'Question for this week'}</b><p>${safe(g.study)}</p></div><div class="guidance-block183"><b>${isKo()?'찾아볼 사례':'Example to explore'}</b><p>${safe(g.case)}</p></div><div class="guidance-block183"><b>${isKo()?'바로 시도할 방법':'Method to try'}</b><p>${safe(g.action)}</p></div></div><p class="guidance-source183">${safe(g.source)} · ${isKo()?'기기 내 제안은 외부 자료 검색 결과가 아닙니다.':'On-device suggestions are not live web search results.'}</p><div class="guidance-actions183"><button class="secondary" id="askChatGPT183">${isKo()?'내 ChatGPT에 물어보기':'Ask my ChatGPT'}</button></div>`;panel.querySelector('#askChatGPT183').onclick=()=>document.getElementById('openChatGPT181').click()}
  }
  const snapshot=document.getElementById('reviewSnapshot182');if(snapshot){const panel=document.createElement('section');panel.id='guidance183';panel.className='card guidance183';snapshot.insertAdjacentElement('afterend',panel)}
  function weeklyRealizedRate(start){
    const from=key(start),to=key(addDays(start,6)),events=calculateTradeLedger(to).events.filter(e=>e.date>=from&&e.date<=to&&e.matchedQty>0&&e.costBasis>0),byCurrency={};
    events.forEach(e=>{const c=e.currency||'KRW',group=byCurrency[c]||(byCurrency[c]={pnl:0,basis:0});group.pnl+=e.pnl;group.basis+=e.costBasis});
    return Object.entries(byCurrency).filter(([,v])=>v.basis>0).map(([currency,v])=>({currency,pnl:v.pnl,basis:v.basis,rate:v.pnl/v.basis*100}));
  }
  function renderRate(start=weekStart){
    const el=document.getElementById('sumReturn');if(!el)return;const rates=weeklyRealizedRate(start),note=document.getElementById('sumReturnDelta');
    if(!rates.length){el.textContent='—';el.className='weekly-profit-value';note.textContent=isKo()?'이번 주 실현매도 없음':'No realized sales this week';return}
    el.textContent=rates.map(x=>`${rates.length>1?x.currency+' ':''}${x.rate>=0?'+':''}${x.rate.toFixed(2)}%`).join(' · ');
    el.className='weekly-profit-value '+(rates.every(x=>x.rate>=0)?'positive':rates.every(x=>x.rate<0)?'negative':'');
    note.textContent=isKo()?'실현매도 원가 기준 · 예상 비용 반영':'Realized sale cost basis · estimated charges included';
  }
  const originalReview=renderReview;
  renderReview=function(){originalReview();renderOverall();cleanHeadingIcons()};
  const originalLanguage=applyLang;
  applyLang=function(){originalLanguage();renderOverall();cleanHeadingIcons()};
  function cleanHeadingIcons(){document.querySelectorAll('#reviewScreen h3,#statsScreen h3,#journalScreen h2').forEach(h=>{const node=[...h.childNodes].find(x=>x.nodeType===Node.TEXT_NODE&&x.textContent.trim());if(node)node.textContent=node.textContent.replace(/^\s*[\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u,'')});document.querySelectorAll('#reviewScreen .review-details182:not(.always-open182)>summary').forEach(summary=>summary.textContent=summary.textContent.replace(/^\s*[\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u,''))}
  cleanHeadingIcons();
  document.querySelector('[data-i18n="weeklyReturn"]').textContent=isKo()?'주간 실현손익':'Weekly realized P&L';
  document.querySelector('#appInfoBtn .sub').textContent='v1.9 ›';document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.9';
  window.__v183={weeklyRealizedRate,guidance};
  // Startup rendering and persistence are completed in the final update script.
})();

/* v1.83.3 — preload analyses and reuse them until data changes. */
(() => {
  const CURRENT='1.9',banner=document.getElementById('updateBanner181'),button=document.getElementById('updateNow181');
  data.version=CURRENT;
  document.querySelector('#appInfoBtn .sub').textContent='v1.9 ›';
  document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.9';
  const screenKeys=new Map(),ledgerCache=new Map(),reportCache=new Map();
  let revision=0,warmTimer=0;
  const signature=id=>id==='calendarScreen'?`${revision}|${lang}|${selectedDate}|${key(viewDate)}|${key(weekStart)}`:id==='reviewScreen'?`${revision}|${lang}|${selectedDate}|${key(viewDate)}`:`${revision}|${lang}|${key(statsAnchor)}`;
  const prepare=()=>{if(!window.__screenCache.fresh('calendarScreen'))renderCalendar();if(!window.__screenCache.fresh('reviewScreen'))renderReview();if(!window.__screenCache.fresh('statsScreen'))renderStats()};
  window.__screenCache={fresh:id=>screenKeys.get(id)===signature(id),invalidate:()=>{revision++;screenKeys.clear();ledgerCache.clear();reportCache.clear()},prepare};
  const persistBase=saveData;
  saveData=function(){window.__screenCache.invalidate();const result=persistBase();clearTimeout(warmTimer);warmTimer=setTimeout(prepare,400);return result};
  const ledgerBase=calculateTradeLedger;
  calculateTradeLedger=function(untilDate='9999-12-31'){
    if(ledgerCache.has(untilDate))return ledgerCache.get(untilDate);
    const result=ledgerBase(untilDate);
    if(ledgerCache.size>=8)ledgerCache.delete(ledgerCache.keys().next().value);
    ledgerCache.set(untilDate,result);
    return result;
  };
  const reportBase=objectiveBehaviorReport;
  objectiveBehaviorReport=function(anchor){const week=weekRange(anchor).start,cacheKey=`${lang}|${week}`;if(reportCache.has(cacheKey))return reportCache.get(cacheKey);const report=reportBase(anchor);if(reportCache.size>=8)reportCache.delete(reportCache.keys().next().value);reportCache.set(cacheKey,report);return report};
  const calendarBase=renderCalendar;
  renderCalendar=function(){const result=calendarBase();screenKeys.set('calendarScreen',signature('calendarScreen'));return result};
  const reviewBase=renderReview;
  renderReview=function(){const result=reviewBase();screenKeys.set('reviewScreen',signature('reviewScreen'));return result};
  const statsBase=renderStats;
  renderStats=function(){const result=statsBase();screenKeys.set('statsScreen',signature('statsScreen'));return result};
  const parts=x=>{const p=String(x||'').split('.').map(n=>Number(n)||0);if(p[0]===1&&p[1]===9)p[1]=90;return p};
  const newer=(a,b)=>{const x=parts(a),y=parts(b);for(let i=0;i<Math.max(x.length,y.length);i++){if((x[i]||0)>(y[i]||0))return true;if((x[i]||0)<(y[i]||0))return false}return false};
  let checkedRemote='';
  const setBanner=()=>{const show=newer(checkedRemote,CURRENT);banner.classList.toggle('verified-update',show);banner.classList.toggle('show',show)};
  banner.classList.remove('show');
  new MutationObserver(()=>{if(banner.classList.contains('show')&&!banner.classList.contains('verified-update'))banner.classList.remove('show')}).observe(banner,{attributes:true,attributeFilter:['class']});
  async function check(){try{const response=await fetch(`version.json?check=${Date.now()}`,{cache:'no-store'});if(!response.ok)return;checkedRemote=(await response.json()).version||'';setBanner()}catch(_){banner.classList.remove('show','verified-update')}}
  async function install(){button.disabled=true;button.textContent=lang==='ko'?'업데이트 확인 중…':'Checking update…';try{const reg=await navigator.serviceWorker?.getRegistration?.();if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});if(reg.installing||reg.waiting)await Promise.race([new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),new Promise(resolve=>setTimeout(resolve,4000))])}}finally{const url=new URL(location.href);url.searchParams.set('updated',Date.now());location.replace(url.href)}}
  button.onclick=install;
  window.addEventListener('online',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
  setTimeout(check,300);
  saveData();applyLang();
  window.__v1831={version:CURRENT,newer,check,cache:window.__screenCache};
})();

/* v1.83.5 — concise facts and visual weekly trends. */
(() => {
  const VERSION='1.9';
  data.version=VERSION;
  const ko=()=>lang==='ko',safe=value=>escapeHtml(String(value??''));
  const text=(k,e)=>ko()?k:e;
  function staticCopy(){
    const labels={goodPoint:['내가 잘했다고 느낀 점','What I felt went well'],badPoint:['내가 아쉬웠던 점','What I would revisit'],goodActions:['내가 선택한 행동','Actions I selected'],cautionActions:['다시 보고 싶은 행동','Actions to revisit'],reviewSubtitle:['내가 쓴 복기와 거래 기록을 나란히 봅니다.','See your own reflection alongside the trade record.'],weeklyBehaviorChange:['복기에 적힌 표현의 변화','Changes in recorded reflections'],objectiveTrend:['거래 흐름의 변화','Changes in trade activity'],weeklyBestWorst:['실현손익 상·하위 종목','Highest and lowest realized P&L'],weeklyStatsNote:['횟수와 수익은 결과 자료입니다. 늘거나 줄었다는 사실만으로 매매의 좋고 나쁨을 판단하지 않습니다.','Counts and returns describe results. A change alone does not judge a trade.'],weeklyBalanceTitle:['기록을 그림으로 보기','View recorded patterns'],compassGuide:['기기 내 규칙으로 그린 참고 그림입니다. 실력·수익 점수가 아닙니다.','A rule-based illustration of records, not a skill or profit score.']};
    // Daily-review field headings live in I18N; do not overwrite them from a later patch.
    delete labels.goodPoint;delete labels.badPoint;
    for(const [key,values] of Object.entries(labels))document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el=>{if(el.children.length===0)el.textContent=ko()?values[0]:values[1]});
    document.querySelector('#appInfoBtn .sub').textContent=`v${VERSION} ›`;
    document.querySelector('#appInfoModal .app-info-body h2 span').textContent=`v${VERSION}`;
    document.querySelector('#reviewScreen .compass-note').innerHTML=`<b>${text('참고 그림','Reference illustration')}</b> — ${text('기기 내 규칙으로 기록을 그린 모습이며 실력·수익 점수가 아닙니다.','Drawn from saved records by on-device rules; not a skill or profit score.')}`;
  }
  function latestReflection(week){
    const entries=Object.entries(data.journals||{}).filter(([day,j])=>day>=week.start&&day<=week.end&&(String(j?.goodPoint||'').trim()||String(j?.badPoint||'').trim())).sort((a,b)=>b[0].localeCompare(a[0]));
    return{latest:entries[0],days:entries.length};
  }
  function reviewCopy(){
    const week=weekRange(parseKey(selectedDate)),{latest,days}=latestReflection(week),j=latest?.[1]||{},report=objectiveBehaviorReport(parseKey(selectedDate)),ai=data.aiEpisodeAssessments?.[week.start],box=document.getElementById('reviewSnapshot182');
    const buys=report.rows.filter(row=>row.trade.type==='buy').length,sells=report.rows.filter(row=>row.trade.type==='sell').length,timed=report.rows.filter(row=>row.time).length;
    const own=latest?`<div class="reflection-date184">${safe(latest[0].slice(5).replace('-','.'))} · ${text(`이번 주 기록 ${days}일`,`Recorded on ${days} day(s) this week`)}</div><div class="reflection-pair184"><div><b>${text('내가 잘했다고 느낀 점','What I felt went well')}</b><p>${j.goodPoint?safe(j.goodPoint).replace(/\n/g,'<br>'):text('적은 내용이 없습니다.','No note yet.')}</p></div><div><b>${text('내가 아쉬웠던 점','What I would revisit')}</b><p>${j.badPoint?safe(j.badPoint).replace(/\n/g,'<br>'):text('적은 내용이 없습니다.','No note yet.')}</p></div></div>`:`<p class="reflection-empty184">${text('이번 주에 직접 적은 복기는 아직 없습니다.','You have not written a reflection for this week yet.')}</p>`;
    const question=j.badPoint?text('내가 적은 아쉬운 점은 어떤 상황에서 다시 나타날까요?','When might the concern I noted appear again?'):text('이번 주에 시도한 방식 중 다음에도 확인해 보고 싶은 것은 무엇인가요?','Which approach from this week would I like to examine again?');
    const aiNote=ai?.interpretation||ai?.caution||'';
    const briefFact=report.rows.length?text(`이번 주 기록에는 매수 ${buys}건과 매도 ${sells}건이 있고, 그중 ${timed}건은 체결 시각이 남아 있습니다.`,`This week's record has ${buys} buys and ${sells} sells, with times saved for ${timed} fills.`):text('이번 주에는 확인할 거래 기록이 아직 없습니다.','There are no trade records to review this week.');
    box.innerHTML=`<div class="snapshot-kicker182">${week.start.slice(5).replace('-','.')}–${week.end.slice(5).replace('-','.')} · ${text('이번 주 복기','This week’s reflection')}</div><div class="reflection-block184 self184"><h2>${text('① 내가 쓴 복기','① My own reflection')}</h2>${own}</div><div class="reflection-block184 facts184"><h2>${text('② 거래 기록에서 확인되는 것','② What the trade record shows')}</h2><p>${briefFact}</p></div><div class="reflection-block184 question184"><h2>${text('③ 다시 생각해 볼 질문','③ A question to revisit')}</h2><p>${question}</p></div>${aiNote?`<div class="reflection-ai184"><b>${text('내 ChatGPT가 제안한 해석 · 직접 확인 필요','My ChatGPT’s interpretation · check it yourself')}</b><p>${safe(aiNote)}</p></div>`:''}`;
    const panel=document.getElementById('guidance183');if(panel){const g=window.__v183?.guidance?.();panel.innerHTML=`<h3>${text('더 살펴볼 주제','Topics to explore')}</h3><div class="guidance-grid183"><div class="guidance-block183"><b>${text('공부할 질문','Question to study')}</b><p>${safe(g?.study||'—')}</p></div><div class="guidance-block183"><b>${text('찾아볼 사례 유형','Example to look for')}</b><p>${safe(g?.case||'—')}</p></div></div><p class="guidance-source183">${text('기기 내 참고 제안입니다. 실제 외부 자료를 검색하거나 매매의 좋고 나쁨을 판정한 결과는 아닙니다.','An on-device suggestion, not a live search or a judgment of your trades.')}</p><div class="guidance-actions183"><button class="secondary" id="askChatGPT183">${text('내 ChatGPT에 물어보기','Ask my ChatGPT')}</button></div>`;panel.querySelector('#askChatGPT183').onclick=()=>document.getElementById('openChatGPT181').click()}
    const factSentence=report.rows.length?text(`이번 주에는 ${report.rows.length}건의 체결이 기록됐고, 시각이 확인되는 ${timed}건 중 같은 종목을 10분 안에 다시 산 경우가 ${report.rapid}건 보입니다.`,`This week recorded ${report.rows.length} fills; among ${timed} with times, ${report.rapid} were same-stock re-entries within 10 minutes.`):text('이번 주에는 분석할 체결 기록이 아직 없습니다.','There are no fills to review this week.');
    const objective=document.getElementById('objectiveBehaviorPanel');objective.innerHTML=`<div class="objective-head"><div><h3>${text('거래 기록에서 확인되는 사실','Facts visible in the trade record')}</h3></div></div><p class="fact-sentence185">${factSentence}</p>`;
    const radar=document.querySelector('#reviewRadar svg');if(radar)radar.setAttribute('aria-label',text('기기 내 규칙으로 그린 기록 참고 그림. 투자 실력이나 수익 점수가 아닙니다.','A rule-based record illustration, not a skill or profit score.'));
    document.getElementById('radarState').textContent=text('기록을 살펴보는 참고 그림','A reference illustration of records');
    const centerMark=radar?.querySelector('.compass-hub')?.nextElementSibling;if(centerMark)centerMark.setAttribute('x','250');
    const hub=document.querySelector('#reviewRadar .compass-hub-caption');if(hub)hub.textContent=text('참고 그림','Reference');
    const heading=document.querySelector('#principleSuggestion')?.parentElement?.querySelector('h3');if(heading)heading.textContent=text('검토해 볼 원칙 후보','A rule to consider');
  }
  function statsCopy(){
    const current=weekRange(statsAnchor),previous=weekRange(addDays(statsAnchor,-7)),a=weeklyBehaviorMetrics(previous),b=weeklyBehaviorMetrics(current),defs=[[text('계획','Plan'),'plan'],[text('원칙','Rule'),'discipline'],[text('기다림','Waiting'),'patience'],[text('충동','Impulse'),'impulse'],[text('반복','Repeat'),'repeat']];
    document.getElementById('behaviorChanges').innerHTML=`<p class="neutral-note184">${text('이번 주 복기 표현을 날짜별 막대로 그렸습니다. 높낮이만으로 매매의 좋고 나쁨을 판단하지 않습니다.','Daily bars show recorded reflection terms, not trade quality.')}</p>`+defs.map(([name,key])=>`<div class="week-chart-row visual185"><b>${name}</b>${bars(b.days.map(day=>day[key]),false)}<span class="week-state">${text('이번 주','This week')}</span></div>`).join('');
    const prior=objectiveBehaviorReport(addDays(statsAnchor,-7)),now=objectiveBehaviorReport(statsAnchor),flow=[[text('10분 내 재진입','Re-entry within 10m'),'rapid'],[text('손실 매도 후 빠른 재진입','Quick re-entry after a loss'),'lossRapid'],[text('매수금액 확대','Increased buy size'),'sizeUps']];
    const direction=(before,after)=>after>before?['↑',text('늘었어요','Increased'),'up185']:after<before?['↓',text('줄었어요','Decreased'),'down185']:['→',text('변화 없음','No change'),'flat185'];
    document.getElementById('objectiveTrendPanel').innerHTML=`<p class="neutral-note184">${text('지난주와 비교한 거래 흐름의 방향입니다. 화살표는 좋고 나쁨의 평가가 아닙니다.','Direction versus last week; arrows do not rate trade quality.')}</p><div class="flow-list185">${flow.map(([name,key])=>{const [arrow,label,kind]=direction(prior[key],now[key]);return `<div class="flow-row185"><b>${name}</b><span class="flow-direction185 ${kind}"><strong>${arrow}</strong> ${label}</span></div>`}).join('')}</div>`;
    const cards=document.querySelectorAll('#weeklyBestWorstPanel .best-worst-card');cards.forEach((card,index)=>{const title=card.querySelector('h4');if(title)title.textContent=index===0?text('실현손익 상위','Highest realized P&L'):text('실현손익 하위','Lowest realized P&L');const note=card.querySelector('.ai-process-note');if(note)note.textContent=text('손익만으로 이 매매 방식의 가치를 판단할 수 없습니다.','P&L alone cannot establish the value of this approach.')});
    const footer=document.querySelector('#weeklyBestWorstPanel .guide-note');if(footer)footer.textContent=text('해당 기간의 실현매도 결과입니다. 계획 여부와 시장 상황은 별도로 살펴봐야 합니다.','Results of realized sales in this period. Plan and market context require separate review.');
  }
  const renderReviewBase184=renderReview;renderReview=function(){renderReviewBase184();reviewCopy();staticCopy()};
  const renderStatsBase184=renderStats;renderStats=function(){renderStatsBase184();statsCopy();staticCopy()};
  const applyLangBase184=applyLang;applyLang=function(){applyLangBase184();reviewCopy();statsCopy();staticCopy()};
  staticCopy();reviewCopy();statsCopy();
  window.__v1835={version:VERSION,reviewCopy,statsCopy};
})();

/* v1.84 — Quiet Report + Theme Flow design and lightweight weekly planning. */
(() => {
  const VERSION='1.9';
  const text=(ko,en)=>lang==='ko'?ko:en;
  const safe=value=>escapeHtml(String(value??''));
  data.version=VERSION;
  data.weeklyNotes=data.weeklyNotes||{};

  Object.assign(I18N.ko,{
    weeklyWorkspace:'이번 주 투자 노트',weeklyWorkspaceEn:'WEEKLY REPORT',weeklyThemes:'테마 흐름',weeklyWatchlist:'관심 종목',weeklyPlan184:'이번 주 매매 계획',weeklyNoteHint:'선택 입력입니다. 이후 온라인 AI 연결 시 뉴스와 거래기록을 바탕으로 자동 정리할 예정입니다.',dailyTheme:'오늘의 대표 테마',dailyThemeHint:'예: 로봇 · 바이오 · 반도체',carryOneThing:'지난 기록에서 이어갈 한 가지',v184Summary:'A안의 차분한 리포트 구조와 B안의 테마 흐름을 결합하고, 날짜별 테마와 주간 관심 종목·매매 계획을 선택적으로 기록할 수 있게 했습니다.'
  });
  Object.assign(I18N.en,{
    weeklyWorkspace:'This week’s investment note',weeklyWorkspaceEn:'WEEKLY REPORT',weeklyThemes:'Theme flow',weeklyWatchlist:'Watchlist',weeklyPlan184:'Trading plan for this week',weeklyNoteHint:'Optional. A future online AI connection can organize this from news and trade records.',dailyTheme:'Main theme today',dailyThemeHint:'e.g. Robotics · Biotech · Semiconductors',carryOneThing:'One thing to carry forward',v184Summary:'Combines the calm report structure of A with the theme flow of B, with optional daily themes, a weekly watchlist, and a trading plan.'
  });

  function weekFor(value){return weekRange(value instanceof Date?value:parseKey(value||selectedDate))}
  function compactDay(date){const d=parseKey(date);return lang==='ko'?`${d.getMonth()+1}.${d.getDate()}`:d.toLocaleDateString('en-US',{month:'numeric',day:'numeric'})}
  function dailyTheme(date){return String(data.journals?.[date]?.theme184||'').trim()}
  function weeklyNote(range=weekFor(selectedDate)){return data.weeklyNotes[range.start]||(data.weeklyNotes[range.start]={watchlist:'',plan:''})}

  function installHomeStructure(){
    const screen=document.getElementById('calendarScreen');
    if(!screen||document.getElementById('weeklyNote184'))return;
    const calendarCard=Array.from(screen.children).filter((el)=>el.classList&&el.classList.contains('card'))[1];
    const report=document.createElement('section');
    report.id='weeklyNote184';
    report.className='card weekly-note184';
    report.innerHTML=`<div class="weekly-note-head184"><div><span class="kicker184">WEEKLY REPORT</span><h2 data-i18n="weeklyWorkspace">이번 주 투자 노트</h2></div><span id="weeklyNoteRange184"></span></div><div id="themeFlow184" class="theme-flow184"></div><div class="weekly-note-grid184"><label class="weekly-field184"><b data-i18n="weeklyWatchlist">관심 종목</b><input id="weeklyWatchlist184" maxlength="180" placeholder="예: 파인엠텍, 현대약품, S-Oil"></label><label class="weekly-field184"><b data-i18n="weeklyPlan184">이번 주 매매 계획</b><textarea id="weeklyPlan184" maxlength="320" placeholder="예: 거래대금 상위 종목의 첫 눌림까지 기다린다."></textarea></label><div class="weekly-note-help184" data-i18n="weeklyNoteHint"></div></div>`;
    calendarCard.insertAdjacentElement('afterend',report);
    const saveWeekly=()=>{const r=weekFor(selectedDate),note=weeklyNote(r);note.watchlist=document.getElementById('weeklyWatchlist184').value.trim();note.plan=document.getElementById('weeklyPlan184').value.trim();saveData()};
    report.querySelectorAll('input,textarea').forEach(el=>{el.addEventListener('change',saveWeekly);el.addEventListener('blur',saveWeekly)});
  }

  function installDailyTheme(){
    if(document.getElementById('dailyTheme184'))return;
    const before=document.querySelector('#journalScreen .journal-card');
    if(!before)return;
    const card=document.createElement('div');
    card.className='card journal-card daily-theme-card184';
    card.innerHTML=`<h2><span data-i18n="dailyTheme">오늘의 대표 테마</span><small data-i18n="dailyThemeHint">예: 로봇 · 바이오 · 반도체</small></h2><input id="dailyTheme184" class="daily-theme-input184" maxlength="28" placeholder="로봇"></input>`;
    before.insertAdjacentElement('beforebegin',card);
    const input=card.querySelector('input');
    const saveTheme=()=>{const j=data.journals[selectedDate]||(data.journals[selectedDate]={});j.theme184=input.value.trim();saveData();decorateCalendarThemes();renderWeeklyWorkspace()};
    input.addEventListener('change',saveTheme);input.addEventListener('blur',saveTheme);
  }

  function renderCover184(){
    const title=document.getElementById('personalCoverTitle');
    if(title){const own=data.journalTitle.trim()||text('나의 투자일지','My Investment Journal');title.innerHTML=`${safe(own)}<span class="cover-en184">| MY INVESTMENT JOURNAL</span>`}
    const pattern=document.getElementById('coverBehaviorPattern');
    if(pattern){const report=objectiveBehaviorReport(new Date()),action=report.rows.length?report.action:text('기록이 쌓이면 다음 주에 이어갈 한 가지를 보여드립니다.','One point to carry forward will appear as records build.');pattern.innerHTML=`<b>${text('지난 기록에서 이어갈 한 가지','One thing to carry forward')}</b><span>${safe(action)}</span>`}
  }

  function decorateCalendarThemes(){
    document.querySelectorAll('#days .day').forEach(day=>{
      day.querySelector('.day-theme184')?.remove();
      day.classList.remove('has-theme184');
      const theme=dailyTheme(day.dataset.date),label=document.createElement('span');
      label.className='day-theme184'+(theme?'':' empty');
      label.textContent=theme||'—';
      day.appendChild(label);
      if(theme)day.classList.add('has-theme184');
    });
  }

  function renderWeeklyWorkspace(){
    const box=document.getElementById('weeklyNote184');if(!box)return;
    const r=weekFor(selectedDate),note=weeklyNote(r),range=document.getElementById('weeklyNoteRange184');
    range.textContent=`${compactDay(r.start)}–${compactDay(r.end)}`;
    const days=[];for(let i=1;i<=5;i++){const date=key(addDays(r.s,i)),d=parseKey(date),weekday=lang==='ko'?['일','월','화','수','목','금','토'][d.getDay()]:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];days.push(`<div class="theme-day184"><b>${weekday} ${d.getDate()}</b><span>${safe(dailyTheme(date)||'—')}</span></div>`)}
    document.getElementById('themeFlow184').innerHTML=days.join('');
    document.getElementById('weeklyWatchlist184').value=note.watchlist||'';
    document.getElementById('weeklyPlan184').value=note.plan||'';
  }

  function updateStatic184(){
    const appInfo=document.querySelector('#appInfoBtn .sub');if(appInfo)appInfo.textContent=`v${VERSION} ›`;
    const appInfoVersion=document.querySelector('#appInfoModal .app-info-body h2 span');if(appInfoVersion)appInfoVersion.textContent=`v${VERSION}`;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const value=I18N[lang]?.[el.dataset.i18n];if(value&&el.children.length===0)el.textContent=value});
  }

  installHomeStructure();installDailyTheme();

  const renderCalendarBase184=renderCalendar;
  renderCalendar=function(){renderCalendarBase184();decorateCalendarThemes();renderWeeklyWorkspace();renderCover184();updateStatic184()};
  const renderJournalBase184=renderJournal;
  renderJournal=function(){renderJournalBase184();const input=document.getElementById('dailyTheme184');if(input)input.value=dailyTheme(selectedDate);renderCover184();updateStatic184()};
  const renderPersonalCoverBase184=renderPersonalCover;
  renderPersonalCover=function(){renderPersonalCoverBase184();renderCover184()};
  const applyLangBase184=applyLang;
  applyLang=function(){applyLangBase184();renderWeeklyWorkspace();renderCover184();updateStatic184()};

  renderCover184();decorateCalendarThemes();renderWeeklyWorkspace();renderJournal();updateStatic184();
  window.__v184={version:VERSION,renderWeeklyWorkspace,decorateCalendarThemes};
})();

/* v1.85 — connect selection, themes, market context, trades and review. */
(() => {
  const VERSION='1.9';
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
  document.querySelector('#appInfoBtn .sub').textContent='v1.9 ›';document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.9';const summary=document.querySelector('#appInfoModal [data-i18n="v184Summary"]');if(summary){summary.dataset.i18n='v185Summary';summary.textContent=t('v185Summary')}
  ensureBackgroundSetting();applyBackground();extendWeeklyReport();renderSelectionReview();bindAiActions();decorateAiResult();
  window.__v185={version:VERSION,weekContext,reviewPackage:reviewPackage185,renderSelectionStats};
})();

/* Personal completion release: Saturday–Friday weeks and one compact AI review. */
(() => {
  const VERSION='1.9';
  const ko=()=>lang==='ko';
  const text=(kr,en)=>ko()?kr:en;
  const safe=value=>escapeHtml(String(value??''));
  const saturdayWeek=anchor=>{const d=new Date(anchor),base=new Date(d.getFullYear(),d.getMonth(),d.getDate()),back=(base.getDay()+1)%7,s=addDays(base,-back),e=addDays(s,6);return{start:key(s),end:key(e),s,e,tradeStart:key(addDays(s,2)),tradeEnd:key(e)}};
  weekRange=saturdayWeek;
  weekText=r=>fmtCompactRange(r.tradeStart||key(addDays(r.s,2)),r.tradeEnd||r.end);
  data.version=VERSION;data.settings=data.settings||{};

  Object.assign(I18N.ko,{v190Summary:'개인 사용 완결판 · 토요일부터 다음 금요일까지 한 주로 보고, 주간 AI 복기를 한 곳에 정리했습니다.',aiWeekly190:'이번 주 AI 복기',aiWeeklyHelp190:'주간 기록을 개인 ChatGPT에 보내 세 가지만 확인합니다.',aiFact190:'확인된 사실',aiConnection190:'놓쳤을 수 있는 연결',aiNext190:'다음 주 행동 하나',askAi190:'개인 ChatGPT로 복기',pasteAi190:'결과 붙여넣기·수정',applyAi190:'결과 반영',aiEmpty190:'아직 AI 복기 결과가 없습니다.',aiApplied190:'이번 주 AI 복기를 반영했습니다.',weekRule190:'주말 준비 포함 · 월~금 거래주',backgroundSubtle190:'은은하게',backgroundClear190:'선명하게',backgroundStrong190:'진하게'});
  Object.assign(I18N.en,{v190Summary:'Personal completion release · Saturday–Friday weeks with one compact weekly AI review.',aiWeekly190:'Weekly AI review',aiWeeklyHelp190:'Send the weekly record to your personal ChatGPT and check only three things.',aiFact190:'Verified fact',aiConnection190:'A connection you may have missed',aiNext190:'One action next week',askAi190:'Review with my ChatGPT',pasteAi190:'Paste or edit result',applyAi190:'Apply result',aiEmpty190:'No AI review saved yet.',aiApplied190:'Applied the weekly AI review.',weekRule190:'Weekend preparation · Mon–Fri trading week',backgroundSubtle190:'Subtle',backgroundClear190:'Clear',backgroundStrong190:'Strong'});

  function migrateWeeklyKeys(){
    if(data.settings.weekBoundary190Migrated)return;
    const names=['weeklyNotes','weeklyGoals','aiReviews','aiEpisodeAssessments','aiPreparationHashes','principleFocus','reviewAnswers','behaviorFeedback'];
    names.forEach(name=>{const source=data[name];if(!source||typeof source!=='object')return;Object.keys(source).forEach(oldKey=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(oldKey))return;const d=parseKey(oldKey);if(d.getDay()!==0)return;const newKey=key(addDays(d,-1));if(source[newKey]===undefined)source[newKey]=source[oldKey];else if(name==='weeklyNotes')source[newKey]={...source[oldKey],...source[newKey]};delete source[oldKey]})});
    data.settings.weekBoundary190Migrated=true;saveData();
  }
  migrateWeeklyKeys();

  function tradeWeekLabel(r){return `${fmtCompactRange(r.tradeStart,r.tradeEnd)} ${text('거래주','trading week')}`}
  function refreshWeekPresentation(){
    const r=saturdayWeek(parseKey(selectedDate));
    renderWeekSummary(r.s);
    const current=key(r.s)===key(saturdayWeek(new Date()).s),title=document.getElementById('summaryTitle'),compare=document.getElementById('compareLabel');
    if(title)title.textContent=`${tradeWeekLabel(r)}${current?text(' (이번주)',' (This week)'):''}`;
    const previous=saturdayWeek(addDays(r.s,-7));if(compare)compare.textContent=text(`지난 거래주 (${fmtCompactRange(previous.tradeStart,previous.tradeEnd)}) 비교`,`Previous trading week (${fmtCompactRange(previous.tradeStart,previous.tradeEnd)})`);
    const tradeDays=[];for(let d=parseKey(r.tradeStart);d<=parseKey(r.tradeEnd);d=addDays(d,1)){const rows=data.trades[key(d)]||[];if(rows.length)tradeDays.push(rows.length)}
    const avg=tradeDays.length?tradeDays.reduce((a,b)=>a+b,0)/tradeDays.length:0,sumTrades=document.getElementById('sumTrades');if(sumTrades)sumTrades.textContent=`${avg.toFixed(1)}${text('회/거래일',' / trading day')}`;
    const range=document.getElementById('weeklyNoteRange184');if(range)range.innerHTML=`${fmtCompactRange(r.tradeStart,r.tradeEnd)}<br><span class="market-week-label190">${t('weekRule190')}</span>`;
    const flow=document.getElementById('themeFlow184');if(flow){const days=[];for(let i=2;i<=6;i++){const date=key(addDays(r.s,i)),d=parseKey(date),weekday=ko()?['일','월','화','수','목','금','토'][d.getDay()]:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],theme=String(data.journals?.[date]?.theme184||'').trim();days.push(`<div class="theme-day184"><b>${weekday} ${d.getDate()}</b><span>${safe(theme||'—')}</span></div>`)}flow.innerHTML=days.join('')}
  }

  function ensureBackgroundLevels(){
    const control=document.querySelector('.personal-bg-control185');if(!control||control.querySelector('.background-levels190'))return;const levels=document.createElement('div');levels.className='background-levels190';levels.innerHTML=`<button type="button" class="secondary" data-bg-level=".10" data-i18n="backgroundSubtle190">은은하게</button><button type="button" class="secondary" data-bg-level=".18" data-i18n="backgroundClear190">선명하게</button><button type="button" class="secondary" data-bg-level=".26" data-i18n="backgroundStrong190">진하게</button>`;control.appendChild(levels);levels.querySelectorAll('button').forEach(button=>button.onclick=()=>{data.settings.backgroundOpacity190=Number(button.dataset.bgLevel);saveData();applyBackgroundLevel();renderBackgroundLevels()});renderBackgroundLevels();applyBackgroundLevel();
  }
  function applyBackgroundLevel(){document.documentElement.style.setProperty('--personal-bg-opacity190',String(data.settings.backgroundOpacity190||.18))}
  function renderBackgroundLevels(){const value=Number(data.settings.backgroundOpacity190||.18);document.querySelectorAll('[data-bg-level]').forEach(button=>button.classList.toggle('active',Number(button.dataset.bgLevel)===value))}

  function weekJournalContext(r){
    const entries=[];for(let d=new Date(r.s);d<=r.e;d=addDays(d,1)){const date=key(d),j=data.journals?.[date]||{},trades=(data.trades?.[date]||[]).filter(x=>x.type==='buy'||x.type==='sell');if(trades.length||j.theme184||j.goodPoint||j.badPoint||j.marketAnalysis)entries.push({date,theme:j.theme184||null,marketNote:j.marketAnalysis||null,goodPoint:j.goodPoint||null,badPoint:j.badPoint||null,mood:j.mood||null,psychology:j.psychState||null,stocks:[...new Set(trades.map(x=>x.stock||x.code).filter(Boolean))],buyFills:trades.filter(x=>x.type==='buy').length,sellFills:trades.filter(x=>x.type==='sell').length})}return entries;
  }
  function aiPrompt190(){
    const r=saturdayWeek(parseKey(selectedDate)),note=data.weeklyNotes?.[r.start]||{},report=objectiveBehaviorReport(parseKey(selectedDate)),context={tradingWeek:`${r.tradeStart}~${r.tradeEnd}`,weekendPreparation:`${r.start}~${key(addDays(r.s,1))}`,selectionChecks:note.signals||[],watchlist:note.shareStockNames===false?'hidden':note.watchlist||'',selectionMemo:note.selectionMemo||'',newsMemo:note.newsMemo||'',weeklyPlan:note.plan||'',behaviorFacts:{tradeCount:report.rows.length,verifiedTrades:report.confirmed,quickReentries:report.rapid,quickReentriesAfterLoss:report.lossRapid,buySizeIncreases:report.sizeUps},dailyRecords:weekJournalContext(r)};
    return `당신은 투자 결과를 평가하거나 종목을 추천하는 사람이 아니라, 사용자가 자신의 매매 과정에서 놓친 연결을 발견하도록 돕는 복기 코치입니다.\n\n${JSON.stringify(context,null,2)}\n\n다음 원칙을 지키세요.\n- 거래 횟수나 수익 증감만으로 잘하고 못했다고 판단하지 마세요.\n- 사용자의 감정을 단정하지 말고 가능성으로 표현하세요.\n- 종목과 뉴스는 날짜가 맞는 실제 근거를 확인할 수 있을 때만 연결하세요. 확인할 수 없으면 뉴스 확인 필요라고 쓰세요.\n- 종목별 지적 목록을 만들지 말고 전체 흐름만 보세요.\n- 답변은 아래 JSON만 반환하세요.\n${JSON.stringify({observedFact:'기록에서 확인된 사실 한 문장',missedConnection:'사용자가 놓쳤을 가능성이 있는 연결 한 문장',nextAction:'다음 거래주에 시험할 행동 한 가지',emotionalCare:'사용자를 탓하지 않는 짧은 문장',confidence:'high 또는 medium 또는 observing'},null,2)}`;
  }
  function parseAi(value){let clean=String(value||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');const a=clean.indexOf('{'),b=clean.lastIndexOf('}');if(a<0||b<a)return null;try{const parsed=JSON.parse(clean.slice(a,b+1));return parsed.observedFact&&parsed.nextAction?parsed:null}catch(_){return null}}
  function copyText(value){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(value);const area=document.createElement('textarea');area.value=value;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();return Promise.resolve()}
  function ensureAiCard(){
    if(document.getElementById('aiWeekly190'))return;const card=document.createElement('section');card.id='aiWeekly190';card.className='card ai-weekly190';const anchor=document.getElementById('selectionReview185')||document.getElementById('reviewSnapshot182');anchor?.insertAdjacentElement('afterend',card);
  }
  function renderAiCard(){
    ensureAiCard();const box=document.getElementById('aiWeekly190');if(!box)return;const r=saturdayWeek(parseKey(selectedDate)),saved=data.aiEpisodeAssessments?.[r.start],raw=data.aiReviews?.[r.start]?.text||'',feedback=data.episodeAssessmentFeedback?.[r.start]||'',fact=saved?.observedFact||t('aiEmpty190'),connection=saved?.missedConnection||saved?.selectionAssessment||saved?.interpretation||'—',next=saved?.nextAction||'—';
    box.innerHTML=`<div class="ai-head190"><div><h3>${t('aiWeekly190')}</h3><div class="sub">${t('aiWeeklyHelp190')} · ${tradeWeekLabel(r)}</div></div><span class="context-badge185">${text('개인 ChatGPT','Personal ChatGPT')}</span></div><div class="ai-three190"><div class="ai-line190"><small>${t('aiFact190')}</small><p>${safe(fact)}</p></div><div class="ai-line190"><small>${t('aiConnection190')}</small><p>${safe(connection)}</p></div><div class="ai-line190"><small>${t('aiNext190')}</small><b>${safe(next)}</b></div></div><div class="ai-actions190"><button type="button" class="primary" data-ask-ai190>${t('askAi190')}</button>${saved?`<button type="button" class="secondary danger" data-delete-ai190>${text('결과 삭제','Delete result')}</button>`:''}</div>${saved?`<div class="feedback190"><small>${text('이 해석은 실제와 가까웠나요?','Was this close to your experience?')}</small><button type="button" class="secondary ${feedback==='yes'?'active':''}" data-ai-feedback190="yes">${text('맞아요','Yes')}</button><button type="button" class="secondary ${feedback==='no'?'active':''}" data-ai-feedback190="no">${text('다른 것 같아요','Not really')}</button></div>`:''}<details ${raw?'':'open'}><summary>${t('pasteAi190')}</summary><textarea id="aiResult190" placeholder="ChatGPT JSON 결과를 붙여 넣으세요.">${safe(raw)}</textarea><button type="button" class="secondary" data-apply-ai190>${t('applyAi190')}</button></details>`;
    box.querySelector('[data-ask-ai190]').onclick=async()=>{await copyText(aiPrompt190());const popup=window.open('https://chatgpt.com/','_blank');if(popup)popup.opener=null;toast(text('복기 자료를 복사했습니다. ChatGPT에 붙여 넣어 주세요.','Review copied. Paste it into ChatGPT.'))};
    box.querySelector('[data-apply-ai190]').onclick=()=>{const raw=box.querySelector('#aiResult190').value.trim(),parsed=parseAi(raw);if(!parsed){toast(text('ChatGPT의 JSON 결과를 확인해 주세요.','Check the ChatGPT JSON result.'));return}data.aiReviews=data.aiReviews||{};data.aiEpisodeAssessments=data.aiEpisodeAssessments||{};data.aiReviews[r.start]={text:raw,source:'personal-chatgpt',at:new Date().toISOString()};data.aiEpisodeAssessments[r.start]={...parsed,source:'personal-chatgpt',at:new Date().toISOString()};saveData();renderReview();toast(t('aiApplied190'))};
    box.querySelector('[data-delete-ai190]')?.addEventListener('click',()=>{if(!confirm(text('이 주의 AI 복기 결과를 삭제할까요?','Delete this weekly AI review?')))return;delete data.aiReviews[r.start];delete data.aiEpisodeAssessments[r.start];saveData();renderReview()});
    box.querySelectorAll('[data-ai-feedback190]').forEach(button=>button.onclick=()=>{data.episodeAssessmentFeedback=data.episodeAssessmentFeedback||{};data.episodeAssessmentFeedback[r.start]=button.dataset.aiFeedback190;saveData();renderAiCard()});
  }

  const renderCalendarBefore190=renderCalendar;renderCalendar=function(){renderCalendarBefore190();refreshWeekPresentation();ensureBackgroundLevels()};
  const renderReviewBefore190=renderReview;renderReview=function(){renderReviewBefore190();renderAiCard()};
  const renderStatsBefore190=renderStats;renderStats=function(){renderStatsBefore190();const r=saturdayWeek(statsAnchor),label=document.getElementById('statsWeekLabel');if(label)label.textContent=tradeWeekLabel(r)};
  const applyLangBefore190=applyLang;applyLang=function(){applyLangBefore190();refreshWeekPresentation();ensureBackgroundLevels();renderBackgroundLevels();renderAiCard();document.querySelector('#appInfoBtn .sub').textContent='v1.9 ›';document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.9';const summary=document.querySelector('#appInfoModal [data-i18n]');};

  document.querySelector('#appInfoBtn .sub').textContent='v1.9 ›';document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.9';const info=document.querySelector('#appInfoModal [data-i18n="v185Summary"]')||document.querySelector('#appInfoModal [data-i18n="v184Summary"]');if(info){info.dataset.i18n='v190Summary';info.textContent=t('v190Summary')}const next=document.querySelector('#appInfoModal [data-i18n="nextVersion"]');if(next){next.removeAttribute('data-i18n');next.textContent=text('개인 사용 완결판 · 서버 연결 없음','Personal completion release · no server connection')}
  applyBackgroundLevel();ensureBackgroundLevels();refreshWeekPresentation();renderAiCard();saveData();
  window.__v190={version:VERSION,saturdayWeek,aiPrompt:aiPrompt190,refreshWeekPresentation};
})();

