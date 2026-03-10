/* ═══════════════════════════════════════════════════
   JAISURYA & MEAGA — Wedding Site Scripts
   Temple Doors · Marigold Petals · Scroll Magic
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── TIMING CONSTANTS ──────────────────────────
  const PRELOADER_DURATION = 2800;
  const DOORS_OPEN_DELAY = 400;
  const DOORS_ANIMATION_DURATION = 2200;
  const CONTENT_REVEAL_DELAY = 800;
  const HERO_STAGGER = 150;

  // ── DOM REFERENCES ────────────────────────────
  const preloader = document.getElementById('preloader');
  const templeDoors = document.getElementById('temple-doors');
  const petalsCanvas = document.getElementById('petals-canvas');
  const mainNav = document.getElementById('main-nav');
  const mainContent = document.getElementById('main-content');
  const rsvpForm = document.getElementById('rsvp-form');

  // ═══════════════════════════════════════════════
  // OPENING SEQUENCE
  // ═══════════════════════════════════════════════
  function startOpeningSequence() {
    // Phase 1: Preloader finishes
    setTimeout(() => {
      preloader.classList.add('hide');

      // Phase 2: Temple doors open
      setTimeout(() => {
        templeDoors.classList.add('opening');

        // Phase 3: Show content behind doors
        setTimeout(() => {
          mainContent.classList.add('visible');
          petalsCanvas.classList.add('active');
          initPetals();

          // Phase 4: Reveal hero elements with stagger
          setTimeout(() => {
            revealHeroElements();
            mainNav.classList.add('visible');

            // Phase 5: Hide doors completely
            setTimeout(() => {
              templeDoors.classList.add('hidden');
            }, 1500);
          }, CONTENT_REVEAL_DELAY);
        }, DOORS_ANIMATION_DURATION - 400);
      }, DOORS_OPEN_DELAY);
    }, PRELOADER_DURATION);
  }

  function revealHeroElements() {
    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach((el) => {
      const delay = parseInt(el.dataset.delay || 0) * HERO_STAGGER;
      setTimeout(() => {
        el.classList.add('revealed');
      }, delay);
    });
  }

  // ═══════════════════════════════════════════════
  // MARIGOLD PETALS — Canvas Particle System
  // ═══════════════════════════════════════════════
  const petals = [];
  const MAX_PETALS = 35;
  let ctx;
  let canvasW, canvasH;

  function initPetals() {
    ctx = petalsCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Seed initial petals
    for (let i = 0; i < 15; i++) {
      petals.push(createPetal(true));
    }

    animatePetals();
  }

  function resizeCanvas() {
    canvasW = petalsCanvas.width = window.innerWidth;
    canvasH = petalsCanvas.height = window.innerHeight;
  }

  function createPetal(randomY) {
    const colors = [
      'rgba(232, 197, 71, 0.6)',   // gold
      'rgba(212, 115, 26, 0.5)',   // saffron
      'rgba(200, 168, 78, 0.5)',   // pale gold
      'rgba(232, 140, 50, 0.4)',   // orange
      'rgba(180, 80, 30, 0.4)',    // deep orange
    ];
    return {
      x: Math.random() * canvasW,
      y: randomY ? Math.random() * canvasH : -20,
      size: 4 + Math.random() * 8,
      speedY: 0.3 + Math.random() * 0.8,
      speedX: -0.3 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      wobbleAmp: 0.5 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.3 + Math.random() * 0.5,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // Petal shape: a slightly pointed oval
    ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    // Smaller inner highlight
    ctx.globalAlpha = p.opacity * 0.4;
    ctx.fillStyle = 'rgba(255, 240, 200, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, -p.size * 0.2, p.size * 0.2, p.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animatePetals() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Spawn new petals
    if (petals.length < MAX_PETALS && Math.random() < 0.03) {
      petals.push(createPetal(false));
    }

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * p.wobbleAmp;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      // Remove off-screen petals
      if (p.y > canvasH + 20 || p.x < -30 || p.x > canvasW + 30) {
        petals.splice(i, 1);
        continue;
      }

      drawPetal(p);
    }

    requestAnimationFrame(animatePetals);
  }

  // ═══════════════════════════════════════════════
  // SCROLL REVEAL — Intersection Observer
  // ═══════════════════════════════════════════════
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════════════════
  // COUNTDOWN TIMER
  // ═══════════════════════════════════════════════
  const WEDDING_DATE = new Date('2026-05-01T12:00:00+05:30');

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '0';
      document.getElementById('cd-hours').textContent = '0';
      document.getElementById('cd-minutes').textContent = '0';
      document.getElementById('cd-seconds').textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  function startCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ═══════════════════════════════════════════════
  // NAVIGATION — Active link on scroll
  // ═══════════════════════════════════════════════
  function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scroll for nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Active link highlight on scroll
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + id
              );
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px',
      }
    );

    sections.forEach((section) => scrollObserver.observe(section));
  }

  // ═══════════════════════════════════════════════
  // RSVP FORM
  // ═══════════════════════════════════════════════
  function initRSVP() {
    if (!rsvpForm) return;
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Hide form, show success
      rsvpForm.style.display = 'none';
      document.getElementById('rsvp-success').classList.add('show');
    });
  }

  // ═══════════════════════════════════════════════
  // SECTION DIVIDER ANIMATION
  // ═══════════════════════════════════════════════
  function initDividerAnimations() {
    const dividers = document.querySelectorAll('.section-divider');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    dividers.forEach((d) => {
      d.style.opacity = '0';
      d.style.transition = 'opacity 1s ease';
      observer.observe(d);
    });
  }

  // ═══════════════════════════════════════════════
  // PARALLAX SUBTLE EFFECT — Diyas & Mandala
  // ═══════════════════════════════════════════════
  function initParallax() {
    const mandala = document.querySelector('.hero-bg-mandala');
    const diyas = document.querySelector('.floating-diyas');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.2) {
        if (mandala) {
          mandala.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
        }
        if (diyas) {
          diyas.style.transform = `translateY(${scrollY * 0.08}px)`;
        }
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════
  // INITIALIZE EVERYTHING
  // ═══════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    startOpeningSequence();
    initScrollReveal();
    startCountdown();
    initNavigation();
    initRSVP();
    initDividerAnimations();
    initParallax();
  });
})();
