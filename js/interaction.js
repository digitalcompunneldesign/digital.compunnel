/* ==========================================================
   3. INTERACTION
   ========================================================== */
function select(i, { focus=false, animate=true } = {}){
  const n = ACCELERATORS.length;
  i = (i + n) % n;
  if (i === state.index){ if (focus) leafAt(i).focus(); return; }

  const target = -STEP * i;
  els.stage.classList.remove("intro");
  state.rotation += clockwiseDelta(state.rotation, target);
  state.index = i;
  const acc = ACCELERATORS[i];

  els.tablist.querySelectorAll(".leaf").forEach((btn, j)=>{
    const on = j === i;
    btn.setAttribute("aria-selected", on);
    btn.tabIndex = on ? 0 : -1;
  });
  els.coreBar.querySelectorAll("span").forEach((s,j)=>s.classList.toggle("on", j===i));

  setAccent(acc);
  applyRotation();
  transitionPanel(acc, i, animate);
  if (focus) leafAt(i).focus({ preventScroll:true });
}

const leafAt = (i) => els.tablist.querySelectorAll(".leaf")[i];

function bindEvents(){
  els.tablist.addEventListener("click", e=>{
    const btn = e.target.closest(".leaf");
    if (btn) select(+btn.dataset.index);
  });

  els.tablist.addEventListener("keydown", e=>{
    const map = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 };
    if (e.key in map){ e.preventDefault(); select(state.index + map[e.key], { focus:true }); }
    else if (e.key === "Home"){ e.preventDefault(); select(0, { focus:true }); }
    else if (e.key === "End"){ e.preventDefault(); select(ACCELERATORS.length-1, { focus:true }); }
  });

  els.panel.addEventListener("click", e=>{
    const expand = e.target.closest(".expand-btn");
    if (expand){ openLightbox(state.index, +expand.dataset.expand, expand); return; }
    const sub = e.target.closest(".sub");
    if (sub) toggleSub(+sub.dataset.sub);
  });

  $("lbClose").innerHTML = svgIcon("close");
  $("lbClose").addEventListener("click", ()=>els.lightbox.close());
  els.lightbox.addEventListener("click", e=>{ if (e.target === els.lightbox) els.lightbox.close(); });
  els.lightbox.addEventListener("close", ()=>{
    document.documentElement.classList.remove("lb-open");
    lastTrigger && lastTrigger.focus({ preventScroll:true });
  });
}

/* ---------- Sub-accelerator accordion: one open at a time ---------- */
function toggleSub(j, { forceOpen=false } = {}){
  const items = els.panelBody.querySelectorAll(".acc-item");
  const item = items[j];
  if (!item) return;
  const willOpen = forceOpen || !item.classList.contains("open");
  items.forEach((it, k)=>{
    const open = willOpen && k === j;
    it.classList.toggle("open", open);
    it.querySelector(".sub").setAttribute("aria-expanded", open);
    const region = it.querySelector(".sub-region");
    if (open){
      region.removeAttribute("inert");
      const img = region.querySelector("img[data-src]");
      if (img){ img.src = img.dataset.src; img.removeAttribute("data-src"); }   // load on first open
    } else {
      region.setAttribute("inert", "");
    }
  });
  if (willOpen){
    const delay = reduceMotion.matches ? 0 : 420;
    setTimeout(()=>{
      const r = item.getBoundingClientRect();
      if (r.bottom > window.innerHeight || r.top < 0){
        item.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: r.height > window.innerHeight ? "start" : "nearest" });
      }
    }, delay);
  }
}

/* ---------- Lightbox for enlarged diagrams ---------- */
let lastTrigger = null;
function openLightbox(accIndex, subIndex, trigger){
  const acc = ACCELERATORS[accIndex];
  const sub = acc.subAccelerators[subIndex];
  if (!sub || !sub.media) return;
  lastTrigger = trigger;
  const img = $("lbImg");
  img.src = sub.media.src;
  img.alt = sub.media.alt || `${subName(sub)} diagram`;
  $("lbTitle").textContent = subName(sub);
  $("lbDesc").textContent = `${acc.category} · ${sub.description}`;
  els.lightbox.style.setProperty("--accent", acc.color.base);
  document.documentElement.classList.add("lb-open");
  if (typeof els.lightbox.showModal === "function") els.lightbox.showModal();
  else els.lightbox.setAttribute("open","");
}
