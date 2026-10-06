/* ==========================================================
   GEOMETRY
   Leaf i sits at base angle STEP*i. "Reading position" = top-right
   quadrant. Propeller rotation that brings leaf i there = -STEP*i.
   ========================================================== */
const STEP = 360 / ACCELERATORS.length;          // 90°
/* Blade geometry, drawn in each leaf's own 100x100 box: the root sits at the
   box corner nearest the hub and the tip reaches the far corner. Narrow root,
   width peaking around 72% of the span, broad rounded tip, swept centreline. */
/* Blade geometry. Built the way a fan blade actually reads: a narrow root at
   the hub, a convex leading edge that swells into a broad head, an outer edge
   that follows a circle around the hub, and a concave trailing edge that
   scoops back to the root. Drawn once; all five blades reuse it. */
const BLADE = {
  hub:      [0, 100],   // hub centre, in the leaf box's own coordinates
  aim:      -45,        // the tip points at the far corner of the box
  rootR:    24,         // root radius (tucked under the hub)
  tipR:     112,        // outer radius: every tip lands on this circle
  rootHalf: 7,          // half the angular width at the root
  tipHalf:  29,         // half the angular width at the tip
  sweep:    38,         // how far the root is swung back from the tip
  bulge:    0.18,       // convex swell of the leading edge
  scoop:    -0.26       // concave scoop of the trailing edge
};

let BLADE_OUTLINE = [];

function buildBladePath(cfg = BLADE){
  const [hx, hy] = cfg.hub;
  const at = (r, deg) => {
    const a = deg * Math.PI / 180;
    return [hx + r * Math.cos(a), hy + r * Math.sin(a)];
  };
  const rootAim = cfg.aim + cfg.sweep;
  const A = at(cfg.rootR, rootAim - cfg.rootHalf);   // root, leading side
  const B = at(cfg.tipR,  cfg.aim  - cfg.tipHalf);   // tip, leading side
  const C = at(cfg.tipR,  cfg.aim  + cfg.tipHalf);   // tip, trailing side
  const D = at(cfg.rootR, rootAim + cfg.rootHalf);   // root, trailing side

  // an edge is a cubic bowed sideways off its chord: +k bows towards the
  // leading side, which makes the leading edge convex and the trailing concave
  const bowed = (P, Q, k, steps) => {
    const dx = Q[0]-P[0], dy = Q[1]-P[1], len = Math.hypot(dx, dy);
    const nx = dy / len, ny = -dx / len;             // chord normal
    const off = k * len;
    const c1 = [P[0] + dx*0.28 + nx*off*0.9, P[1] + dy*0.28 + ny*off*0.9];
    const c2 = [P[0] + dx*0.72 + nx*off*0.9, P[1] + dy*0.72 + ny*off*0.9];
    const out = [];
    for (let i = 0; i <= steps; i++){
      const t = i/steps, m = 1 - t;
      out.push([
        m*m*m*P[0] + 3*m*m*t*c1[0] + 3*m*t*t*c2[0] + t*t*t*Q[0],
        m*m*m*P[1] + 3*m*m*t*c1[1] + 3*m*t*t*c2[1] + t*t*t*Q[1]
      ]);
    }
    return out;
  };

  const pts = [];
  pts.push(...bowed(A, B, cfg.bulge, 44));           // leading edge: convex
  const a0 = cfg.aim - cfg.tipHalf, a1 = cfg.aim + cfg.tipHalf;
  for (let i = 1; i < 24; i++) pts.push(at(cfg.tipR, a0 + (a1 - a0) * i/24));
  pts.push(...bowed(C, D, cfg.scoop, 44));           // trailing edge: concave
  BLADE_OUTLINE = relax(resample(pts, 280), 34);     // rounds the outer corners
  return catmullRomPath(BLADE_OUTLINE);
}

/* Even out the outline before smoothing: uneven point spacing is what makes
   Catmull-Rom curves kink. */
function resample(pts, count){
  const n = pts.length, seg = [];
  let total = 0;
  for (let i = 0; i < n; i++){
    const a = pts[i], b = pts[(i+1) % n];
    const d = Math.hypot(b[0]-a[0], b[1]-a[1]);
    seg.push(d); total += d;
  }
  const out = [];
  for (let k = 0; k < count; k++){
    let want = (k / count) * total;
    let acc = 0, idx = 0;
    while (acc + seg[idx] < want){ acc += seg[idx]; idx = (idx + 1) % n; }
    const f = seg[idx] ? (want - acc) / seg[idx] : 0;
    const a = pts[idx], b = pts[(idx+1) % n];
    out.push([a[0] + (b[0]-a[0])*f, a[1] + (b[1]-a[1])*f]);
  }
  return out;
}

/* Light closed-loop smoothing (weighted moving average) to even out curvature. */
function relax(pts, passes){
  let cur = pts;
  for (let k = 0; k < passes; k++){
    const n = cur.length, next = [];
    for (let i = 0; i < n; i++){
      const a = cur[(i - 1 + n) % n], b = cur[i], c = cur[(i + 1) % n];
      next.push([0.25*a[0] + 0.5*b[0] + 0.25*c[0], 0.25*a[1] + 0.5*b[1] + 0.25*c[1]]);
    }
    cur = next;
  }
  return cur;
}

/* Closed Catmull-Rom through the sampled outline, emitted as cubic Béziers. */
function catmullRomPath(pts){
  const n = pts.length, at = i => pts[(i + n) % n];
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++){
    const p0 = at(i-1), p1 = at(i), p2 = at(i+1), p3 = at(i+2);
    const c1 = [p1[0] + (p2[0]-p0[0])/6, p1[1] + (p2[1]-p0[1])/6];
    const c2 = [p2[0] - (p3[0]-p1[0])/6, p2[1] - (p3[1]-p1[1])/6];
    d += `C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}

const PETAL = buildBladePath();

/* Where the label sits: the point furthest from every edge of the blade, so
   the text block has room on all sides whichever way the blade is turned. */
function pointInPolygon(p, pts){
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++){
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distanceToEdge(p, pts){
  let best = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++){
    const [x1, y1] = pts[j], [x2, y2] = pts[i];
    const dx = x2 - x1, dy = y2 - y1, len = dx*dx + dy*dy;
    let t = len ? ((p[0]-x1)*dx + (p[1]-y1)*dy) / len : 0;
    t = Math.max(0, Math.min(1, t));
    best = Math.min(best, Math.hypot(p[0] - (x1 + t*dx), p[1] - (y1 + t*dy)));
  }
  return best;
}

function bladeIncentre(pts = BLADE_OUTLINE){
  const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
  let lo = [Math.min(...xs), Math.min(...ys)], hi = [Math.max(...xs), Math.max(...ys)];
  let best = [(lo[0]+hi[0])/2, (lo[1]+hi[1])/2], bestR = -1, step = Math.max(hi[0]-lo[0], hi[1]-lo[1]) / 24;
  for (let pass = 0; pass < 6; pass++){
    for (let x = lo[0]; x <= hi[0]; x += step){
      for (let y = lo[1]; y <= hi[1]; y += step){
        const p = [x, y];
        if (!pointInPolygon(p, pts)) continue;
        const r = distanceToEdge(p, pts);
        if (r > bestR){ bestR = r; best = p; }
      }
    }
    lo = [best[0] - step, best[1] - step];
    hi = [best[0] + step, best[1] + step];
    step /= 3;
  }
  return { point: best, radius: bestR };
}

const LABEL_SPOT = bladeIncentre();
const LABEL_AT = LABEL_SPOT.point;

const state = { index:-1, rotation:0, panelToken:0 };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const $ = (id) => document.getElementById(id);
const els = {
  experience:$("experience"), stage:$("stage"), propeller:$("propeller"), hub:$("hub"),
  tablist:$("tablist"), coreBar:$("coreBar"), panel:$("panel"), panelBody:$("panelBody"),
  values:$("values"), lightbox:$("lightbox")
};
