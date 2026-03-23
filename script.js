const contactEmail = 'yaroslava.palkina@yandex.ru';

const products = [
  {
    id: 'cucumber-premium',
    name: 'Огурцы хрустящие',
    category: 'Огурцы',
    price: 280,
    unit: 'за 1 кг',
    description: 'Плотные, сочные, аккуратной калибровки. Идеальны для салатов и свежей подачи.',
    image: 'assets/images/hero-basket.jpg',
    badge: 'Хит сезона'
  },
  {
    id: 'tomatoes-vine',
    name: 'Томаты на ветке',
    category: 'Томаты',
    price: 340,
    unit: 'за 1 кг',
    description: 'Сладкие, мясистые и яркие. Отлично подходят для домашней кухни и подачи на стол.',
    image: 'assets/images/harvest-pick.jpg',
    badge: 'Сбор сегодня'
  },
  {
    id: 'greens-mix',
    name: 'Зелень микс',
    category: 'Зелень',
    price: 180,
    unit: 'за набор',
    description: 'Укроп, петрушка, листовой салат и свежие сезонные добавки по наличию.',
    image: 'assets/images/watering.jpg',
    badge: 'Всегда свежо'
  },
  {
    id: 'farm-box-mini',
    name: 'Мини-корзина',
    category: 'Наборы',
    price: 790,
    unit: 'за коробку',
    description: 'Компактный набор из огурцов, томатов и зелени для пары или небольшой семьи.',
    image: 'assets/images/packing.jpg',
    badge: 'Готовый набор'
  },
  {
    id: 'farm-box-family',
    name: 'Семейная корзина',
    category: 'Наборы',
    price: 1550,
    unit: 'за коробку',
    description: 'Основной фермерский бокс на несколько дней: овощи, зелень и сезонный сюрприз.',
    image: 'assets/images/hat-fork.jpg',
    badge: 'Рекомендуем'
  },
  {
    id: 'seasonal-peppers',
    name: 'Сезонный набор овощей',
    category: 'Овощи',
    price: 520,
    unit: 'за набор',
    description: 'Томаты, огурцы, перец и другие культуры в зависимости от недели сбора.',
    image: 'assets/images/tractor.jpg',
    badge: 'Ограниченная партия'
  }
];

const filters = ['Все', 'Огурцы', 'Томаты', 'Зелень', 'Овощи', 'Наборы'];
let activeFilter = 'Все';
let cart = JSON.parse(localStorage.getItem('freshHarvestCart') || '{}');

const plannerPresets = {
  1: {
    title: 'Мини-корзина',
    price: '790 ₽',
    description: 'Подходит для одного человека или пары на 2–3 дня.',
    items: ['1 кг огурцов', '1 кг томатов', '1 набор зелени']
  },
  2: {
    title: 'Базовая корзина',
    price: '1 150 ₽',
    description: 'Удобный стартовый набор для небольшой семьи.',
    items: ['1.5 кг огурцов', '1.5 кг томатов', '1 набор зелени', 'сезонный овощной микс']
  },
  3: {
    title: 'Семейная корзина',
    price: '1 550 ₽',
    description: 'Идеально для кухни на несколько дней: огурцы, томаты, зелень и сезонные овощи.',
    items: ['2 кг огурцов', '2 кг томатов', '2 набора зелени', '1 овощной микс']
  },
  4: {
    title: 'Большая семейная корзина',
    price: '1 980 ₽',
    description: 'Для активной кухни и регулярных салатов на всю неделю.',
    items: ['2.5 кг огурцов', '2.5 кг томатов', '2 набора зелени', '2 сезонных овощных микса']
  },
  5: {
    title: 'Корзина выходного дня',
    price: '2 450 ₽',
    description: 'Усиленная коробка для большой семьи или мини-кафе.',
    items: ['3 кг огурцов', '3 кг томатов', '3 набора зелени', '2 сезонных набора', 'доп. зелень']
  },
  6: {
    title: 'Фермерский максимум',
    price: '2 990 ₽',
    description: 'Максимальная сезонная коробка с акцентом на свежесть и запас на неделю.',
    items: ['4 кг огурцов', '4 кг томатов', '3 набора зелени', '2 сезонных набора', 'подарочный овощ дня']
  }
};

const productGrid = document.getElementById('productGrid');
const filtersWrap = document.getElementById('filters');
const cartFab = document.getElementById('cartFab');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const backdrop = document.getElementById('backdrop');
const closeCart = document.getElementById('closeCart');
const clearCart = document.getElementById('clearCart');
const fillOrder = document.getElementById('fillOrder');
const orderSummary = document.getElementById('orderSummary');
const scrollCucumber = document.getElementById('scrollCucumber');
const vineTrack = document.getElementById('vineTrack');
const familyRange = document.getElementById('familyRange');
const familyCount = document.getElementById('familyCount');
const boxName = document.getElementById('boxName');
const boxDescription = document.getElementById('boxDescription');
const boxList = document.getElementById('boxList');
const boxPrice = document.getElementById('boxPrice');
const copyOrder = document.getElementById('copyOrder');
const orderForm = document.getElementById('orderForm');

function formatPrice(value) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}

function renderFilters() {
  filtersWrap.innerHTML = filters
    .map((filter) => `
      <button class="filter-btn ${filter === activeFilter ? 'is-active' : ''}" data-filter="${filter}">${filter}</button>
    `)
    .join('');

  filtersWrap.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  const filtered = activeFilter === 'Все'
    ? products
    : products.filter((item) => item.category === activeFilter);

  productGrid.innerHTML = filtered.map((item) => `
    <article class="product-card reveal is-visible">
      <div class="product-media">
        <img src="${item.image}" alt="${item.name}" />
        <span class="product-tag">${item.badge}</span>
      </div>
      <div class="product-content">
        <p class="eyebrow">${item.category}</p>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="product-meta">
          <div>
            <div class="product-price">${formatPrice(item.price)}</div>
            <div class="product-unit">${item.unit}</div>
          </div>
          <button class="qty-btn" data-quick-add="${item.id}" aria-label="Быстро добавить">＋</button>
        </div>
        <div class="product-actions">
          <button class="add-btn" data-add="${item.id}">Добавить в корзину</button>
          <a class="secondary-btn" href="#order">Заказать</a>
        </div>
      </div>
    </article>
  `).join('');

  productGrid.querySelectorAll('[data-add], [data-quick-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.add || button.dataset.quickAdd));
  });
}

function getCartItems() {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((item) => item.id === id);
      if (!product) return null;
      return {
        ...product,
        qty,
        total: product.price * qty
      };
    })
    .filter(Boolean);
}

function saveCart() {
  localStorage.setItem('freshHarvestCart', JSON.stringify(cart));
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openCart();
}

function updateCart(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function clearCartState() {
  cart = {};
  saveCart();
  renderCart();
}

function renderCart() {
  const items = getCartItems();
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

  cartCount.textContent = totalCount;
  cartTotal.textContent = formatPrice(totalPrice);

  if (!items.length) {
    cartItems.innerHTML = '<div class="empty-cart">Корзина пока пустая. Добавьте овощи из каталога.</div>';
    return;
  }

  cartItems.innerHTML = items.map((item) => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong>
        <small>${formatPrice(item.price)} × ${item.qty}</small>
      </div>
      <div class="cart-row__controls">
        <button class="qty-btn" data-delta="-1" data-id="${item.id}">−</button>
        <strong>${item.qty}</strong>
        <button class="qty-btn" data-delta="1" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join('');

  cartItems.querySelectorAll('[data-delta]').forEach((button) => {
    button.addEventListener('click', () => updateCart(button.dataset.id, Number(button.dataset.delta)));
  });
}

function buildOrderSummary() {
  const items = getCartItems();
  if (!items.length) return '';
  const lines = items.map((item) => `• ${item.name} — ${item.qty} шт. / ${formatPrice(item.total)}`);
  const total = items.reduce((sum, item) => sum + item.total, 0);
  return `${lines.join('\n')}\n\nИтого: ${formatPrice(total)}`;
}

function openCart() {
  cartDrawer.classList.add('is-open');
  backdrop.classList.add('is-visible');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('is-open');
  backdrop.classList.remove('is-visible');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function setPlanner(value) {
  const preset = plannerPresets[value];
  familyCount.textContent = `${value} ${value === '1' ? 'человек' : value < 5 ? 'человека' : 'человек'}`;
  boxName.textContent = preset.title;
  boxDescription.textContent = preset.description;
  boxPrice.textContent = preset.price;
  boxList.innerHTML = preset.items.map((item) => `<li>${item}</li>`).join('');
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable > 0 ? window.scrollY / scrollable : 0;
}

function scrollPageToProgress(progress, smooth = false) {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const safeProgress = clamp(progress, 0, 1);
  window.scrollTo({
    top: safeProgress * scrollable,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function updateScrollCucumber() {
  if (!vineTrack || !scrollCucumber) return;
  const progress = getScrollProgress();
  const maxOffset = Math.max(vineTrack.clientHeight - scrollCucumber.offsetHeight, 0);
  scrollCucumber.style.transform = `translate(-50%, ${progress * maxOffset}px)`;
}

function getProgressFromTrackEvent(event) {
  const rect = vineTrack.getBoundingClientRect();
  const offset = event.clientY - rect.top - scrollCucumber.offsetHeight / 2;
  const maxOffset = Math.max(rect.height - scrollCucumber.offsetHeight, 1);
  return clamp(offset / maxOffset, 0, 1);
}

function initScrollVine() {
  if (!vineTrack || !scrollCucumber) return;

  let dragging = false;

  const handlePointerMove = (event) => {
    if (!dragging) return;
    scrollPageToProgress(getProgressFromTrackEvent(event));
  };

  vineTrack.addEventListener('click', (event) => {
    scrollPageToProgress(getProgressFromTrackEvent(event), true);
  });

  vineTrack.addEventListener('pointerdown', (event) => {
    dragging = true;
    vineTrack.setPointerCapture?.(event.pointerId);
    scrollPageToProgress(getProgressFromTrackEvent(event));
    event.preventDefault();
  });

  vineTrack.addEventListener('pointermove', handlePointerMove);
  vineTrack.addEventListener('pointerup', (event) => {
    dragging = false;
    vineTrack.releasePointerCapture?.(event.pointerId);
  });
  vineTrack.addEventListener('pointercancel', () => {
    dragging = false;
  });

  vineTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      scrollPageToProgress(getScrollProgress() + 0.08, true);
    }
    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      scrollPageToProgress(getScrollProgress() - 0.08, true);
    }
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}

function initParallax() {
  const nodes = document.querySelectorAll('[data-parallax]');
  const tick = () => {
    const scrolled = window.scrollY;
    nodes.forEach((node) => {
      const speed = Number(node.dataset.parallax || 0);
      node.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
    });
  };
  tick();
  window.addEventListener('scroll', tick, { passive: true });
}

function initCursor() {
  if (window.matchMedia('(pointer: fine)').matches) {
    document.body.classList.add('cursor-enabled');
    const cursor = document.querySelector('.cursor-cucumber');
    let x = -100;
    let y = -100;
    let currentX = x;
    let currentY = y;

    window.addEventListener('mousemove', (event) => {
      x = event.clientX;
      y = event.clientY;
    });

    const animate = () => {
      currentX += (x - currentX) * 0.18;
      currentY += (y - currentY) * 0.18;
      cursor.style.transform = `translate(${currentX - 28}px, ${currentY - 24}px)`;
      requestAnimationFrame(animate);
    };
    animate();
  }
}

cartFab.addEventListener('click', openCart);
cartFab.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openCart();
  }
});
closeCart.addEventListener('click', closeCartDrawer);
backdrop.addEventListener('click', closeCartDrawer);
clearCart.addEventListener('click', clearCartState);
fillOrder.addEventListener('click', () => {
  orderSummary.value = buildOrderSummary();
  closeCartDrawer();
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
});

familyRange.addEventListener('input', (event) => setPlanner(event.target.value));
copyOrder.addEventListener('click', async () => {
  const payload = buildRequestText();
  try {
    await navigator.clipboard.writeText(payload);
    copyOrder.textContent = 'Скопировано';
    setTimeout(() => copyOrder.textContent = 'Скопировать текст заявки', 1400);
  } catch {
    alert('Не удалось скопировать текст. Выделите его вручную из формы.');
  }
});

function buildRequestText() {
  return [
    `Имя: ${document.getElementById('customerName').value || '—'}`,
    `Контакт: ${document.getElementById('customerContact').value || '—'}`,
    `Адрес: ${document.getElementById('customerAddress').value || '—'}`,
    '',
    'Заказ:',
    document.getElementById('orderSummary').value || buildOrderSummary() || '—',
    '',
    'Комментарий:',
    document.getElementById('customerNote').value || '—'
  ].join('\n');
}

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!orderSummary.value.trim()) {
    orderSummary.value = buildOrderSummary();
  }
  const body = encodeURIComponent(buildRequestText());
  const subject = encodeURIComponent('Новый заказ с сайта Тепличный урожай');
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
});

window.addEventListener('scroll', updateScrollCucumber, { passive: true });
window.addEventListener('resize', updateScrollCucumber);

document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderProducts();
  renderCart();
  setPlanner(familyRange.value);
  initReveal();
  initParallax();
  initCursor();
  initScrollVine();
  updateScrollCucumber();
});
