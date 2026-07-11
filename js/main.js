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
  initCitationFormat();
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

/* --- Citation format dropdown ---
   The menu is fixed-positioned because the publication card clips overflow.
   Use viewport coordinates only; adding scrollY places it off-screen. */
function initCitationFormat() {
  const btn = document.getElementById('citeFormatBtn');
  const label = document.getElementById('citeFormatLabel');
  const cite = document.getElementById('citeText');
  const copy = document.getElementById('citeCopyBtn');
  if (!btn || !cite) return;

  const formats = {
    gbt: {
      label: 'GB/T 7714',
      text: '李嫣, 傅承哲, 邱超伟. 深港跨境通勤绿色交通流动性的影响因素研究：以高铁"灵活行"政策为例[J]. 全球ESG创新学报, 2026(1): 总第1期.'
    },
    apa: {
      label: 'APA 7',
      text: 'Li, Y., Fu, C., & Qiu, C. (2026). Factors influencing green transport mobility in Shenzhen-Hong Kong cross-border commuting: Evidence from the high-speed rail "Flexible Pass" policy. 全球ESG创新学报, (1).'
    },
    mla: {
      label: 'MLA 9',
      text: 'Li, Yan, Chengzhe Fu, and Chaowei Qiu. "Factors Influencing Green Transport Mobility in Shenzhen-Hong Kong Cross-Border Commuting: Evidence from the High-Speed Rail \'Flexible Pass\' Policy." 全球ESG创新学报, no. 1, 2026.'
    },
    bibtex: {
      label: 'BibTeX',
      text: '@article{li2026greenmobility,\n  title = {Factors Influencing Green Transport Mobility in Shenzhen-Hong Kong Cross-border Commuting: Evidence from the High-speed Rail "Flexible Pass" Policy},\n  author = {Li, Yan and Fu, Chengzhe and Qiu, Chaowei},\n  journal = {全球ESG创新学报},\n  year = {2026},\n  number = {1}\n}'
    }
  };

  let current = 'gbt';
  const menu = document.createElement('ul');
  menu.id = 'citeFormatMenu';
  menu.className = 'cite-format-dropdown';
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('aria-label', '选择引用格式');
  menu.hidden = true;

  Object.entries(formats).forEach(([key, item]) => {
    const option = document.createElement('li');
    option.className = 'cite-format-option';
    option.setAttribute('role', 'option');
    option.setAttribute('tabindex', '-1');
    option.setAttribute('data-fmt', key);
    option.textContent = item.label;
    menu.appendChild(option);
  });

  document.body.appendChild(menu);

  const options = Array.from(menu.querySelectorAll('.cite-format-option'));

  function syncActive() {
    options.forEach(option => {
      const isActive = option.dataset.fmt === current;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function placeMenu() {
    const rect = btn.getBoundingClientRect();
    const menuWidth = Math.max(176, rect.width);
    const margin = 12;
    const left = Math.min(
      Math.max(margin, rect.right - menuWidth),
      window.innerWidth - menuWidth - margin
    );

    menu.style.minWidth = `${menuWidth}px`;
    menu.style.top = `${rect.bottom + 6}px`;
    menu.style.left = `${left}px`;
  }

  function showMenu() {
    placeMenu();
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    syncActive();
  }

  function hideMenu() {
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  function chooseFormat(format) {
    if (!formats[format]) return;
    current = format;
    cite.textContent = formats[format].text;
    if (label) label.textContent = formats[format].label;
    syncActive();
    hideMenu();
    btn.focus();
  }

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (menu.hidden) showMenu();
    else hideMenu();
  });

  btn.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    showMenu();
    const activeOption = options.find(option => option.dataset.fmt === current) || options[0];
    activeOption.focus();
  });

  menu.addEventListener('click', (event) => {
    event.stopPropagation();
    const option = event.target.closest('.cite-format-option');
    if (option) chooseFormat(option.dataset.fmt);
  });

  menu.addEventListener('keydown', (event) => {
    const index = options.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      hideMenu();
      btn.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = document.activeElement.closest('.cite-format-option');
      if (option) chooseFormat(option.dataset.fmt);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const next = event.key === 'ArrowDown'
      ? (index + 1) % options.length
      : (index - 1 + options.length) % options.length;
    options[next].focus();
  });

  document.addEventListener('click', hideMenu);
  window.addEventListener('scroll', () => {
    if (!menu.hidden) placeMenu();
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!menu.hidden) placeMenu();
  });

  if (!copy) return;

  function copyFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }

  function showCopyState(message, success = true) {
    const span = copy.querySelector('span');
    copy.classList.toggle('copied', success);
    copy.classList.toggle('copy-failed', !success);
    if (span) span.textContent = message;
    window.setTimeout(() => {
      copy.classList.remove('copied', 'copy-failed');
      if (span) span.textContent = '复制';
    }, 1800);
  }

  copy.addEventListener('click', async () => {
    const text = cite.textContent.trim();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!copyFallback(text)) {
        throw new Error('copy command failed');
      }
      showCopyState('已复制');
    } catch (error) {
      showCopyState('复制失败', false);
    }
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

  function syncIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (iconLight) iconLight.style.display = isDark ? 'none' : '';
    if (iconDark) iconDark.style.display = isDark ? '' : 'none';
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === theme) { syncIcon(); return; }
    html.classList.add('theme-transition');
    html.setAttribute('data-theme', theme);
    syncIcon();
    setTimeout(() => html.classList.remove('theme-transition'), 220);
  }

  function resolveTheme() {
    let stored = 'system';
    try {
      stored = localStorage.getItem('theme') || 'system';
    } catch (error) {
      stored = 'system';
    }
    if (stored === 'light') return 'light';
    if (stored === 'dark')  return 'dark';
    return mq.matches ? 'dark' : 'light';
  }

  // Cycle: system → light → dark → system
  toggle.addEventListener('click', () => {
    let current = 'system';
    try {
      current = localStorage.getItem('theme') || 'system';
    } catch (error) {
      current = 'system';
    }
    const next = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      // Ignore storage failures; the visible theme still changes for this page.
    }
    applyTheme(next === 'system' ? (mq.matches ? 'dark' : 'light') : next);
  });

  mq.addEventListener('change', () => {
    let stored = 'system';
    try {
      stored = localStorage.getItem('theme') || 'system';
    } catch (error) {
      stored = 'system';
    }
    if (stored === 'system') {
      applyTheme(mq.matches ? 'dark' : 'light');
    }
  });

  // On load: theme already set by inline <script>. Only sync icon, no re-apply.
  syncIcon();
}
