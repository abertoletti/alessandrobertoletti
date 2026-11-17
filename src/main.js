// Seasonal photographs render directly at source resolution, without a canvas mesh.
const portraitImages = {
  none: "neutral-v2",
  spring: "spring",
  summer: "summer",
  autumn: "autumn",
  winter: "winter",
};
const playfulPortraits = {
  spring: "fun-spring-moto",
  summer: "fun-summer-v2",
  autumn: "fun-autumn",
  winter: "fun-winter",
};
const english = document.documentElement.lang === "en";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let play = !reducedMotion.matches;
const portrait = document.querySelector("#portrait");
const photoCache = new Map();
let portraitRequest = 0;

let secretLayer = null,
  revealFrame = 0,
  revealPoint = null,
  portraitBounds = null,
  hintShown = false,
  revealInput = "pointer";
const lens = {
  x: 0,
  y: 0,
  radius: 0,
  vr: 0,
  trailX: 0,
  trailY: 0,
  stretch: 0,
  angle: 0,
  open: false,
  last: 0,
};
function canReveal() {
  return (
    play &&
    secretLayer &&
    !document.querySelector('.season-action[aria-pressed="true"]')
  );
}
function aperturePath(x, y, rx, ry, angle) {
  const c = Math.cos(angle),
    s = Math.sin(angle),
    k = 0.5522848;
  const p = (a, b) =>
    [
      (x + a * rx * c - b * ry * s).toFixed(2),
      (y + a * rx * s + b * ry * c).toFixed(2),
    ].join(" ");
  return (
    "M" +
    p(1, 0) +
    " C" +
    p(1, k) +
    " " +
    p(k, 1) +
    " " +
    p(0, 1) +
    " C" +
    p(-k, 1) +
    " " +
    p(-1, k) +
    " " +
    p(-1, 0) +
    " C" +
    p(-1, -k) +
    " " +
    p(-k, -1) +
    " " +
    p(0, -1) +
    " C" +
    p(k, -1) +
    " " +
    p(1, -k) +
    " " +
    p(1, 0) +
    "Z"
  );
}
function scheduleReveal() {
  if (!revealFrame && !document.hidden) {
    lens.last = 0;
    revealFrame = requestAnimationFrame(animateReveal);
  }
}
function hideReveal(immediate = false) {
  revealPoint = null;
  lens.open = false;
  if (immediate || reducedMotion.matches || !secretLayer) {
    cancelAnimationFrame(revealFrame);
    revealFrame = 0;
    lens.radius = lens.vr = lens.stretch = 0;
    if (secretLayer) {
      secretLayer.style.clipPath = "circle(0px at 50% 50%)";
      secretLayer.style.setProperty("--reveal-radius", "0px");
      secretLayer.rim.style.opacity = "0";
      secretLayer.trail.style.opacity = "0";
    }
    portrait.classList.remove("is-revealing");
    return;
  }
  scheduleReveal();
}
function animateReveal(time) {
  revealFrame = 0;
  if (!secretLayer || document.hidden) return;
  if (lens.open && !canReveal()) {
    hideReveal(true);
    return;
  }
  const dt = Math.min((time - lens.last) / 1000 || 1 / 60, 0.032);
  lens.last = time;
  const rect =
    portraitBounds || (portraitBounds = portrait.getBoundingClientRect());
  const targetRadius = lens.open
    ? Math.max(60, Math.min(84, rect.width * 0.22))
    : 0;
  const tx = revealPoint
    ? Math.max(0, Math.min(rect.width, revealPoint.x - rect.left))
    : lens.x;
  const ty = revealPoint
    ? Math.max(0, Math.min(rect.height, revealPoint.y - rect.top))
    : lens.y;
  const oldX = lens.x,
    oldY = lens.y,
    follow = 1 - Math.exp(-dt * 24);
  lens.x += (tx - lens.x) * follow;
  lens.y += (ty - lens.y) * follow;
  const speed = Math.hypot(lens.x - oldX, lens.y - oldY) / dt;
  if (speed > 10) lens.angle = Math.atan2(lens.y - oldY, lens.x - oldX);
  lens.stretch +=
    (Math.min(0.2, speed / 5000) - lens.stretch) * (1 - Math.exp(-dt * 16));
  lens.vr += ((targetRadius - lens.radius) * 576 - lens.vr * 34) * dt;
  lens.radius = Math.max(0, lens.radius + lens.vr * dt);
  lens.trailX += (lens.x - lens.trailX) * (1 - Math.exp(-dt * 12));
  lens.trailY += (lens.y - lens.trailY) * (1 - Math.exp(-dt * 12));
  if (reducedMotion.matches) {
    lens.x = tx;
    lens.y = ty;
    lens.radius = targetRadius;
    lens.vr = 0;
    lens.stretch = 0;
    lens.trailX = tx;
    lens.trailY = ty;
  }
  const rx = lens.radius * (1 + lens.stretch),
    ry = lens.radius * (1 - lens.stretch * 0.35);
  secretLayer.style.clipPath =
    'path("' + aperturePath(lens.x, lens.y, rx, ry, lens.angle) + '")';
  secretLayer.style.setProperty("--reveal-radius", lens.radius + "px");
  const diameter = Math.max(0, lens.radius * 2),
    transform =
      "translate3d(" +
      lens.x +
      "px," +
      lens.y +
      "px,0) rotate(" +
      lens.angle +
      "rad) scale(" +
      (1 + lens.stretch) +
      "," +
      (1 - lens.stretch * 0.35) +
      ") translate(-50%,-50%)";
  Object.assign(secretLayer.rim.style, {
    width: diameter + "px",
    height: diameter + "px",
    transform,
    opacity: String(Math.min(1, lens.radius / 30)),
  });
  Object.assign(secretLayer.trail.style, {
    width: diameter + "px",
    height: diameter + "px",
    transform:
      "translate3d(" +
      lens.trailX +
      "px," +
      lens.trailY +
      "px,0) translate(-50%,-50%)",
    opacity: String(
      Math.min(
        0.32,
        Math.hypot(lens.x - lens.trailX, lens.y - lens.trailY) / 120,
      ) *
        (lens.radius / 84),
    ),
  });
  const settled =
    Math.hypot(tx - lens.x, ty - lens.y) < 0.08 &&
    Math.abs(targetRadius - lens.radius) < 0.08 &&
    Math.abs(lens.vr) < 0.4 &&
    Math.hypot(lens.x - lens.trailX, lens.y - lens.trailY) < 0.1 &&
    lens.stretch < 0.001;
  if (settled) {
    if (!lens.open) hideReveal(true);
    return;
  }
  revealFrame = requestAnimationFrame(animateReveal);
}
function moveReveal(event) {
  if (!canReveal()) return;
  revealInput = event.keyboard ? "keyboard" : "pointer";
  revealPoint = { x: event.clientX, y: event.clientY };
  if (!lens.open) {
    portrait.querySelector(".portal-hint")?.remove();
    const r =
      portraitBounds || (portraitBounds = portrait.getBoundingClientRect());
    lens.x = lens.trailX = Math.max(
      0,
      Math.min(r.width, event.clientX - r.left),
    );
    lens.y = lens.trailY = Math.max(
      0,
      Math.min(r.height, event.clientY - r.top),
    );
    lens.open = true;
  }
  portrait.classList.add("is-revealing");
  scheduleReveal();
}
portrait.addEventListener("pointerenter", (e) => {
  portraitBounds = null;
  moveReveal(e);
});
portrait.addEventListener("pointermove", moveReveal);
portrait.addEventListener("pointerleave", () => {
  if (revealInput !== "keyboard") hideReveal();
});
portrait.addEventListener("pointercancel", () => hideReveal(true));
portrait.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch" && canReveal()) {
    portrait.setPointerCapture(e.pointerId);
    moveReveal(e);
  }
});
portrait.addEventListener("pointerup", (e) => {
  if (e.pointerType !== "mouse") hideReveal();
});
portrait.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideReveal();
    return;
  }
  if (!canReveal()) return;
  if (
    !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(
      e.key,
    )
  )
    return;
  e.preventDefault();
  const r = portrait.getBoundingClientRect();
  const point = revealPoint || {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
  };
  point.x += e.key === "ArrowRight" ? 24 : e.key === "ArrowLeft" ? -24 : 0;
  point.y += e.key === "ArrowDown" ? 24 : e.key === "ArrowUp" ? -24 : 0;
  moveReveal({
    keyboard: true,
    clientX: Math.max(r.left, Math.min(r.right, point.x)),
    clientY: Math.max(r.top, Math.min(r.bottom, point.y)),
  });
});
portrait.addEventListener("blur", () => hideReveal());
addEventListener(
  "scroll",
  () => {
    portraitBounds = null;
    if (
      revealInput === "keyboard" &&
      document.activeElement === portrait &&
      lens.open
    ) {
      const r = portrait.getBoundingClientRect();
      portraitBounds = r;
      revealPoint = { x: r.left + lens.x, y: r.top + lens.y };
      scheduleReveal();
    } else hideReveal(true);
  },
  { passive: true },
);
addEventListener(
  "resize",
  () => {
    portraitBounds = null;
    hideReveal();
  },
  { passive: true },
);
function framedPhoto(photo, name, foregroundName) {
  const image = photo.cloneNode();
  image.alt = "";
  image.draggable = false;
  const crop = foregroundName
    ? portraitRevealFrame(
        name,
        foregroundName,
        photo.naturalWidth,
        photo.naturalHeight,
      )
    : portraitFrame(name, photo.naturalWidth, photo.naturalHeight);
  Object.assign(image.style, {
    left: crop.x / 6 + "%",
    top: crop.y / 6 + "%",
    width: crop.width / 6 + "%",
    height: crop.height / 6 + "%",
  });
  return image;
}
function loadPhoto(name, priority = "auto") {
  if (!photoCache.has(name)) {
    const photo = new Image();
    photo.decoding = "async";
    photo.fetchPriority = priority;
    photo.src = new URL(
      (english ? "../" : "./") + "public/portraits/optimized/" + name + ".webp",
      document.baseURI,
    ).href;
    photoCache.set(
      name,
      photo
        .decode()
        .then(() => photo)
        .catch((error) => {
          photoCache.delete(name);
          throw error;
        }),
    );
  }
  return photoCache.get(name);
}
async function showPortrait(season = "none") {
  const request = ++portraitRequest;
  hideReveal(true);
  secretLayer = null;
  delete portrait.dataset.secret;
  portrait.classList.remove("has-secret");
  portrait.removeAttribute("tabindex");
  portrait.setAttribute(
    "aria-label",
    english
      ? "Portrait of Alessandro Bertoletti"
      : "Ritratto di Alessandro Bertoletti",
  );
  let name = portraitImages[season] || portraitImages.none;
  let photo;
  try {
    photo = await loadPhoto(name, name === "neutral-v2" ? "high" : "auto");
  } catch {
    try {
      name = portraitImages.none;
      photo = await loadPhoto(name);
    } catch {
      return;
    }
  }
  if (request !== portraitRequest) return;
  const scene = document.createElement("div");
  scene.className = "portrait-scene";
  scene.append(framedPhoto(photo, name));
  const previous = portrait.lastElementChild;
  portrait.replaceChildren(...(previous ? [previous] : []), scene);
  portrait.dataset.portrait = name;
  if (previous && previous.dataset.name !== name && !reducedMotion.matches) {
    const fade = scene.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      easing: "ease-out",
    });
    fade.finished.then(() => previous.remove()).catch(() => previous.remove());
  } else previous?.remove();
  scene.dataset.name = name;
  const hiddenName = playfulPortraits[season];
  if (!hiddenName) return;
  try {
    const hidden = await loadPhoto(hiddenName, "low");
    if (request !== portraitRequest) return;
    const layer = document.createElement("div");
    layer.className = "portrait-secret";
    layer.setAttribute("aria-hidden", "true");
    layer.append(framedPhoto(hidden, hiddenName, name));
    const rim = document.createElement("div");
    rim.className = "portal-rim";
    rim.setAttribute("aria-hidden", "true");
    const trail = document.createElement("div");
    trail.className = "portal-trail";
    trail.setAttribute("aria-hidden", "true");
    layer.rim = rim;
    layer.trail = trail;
    scene.append(layer, trail, rim);
    secretLayer = layer;
    if (!hintShown && !reducedMotion.matches && play) {
      hintShown = true;
      const hint = document.createElement("div");
      hint.className = "portal-hint";
      hint.setAttribute("aria-hidden", "true");
      scene.append(hint);
      hint.addEventListener("animationend", () => hint.remove(), {
        once: true,
      });
    }
    portrait.classList.add("has-secret");
    portrait.tabIndex = 0;
    portrait.dataset.secret = hiddenName;
    portrait.setAttribute(
      "aria-label",
      english
        ? "Portrait of Alessandro Bertoletti. Move the pointer or drag a finger to explore a hidden photo. Use the arrow keys when focused."
        : "Ritratto di Alessandro Bertoletti. Muovi il puntatore o trascina un dito per esplorare una foto nascosta. Quando selezionato, usa le frecce.",
    );
  } catch {
    /* The professional portrait stays available if the hidden asset fails. */
  }
}
new MutationObserver(() => showPortrait(document.body.dataset.season)).observe(
  document.body,
  { attributes: true, attributeFilter: ["data-season"] },
);
showPortrait(document.body.dataset.season);
function syncPlay() {
  if (!play) hideReveal(true);
  const toggle = document.querySelector("#play-toggle");
  toggle.setAttribute("aria-pressed", String(play));
  toggle.textContent = `${english ? "Interactions" : "Interazioni"}: ${play ? "ON" : "OFF"}`;
  document.body.classList.toggle("no-play", !play);
}
document.querySelector("#play-toggle").addEventListener("click", () => {
  play = !play;
  syncPlay();
});
reducedMotion.addEventListener("change", (event) => {
  play = !event.matches;
  syncPlay();
});
syncPlay();
document.querySelector("#year").textContent = new Date().getFullYear();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) hideReveal(true);
});
