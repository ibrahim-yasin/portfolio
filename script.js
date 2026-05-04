/* ═══════════════════════════════════════════════════════════
   Ibrahim Yasin — Portfolio  |  script.js
   Smooth scroll · Scroll-reveal · Active nav · Mobile menu
═══════════════════════════════════════════════════════════ */

/* ── Navbar: scroll state ─────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── Mobile hamburger menu ────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ── Active nav link on scroll ────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const allLinks  = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollMid = window.scrollY + window.innerHeight / 3;

  let current = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMid) {
      current = sec.id;
    }
  });

  allLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink(); // run on load

/* ── Scroll-reveal (IntersectionObserver) ─────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // stagger siblings in the same parent
        const siblings = Array.from(
          entry.target.closest('.skills-grid, .projects-grid, .roadmap-grid, .contact-grid, .timeline')
            ?.querySelectorAll(':scope > .reveal') ?? []
        );
        const order = siblings.indexOf(entry.target);
        const delay  = order >= 0 ? order * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── Smooth scroll for anchor links ──────────────────── */
// CSS scroll-behavior:smooth handles it, but this adds offset
// compensation for the fixed navbar.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
      10
    ) || 72;

    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Logo hover glow (footer SVG) ────────────────────── */
const footerLogo = document.querySelector('.logo-footer');
if (footerLogo) {
  footerLogo.addEventListener('mouseenter', () => {
    footerLogo.style.filter = 'drop-shadow(0 0 18px rgba(168,85,247,0.85))';
  });
  footerLogo.addEventListener('mouseleave', () => {
    footerLogo.style.filter = 'drop-shadow(0 0 7px rgba(168,85,247,0.38))';
  });
}
