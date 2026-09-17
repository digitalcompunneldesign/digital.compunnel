/* Hero video: pause control, reduced motion, save-data */
(function heroVideo(){
  const v = document.getElementById("heroVideo"), btn = document.getElementById("videoToggle");
  if (!v || !btn) return;
  const setPaused = (paused)=>{
    paused ? v.pause() : v.play().catch(()=>{});
    btn.setAttribute("aria-pressed", paused);
    btn.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
  };
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion.matches || saveData) setPaused(true);
  btn.addEventListener("click", ()=>setPaused(!v.paused));
  document.addEventListener("visibilitychange", ()=>{ if (document.hidden) v.pause(); else if (btn.getAttribute("aria-pressed")==="false") v.play().catch(()=>{}); });
})();
