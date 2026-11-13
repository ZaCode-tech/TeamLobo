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
   ANIMAÇÃO AVANÇADA TEAM LOBO:
   Ciclo contínuo de 18 segundos:
   1. Lua Cheia Realista + Lobo Uivando (com ondas sonoras sutis e brilho lunar)
   2. Transição lenta para Lua Minguante + Metamorfose (partículas prateadas)
      para Atleta Homem Forte segurando Barra com Anilhas (todo prateado cromado)
   3. Retorno da Lua Minguante para Lua Cheia + Lobo Uivando novamente
   4. Nova transição para Lua Minguante + Atleta Mulher Forte segurando Barra
      com Anilhas (toda prateada cromada)
   5. Retorno suave para Lua Cheia + Lobo Uivando
   ============================================================================ */
(() => {
  const canvas = document.getElementById("wolfMoonCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const SIZE = 900;
  canvas.width = SIZE;
  canvas.height = SIZE;

  // Textura procedural offscreen da lua realista com mares lunares e crateras
  const moonTex = document.createElement("canvas");
  moonTex.width = 560;
  moonTex.height = 560;
  const mctx = moonTex.getContext("2d");

  function buildMoonTexture() {
    const w = moonTex.width, h = moonTex.height, cx = w / 2, cy = h / 2, r = w * 0.46;
    mctx.clearRect(0, 0, w, h);
    mctx.save();
    mctx.beginPath();
    mctx.arc(cx, cy, r, 0, Math.PI * 2);
    mctx.clip();

    // Base prateada lunar
    const baseGrad = mctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
    baseGrad.addColorStop(0, "#f5f7fa");
    baseGrad.addColorStop(0.55, "#cfd6e0");
    baseGrad.addColorStop(0.88, "#8e98a8");
    baseGrad.addColorStop(1, "#535c6b");
    mctx.fillStyle = baseGrad;
    mctx.fillRect(0, 0, w, h);

    // Mares lunares (manchas escuras características da lua)
    const maria = [
      [-0.25, -0.22, 0.26, 0.20, 0.22],
      [-0.02, -0.30, 0.18, 0.14, 0.19],
      [0.20, -0.15, 0.22, 0.25, 0.20],
      [-0.32, 0.08, 0.20, 0.24, 0.18],
      [0.05, 0.05, 0.16, 0.15, 0.15],
      [0.26, 0.18, 0.15, 0.13, 0.16],
      [-0.12, 0.28, 0.19, 0.14, 0.14],
    ];
    maria.forEach(([ox, oy, rx, ry, alpha]) => {
      const g = mctx.createRadialGradient(cx + ox * r, cy + oy * r, 2, cx + ox * r, cy + oy * r, Math.max(rx, ry) * r);
      g.addColorStop(0, `rgba(48, 55, 68, ${alpha})`);
      g.addColorStop(0.7, `rgba(62, 70, 84, ${alpha * 0.65})`);
      g.addColorStop(1, "rgba(62, 70, 84, 0)");
      mctx.fillStyle = g;
      mctx.beginPath();
      mctx.ellipse(cx + ox * r, cy + oy * r, rx * r, ry * r, 0.3, 0, Math.PI * 2);
      mctx.fill();
    });

    // Crateras detalhadas com borda iluminada e sombra interna
    let seed = 42;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 95; i++) {
      const ang = rand() * Math.PI * 2;
      const dist = Math.sqrt(rand()) * r * 0.92;
      const x = cx + Math.cos(ang) * dist;
      const y = cy + Math.sin(ang) * dist;
      const cr = (0.015 + Math.pow(rand(), 2.4) * 0.075) * r;

      mctx.beginPath();
      mctx.arc(x, y, cr, 0, Math.PI * 2);
      mctx.fillStyle = "rgba(40, 46, 58, 0.22)";
      mctx.fill();

      mctx.beginPath();
      mctx.arc(x - cr * 0.18, y - cr * 0.18, cr * 0.88, 0, Math.PI * 2);
      mctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      mctx.lineWidth = Math.max(1, cr * 0.14);
      mctx.stroke();
    }

    // Cratera Tycho com raios brilhantes no polo sul lunar
    const tx = cx - r * 0.12, ty = cy + r * 0.56;
    for (let j = 0; j < 14; j++) {
      const a = (j / 14) * Math.PI * 2;
      mctx.beginPath();
      mctx.moveTo(tx, ty);
      mctx.lineTo(tx + Math.cos(a) * r * 0.42, ty + Math.sin(a) * r * 0.42);
      mctx.strokeStyle = "rgba(255, 255, 255, 0.11)";
      mctx.lineWidth = 1.5;
      mctx.stroke();
    }
    mctx.beginPath();
    mctx.arc(tx, ty, r * 0.055, 0, Math.PI * 2);
    mctx.fillStyle = "rgba(240, 244, 250, 0.45)";
    mctx.fill();

    // Vinheta esférica 3D na borda da lua
    const rim = mctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r);
    rim.addColorStop(0, "rgba(5,7,11,0)");
    rim.addColorStop(1, "rgba(5,7,11,0.55)");
    mctx.fillStyle = rim;
    mctx.fillRect(0, 0, w, h);

    mctx.restore();
  }
  buildMoonTexture();

  // Partículas metálicas prateadas que flutuam durante a metamorfose
  const particles = Array.from({ length: 54 }, (_, i) => ({
    angle: (i / 54) * Math.PI * 2,
    radius: 60 + (i * 37) % 240,
    size: 1.4 + (i % 3) * 0.9,
    speed: 0.4 + (i % 5) * 0.18,
    offset: i * 0.7
  }));

  // Gradiente metálico prateado cromado 3D para o homem e a mulher fortes
  function createChromeGradient(x, y, w, h, shimmerShift) {
    const g = ctx.createLinearGradient(x - w * 0.5, y - h * 0.5, x + w * 0.5, y + h * 0.4);
    const s = (Math.sin(shimmerShift) + 1) * 0.12;
    g.addColorStop(0, "#4e5664");
    g.addColorStop(Math.min(0.28 + s, 0.45), "#ffffff");
    g.addColorStop(0.52, "#7c8696");
    g.addColorStop(Math.min(0.76 + s, 0.92), "#f2f5fa");
    g.addColorStop(1, "#3b424f");
    return g;
  }

  // Desenha a Lua com transição suave de Cheia (phase=0) para Minguante (phase=1)
  function drawMoon(cx, cy, r, phase, glowStrength) {
    ctx.save();

    // Halo atmosférico atrás da lua
    const halo = ctx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r * 1.48);
    halo.addColorStop(0, `rgba(215, 228, 248, ${0.26 * glowStrength})`);
    halo.addColorStop(0.55, `rgba(145, 168, 204, ${0.09 * glowStrength})`);
    halo.addColorStop(1, "rgba(5, 7, 11, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.48, 0, Math.PI * 2);
    ctx.fill();

    // Recorte circular da lua
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Desenha a textura lunar realista
    ctx.drawImage(moonTex, cx - r * 1.08, cy - r * 1.08, r * 2.16, r * 2.16);

    // Sombra da fase lunar (transição suave de lua cheia para minguante fina à direita)
    if (phase > 0.001) {
      // Quando phase=0: sombra totalmente fora à esquerda;
      // Quando phase=1: sombra avança deixando um crescente minguante iluminado na direita
      const shadowOffsetX = -r * 2.05 + phase * (r * 1.66);
      const shadowR = r * 1.06;

      const shadowGrad = ctx.createRadialGradient(
        cx + shadowOffsetX, cy, shadowR * 0.82,
        cx + shadowOffsetX, cy, shadowR * 1.05
      );
      shadowGrad.addColorStop(0, "rgba(5, 7, 11, 0.96)");
      shadowGrad.addColorStop(0.86, "rgba(5, 7, 11, 0.92)");
      shadowGrad.addColorStop(1, "rgba(5, 7, 11, 0)");

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(cx + shadowOffsetX, cy, shadowR * 1.05, 0, Math.PI * 2);
      ctx.fill();
    }

    // Borda prateada fina iluminando o contorno da lua
    ctx.strokeStyle = "rgba(235, 242, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // Desenha o Lobo Uivando em silhueta escura com contorno prateado (igual à referência)
  function drawHowlingWolf(cx, cy, scale, alpha, howlPulse, time) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Ondas sutis do uivo saindo do focinho em direção à lua
    if (howlPulse > 0.05) {
      for (let w = 0; w < 3; w++) {
        const prog = ((time * 0.7 + w * 0.33) % 1);
        const waveR = 26 + prog * 115;
        ctx.save();
        ctx.strokeStyle = `rgba(220, 232, 250, ${(1 - prog) * 0.26 * howlPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(46, -148, waveR, -Math.PI * 0.62, -Math.PI * 0.12);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Silhueta anatômica detalhada do lobo uivando para cima
    ctx.beginPath();
    ctx.moveTo(-115, 210); // Base peito esquerdo
    ctx.bezierCurveTo(-112, 140, -96, 80, -78, 22); // Peito robusto
    ctx.bezierCurveTo(-72, -10, -74, -44, -64, -76); // Pescoço frontal
    // Orelha esquerda e direita pontudas
    ctx.lineTo(-56, -124);
    ctx.lineTo(-36, -96);
    ctx.lineTo(-22, -134);
    ctx.lineTo(-6, -98);
    // Testa e focinho apontando para o céu uivando
    ctx.bezierCurveTo(8, -112, 24, -132, 46, -154); // Topo do focinho
    ctx.bezierCurveTo(54, -158, 60, -152, 56, -144); // Ponta do nariz
    ctx.lineTo(36, -118); // Boca aberta uivando (parte superior)
    ctx.lineTo(50, -112); // Mandíbula inferior aberta
    ctx.bezierCurveTo(48, -104, 34, -96, 18, -86); // Queixo
    // Pelagem da juba / nuca do lobo
    ctx.bezierCurveTo(26, -54, 42, -24, 34, 6);
    ctx.lineTo(48, 22);
    ctx.bezierCurveTo(44, 52, 62, 84, 54, 114);
    ctx.lineTo(72, 134);
    ctx.bezierCurveTo(78, 162, 92, 188, 102, 210);
    ctx.closePath();

    // Preenchimento negro profundo com reflexo prateado metálico no dorso/focinho
    const wolfFill = ctx.createLinearGradient(-90, -140, 80, 180);
    wolfFill.addColorStop(0, "#05070b");
    wolfFill.addColorStop(0.45, "#0b1018");
    wolfFill.addColorStop(0.75, "#1b2433");
    wolfFill.addColorStop(1, "#05070b");
    ctx.fillStyle = wolfFill;
    ctx.fill();

    // Rim light (luz de recorte prateada da lua cheia contornando o lobo)
    const rimGrad = ctx.createLinearGradient(-40, -155, 85, 190);
    rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.92)");
    rimGrad.addColorStop(0.5, "rgba(185, 198, 218, 0.65)");
    rimGrad.addColorStop(1, "rgba(120, 132, 150, 0.2)");
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 3.2;
    ctx.stroke();

    ctx.restore();
  }

  // Desenha a barra olímpica com 3 anilhas prateadas de cada lado
  function drawBarbell(yPos, time, isWoman) {
    const chromeBar = createChromeGradient(0, yPos, 560, 40, time * 1.4);

    // Eixo da barra olímpica
    ctx.fillStyle = chromeBar;
    ctx.strokeStyle = "#111620";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-275, yPos - 6, 550, 12, 5);
    ctx.fill();
    ctx.stroke();

    // Conjunto de anilhas (esquerda e direita)
    const sides = [-1, 1];
    const plateSpecs = isWoman
      ? [
          { offset: 158, w: 18, h: 118 },
          { offset: 180, w: 16, h: 102 },
          { offset: 200, w: 14, h: 84 },
          { offset: 218, w: 16, h: 26 } // Presilha
        ]
      : [
          { offset: 168, w: 20, h: 132 },
          { offset: 192, w: 18, h: 116 },
          { offset: 214, w: 16, h: 98 },
          { offset: 234, w: 18, h: 28 } // Presilha
        ];

    sides.forEach((dir) => {
      plateSpecs.forEach((p) => {
        const px = dir > 0 ? p.offset : -p.offset - p.w;
        const py = yPos - p.h / 2;
        const pGrad = ctx.createLinearGradient(px, py, px + p.w, py + p.h);
        pGrad.addColorStop(0, "#ffffff");
        pGrad.addColorStop(0.35, "#9ea8b8");
        pGrad.addColorStop(0.7, "#eef2f8");
        pGrad.addColorStop(1, "#434b59");

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.roundRect(px, py, p.w, p.h, 5);
        ctx.fill();
        ctx.strokeStyle = "#0b0f17";
        ctx.lineWidth = 2.2;
        ctx.stroke();
      });
    });
  }

  // Desenha o Homem Forte Prateado segurando a barra com anilhas nas costas
  function drawStrongMan(cx, cy, scale, alpha, time) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    // Respiração atlética sutil
    const breath = 1 + Math.sin(time * 2.2) * 0.012;
    ctx.scale(scale * breath, scale * breath);

    const bodyGrad = createChromeGradient(0, 10, 340, 380, time * 1.4);

    // 1. Barra olímpica atrás do trapézio
    drawBarbell(-46, time, false);

    // 2. Silhueta muscular masculina (cabeça, trapézio, deltoides, bíceps, antebraços, dorsal)
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = "#0c1018";
    ctx.lineWidth = 3;

    ctx.beginPath();
    // Cabeça e pescoço
    ctx.arc(0, -118, 30, Math.PI * 0.85, Math.PI * 0.15, false);
    // Trapézio direito e ombro/deltoide direito
    ctx.bezierCurveTo(32, -84, 58, -76, 86, -64);
    ctx.bezierCurveTo(116, -54, 134, -26, 138, 6);
    // Bíceps e antebraço direito subindo para segurar a barra
    ctx.bezierCurveTo(154, 6, 166, -16, 162, -46);
    ctx.lineTo(142, -46);
    ctx.bezierCurveTo(138, -28, 128, -20, 118, -24);
    // Dorsal direito (shape em V) até a cintura
    ctx.bezierCurveTo(114, 24, 96, 78, 76, 130);
    ctx.lineTo(74, 205);
    ctx.lineTo(-74, 205);
    ctx.lineTo(-76, 130);
    // Dorsal esquerdo
    ctx.bezierCurveTo(-96, 78, -114, 24, -118, -24);
    // Antebraço e bíceps esquerdo segurando a barra
    ctx.bezierCurveTo(-128, -20, -138, -28, -142, -46);
    ctx.lineTo(-162, -46);
    ctx.bezierCurveTo(-166, -16, -154, 6, -138, 6);
    // Deltoide e trapézio esquerdo
    ctx.bezierCurveTo(-134, -26, -116, -54, -86, -64);
    ctx.bezierCurveTo(-58, -76, -32, -84, -26, -98);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mãos fechadas segurando a barra na frente
    [-152, 152].forEach((hx) => {
      ctx.beginPath();
      ctx.roundRect(hx - 14, -56, 28, 22, 8);
      ctx.fillStyle = "#f4f7fc";
      ctx.fill();
      ctx.stroke();
    });

    // Linhas internas de definição muscular (peitoral/escápulas e abdômen)
    ctx.strokeStyle = "rgba(15, 20, 30, 0.42)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -58);
    ctx.lineTo(0, 110);
    ctx.moveTo(-64, 4);
    ctx.quadraticCurveTo(-28, 22, 0, 8);
    ctx.quadraticCurveTo(28, 22, 64, 4);
    ctx.stroke();

    // Brilho especular de borda prateada
    ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, -118, 28, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();

    ctx.restore();
  }

  // Desenha a Mulher Forte Prateada (com rabo de cavalo) segurando a barra com anilhas
  function drawStrongWoman(cx, cy, scale, alpha, time) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    const breath = 1 + Math.sin(time * 2.2) * 0.012;
    ctx.scale(scale * breath, scale * breath);

    const bodyGrad = createChromeGradient(0, 10, 320, 380, time * 1.4 + 1.2);

    // 1. Barra olímpica atrás dos ombros
    drawBarbell(-46, time, true);

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = "#0c1018";
    ctx.lineWidth = 3;

    // 2. Rabo de cavalo estilizado prateado esvoaçante
    ctx.beginPath();
    ctx.moveTo(-18, -138);
    ctx.bezierCurveTo(-56, -148, -76, -112, -66, -72);
    ctx.bezierCurveTo(-54, -84, -44, -104, -26, -112);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Silhueta atlética feminina definida (cintura marcada, ombros torneados, quadril atlético)
    ctx.beginPath();
    // Cabeça e pescoço esguio
    ctx.arc(0, -116, 26, Math.PI * 0.85, Math.PI * 0.15, false);
    // Ombro e deltoide direito definido
    ctx.bezierCurveTo(24, -84, 48, -74, 74, -62);
    ctx.bezierCurveTo(100, -52, 118, -26, 122, 4);
    // Bíceps e antebraço direito segurando a barra
    ctx.bezierCurveTo(138, 4, 150, -16, 146, -46);
    ctx.lineTo(128, -46);
    ctx.bezierCurveTo(124, -28, 114, -22, 104, -24);
    // Cintura fina definida e curva do quadril atlético direito
    ctx.bezierCurveTo(92, 18, 62, 54, 56, 86);
    ctx.bezierCurveTo(52, 114, 78, 142, 82, 205);
    ctx.lineTo(-82, 205);
    // Quadril atlético e cintura fina esquerda
    ctx.bezierCurveTo(-78, 142, -52, 114, -56, 86);
    ctx.bezierCurveTo(-62, 54, -92, 18, -104, -24);
    // Antebraço e bíceps esquerdo segurando a barra
    ctx.bezierCurveTo(-114, -22, -124, -28, -128, -46);
    ctx.lineTo(-146, -46);
    ctx.bezierCurveTo(-150, -16, -138, 4, -122, 4);
    // Deltoide e ombro esquerdo
    ctx.bezierCurveTo(-118, -26, -100, -52, -74, -62);
    ctx.bezierCurveTo(-48, -74, -24, -84, -22, -96);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mãos fechadas na barra
    [-137, 137].forEach((hx) => {
      ctx.beginPath();
      ctx.roundRect(hx - 13, -55, 26, 20, 7);
      ctx.fillStyle = "#f4f7fc";
      ctx.fill();
      ctx.stroke();
    });

    // Linhas internas de definição feminina
    ctx.strokeStyle = "rgba(15, 20, 30, 0.38)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-48, -2);
    ctx.quadraticCurveTo(-22, 14, 0, 4);
    ctx.quadraticCurveTo(22, 14, 48, -2);
    ctx.moveTo(-46, 138);
    ctx.quadraticCurveTo(0, 152, 46, 138);
    ctx.stroke();

    ctx.restore();
  }

  // Partículas prateadas de energia durante as transições de metamorfose
  function drawMorphParticles(cx, cy, intensity, time) {
    if (intensity <= 0.02) return;
    ctx.save();
    particles.forEach((p) => {
      const a = p.angle + time * p.speed;
      const r = p.radius * (0.75 + 0.35 * Math.sin(time * 2 + p.offset));
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.85;
      ctx.fillStyle = `rgba(240, 245, 255, ${intensity * 0.75})`;
      ctx.beginPath();
      ctx.arc(x, y, p.size * (0.6 + intensity * 0.7), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  const CYCLE = 18.0; // 18 segundos para o ciclo completo (Lobo -> Homem -> Lobo -> Mulher -> Lobo)

  function render(nowMs) {
    const time = nowMs * 0.001;
    const t = reduce ? 0.5 : (time % CYCLE);

    ctx.clearRect(0, 0, SIZE, SIZE);

    let moonPhase = 0; // 0 = Lua Cheia, 1 = Lua Minguante
    let wolfAlpha = 0;
    let manAlpha = 0;
    let womanAlpha = 0;
    let morphEnergy = 0;
    let howlPulse = 0;

    if (t < 3.0) {
      // 0s - 3s: Lua Cheia + Lobo Uivando
      moonPhase = 0;
      wolfAlpha = 1;
      howlPulse = 1;
    } else if (t < 5.5) {
      // 3s - 5.5s: Transição lenta para Lua Minguante + Lobo se transforma no Homem Forte Prateado
      const p = easeInOutSine((t - 3.0) / 2.5);
      moonPhase = p;
      wolfAlpha = 1 - p;
      manAlpha = p;
      morphEnergy = Math.sin(p * Math.PI);
    } else if (t < 8.0) {
      // 5.5s - 8.0s: Lua Minguante + Homem Forte Prateado em destaque
      moonPhase = 1;
      manAlpha = 1;
    } else if (t < 10.2) {
      // 8.0s - 10.2s: Volta da Lua Cheia + Homem retorna ao Lobo Uivando
      const p = easeInOutSine((t - 8.0) / 2.2);
      moonPhase = 1 - p;
      manAlpha = 1 - p;
      wolfAlpha = p;
      morphEnergy = Math.sin(p * Math.PI);
      howlPulse = p;
    } else if (t < 12.2) {
      // 10.2s - 12.2s: Lua Cheia + Lobo Uivando novamente
      moonPhase = 0;
      wolfAlpha = 1;
      howlPulse = 1;
    } else if (t < 14.7) {
      // 12.2s - 14.7s: Transição lenta para Lua Minguante + Lobo se transforma na Mulher Forte Prateada
      const p = easeInOutSine((t - 12.2) / 2.5);
      moonPhase = p;
      wolfAlpha = 1 - p;
      womanAlpha = p;
      morphEnergy = Math.sin(p * Math.PI);
    } else if (t < 16.5) {
      // 14.7s - 16.5s: Lua Minguante + Mulher Forte Prateada em destaque
      moonPhase = 1;
      womanAlpha = 1;
    } else {
      // 16.5s - 18.0s: Volta suave para Lua Cheia + Lobo Uivando fechando o loop perfeito
      const p = easeInOutSine((t - 16.5) / 1.5);
      moonPhase = 1 - p;
      womanAlpha = 1 - p;
      wolfAlpha = p;
      morphEnergy = Math.sin(p * Math.PI);
      howlPulse = p;
    }

    const moonX = 480;
    const moonY = 390;
    const moonR = 265;

    // 1. Desenha a Lua (Cheia -> Minguante -> Cheia)
    drawMoon(moonX, moonY, moonR, moonPhase, 1 - moonPhase * 0.45);

    // 2. Partículas prateadas da transformação
    drawMorphParticles(moonX, moonY + 75, morphEnergy, time);

    // 3. Figuras em primeiro plano sobre a lua
    drawHowlingWolf(moonX - 10, moonY + 115, 1.05 + (1 - wolfAlpha) * 0.08, wolfAlpha, howlPulse, time);
    drawStrongMan(moonX, moonY + 110, 0.94 + manAlpha * 0.06, manAlpha, time);
    drawStrongWoman(moonX, moonY + 110, 0.94 + womanAlpha * 0.06, womanAlpha, time);

    if (!reduce) requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
