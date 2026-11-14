// Número de WhatsApp para novos alunos (o mesmo usado no site atual). Troque aqui se precisar.
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
  // A lua acompanha o ponteiro
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    hero.style.setProperty("--mx", (e.clientX / innerWidth - 0.5).toFixed(3));
    hero.style.setProperty("--my", (e.clientY / innerHeight - 0.5).toFixed(3));
  });

  // Botões principais puxam levemente em direção ao cursor
  document.querySelectorAll(".magnetic").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    b.addEventListener("pointerleave", () => (b.style.transform = ""));
  });
}

/* ===== Ciclo da lua: fases + lobo (cheia) / homem e mulher (minguante) =====
   Um único relógio (rAF) lê as "keyframes" abaixo e atualiza a lua e as imagens. */
const scene = document.querySelector(".scene");
if (scene) {
  const carve = scene.querySelector(".carve");
  const figs = ["wolf", "man", "woman"].map((n) => scene.querySelector("." + n));
  const LOOP = 42; // segundos do ciclo completo
  const KEYS = {
    u:     [[0, 1], [4, 1], [10, 0], [15, 0], [21, 1], [25, 1], [31, 0], [36, 0], [42, 1]], // 1 = lua cheia, 0 = minguante
    wolf:  [[0, 1], [4.5, 1], [7, 0], [17.5, 0], [20, 1], [25.5, 1], [28, 0], [38.5, 0], [41, 1], [42, 1]],
    man:   [[0, 0], [6.5, 0], [9.5, 1], [15, 1], [17.5, 0], [42, 0]],
    woman: [[0, 0], [27.5, 0], [30.5, 1], [36, 1], [38.5, 0], [42, 0]],
  };
  const ease = (x) => x * x * (3 - 2 * x);
  const sample = (keys, t) => {
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
        return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
      }
    }
    return keys[keys.length - 1][1];
  };
  const blur = innerWidth < 700 ? 8 : 14;
  const render = (t) => {
    const u = sample(KEYS.u, t);
    carve.setAttribute("transform", `translate(${(14 + 246 * u).toFixed(1)} ${(-5 - 85 * u).toFixed(1)})`);
    figs.forEach((el, i) => {
      const o = sample(KEYS[["wolf", "man", "woman"][i]], t);
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
      el.style.opacity = o.toFixed(3);
      // dissolução prateada: desfoca e acende enquanto troca de forma
      el.style.filter = o > 0.995 ? "none" : `blur(${((1 - o) * blur).toFixed(1)}px) brightness(${(1 + (1 - o) * 1.2).toFixed(2)})`;
    });
  };

  render(0);
  if (!reduce) {
    let t = 0, last = 0, raf = 0, inView = true;
    const tick = (now) => {
      if (last) t = (t + (now - last) / 1000) % LOOP;
      last = now;
      render(t);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && inView && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? start() : stop(); }).observe(scene);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    start();
  }
}

// Luz que segue o cursor nos cartões (planos e Instagram)
document.querySelectorAll(".plan, .insta-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", e.clientX - r.left + "px");
    card.style.setProperty("--y", e.clientY - r.top + "px");
  });
});
