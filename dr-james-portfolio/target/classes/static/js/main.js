/* =====================================================================
   MAIN.JS — site interactivity (no backend calls, pure front-end)
   Sections: 1.Header scroll state  2.Mobile nav toggle
   3.Scroll-reveal (IntersectionObserver)  4.FAQ accordion
   5.Testimonial slider  6.Fake form feedback  7.Smooth anchor scroll
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. HEADER SCROLL STATE ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- 3. SCROLL-REVEAL ---------- */
  const revealTargets = document.querySelectorAll('[data-animate], [data-animate-stagger]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- 4. FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!question || !answer) return;
    // set initial max-height for open item(s) marked in HTML
    if (item.classList.contains('is-open')) answer.style.maxHeight = answer.scrollHeight + 'px';

    question.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('is-open');
        const a = other.querySelector('.faq-a');
        if (a) a.style.maxHeight = null;
      });
      if (willOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- 5. TESTIMONIAL SLIDER ---------- */
  const track = document.querySelector('.testimonial-track');
  if (track) {
    const cards = Array.from(track.children);
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let index = 0;

    const visibleCount = () => window.innerWidth <= 720 ? 1 : 3;
    const maxIndex = () => Math.max(0, cards.length - visibleCount());

    const update = () => {
      const gap = 24;
      const cardWidth = cards[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex();
    };

    prevBtn && prevBtn.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    nextBtn && nextBtn.addEventListener('click', () => { index = Math.min(maxIndex(), index + 1); update(); });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 6. FAKE FORM FEEDBACK (frontend only, no backend yet) ---------- */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], button');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.disabled = true;
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; form.reset(); }, 1600);
    });
  });

  /* ---------- 7. "See All / Show More" playful stub buttons ---------- */
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      document.querySelectorAll('.blog-card.is-hidden').forEach((card, i) => {
        setTimeout(() => card.classList.remove('is-hidden'), i * 80);
      });
      loadMoreBtn.remove();
    });
  }
});
