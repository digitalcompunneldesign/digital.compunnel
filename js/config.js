/* ==========================================================
   GEOMETRY
   Leaf i sits at base angle STEP*i. "Reading position" = top-right
   quadrant. Propeller rotation that brings leaf i there = -STEP*i.
   ========================================================== */
const STEP = 360 / ACCELERATORS.length;          // 90°
const PETAL = "M4 96C-4 50 20-2 68-2C100-2 104 26 102 46C98 80 50 104 4 96Z";

const state = { index:-1, rotation:0, panelToken:0 };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const $ = (id) => document.getElementById(id);
const els = {
  experience:$("experience"), stage:$("stage"), propeller:$("propeller"), hub:$("hub"),
  tablist:$("tablist"), coreBar:$("coreBar"), panel:$("panel"), panelBody:$("panelBody"),
  values:$("values"), lightbox:$("lightbox")
};
