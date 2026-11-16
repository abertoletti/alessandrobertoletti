// Add a local image path here when the portrait is ready, e.g. 'public/portrait.webp'.
const portraitImage = null;
const english = document.documentElement.lang === 'en';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let play = !reducedMotion.matches;
const button = document.querySelector('#portrait');
const canvas = document.querySelector('#portrait-canvas');
const ctx = canvas.getContext('2d');
const texture = document.createElement('canvas');
texture.width = texture.height = 600;
const paint = texture.getContext('2d');
function placeholder() {
  paint.fillStyle = '#e7e9e5'; paint.fillRect(0, 0, 600, 600);
  paint.strokeStyle = '#cdd3cd'; paint.lineWidth = 1;
  paint.strokeRect(42, 42, 516, 516);
  paint.beginPath(); paint.arc(300, 300, 184, 0, Math.PI * 2); paint.stroke();
  paint.fillStyle = '#53655c'; paint.font = '400 158px Arial, sans-serif';
  paint.textAlign = 'center'; paint.fillText('AB', 300, 351);
  paint.fillStyle = '#768279'; paint.font = '14px Arial, sans-serif';
  paint.fillText(english ? 'SOFTWARE DEVELOPER / CONSULTANT' : 'SOFTWARE DEVELOPER / CONSULENTE', 300, 416);
}
placeholder();
let dx = 0, dy = 0, vx = 0, vy = 0, frame = 0, active = null;
let anchor = { x: 300, y: 300 };
function vertex(x, y) {
  const distance = Math.hypot(x - anchor.x, y - anchor.y);
  const edge = Math.min(x, y, 600 - x, 600 - y) / 90;
  const weight = Math.exp(-distance * distance / 68000) * Math.min(1, Math.max(0, edge));
  return { x: x + dx * weight, y: y + dy * weight };
}
function triangle(a, b, c) {
  const p = vertex(a.x, a.y), q = vertex(b.x, b.y), r = vertex(c.x, c.y);
  const determinant = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
  const aa = ((q.x - p.x) * (c.y - a.y) - (r.x - p.x) * (b.y - a.y)) / determinant;
  const bb = ((q.y - p.y) * (c.y - a.y) - (r.y - p.y) * (b.y - a.y)) / determinant;
  const cc = ((r.x - p.x) * (b.x - a.x) - (q.x - p.x) * (c.x - a.x)) / determinant;
  const dd = ((r.y - p.y) * (b.x - a.x) - (q.y - p.y) * (c.x - a.x)) / determinant;
  ctx.save(); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.lineTo(r.x, r.y); ctx.closePath(); ctx.clip();
  ctx.setTransform(aa, bb, cc, dd, p.x - aa * a.x - cc * a.y, p.y - bb * a.x - dd * a.y);
  ctx.drawImage(texture, 0, 0); ctx.restore();
}
function render() {
  ctx.fillStyle = '#e7e9e5'; ctx.fillRect(0, 0, 600, 600);
  if (Math.abs(dx) + Math.abs(dy) < .1) { ctx.drawImage(texture, 0, 0); return; }
  for (let y = 0; y < 600; y += 40) for (let x = 0; x < 600; x += 40) {
    triangle({ x, y }, { x: x + 40, y }, { x, y: y + 40 });
    triangle({ x: x + 40, y }, { x: x + 40, y: y + 40 }, { x, y: y + 40 });
  }
}
render();
if (portraitImage) {
  const photo = new Image();
  photo.onload = () => { const scale = Math.max(600 / photo.width, 600 / photo.height); paint.drawImage(photo, (600 - photo.width * scale) / 2, (600 - photo.height * scale) / 2, photo.width * scale, photo.height * scale); render(); document.querySelector('.portrait-tag').textContent = 'ALESSANDRO BERTOLETTI'; };
  photo.src = new URL((english ? '../' : './') + portraitImage, document.baseURI).href;
}
function spring() {
  vx = (vx - dx * .14) * .76; vy = (vy - dy * .14) * .76; dx += vx; dy += vy; render();
  if (Math.abs(dx) + Math.abs(dy) + Math.abs(vx) + Math.abs(vy) > .15) frame = requestAnimationFrame(spring);
  else { dx = dy = vx = vy = 0; frame = 0; render(); }
}
function point(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) / rect.width * 600, y: (event.clientY - rect.top) / rect.height * 600 }; }
button.addEventListener('pointerdown', event => {
  if (!play || active !== null || event.button !== 0) return;
  cancelAnimationFrame(frame); vx = vy = 0; active = event.pointerId; anchor = point(event); button.setPointerCapture(active);
});
button.addEventListener('pointermove', event => { if (event.pointerId !== active) return; const p = point(event); dx = Math.max(-145, Math.min(145, p.x - anchor.x)); dy = Math.max(-145, Math.min(145, p.y - anchor.y)); render(); });
function release(event) { if (event.pointerId !== active) return; active = null; cancelAnimationFrame(frame); frame = requestAnimationFrame(spring); }
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(event, release);
button.addEventListener('click', event => { if (event.detail !== 0) return; if (!play) { toast(english ? 'Interactions are off. You can enable them in the footer.' : 'Le interazioni sono disattivate. Puoi riattivarle a fondo pagina.'); return; } cancelAnimationFrame(frame); anchor = { x: 300, y: 300 }; dx = 90; dy = -45; frame = requestAnimationFrame(spring); });
let toastTimer;
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3200); }
function syncPlay() { const toggle = document.querySelector('#play-toggle'); toggle.setAttribute('aria-pressed', String(play)); toggle.textContent = `${english ? 'Interactions' : 'Interazioni'}: ${play ? 'ON' : 'OFF'}`; document.body.classList.toggle('no-play', !play); button.style.touchAction = play ? 'none' : 'auto'; if (!play) { active = null; cancelAnimationFrame(frame); dx = dy = vx = vy = 0; render(); } }
document.querySelector('#play-toggle').addEventListener('click', () => { play = !play; syncPlay(); });
reducedMotion.addEventListener('change', event => { play = !event.matches; syncPlay(); });
syncPlay();
document.querySelector('#year').textContent = new Date().getFullYear();
