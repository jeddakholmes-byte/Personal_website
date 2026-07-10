/* ============================================
   Personal Website — Chaowei Qiu
   Interactive Scripts v2
   Features: cursor glow, reading progress, card
   spotlight, back-to-top, throttled scroll,
   aria-expanded management, reduced-motion support
   ============================================ */

/* --- Prevent unwanted scroll restoration on mobile ---
   Keep hash links usable: only reset restoration behavior, do not force a
   top scroll when someone opens a specific section directly. */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initScrollHandlers();
  initSmoothScroll();
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

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = '计算社会科学与公共政策评估';
    return;
  }

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

/* --- Smooth Scroll for Anchor Links ---
   Replaces CSS scroll-behavior:smooth (removed to prevent
   unwanted auto-scroll from browser scroll restoration).
   Only applies to in-page hash links, not external URLs. */
function initSmoothScroll() {
  const navOffset = 70;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || !href) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
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

  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (links.contains(e.target) || toggle.contains(e.target)) return;
    setNav(false);
  });
}

/* --- Fade-in on scroll (IntersectionObserver) ---
   HCI principles applied:
   - Initial viewport elements stay visible (no flash of invisible content)
   - Reduced-motion users skip animation entirely
   - Elements below fold get a subtle, fast fade-in */
function initFadeInObserver() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.glass-card, .section-title, .about-intro, .timeline-item, .project-featured, .contact-intro'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  targets.forEach(el => {
    // Elements already in the initial viewport stay visible — no animation
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    el.classList.add('fade-in');
    observer.observe(el);
  });
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

/* --- Theme Switching ---
   Three-way: system (default), light, dark
   Preference stored in localStorage key 'theme'
   Values: 'system' | 'light' | 'dark'
   FOUC prevented by inline <script> in <head>       */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const iconLight = document.getElementById('themeIconLight');
  const iconDark = document.getElementById('themeIconDark');
  if (!toggle) return;

  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  function getResolvedTheme() {
    const stored = localStorage.getItem('theme') || 'system';
    if (stored === 'light') return 'light';
    if (stored === 'dark') return 'dark';
    return mq.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    // Brief transition class for smooth switch
    html.classList.add('theme-transition');
    html.setAttribute('data-theme', theme);
    setTimeout(() => html.classList.remove('theme-transition'), 320);

    // Toggle icon
    const isDark = theme === 'dark';
    if (iconLight) iconLight.style.display = isDark ? 'none' : '';
    if (iconDark) iconDark.style.display = isDark ? '' : 'none';
  }

  function syncTheme() {
    const stored = localStorage.getItem('theme') || 'system';
    if (stored === 'light') { applyTheme('light'); return; }
    if (stored === 'dark')  { applyTheme('dark');  return; }
    // system — follow OS
    applyTheme(mq.matches ? 'dark' : 'light');
  }

  // Cycle: system → light → dark → system
  toggle.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'system';
    const next = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
    localStorage.setItem('theme', next);

    if (next === 'system') {
      applyTheme(mq.matches ? 'dark' : 'light');
    } else {
      applyTheme(next);
    }
  });

  // Listen for OS theme changes (only when in system mode)
  mq.addEventListener('change', () => {
    const stored = localStorage.getItem('theme') || 'system';
    if (stored === 'system') applyTheme(mq.matches ? 'dark' : 'light');
  });

  // Sync on load (already done by inline script, but ensure icon is correct)
  syncTheme();
}
