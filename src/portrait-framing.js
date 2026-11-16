// Eye midpoint and pupil spacing, measured on the 1280 x 720 source portraits.
// Uniform scaling preserves facial proportions; translation aligns the eye line.
const portraitLandmarks = {
  "neutral-v2": [606, 232, 93],
  spring: [638, 227, 94],
  summer: [619, 232, 86],
  autumn: [621, 228, 92],
  winter: [622, 227, 90],
  "fun-winter": [631, 242, 78],
  "fun-autumn": [631, 192, 80],
  "fun-spring-moto": [650, 170, 58],
  "fun-summer-v2": [635, 275, 90],
};
function portraitFrame(name, width, height, size = 600) {
  const [eyeX, eyeY, spacing] =
    portraitLandmarks[name] || portraitLandmarks["neutral-v2"];
  const x = (eyeX / 1280) * width,
    y = (eyeY / 720) * height;
  // The motorcycle portrait needs breathing room for the bike and landscape.
  // Keep its face centered, with a slightly higher eye line and a wider crop.
  const motorcycle = name === "fun-spring-moto";
  const snorkeling = name === "fun-summer-v2";
  const professional = [
    "neutral-v2",
    "spring",
    "summer",
    "autumn",
    "winter",
  ].includes(name);
  // Balance the torso as well as the eyes: three-quarter poses need a small offset.
  const centerX =
    { "neutral-v2": 650, spring: 665, summer: 650, autumn: 665, winter: 650 }[
      name
    ] || eyeX;
  const center = (centerX / 1280) * width;
  const targetY =
    (size * (motorcycle ? 200 : snorkeling ? 240 : professional ? 200 : 220)) /
    600;
  const targetSpacing = motorcycle
    ? 68
    : snorkeling
      ? 78
      : professional
        ? 78
        : 86;
  const scale = Math.max(
    (size * targetSpacing) / 600 / ((spacing / 1280) * width),
    size / 2 / center,
    size / 2 / (width - center),
    targetY / y,
    (size - targetY) / (height - y),
  );
  const targetX = size / 2 + (x - center) * scale;
  return {
    x: targetX - x * scale,
    y: targetY - y * scale,
    width: width * scale,
    height: height * scale,
  };
}
