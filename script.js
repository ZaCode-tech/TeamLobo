// Número de WhatsApp para novos alunos. Troque aqui se precisar.
const WHATSAPP = "5511992890538";

// Botões com data-wa abrem o WhatsApp com a mensagem pronta
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(el.dataset.wa)}`;
  el.target = "_blank";
  el.rel = "noopener";
});

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Barra de progresso da rolagem
const bar = document.querySelector(".progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
}, { passive: true });

// Contadores animados ao entrar na tela
const counters = document.querySelectorAll("[data-count]");
const run = (el) => {
  const end = +el.dataset.count, prefix = el.dataset.prefix || "";
  if (reduce) { el.textContent = prefix + end; return; }
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = prefix + Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
}, { threshold: 0.6 });
counters.forEach((c) => io.observe(c));

if (!reduce) {
  // A lua e os botões reagem suavemente ao ponteiro
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    hero.style.setProperty("--mx", (e.clientX / innerWidth - 0.5).toFixed(3));
    hero.style.setProperty("--my", (e.clientY / innerHeight - 0.5).toFixed(3));
  });

  document.querySelectorAll(".magnetic").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    b.addEventListener("pointerleave", () => (b.style.transform = ""));
  });
}

/* ============================================================================
   ANIMAÇÃO AVANÇADA TEAM LOBO (LUA PRATEADA & SUPER BRILHANTE + IMAGENS SINCRONIZADAS):
   Ciclo contínuo de 18 segundos:
   1. Lua Cheia Super Prateada e Brilhante + Lobo.png ativo
   2. Transição para Lua Minguante + Partículas prateadas + Homem.jpg ativo
   3. Retorno para Lua Cheia + Lobo.png ativo
   4. Transição para Lua Minguante + Partículas prateadas + Mulher.jpg ativo
   5. Retorno para Lua Cheia + Lobo.png ativo
   ============================================================================ */
(() => {
  const canvas = document.getElementById("silverMoonCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const SIZE = 900;
  canvas.width = SIZE;
  canvas.height = SIZE;

  // Referências para os elementos de imagem sincronizados
  const charWolf = document.getElementById("charWolf");
  const charMan = document.getElementById("charMan");
  const charWoman = document.getElementById("charWoman");

  // Textura offscreen da lua ultra prateada e detalhada com crateras profundas
  const moonTex = document.createElement("canvas");
  moonTex.width = 560;
  moonTex.height = 560;
  const mctx = moonTex.getContext("2d");

  function buildSuperSilverMoonTexture() {
    const w = moonTex.width, h = moonTex.height, cx = w / 2, cy = h / 2, r = w * 0.46;
    mctx.clearRect(0, 0, w, h);
    mctx.save();
    mctx.beginPath();
    mctx.arc(cx, cy, r, 0, Math.PI * 2);
    mctx.clip();

    // Base ultra prateada e luminosa
    const baseGrad = mctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.05, cx, cy, r);
    baseGrad.addColorStop(0, "#ffffff");
    baseGrad.addColorStop(0.35, "#e6edf8");
    baseGrad.addColorStop(0.72, "#b4c3dc");
    baseGrad.addColorStop(0.92, "#7a8a9f");
    baseGrad.addColorStop(1, "#3f4958");
    mctx.fillStyle = baseGrad;
    mctx.fillRect(0, 0, w, h);

    // Mares lunares em tons prateados profundos
    const maria = [
      [-0.25, -0.22, 0.26, 0.20, 0.28],
      [-0.02, -0.30, 0.18, 0.14, 0.24],
      [0.20, -0.15, 0.22, 0.25, 0.25],
      [-0.32, 0.08, 0.20, 0.24, 0.22],
      [0.05, 0.05, 0.16, 0.15, 0.20],
      [0.26, 0.18, 0.15, 0.13, 0.22],
      [-0.12, 0.28, 0.19, 0.14, 0.20],
    ];
    maria.forEach(([ox, oy, rx, ry, alpha]) => {
      const g = mctx.createRadialGradient(cx + ox * r, cy + oy * r, 2, cx + ox * r, cy + oy * r, Math.max(rx, ry) * r);
      g.addColorStop(0, `rgba(50, 60, 75, ${alpha})`);
      g.addColorStop(0.7, `rgba(75, 88, 108, ${alpha * 0.7})`);
      g.addColorStop(1, "rgba(75, 88, 108, 0)");
      mctx.fillStyle = g;
      mctx.beginPath();
      mctx.ellipse(cx + ox * r, cy + oy * r, rx * r, ry * r, 0.3, 0, Math.PI * 2);
      mctx.fill();
    });

    // Crateras lunares detalhadas com brilho acentuado
    let seed = 123;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 110; i++) {
      const ang = rand() * Math.PI * 2;
      const dist = Math.sqrt(rand()) * r * 0.93;
      const x = cx + Math.cos(ang) * dist;
      const y = cy + Math.sin(ang) * dist;
      const cr = (0.012 + Math.pow(rand(), 2.4) * 0.07) * r;

      mctx.beginPath();
      mctx.arc(x, y, cr, 0, Math.PI * 2);
      mctx.fillStyle = "rgba(45, 54, 68, 0.28)";
      mctx.fill();

      mctx.beginPath();
      mctx.arc(x - cr * 0.18, y - cr * 0.18, cr * 0.88, 0, Math.PI * 2);
      mctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
      mctx.lineWidth = Math.max(1, cr * 0.16);
      mctx.stroke();
    }

    // Vinheta 3D e brilho na borda
    const rim = mctx.createRadialGradient(cx, cy, r * 0.65, cx, cy, r);
    rim.addColorStop(0, "rgba(5,7,11,0)");
    rim.addColorStop(1, "rgba(5,7,11,0.6)");
    mctx.fillStyle = rim;
    mctx.fillRect(0, 0, w, h);

    mctx.restore();
  }
  buildSuperSilverMoonTexture();

  // Partículas prateadas cintilantes para as transições
  const particles = Array.from({ length: 64 }, (_, i) => ({
    angle: (i / 64) * Math.PI * 2,
    radius: 70 + (i * 41) % 260,
    size: 1.5 + (i % 3) * 1.0,
    speed: 0.45 + (i % 5) * 0.18,
    offset: i * 0.6
  }));

  function drawMoon(cx, cy, r, phase, glowStrength, time) {
    ctx.save();

    // Halo atmosférico super brilhante e prateado
    const pulseGlow = glowStrength * (1 + Math.sin(time * 3) * 0.15);
    const halo = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.75);
    halo.addColorStop(0, `rgba(235, 245, 255, ${0.42 * pulseGlow})`);
    halo.addColorStop(0.45, `rgba(165, 190, 228, ${0.18 * pulseGlow})`);
    halo.addColorStop(0.8, `rgba(110, 140, 185, ${0.06 * pulseGlow})`);
    halo.addColorStop(1, "rgba(5, 7, 11, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.75, 0, Math.PI * 2);
    ctx.fill();

    // Recorte circular da lua
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Desenha a textura lunar
    ctx.drawImage(moonTex, cx - r * 1.08, cy - r * 1.08, r * 2.16, r * 2.16);

    // Sombra da fase lunar (muda de cheia para minguante)
    if (phase > 0.001) {
      const shadowOffsetX = -r * 2.05 + phase * (r * 1.68);
      const shadowR = r * 1.06;

      const shadowGrad = ctx.createRadialGradient(
        cx + shadowOffsetX, cy, shadowR * 0.8,
        cx + shadowOffsetX, cy, shadowR * 1.06
      );
      shadowGrad.addColorStop(0, "rgba(5, 7, 11, 0.98)");
      shadowGrad.addColorStop(0.85, "rgba(5, 7, 11, 0.94)");
      shadowGrad.addColorStop(1, "rgba(5, 7, 11, 0)");

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(cx + shadowOffsetX, cy, shadowR * 1.06, 0, Math.PI * 2);
      ctx.fill();
    }

    // Contorno luminoso prateado na borda da lua
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawMorphParticles(cx, cy, intensity, time) {
    if (intensity <= 0.02) return;
    ctx.save();
    particles.forEach((p) => {
      const a = p.angle + time * p.speed;
      const r = p.radius * (0.8 + 0.3 * Math.sin(time * 2.5 + p.offset));
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.85;
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.9})`;
      ctx.shadowColor = "rgba(220, 240, 255, 0.9)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y, p.size * (0.7 + intensity * 0.8), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  const CYCLE = 18.0; // 18 segundos no total

  function render(nowMs) {
    const time = nowMs * 0.001;
    const t = reduce ? 0.5 : (time % CYCLE);

    ctx.clearRect(0, 0, SIZE, SIZE);

    let moonPhase = 0; // 0 = Cheia, 1 = Minguante
    let wolfActive = false;
    let manActive = false;
    let womanActive = false;
    let morphEnergy = 0;

    if (t < 3.0) {
      // 0s - 3s: Lua Cheia + Lobo.png
      moonPhase = 0;
      wolfActive = true;
    } else if (t < 5.5) {
      // 3s - 5.5s: Transição para Lua Minguante + Homem.jpg
      const p = easeInOutSine((t - 3.0) / 2.5);
      moonPhase = p;
      if (p < 0.5) wolfActive = true; else manActive = true;
      morphEnergy = Math.sin(p * Math.PI);
    } else if (t < 8.0) {
      // 5.5s - 8.0s: Lua Minguante + Homem.jpg
      moonPhase = 1;
      manActive = true;
    } else if (t < 10.2) {
      // 8.0s - 10.2s: Retorno para Lua Cheia + Lobo.png
      const p = easeInOutSine((t - 8.0) / 2.2);
      moonPhase = 1 - p;
      if (p < 0.5) manActive = true; else wolfActive = true;
      morphEnergy = Math.sin(p * Math.PI);
    } else if (t < 12.2) {
      // 10.2s - 12.2s: Lua Cheia + Lobo.png
      moonPhase = 0;
      wolfActive = true;
    } else if (t < 14.7) {
      // 12.2s - 14.7s: Transição para Lua Minguante + Mulher.jpg
      const p = easeInOutSine((t - 12.2) / 2.5);
      moonPhase = p;
      if (p < 0.5) wolfActive = true; else womanActive = true;
      morphEnergy = Math.sin(p * Math.PI);
    } else if (t < 16.5) {
      // 14.7s - 16.5s: Lua Minguante + Mulher.jpg
      moonPhase = 1;
      womanActive = true;
    } else {
      // 16.5s - 18.0s: Retorno para Lua Cheia + Lobo.png
      const p = easeInOutSine((t - 16.5) / 1.5);
      moonPhase = 1 - p;
      if (p < 0.5) womanActive = true; else wolfActive = true;
      morphEnergy = Math.sin(p * Math.PI);
    }

    // Atualiza as classes CSS das imagens HTML para fazer o fade in/out sincronizado
    if (charWolf) charWolf.classList.toggle('active', wolfActive);
    if (charMan) charMan.classList.toggle('active', manActive);
    if (charWoman) charWoman.classList.toggle('active', womanActive);

    const moonX = 480;
    const moonY = 390;
    const moonR = 265;

    // 1. Desenha a Lua ultra prateada e brilhante
    drawMoon(moonX, moonY, moonR, moonPhase, 1.25 - moonPhase * 0.4, time);

    // 2. Partículas prateadas de transição
    drawMorphParticles(moonX, moonY + 75, morphEnergy, time);

    if (!reduce) requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
