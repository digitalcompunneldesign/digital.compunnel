/* ==========================================================
   4. ANIMATION
   ========================================================== */
const INTRO_TURNS = 4;   // full clockwise revolutions on first view

function clockwiseDelta(from, to){
  // CSS rotate(+) is clockwise, so the angle only ever increases.
  // Returns 90, 180 or 270 for a 4-leaf propeller.
  return ((to - from) % 360 + 360) % 360;
}

function applyRotation(){
  const r = state.rotation;
  els.propeller.style.transform = `rotate(${r}deg)`;
  // Leaf labels counter-rotate with the identical timing curve,
  // so text stays upright throughout while shapes turn as one object.
  els.tablist.querySelectorAll(".leaf-rot").forEach(node=>{
    const i = +node.dataset.rot;
    node.style.transform = `translate(-50%,-50%) rotate(${-(STEP*i + r)}deg)`;
  });
  if (reduceMotion.matches){
    els.stage.classList.remove("rm-flash"); void els.stage.offsetWidth; els.stage.classList.add("rm-flash");
  }
}

function transitionPanel(acc, i, animate){
  const body = els.panelBody;
  const token = ++state.panelToken;
  const swap = () => {
    body.innerHTML = panelTemplate(acc, i);
    els.panel.setAttribute("aria-labelledby", `leaf-${acc.id}`);
  };
  if (!animate){ swap(); return; }
  body.classList.add("leaving");
  setTimeout(()=>{
    if (token !== state.panelToken) return;
    swap();
    body.classList.remove("leaving");
    body.classList.add("entering");
    requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.remove("entering")));
  }, reduceMotion.matches ? 120 : 200);
}

function setAccent(acc){
  const root = document.documentElement.style;
  root.setProperty("--accent", acc.color.base);
  root.setProperty("--accent-deep", acc.color.deep);
  root.setProperty("--accent-soft", acc.color.soft);
}
