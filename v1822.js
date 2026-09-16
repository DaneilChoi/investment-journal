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
  saveData();renderReview();
})();
