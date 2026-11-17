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
  portraitBounds = null;
function hideReveal() {
  cancelAnimationFrame(revealFrame);
  revealFrame = 0;
  revealPoint = null;
  secretLayer?.style.setProperty("--reveal-radius", "0px");
  portrait.classList.remove("is-revealing");
}
function canReveal() {
  return (
    play &&
    secretLayer &&
    !document.querySelector('.season-action[aria-pressed="true"]')
  );
}
function moveReveal(event) {
  if (!canReveal()) return;
  revealPoint = { x: event.clientX, y: event.clientY };
  if (revealFrame) return;
  revealFrame = requestAnimationFrame(() => {
    revealFrame = 0;
    if (!canReveal() || !revealPoint) return;
    const r =
      portraitBounds || (portraitBounds = portrait.getBoundingClientRect());
    const x = Math.max(0, Math.min(r.width, revealPoint.x - r.left)),
      y = Math.max(0, Math.min(r.height, revealPoint.y - r.top));
    secretLayer.style.setProperty("--reveal-x", x + "px");
    secretLayer.style.setProperty("--reveal-y", y + "px");
    secretLayer.style.setProperty(
      "--reveal-radius",
      Math.max(42, Math.min(64, r.width * 0.16)) + "px",
    );
    portrait.classList.add("is-revealing");
  });
}
portrait.addEventListener("pointerenter", (e) => {
  portraitBounds = null;
  moveReveal(e);
});
portrait.addEventListener("pointermove", moveReveal);
portrait.addEventListener("pointerleave", hideReveal);
portrait.addEventListener("pointercancel", hideReveal);
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
    clientX: Math.max(r.left, Math.min(r.right, point.x)),
    clientY: Math.max(r.top, Math.min(r.bottom, point.y)),
  });
});
portrait.addEventListener("blur", hideReveal);
addEventListener(
  "scroll",
  () => {
    portraitBounds = null;
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
  hideReveal();
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
    scene.append(layer);
    secretLayer = layer;
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
  if (!play) hideReveal();
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
