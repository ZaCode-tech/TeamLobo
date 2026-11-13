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
