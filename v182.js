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
  saveData();applyLang();
})();
