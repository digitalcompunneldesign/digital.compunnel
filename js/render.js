/* ==========================================================
   2. RENDERING
   ========================================================== */
function hexToRgba(hex, a){
  const n = parseInt(hex.slice(1),16);
  return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;
}

function renderPropeller(){
  // hub ring + domain dots (rotate with the assembly)
  const dots = ACCELERATORS.map((acc,i)=>{
    const a = (-45 + STEP*i) * Math.PI/180;
    return `<circle cx="${50+19*Math.cos(a)}" cy="${50+19*Math.sin(a)}" r="1.1" fill="${acc.color.base}"/>`;
  }).join("");
  els.hub.innerHTML = `<defs>
      <!-- ONE master blade. Every blade is this exact path, rotated 72° apart
           by its layer, so all five are identical in length, width and area. -->
      <path id="blade-master" d="${PETAL}"/>
    </defs>
    <circle class="hub-ring" cx="50" cy="50" r="19"/><circle class="hub-dash" cx="50" cy="50" r="21.5"/>${dots}`;

  els.tablist.innerHTML = ACCELERATORS.map((acc,i)=>`
    <div class="leaf-layer" style="transform:rotate(${STEP*i}deg)">
      <button class="leaf" role="tab" id="leaf-${acc.id}" data-index="${i}"
        aria-selected="false" aria-controls="panel" tabindex="-1"
        aria-label="${acc.category}: ${acc.leafLine}"
        style="--c:${acc.color.base};--deep:${acc.color.deep};--shadow:${hexToRgba(acc.color.base,.5)}">
        <svg class="petal" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <linearGradient id="gb-${acc.id}" gradientUnits="userSpaceOnUse" x1="8" y1="94" x2="92" y2="6">
              <stop offset="0" stop-color="#fff"/>
              <stop offset=".22" stop-color="${acc.color.soft}"/>
              <stop offset=".62" stop-color="${acc.color.mid}" stop-opacity=".62"/>
              <stop offset="1" stop-color="${acc.color.mid}" stop-opacity=".92"/>
            </linearGradient>
            <linearGradient id="ga-${acc.id}" gradientUnits="userSpaceOnUse" x1="8" y1="94" x2="94" y2="4">
              <stop offset="0" stop-color="#fff" stop-opacity=".85"/>
              <stop offset=".24" stop-color="${acc.color.soft}"/>
              <stop offset=".58" stop-color="${acc.color.mid}"/>
              <stop offset="1" stop-color="${acc.color.base}" stop-opacity=".92"/>
            </linearGradient>
          </defs>
          <use class="p-hit" href="#blade-master" fill="url(#gb-${acc.id})"/>
          <use class="p-active" href="#blade-master" fill="url(#ga-${acc.id})" pointer-events="none"/>
          <use class="p-outline" href="#blade-master" pointer-events="none"/>
        </svg>
        <span class="leaf-anchor" style="left:${LABEL_AT[0].toFixed(1)}%;top:${LABEL_AT[1].toFixed(1)}%">
          <span class="leaf-rot" data-rot="${i}" style="transform:translate(-50%,-50%) rotate(${-STEP*i}deg)">
            <span class="leaf-top"><span class="leaf-icon">${svgIcon(acc.icon)}</span><span class="leaf-go">${svgIcon("arrow")}</span></span>
            <span class="leaf-name"><span class="full">${acc.leafName || acc.category}</span><span class="short">${acc.shortName}</span></span>
            <span class="leaf-desc">${acc.leafLine}</span>
          </span>
        </span>
      </button>
    </div>`).join("");

  els.coreBar.innerHTML = ACCELERATORS.map(acc=>`<span style="background:${acc.color.base}"></span>`).join("");
}

const subName = (s) => `${s.name}${s.tm ? "™" : ""}`;

function subMediaTemplate(acc, s, j){
  if (s.media && s.media.src){
    return `
        <figure class="sub-media">
          <img data-src="${s.media.src}" alt="${s.media.alt || subName(s) + " overview"}" width="717" height="525" decoding="async">
          <button class="expand-btn" type="button" data-expand="${j}" aria-label="Enlarge ${subName(s)} diagram">${svgIcon("expand")}</button>
        </figure>`;
  }
  // Slot ready for Data, Cloud and Quality images: add media:{src,alt} in data.js
  return `
        <div class="sub-media sub-media--empty" role="img" aria-label="${subName(s)} diagram coming soon">
          ${svgIcon("image")}<span>Diagram coming soon</span>
        </div>`;
}

function panelTemplate(acc, accIndex){
  const items = acc.subAccelerators.map((s,j)=>`
    <li class="acc-item" style="--d:${60 + j*45}ms">
      <h3 class="acc-head">
        <button class="sub" type="button" id="sub-btn-${acc.id}-${j}" data-acc="${accIndex}" data-sub="${j}"
          aria-expanded="false" aria-controls="sub-region-${acc.id}-${j}">
          <span class="sub-icon">${svgIcon(s.icon)}</span>
          <span><span class="sub-name">${subName(s)}</span><span class="sub-desc">${s.description.replace(/\.$/,"")}</span></span>
          <span class="sub-arrow">${svgIcon("chevron")}</span>
        </button>
      </h3>
      <div class="sub-region" id="sub-region-${acc.id}-${j}" role="region" aria-labelledby="sub-btn-${acc.id}-${j}" inert>
        <div class="sub-region-inner">${subMediaTemplate(acc, s, j)}
          <a class="sub-link" href="${s.url || acc.url}">Learn more about ${subName(s)}${svgIcon("arrow")}</a>
        </div>
      </div>
    </li>`).join("");
  return `
    <p class="p-cat">${acc.category.toUpperCase()}</p>
    <h2 class="p-title" id="panelTitle">${acc.title}</h2>
    <p class="p-desc">${acc.description}</p>
    <ul class="subs" aria-label="${acc.category} sub-accelerators">${items}</ul>
    <a class="p-cta" href="${acc.url}">${acc.ctaLabel}${svgIcon("arrow")}</a>`;
}

function renderValues(){
  els.values.innerHTML = VALUES.map(v=>`<li>${svgIcon(v.icon)}<span>${v.label.replace("|","<br>")}</span></li>`).join("");
}
