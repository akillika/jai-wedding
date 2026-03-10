/* ═══════════════════════════════════════════════════
   JAISURYA & MEAGA — Wedding Site Scripts
   Temple Doors · Marigold Petals · Scroll Magic
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── TIMING CONSTANTS ──────────────────────────
  const PRELOADER_DURATION = 2800;
  const MANDALA_PULSE_DURATION = 1200;
  const DOOR_SHAKE_DURATION = 600;
  const DOOR_GLOW_DURATION = 800;
  const BEAM_DELAY = 200;
  const DOORS_ANIMATION_DURATION = 2200;
  const BURST_DELAY = 600;
  const SPARKLE_DURATION = 3000;
  const CONTENT_REVEAL_DELAY = 600;
  const HERO_STAGGER = 200;
  const GLOW_RING_DELAY = 400;

  // ── DOM REFERENCES ────────────────────────────
  const preloader = document.getElementById('preloader');
  const mandalaLoader = document.querySelector('.mandala-loader');
  const templeDoors = document.getElementById('temple-doors');
  const goldenBurst = document.getElementById('golden-burst');
  const sparklesCanvas = document.getElementById('sparkles-canvas');
  const vignette = document.getElementById('cinematic-vignette');
  const petalsCanvas = document.getElementById('petals-canvas');
  const mainNav = document.getElementById('main-nav');
  const mainContent = document.getElementById('main-content');
  const heroSection = document.getElementById('hero');
  const heroGlowRing = document.getElementById('hero-glow-ring');
  const rsvpForm = document.getElementById('rsvp-form');

  // ═══════════════════════════════════════════════
  // GRAND OPENING SEQUENCE — Cinematic Timeline
  // ═══════════════════════════════════════════════
  function startOpeningSequence() {
    let t = 0;

    // ── Phase 1: Mandala draws itself (already via CSS) ──
    // At the end of preloader, mandala pulses with energy
    t = PRELOADER_DURATION - MANDALA_PULSE_DURATION;
    setTimeout(() => {
      mandalaLoader.classList.add('pulse');
    }, t);

    // ── Phase 2: Preloader fades out ──
    t = PRELOADER_DURATION;
    setTimeout(() => {
      preloader.classList.add('hide');

      // ── Phase 3: Door letters glow ──
      setTimeout(() => {
        templeDoors.classList.add('door-glow-active');

        // ── Phase 4: Doors shake (about to open!) ──
        setTimeout(() => {
          templeDoors.classList.add('door-shake');

          // ── Phase 5: Light beam appears between doors ──
          setTimeout(() => {
            templeDoors.classList.add('beam-active');
            vignette.classList.add('active');

            // ── Phase 6: Doors swing open ──
            setTimeout(() => {
              templeDoors.classList.add('opening');

              // ── Phase 7: Golden burst flash ──
              setTimeout(() => {
                goldenBurst.classList.add('flash');

                // Start sparkles during burst
                sparklesCanvas.classList.add('active');
                initSparkles();
              }, BURST_DELAY);

              // ── Phase 8: Content appears behind doors ──
              setTimeout(() => {
                mainContent.classList.add('visible');
                heroSection.classList.add('cinematic-zoom');
                petalsCanvas.classList.add('active');
                initPetals();

                // ── Phase 9: Hero elements stagger in ──
                setTimeout(() => {
                  // Glow ring expands from center
                  heroGlowRing.classList.add('expand');

                  // Reveal hero text with dramatic stagger
                  revealHeroElements();
                  mainNav.classList.add('visible');

                  // Fade vignette
                  vignette.classList.remove('active');
                  vignette.classList.add('fade-out');

                  // ── Phase 10: Cleanup ──
                  setTimeout(() => {
                    templeDoors.classList.add('hidden');
                    // Fade out sparkles gracefully
                    sparklesCanvas.classList.remove('active');
                    setTimeout(() => {
                      sparklesRunning = false;
                    }, 500);
                  }, 2000);
                }, CONTENT_REVEAL_DELAY);
              }, DOORS_ANIMATION_DURATION - 600);
            }, BEAM_DELAY + 300);
          }, DOOR_SHAKE_DURATION);
        }, DOOR_GLOW_DURATION);
      }, 300);
    }, t);
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
  // SPARKLE PARTICLE SYSTEM — Opening burst
  // ═══════════════════════════════════════════════
  let sparklesRunning = false;
  const sparkles = [];
  let sCtx, sW, sH;

  function initSparkles() {
    sCtx = sparklesCanvas.getContext('2d');
    sW = sparklesCanvas.width = window.innerWidth;
    sH = sparklesCanvas.height = window.innerHeight;
    sparklesRunning = true;

    // Burst: spawn lots of sparkles from center
    const cx = sW / 2;
    const cy = sH / 2;
    for (let i = 0; i < 80; i++) {
      sparkles.push(createSparkle(cx, cy, true));
    }

    // Ambient sparkles from random positions
    for (let i = 0; i < 40; i++) {
      sparkles.push(createSparkle(Math.random() * sW, Math.random() * sH, false));
    }

    animateSparkles();
  }

  function createSparkle(x, y, isBurst) {
    const angle = Math.random() * Math.PI * 2;
    const speed = isBurst ? (2 + Math.random() * 6) : (0.2 + Math.random() * 0.8);
    const colors = [
      'rgba(255, 240, 180, 1)',
      'rgba(232, 197, 71, 1)',
      'rgba(200, 168, 78, 1)',
      'rgba(255, 215, 0, 1)',
      'rgba(255, 255, 220, 1)',
    ];
    return {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (isBurst ? 1 : 0),
      size: isBurst ? (1.5 + Math.random() * 3) : (0.5 + Math.random() * 2),
      life: 1,
      decay: isBurst ? (0.008 + Math.random() * 0.015) : (0.003 + Math.random() * 0.008),
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkleSpeed: 0.05 + Math.random() * 0.1,
      twinklePhase: Math.random() * Math.PI * 2,
      gravity: isBurst ? 0.02 : 0,
      trail: isBurst,
    };
  }

  function animateSparkles() {
    if (!sparklesRunning && sparkles.length === 0) return;

    sCtx.clearRect(0, 0, sW, sH);

    // Ambient spawning
    if (sparklesRunning && sparkles.length < 120 && Math.random() < 0.3) {
      sparkles.push(createSparkle(Math.random() * sW, Math.random() * sH, false));
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += s.gravity;
      s.vx *= 0.99;
      s.vy *= 0.99;
      s.life -= s.decay;
      s.twinklePhase += s.twinkleSpeed;

      if (s.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      const twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase);
      const alpha = s.life * twinkle;

      // Draw glow
      sCtx.save();
      sCtx.globalAlpha = alpha * 0.3;
      sCtx.fillStyle = s.color;
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
      sCtx.fill();

      // Draw core
      sCtx.globalAlpha = alpha;
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      sCtx.fill();

      // Draw cross sparkle for larger particles
      if (s.size > 1.5) {
        sCtx.globalAlpha = alpha * 0.6;
        sCtx.strokeStyle = s.color;
        sCtx.lineWidth = 0.5;
        const len = s.size * 2 * twinkle;
        sCtx.beginPath();
        sCtx.moveTo(s.x - len, s.y);
        sCtx.lineTo(s.x + len, s.y);
        sCtx.moveTo(s.x, s.y - len);
        sCtx.lineTo(s.x, s.y + len);
        sCtx.stroke();
      }

      sCtx.restore();
    }

    requestAnimationFrame(animateSparkles);
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
  // BACKGROUND MUSIC
  // ═══════════════════════════════════════════════
  function initMusic() {
    const audio = document.getElementById('bg-music');
    const toggle = document.getElementById('music-toggle');
    if (!audio || !toggle) return;

    let isPlaying = false;
    let userMuted = false;

    function tryPlay() {
      if (userMuted) return;
      audio.volume = 0.3;
      audio.play().then(() => {
        toggle.classList.add('playing');
        isPlaying = true;
        // Remove all fallback listeners once playing
        removeInteractionListeners();
      }).catch(() => {
        // Autoplay blocked — listeners will retry on interaction
      });
    }

    function onUserInteraction() {
      if (isPlaying || userMuted) return;
      tryPlay();
    }

    function removeInteractionListeners() {
      document.removeEventListener('click', onUserInteraction, true);
      document.removeEventListener('touchstart', onUserInteraction, true);
      document.removeEventListener('scroll', onUserInteraction, true);
      document.removeEventListener('keydown', onUserInteraction, true);
    }

    // Listen for ANY user interaction to start music
    document.addEventListener('click', onUserInteraction, true);
    document.addEventListener('touchstart', onUserInteraction, true);
    document.addEventListener('scroll', onUserInteraction, true);
    document.addEventListener('keydown', onUserInteraction, true);

    // Show toggle early and attempt autoplay immediately
    toggle.classList.add('visible');
    tryPlay();

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        audio.pause();
        toggle.classList.remove('playing');
        isPlaying = false;
        userMuted = true;
        removeInteractionListeners();
      } else {
        userMuted = false;
        audio.volume = 0.3;
        audio.play().then(() => {
          toggle.classList.add('playing');
          isPlaying = true;
        }).catch(() => {});
      }
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
    initMusic();
    initParallax();
  });
})();
