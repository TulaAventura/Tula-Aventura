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

  // ---- Carrito de pedidos del menú ----
  const WHATSAPP_NUMBER = '527731174899';
  let cart = [];

  const cartFab = document.getElementById('cartFab');
  const cartFabBadge = document.getElementById('cartFabBadge');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotalRow = document.getElementById('cartTotalRow');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartAddressBlock = document.getElementById('cartAddressBlock');
  const cartAddress = document.getElementById('cartAddress');
  const cartAddressError = document.getElementById('cartAddressError');
  const cartSubmit = document.getElementById('cartSubmit');

  const money = (n) => `$${n.toLocaleString('es-MX')}`;

  function findItem(name, price) {
    return cart.find(i => i.name === name && i.price === price);
  }

  function addToCart(name, price, btn) {
    const existing = findItem(name, price);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    if (btn) {
      btn.classList.add('is-added');
      setTimeout(() => btn.classList.remove('is-added'), 400);
    }
    renderCart();
    openCart();
  }

  function changeQty(name, price, delta) {
    const item = findItem(name, price);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => !(i.name === name && i.price === price));
    }
    renderCart();
  }

  function cartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function cartCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function renderCart() {
    const count = cartCount();

    if (count > 0) {
      cartFab.hidden = false;
      cartFabBadge.textContent = String(count);
    } else {
      cartFab.hidden = true;
    }

    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartEmpty.hidden = false;
      cartTotalRow.hidden = true;
      cartAddressBlock.hidden = true;
      cartSubmit.hidden = true;
      return;
    }

    cartEmpty.hidden = true;
    cartTotalRow.hidden = false;
    cartAddressBlock.hidden = false;
    cartSubmit.hidden = false;

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <span class="cart-item__name">${item.name}</span>
        <div class="cart-item__qty">
          <button type="button" data-action="dec" aria-label="Quitar uno">−</button>
          <span>${item.qty}</span>
          <button type="button" data-action="inc" aria-label="Agregar uno">+</button>
        </div>
        <span class="cart-item__price">${money(item.price * item.qty)}</span>
      `;
      row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.name, item.price, 1));
      row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.name, item.price, -1));
      cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = money(cartTotal());
  }

  function openCart() {
    cartOverlay.classList.add('open');
  }
  function closeCart() {
    cartOverlay.classList.remove('open');
  }

  document.querySelectorAll('.menu__add').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.name, Number(btn.dataset.price), btn);
    });
  });

  if (cartFab) cartFab.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  if (cartAddress) {
    cartAddress.addEventListener('input', () => {
      if (cartAddress.value.trim()) {
        cartAddressError.hidden = true;
      }
    });
  }

  if (cartSubmit) {
    cartSubmit.addEventListener('click', () => {
      const address = cartAddress.value.trim();
      if (!address) {
        cartAddressError.hidden = false;
        cartAddress.focus();
        return;
      }

      const lines = cart.map(i => `• ${i.qty}x ${i.name} — ${money(i.price * i.qty)}`);
      const message =
        `¡Hola! 🏍️🌮 Quiero hacer este pedido a domicilio de Tula Aventura:\n\n` +
        lines.join('\n') +
        `\n\nTotal: ${money(cartTotal())}` +
        `\n\n📍 Dirección de entrega:\n${address}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  renderCart();

});
