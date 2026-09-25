/* ==========================================================
   SITE: AI search → accelerator matching, mobile menu, voice
   ========================================================== */
const KEYWORDS = {
  "applied-ai":["ai","agent","agents","agentic","genai","llm","chatbot","assistant","document","documents","search","discovery","automate workflow","responsible","nlp","ocr","experience","experiences","fx","future"],
  "data-to-insight":["data","analytics","lakehouse","warehouse","mesh","dashboard","dashboards","insight","insights","bi","reporting","real-time","streaming","observability","predictive","metrics"],
  "cloud-platform":["cloud","migration","migrate","aws","azure","gcp","devops","ci","cd","pipeline","pipelines","platform","kubernetes","landing","cost","costs","finops","security","compliance","infrastructure"],
  "customer-experience":["cx","experience","experiences","customer","ux","ui","usability","design","journey","heatmap","heat","a/b","abtest","testing experience","research","friction","engagement","total experience","fx"],
  "quality-engineering":["test","tests","testing","qa","qe","quality","regression","release","releases","bugs","automation testing","validate","validation"]
};

function matchAccelerator(query){
  const q = query.toLowerCase();
  const words = q.split(/[^a-z0-9+-]+/).filter(Boolean);
  let best = { index:-1, score:0, sub:null };
  ACCELERATORS.forEach((acc, i)=>{
    let score = 0, sub = null;
    (KEYWORDS[acc.id] || []).forEach(k=>{
      if (k.includes(" ") ? q.includes(k) : words.includes(k)) score += 2;
    });
    acc.subAccelerators.forEach(s=>{
      if (q.replace(/™/g,"").includes(s.name.toLowerCase())){ score += 6; sub = s; }
    });
    if (score > best.score) best = { index:i, score, sub };
  });
  return best;
}

function runSearch(query){
  const out = document.getElementById("searchResult");
  const q = query.trim();
  if (!q){ out.textContent = ""; document.getElementById("aiQuery").focus(); return; }
  const hit = matchAccelerator(q);
  const target = document.getElementById("accelerators");
  if (hit.index < 0){
    out.innerHTML = "No direct match yet. Explore the four accelerator domains below.";
  } else {
    const acc = ACCELERATORS[hit.index];
    out.innerHTML = hit.sub
      ? `<b>${hit.sub.name}</b> is part of <b>${acc.category}</b>. Showing it below.`
      : `Best match: <b>${acc.category}</b> accelerators. Showing them below.`;
    select(hit.index);
    if (hit.sub){
      const j = acc.subAccelerators.indexOf(hit.sub);
      setTimeout(()=>toggleSub(j, { forceOpen:true }), reduceMotion.matches ? 160 : 320);
    }
  }
  target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block:"start" });
}

(function initSite(){
  const form = document.getElementById("aiSearch");
  const input = document.getElementById("aiQuery");
  form.addEventListener("submit", e=>{ e.preventDefault(); runSearch(input.value); });
  input.addEventListener("input", ()=>form.classList.toggle("has-text", input.value.trim().length>0));
  document.querySelectorAll(".chip").forEach(chip=>chip.addEventListener("click", ()=>{
    input.value = chip.dataset.q; form.classList.add("has-text"); runSearch(chip.dataset.q);
  }));
  document.querySelectorAll("[data-focus-search]").forEach(b=>b.addEventListener("click", ()=>input.focus()));

  const menuBtn = document.querySelector(".menu-btn"), drawer = document.getElementById("drawer");
  menuBtn.addEventListener("click", ()=>{
    const open = drawer.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Voice input where the browser supports it; the mic stays hidden otherwise.
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = document.getElementById("micBtn");
  if (SR){
    mic.hidden = false;
    let rec = null;
    mic.addEventListener("click", ()=>{
      if (rec){ rec.stop(); return; }
      rec = new SR(); rec.lang = document.documentElement.lang || "en"; rec.interimResults = false;
      mic.classList.add("listening"); mic.setAttribute("aria-label","Stop listening");
      rec.onresult = e=>{ input.value = e.results[0][0].transcript; form.classList.add("has-text"); runSearch(input.value); };
      rec.onend = ()=>{ rec = null; mic.classList.remove("listening"); mic.setAttribute("aria-label","Search by voice"); };
      try { rec.start(); } catch(_) { rec.onend(); }
    });
  }
})();
