const fs = require('fs');
const dataSrc = fs.readFileSync('/mnt/user-data/outputs/accelerators-page/js/data.js','utf8');
const iconSrc = fs.readFileSync('/mnt/user-data/outputs/accelerators-page/js/icons.js','utf8');
let cfgSrc = fs.readFileSync('/mnt/user-data/outputs/accelerators-page/js/config.js','utf8').replace(/const state[\s\S]*$/,'');
(0,eval)(dataSrc + '\n' + iconSrc + '\n' + cfgSrc +
  '\n;globalThis.__M = { ACCELERATORS, ICONS, BLADE, BLADE_OUTLINE, buildBladePath, bladeIncentre };');
const { ACCELERATORS, ICONS, BLADE, BLADE_OUTLINE, buildBladePath, bladeIncentre } = globalThis.__M;

const S = 1000, C = S/2, K = S/514;          // stage size; K scales the live sizes up
const BOX = S * 0.5;                          // each blade's own box
const boxToStage = ([bx,by]) => [S*0.5 + bx/100*BOX, by/100*BOX];
const incentre = bladeIncentre(BLADE_OUTLINE);

const LINES = {
  "applied-ai":        { name:["Applied AI"], desc:["Turn AI potential","into real-world","impact."] },
  "data-to-insight":   { name:["Data-to-","Insight"], desc:["Modernize data.","Unlock","intelligence."] },
  "cloud-platform":    { name:["Cloud &","Platform"], desc:["Secure, scalable","platforms, faster."] },
  "quality-engineering":{ name:["Quality","Engineering"], desc:["Higher quality.","Faster releases."] },
  "customer-experience":{ name:["Customer","Experience"], desc:["Data-powered","design","decisions."] }
};
const SELECTED = 4;                            // Customer Experience in the reading position
const STEP = 360 / ACCELERATORS.length;
const rotation = -STEP * SELECTED;

const esc = (t) => t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const N = (n) => +n.toFixed(2);

// --- defs -------------------------------------------------------------
let defs = '';
ACCELERATORS.forEach(a=>{
  const g = (id, stops) => `  <linearGradient id="${id}" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="0">${stops}</linearGradient>\n`;
  defs += g(`fill-${a.id}`,
    `<stop offset="0" stop-color="#ffffff"/><stop offset="0.24" stop-color="${a.color.soft}"/>` +
    `<stop offset="0.58" stop-color="${a.color.mid}"/><stop offset="1" stop-color="${a.color.base}" stop-opacity="0.92"/>`);
});
defs += `  <radialGradient id="hub-face" cx="0.5" cy="0.35" r="0.75"><stop offset="0.55" stop-color="#ffffff"/><stop offset="1" stop-color="#F7F8FB"/></radialGradient>\n`;

// --- blades -----------------------------------------------------------
const bladePath = buildBladePath();
const scale = BOX/100;
let blades = '';
ACCELERATORS.forEach((a,i)=>{
  const ang = STEP*i + rotation;
  const sel = i === SELECTED;
  blades += `  <g id="blade-${a.id}" transform="rotate(${N(ang)} ${C} ${C}) translate(${S*0.5} 0) scale(${N(scale)})" opacity="${sel ? 0.8 : 0.72}">\n` +
            `    <path d="${bladePath}" fill="url(#fill-${a.id})" stroke="${a.color.base}" stroke-opacity="${sel ? 0.95 : 0.5}" stroke-width="${N(0.75/scale)}"/>\n` +
            `  </g>\n`;
});

// --- labels (upright, placed at each blade's incentre) -----------------
const ICON = 28, ARROW = 30, LW = 206;
let labels = '';
ACCELERATORS.forEach((a,i)=>{
  const ang = (STEP*i + rotation) * Math.PI/180;
  const [bx, by] = boxToStage(incentre.point);
  const dx = bx - C, dy = by - C;
  const px = C + dx*Math.cos(ang) - dy*Math.sin(ang);
  const py = C + dx*Math.sin(ang) + dy*Math.cos(ang);
  const L = LINES[a.id];
  const nameSize = 32, descSize = 26, nameLead = 38, descLead = 34;
  const H = ICON + 14 + L.name.length*nameLead + 8 + L.desc.length*descLead;
  const x0 = px - LW/2, y0 = py - H/2;
  let t = `  <g id="label-${a.id}">\n`;
  t += `    <g transform="translate(${N(x0)} ${N(y0)}) scale(${N(ICON/24)})" fill="none" stroke="${a.color.deep}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[a.icon]}</g>\n`;
  t += `    <circle cx="${N(x0+LW-ARROW/2)}" cy="${N(y0+ICON/2)}" r="${ARROW/2}" fill="#ffffff"/>\n`;
  t += `    <g transform="translate(${N(x0+LW-ARROW/2-8)} ${N(y0+ICON/2-8)}) scale(${N(16/24)})" fill="none" stroke="${a.color.deep}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS.arrow}</g>\n`;
  let y = y0 + ICON + 14 + nameSize*0.8;
  L.name.forEach(line=>{
    t += `    <text x="${N(x0)}" y="${N(y)}" font-family="Montserrat, sans-serif" font-size="${nameSize}" font-weight="600" fill="#0B1B3F">${esc(line)}</text>\n`;
    y += nameLead;
  });
  y += 2;
  L.desc.forEach(line=>{
    t += `    <text x="${N(x0)}" y="${N(y)}" font-family="Montserrat, sans-serif" font-size="${descSize}" font-weight="400" fill="#3A4763">${esc(line)}</text>\n`;
    y += descLead;
  });
  labels += t + '  </g>\n';
});

// --- decor, hub -------------------------------------------------------
const r = (p) => S * p / 100;
let decor = `  <g id="guides" fill="none">\n` +
  `    <circle cx="${C}" cy="${C}" r="${N(r(57))}" stroke="#E4E8F0" stroke-width="1"/>\n` +
  `    <circle cx="${C}" cy="${C}" r="${N(r(61))}" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="2 5"/>\n` +
  `    <circle cx="${C}" cy="${C}" r="${N(r(19*0.5))}" stroke="#DDE2EC" stroke-width="1"/>\n` +
  `    <circle cx="${C}" cy="${C}" r="${N(r(21.5*0.5))}" stroke="#C9D0DD" stroke-width="1" stroke-dasharray="1.5 3"/>\n`;
[[0,-1],[1,0],[0,1],[-1,0]].forEach(([ux,uy])=>{
  decor += `    <line x1="${N(C+ux*r(63))}" y1="${N(C+uy*r(63))}" x2="${N(C+ux*r(59))}" y2="${N(C+uy*r(59))}" stroke="#C9D0DD" stroke-width="1"/>\n`;
});
const sel = ACCELERATORS[SELECTED];
const mx = C + r(57)*Math.cos(-Math.PI/4), my = C + r(57)*Math.sin(-Math.PI/4);
decor += `    <line x1="${N(mx)}" y1="${N(my)}" x2="${N(S*1.12)}" y2="${N(my)}" stroke="${sel.color.base}" stroke-width="1" stroke-dasharray="3 4"/>\n`;
decor += `    <circle cx="${N(mx)}" cy="${N(my)}" r="${N(r(2.6))}" fill="${sel.color.base}" fill-opacity="0.16" stroke="none"/>\n`;
decor += `    <circle cx="${N(mx)}" cy="${N(my)}" r="${N(r(1.1))}" fill="${sel.color.base}" stroke="none"/>\n  </g>\n`;

// hub dots rotate with the blades
let hub = `  <g id="hub">\n`;
ACCELERATORS.forEach((a,i)=>{
  const ang = (-45 + STEP*i + rotation) * Math.PI/180;
  hub += `    <circle cx="${N(C + r(9.5)*Math.cos(ang))}" cy="${N(C + r(9.5)*Math.sin(ang))}" r="${N(r(0.55))}" fill="${a.color.base}"/>\n`;
});
const hubR = S*0.145;
hub += `    <circle cx="${C}" cy="${C}" r="${N(hubR)}" fill="url(#hub-face)" stroke="#E6EAF2" stroke-width="1"/>\n`;
hub += `    <circle cx="${C}" cy="${C}" r="${N(hubR-7)}" fill="none" stroke="#EEF1F6" stroke-width="1"/>\n`;
hub += `    <text x="${C}" y="${N(C-10)}" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="22" font-weight="600" letter-spacing="6.6" fill="#0B1B3F">ACCELERATE</text>\n`;
hub += `    <text x="${C}" y="${N(C+24)}" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="22" font-weight="600" letter-spacing="6.6" fill="#0B1B3F">WHAT'S NEXT</text>\n`;
const barW = S*0.15, barX = C - barW/2, barY = C + 46, gap = 5;
const unit = (barW - gap*4) / (ACCELERATORS.length + 1.6);
let bx2 = barX;
ACCELERATORS.forEach((a,i)=>{
  const w = i === SELECTED ? unit*2.6 : unit;
  hub += `    <rect x="${N(bx2)}" y="${N(barY)}" width="${N(w)}" height="5" rx="2.5" fill="${a.color.base}" opacity="${i===SELECTED?1:0.35}"/>\n`;
  bx2 += w + gap;
});
hub += `  </g>\n`;

const M = 140;   // the blades and guide rings reach beyond the stage itself
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-M} ${-M} ${S+M*2} ${S+M*2}" width="${S+M*2}" height="${S+M*2}" fill="none">
<title>Compunnel Accelerators wheel</title>
<defs>
${defs}</defs>
<g id="accelerator-wheel">
${decor}  <g id="blades">
${blades}  </g>
${hub}  <g id="labels">
${labels}  </g>
</g>
</svg>
`;
fs.writeFileSync('/mnt/user-data/outputs/compunnel-accelerator-wheel.svg', svg);
console.log('written', svg.length, 'bytes; incentre radius', incentre.radius.toFixed(1));
