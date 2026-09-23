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
