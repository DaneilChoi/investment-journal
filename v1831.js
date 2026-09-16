/* v1.83.1 — suppress stale update prompts and fetch the new build safely. */
(() => {
  const CURRENT='1.83.1',banner=document.getElementById('updateBanner181'),button=document.getElementById('updateNow181');
  data.version=CURRENT;saveData();
  document.querySelector('#appInfoBtn .sub').textContent='v1.83.1 ›';
  document.querySelector('#appInfoModal .app-info-body h2 span').textContent='v1.83.1';
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
  window.__v1831={version:CURRENT,newer,check};
})();
