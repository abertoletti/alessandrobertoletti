// Snow gathering, slingshot aiming and short-lived impact fragments.
function createSnowballScene({ ctx, particles, active, size, announce, en }) {
  let held = null,
    flights = [],
    fragments = [];
  const excluded = "a,button,input,textarea,select,header,footer,.tool-dock";
  const point = (e) => ({ x: e.clientX, y: e.clientY + scrollY });
  function cancel() {
    if (held && document.documentElement.hasPointerCapture(held.id))
      document.documentElement.releasePointerCapture(held.id);
    held = null;
  }
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!active() || e.button !== 0 || held || e.target.closest(excluded))
        return;
      const p = point(e);
      e.preventDefault();
      held = {
        id: e.pointerId,
        x: p.x,
        y: p.y,
        target: p,
        radius: 12,
        age: 0,
        collected: 20,
      };
      document.documentElement.setPointerCapture(e.pointerId);
    },
    { passive: false },
  );
  document.addEventListener(
    "pointermove",
    (e) => {
      if (held?.id === e.pointerId) {
        held.target = point(e);
        e.preventDefault();
      }
    },
    { passive: false },
  );
  document.addEventListener("pointerup", (e) => {
    if (held?.id !== e.pointerId) return;
    const h = held,
      end = point(e);
    cancel();
    if (h.collected < 1) return;
    let dx = end.x - h.x,
      dy = end.y - h.y;
    if (Math.hypot(dx, dy) < 40) {
      dx = 120;
      dy = -70;
    }
    const length = Math.hypot(dx, dy),
      limit = Math.min(1, 650 / length);
    flights.push({
      x: h.x,
      y: h.y,
      startX: h.x,
      startY: h.y,
      endX: h.x + dx * limit,
      endY: h.y + dy * limit,
      radius: h.radius,
      age: 0,
      duration: 0.45 + Math.min(0.35, length / 1200),
      arc: Math.min(110, 35 + length * 0.18),
    });
    flights = flights.slice(-4);
    announce(en ? "Snowball thrown." : "Palla di neve lanciata.");
  });
  document.addEventListener("pointercancel", cancel);
  document.addEventListener("lostpointercapture", (e) => {
    if (held?.id === e.pointerId) held = null;
  });
  function burst(ball) {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2,
        speed = 35 + Math.random() * 190;
      fragments.push({
        x: ball.x,
        y: ball.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 45,
        r: 1 + Math.random() * ball.radius * 0.22,
        age: 0,
        life: 0.5 + Math.random() * 0.65,
      });
    }
    fragments = fragments.slice(-160);
  }
  function path(ball, u) {
    return {
      x: ball.startX + (ball.endX - ball.startX) * u,
      y:
        ball.startY +
        (ball.endY - ball.startY) * u -
        Math.sin(Math.PI * u) * ball.arc,
    };
  }
  function paintBall(x, y, r) {
    ctx.save();
    ctx.translate(x, y - scrollY);
    ctx.shadowColor = "#526c8355";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    const shade = ctx.createRadialGradient(-r * 0.35, -r * 0.4, 1, 0, 0, r);
    shade.addColorStop(0, "#fff");
    shade.addColorStop(0.65, "#f3f8fc");
    shade.addColorStop(1, "#b8cbdc");
    ctx.fillStyle = shade;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2,
        rr = r * (1 + 0.035 * Math.sin(i * 4.7));
      const px = Math.cos(a) * rr,
        py = Math.sin(a) * rr;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#9fb6c650";
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.sin(i * 8.1) * r * 0.7,
        Math.cos(i * 3.3) * r * 0.65,
        0.6,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  }
  function draw(dt, animate) {
    if (!active() && held) cancel();
    if (held) {
      if (animate) {
        held.age += dt;
        held.collected += dt * 18;
        const reach = 35 + Math.min(25, held.age * 12);
        let budget = 8;
        for (const p of particles())
          if (
            budget > 0 &&
            p.kind === "winter" &&
            p.rest &&
            p.size > 0.15 &&
            Math.hypot(p.x - held.x, p.y - held.y) < reach
          ) {
            p.size = 0;
            held.collected++;
            budget--;
          }
        const target = 5 + Math.min(15, Math.sqrt(held.collected) * 1.6);
        held.radius += (target - held.radius) * Math.min(1, dt * 8);
      }
      const dx = held.target.x - held.x,
        dy = held.target.y - held.y;
      if (Math.hypot(dx, dy) > 30) {
        ctx.save();
        ctx.strokeStyle = "#6c879a88";
        ctx.setLineDash([2, 7]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        const preview = {
          startX: held.x,
          startY: held.y,
          endX: held.target.x,
          endY: held.target.y,
          arc: Math.min(110, 35 + Math.hypot(dx, dy) * 0.18),
        };
        for (let i = 0; i <= 20; i++) {
          const p = path(preview, i / 20);
          i ? ctx.lineTo(p.x, p.y - scrollY) : ctx.moveTo(p.x, p.y - scrollY);
        }
        ctx.stroke();
        ctx.restore();
      }
      paintBall(held.x, held.y, held.radius);
    }
    const { height } = size();
    for (const ball of flights) {
      if (animate) {
        ball.age += dt;
        const u = Math.min(1, ball.age / ball.duration),
          p = path(ball, u);
        ball.x = p.x;
        ball.y = p.y;
        if (u === 1 || ball.y - scrollY > height + 30) {
          burst(ball);
          ball.done = true;
        }
      }
      if (!ball.done) paintBall(ball.x, ball.y, ball.radius);
    }
    flights = flights.filter((b) => !b.done);
    for (const f of fragments) {
      if (animate) {
        f.age += dt;
        f.vy += 420 * dt;
        f.vx *= Math.exp(-1.2 * dt);
        f.x += f.vx * dt;
        f.y += f.vy * dt;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - f.age / f.life);
      ctx.fillStyle = "#fafdff";
      ctx.beginPath();
      ctx.arc(f.x, f.y - scrollY, f.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    fragments = fragments.filter((f) => f.age < f.life);
  }
  return {
    draw,
    cancel,
    reset() {
      cancel();
      flights = [];
      fragments = [];
    },
  };
}
