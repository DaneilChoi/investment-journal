/* v1.83.3 — preload analyses and reuse them until data changes. */
(() => {
  const CURRENT='1.83.3',banner=document.getElementById('updateBanner181'),button=document.getElementById('updateNow181');
  data.version=CURRENT;
  document.querySelector('#appInfoBtn .sub').textContent='v1.83.3 ›';
  document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.83.3';
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
