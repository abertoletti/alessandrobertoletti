(() => {
  'use strict';
  const en = document.documentElement.lang === 'en';
  const t = (it, english) => en ? english : it;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const icons = {
    autumn: '<path d="M19.5 3.5C12 3 5 6 5 12a6 6 0 0 0 6 6c6 0 8.5-7 8.5-14.5Z" fill="#d4a373" stroke="#9b693f"/><path d="M3.5 21 15 8.5m-7 8v-5m3 2 5-.5" stroke="#9b693f"/>',
    winter: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M17 19l-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1"/>',
    spring: '<path d="M12 21v-7m0 5c-3 0-5-2-5-4 3 0 5 2 5 4" stroke="#729474"/><g fill="#e6b5bf" stroke="#bb7e90" stroke-width="1"><path d="M12 11C7 8 8 3 11 3c2 0 3 4 1 8Z"/><path d="M12 11c1-6 6-8 7-5 1 2-2 5-7 5Z"/><path d="M12 11c6-1 9 3 6 5-2 2-5-1-6-5Z"/><path d="M12 11c3 5 0 9-3 7-2-1-1-5 3-7Z"/><path d="M12 11c-4 4-9 2-8-1 0-3 5-3 8 1Z"/></g><circle cx="12" cy="11" r="2.3" fill="#efd18a" stroke="#c09e55" stroke-width="1"/>',
    summer: '<circle cx="12" cy="12" r="5.5" fill="#edc778" stroke="#bc924a"/><path d="M12 1v1.5m0 19V23M1 12h1.5m19 0H23M4.2 4.2l1.1 1.1m13.4 13.4 1.1 1.1M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1" stroke="#bc924a"/>',
    none: '<path d="M12 2v9M6.5 5.5a8 8 0 1 0 11 0" stroke-width="1.8"/>',
    breeze: '<path d="M2 7h14a3 3 0 1 0-3-3M2 12h20M2 17h14a3 3 0 1 1-3 3" stroke="#718b91" stroke-width="1.8"/>',
  };
  const svg = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="icon icon-${name}">${icons[name]}</svg>`;
  const names = {autumn:t('Autunno','Autumn'),winter:t('Inverno','Winter'),spring:t('Primavera','Spring'),summer:t('Estate','Summer'),none:t('Disattiva','Off')};
  const ui = document.createElement('div');ui.className='environment-controls';
  ui.innerHTML=`<div class="control-group"><button class="environment-button season-toggle" aria-label="${t('Scegli stagione','Choose season')}" aria-expanded="false" aria-controls="season-menu"></button><div class="environment-menu" id="season-menu" hidden><p>${t('Un cambio di atmosfera','A change of atmosphere')}</p>${Object.keys(names).map(s=>`<button data-season-choice="${s}" aria-pressed="false">${svg(s)}<span>${names[s]}</span><span class="selected-mark" aria-hidden="true">✓</span></button>`).join('')}</div></div><button class="environment-button breeze-toggle" aria-pressed="false" aria-label="${t('Brezza','Breeze')}" disabled>${svg('breeze')}<span>${t('Brezza','Breeze')}</span></button>`;
  document.querySelector('.header-actions').append(ui);
  const dock=document.createElement('div');dock.className='tool-dock';dock.hidden=true;dock.innerHTML='<span></span><button type="button">×</button>';document.body.append(dock);
  dock.querySelector('button').ariaLabel=t('Disattiva brezza','Turn breeze off');
  const cursor=document.createElement('div');cursor.className='physical-cursor';cursor.hidden=true;cursor.ariaHidden='true';document.body.append(cursor);
  const sunlight=document.createElement('div');sunlight.className='summer-light';sunlight.setAttribute('aria-hidden','true');document.body.append(sunlight);
  const beach=document.createElement('div');beach.className='beach-end';beach.setAttribute('aria-hidden','true');document.body.append(beach);
  const beachHint=document.createElement('p');beachHint.className='sand-hint';
  beachHint.innerHTML=`<span>${t('Tieni premuto e trascina sulla sabbia per lasciare un segno. Il mare ti aspetta in fondo.','Hold and drag on the sand to leave a mark. The sea awaits at the bottom.')}</span><button type="button">${t('Liscia la sabbia','Smooth the sand')}</button>`;
  document.querySelector('.hero').append(beachHint);
  let sandStrokes=[],sandDrawing=null;
  beachHint.querySelector('button').onclick=()=>{sandStrokes=[];sandDrawing=null;};
  document.addEventListener('pointerdown',e=>{
    if(season!=='summer'||tool||!enabled()||e.button!==0||e.pointerType==='touch'||e.target.closest('a,button,input,select,textarea,header,.tool-dock'))return;
    e.preventDefault();sandDrawing={points:[{x:e.clientX,y:e.clientY+scrollY,opacity:1}],id:e.pointerId};sandStrokes.push(sandDrawing);
    if(sandStrokes.length>100)sandStrokes.shift();
    document.documentElement.setPointerCapture(e.pointerId);
  },true);
  document.addEventListener('pointermove',e=>{
    if(!sandDrawing||e.pointerId!==sandDrawing.id)return;
    const last=sandDrawing.points.at(-1),x=e.clientX,y=e.clientY+scrollY;
    if(Math.hypot(x-last.x,y-last.y)>3&&sandDrawing.points.length<500)sandDrawing.points.push({x,y,opacity:1});
  });
  function endDrawing(e){if(sandDrawing?.id===e.pointerId){sandDrawing=null;if(document.documentElement.hasPointerCapture(e.pointerId))document.documentElement.releasePointerCapture(e.pointerId);}}
  document.addEventListener('pointerup',endDrawing);document.addEventListener('pointercancel',endDrawing);
  function drawSand(){
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    for(const stroke of sandStrokes){
      for(let i=1;i<stroke.points.length;i++){
        const a=stroke.points[i-1],b=stroke.points[i];if(Math.max(a.y,b.y)<scrollY||Math.min(a.y,b.y)>scrollY+H)continue;
        const opacity=Math.min(a.opacity,b.opacity);if(opacity<.02)continue;
        ctx.globalAlpha=opacity;
        for(const [offset,width,color] of [[1.5,4,'#fff3d99c'],[-.7,3,'#9c79455c'],[0,1.2,'#79572c55']]){
          ctx.beginPath();ctx.moveTo(a.x,a.y-scrollY+offset);ctx.lineTo(b.x,b.y-scrollY+offset);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
        }
      }
    }ctx.restore();
  }
  let solarTime=0,solarFrame=0;
  function updateSun(dt){
    solarTime+=dt;solarFrame+=dt;if(solarFrame<.1)return;solarFrame=0;
    const phase=solarTime*Math.PI*2/100-.9;
    const x=50+38*Math.sin(phase),y=10+12*(1-Math.cos(phase));
    document.body.style.setProperty('--sun-x',x.toFixed(2)+'%');
    document.body.style.setProperty('--sun-y',y.toFixed(2)+'%');
    document.body.style.setProperty('--shadow-x',((50-x)*.38).toFixed(2)+'px');
    document.body.style.setProperty('--shadow-y',(10+y*.35).toFixed(2)+'px');
    document.body.style.setProperty('--text-shadow-x',((50-x)*.045).toFixed(2)+'px');
  }
  const canvas=document.createElement('canvas');canvas.className='weather-canvas';canvas.ariaHidden='true';document.body.append(canvas);const ctx=canvas.getContext('2d');
  let W=innerWidth,H=innerHeight,particles=[],surfaces=[],tool='',season='none',last=0,spawn=0,dirty=true;
  const pointer={x:-1000,y:-1000,inside:false};
  const rand=(a,b)=>a+Math.random()*(b-a);
  const enabled=()=>!document.body.classList.contains('no-play');
  const nodes=[...document.querySelectorAll('main h1,main h2,main h3,main p,main .button,main .text-link,main .project-link,main .portrait,main .skill-tags span,main .company-logos img,main .coming, main .date,main .eyebrow')].filter(el=>!el.closest('.portrait')||el.matches('.portrait'));
  const bodies=nodes.map(el=>({el,x:0,y:0}));
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
  addEventListener('resize',resize);addEventListener('scroll',()=>{const under=document.elementFromPoint(pointer.x,pointer.y);pointer.inside=!!under&&!under.closest('header,footer,.tool-dock');},{passive:true});resize();
  document.fonts.ready.then(()=>{dirty=true;});
  function closeMenus(){ui.querySelectorAll('.environment-menu').forEach(e=>e.hidden=true);ui.querySelectorAll('.season-toggle').forEach(e=>e.setAttribute('aria-expanded','false'));}
  ui.querySelectorAll('.season-toggle').forEach(b=>b.addEventListener('click',()=>{const menu=document.getElementById(b.getAttribute('aria-controls'));const open=menu.hidden;closeMenus();menu.hidden=!open;b.setAttribute('aria-expanded',String(open));}));
  document.addEventListener('click',e=>{if(!ui.contains(e.target))closeMenus();});
  function particle(x,y,rest=null){const p={x,y,vx:rand(-10,15),vy:rand(18,48),size:season==='winter'?rand(1.3,3):rand(7,13),a:rand(0,6.28),spin:rand(-1.4,1.4),phase:rand(0,6.28),color:Math.floor(rand(0,4)),kind:season,rest,age:0,restAge:0,restLife:season==='winter'?rand(18,30):rand(12,22),bloom:0};particles.push(p);return p;}
  function setSeason(next){season=next;sandDrawing=null;if(next!=='summer')sandStrokes=[];dirty=true;if(next==='none')selectTool('');ui.querySelector('.breeze-toggle').disabled=next==='none'||!enabled()||reduced.matches;seaWind=0;wetSand=[];particles=[];spawn=0;document.body.dataset.season=next;const b=ui.querySelector('.season-toggle');b.setAttribute('aria-label',`${t('Scegli stagione','Choose season')}: ${names[next]}`);b.innerHTML=svg(next)+`<span>${names[next]}</span><span class="chevron">⌄</span>`;ui.querySelectorAll('[data-season-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.seasonChoice===next)));if(dirty)measure();if(next!=='none'&&enabled()){
    surfaces.forEach(s=>{if(next==='winter'&&(s.y<scrollY-60||s.y>scrollY+H+60))return;const count=next==='winter'?Math.min(45,Math.ceil(s.w/6)):next==='autumn'?(s.glyph?(Math.random()<.19?1:0):Math.min(4,Math.ceil(s.w/130))):0;for(let i=0;i<count;i++){const x=s.x+rand(1,Math.max(2,s.w-1));const p=particle(x,s.y-rand(0,3),s);p.offset=x-s.x;p.restAge=rand(0,p.restLife*.45);p.a=rand(-.5,.5);}});
    for(let i=0;i<(next==='winter'?60:next==='autumn'?12:next==='spring'?5:0);i++)particle(rand(0,W),scrollY+rand(0,H));
  }closeMenus();}
  ui.querySelectorAll('[data-season-choice]').forEach(b=>b.addEventListener('click',()=>{if(!enabled()&&b.dataset.seasonChoice!=='none'&&!reduced.matches)document.querySelector('#play-toggle').click();setSeason(b.dataset.seasonChoice);}));
  function selectTool(next){
    tool=next==='breeze'&&season!=='none'&&enabled()&&!reduced.matches?'breeze':'';
    ui.querySelector('.breeze-toggle').setAttribute('aria-pressed',String(!!tool));
    cursor.innerHTML=tool?svg('breeze'):'';cursor.hidden=true;
    document.body.classList.remove('tool-pointer-active');dock.hidden=!tool;
    dock.querySelector('span').textContent=tool?t('Brezza · Muovi il puntatore o trascina un dito. Esc per fermarla.','Breeze · Move your pointer or drag a finger. Esc to stop.'):'';
    closeMenus();
  }
  ui.querySelector('.breeze-toggle').onclick=()=>selectTool(tool?'':'breeze');
  dock.querySelector('button').onclick=()=>selectTool('');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const openButton=ui.querySelector('[aria-expanded="true"]');closeMenus();if(openButton)openButton.focus();selectTool('');}});
  function moveWind(e){
    const oldX=pointer.x,oldY=pointer.y;
    pointer.x=e.clientX;pointer.y=e.clientY;
    pointer.inside=!e.target.closest('header,footer,.tool-dock');
    pointer.speed=Math.min(1,Math.hypot(pointer.x-oldX,pointer.y-oldY)/70);
    cursor.hidden=!tool||!pointer.inside||e.pointerType==='touch';
    document.body.classList.toggle('tool-pointer-active',!cursor.hidden);
    cursor.style.transform=`translate(${e.clientX-21}px,${e.clientY-21}px)`;
  }
  document.addEventListener('pointermove',moveWind,{passive:true});
  document.addEventListener('pointerdown',moveWind,{passive:true});
  document.addEventListener('pointerup',e=>{if(e.pointerType==='touch')pointer.inside=false;},{passive:true});
  document.addEventListener('pointerleave',()=>{pointer.inside=false;cursor.hidden=true;document.body.classList.remove('tool-pointer-active');});
  document.addEventListener('click',e=>{if(!tool&&season==='spring')particles.forEach(p=>{if(p.rest&&Math.hypot(p.x-e.clientX,p.y-e.clientY-scrollY)<25){p.rest=null;p.flight=null;}});});
  let seaTime=0,seaWind=0;
  let wetSand=[],seaHeight=0;
  const grain=n=>{const value=Math.sin(n*127.1+311.7)*43758.5453;return value-Math.floor(value);};
  function drawSea(dt,animate){
    if(animate){
      const target=tool ? (pointer.inside ? .75+(pointer.speed||0)*.25 : .3) : 0;
      seaWind+=(target-seaWind)*Math.min(1,dt*(target>seaWind?3:1.2));
      seaTime+=dt*(.85+seaWind*.75);pointer.speed=(pointer.speed||0)*.92;
    }
    const depth=W<700?125:170,step=5,count=Math.ceil(W/step)+1;
    if(wetSand.length!==count||seaHeight!==H){wetSand=Array(count).fill(H);seaHeight=H;}
    const front=[];
    for(let i=0;i<count;i++){
      const x=i*step;
      // A fast incoming wash and a longer retreat, offset along the shore.
      const phase=(seaTime*.8+x*.0018+Math.sin(x*.005)*.3)%(Math.PI*2);
      const wash=Math.pow((1-Math.cos(phase))*.5,1.8);
      const coast=Math.sin(x*.003+1)*depth*.12+Math.sin(x*.009)*3;
      const local=seaWind*Math.exp(-Math.pow((x-pointer.x)/200,2));
      const chop=Math.sin(x*.045-seaTime*3.6)*(1+seaWind*3+local*3)+Math.sin(x*.081+seaTime*2)*local*2;
      const y=H-depth*.39-coast-wash*depth*(.43+seaWind*.17)-local*9+chop;
      front.push(y);
      if(animate)wetSand[i]=Math.min(y-5,wetSand[i]+dt*2.7);
      else wetSand[i]=y-9;
    }
    if(animate){
      const shoreOffset=document.documentElement.scrollHeight-H;
      for(const stroke of sandStrokes)for(const point of stroke.points){
        const index=Math.max(0,Math.min(front.length-1,Math.round(point.x/step)));
        if(point.y>shoreOffset+front[index])point.opacity=Math.max(0,point.opacity-dt*.6);
      }
      sandStrokes=sandStrokes.filter(stroke=>stroke===sandDrawing||stroke.points.some(p=>p.opacity>.02));
    }
    ctx.save();
    // Dry sand fades naturally into the page; no hard top edge.
    const sand=ctx.createLinearGradient(0,H-depth-30,0,H);
    sand.addColorStop(0,'#e5cda400');sand.addColorStop(.4,'#e8d2ac45');sand.addColorStop(1,'#ddc098d9');
    ctx.fillStyle=sand;ctx.fillRect(0,H-depth-30,W,depth+30);
    for(let i=0;i<W*.6;i++){
      const x=grain(i)*W,y=H-grain(i+900)*depth;
      ctx.fillStyle=i%3?'#93744c19':'#fff7df66';ctx.fillRect(x,y,grain(i+7)*1.3+.3,.6);
    }
    ctx.beginPath();ctx.moveTo(0,H);wetSand.forEach((y,i)=>ctx.lineTo(i*step,y));ctx.lineTo(W,H);ctx.closePath();
    const wet=ctx.createLinearGradient(0,H-depth,0,H);wet.addColorStop(0,'#a78d6b40');wet.addColorStop(1,'#a78d6b85');ctx.fillStyle=wet;ctx.fill();
    // Each wash spreads a translucent sheet of shallow water over the sand.
    ctx.beginPath();ctx.moveTo(0,H);front.forEach((y,i)=>ctx.lineTo(i*step,y));ctx.lineTo(W,H);ctx.closePath();
    const water=ctx.createLinearGradient(0,H-depth,0,H);
    water.addColorStop(0,'#b7d7c652');water.addColorStop(.4,'#91c7bba3');water.addColorStop(.78,'#529faaa8');water.addColorStop(1,'#347f91cc');
    ctx.fillStyle=water;ctx.fill();ctx.save();ctx.clip();
    // Broken, moving reflections replace the previous parallel stripes.
    for(let i=0;i<Math.ceil(W/18);i++){
      const x=grain(i+200)*W+Math.sin(seaTime*.6+i)*8;
      const y=H-grain(i+500)*depth*.7+Math.sin(seaTime*1.1+i)*3;
      ctx.strokeStyle=`rgba(234,250,240,${.06+grain(i+70)*.22})`;ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+6,y-2-seaWind*2,x+12+seaWind*5,y);ctx.stroke();
    }
    ctx.restore();
    // Foam breaks into small patches and thins as the water retreats.
    for(let i=0;i<count-1;i++){
      const x=i*step,y=front[i];
      const broken=.3+.7*grain(i+30);
      ctx.strokeStyle=`rgba(255,253,239,${broken*.75})`;ctx.lineWidth=1+grain(i+13)*1.7+seaWind;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+step,front[i+1]);ctx.stroke();
      if(grain(i+40)>.35){
        ctx.fillStyle=`rgba(255,253,239,${broken*.6})`;
        ctx.beginPath();ctx.ellipse(x+Math.sin(seaTime+i)*2,y+2+grain(i+90)*6,1+grain(i+12)*2.5,.6+grain(i+14),0,0,Math.PI*2);ctx.fill();
      }
      const gap=y-wetSand[i];
      if(gap>7&&gap<26){ctx.fillStyle=`rgba(255,249,228,${(1-gap/26)*.24})`;ctx.fillRect(x,wetSand[i]+3,2,.8);}
      const local=seaWind*Math.exp(-Math.pow((x-pointer.x)/160,2));
      if(local>.3&&i%4===0){
        const lift=((seaTime*1.4+grain(i))%1);
        ctx.fillStyle=`rgba(255,253,240,${(1-lift)*local*.65})`;
        ctx.beginPath();ctx.arc(x+lift*18*local,y-lift*17*local,1-lift*.6,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.restore();
  }
  function leaf(p){ctx.fillStyle=['#b75d32','#d5973e','#9c4e32','#c57d36'][p.color];ctx.beginPath();ctx.moveTo(-p.size,0);ctx.bezierCurveTo(-p.size*.4,-p.size*.85,p.size*.65,-p.size*.65,p.size,0);ctx.bezierCurveTo(p.size*.3,p.size*.7,-p.size*.5,p.size*.65,-p.size,0);ctx.fill();ctx.strokeStyle='#67492b88';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(-p.size-3,1);ctx.lineTo(p.size,0);for(let i=-1;i<=1;i++){ctx.moveTo(i*p.size*.35,0);ctx.lineTo(i*p.size*.35+3,-p.size*.35);ctx.moveTo(i*p.size*.35,0);ctx.lineTo(i*p.size*.35+3,p.size*.3);}ctx.stroke();}
  function drawParticle(p,time){const sy=p.y-scrollY;if(sy< -35||sy>H+35)return;ctx.save();if(p.kind==='autumn'||p.kind==='winter')ctx.globalAlpha=Math.max(0,Math.min(1,(p.restLife-p.restAge)/4,(90-p.age)/4));ctx.translate(p.x,sy);ctx.rotate(p.a);if(p.kind==='autumn'){ctx.scale(1,.6+Math.abs(Math.sin(p.phase+time*.001))*.4);leaf(p);}else if(p.kind==='winter'){ctx.fillStyle='#fff';ctx.shadowColor='#839ba944';ctx.shadowBlur=p.rest?2:0;ctx.beginPath();ctx.ellipse(0,0,p.size*(p.rest?1.8:1),p.size,0,0,Math.PI*2);ctx.fill();}else if(p.kind==='spring'){ctx.fillStyle=['#d1a258','#e3be73','#b1b9a1','#d9ab67'][p.color];const wing=Math.max(.12,Math.abs(Math.sin(time*(p.rest?.0015:.014)+p.phase)));ctx.scale(wing,1);ctx.beginPath();ctx.ellipse(-5,-3,6,9,-.5,0,7);ctx.ellipse(5,-3,6,9,.5,0,7);ctx.fill();ctx.fillStyle='#665749';ctx.fillRect(-.7,-5,1.4,11);}ctx.restore();}
  function flyButterfly(p,dt,time,live) {
    if(p.rest){
      p.restAge+=dt;p.x=p.rest.x+p.offset+p.rest.body.x;p.y=p.rest.y+p.rest.body.y-7;p.a=0;
      if(p.restAge>p.pause){p.previous=p.rest;p.rest=null;p.flight=null;}
      return;
    }
    if(!p.flight){
      const choices=live.filter(s=>s!==p.previous&&s.y>scrollY+80&&s.y<scrollY+H-30);
      const target=choices[Math.floor(Math.random()*choices.length)];
      p.flight={x:p.x,y:p.y,target,offset:target?rand(1,Math.max(2,target.w-1)):0,endX:rand(30,W-30),endY:scrollY+rand(100,Math.max(110,H-60)),elapsed:0,duration:rand(3,5.5),arc:rand(-100,100)};
    }
    const f=p.flight;f.elapsed+=dt;const u=Math.min(1,f.elapsed/f.duration),e=u*u*(3-2*u);
    const tx=f.target?f.target.x+f.offset+f.target.body.x:f.endX,ty=f.target?f.target.y+f.target.body.y-7:f.endY;
    p.x=f.x+(tx-f.x)*e+Math.sin(u*Math.PI)*f.arc;
    p.y=f.y+(ty-f.y)*e-Math.sin(u*Math.PI)*65+Math.sin(time*.004+p.phase)*8*Math.sin(u*Math.PI);
    p.a=Math.sin(time*.003+p.phase)*.2*Math.sin(u*Math.PI);
    if(u===1){p.rest=f.target||null;p.offset=f.offset;p.restAge=0;p.pause=rand(3,6);p.flight=null;}
  }
  function loop(time){const dt=Math.min((time-last)/1000||.016,.035);last=time;if(dirty)measure();ctx.clearRect(0,0,W,H);const animate=enabled()&&!reduced.matches&&!document.hidden;
    if(season==='summer'&&animate)updateSun(dt);
    if(animate){
      spawn+=dt;const interval=season==='winter'?.075:season==='autumn'?.7:2;if((season==='autumn'||season==='winter'||season==='spring'&&particles.length<5)&&spawn>interval&&particles.length<1100){spawn=0;particle(rand(-20,W+20),scrollY-20);}
    }
    const live=surfaces.filter(s=>s.y>scrollY-30&&s.y<scrollY+H+40);
    for(const p of particles){if(animate){p.age+=dt;if(p.rest&&(p.kind==='autumn'||p.kind==='winter'))p.restAge+=dt;const py=p.y;const dx=p.x-pointer.x,dy=p.y-(pointer.y+scrollY),dist=Math.hypot(dx,dy);if(tool==='breeze'&&pointer.inside&&dist<170){p.rest=null;const force=(1-dist/170)*1800;p.vx+=(dx/Math.max(dist,15)+.7)*force*dt;p.vy+=(dy/Math.max(dist,15)-.65)*force*dt;p.spin+=dt*3;}
        if(p.kind==='spring'){if(tool==='breeze'&&pointer.inside&&dist<170){p.previous=p.rest;p.rest=null;p.flight=null;p.x+=dt*100;p.y-=dt*100;}flyButterfly(p,dt,time,live);}
        else if(p.rest){p.x=p.rest.x+p.offset+p.rest.body.x;p.y=p.rest.y+p.rest.body.y-2;p.a+=Math.sin(time*.001+p.phase)*dt*.08;}
        else{p.vx*=Math.exp(-.65*dt);p.vy+=((p.kind==='winter'?12:22)-p.vy*.45)*dt;p.x+=(p.vx+Math.sin(time*.0012+p.phase)*(p.kind==='winter'?9:22))*dt;p.y+=p.vy*dt;p.a+=p.spin*dt;if(p.vy>0&&p.age>.8){const surface=live.find(s=>p.x>s.x&&p.x<s.x+s.w&&py<=s.y+s.body.y&&p.y>=s.y+s.body.y);if(surface){p.rest=surface;p.restAge=0;p.offset=p.x-surface.x;p.y=surface.y;p.vx=p.vy=0;p.a=rand(-.4,.4);}}}
      }drawParticle(p,time);}
    particles=particles.filter(p=>(!(p.kind==='autumn'||p.kind==='winter')||(p.age<90&&p.restAge<p.restLife))&&(p.kind==='spring'||p.rest||p.y<scrollY+H+150&&p.x>-350&&p.x<W+350));
    if(season==='summer'){drawSand();const bottom=document.documentElement.scrollHeight-scrollY;if(bottom<H+220){ctx.save();ctx.translate(0,bottom-H);drawSea(dt,animate);ctx.restore();}}
    if(tool==='breeze'&&pointer.inside&&animate){ctx.strokeStyle='#79938855';ctx.lineWidth=1;for(let i=0;i<5;i++){const offset=(time*.15+i*30)%150;ctx.beginPath();ctx.ellipse(pointer.x+offset,pointer.y,offset*.3+5,offset*.15+3,0,-.7,.7);ctx.stroke();}}
    requestAnimationFrame(loop);
  }
  let wasEnabled=enabled();
  new MutationObserver(()=>{const now=enabled();if(now===wasEnabled)return;wasEnabled=now;if(!now){selectTool('');setSeason('none');}}).observe(document.body,{attributes:true,attributeFilter:['class']});
  setSeason('none');requestAnimationFrame(loop);
  // Animate the actual Keepify description, preserving its accessible text.
  const projects = [...document.querySelectorAll('.project')];
  const activeWords = new Set();
  function composeDescription(project) {
    if (!enabled() || reduced.matches) return;
    const paragraph = project.querySelector(':scope > p');
    const original = paragraph.textContent;
    const accessible = document.createElement('span'); accessible.className='sr-only'; accessible.textContent=original;
    const visual = document.createElement('span'); visual.setAttribute('aria-hidden','true');
    const words = original.split(/(\s+)/).map(word => {
      if (!word.trim()) {visual.append(document.createTextNode(word));return null;}
      const span=document.createElement('span');span.className='composing-word';span.textContent=word;visual.append(span);return span;
    }).filter(Boolean);
    paragraph.replaceChildren(accessible,visual);
    const bounds=paragraph.getBoundingClientRect();
    const animations=words.map((word,i)=>{
      const box=word.getBoundingClientRect();
      const offset=Math.max(bounds.left-box.left,Math.min(bounds.right-box.right,rand(-32,32)));
      return word.animate([
      {transform:`translate(${offset}px,${rand(-20,20)}px) rotate(${rand(-12,12)}deg)`,opacity:.35},
      {transform:'translate(0,0) rotate(0)',opacity:1}
    ],{duration:2700,delay:200+i*22,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});});
    const finish=()=>{animations.forEach(a=>a.cancel());paragraph.textContent=original;activeWords.delete(finish);};
    activeWords.add(finish);
    Promise.all(animations.map(a=>a.finished)).then(finish).catch(()=>{});
  }
  new MutationObserver(()=>{if(!enabled())for(const finish of [...activeWords])finish();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  const started=new Set();
  function startProject(project){if(started.has(project))return;started.add(project);project.classList.add('story-visible');if(project===projects[1])composeDescription(project);}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    if(entry.target.id==='projects-title'){
      startProject(projects[0]);if(innerWidth>700)startProject(projects[1]);
    }else startProject(projects[1]);
    observer.unobserve(entry.target);
  }),{rootMargin:'-40% 0px -40% 0px',threshold:0});
  observer.observe(document.querySelector('#projects-title'));
  observer.observe(projects[1].querySelector('.project-heading'));
})();
