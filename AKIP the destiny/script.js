const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const scrollButtons = document.querySelectorAll("[data-scroll]");
const sections = document.querySelectorAll("main section[id]");
const reveals = document.querySelectorAll(".reveal");
const countEls = document.querySelectorAll(".count-up");
const slider = document.querySelector("[data-slider]");
const particlesContainer = document.querySelector("[data-particles]");
let counted = false;
let sliderInterval;

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 68;
  window.scrollTo({ top, behavior: "smooth" });
  nav?.classList.remove("open");
  header?.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function setHeaderState() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

function setActiveNav() {
  let active = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 160) active = section.id;
  });
  document.querySelectorAll(".site-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.scroll === active);
  });
}

function animateCounts() {
  if (counted) return;
  counted = true;
  countEls.forEach((el) => {
    const end = Number(el.dataset.count || 0);
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(end * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function initSlider() {
  if (!slider) return;
  const slides = slider.querySelectorAll(".slide");
  if (slides.length < 2) return;
  let current = 0;
  function nextSlide() {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }
  sliderInterval = setInterval(nextSlide, 5000);
}

function initParticles() {
  if (!particlesContainer) return;
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.className = "hero-particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.width = particle.style.height = (2 + Math.random() * 4) + "px";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = (6 + Math.random() * 6) + "s";
    particlesContainer.appendChild(particle);
  }
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => scrollToSection(button.dataset.scroll));
});

menuToggle?.addEventListener("click", () => {
  const open = !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  header.classList.toggle("menu-active", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("[data-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const panel = tab.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-panel]").forEach((item) => {
      item.classList.toggle("active", item.dataset.panel === panel);
    });
  });
});

document.querySelectorAll("[data-service-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.dataset.serviceAction;
    if (service === "Battery Storage") {
      document.querySelector('[data-tab="storage"]')?.click();
      scrollToSection("solutions");
      return;
    }
    if (service === "Energy Efficiency" || service === "Energy-as-a-Service") {
      scrollToSection("contact");
      return;
    }
    document.querySelector('[data-tab="solar"]')?.click();
    scrollToSection("contact");
  });
});

document.querySelector("[data-business-hours]")?.addEventListener("click", () => {
  const status = document.querySelector("[data-contact-status]");
  if (status) status.textContent = "Business hours: Monday to Saturday, 08:00 AM to 08:00 PM IST.";
  setTimeout(() => { if (status) status.textContent = ""; }, 5000);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
      if (entry.target.classList.contains("hero-panel") || entry.target.closest(".stats-bar")) {
        animateCounts();
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

reveals.forEach((el) => revealObserver.observe(el));

window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveNav();
}, { passive: true });

setHeaderState();
setActiveNav();
initSlider();
initParticles();

setTimeout(() => {
  document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("visible"));
  animateCounts();
}, 200);
