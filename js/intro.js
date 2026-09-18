/* Intro spin: fast clockwise turns that settle on the selected leaf.
   Starts when the stage scrolls into view; skipped for reduced motion. */
function playIntro(){
  if (reduceMotion.matches) return;
  const run = () => {
    // start already offset, then decelerate to the resting angle
    els.stage.classList.remove("intro");
    els.stage.classList.add("no-anim");
    const rest = state.rotation;
    state.rotation = rest - 360 * INTRO_TURNS;
    applyRotation();
    void els.propeller.offsetWidth;          // commit start frame without transition
    els.stage.classList.remove("no-anim");
    els.stage.classList.add("intro");
    state.rotation = rest;
    applyRotation();
    const done = (e) => { if (e.target !== els.propeller) return;
      els.stage.classList.remove("intro"); els.propeller.removeEventListener("transitionend", done); };
    els.propeller.addEventListener("transitionend", done);
  };
  if (!("IntersectionObserver" in window)) return run();
  const io = new IntersectionObserver((entries)=>{
    if (entries.some(e=>e.isIntersecting)){ io.disconnect(); run(); }
  }, { threshold:.35 });
  io.observe(els.stage);
}
