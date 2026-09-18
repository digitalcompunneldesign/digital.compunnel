/* ==========================================================
   BOT ORB — 60px WebGL sphere pinned bottom-right.
   Rebuilt from spec: violet→cyan ramp, mid detail tier
   (rim 0.048, intensity 1.60, eyes 1.08x, seam 0.022),
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
  const vec3 VIOLET = vec3(.486,.302,1.0);
  const vec3 CYAN   = vec3(.0,.824,.902);
  const vec3 DEEP   = vec3(.043,.106,.247);

  float ell(vec2 p, vec2 c, vec2 r){ vec2 q=(p-c)/r; return length(q)-1.0; }

  void main(){
    float d = length(uv);
    if (d > 1.0){ gl_FragColor = vec4(0.0); return; }
    float z = sqrt(max(0.0, 1.0 - d*d));
    vec3 n = vec3(uv, z);
    vec3 L = normalize(vec3(-0.42, 0.58, 0.80));
    float diff = max(dot(n, L), 0.0);

    // violet (bottom) to cyan (top) ramp, brightened by the light
    vec3 body = mix(VIOLET, CYAN, clamp(uv.y*0.55 + 0.52, 0.0, 1.0));
    body *= 0.42 + 0.72 * diff;
    body += pow(diff, 22.0) * 0.55;                      // specular

    // visor
    float v = ell(uv, vec2(0.0, 0.09), vec2(0.60, 0.40));
    float visor = 1.0 - smoothstep(-0.02, 0.02, v);
    vec3 glass = mix(DEEP, vec3(0.09,0.22,0.46), clamp(uv.y*0.9+0.5,0.0,1.0));
    glass += pow(max(dot(n, normalize(vec3(-0.5,0.8,0.7))), 0.0), 8.0) * 0.30;
    vec3 col = mix(body, glass, visor);

    // seam shadow around the visor edge
    float seamLine = 1.0 - smoothstep(0.0, seam, abs(v));
    col *= 1.0 - 0.55 * seamLine;

    // eyes
    float r = 0.085 * eyeScale;
    float lids = mix(1.0, 0.12, blink);
    float e = min(ell(uv, vec2(-0.215, 0.115), vec2(r, r*lids)),
                  ell(uv, vec2( 0.215, 0.115), vec2(r, r*lids)));
    float eye = 1.0 - smoothstep(-0.01, 0.015, e);
    float halo = 1.0 - smoothstep(-0.05, 0.14, e);
    col += CYAN * halo * 0.35;
    col = mix(col, vec3(0.78,0.99,1.0), eye);

    // rim light, pulsing very slightly
    float rimMask = smoothstep(1.0 - rim - 0.02, 1.0, d);
    col += mix(VIOLET, CYAN, 0.5 + 0.5*uv.y) * rimMask * intensity * (0.92 + 0.08*sin(t*1.6));

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
  let blinkAt = 2.2, blink = 0, raf = 0, visible = true;

  function frame(ms){
    const t = ms / 1000;
    if (!still){
      if (t > blinkAt){ blink = Math.min(1, (t - blinkAt) / 0.07); if (t > blinkAt + 0.14){ blink = 0; blinkAt = t + 3 + Math.random()*3; } }
      else blink = 0;
    }
    gl.uniform1f(U("t"), still ? 0 : t);
    gl.uniform1f(U("blink"), blink);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = visible && !still ? requestAnimationFrame(frame) : 0;
  }
  frame(0);
  document.addEventListener("visibilitychange", ()=>{
    visible = !document.hidden;
    if (visible && !raf && !still) raf = requestAnimationFrame(frame);
  });

  function fallback2d(){
    const c = canvas.getContext("2d");
    if (!c) { host.hidden = true; return; }
    const s = canvas.width, r = s/2;
    const g = c.createRadialGradient(r*0.62, r*0.55, r*0.15, r, r, r);
    g.addColorStop(0, "#9E7BFF"); g.addColorStop(.55, "#6E45F0"); g.addColorStop(1, "#00C8E0");
    c.beginPath(); c.arc(r, r, r*0.99, 0, 6.2832); c.fillStyle = g; c.fill();
    c.beginPath(); c.ellipse(r, r*0.92, r*0.60, r*0.40, 0, 0, 6.2832); c.fillStyle = "#0B1B3F"; c.fill();
    c.fillStyle = "#C7FBFF";
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
