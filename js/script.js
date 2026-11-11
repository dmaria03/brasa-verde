/* =========================================================
   Brasa Verde | interações do site
   ========================================================= */

// Número do WhatsApp do restaurante (somente dígitos, com DDI 55 + DDD)
const WHATSAPP = "5521900000000";

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Cabeçalho muda ao rolar + botão voltar ao topo ---------- */
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    backToTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Abas do cardápio ---------- */
  const tabs = [...document.querySelectorAll(".tab")];
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* ---------- FAQ (acordeão: uma resposta aberta por vez) ---------- */
  const questions = document.querySelectorAll(".faq__q");
  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      questions.forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.hidden = true;
      });
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        btn.nextElementSibling.hidden = false;
      }
    });
  });

  /* ---------- Formulário de reserva -> WhatsApp ---------- */
  const form = document.getElementById("form-reserva");
  const msg = form.querySelector(".form-msg");
  const dateInput = form.querySelector('input[name="data"]');
  dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      msg.textContent = "Preencha todos os campos para fazer sua reserva.";
      msg.classList.add("is-error");
      form.querySelector(":invalid").focus();
      return;
    }
    msg.classList.remove("is-error");
    const d = Object.fromEntries(new FormData(form));
    const [ano, mes, dia] = d.data.split("-");
    const texto =
      `Olá! Gostaria de reservar uma mesa na Brasa Verde.\n` +
      `Nome: ${d.nome}\nTelefone: ${d.telefone}\n` +
      `Data: ${dia}/${mes}/${ano} às ${d.hora}\nPessoas: ${d.pessoas}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    msg.textContent = "Tudo certo! Abrimos o WhatsApp para você confirmar a reserva.";
    form.reset();
  });

  /* ---------- Animação ao aparecer na tela ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Ano atual no rodapé ---------- */
  document.getElementById("ano").textContent = new Date().getFullYear();
});
