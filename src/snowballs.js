// Snow gathering, slingshot aiming and short-lived impact fragments.
function createSnowballScene({ ctx, particles, active, size, announce, en }) {
  let held = null,
    flights = [],
    fragments = [];
  const fallen = new Map();
  const restoreButton = document.createElement("button");
  restoreButton.type = "button";
  restoreButton.className = "restore-page";
  restoreButton.textContent = en ? "Put things back" : "Rimetti a posto";
  restoreButton.hidden = true;
  const dock = document.querySelector(".tool-dock");
  dock.insertBefore(restoreButton, dock.lastElementChild);
  function restore(animate = true) {
    for (const [el, entry] of fallen) {
      const transform = getComputedStyle(el).transform;
      entry.animation.cancel();
      el.style.pointerEvents = entry.pointerEvents;
      if (animate)
        el.animate(
          [
            { transform, opacity: 0.3 },
            { transform: "none", opacity: 1 },
          ],
          { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
    }
    fallen.clear();
    restoreButton.hidden = true;
  }
  restoreButton.onclick = () => restore();
  function impact(ball, previous, u) {
    if (u < 0.15) return false;
    const candidates = [
      ...document.querySelectorAll(
        "main h1,main h2,main h3,main .portrait,main .button,main .text-link,main .project-link,main .skill-tags span,main .company-logos img",
      ),
    ]
      .filter((el) => !fallen.has(el))
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .filter(
        ({ rect: r }) =>
          r.width && r.height && r.bottom > 0 && r.top < size().height,
      )
      .sort(
        (a, b) => a.rect.width * a.rect.height - b.rect.width * b.rect.height,
      );
    const steps = Math.max(
      1,
      Math.ceil(Math.hypot(ball.x - previous.x, ball.y - previous.y) / 8),
    );
    for (let i = 1; i <= steps; i++) {
      const x = previous.x + ((ball.x - previous.x) * i) / steps,
        y = previous.y + ((ball.y - previous.y) * i) / steps - scrollY;
      for (const { el, rect: r } of candidates) {
        const startInside =
          ball.startX >= r.left - ball.radius &&
          ball.startX <= r.right + ball.radius &&
          ball.startY - scrollY >= r.top - ball.radius &&
          ball.startY - scrollY <= r.bottom + ball.radius;
        if (startInside && u < 0.8) continue;
        if (
          x + ball.radius < r.left ||
          x - ball.radius > r.right ||
          y + ball.radius < r.top ||
          y - ball.radius > r.bottom
        )
          continue;
        const direction = Math.sign(ball.endX - ball.startX) || 1,
          drop = Math.max(120, size().height - r.top + 60);
        const animation = el.animate(
          [
            { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
            {
              transform:
                "translate(" +
                direction * 8 +
                "px,-8px) rotate(" +
                direction * 5 +
                "deg)",
              opacity: 1,
              offset: 0.12,
            },
            {
              transform:
                "translate(" +
                direction * 65 +
                "px," +
                drop +
                "px) rotate(" +
                direction * 28 +
                "deg)",
              opacity: 0.15,
            },
          ],
          {
            duration: 850,
            easing: "cubic-bezier(.4,0,.9,.6)",
            fill: "forwards",
          },
        );
        fallen.set(el, { animation, pointerEvents: el.style.pointerEvents });
        el.style.pointerEvents = "none";
        restoreButton.hidden = false;
        ball.x = x;
        ball.y = y + scrollY;
        announce(
          en
            ? "Hit! Use Put things back to restore the page."
            : "Colpito! Usa Rimetti a posto per riordinare la pagina.",
        );
        return true;
      }
    }
    return false;
  }
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
    restoreButton.hidden = !active() || fallen.size === 0;
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
        const previous = { x: ball.x, y: ball.y };
        ball.age += dt;
        const u = Math.min(1, ball.age / ball.duration),
          p = path(ball, u);
        ball.x = p.x;
        ball.y = p.y;
        if (
          impact(ball, previous, u) ||
          u === 1 ||
          ball.y - scrollY > height + 30
        ) {
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
      restore();
      cancel();
      flights = [];
      fragments = [];
    },
  };
}
