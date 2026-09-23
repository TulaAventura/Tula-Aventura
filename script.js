// ===================== TULA AVENTURA — SCRIPT =====================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Año dinámico en footer ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Navbar: menú móvil (burger) ----
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burgerBtn.classList.toggle('active', isOpen);
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Navbar: sombra al hacer scroll ----
  const navbar = document.getElementById('navbar');
  const onScrollNav = () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 8px 24px -12px rgba(0,0,0,.6)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // ---- Menú por pestañas ----
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${target}`);
      });
    });
  });

  // ---- Scroll reveal (data-aos) via IntersectionObserver ----
  const revealEls = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('aos-in');
          }, (index % 6) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('aos-in'));
  }

  // ---- Smooth scroll offset para anclas (compensa navbar fija) ----
  const navbarHeight = navbar ? navbar.offsetHeight : 74;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
