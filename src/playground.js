(() => {
  const en = document.documentElement.lang === 'en';
  const t = (it, english) => en ? english : it;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const ui = document.createElement('aside');
  ui.className = 'playground';
  ui.setAttribute('aria-label', t('Stagioni e attrezzi', 'Seasons and tools'));
  ui.innerHTML = `<button class="playground-toggle" aria-expanded="false" aria-controls="playground-panel">✳ <span>${t('Esplora', 'Explore')}</span></button>
    <div id="playground-panel" hidden>
      <div class="playground-heading"><strong>${t('Un po’ di curiosità', 'A little curiosity')}</strong><button class="panel-close" aria-label="${t('Chiudi', 'Close')}">×</button></div>
      <p>${t('Scegli una stagione o prova un attrezzo.', 'Choose a season or try a tool.')}</p>
      <label for="season">${t('Atmosfera', 'Atmosphere')}</label>
      <select id="season"><option value="none">${t('Originale', 'Original')}</option><option value="auto">${t('Stagione attuale', 'Current season')}</option><option value="autumn">${t('Autunno', 'Autumn')}</option><option value="winter">${t('Inverno', 'Winter')}</option><option value="spring">${t('Primavera', 'Spring')}</option><option value="summer">${t('Estate', 'Summer')}</option></select>
      <fieldset><legend>${t('Cassetta degli attrezzi', 'Toolbox')}</legend><div class="tool-grid">
        ${[['hammer','🔨',t('Martello','Hammer')],['magnet','🧲',t('Magnete','Magnet')],['blower','≋',t('Soffiatore','Blower')],['level','↔',t('Livella','Spirit level')]].map(([id,icon,label])=>`<button data-tool="${id}" aria-pressed="false"><span aria-hidden="true">${icon}</span> ${label}</button>`).join('')}
      </div></fieldset>
      <p class="tool-help" role="status"></p>
      <button class="repair-button">${t('Ripristina tutto', 'Restore everything')}</button>
      <p class="playground-note">${t('Esc per riporre l’attrezzo. Tutto è reversibile.', 'Press Esc to put the tool away. Everything is reversible.')}</p>
    </div>`;
  document.body.append(ui);
  const toolCursor = document.createElement('span');
  toolCursor.className = 'tool-cursor'; toolCursor.setAttribute('aria-hidden','true');
  document.body.append(toolCursor);
  const panel = ui.querySelector('#playground-panel');
  const toggle = ui.querySelector('.playground-toggle');
  const help = ui.querySelector('.tool-help');
  let tool = '', season = 'none', repairing = false;
  const damaged = new Map();
  const moved = new Set();
  const targets = [...document.querySelectorAll('.portrait, .hero h1, .hero .button, .project-heading, .skill-tags span, .about h2, .timeline h3')];
  targets.forEach(el => el.classList.add('play-target'));
  function enabled() { return !document.body.classList.contains('no-play'); }
  function showPanel(open) { panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); }
  toggle.addEventListener('click', () => showPanel(panel.hidden));
  ui.querySelector('.panel-close').addEventListener('click', () => { showPanel(false); toggle.focus(); });
  const instructions = {
    hammer: t('Tocca un titolo, il ritratto o una competenza per incrinarli. Tre colpi li fanno cedere.', 'Tap a heading, portrait or skill tag to crack it. Three hits loosen it.'),
    magnet: t('Muovi il puntatore vicino alle competenze: seguono il magnete. Su touch, tocca una competenza.', 'Move near the skill tags: they follow the magnet. On touch, tap a tag.'),
    blower: t('Passa vicino alle decorazioni per spazzarle via. In estate muove i raggi, in primavera i petali.', 'Move near decorations to blow them away. In summer it moves sunbeams; in spring, petals.'),
    level: t('Tocca a sinistra o a destra nella pagina per inclinarne gli elementi.', 'Tap the left or right side of the page to tilt its elements.')
  };
  function selectTool(next) {
    tool = tool === next ? '' : next;
    toolCursor.textContent = ({hammer:'🔨',magnet:'🧲',blower:'≋',level:'↔'})[tool] || '';
    toolCursor.hidden = true;
    document.body.dataset.tool = tool;
    ui.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === tool)));
    help.textContent = tool ? instructions[tool] : '';
    if (tool && !enabled()) document.querySelector('#play-toggle').click();
  }
  ui.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => selectTool(b.dataset.tool)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { selectTool(tool); showPanel(false); } });
  const seasonSelect = ui.querySelector('#season');
  function currentSeason() { return ['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'][new Date().getMonth()]; }
  const decorations = [];
  function clearDecorations() { decorations.splice(0).forEach(el => el.remove()); }
  function applySeason() {
    clearDecorations();
    season = seasonSelect.value === 'auto' ? currentSeason() : seasonSelect.value;
    document.body.dataset.season = season;
    if (season === 'none' || !enabled()) return;
    targets.forEach((target, index) => {
      if (target.matches('.skill-tags span') && index % 2) return;
      const deco = document.createElement(season === 'spring' ? 'button' : 'span');
      deco.className = `season-deco ${season}-deco`;
      if (season === 'spring') {
        deco.type = 'button'; deco.textContent = '🌱';
        deco.setAttribute('aria-label', t('Fai sbocciare il germoglio', 'Make the bud bloom'));
        deco.setAttribute('aria-pressed', 'false');
        deco.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const bloomed = deco.getAttribute('aria-pressed') !== 'true'; deco.textContent = bloomed ? '🌸' : '🌱'; deco.setAttribute('aria-pressed', String(bloomed)); });
        // Keep buttons outside links and other buttons.
        const host = target.matches('a,button') ? target.parentElement : target;
        host.classList.add('season-host'); host.append(deco);
        if (host !== target) {
          deco.style.left = `${target.offsetLeft + target.offsetWidth * .65}px`;
          deco.style.top = `${target.offsetTop - 24}px`;
        }
      } else {
        deco.setAttribute('aria-hidden', 'true');
        deco.textContent = season === 'autumn' ? ['🍂','🍁','🍂'][index % 3] : season === 'summer' ? '☀' : '';
        target.append(deco);
      }
      deco.style.setProperty('--deco-left', `${15 + (index * 23) % 65}%`);
      deco.style.setProperty('--deco-rotate', `${(index % 5 - 2) * 12}deg`);
      decorations.push(deco);
    });
  }
  seasonSelect.addEventListener('change', () => { if (!enabled() && seasonSelect.value !== 'none') document.querySelector('#play-toggle').click(); applySeason(); });
  function scatter(deco, direction = 1) {
    if (deco.classList.contains('swept')) return;
    deco.classList.add('swept');
    deco.style.setProperty('--blow-x', `${direction * 170}px`);
  }
  let pointerFrame = 0;
  document.addEventListener('pointermove', e => {
    if (!tool || !enabled() || repairing || ui.contains(e.target) || pointerFrame) return;
    const x = e.clientX, y = e.clientY;
    toolCursor.hidden = e.pointerType === 'touch';
    toolCursor.style.left = `${x + 15}px`; toolCursor.style.top = `${y + 10}px`;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (tool === 'magnet') document.querySelectorAll('.skill-tags span').forEach(el => {
        const r = el.getBoundingClientRect(); const ax = x - r.left - r.width / 2, ay = y - r.top - r.height / 2;
        if (Math.hypot(ax, ay) < 180) { el.style.setProperty('--move-x', `${ax * .3}px`); el.style.setProperty('--move-y', `${ay * .3}px`); moved.add(el); }
      });
      if (tool === 'blower') decorations.forEach(deco => { const r = deco.getBoundingClientRect(); if (Math.hypot(x-r.left-r.width/2,y-r.top-r.height/2) < 130) scatter(deco, x < innerWidth/2 ? 1 : -1); });
    });
  }, { passive: true });
  const recovery = document.createElement('div');
  recovery.className = 'recovery'; recovery.hidden = true;
  recovery.innerHTML = `<span>${t('Qualche pezzo ha ceduto. Ricostruiamo?', 'A few things came loose. Rebuild?')}</span><button>${t('Ricostruiamo', 'Rebuild')}</button><span class="repair-status" role="status"></span>`;
  document.body.append(recovery);
  document.addEventListener('click', e => {
    if (!enabled() || !tool || repairing || ui.contains(e.target) || recovery.contains(e.target)) return;
    if (e.target.closest('.spring-deco')) return;
    const target = e.target.closest('.play-target');
    if (tool === 'hammer' && target) {
      e.preventDefault(); e.stopImmediatePropagation();
      const hits = Math.min(3, (damaged.get(target) || 0) + 1); damaged.set(target, hits);
      target.dataset.damage = String(hits);
      if (!target.querySelector('.crack')) { const crack = document.createElement('span'); crack.className='crack'; crack.setAttribute('aria-hidden','true'); target.append(crack); }
      if (hits === 3) recovery.hidden = false;
    } else if (tool === 'level' && e.target.closest('main')) {
      if (e.target.closest('a,button,input,select')) return;
      const angle = e.clientX < innerWidth/2 ? -2 : 2;
      targets.forEach(el => { el.style.setProperty('--tilt', `${angle}deg`); moved.add(el); });
      help.textContent = t('Un po’ fuori bolla. Ripristina tutto per riallineare.', 'A little off balance. Restore everything to realign.');
    } else if (tool === 'magnet' && target?.matches('.skill-tags span')) {
      target.style.setProperty('--move-y', '-18px'); moved.add(target);
    } else if (tool === 'blower' && e.target.closest('main')) {
      decorations.filter(deco => {const r=deco.getBoundingClientRect(); return r.top>=0 && r.top<innerHeight;}).forEach(deco => scatter(deco));
    }
  }, true);
  async function restore() {
    if (repairing) return;
    repairing = true; selectTool(tool); recovery.hidden = false;
    const status = recovery.querySelector('.repair-status');
    const stages = [t('1 / Capire il problema', '1 / Understand the problem'),t('2 / Definire le priorità', '2 / Set priorities'),t('3 / Costruire la soluzione', '3 / Build the solution')];
    recovery.querySelector('button').disabled = true;
    for (const [i, stage] of stages.entries()) {
      status.textContent = stage;
      if (i === 0) damaged.forEach((_,el) => el.classList.add('repair-scan'));
      if (i === 1) {
        [...damaged].sort((a,b)=>b[1]-a[1]).forEach(([el],n) => { const agent=document.createElement('span'); agent.className='repair-agent';agent.textContent=`◇ ${n+1}`;agent.setAttribute('aria-hidden','true');el.append(agent); });
      }
      if (i === 2) {
        damaged.forEach((_,el) => {delete el.dataset.damage;});
        moved.forEach(el => { el.style.removeProperty('--move-x');el.style.removeProperty('--move-y');el.style.removeProperty('--tilt'); });
        decorations.forEach(el => el.classList.remove('swept'));
      }
      if (!motion.matches && enabled()) await new Promise(resolve=>setTimeout(resolve,650));
    }
    damaged.forEach((_,el) => {el.classList.remove('repair-scan');el.querySelectorAll('.crack,.repair-agent').forEach(node=>node.remove());});
    damaged.clear();moved.clear(); repairing=false; recovery.hidden=true; recovery.querySelector('button').disabled=false;
    seasonSelect.value='none';applySeason();
  }
  recovery.querySelector('button').addEventListener('click', restore);
  ui.querySelector('.repair-button').addEventListener('click', restore);
  new MutationObserver(() => { if (!enabled()) {selectTool(tool);restore();} }).observe(document.body,{attributes:true,attributeFilter:['class']});

  // Decorative project stories run once when each card enters the viewport.
  const projects = document.querySelectorAll('.project');
  projects.forEach((project,i) => {
    const story=document.createElement('div');story.className=`project-story ${i===0?'fuel-story':'notes-story'}`;story.setAttribute('aria-hidden','true');
    story.innerHTML=i===0 ? '<span class="road"></span><span class="story-car">🚙</span><span class="story-pump">⛽</span>' : `<span class="note-word word-one">${t('Idee','Ideas')}</span><span class="note-word word-two">${t('Appunti','Thoughts')}</span><span class="note-word word-three">${t('Da fare','To do')}</span><span class="story-note">✓ Keepify</span>`;
    project.append(story);
  });
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('story-visible');observer.unobserve(entry.target);}}),{threshold:.35});
  projects.forEach(project=>observer.observe(project));
})();
