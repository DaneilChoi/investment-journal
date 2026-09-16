/* v1.83 — one whole-person review, weekly realized return, visual polish */
(() => {
  const VERSION='1.83.2';
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
  document.querySelector('#appInfoBtn .sub').textContent='v1.83.2 ›';document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.83.2';
  window.__v183={weeklyRealizedRate,guidance};
  // Startup rendering and persistence are completed in the final update script.
})();
