// Canvas renderers receive scene state explicitly; they do not own event handlers.
const SeasonalRenderers = (() => {
  const sandBanks = [
    [0, 21, "#d4b77f45"],
    [-7, 5.5, "#f9e5bbbf"],
    [7, 5, "#b6976570"],
    [0, 10, "#a4835066"],
    [1, 4, "#9875485c"],
    [-1.2, 1.7, "#d1b37e99"],
  ];
  const flowerPalettes = [
    ["#fff9e9", "#ded6b5", "#d3a948"],
    ["#d98fa9", "#ae547b", "#d8ad5a"],
    ["#e89170", "#be533d", "#514736"],
    ["#b4a3d4", "#7c64a7", "#d9bd66"],
  ];

  function drawSand(ctx, sandStrokes, H, scrollY, grain) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of sandStrokes) {
      const points = stroke.points;
      if (!points.some((p) => p.y > scrollY - 30 && p.y < scrollY + H + 30))
        continue;
      const normal = (i) => {
        const a = points[Math.max(0, i - 1)],
          b = points[Math.min(points.length - 1, i + 1)],
          l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        return { x: -(b.y - a.y) / l, y: (b.x - a.x) / l };
      };
      const normals = points.map((_, i) => normal(i));
      // Continuous banks avoid overlapping segment caps and dark joints.
      for (const [offset, width, color] of sandBanks) {
        let bucket = -1;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        for (let i = 0; i < points.length; i++) {
          const p = points[i],
            n = normals[i],
            alpha = Math.round(p.opacity * 10) / 10;
          const edge =
            offset + (Math.abs(offset) > 3 ? Math.sin(i * 0.9) * 0.45 : 0);
          const x = p.x + n.x * edge,
            y = p.y - scrollY + n.y * edge;
          if (alpha !== bucket) {
            if (bucket >= 0) ctx.stroke();
            ctx.beginPath();
            ctx.globalAlpha = alpha;
            bucket = alpha;
            const prev = points[Math.max(0, i - 1)],
              pn = normals[Math.max(0, i - 1)];
            ctx.moveTo(prev.x + pn.x * edge, prev.y - scrollY + pn.y * edge);
          }
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (let i = 1; i < points.length; i++) {
        const p = points[i],
          n = normals[i];
        if (p.y < scrollY - 20 || p.y > scrollY + H + 20) continue;
        ctx.globalAlpha = p.opacity;
        for (const side of [-1, 1]) {
          const offset = side * (8 + grain(i + points[0].y) * 4);
          ctx.fillStyle = side < 0 ? "#fff0cd99" : "#a98a5366";
          ctx.beginPath();
          ctx.ellipse(
            p.x + n.x * offset,
            p.y - scrollY + n.y * offset,
            0.6 + grain(i + 9) * 1.2,
            0.4 + grain(i + 13) * 0.6,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
  function drawFlowers(ctx, flowers, dt, animate, reduced, H, scrollY, grain) {
    for (const f of flowers) {
      if (animate) f.age += dt;
      else if (reduced.matches) f.age = 12;
      const grow = Math.min(1, f.age / 5),
        growth = grow * grow * (3 - 2 * grow),
        bloom = Math.max(0, Math.min(1, (f.age - 5) / 4.2));
      const y = f.y - scrollY;
      if (y < -90 || y > H + 90) continue;
      const topX = f.lean * growth,
        topY = -f.h * growth;
      ctx.save();
      ctx.translate(f.x, y);
      ctx.lineCap = "round";
      ctx.strokeStyle = "#688455";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -f.lean * 0.5,
        -f.h * 0.3 * growth,
        topX + 4,
        topY * 0.7,
        topX,
        topY,
      );
      ctx.stroke();
      ctx.strokeStyle = "#b2bf8a88";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(1, 0);
      ctx.quadraticCurveTo(topX + 3, topY * 0.5, topX + 1, topY);
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const side = i % 2 ? -1 : 1,
          l = Math.max(0, Math.min(1, (f.age - i * 0.8 - 1) / 3));
        ctx.save();
        ctx.translate(topX * (0.28 + i * 0.19), topY * (0.28 + i * 0.19));
        ctx.scale(l, l);
        const leaf = ctx.createLinearGradient(0, 0, side * 16, -8);
        leaf.addColorStop(0, "#5c784b");
        leaf.addColorStop(1, "#99ae76");
        ctx.fillStyle = leaf;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(side * 9, -13, side * 20, -8);
        ctx.quadraticCurveTo(side * 13, 4, 0, 0);
        ctx.fill();
        ctx.strokeStyle = "#c6d29a88";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(side * 17, -7);
        ctx.stroke();
        ctx.restore();
      }
      ctx.translate(topX, topY);
      ctx.rotate(f.turn);
      if (bloom < 0.25) {
        ctx.fillStyle = "#789461";
        ctx.beginPath();
        ctx.ellipse(0, -2, 2.5 + bloom * 3, 4 + bloom * 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      const colors = flowerPalettes[f.type],
        petals = [12, 8, 5, 7][f.type],
        opening = 0.08 + bloom * 0.92;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / petals);
        ctx.scale(opening, opening);
        const len = f.radius * (0.88 + grain(i + f.id) * 0.22),
          width = f.type === 0 ? 3.1 : f.type === 2 ? 8 : 5.3;
        const shade = ctx.createLinearGradient(0, 0, 0, -len);
        shade.addColorStop(0, colors[1]);
        shade.addColorStop(0.55, colors[0]);
        shade.addColorStop(1, colors[0]);
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-width, -len * 0.35, -width, -len * 0.95, -1, -len);
        ctx.bezierCurveTo(
          width * 0.4,
          -len * 1.08,
          width,
          -len * 0.75,
          width * 0.6,
          -len * 0.4,
        );
        ctx.quadraticCurveTo(width * 0.3, -len * 0.1, 0, 0);
        ctx.fill();
        ctx.strokeStyle = f.type === 0 ? "#b8ac7c55" : "#ffffff3d";
        ctx.lineWidth = 0.45;
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.quadraticCurveTo(-0.8, -len * 0.55, 0, -len * 0.87);
        ctx.stroke();
        ctx.restore();
      }
      if (bloom > 0.15) {
        ctx.fillStyle = colors[2];
        ctx.beginPath();
        ctx.arc(0, 0, (f.type === 2 ? 3.5 : 3) * bloom, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 9; i++) {
          ctx.fillStyle = i % 2 ? "#79633180" : "#fff0ad99";
          ctx.beginPath();
          ctx.arc(
            Math.cos(i * 2.4) * 2 * bloom,
            Math.sin(i * 2.4) * 2 * bloom,
            0.55,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }
  return { drawSand, drawFlowers };
})();
