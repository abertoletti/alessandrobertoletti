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
function choosePortrait(season, random = Math.random) {
  return playfulPortraits[season] && random() < 1 / 3
    ? playfulPortraits[season]
    : portraitImages[season] || portraitImages.none;
}
const english = document.documentElement.lang === "en";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let play = !reducedMotion.matches;
const portrait = document.querySelector("#portrait");
const photoCache = new Map();
let portraitRequest = 0;
async function showPortrait(season = "none") {
  const request = ++portraitRequest;
  let name = choosePortrait(season);
  function loadPhoto(name) {
    if (!photoCache.has(name)) {
      const photo = new Image();
      photo.src = new URL(
        `${english ? "../" : "./"}public/portraits/optimized/${name}.webp`,
        document.baseURI,
      ).href;
      photoCache.set(
        name,
        photo.decode().then(() => photo),
      );
    }
    return photoCache.get(name);
  }
  let photo;
  try {
    photo = await loadPhoto(name);
  } catch {
    photoCache.delete(name);
    name = portraitImages[season] || portraitImages.none;
    try {
      photo = await loadPhoto(name);
    } catch {
      photoCache.delete(name);
      return;
    }
  }
  if (request !== portraitRequest) return;
  const image = photo.cloneNode();
  image.alt = "";
  image.draggable = false;
  const crop = portraitFrame(name, photo.naturalWidth, photo.naturalHeight);
  Object.assign(image.style, {
    left: crop.x / 6 + "%",
    top: crop.y / 6 + "%",
    width: crop.width / 6 + "%",
    height: crop.height / 6 + "%",
  });
  const previous = portrait.lastElementChild;
  portrait.replaceChildren(...(previous ? [previous] : []), image);
  portrait.dataset.portrait = name;
  if (previous && !reducedMotion.matches) {
    const fade = image.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 650,
      easing: "ease-out",
    });
    fade.finished.then(() => previous.remove()).catch(() => previous.remove());
  } else previous?.remove();
}
new MutationObserver(() => showPortrait(document.body.dataset.season)).observe(
  document.body,
  { attributes: true, attributeFilter: ["data-season"] },
);
showPortrait(document.body.dataset.season);
function syncPlay() {
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
