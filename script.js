/* ═══════════════════════════════════════════════════════════
   MAHANOOR NAEEM — PORTFOLIO
   Aurora Glass theme — particles, orb, cursor, motion
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────── Particle background canvas ───────────── */
  (function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    const COLORS = ['#6d5efc', '#d946ef', '#10b981', '#fb7185'];
    const COUNT = window.innerWidth < 768 ? 55 : 110;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    function Particle() { this.reset(); }
    Particle.prototype.reset = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.life = Math.random();
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    };
    function buildParticles() {
      particles = [];
      for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    }
    function drawConnections() {
      const MAX_DIST = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(109,94,252,${(1 - d / MAX_DIST) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life += 0.004;
        if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) p.reset();
        const alpha = 0.3 + 0.5 * Math.abs(Math.sin(p.life));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      animId = requestAnimationFrame(tick);
    }
    resize(); buildParticles(); tick();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize(); buildParticles(); tick();
    });
  })();

  /* ───────────── Custom cursor ───────────── */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && !('ontouchstart' in window)) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .tilt-card, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  /* ───────────── Scroll progress + navbar state ───────────── */
  const scanProgress = document.getElementById('scanProgress');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (scanProgress) scanProgress.style.width = scrolled + '%';

    if (window.scrollY > 40) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');

    if (backToTop) {
      if (window.scrollY > 600) backToTop.classList.add('is-visible');
      else backToTop.classList.remove('is-visible');
    }

    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop && backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ───────────── Mobile menu ───────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');
  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-open');
    navLinksList.classList.toggle('is-open');
  });
  navLinksList && navLinksList.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      navLinksList.classList.remove('is-open');
    });
  });

  /* ───────────── Scroll reveal ───────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ───────────── Skill bars: fill on reveal ───────────── */
  const skillCards = document.querySelectorAll('.skill-card');
  if ('IntersectionObserver' in window) {
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.skill-bar');
          if (bar) bar.style.width = bar.dataset.pct + '%';
          barIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillCards.forEach((card) => barIO.observe(card));
  }

  /* ───────────── Skills tabs filter ───────────── */
  const tabs = document.querySelectorAll('.skills-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const filter = tab.dataset.filter;
      skillCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ───────────── Typing effect ───────────── */
  const typedText = document.getElementById('typedText');
  const phrases = ['full-stack web applications.', 'AI & machine learning models.', 'MERN-stack products.', 'computer vision features.'];
  if (typedText) {
    let pIndex = 0, cIndex = 0, deleting = false;
    function typeLoop() {
      const phrase = phrases[pIndex];
      if (!deleting) {
        cIndex++;
        typedText.textContent = phrase.slice(0, cIndex);
        if (cIndex === phrase.length) { deleting = true; setTimeout(typeLoop, 1500); return; }
      } else {
        cIndex--;
        typedText.textContent = phrase.slice(0, cIndex);
        if (cIndex === 0) { deleting = false; pIndex = (pIndex + 1) % phrases.length; }
      }
      setTimeout(typeLoop, deleting ? 35 : 55);
    }
    typeLoop();
  }

  /* ───────────── Tilt cards ───────────── */
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ───────────── Magnetic buttons ───────────── */
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
    });
  }

  /* ───────────── Orb parallax on mouse move ───────────── */
  const orbContainer = document.querySelector('.orb-container');
  if (orbContainer && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelector('.hero-visual')?.addEventListener('mousemove', (e) => {
      const rect = orbContainer.getBoundingClientRect();
      const px = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const py = (e.clientY - rect.top - rect.height / 2) / rect.height;
      orbContainer.style.transform = `translate(${px * 14}px, ${py * 14}px)`;
    });
    document.querySelector('.hero-visual')?.addEventListener('mouseleave', () => {
      orbContainer.style.transform = 'translate(0, 0)';
    });
  }

  /* ───────────── Contact form (front-end only) ───────────── */
  const sendBtn = document.getElementById('sendBtn');
  const formSuccess = document.getElementById('formSuccess');
  sendBtn && sendBtn.addEventListener('click', () => {
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    if (!name.value || !email.value || !message.value) {
      [name, email, message].forEach((f) => {
        if (!f.value) {
          f.style.borderColor = '#fb7185';
          setTimeout(() => { f.style.borderColor = ''; }, 1600);
        }
      });
      return;
    }
    formSuccess.classList.add('is-visible');
    [name, email, document.getElementById('contactSubject'), message].forEach((f) => (f.value = ''));
    setTimeout(() => formSuccess.classList.remove('is-visible'), 4000);
  });

  /* ───────────── Smooth anchor scroll offset ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });
});
