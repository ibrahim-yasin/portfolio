/* ── Navbar: scroll state & active link ──────────────────────────────────── */
(function () {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class for glass effect intensification
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link — find which section is in view
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 80;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── Mobile hamburger menu ──────────────────────────────────────────────── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ── Scroll-reveal (IntersectionObserver) ───────────────────────────────── */
(function () {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
})();

/* ── Hero canvas — floating particle field ──────────────────────────────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  let W, H, particles;

  const COLORS = [
    'rgba(139, 92, 246, VAL)',   // purple
    'rgba(59, 130, 246, VAL)',   // blue
    'rgba(167, 139, 250, VAL)',  // purple-light
    'rgba(96, 165, 250, VAL)',   // blue-light
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomColor(alpha) {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return c.replace('VAL', alpha);
  }

  function makeParticle() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 1.8 + 0.4,
      vx:  (Math.random() - 0.5) * 0.35,
      vy:  (Math.random() - 0.5) * 0.35,
      color: randomColor((Math.random() * 0.4 + 0.2).toFixed(2)),
    };
  }

  function init() {
    resize();
    const COUNT = Math.min(Math.floor((W * H) / 9000), 90);
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function drawLine(a, b, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.12;
    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha.toFixed(3)})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 140;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) drawLine(particles[i], particles[j], dist, maxDist);
      }
    }

    requestAnimationFrame(tick);
  }

  init();
  tick();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();

/* ── Smooth scroll for all anchor links ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
