/* ====================================================
   S-LIGHT TOWER — Main JavaScript (Vanilla ES6)
   Modules: loader, header, nav, hero slider, scroll-spy,
   animations, counters, filter, lightbox, popup, toast,
   ripple, shared lead-form handler (Google Apps Script API)
   ==================================================== */
(() => {
  'use strict';
   const API_URL = 'https://script.google.com/macros/s/AKfycbyPyfLrF7PDvcbZdD60Ozs8EAdGYg9qv4v_tqGJaC0QFpDtzWfE4MsmiuijkrEUFbkF/exec';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. Page loader ---------- */
  const loader = $('#page-loader');
  const hideLoader = () => loader && loader.classList.add('is-hidden');
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 2000); // max 2s

  /* ---------- 2. Sticky header ---------- */
  const header = $('#site-header');
  const backToTop = $('#back-to-top');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    backToTop.classList.toggle('is-visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 3. Mobile navigation ---------- */
  const navToggle = $('#nav-toggle');
  const mainNav = $('#main-nav');
  const navOverlay = $('#nav-overlay');

  const setNav = (open) => {
    mainNav.classList.toggle('is-open', open);
    navToggle.classList.toggle('is-open', open);
    navOverlay.classList.toggle('is-visible', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  navToggle.addEventListener('click', () => setNav(!mainNav.classList.contains('is-open')));
  navOverlay.addEventListener('click', () => setNav(false));
  $$('.nav-link, .btn-nav-cta', mainNav).forEach((el) =>
    el.addEventListener('click', () => setNav(false))
  );

  /* ---------- 4. Scroll spy ---------- */
  const navLinks = $$('.nav-link');
  const spyTargets = navLinks
    .map((link) => $(link.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === id));
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  spyTargets.forEach((t) => spy.observe(t));

  /* ---------- 5. Hero slider ---------- */
  const slides = $$('.hero-slide');
  const dotsWrap = $('.hero-dots');
  let heroIndex = 0;
  let heroTimer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Chuyển đến ảnh ${i + 1}`);
    dot.addEventListener('click', () => goSlide(i, true));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goSlide(i, manual = false) {
    heroIndex = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === heroIndex));
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === heroIndex));
    if (manual) restartAutoplay();
  }

  const startAutoplay = () => { heroTimer = setInterval(() => goSlide(heroIndex + 1), 6000); };
  const stopAutoplay = () => clearInterval(heroTimer);
  const restartAutoplay = () => { stopAutoplay(); startAutoplay(); };

  $('.js-hero-prev').addEventListener('click', () => goSlide(heroIndex - 1, true));
  $('.js-hero-next').addEventListener('click', () => goSlide(heroIndex + 1, true));

  const hero = $('#hero-section');
  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);

  // Swipe on mobile
  let touchX = 0;
  hero.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 55) goSlide(heroIndex + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  startAutoplay();

  /* ---------- 6. Scroll animations ---------- */
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          animObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$('[data-animate]').forEach((el) => animObserver.observe(el));

  /* ---------- 7. Counter animation ---------- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1600;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 }
  );
  $$('.counter').forEach((el) => counterObserver.observe(el));

  /* ---------- 8. Floorplan filter ---------- */
  const filterBtns = $$('.filter-btn');
  const floorItems = $$('.floorplan-item');
  filterBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      const f = btn.dataset.filter;
      floorItems.forEach((item) => {
        item.classList.toggle('is-filtered', f !== 'all' && item.dataset.category !== f);
      });
    })
  );

  /* ---------- 9. Lightbox ---------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lightbox-img');
  const lbCaption = $('#lightbox-caption');
  const lbItems = $$('.js-lightbox-item');
  let lbIndex = 0;
  let lbLastFocus = null;

  function openLightbox(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    const img = $('img', item);
    lbImg.src = item.dataset.full || img.src;
    lbImg.alt = img.alt;
    const cap = $('figcaption', item);
    lbCaption.textContent = cap ? cap.textContent : img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbLastFocus = document.activeElement;
    $('.lightbox-close').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lbLastFocus) lbLastFocus.focus();
  }

  lbItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });
  $('.lightbox-close').addEventListener('click', closeLightbox);
  $('.lightbox-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
  $('.lightbox-next').addEventListener('click', () => openLightbox(lbIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Lightbox swipe
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', (e) => { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(dx) > 55) openLightbox(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- 10. Popup form ---------- */
  const popup = $('#popup-form');
  let popupLastFocus = null;

  function openPopup() {
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    popupLastFocus = document.activeElement;
    const firstInput = $('input', popup);
    if (firstInput) firstInput.focus();
  }
  function closePopup() {
    popup.hidden = true;
    document.body.style.overflow = '';
    if (popupLastFocus) popupLastFocus.focus();
  }
  $$('.js-open-popup').forEach((btn) => btn.addEventListener('click', openPopup));
  $$('.js-close-popup').forEach((el) => el.addEventListener('click', closePopup));

  // Global Escape handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!lightbox.hidden) closeLightbox();
      if (!popup.hidden) closePopup();
      if (mainNav.classList.contains('is-open')) setNav(false);
    }
    if (!lightbox.hidden) {
      if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
    }
  });

  /* ---------- 11. Toast ---------- */
  const toast = $('#toast');
  let toastTimer = null;
  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast is-visible is-${type}`;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => { toast.hidden = true; }, 400);
    }, 4500);
  }

  /* ---------- 12. Button ripple ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  /* ---------- 13. Shared lead-form handler ---------- */
  const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(input, message) {
    const errEl = input.closest('.form-group').querySelector('.field-error');
    input.classList.toggle('is-invalid', Boolean(message));
    if (errEl) errEl.textContent = message || '';
  }

  function validateForm(form) {
    let ok = true;
    const name = form.elements.fullName;
    const phone = form.elements.phone;
    const email = form.elements.email;

    name.value = name.value.trim();
    phone.value = phone.value.replace(/[\s.-]/g, '');
    if (email) email.value = email.value.trim();

    if (!name.value) { setFieldError(name, 'Vui lòng nhập họ và tên.'); ok = false; }
    else setFieldError(name, '');

    if (!phone.value) { setFieldError(phone, 'Vui lòng nhập số điện thoại.'); ok = false; }
    else if (!PHONE_RE.test(phone.value)) { setFieldError(phone, 'Số điện thoại Việt Nam chưa hợp lệ.'); ok = false; }
    else setFieldError(phone, '');

    if (email && email.value && !EMAIL_RE.test(email.value)) {
      setFieldError(email, 'Email chưa đúng định dạng.'); ok = false;
    } else if (email) setFieldError(email, '');

    return ok;
  }

  async function submitLead(form) {
    const payload = {
      fullName: form.elements.fullName.value,
      phone: form.elements.phone.value,
      email: form.elements.email ? form.elements.email.value : '',
      need: form.elements.need ? form.elements.need.value : '',
      source: 'Landing Page',
      userAgent: navigator.userAgent
    };
    // Google Apps Script does not return CORS headers → use no-cors (opaque response = accepted)
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  $$('.js-lead-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const btn = $('.btn-submit', form);
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Đang gửi...';

      try {
        await submitLead(form);
        showToast('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.', 'success');
        form.reset();
        if (!popup.hidden) closePopup();
      } catch (err) {
        showToast('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại hoặc gọi 0372 165 731.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    });

    // Clear field error while typing
    $$('input', form).forEach((input) =>
      input.addEventListener('input', () => setFieldError(input, ''))
    );
  });
})();
