/* v1.84 — Quiet Report + Theme Flow design and lightweight weekly planning. */
(() => {
  const VERSION='1.85';
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
