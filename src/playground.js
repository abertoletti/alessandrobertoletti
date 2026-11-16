(() => {
  'use strict';
  const en = document.documentElement.lang === 'en';
  const t = (it, english) => en ? english : it;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const icons = {
    autumn: '<path fill="#bd713c" stroke="none" d="M19 3C5 2 2 9 6 15c5 5 13 0 13-12Z"/><path d="m4 21 11-13m-7 9 0-5m3 2 5-1"/>',
    winter: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M17 19l-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1"/>',
    spring: '<path d="M12 22v-9m0 7c-6 0-6-4-6-4 5-1 6 4 6 4"/><g fill="#d99eaa"><ellipse cx="12" cy="6" rx="3" ry="4"/><ellipse cx="7" cy="10" rx="4" ry="3"/><ellipse cx="17" cy="10" rx="4" ry="3"/><ellipse cx="12" cy="14" rx="3" ry="4"/></g><circle cx="12" cy="10" r="2.5" fill="#e5bd60"/>',
    summer: '<circle cx="12" cy="12" r="4" fill="#e5b75f"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
    none: '<circle cx="12" cy="12" r="8"/><path d="m6 6 12 12"/>',
    tools: '<path d="M4 8h16v12H4zM9 8V4h6v4M4 13h16m-10-2v4h4v-4"/>',
    hammer: '<path fill="#c4c9c7" d="m8 4 5-2 8 7-4 4-7-6-3 3-3-3z"/><path fill="#ac8051" d="m12 10 3 3-9 9-3-3z"/>',
    magnet: '<path d="M5 5v10a7 7 0 0 0 14 0V5h-4v10a3 3 0 0 1-6 0V5Z" fill="#bd6255"/><path d="M5 9h4m6 0h4"/>',
    blower: '<path d="M2 8h12c6 0 6-6 2-6M2 12h18m-18 4h11c6 0 6 6 2 6"/>',
    level: '<rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 7v10m12-10v10"/>',
    restore: '<path d="M4 10a8 8 0 1 1 1 8M4 3v7h7"/>'
  };
  const svg = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="icon icon-${name}">${icons[name]}</svg>`;
  const names = {autumn:t('Autunno','Autumn'),winter:t('Inverno','Winter'),spring:t('Primavera','Spring'),summer:t('Estate','Summer'),none:t('Disattiva','Off')};
  const toolNames = {hammer:t('Martello','Hammer'),magnet:t('Magnete','Magnet'),blower:t('Soffiatore','Blower'),level:t('Livella','Spirit level')};
  const descriptions = {hammer:t('Clicca per colpire. Anche negli spazi vuoti.','Click to strike, even in empty spaces.'),magnet:t('Avvicinati agli elementi: seguiranno il puntatore.','Move near elements: they follow your pointer.'),blower:t('Muovi il puntatore per sollevare foglie, neve e petali.','Move your pointer to lift leaves, snow and petals.'),level:t('Muoviti a destra o sinistra per inclinare la pagina.','Move left or right to tilt the page.')};
  const ui = document.createElement('div');ui.className='environment-controls';
  ui.innerHTML=`<div class="control-group"><button class="environment-button season-toggle" aria-label="${t('Scegli stagione','Choose season')}" aria-expanded="false" aria-controls="season-menu"></button><div class="environment-menu" id="season-menu" hidden><p>${t('Un cambio di atmosfera','A change of atmosphere')}</p>${Object.keys(names).map(s=>`<button data-season-choice="${s}" aria-pressed="false">${svg(s)}<span>${names[s]}</span><span class="selected-mark" aria-hidden="true">✓</span></button>`).join('')}</div></div><div class="control-group"><button class="environment-button tools-toggle" aria-label="${t('Strumenti','Tools')}" aria-expanded="false" aria-controls="tools-menu">${svg('tools')}</button><div class="environment-menu" id="tools-menu" hidden><p>${t('Un po’ di libertà','Room to play')}</p>${Object.keys(toolNames).map(s=>`<button data-tool-choice="${s}" aria-pressed="false">${svg(s)}<span>${toolNames[s]}</span><span class="selected-mark" aria-hidden="true">✓</span></button>`).join('')}<button class="restore-all">${svg('restore')}<span>${t('Ripristina tutto','Restore everything')}</span></button><small>${t('Esc per riporre lo strumento','Esc to put your tool away')}</small></div></div>`;
  document.querySelector('.header-actions').append(ui);
  const dock=document.createElement('div');dock.className='tool-dock';dock.hidden=true;dock.innerHTML='<span></span><button type="button">×</button>';document.body.append(dock);
  dock.querySelector('button').ariaLabel=t('Riponi strumento','Put tool away');
  const recovery=document.createElement('div');recovery.className='recovery';recovery.hidden=true;recovery.innerHTML=`<span>${t('Hai rotto tutto? Ricostruiamo.','Broke something? Let’s rebuild.')}</span><button>${t('Ricostruiamo','Rebuild')}</button><ol>${[t('Analisi','Assess'),t('Priorità','Prioritize'),t('Ricostruzione','Rebuild')].map(x=>`<li>${x}</li>`).join('')}</ol><div class="repair-progress"></div><span role="status" class="repair-status"></span>`;document.body.append(recovery);
  const cursor=document.createElement('div');cursor.className='physical-cursor';cursor.hidden=true;cursor.ariaHidden='true';document.body.append(cursor);
  const canvas=document.createElement('canvas');canvas.className='weather-canvas';canvas.ariaHidden='true';document.body.append(canvas);const ctx=canvas.getContext('2d');
  let W=innerWidth,H=innerHeight,particles=[],surfaces=[],tool='',season='none',last=0,spawn=0,repairing=false,repairStage=0,dirty=true;
  const pointer={x:-1000,y:-1000,inside:false};
  const rand=(a,b)=>a+Math.random()*(b-a);
  const enabled=()=>!document.body.classList.contains('no-play');
  const nodes=[...document.querySelectorAll('main h1,main h2,main h3,main p,main .button,main .text-link,main .project-link,main .portrait,main .skill-tags span,main .company-logos img,main .coming, main .date,main .eyebrow')].filter(el=>!el.closest('.portrait')||el.matches('.portrait'));
  const bodies=nodes.map(el=>({el,x:0,y:0,vx:0,vy:0,angle:0,rotation:0,hit:0,cracks:[]}));
  bodies.forEach(b=>b.el.classList.add('physics-item'));
  function measure() {
    surfaces = [];
    bodies.forEach(b => {
      const r = b.el.getBoundingClientRect();
      b.rect = { x:r.left-b.x, y:r.top+scrollY-b.y, w:r.width, h:r.height };
      if (b.el.matches('h1,h2,h3')) {
        // Each letter has its own real ink height: snow sits on glyphs, not line boxes.
        const style = getComputedStyle(b.el);
        ctx.save(); ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const walker = document.createTreeWalker(b.el, NodeFilter.SHOW_TEXT);
        let text;
        while ((text = walker.nextNode())) {
          for (let i=0; i<text.length; i++) {
            const char = text.textContent[i]; if (!char.trim()) continue;
            const range = document.createRange(); range.setStart(text,i); range.setEnd(text,i+1);
            const box = range.getBoundingClientRect(), ink = ctx.measureText(char);
            const baseline = box.top + (box.height-ink.fontBoundingBoxAscent-ink.fontBoundingBoxDescent)/2 + ink.fontBoundingBoxAscent;
            surfaces.push({x:box.left-b.x+2,y:baseline-ink.actualBoundingBoxAscent+scrollY-b.y+1,w:Math.max(2,box.width-4),body:b,glyph:true});
          }
        }
        ctx.restore();
      } else if (b.el.matches('.button,.portrait,.skill-tags span,.coming')) {
        surfaces.push({x:b.rect.x,y:b.rect.y,w:r.width,body:b});
      }
    });
    // Keep existing particles attached to their recalculated support after resize/font loading.
    particles.forEach(p => { if(p.rest) { const old=p.rest; const next=surfaces.find(s=>s.body===old.body&&Math.abs(s.x-old.x)<10); if(next){p.rest=next;p.offset=Math.min(p.offset,next.w);}else p.rest=null; } });
    dirty=false;
  }
  function resize(){W=innerWidth;H=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;}
  addEventListener('resize',resize);addEventListener('scroll',()=>{pointer.inside=false;},{passive:true});resize();
  document.fonts.ready.then(()=>{dirty=true;});
  function closeMenus(){ui.querySelectorAll('.environment-menu').forEach(e=>e.hidden=true);ui.querySelectorAll('.environment-button').forEach(e=>e.setAttribute('aria-expanded','false'));}
  ui.querySelectorAll('.environment-button').forEach(b=>b.addEventListener('click',()=>{const menu=document.getElementById(b.getAttribute('aria-controls'));const open=menu.hidden;closeMenus();menu.hidden=!open;b.setAttribute('aria-expanded',String(open));}));
  document.addEventListener('click',e=>{if(!ui.contains(e.target))closeMenus();});
  function particle(x,y,rest=null){const p={x,y,vx:rand(-10,15),vy:rand(18,48),size:season==='winter'?rand(1.3,3):rand(7,13),a:rand(0,6.28),spin:rand(-1.4,1.4),phase:rand(0,6.28),color:Math.floor(rand(0,4)),kind:season,rest,age:0,bloom:0};particles.push(p);return p;}
  function setSeason(next){season=next;particles=[];spawn=0;document.body.dataset.season=next;const b=ui.querySelector('.season-toggle');b.setAttribute('aria-label',`${t('Scegli stagione','Choose season')}: ${names[next]}`);b.innerHTML=svg(next)+`<span>${names[next]}</span><span class="chevron">⌄</span>`;ui.querySelectorAll('[data-season-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.seasonChoice===next)));if(dirty)measure();if(next!=='none'&&enabled()){
    surfaces.forEach(s=>{if(next==='winter'&&(s.y<scrollY-60||s.y>scrollY+H+60))return;const count=next==='winter'?Math.min(45,Math.ceil(s.w/6)):next==='autumn'?(s.glyph?(Math.random()<.19?1:0):Math.min(4,Math.ceil(s.w/130))):next==='spring'?(s.glyph?(Math.random()<.05?1:0):1):0;for(let i=0;i<count;i++){const x=s.x+rand(1,Math.max(2,s.w-1));const p=particle(x,s.y-rand(0,3),s);p.offset=x-s.x;p.a=rand(-.5,.5);}});
    for(let i=0;i<(next==='winter'?60:next==='autumn'?12:next==='summer'?5:7);i++)particle(rand(0,W),scrollY+rand(0,H));
  }closeMenus();}
  ui.querySelectorAll('[data-season-choice]').forEach(b=>b.addEventListener('click',()=>{if(!enabled()&&b.dataset.seasonChoice!=='none'&&!reduced.matches)document.querySelector('#play-toggle').click();setSeason(b.dataset.seasonChoice);}));
  function selectTool(next){tool=tool===next?'':next;document.body.dataset.tool=tool;ui.querySelectorAll('[data-tool-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.toolChoice===tool)));cursor.innerHTML=tool?svg(tool):'';cursor.hidden=true;dock.hidden=!tool;dock.querySelector('span').textContent=tool?`${toolNames[tool]} · ${descriptions[tool]}`:'';if(tool&&!enabled()&&!reduced.matches)document.querySelector('#play-toggle').click();closeMenus();}
  ui.querySelectorAll('[data-tool-choice]').forEach(b=>b.addEventListener('click',()=>selectTool(b.dataset.toolChoice)));
  dock.querySelector('button').onclick=()=>selectTool(tool);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const openButton=ui.querySelector('[aria-expanded="true"]');closeMenus();if(openButton)openButton.focus();selectTool(tool);}});
  const excluded=el=>el.closest('header,footer,.tool-dock,.recovery');
  document.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.inside=!excluded(e.target);cursor.hidden=!tool||!pointer.inside||e.pointerType==='touch';cursor.style.transform=`translate(${e.clientX+8}px,${e.clientY+8}px)`;},{passive:true});
  document.addEventListener('pointerleave',()=>{pointer.inside=false;cursor.hidden=true;});
  function nearest(x,y,target){return bodies.find(b=>b.el===target||b.el.contains(target))||bodies.reduce((best,b)=>{const r=b.rect;if(!r)return best;const d=Math.hypot(x-Math.max(r.x,Math.min(x,r.x+r.w)),y-Math.max(r.y,Math.min(y,r.y+r.h)));return !best||d<best.d?{b,d}:best;},null)?.b;}
  function strike(x,y,target){const b=nearest(x,y,target);if(!b)return;b.hit=Math.min(b.hit+1,4);b.el.dataset.damage=b.hit;b.vy=rand(35,70);b.vx=rand(-60,60);b.angle=rand(-3,3)*b.hit;const r=b.rect;const px=Math.max(0,Math.min(r.w,x-r.x)),py=Math.max(0,Math.min(r.h,y-r.y));for(let i=0;i<7;i++){const a=i*Math.PI*2/7+rand(-.2,.2),len=rand(20,65);b.cracks.push([[px,py],[px+Math.cos(a)*len*.5+rand(-5,5),py+Math.sin(a)*len*.5],[px+Math.cos(a)*len,py+Math.sin(a)*len]]);}for(let i=0;i<18;i++)particles.push({kind:'chip',x,y,vx:rand(-180,180),vy:rand(-180,-30),size:rand(2,6),a:rand(0,6),spin:rand(-5,5),age:0,home:{x,y}});recovery.hidden=false;cursor.animate([{rotate:'-40deg'},{rotate:'25deg'},{rotate:'0deg'}],{duration:230});}
  document.addEventListener('pointerdown',e=>{if(!tool||excluded(e.target)||!enabled()||repairing)return;if(e.target.closest('main')){e.stopImmediatePropagation();if(e.pointerType!=='touch')e.preventDefault();}pointer.x=e.clientX;pointer.y=e.clientY;pointer.inside=true;},true);
  document.addEventListener('click',e=>{if(excluded(e.target)||repairing)return;const y=e.clientY+scrollY;
    if(!tool&&season==='spring'){particles.forEach(p=>{if(p.rest&&Math.hypot(p.x-e.clientX,p.y-y)<25)p.bloom=1;});return;}
    if(!tool||!enabled()||!e.target.closest('main'))return;e.preventDefault();e.stopImmediatePropagation();pointer.x=e.clientX;pointer.y=e.clientY;pointer.inside=true;if(tool==='hammer')strike(e.clientX,y,e.target);
  },true);
  const wait=ms=>new Promise(r=>setTimeout(r,reduced.matches||!enabled()?0:ms));
  async function restore(){if(repairing)return;repairing=true;selectTool(tool);recovery.hidden=false;recovery.classList.add('rebuilding');recovery.querySelector('button').disabled=true;const affected=bodies.filter(b=>b.hit||Math.hypot(b.x,b.y)>1);const steps=[t('Replico la mappa dei danni…','Mapping the damage…'),t('Prima gli elementi più danneggiati.','Most damaged elements first.'),t('Ogni pezzo torna al suo posto.','Every piece returns to its place.')];
    for(let stage=1;stage<=3;stage++){repairStage=stage;recovery.dataset.stage=stage;recovery.querySelectorAll('li').forEach((el,i)=>el.classList.toggle('active',i<stage));recovery.querySelector('.repair-status').textContent=steps[stage-1];if(stage===2)affected.sort((a,b)=>b.hit-a.hit).forEach((b,i)=>{b.el.dataset.repairOrder=i+1;});if(stage===3)affected.forEach((b,i)=>{ const r=b.rect; for(let n=0;n<8;n++) particles.push({kind:'chip',x:r.x+rand(-90,r.w+90),y:r.y+rand(-60,r.h+60),vx:0,vy:0,size:rand(2,5),a:rand(0,6),spin:0,age:0,home:{x:r.x+r.w/2,y:r.y+r.h/2}});setTimeout(()=>{b.hit=0;b.cracks=[];b.angle=0;delete b.el.dataset.damage;},reduced.matches?0:i*65);});await wait(stage===3?Math.max(1300,affected.length*65+800):850);}
    bodies.forEach(b=>{b.hit=0;b.cracks=[];b.x=b.y=b.vx=b.vy=b.angle=b.rotation=0;b.el.style.removeProperty('transform');delete b.el.dataset.damage;delete b.el.dataset.repairOrder;});particles=particles.filter(p=>p.kind!=='chip');repairStage=0;repairing=false;recovery.hidden=true;recovery.classList.remove('rebuilding');recovery.querySelector('button').disabled=false;dirty=true;
  }
  recovery.querySelector('button').onclick=restore;ui.querySelector('.restore-all').onclick=()=>{closeMenus();restore();};
  function leaf(p){ctx.fillStyle=['#ab6339','#c48b43','#98633e','#c6a05a'][p.color];ctx.beginPath();ctx.moveTo(-p.size,0);ctx.bezierCurveTo(-p.size*.4,-p.size*.85,p.size*.65,-p.size*.65,p.size,0);ctx.bezierCurveTo(p.size*.3,p.size*.7,-p.size*.5,p.size*.65,-p.size,0);ctx.fill();ctx.strokeStyle='#67492b88';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(-p.size-3,1);ctx.lineTo(p.size,0);for(let i=-1;i<=1;i++){ctx.moveTo(i*p.size*.35,0);ctx.lineTo(i*p.size*.35+3,-p.size*.35);ctx.moveTo(i*p.size*.35,0);ctx.lineTo(i*p.size*.35+3,p.size*.3);}ctx.stroke();}
  function drawParticle(p,time){const sy=p.y-scrollY;if(sy< -35||sy>H+35)return;ctx.save();ctx.translate(p.x,sy);ctx.rotate(p.a);if(p.kind==='autumn'){ctx.scale(1,.6+Math.abs(Math.sin(p.phase+time*.001))*.4);leaf(p);}else if(p.kind==='winter'){ctx.fillStyle='#fff';ctx.shadowColor='#839ba944';ctx.shadowBlur=p.rest?2:0;ctx.beginPath();ctx.ellipse(0,0,p.size*(p.rest?1.8:1),p.size,0,0,Math.PI*2);ctx.fill();}else if(p.kind==='spring'){if(p.rest){ctx.rotate(-p.a);ctx.strokeStyle='#638063';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-4,-10,0,-18);ctx.stroke();ctx.translate(0,-18);const size=p.bloom?6:2.6;for(let i=0;i<5;i++){ctx.rotate(Math.PI*2/5);ctx.fillStyle=['#c98e9f','#e0adbb','#d29fa7','#e4bac1'][p.color];ctx.beginPath();ctx.ellipse(0,-size,size*.65,size,0,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#e8c874';ctx.beginPath();ctx.arc(0,0,2,0,7);ctx.fill();}else{ctx.fillStyle='#dbadbaaa';ctx.beginPath();ctx.ellipse(0,0,p.size*.5,p.size*.25,0,0,7);ctx.fill();}}else if(p.kind==='summer'){ctx.fillStyle=['#d1a258','#e3be73','#b1b9a1','#d9ab67'][p.color];const wing=Math.max(.12,Math.abs(Math.sin(time*.012+p.phase)));ctx.scale(wing,1);ctx.beginPath();ctx.ellipse(-5,-3,6,9,-.5,0,7);ctx.ellipse(5,-3,6,9,.5,0,7);ctx.fill();ctx.fillStyle='#665749';ctx.fillRect(-.7,-5,1.4,11);}else{ctx.globalAlpha=Math.max(0,1-p.age/3);ctx.fillStyle='#8b968d';ctx.beginPath();ctx.moveTo(-p.size,p.size);ctx.lineTo(0,-p.size);ctx.lineTo(p.size,p.size*.5);ctx.fill();}ctx.restore();}
  function loop(time){const dt=Math.min((time-last)/1000||.016,.035);last=time;if(dirty)measure();ctx.clearRect(0,0,W,H);const animate=enabled()&&!reduced.matches&&!document.hidden;
    if(animate){bodies.forEach(b=>{const r=b.rect;let tx=0,ty=b.hit>=3?12:0,angle=b.hit?b.angle:0;const dx=pointer.x-(r.x+r.w/2),dy=pointer.y+scrollY-(r.y+r.h/2);if(tool==='magnet'&&pointer.inside&&Math.hypot(dx,dy)<300){const mass=Math.max(1,Math.sqrt(r.w*r.h)/60);tx=dx*.65/mass;ty=dy*.65/mass;angle=dx*.025/mass;}if(tool==='level'&&pointer.inside){angle=(pointer.x/W-.5)*7;tx=angle*2;}if(repairing&&repairStage<3){tx=b.x;ty=b.y;}b.vx+=(tx-b.x)*36*dt;b.vy+=(ty-b.y)*36*dt;b.vx*=Math.exp(-9*dt);b.vy*=Math.exp(-9*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;b.rotation+=(angle-b.rotation)*Math.min(1,dt*10);if(Math.abs(b.x)+Math.abs(b.y)+Math.abs(b.rotation)>.05)b.el.style.transform=`translate(${b.x}px,${b.y}px) rotate(${b.rotation}deg)`;else b.el.style.removeProperty('transform');});
      spawn+=dt;const interval=season==='winter'?.075:season==='autumn'?.7:2;if(season!=='none'&&!repairing&&spawn>interval&&particles.length<1100){spawn=0;particle(rand(-20,W+20),scrollY-20);}
    }
    const live=surfaces.filter(s=>s.y>scrollY-30&&s.y<scrollY+H+40);
    for(const p of particles){if(animate){p.age+=dt;const py=p.y;const dx=p.x-pointer.x,dy=p.y-(pointer.y+scrollY),dist=Math.hypot(dx,dy);if(tool==='blower'&&pointer.inside&&dist<170){p.rest=null;const force=(1-dist/170)*1800;p.vx+=(dx/Math.max(dist,15)+.7)*force*dt;p.vy+=(dy/Math.max(dist,15)-.65)*force*dt;p.spin+=dt*3;}
        if(repairing&&repairStage===3&&p.kind==='chip'){p.x+=(p.home.x-p.x)*dt*7;p.y+=(p.home.y-p.y)*dt*7;p.age=1; }
        else if(p.rest){p.x=p.rest.x+p.offset+p.rest.body.x;p.y=p.rest.y+p.rest.body.y-2;p.a+=Math.sin(time*.001+p.phase)*dt*.08;}
        else{p.vx*=Math.exp(-.65*dt);p.vy+=((p.kind==='chip'?300:p.kind==='winter'?12:22)-p.vy*.45)*dt;p.x+=(p.vx+Math.sin(time*.0012+p.phase)*(p.kind==='winter'?9:22))*dt;p.y+=p.vy*dt;p.a+=p.spin*dt;if(p.kind==='summer'){p.y+=Math.sin(time*.002+p.phase)*24*dt;}if(p.kind!=='chip'&&p.kind!=='summer'&&p.vy>0&&p.age>.8){const surface=live.find(s=>p.x>s.x&&p.x<s.x+s.w&&py<=s.y+s.body.y&&p.y>=s.y+s.body.y);if(surface){p.rest=surface;p.offset=p.x-surface.x;p.y=surface.y;p.vx=p.vy=0;p.a=rand(-.4,.4);}}}
      }drawParticle(p,time);}
    particles=particles.filter(p=>p.kind==='chip'?p.age<3:p.rest||p.y<scrollY+H+150&&p.x>-350&&p.x<W+350);
    for(const b of bodies){const r=b.rect,y=r.y-scrollY+b.y;if(y>H||y+r.h<0)continue;if(b.cracks.length){ctx.save();ctx.beginPath();ctx.rect(r.x+b.x,y,r.w,r.h);ctx.clip();ctx.translate(r.x+b.x,y);ctx.strokeStyle='#35483c99';ctx.lineWidth=.8;for(const path of b.cracks){ctx.beginPath();path.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}ctx.restore();}
      if(repairing&&(b.hit||Math.hypot(b.x,b.y)>1)){ctx.strokeStyle='#789b95';ctx.lineWidth=1;ctx.setLineDash([4,5]);ctx.strokeRect(r.x-4+b.x,y-4,r.w+8,r.h+8);ctx.setLineDash([]);if(repairStage===1){ctx.fillStyle='#89b9a322';ctx.fillRect(r.x,y,r.w,(time*.12)%(r.h+1));}if(repairStage===2){ctx.fillStyle='#426653';ctx.beginPath();ctx.arc(r.x+r.w,y,11,0,7);ctx.fill();ctx.fillStyle='white';ctx.font='11px Arial';ctx.textAlign='center';ctx.fillText(b.el.dataset.repairOrder,r.x+r.w,y+4);}}
    }
    if(tool==='blower'&&pointer.inside&&animate){ctx.strokeStyle='#79938855';ctx.lineWidth=1;for(let i=0;i<5;i++){const offset=(time*.15+i*30)%150;ctx.beginPath();ctx.ellipse(pointer.x+offset,pointer.y,offset*.3+5,offset*.15+3,0,-.7,.7);ctx.stroke();}}
    requestAnimationFrame(loop);
  }
  new MutationObserver(()=>{if(!enabled()){selectTool(tool);setSeason('none');restore();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
  const current=['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'][new Date().getMonth()];
  setSeason(enabled()&&!reduced.matches?current:'none');requestAnimationFrame(loop);
  // Decorative project stories run once when each card enters the viewport.
  const projects = document.querySelectorAll('.project');
  projects.forEach((project,i) => {
    const story=document.createElement('div');story.className=`project-story ${i===0?'fuel-story':'notes-story'}`;story.setAttribute('aria-hidden','true');
    story.innerHTML=i===0 ? '<span class="road"></span><span class="story-car"><svg viewBox="0 0 80 34" aria-hidden="true"><path d="m9 19 10-3 9-12h24l13 13 9 3v8H5v-6Z" fill="#527f6b"/><path d="m25 15 7-8h17l9 9Z" fill="#d0e2df"/><path d="M42 7v10" stroke="#527f6b" stroke-width="3"/><circle cx="20" cy="27" r="6" fill="#303c36"/><circle cx="62" cy="27" r="6" fill="#303c36"/><circle cx="20" cy="27" r="2.5" fill="#b7c4b8"/><circle cx="62" cy="27" r="2.5" fill="#b7c4b8"/><path d="M70 21h5M5 22h5" stroke="#efdbad" stroke-width="3"/></svg></span><span class="story-pump"><svg viewBox="0 0 28 38" aria-hidden="true"><path d="M4 36V5h15v31M1 36h22" fill="#dfe7dc" stroke="#668273" stroke-width="2"/><path d="M7 8h9v9H7Z" fill="#6e9584"/><path d="m20 8 5 5v16q-4 4-4-2V17" fill="none" stroke="#668273" stroke-width="2"/><path d="M9 24h6" stroke="#668273" stroke-width="2"/></svg></span>' : `<span class="note-word word-one">${t('Idee','Ideas')}</span><span class="note-word word-two">${t('Appunti','Thoughts')}</span><span class="note-word word-three">${t('Da fare','To do')}</span><span class="story-note">✓ Keepify</span>`;
    project.append(story);
  });
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('story-visible');observer.unobserve(entry.target);}}),{threshold:.35});
  projects.forEach(project=>observer.observe(project));
})();
