'use strict';

const CONFIG = {
  // Sustituye por el número real de Melting Bites en formato internacional, sin + ni espacios.
  whatsappNumber: '5210000000000',
  whatsappBaseMessage: 'Hola, quiero cotizar una vela comestible de Melting Bites.'
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initHeader() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  const links = [...document.querySelectorAll('.nav-menu a[href^="#"]')];

  const syncHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  const closeMenu = () => {
    document.body.classList.remove('nav-open');
    menu?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu?.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });

  links.forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });

    sections.forEach((section) => observer.observe(section));
  }
}

function initReveal() {
  const items = [...document.querySelectorAll('[data-reveal]')];

  items.forEach((item) => {
    const delay = item.getAttribute('data-reveal-delay');
    if (delay) item.style.setProperty('--delay', `${delay}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  items.forEach((item) => observer.observe(item));
}

function initPointerGlow() {
  const glowables = [...document.querySelectorAll('.btn, .sensory-card, .advantage-card, .flavor-card')];
  glowables.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty('--x', `${x}%`);
      element.style.setProperty('--y', `${y}%`);
      element.style.setProperty('--mx', `${x}%`);
      element.style.setProperty('--my', `${y}%`);
    });
  });
}

function initTilt() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const stage = document.querySelector('[data-tilt]');
  if (!stage) return;

  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(18px)`;
  });

  stage.addEventListener('pointerleave', () => {
    stage.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
}

function initMagneticButtons() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.2}px)`;
    });

    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });
}

function initOrderForm() {
  const form = document.querySelector('[data-order-form]');
  const note = document.querySelector('[data-form-note]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const occasion = String(data.get('occasion') || '').trim();
    const flavor = String(data.get('flavor') || '').trim();
    const details = String(data.get('details') || '').trim();

    const message = [
      CONFIG.whatsappBaseMessage,
      '',
      `Nombre: ${name}`,
      `Ocasión: ${occasion}`,
      `Sabor de interés: ${flavor}`,
      details ? `Detalles: ${details}` : null
    ].filter(Boolean).join('\n');

    const href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

    if (CONFIG.whatsappNumber === '5210000000000') {
      note.innerHTML = 'Mensaje generado. Antes de publicar, reemplaza el número de WhatsApp en <code>js/app.js</code>. <a href="' + href + '" target="_blank" rel="noreferrer">Probar enlace</a>';
      return;
    }

    window.open(href, '_blank', 'noopener,noreferrer');
  });
}

function initSparks() {
  if (prefersReducedMotion) return;

  const canvas = document.querySelector('[data-sparks]');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const particles = [];
  const particleCount = Math.min(86, Math.floor(window.innerWidth / 12));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetParticle(particle) {
    const rect = canvas.getBoundingClientRect();
    particle.x = Math.random() * rect.width;
    particle.y = rect.height + Math.random() * 160;
    particle.size = Math.random() * 2.2 + 0.7;
    particle.speed = Math.random() * 0.62 + 0.22;
    particle.drift = (Math.random() - 0.5) * 0.35;
    particle.alpha = Math.random() * 0.55 + 0.1;
    particle.life = Math.random() * 120 + 80;
    particle.hue = Math.random() > 0.28 ? '255, 205, 116' : '255, 111, 135';
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      const particle = {};
      resetParticle(particle);
      particle.y = Math.random() * canvas.getBoundingClientRect().height;
      particles.push(particle);
    }
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);

    particles.forEach((particle) => {
      particle.x += particle.drift;
      particle.y -= particle.speed;
      particle.life -= 1;
      particle.alpha *= 0.996;

      if (particle.y < -20 || particle.life <= 0 || particle.alpha < 0.02) {
        resetParticle(particle);
      }

      const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 8);
      gradient.addColorStop(0, `rgba(${particle.hue}, ${particle.alpha})`);
      gradient.addColorStop(1, `rgba(${particle.hue}, 0)`);

      context.beginPath();
      context.fillStyle = gradient;
      context.arc(particle.x, particle.y, particle.size * 8, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });
}

function setCurrentYear() {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initReveal();
  initPointerGlow();
  initTilt();
  initMagneticButtons();
  initOrderForm();
  initSparks();
  setCurrentYear();
});
