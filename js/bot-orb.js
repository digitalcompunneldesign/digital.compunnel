/* ==========================================================
   BOT ORB — 60px WebGL sphere pinned bottom-right.
   Rebuilt from spec: mid detail tier
   (rim 0.048, intensity 1.60, eyes 1.08x, seam 0.022),
   brand ramp #0050EF -> #9326FF -> #E500E5 -> #FF410E,
   eyes tracking the pointer,
   DPR capped at 2.5, alpha canvas so the CSS shadow follows
   the silhouette. Falls back to a 2D-canvas orb without WebGL.
   ========================================================== */
(function botOrb(){
  const SIZE = 60;                       // change this alone; tiers switch at 40 / 80
  const tier = SIZE < 40 ? 0 : SIZE < 80 ? 1 : 2;
  const CFG = [
    { rim:0.036, intensity:1.25, eye:1.00, seam:0.016, dpr:3.0 },
    { rim:0.048, intensity:1.60, eye:1.08, seam:0.022, dpr:2.5 },
    { rim:0.042, intensity:1.40, eye:1.00, seam:0.018, dpr:3.0 }
  ][tier];

  const host = document.getElementById("botOrb");
  if (!host) return;
  const canvas = host.querySelector("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, CFG.dpr);
  canvas.width = canvas.height = Math.round(SIZE * dpr);

  const VERT = `attribute vec2 p;varying vec2 uv;void main(){uv=p;gl_Position=vec4(p,0.,1.);}`;
  const FRAG = `precision highp float;
  varying vec2 uv;
  uniform float t, rim, intensity, eyeScale, seam, blink;
  uniform vec2 look;          // -1..1 gaze direction from the pointer
  // brand ramp: #0050EF -> #9326FF -> #E500E5 -> #FF410E
  const vec3 G0 = vec3(.000,.314,.937);
  const vec3 G1 = vec3(.576,.149,1.00);
  const vec3 G2 = vec3(.898,.000,.898);
  const vec3 G3 = vec3(1.00,.255,.055);
  const vec3 DEEP = vec3(.043,.086,.208);

  vec3 ramp(float x){
    x = clamp(x, 0.0, 1.0) * 3.0;
    if (x < 1.0) return mix(G0, G1, x);
    if (x < 2.0) return mix(G1, G2, x - 1.0);
    return mix(G2, G3, x - 2.0);
  }

  float ell(vec2 p, vec2 c, vec2 r){ vec2 q=(p-c)/r; return length(q)-1.0; }

  void main(){
    float d = length(uv);
    if (d > 1.0){ gl_FragColor = vec4(0.0); return; }
    float z = sqrt(max(0.0, 1.0 - d*d));
    vec3 n = vec3(uv, z);
    vec3 L = normalize(vec3(-0.42, 0.58, 0.80));
    float diff = max(dot(n, L), 0.0);

    // brand ramp runs diagonally: blue at top-left, orange at bottom-right
    float g = clamp(0.5 + (uv.x * 0.62 - uv.y * 0.46) * 0.95, 0.0, 1.0);
    vec3 body = ramp(g);
    body *= 0.42 + 0.72 * diff;
    body += pow(diff, 22.0) * 0.55;                      // specular

    // visor
    float v = ell(uv, vec2(0.0, 0.09), vec2(0.60, 0.40));
    float visor = 1.0 - smoothstep(-0.02, 0.02, v);
    vec3 glass = mix(DEEP, mix(vec3(0.07,0.13,0.38), vec3(0.24,0.06,0.26), g), clamp(uv.y*0.9+0.5,0.0,1.0));
    glass += pow(max(dot(n, normalize(vec3(-0.5,0.8,0.7))), 0.0), 8.0) * 0.30;
    vec3 col = mix(body, glass, visor);

    // seam shadow around the visor edge
    float seamLine = 1.0 - smoothstep(0.0, seam, abs(v));
    col *= 1.0 - 0.55 * seamLine;

    // eyes
    float r = 0.085 * eyeScale;
    float lids = mix(1.0, 0.12, blink);
    vec2 gaze = look * vec2(0.085, 0.070);
    float e = min(ell(uv, vec2(-0.215, 0.115) + gaze, vec2(r, r*lids)),
                  ell(uv, vec2( 0.215, 0.115) + gaze, vec2(r, r*lids)));
    float eye = 1.0 - smoothstep(-0.01, 0.015, e);
    float halo = 1.0 - smoothstep(-0.05, 0.14, e);
    col += ramp(g) * halo * 0.40;
    col = mix(col, vec3(0.96,0.97,1.0), eye);

    // rim light, pulsing very slightly
    float rimMask = smoothstep(1.0 - rim - 0.02, 1.0, d);
    col += ramp(g + 0.10) * rimMask * intensity * (0.92 + 0.08*sin(t*1.6));

    float alpha = 1.0 - smoothstep(0.985, 1.0, d);
    gl_FragColor = vec4(col, alpha);
  }`;

  const gl = canvas.getContext("webgl", { alpha:true, premultipliedAlpha:false, antialias:true });
  if (!gl){ fallback2d(); return; }

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)){ fallback2d(); return; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const U = name => gl.getUniformLocation(prog, name);
  gl.uniform1f(U("rim"), CFG.rim);
  gl.uniform1f(U("intensity"), CFG.intensity);
  gl.uniform1f(U("eyeScale"), CFG.eye);
  gl.uniform1f(U("seam"), CFG.seam);

  const still = reduceMotion.matches;
  const uLook = U("look");
  let blinkAt = 2.2, blink = 0, raf = 0, visible = true;
  let look = { x:0, y:0 }, target = { x:0, y:0 };

  /* Gaze: the eyes follow the pointer anywhere on the page. The direction is
     taken from the orb's centre, and the pull maxes out about 280px away. */
  const REACH = 280;
  function aimAt(clientX, clientY){
    const r = canvas.getBoundingClientRect();
    const dx = clientX - (r.left + r.width/2);
    const dy = clientY - (r.top + r.height/2);
    const dist = Math.hypot(dx, dy) || 1;
    const pull = Math.min(1, dist / REACH);
    target.x = (dx / dist) * pull;
    target.y = -(dy / dist) * pull;           // screen y is down, clip y is up
  }
  window.addEventListener("pointermove", e=>{
    if (e.pointerType === "touch") return;
    aimAt(e.clientX, e.clientY);
    if (still){ look = { ...target }; draw(performance.now()); }
  }, { passive:true });
  window.addEventListener("pointerleave", ()=>{ target.x = target.y = 0; }, { passive:true });
  window.addEventListener("blur", ()=>{ target.x = target.y = 0; });

  function draw(ms){
    const t = ms / 1000;
    if (!still){
      if (t > blinkAt){ blink = Math.min(1, (t - blinkAt) / 0.07); if (t > blinkAt + 0.14){ blink = 0; blinkAt = t + 3 + Math.random()*3; } }
      else blink = 0;
      const ease = 0.12;                      // smooth pursuit rather than snapping
      look.x += (target.x - look.x) * ease;
      look.y += (target.y - look.y) * ease;
    }
    gl.uniform1f(U("t"), still ? 0 : t);
    gl.uniform1f(U("blink"), blink);
    gl.uniform2f(uLook, look.x, look.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function frame(ms){ draw(ms); raf = visible && !still ? requestAnimationFrame(frame) : 0; }
  frame(0);
  document.addEventListener("visibilitychange", ()=>{
    visible = !document.hidden;
    if (visible && !raf && !still) raf = requestAnimationFrame(frame);
  });

  function fallback2d(){
    const c = canvas.getContext("2d");
    if (!c) { host.hidden = true; return; }
    const s = canvas.width, r = s/2;
    const g = c.createLinearGradient(r*0.25, r*0.30, r*1.75, r*1.70);
    g.addColorStop(0, "#0050EF"); g.addColorStop(.38, "#9326FF"); g.addColorStop(.72, "#E500E5"); g.addColorStop(1, "#FF410E");
    c.beginPath(); c.arc(r, r, r*0.99, 0, 6.2832); c.fillStyle = g; c.fill();
    c.beginPath(); c.ellipse(r, r*0.92, r*0.60, r*0.40, 0, 0, 6.2832); c.fillStyle = "#0B1635"; c.fill();
    c.fillStyle = "#F5F7FF";
    [-0.215, 0.215].forEach(x=>{ c.beginPath(); c.ellipse(r + x*r, r*0.885, r*0.085*CFG.eye, r*0.085*CFG.eye, 0, 0, 6.2832); c.fill(); });
  }

  // The orb doubles as a shortcut into the hero AI search.
  host.querySelector(".bot-btn").addEventListener("click", ()=>{
    const input = document.getElementById("aiQuery");
    if (!input) return;
    input.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block:"center" });
    setTimeout(()=>input.focus({ preventScroll:true }), reduceMotion.matches ? 0 : 420);
  });
})();
