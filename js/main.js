/* ============================================
   Personal Website — Chaowei Qiu
   Interactive Scripts v2
   Features: cursor glow, reading progress, card
   spotlight, back-to-top, throttled scroll,
   aria-expanded management, reduced-motion support
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initScrollHandlers();
  initMobileNav();
  initFadeInObserver();
  initSkillBars();
  initAbstractToggle();
  initCursorGlow();
  initCardSpotlight();
});

/* --- Typewriter Effect --- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    '计算社会科学研究者',
    '公共政策评估实践者',
    '行为数据分析者',
    'Python 数据分析与自动化开发',
    '粤港澳大湾区研究关注者'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let isWaiting = false;

  function type() {
    const current = phrases[phraseIdx];

    if (isWaiting) {
      setTimeout(() => {
        isWaiting = false;
        isDeleting = true;
        type();
      }, 2000);
      return;
    }

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        isWaiting = true;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 600);
}

/* --- Consolidated Scroll Handlers (rAF throttled) ---
   Combines: nav background, progress bar, back-to-top,
   active nav link — all in one scroll listener.       */
function initScrollHandlers() {
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Nav background
    if (nav) {
      nav.classList.toggle('scrolled', scrollY > 60);
    }

    // Reading progress bar
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }

    // Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    // Active nav link highlighting
    if (sections.length > 0 && navLinks.length > 0) {
      let current = '';
      const scrollPos = scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // Back-to-top click → smooth scroll
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --- Mobile Nav Toggle (CSS class based + aria) --- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function setNav(open) {
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', () => {
    setNav(!links.classList.contains('open'));
  });

  // Close on nav link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setNav(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setNav(false);
    }
  });
}

/* --- Fade-in on scroll (IntersectionObserver) --- */
function initFadeInObserver() {
  const targets = document.querySelectorAll(
    '.glass-card, .section-title, .about-intro, .timeline-item, .project-featured, .contact-intro'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* --- Animate skill bars on scroll --- */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.style.width;
        fill.style.width = '0';
        // Double rAF ensures the browser registers width:0 before animating
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.width = targetWidth;
          });
        });
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => observer.observe(fill));
}

/* --- Abstract expand/collapse (max-height transition + aria) --- */
function initAbstractToggle() {
  const toggle = document.getElementById('abstractToggle');
  const text = document.getElementById('abstractText');
  if (!toggle || !text) return;

  toggle.addEventListener('click', () => {
    const expanded = text.classList.toggle('expanded');
    toggle.textContent = expanded ? '收起 ↑' : '展开全部 ↓';
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
}

/* --- Cursor Glow (rAF + lerp for smooth trailing) --- */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  // Skip on touch devices and reduced-motion users
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const half = 180; // half of glow size (360px)
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let active = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!active) {
      active = true;
      glowX = mouseX;
      glowY = mouseY;
      glow.classList.add('active');
      animate();
    }
  });

  document.addEventListener('mouseleave', () => {
    active = false;
    glow.classList.remove('active');
  });

  function animate() {
    if (!active) return;

    // Linear interpolation for smooth trailing effect
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;

    glow.style.transform = `translate(${glowX - half}px, ${glowY - half}px)`;

    requestAnimationFrame(animate);
  }
}

/* --- Card Spotlight (mousemove → CSS custom properties) --- */
function initCardSpotlight() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}
