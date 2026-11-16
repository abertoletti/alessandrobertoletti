(() => {
  "use strict";
  const en = document.documentElement.lang === "en";
  const t = (it, english) => (en ? english : it);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="icon icon-${name}">${SeasonIcons[name]}</svg>`;
  const names = {
    autumn: t("Autunno", "Autumn"),
    winter: t("Inverno", "Winter"),
    spring: t("Primavera", "Spring"),
    summer: t("Estate", "Summer"),
    none: t("Disattiva", "Off"),
  };
  const ui = document.createElement("div");
  ui.className = "environment-controls";
  ui.innerHTML = `<div class="control-group"><button class="environment-button season-toggle" aria-label="${t("Scegli stagione", "Choose season")}" aria-expanded="false" aria-controls="season-menu"></button><div class="environment-menu" id="season-menu" hidden><p>${t("Un cambio di atmosfera", "A change of atmosphere")}</p>${Object.keys(
    names,
  )
    .map(
      (s) =>
        `<button data-season-choice="${s}" aria-pressed="false">${svg(s)}<span>${names[s]}</span><span class="selected-mark" aria-hidden="true">✓</span></button>`,
    )
    .join(
      "",
    )}</div></div><button class="environment-button season-action breeze-toggle" aria-pressed="false" aria-label="${t("Soffio", "Blow")}" disabled>${svg("breeze")}<span>${t("Soffio", "Blow")}</span></button>`;
  document.querySelector(".header-actions").append(ui);
  const shell = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  shell.setAttribute("viewBox", "0 0 96 44");
  shell.classList.add("liquid-shell");
  shell.setAttribute("aria-hidden", "true");
  shell.innerHTML = "<path/>";
  ui.prepend(shell);
  let morphFrame = 0,
    morphProgress = 0;
  function drawShell(q) {
    const waist = 2 + 20 * q,
      lower = 44 - waist;
    const path =
      q > 0.995
        ? "M22 2a20 20 0 1 0 0 40a20 20 0 1 0 0-40M74 2a20 20 0 1 0 0 40a20 20 0 1 0 0-40"
        : `M22 2C33 2 42 ${2 + 9 * q} 42 ${waist}C46 ${waist} 50 ${waist} 54 ${waist}C54 ${2 + 9 * q} 63 2 74 2A20 20 0 0 1 74 42C63 42 54 ${42 - 9 * q} 54 ${lower}C50 ${lower} 46 ${lower} 42 ${lower}C42 ${42 - 9 * q} 33 42 22 42A20 20 0 0 1 22 2Z`;
    shell.firstChild.setAttribute("d", path);
  }
  function morphControls(active) {
    cancelAnimationFrame(morphFrame);
    ui.classList.toggle("is-split", active);
    const from = morphProgress,
      to = active ? 1 : 0,
      start = performance.now();
    if (reduced.matches) {
      morphProgress = to;
      drawShell(to);
      return;
    }
    function tick(now) {
      const u = Math.min(1, (now - start) / 1050),
        ease = u * u * (3 - 2 * u);
      morphProgress = from + (to - from) * ease;
      drawShell(morphProgress);
      const bounce = Math.sin(u * Math.PI * 3) * Math.sin(u * Math.PI) * 0.055;
      shell.style.transform = `scale(${1 + bounce},${1 - bounce * 0.65})`;
      if (u < 1) morphFrame = requestAnimationFrame(tick);
    }
    morphFrame = requestAnimationFrame(tick);
  }
  drawShell(0);
  const dock = document.createElement("div");
  dock.className = "tool-dock";
  dock.hidden = true;
  dock.innerHTML = '<span></span><button type="button">×</button>';
  document.body.append(dock);
  dock.querySelector("button:not(.clean-sand)").ariaLabel = t(
    "Disattiva brezza",
    "Turn breeze off",
  );
  const cursor = document.createElement("div");
  cursor.className = "physical-cursor";
  cursor.hidden = true;
  cursor.ariaHidden = "true";
  document.body.append(cursor);
  const sunlight = document.createElement("div");
  sunlight.className = "summer-light";
  sunlight.setAttribute("aria-hidden", "true");
  document.body.append(sunlight);
  const beach = document.createElement("div");
  beach.className = "beach-end";
  beach.setAttribute("aria-hidden", "true");
  document.body.append(beach);
  const beachHint = document.createElement("p");
  beachHint.className = "sand-hint";
  beachHint.innerHTML = `<span>${t("Attiva la paletta, poi tieni premuto e trascina per scavare. Il mare ti aspetta in fondo.", "Activate the shovel, then hold and drag to dig. The sea awaits at the bottom.")}</span>`;
  document.querySelector(".hero").append(beachHint);
  const waveButton = document.createElement("button");
  waveButton.className = "clean-sand";
  waveButton.type = "button";
  waveButton.textContent = t("Pulisci 🌊", "Clean 🌊");
  waveButton.hidden = true;
  dock.insertBefore(waveButton, dock.querySelector("button:not(.clean-sand)"));
  waveButton.onclick = () => {
    if (washWave) return;
    sandDrawing = null;
    if (reduced.matches || !enabled()) sandStrokes = [];
    else washWave = { elapsed: 0 };
    flowerStatus.textContent = t("Arriva un’onda.", "A wave is coming.");
  };
  let sandStrokes = [],
    sandDrawing = null;
  let flowers = [],
    flowerSerial = 0,
    washWave = null;
  const flowerStatus = document.createElement("span");
  flowerStatus.className = "sr-only";
  flowerStatus.setAttribute("role", "status");
  document.body.append(flowerStatus);
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (
        season !== "summer" ||
        tool !== "shovel" ||
        washWave ||
        !enabled() ||
        e.button !== 0 ||
        e.pointerType === "touch" ||
        e.target.closest("a,button,input,select,textarea,header,.tool-dock")
      )
        return;
      e.preventDefault();
      sandDrawing = {
        points: [{ x: e.clientX, y: e.clientY + scrollY, opacity: 1 }],
        id: e.pointerId,
      };
      sandStrokes.push(sandDrawing);
      if (sandStrokes.length > 100) sandStrokes.shift();
      document.documentElement.setPointerCapture(e.pointerId);
    },
    true,
  );
  document.addEventListener("pointermove", (e) => {
    if (!sandDrawing || e.pointerId !== sandDrawing.id) return;
    const last = sandDrawing.points.at(-1),
      x = e.clientX,
      y = e.clientY + scrollY;
    if (
      Math.hypot(x - last.x, y - last.y) > 3 &&
      sandDrawing.points.length < 500
    )
      sandDrawing.points.push({ x, y, opacity: 1 });
  });
  function endDrawing(e) {
    if (sandDrawing?.id === e.pointerId) {
      sandDrawing = null;
      if (document.documentElement.hasPointerCapture(e.pointerId))
        document.documentElement.releasePointerCapture(e.pointerId);
    }
  }
  document.addEventListener("pointerup", endDrawing);
  document.addEventListener("pointercancel", endDrawing);
  let solarTime = 0,
    solarFrame = 0;
  function updateSun(dt) {
    solarTime += dt;
    solarFrame += dt;
    if (solarFrame < 0.1) return;
    solarFrame = 0;
    const phase = (solarTime * Math.PI * 2) / 100 - 0.9;
    const x = 50 + 38 * Math.sin(phase),
      y = 10 + 12 * (1 - Math.cos(phase));
    document.body.style.setProperty("--sun-x", x.toFixed(2) + "%");
    document.body.style.setProperty("--sun-y", y.toFixed(2) + "%");
    document.body.style.setProperty(
      "--shadow-x",
      ((50 - x) * 0.38).toFixed(2) + "px",
    );
    document.body.style.setProperty(
      "--shadow-y",
      (10 + y * 0.35).toFixed(2) + "px",
    );
    document.body.style.setProperty(
      "--text-shadow-x",
      ((50 - x) * 0.045).toFixed(2) + "px",
    );
  }
  const canvas = document.createElement("canvas");
  canvas.className = "weather-canvas";
  canvas.ariaHidden = "true";
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  let W = innerWidth,
    H = innerHeight,
    particles = [],
    surfaces = [],
    tool = "",
    season = "none",
    last = 0,
    spawn = 0,
    dirty = true;
  const pointer = { x: -1000, y: -1000, inside: false };
  const rand = (a, b) => a + Math.random() * (b - a);
  const enabled = () => !document.body.classList.contains("no-play");
  const nodes = [
    ...document.querySelectorAll(
      "main h1,main h2,main h3,main p,main .button,main .text-link,main .project-link,main .portrait,main .skill-tags span,main .company-logos img,main .coming, main .date,main .eyebrow",
    ),
  ].filter((el) => !el.closest(".portrait") || el.matches(".portrait"));
  const bodies = nodes.map((el) => ({ el, x: 0, y: 0 }));
  bodies.forEach((b) => b.el.classList.add("physics-item"));
  function measure() {
    surfaces = [];
    bodies.forEach((b) => {
      const r = b.el.getBoundingClientRect();
      b.rect = {
        x: r.left - b.x,
        y: r.top + scrollY - b.y,
        w: r.width,
        h: r.height,
      };
      if (b.el.matches("h1,h2,h3")) {
        // Each letter has its own real ink height: snow sits on glyphs, not line boxes.
        const style = getComputedStyle(b.el);
        ctx.save();
        ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const walker = document.createTreeWalker(b.el, NodeFilter.SHOW_TEXT);
        let text;
        while ((text = walker.nextNode())) {
          for (let i = 0; i < text.length; i++) {
            const char = text.textContent[i];
            if (!char.trim()) continue;
            const range = document.createRange();
            range.setStart(text, i);
            range.setEnd(text, i + 1);
            const box = range.getBoundingClientRect(),
              ink = ctx.measureText(char);
            const baseline =
              box.top +
              (box.height -
                ink.fontBoundingBoxAscent -
                ink.fontBoundingBoxDescent) /
                2 +
              ink.fontBoundingBoxAscent;
            surfaces.push({
              x: box.left - b.x + 2,
              y: baseline - ink.actualBoundingBoxAscent + scrollY - b.y + 1,
              w: Math.max(2, box.width - 4),
              body: b,
              glyph: true,
            });
          }
        }
        ctx.restore();
      } else if (b.el.matches(".button,.portrait,.skill-tags span,.coming")) {
        surfaces.push({ x: b.rect.x, y: b.rect.y, w: r.width, body: b });
      }
    });
    // Keep existing particles attached to their recalculated support after resize/font loading.
    particles.forEach((p) => {
      if (p.rest) {
        const old = p.rest;
        const next = surfaces.find(
          (s) => s.body === old.body && Math.abs(s.x - old.x) < 10,
        );
        if (next) {
          p.rest = next;
          p.offset = Math.min(p.offset, next.w);
        } else p.rest = null;
      }
    });
    dirty = false;
  }
  function resize() {
    W = innerWidth;
    H = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirty = true;
  }
  addEventListener("resize", resize);
  addEventListener(
    "scroll",
    () => {
      const under = document.elementFromPoint(pointer.x, pointer.y);
      pointer.inside = !!under && !under.closest("header,footer,.tool-dock");
    },
    { passive: true },
  );
  resize();
  document.fonts.ready.then(() => {
    dirty = true;
  });
  function closeMenus() {
    ui.querySelectorAll(".environment-menu").forEach((e) => (e.hidden = true));
    ui.querySelectorAll(".season-toggle").forEach((e) =>
      e.setAttribute("aria-expanded", "false"),
    );
  }
  ui.querySelectorAll(".season-toggle").forEach((b) =>
    b.addEventListener("click", () => {
      const menu = document.getElementById(b.getAttribute("aria-controls"));
      const open = menu.hidden;
      closeMenus();
      menu.hidden = !open;
      b.setAttribute("aria-expanded", String(open));
    }),
  );
  document.addEventListener("click", (e) => {
    if (!ui.contains(e.target)) closeMenus();
  });
  const snowballs = createSnowballScene({
    ctx,
    particles: () => particles,
    active: () =>
      tool === "snowball" &&
      season === "winter" &&
      enabled() &&
      !reduced.matches,
    size: () => ({ width: W, height: H }),
    announce: (message) => {
      flowerStatus.textContent = message;
    },
    en,
  });
  function particle(x, y, rest = null) {
    const p = {
      x,
      y,
      vx: rand(-10, 15),
      vy: rand(18, 48),
      size: season === "winter" ? rand(1.3, 3) : rand(7, 13),
      a: rand(0, 6.28),
      spin: rand(-1.4, 1.4),
      phase: rand(0, 6.28),
      color: Math.floor(rand(0, 4)),
      kind: season,
      rest,
      age: 0,
      restAge: 0,
      restLife: season === "winter" ? rand(18, 30) : rand(12, 22),
      species:
        season === "spring" &&
        particles.filter((p) => p.kind === "spring").length % 3 === 2
          ? "bee"
          : "butterfly",
      bloom: 0,
    };
    particles.push(p);
    return p;
  }
  function setSeason(next) {
    morphControls(next !== "none");
    season = next;
    snowballs.reset();
    washWave = null;
    selectTool("");
    flowers = [];
    sandDrawing = null;
    if (next !== "summer") sandStrokes = [];
    dirty = true;
    if (next === "none") selectTool("");
    updateAction();
    seaWind = 0;
    wetSand = [];
    particles = [];
    spawn = 0;
    document.body.dataset.season = next;
    const b = ui.querySelector(".season-toggle");
    b.setAttribute(
      "aria-label",
      next === "none"
        ? t("Atmosfera · disattivata", "Atmosphere · off")
        : `${t("Scegli stagione", "Choose season")}: ${names[next]}`,
    );
    b.title =
      next === "none"
        ? t("Scegli un’atmosfera", "Choose an atmosphere")
        : names[next];
    b.innerHTML =
      svg(next) +
      `<span>${next === "none" ? t("Atmosfera", "Atmosphere") : names[next]}</span><span class="chevron" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    ui.querySelectorAll("[data-season-choice]").forEach((el) =>
      el.setAttribute("aria-pressed", String(el.dataset.seasonChoice === next)),
    );
    if (dirty) measure();
    if (next !== "none" && enabled()) {
      surfaces.forEach((s) => {
        if (next === "winter" && (s.y < scrollY - 60 || s.y > scrollY + H + 60))
          return;
        const count =
          next === "winter"
            ? Math.min(45, Math.ceil(s.w / 6))
            : next === "autumn"
              ? s.glyph
                ? Math.random() < 0.19
                  ? 1
                  : 0
                : Math.min(4, Math.ceil(s.w / 130))
              : 0;
        for (let i = 0; i < count; i++) {
          const x = s.x + rand(1, Math.max(2, s.w - 1));
          const p = particle(x, s.y - rand(0, 3), s);
          p.offset = x - s.x;
          p.restAge = rand(0, p.restLife * 0.45);
          p.a = rand(-0.5, 0.5);
        }
      });
      for (
        let i = 0;
        i <
        (next === "winter"
          ? 60
          : next === "autumn"
            ? 12
            : next === "spring"
              ? 6
              : 0);
        i++
      )
        particle(rand(0, W), scrollY + rand(0, H));
    }
    closeMenus();
  }
  ui.querySelectorAll("[data-season-choice]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!enabled() && b.dataset.seasonChoice !== "none" && !reduced.matches)
        document.querySelector("#play-toggle").click();
      setSeason(b.dataset.seasonChoice);
    }),
  );
  function updateAction() {
    const action = ui.querySelector(".season-action");
    const icon =
      season === "summer"
        ? "shovel"
        : season === "spring"
          ? "plant"
          : season === "winter"
            ? "snowball"
            : "breeze";
    const label =
      season === "summer"
        ? t("Scava nella sabbia", "Dig in the sand")
        : season === "spring"
          ? t("Fai sbocciare", "Make it bloom")
          : season === "winter"
            ? t("Palla di neve", "Snowball")
            : t("Soffio", "Blow");
    action.inert = season === "none";
    action.setAttribute("aria-hidden", String(season === "none"));
    action.innerHTML = svg(icon) + `<span>${label}</span>`;
    action.setAttribute("aria-label", label);
    action.title = label;
    action.disabled =
      season === "none" ||
      ((season === "autumn" || season === "winter") &&
        (!enabled() || reduced.matches));
    if (season === "summer" && washWave) action.disabled = true;
    if (season === "summer") action.removeAttribute("aria-pressed");
    else action.setAttribute("aria-pressed", String(!!tool));
  }
  function selectTool(next) {
    snowballs.cancel();
    tool =
      (((next === "breeze" && season === "autumn") ||
        (next === "snowball" && season === "winter")) &&
        enabled() &&
        !reduced.matches) ||
      (next === "plant" && season === "spring") ||
      (next === "shovel" && season === "summer")
        ? next
        : "";
    ui.querySelector(".season-action").setAttribute(
      "aria-pressed",
      String(!!tool),
    );
    cursor.innerHTML = tool ? svg(tool) : "";
    cursor.hidden = true;
    document.body.classList.remove("tool-pointer-active");
    dock.hidden = !tool;
    waveButton.hidden = tool !== "shovel";
    dock.querySelector("button:not(.clean-sand)").ariaLabel = t(
      "Disattiva strumento",
      "Turn tool off",
    );
    dock.querySelector("span").textContent =
      tool === "shovel"
        ? t(
            "Paletta · Tieni premuto e trascina per scavare. Esc per finire.",
            "Shovel · Hold and drag to dig. Esc to finish.",
          )
        : tool === "snowball"
          ? t(
              "Palla di neve · Tieni premuto sulla neve, trascina e rilascia per lanciarla. Esc per finire.",
              "Snowball · Hold on settled snow, drag and release to throw. Esc to finish.",
            )
          : tool === "plant"
            ? t(
                "Scegli un punto nella pagina per piantare un fiore. Esc per finire.",
                "Choose a spot on the page to plant a flower. Esc to finish.",
              )
            : tool
              ? t(
                  "Soffio · Muovi il puntatore o trascina un dito. Esc per fermarla.",
                  "Blow · Move your pointer or drag a finger. Esc to stop.",
                )
              : "";
    closeMenus();
  }
  ui.querySelector(".season-action").onclick = () => {
    if (season === "summer") {
      selectTool(tool ? "" : "shovel");
      return;
    }
    selectTool(
      tool
        ? ""
        : season === "spring"
          ? "plant"
          : season === "winter"
            ? "snowball"
            : "breeze",
    );
  };
  dock.querySelector("button:not(.clean-sand)").onclick = () => selectTool("");
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openButton = ui.querySelector('[aria-expanded="true"]');
      closeMenus();
      if (openButton) openButton.focus();
      selectTool("");
    }
  });
  function moveWind(e) {
    const oldX = pointer.x,
      oldY = pointer.y;
    pointer.previousX = pointer.inside ? oldX : e.clientX;
    pointer.previousY = pointer.inside ? oldY : e.clientY;
    pointer.movedAt = performance.now();
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.inside = !e.target.closest("header,footer,.tool-dock");
    pointer.speed = Math.min(
      1,
      Math.hypot(pointer.x - oldX, pointer.y - oldY) / 70,
    );
    cursor.hidden = !tool || !pointer.inside || e.pointerType === "touch";
    document.body.classList.toggle("tool-pointer-active", !cursor.hidden);
    cursor.style.transform = `translate(${e.clientX - 21}px,${e.clientY - 21}px)`;
  }
  document.addEventListener("pointermove", moveWind, { passive: true });
  document.addEventListener("pointerdown", moveWind, { passive: true });
  document.addEventListener(
    "pointerup",
    (e) => {
      if (e.pointerType === "touch") pointer.inside = false;
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    pointer.inside = false;
    cursor.hidden = true;
    document.body.classList.remove("tool-pointer-active");
  });
  document.addEventListener("click", (e) => {
    if (!tool && season === "spring")
      particles.forEach((p) => {
        if (
          p.rest &&
          Math.hypot(p.x - e.clientX, p.y - e.clientY - scrollY) < 25
        ) {
          p.rest = null;
          p.flight = null;
        }
      });
  });
  document.addEventListener("click", (e) => {
    if (
      tool !== "plant" ||
      season !== "spring" ||
      e.target.closest("a,button,input,select,textarea,header,.tool-dock")
    )
      return;
    const flower = {
      x: e.clientX,
      y: e.clientY + scrollY,
      id: ++flowerSerial,
      age: reduced.matches ? 12 : 0,
      h: 42 + Math.random() * 24,
      type: (flowerSerial - 1) % 4,
      lean: rand(-9, 9),
      radius: rand(11, 15),
      turn: rand(-0.25, 0.25),
    };
    flowers.push(flower);
    if (flowers.length > 24) flowers.shift();
    flowerStatus.textContent = t("Fiore piantato.", "Flower planted.");
  });
  // The very same front is used for rendering and for erasing each sand point.
  const washTiming = { advance: 2.6, retreatStart: 3, retreatDuration: 5.5 };
  function washFront(x, elapsed) {
    const ease = (v) => v * v * (3 - 2 * v),
      retreat = Math.max(
        0,
        Math.min(
          1,
          (elapsed - washTiming.retreatStart) / washTiming.retreatDuration,
        ),
      );
    const coverage =
      elapsed < washTiming.retreatStart
        ? ease(Math.min(1, elapsed / washTiming.advance))
        : 1 - ease(retreat);
    const edge = H + 55 - (H + 125) * coverage;
    return (
      edge +
      Math.sin(x * 0.006 + elapsed * 0.65) * 12 +
      Math.sin(x * 0.019 - elapsed * 1.1) * 5 +
      Math.sin(x * 0.057 + elapsed) * 1.8
    );
  }
  function updateWashWave(dt, animate) {
    if (!washWave) return;
    if (!animate) {
      sandStrokes = [];
      washWave = null;
      updateAction();
      return;
    }
    washWave.elapsed += dt;
    const elapsed = washWave.elapsed,
      retreat = elapsed > washTiming.retreatStart;
    for (const stroke of sandStrokes)
      for (const p of stroke.points) {
        const y = p.y - scrollY,
          edge = washFront(p.x, elapsed);
        if (!retreat && y >= edge) p.waveWet = true;
        // No time-based fade: a groove vanishes exactly behind the receding foam.
        if (retreat && p.waveWet && y <= edge + 12) p.opacity = 0;
      }
    if (elapsed >= washTiming.retreatStart + washTiming.retreatDuration) {
      sandStrokes = [];
      washWave = null;
      updateAction();
      flowerStatus.textContent = t(
        "Sabbia lisciata dall’onda.",
        "The wave has smoothed the sand.",
      );
    }
  }
  function drawWashWave() {
    if (!washWave) return;
    const elapsed = washWave.elapsed,
      retreat = elapsed > washTiming.retreatStart;
    const front = (x) => washFront(x, elapsed);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, front(x));
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = "#79b5ad16";
    ctx.fill();
    ctx.clip();
    // A shallow sheet, not a uniform blue overlay: most colour stays at the crest.
    const crestWidth = retreat ? 24 : 40;
    for (let offset = 0; offset < crestWidth; offset += 2) {
      const depth = offset / crestWidth,
        alpha = (1 - depth) * (depth < 0.2 ? 0.25 : 0.13);
      ctx.fillStyle =
        depth < 0.2
          ? `rgba(220,241,226,${alpha})`
          : `rgba(126,177,167,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, front(0) + offset);
      for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, front(x) + offset);
      for (let x = W + 8; x >= 0; x -= 8) ctx.lineTo(x, front(x) + offset + 2);
      ctx.closePath();
      ctx.fill();
    }
    for (let i = 0; i < W / 13; i++) {
      const x = grain(i + 83) * W,
        y = front(x) + 20 + grain(i + 77) * 125;
      ctx.strokeStyle = `rgba(252,250,225,${0.08 + grain(i + 12) * 0.15})`;
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + 8,
        y - 2,
        x + 18 + grain(i) * 22,
        y + Math.sin(elapsed + i) * 2,
      );
      ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    // A broken, branching foam band follows each irregular lobe of the wave.
    for (let x = 0; x < W; x += 3) {
      const y = front(x),
        n = Math.floor(x / 3),
        density = 0.4 + grain(n + 44) * 0.6;
      ctx.strokeStyle = `rgba(255,253,237,${density * 0.85})`;
      ctx.lineWidth = 1.2 + grain(n + 16) * 2.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 3, front(x + 3));
      ctx.stroke();
      if (grain(n + 7) > 0.22) {
        const trail = (retreat ? 8 : 17) * grain(n + 31),
          radius = 0.8 + grain(n + 22) * 2.5;
        ctx.strokeStyle = `rgba(255,253,237,${density * 0.5})`;
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.ellipse(
          x + Math.sin(elapsed + n) * 1.5,
          y + 2 + trail,
          radius,
          radius * 0.5,
          grain(n) * 2,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      if (n % 7 === 0) {
        ctx.strokeStyle = "#fff9e766";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x, y + 2);
        ctx.bezierCurveTo(
          x - 3,
          y + 7,
          x + 8,
          y + 8,
          x + 5,
          y + (retreat ? 10 : 20),
        );
        ctx.stroke();
      }
      if (!retreat && n % 11 === 0) {
        const lift = (elapsed * 1.2 + grain(n)) % 1;
        ctx.fillStyle = `rgba(255,253,237,${(1 - lift) * 0.4})`;
        ctx.beginPath();
        ctx.arc(x + lift * 6, y - lift * 9, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  let seaTime = 0,
    seaWind = 0;
  let wetSand = [],
    seaHeight = 0;
  const grain = (n) => {
    const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  function drawSea(dt, animate) {
    if (animate) {
      const target = tool
        ? pointer.inside
          ? 0.75 + (pointer.speed || 0) * 0.25
          : 0.3
        : 0;
      seaWind +=
        (target - seaWind) * Math.min(1, dt * (target > seaWind ? 3 : 1.2));
      seaTime += dt * (0.85 + seaWind * 0.75);
      pointer.speed = (pointer.speed || 0) * 0.92;
    }
    const depth = W < 700 ? 125 : 170,
      step = 5,
      count = Math.ceil(W / step) + 1;
    if (wetSand.length !== count || seaHeight !== H) {
      wetSand = Array(count).fill(H);
      seaHeight = H;
    }
    const front = [];
    for (let i = 0; i < count; i++) {
      const x = i * step;
      // A fast incoming wash and a longer retreat, offset along the shore.
      const phase =
        (seaTime * 0.8 + x * 0.0018 + Math.sin(x * 0.005) * 0.3) %
        (Math.PI * 2);
      const wash = Math.pow((1 - Math.cos(phase)) * 0.5, 1.8);
      const coast =
        Math.sin(x * 0.003 + 1) * depth * 0.12 + Math.sin(x * 0.009) * 3;
      const local = seaWind * Math.exp(-Math.pow((x - pointer.x) / 200, 2));
      const chop =
        Math.sin(x * 0.045 - seaTime * 3.6) * (1 + seaWind * 3 + local * 3) +
        Math.sin(x * 0.081 + seaTime * 2) * local * 2;
      const y =
        H -
        depth * 0.39 -
        coast -
        wash * depth * (0.43 + seaWind * 0.17) -
        local * 9 +
        chop;
      front.push(y);
      if (animate) wetSand[i] = Math.min(y - 5, wetSand[i] + dt * 2.7);
      else wetSand[i] = y - 9;
    }
    if (animate) {
      const shoreOffset = document.documentElement.scrollHeight - H;
      for (const stroke of sandStrokes)
        for (const point of stroke.points) {
          const index = Math.max(
            0,
            Math.min(front.length - 1, Math.round(point.x / step)),
          );
          if (point.y > shoreOffset + front[index])
            point.opacity = Math.max(0, point.opacity - dt * 0.6);
        }
      sandStrokes = sandStrokes.filter(
        (stroke) =>
          stroke === sandDrawing || stroke.points.some((p) => p.opacity > 0.02),
      );
    }
    ctx.save();
    // Dry sand fades naturally into the page; no hard top edge.
    const sand = ctx.createLinearGradient(0, H - depth - 30, 0, H);
    sand.addColorStop(0, "#e5cda400");
    sand.addColorStop(0.4, "#e8d2ac45");
    sand.addColorStop(1, "#ddc098d9");
    ctx.fillStyle = sand;
    ctx.fillRect(0, H - depth - 30, W, depth + 30);
    for (let i = 0; i < W * 0.6; i++) {
      const x = grain(i) * W,
        y = H - grain(i + 900) * depth;
      ctx.fillStyle = i % 3 ? "#93744c19" : "#fff7df66";
      ctx.fillRect(x, y, grain(i + 7) * 1.3 + 0.3, 0.6);
    }
    ctx.beginPath();
    ctx.moveTo(0, H);
    wetSand.forEach((y, i) => ctx.lineTo(i * step, y));
    ctx.lineTo(W, H);
    ctx.closePath();
    const wet = ctx.createLinearGradient(0, H - depth, 0, H);
    wet.addColorStop(0, "#a78d6b40");
    wet.addColorStop(1, "#a78d6b85");
    ctx.fillStyle = wet;
    ctx.fill();
    // Each wash spreads a translucent sheet of shallow water over the sand.
    ctx.beginPath();
    ctx.moveTo(0, H);
    front.forEach((y, i) => ctx.lineTo(i * step, y));
    ctx.lineTo(W, H);
    ctx.closePath();
    const water = ctx.createLinearGradient(0, H - depth, 0, H);
    water.addColorStop(0, "#b7d7c652");
    water.addColorStop(0.4, "#91c7bba3");
    water.addColorStop(0.78, "#529faaa8");
    water.addColorStop(1, "#347f91cc");
    ctx.fillStyle = water;
    ctx.fill();
    ctx.save();
    ctx.clip();
    // Broken, moving reflections replace the previous parallel stripes.
    for (let i = 0; i < Math.ceil(W / 18); i++) {
      const x = grain(i + 200) * W + Math.sin(seaTime * 0.6 + i) * 8;
      const y =
        H - grain(i + 500) * depth * 0.7 + Math.sin(seaTime * 1.1 + i) * 3;
      ctx.strokeStyle = `rgba(234,250,240,${0.06 + grain(i + 70) * 0.22})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 6, y - 2 - seaWind * 2, x + 12 + seaWind * 5, y);
      ctx.stroke();
    }
    ctx.restore();
    // Foam breaks into small patches and thins as the water retreats.
    for (let i = 0; i < count - 1; i++) {
      const x = i * step,
        y = front[i];
      const broken = 0.3 + 0.7 * grain(i + 30);
      ctx.strokeStyle = `rgba(255,253,239,${broken * 0.75})`;
      ctx.lineWidth = 1 + grain(i + 13) * 1.7 + seaWind;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + step, front[i + 1]);
      ctx.stroke();
      if (grain(i + 40) > 0.35) {
        ctx.fillStyle = `rgba(255,253,239,${broken * 0.6})`;
        ctx.beginPath();
        ctx.ellipse(
          x + Math.sin(seaTime + i) * 2,
          y + 2 + grain(i + 90) * 6,
          1 + grain(i + 12) * 2.5,
          0.6 + grain(i + 14),
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      const gap = y - wetSand[i];
      if (gap > 7 && gap < 26) {
        ctx.fillStyle = `rgba(255,249,228,${(1 - gap / 26) * 0.24})`;
        ctx.fillRect(x, wetSand[i] + 3, 2, 0.8);
      }
      const local = seaWind * Math.exp(-Math.pow((x - pointer.x) / 160, 2));
      if (local > 0.3 && i % 4 === 0) {
        const lift = (seaTime * 1.4 + grain(i)) % 1;
        ctx.fillStyle = `rgba(255,253,240,${(1 - lift) * local * 0.65})`;
        ctx.beginPath();
        ctx.arc(
          x + lift * 18 * local,
          y - lift * 17 * local,
          1 - lift * 0.6,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
    ctx.restore();
  }
  function leaf(p) {
    ctx.fillStyle = ["#b75d32", "#d5973e", "#9c4e32", "#c57d36"][p.color];
    ctx.beginPath();
    ctx.moveTo(-p.size, 0);
    ctx.bezierCurveTo(
      -p.size * 0.4,
      -p.size * 0.85,
      p.size * 0.65,
      -p.size * 0.65,
      p.size,
      0,
    );
    ctx.bezierCurveTo(
      p.size * 0.3,
      p.size * 0.7,
      -p.size * 0.5,
      p.size * 0.65,
      -p.size,
      0,
    );
    ctx.fill();
    ctx.strokeStyle = "#67492b88";
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(-p.size - 3, 1);
    ctx.lineTo(p.size, 0);
    for (let i = -1; i <= 1; i++) {
      ctx.moveTo(i * p.size * 0.35, 0);
      ctx.lineTo(i * p.size * 0.35 + 3, -p.size * 0.35);
      ctx.moveTo(i * p.size * 0.35, 0);
      ctx.lineTo(i * p.size * 0.35 + 3, p.size * 0.3);
    }
    ctx.stroke();
  }
  function drawParticle(p, time) {
    const sy = p.y - scrollY;
    if (sy < -35 || sy > H + 35) return;
    ctx.save();
    if (p.kind === "autumn" || p.kind === "winter")
      ctx.globalAlpha = Math.max(
        0,
        Math.min(1, (p.restLife - p.restAge) / 4, (90 - p.age) / 4),
      );
    ctx.translate(p.x, sy);
    ctx.rotate(p.a);
    if (p.kind === "autumn") {
      ctx.scale(1, 0.6 + Math.abs(Math.sin(p.phase + time * 0.001)) * 0.4);
      leaf(p);
    } else if (p.kind === "winter") {
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#526f8c99";
      ctx.shadowBlur = p.rest ? 2.5 : 1.5;
      ctx.shadowOffsetY = 1;
      ctx.strokeStyle = "#8ba1b45c";
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * (p.rest ? 1.8 : 1), p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (p.brushed) {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.cos(p.phase + i * 2.1) * p.size,
            Math.sin(p.phase + i * 2.1) * p.size,
            p.size * 0.55,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    } else if (p.kind === "spring") {
      if (p.species === "bee") {
        ctx.rotate(p.rest ? -0.4 : 0.15);
        const flutter = p.rest
          ? 0.35
          : 0.6 + Math.abs(Math.sin(time * 0.065 + p.phase)) * 0.4;
        ctx.fillStyle = "#d5e7e3b3";
        ctx.strokeStyle = "#a4c2c288";
        ctx.lineWidth = 0.5;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(
            side * 3,
            -3,
            3.2,
            6 * flutter,
            side * 0.45,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = "#c6a14b";
        ctx.beginPath();
        ctx.ellipse(0, 2, 3.4, 5.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#514b39";
        ctx.lineWidth = 1.5;
        for (const y of [0, 3]) {
          ctx.beginPath();
          ctx.moveTo(-2.8, y);
          ctx.lineTo(2.8, y);
          ctx.stroke();
        }
        ctx.fillStyle = "#494a3c";
        ctx.beginPath();
        ctx.arc(0, -4, 2.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const wing = p.rest
          ? 0.32 + Math.sin(time * 0.0018 + p.phase) * 0.1
          : Math.max(0.16, Math.abs(Math.sin(time * 0.014 + p.phase)));
        ctx.scale(wing, 1);
        ctx.fillStyle = ["#d5a25e", "#e0bb79", "#a7b8a0", "#baa5cb"][p.color];
        ctx.strokeStyle = "#6b665f80";
        ctx.lineWidth = 0.6;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(side * 5, -3, 5.8, 8.5, side * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(side * 4, 5, 4.2, 5, side * -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#fff1d688";
          ctx.beginPath();
          ctx.arc(side * 6, -4, 1.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = ["#d5a25e", "#e0bb79", "#a7b8a0", "#baa5cb"][p.color];
        }
        ctx.fillStyle = "#5f5947";
        ctx.fillRect(-0.7, -6, 1.4, 13);
        ctx.strokeStyle = "#5f5947";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(-2, -9);
        ctx.moveTo(0, -5);
        ctx.lineTo(2, -9);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function flyButterfly(p, dt, time, live) {
    const available = flowers.filter(
      (f) =>
        f.age > 8 &&
        f.y > scrollY - 20 &&
        f.y < H + scrollY + 80 &&
        Math.hypot(f.x - p.x, f.y - f.h - p.y) < 700,
    );
    if (p.rest) {
      if (p.rest.flower && !flowers.includes(p.rest.flower)) {
        p.rest = null;
        p.flight = null;
        return;
      }
      if (!p.rest.flower && available.length) {
        p.rest = null;
        p.flight = null;
        return;
      }
      p.restAge += dt;
      p.x = p.rest.x + p.offset + p.rest.body.x;
      p.y = p.rest.y + p.rest.body.y - 7;
      p.a = p.rest.flower ? 0.15 : 0;
      if (p.restAge > p.pause) {
        p.previous = p.rest;
        p.lastFlower = p.rest.flower || p.lastFlower;
        p.rest = null;
        p.flight = null;
        p.cooldown = p.age + 3;
      }
      return;
    }
    if (!p.flight) {
      const others = available.filter((f) => f !== p.lastFlower);
      const choicesOfFlowers = others.length
        ? others
        : available.filter((f) => p.age > (p.cooldown || 0));
      const occupancy = (f) =>
        particles.filter(
          (q) =>
            q !== p && (q.rest?.flower === f || q.flight?.target?.flower === f),
        ).length;
      choicesOfFlowers.sort(
        (a, b) =>
          occupancy(a) - occupancy(b) ||
          Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y),
      );
      const flower = choicesOfFlowers[0];
      let target;
      if (flower) {
        const angle = (occupancy(flower) * 2.4 + p.phase) % (Math.PI * 2),
          radius = flower.radius * 0.55;
        target = {
          x: flower.x + flower.lean + Math.cos(angle) * radius,
          y: flower.y - flower.h + Math.sin(angle) * radius + 7,
          w: 1,
          body: { x: 0, y: 0 },
          flower,
        };
      } else {
        const supports = live.filter(
          (s) =>
            s !== p.previous && s.y > scrollY + 80 && s.y < scrollY + H - 30,
        );
        target = supports[Math.floor(Math.random() * supports.length)];
      }
      p.flight = {
        x: p.x,
        y: p.y,
        target,
        offset: target?.flower
          ? 0
          : target
            ? rand(1, Math.max(2, target.w - 1))
            : 0,
        endX: rand(30, W - 30),
        endY: scrollY + rand(100, Math.max(110, H - 60)),
        elapsed: 0,
        duration: p.species === "bee" ? rand(2, 3.5) : rand(3, 5),
        arc: rand(-70, 70),
      };
    }
    if (!p.flight.target?.flower && available.some((f) => f !== p.lastFlower)) {
      p.flight = null;
      return;
    }
    const f = p.flight;
    f.elapsed += dt;
    const u = Math.min(1, f.elapsed / f.duration),
      e = u * u * (3 - 2 * u);
    const tx = f.target ? f.target.x + f.offset + f.target.body.x : f.endX,
      ty = f.target ? f.target.y + f.target.body.y - 7 : f.endY;
    p.x = f.x + (tx - f.x) * e + Math.sin(u * Math.PI) * f.arc;
    p.y =
      f.y +
      (ty - f.y) * e -
      Math.sin(u * Math.PI) * 55 +
      Math.sin(time * 0.004 + p.phase) * 6 * Math.sin(u * Math.PI);
    p.a = Math.sin(time * 0.003 + p.phase) * 0.2 * Math.sin(u * Math.PI);
    if (u === 1) {
      p.rest = f.target || null;
      p.offset = f.offset;
      p.restAge = 0;
      p.pause = p.species === "bee" ? rand(3, 5) : rand(4, 7);
      p.flight = null;
    }
  }
  function loop(time) {
    const dt = Math.min((time - last) / 1000 || 0.016, 0.035);
    last = time;
    if (dirty) measure();
    ctx.clearRect(0, 0, W, H);
    const animate = enabled() && !reduced.matches && !document.hidden;
    if (season === "winter") snowballs.draw(dt, animate);
    if (season === "summer" && animate) updateSun(dt);
    if (animate) {
      spawn += dt;
      const interval =
        season === "winter" ? 0.075 : season === "autumn" ? 0.7 : 2;
      if (
        (season === "autumn" ||
          season === "winter" ||
          (season === "spring" && particles.length < 6)) &&
        spawn > interval &&
        particles.length < 1100
      ) {
        spawn = 0;
        particle(rand(-20, W + 20), scrollY - 20);
      }
    }
    if (season === "spring")
      SeasonalRenderers.drawFlowers(
        ctx,
        flowers,
        dt,
        animate,
        reduced,
        H,
        scrollY,
        grain,
      );
    const live = surfaces.filter(
      (s) => s.y > scrollY - 30 && s.y < scrollY + H + 40,
    );
    for (const p of particles) {
      if (animate) {
        p.age += dt;
        if (p.rest && (p.kind === "autumn" || p.kind === "winter"))
          p.restAge += dt;
        const py = p.y;
        const dx = p.x - pointer.x,
          dy = p.y - (pointer.y + scrollY),
          dist = Math.hypot(dx, dy);
        if (tool === "breeze" && pointer.inside && dist < 170) {
          p.rest = null;
          const force = (1 - dist / 170) * 1800;
          p.vx += (dx / Math.max(dist, 15) + 0.7) * force * dt;
          p.vy += (dy / Math.max(dist, 15) - 0.65) * force * dt;
          p.spin += dt * 3;
        }
        if (p.kind === "spring") {
          if (tool === "breeze" && pointer.inside && dist < 170) {
            p.previous = p.rest;
            p.rest = null;
            p.flight = null;
            p.x += dt * 100;
            p.y -= dt * 100;
          }
          flyButterfly(p, dt, time, live);
        } else if (p.rest) {
          p.x = p.rest.x + p.offset + p.rest.body.x;
          p.y = p.rest.y + p.rest.body.y - 2;
          p.a += Math.sin(time * 0.001 + p.phase) * dt * 0.08;
        } else {
          p.vx *= Math.exp(-0.65 * dt);
          if (p.brushed) {
            p.detachAge += dt;
            p.vy += 640 * dt;
            p.vx *= Math.exp(-1.1 * dt);
          } else p.vy += ((p.kind === "winter" ? 12 : 22) - p.vy * 0.45) * dt;
          p.x +=
            (p.vx +
              Math.sin(time * 0.0012 + p.phase) *
                (p.kind === "winter" ? 9 : 22)) *
            dt;
          p.y += p.vy * dt;
          p.a += p.spin * dt;
          if (p.vy > 0 && p.age > 0.8 && (!p.brushed || p.detachAge > 0.18)) {
            const surface = live.find(
              (s) =>
                p.x > s.x &&
                p.x < s.x + s.w &&
                py <= s.y + s.body.y &&
                p.y >= s.y + s.body.y,
            );
            if (surface) {
              p.rest = surface;
              p.brushed = false;
              p.restAge = 0;
              p.offset = p.x - surface.x;
              p.y = surface.y;
              p.vx = p.vy = 0;
              p.a = rand(-0.4, 0.4);
            }
          }
        }
      }
      drawParticle(p, time);
    }
    particles = particles.filter(
      (p) =>
        p.size > 0.15 &&
        (!(p.kind === "autumn" || p.kind === "winter") ||
          (p.age < 90 && p.restAge < p.restLife)) &&
        (p.kind === "spring" ||
          p.rest ||
          (p.y < scrollY + H + 150 && p.x > -350 && p.x < W + 350)),
    );

    if (season === "summer") {
      updateWashWave(dt, animate);
      SeasonalRenderers.drawSand(ctx, sandStrokes, H, scrollY, grain);
      const bottom = document.documentElement.scrollHeight - scrollY;
      if (bottom < H + 220) {
        ctx.save();
        ctx.translate(0, bottom - H);
        drawSea(dt, animate);
        ctx.restore();
      }
      drawWashWave();
    }
    if (tool === "breeze" && pointer.inside && animate) {
      ctx.strokeStyle = "#79938855";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const offset = (time * 0.15 + i * 30) % 150;
        ctx.beginPath();
        ctx.ellipse(
          pointer.x + offset,
          pointer.y,
          offset * 0.3 + 5,
          offset * 0.15 + 3,
          0,
          -0.7,
          0.7,
        );
        ctx.stroke();
      }
    }
    requestAnimationFrame(loop);
  }
  let wasEnabled = enabled();
  new MutationObserver(() => {
    const now = enabled();
    if (now === wasEnabled) return;
    wasEnabled = now;
    if (!now) {
      selectTool("");
      setSeason("none");
    }
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  setSeason("none");
  requestAnimationFrame(loop);
  // Animate the actual Keepify description, preserving its accessible text.
  const projects = [...document.querySelectorAll(".project")];
  const activeWords = new Set();
  function composeDescription(project) {
    if (!enabled() || reduced.matches) return;
    const paragraph = project.querySelector(":scope > p");
    const original = paragraph.textContent;
    const accessible = document.createElement("span");
    accessible.className = "sr-only";
    accessible.textContent = original;
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    const words = original
      .split(/(\s+)/)
      .map((word) => {
        if (!word.trim()) {
          visual.append(document.createTextNode(word));
          return null;
        }
        const span = document.createElement("span");
        span.className = "composing-word";
        span.textContent = word;
        visual.append(span);
        return span;
      })
      .filter(Boolean);
    paragraph.replaceChildren(accessible, visual);
    const bounds = paragraph.getBoundingClientRect();
    const animations = words.map((word, i) => {
      const box = word.getBoundingClientRect();
      const offset = Math.max(
        bounds.left - box.left,
        Math.min(bounds.right - box.right, rand(-32, 32)),
      );
      return word.animate(
        [
          {
            transform: `translate(${offset}px,${rand(-20, 20)}px) rotate(${rand(-12, 12)}deg)`,
            opacity: 0.35,
          },
          { transform: "translate(0,0) rotate(0)", opacity: 1 },
        ],
        {
          duration: 2700,
          delay: 200 + i * 22,
          easing: "cubic-bezier(.2,.75,.25,1)",
          fill: "both",
        },
      );
    });
    const finish = () => {
      animations.forEach((a) => a.cancel());
      paragraph.textContent = original;
      activeWords.delete(finish);
    };
    activeWords.add(finish);
    Promise.all(animations.map((a) => a.finished))
      .then(finish)
      .catch(() => {});
  }
  new MutationObserver(() => {
    if (!enabled()) for (const finish of [...activeWords]) finish();
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  const started = new Set();
  function startProject(project) {
    if (started.has(project)) return;
    started.add(project);
    project.classList.add("story-visible");
    if (project === projects[1]) composeDescription(project);
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target.id === "projects-title") {
          startProject(projects[0]);
          if (innerWidth > 700) startProject(projects[1]);
        } else startProject(projects[1]);
        observer.unobserve(entry.target);
      }),
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
  );
  observer.observe(document.querySelector("#projects-title"));
  observer.observe(projects[1].querySelector(".project-heading"));
})();
