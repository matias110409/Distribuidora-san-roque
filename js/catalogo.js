/* ==========================================================================
   Distribuidora San Roque S.R.L. - Lógica de Catálogo y Pantalla de Pedidos (catalogo.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('product-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const totalProductsCountEl = document.getElementById('total-products-count');
  
  // Elementos del Carrito Drawer
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const openCartBtns = document.querySelectorAll('.open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartDrawerEmpty = document.getElementById('cart-drawer-empty');
  const cartDrawerFooter = document.getElementById('cart-drawer-footer');
  const cartTotalQtyEl = document.getElementById('cart-total-qty');
  const btnSendWhatsappOrder = document.getElementById('btn-send-whatsapp-order');
  const btnClearCart = document.getElementById('btn-clear-cart');
  const customerNameInput = document.getElementById('customer-name');
  const customerNotesInput = document.getElementById('customer-notes');

  // Elementos del Modal
  const modal = document.getElementById('product-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImage = document.getElementById('modal-image');
  const modalBrand = document.getElementById('modal-brand');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalPresentation = document.getElementById('modal-presentation');
  const modalDescription = document.getElementById('modal-description');
  const modalQtyInput = document.getElementById('modal-qty-input');
  const modalQtyMinus = document.getElementById('modal-qty-minus');
  const modalQtyPlus = document.getElementById('modal-qty-plus');
  const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
  const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');

  // Estado local
  let currentCategory = 'all';
  let searchQuery = '';
  let activeModalProductId = null;

  // Leer parámetro 'cat' de la URL si existe (ej. catalogo.html?cat=margarinas)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    currentCategory = catParam;
    filterButtons.forEach(btn => {
      if (btn.dataset.category === catParam) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Mapeo amigable de categorías
  function formatCategory(cat) {
    const map = {
      'premezclas': 'Premezclas y Harinas',
      'margarinas': 'Margarinas y Grasas',
      'reposteria': 'Repostería y Rellenos',
      'lacteos': 'Lácteos y Cremas',
      'golosinas': 'Frutos Secos y Golosinas'
    };
    return map[cat] || cat;
  }

  // Renderizar Productos
  function renderProducts() {
    if (!productsGrid || typeof PRODUCTS === 'undefined') return;

    const query = searchQuery.toLowerCase().trim();
    const filtered = PRODUCTS.filter(p => {
      const matchCategory = currentCategory === 'all' || p.category === currentCategory;
      const matchSearch = query === '' || 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));
      
      return matchCategory && matchSearch;
    });

    if (totalProductsCountEl) {
      totalProductsCountEl.textContent = `${filtered.length} productos disponibles`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products-found animate-fade-up">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
          <h3>No encontramos insumos con ese criterio</h3>
          <p>Intenta con otros términos como "Calsa", "Margarina", "Brownies" o restablece los filtros.</p>
          <button class="btn btn-primary btn-sm" id="btn-reset-filters" style="margin-top: 1rem;">
            Ver Todos los Insumos
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          filterButtons.forEach(b => {
            if (b.dataset.category === 'all') b.classList.add('active');
            else b.classList.remove('active');
          });
          renderProducts();
        });
      }
      return;
    }

    productsGrid.innerHTML = filtered.map(p => {
      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-image-container" onclick="window.openProductModal('${p.id}')">
            <span class="product-badge-brand">${p.brand}</span>
            <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
            <span class="product-badge-presentation">${p.presentation}</span>
          </div>
          <div class="product-body">
            <span class="product-category-tag">${formatCategory(p.category)}</span>
            <h3 class="product-title" onclick="window.openProductModal('${p.id}')">${p.name}</h3>
            <p class="product-description">${p.description}</p>
            
            <!-- Selector de Cantidad para Pedido -->
            <div class="product-order-controls">
              <div class="qty-selector" data-id="${p.id}">
                <button type="button" class="qty-btn qty-minus" onclick="event.stopPropagation(); window.changeQty(this, -1)" aria-label="Restar">-</button>
                <input type="number" class="qty-input" value="1" min="1" max="999" aria-label="Cantidad" onchange="let v=parseInt(this.value,10); if(isNaN(v)||v<1) this.value=1;">
                <button type="button" class="qty-btn qty-plus" onclick="event.stopPropagation(); window.changeQty(this, 1)" aria-label="Sumar">+</button>
              </div>
              <button class="btn btn-primary btn-add-cart" onclick="event.stopPropagation(); window.addProductToCart('${p.id}', this)">
                <span>🛒 Agregar</span>
              </button>
            </div>

            <div class="product-actions" style="margin-top: 0.6rem;">
              <button class="btn btn-outline btn-sm" style="width: 100%; font-size: 0.82rem;" onclick="window.openProductModal('${p.id}')">
                Ver Ficha Completa
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Función global para cambiar cantidad en los selectores de las tarjetas
  window.changeQty = function(buttonEl, delta) {
    const selector = buttonEl.closest('.qty-selector');
    const input = selector.querySelector('.qty-input');
    let val = parseInt(input.value, 10) || 1;
    val = Math.max(1, val + delta);
    input.value = val;
  };

  // Función global para agregar producto al carrito desde la tarjeta
  window.addProductToCart = function(productId, buttonEl) {
    if (!buttonEl) return;
    const card = buttonEl.closest('.product-card');
    const qtyInput = card ? card.querySelector('.qty-input') : null;
    const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

    if (!window.cartInstance && typeof ShoppingCart === 'function') {
      window.cartInstance = new ShoppingCart();
    }

    if (window.cartInstance) {
      window.cartInstance.addToCart(productId, qty);

      // Efecto visual claro en el botón
      const originalHTML = buttonEl.innerHTML;
      buttonEl.innerHTML = '<span>✅ Agregado!</span>';
      buttonEl.classList.add('btn-added-success');
      buttonEl.disabled = true;

      setTimeout(() => {
        buttonEl.innerHTML = originalHTML;
        buttonEl.classList.remove('btn-added-success');
        buttonEl.disabled = false;
      }, 1400);
    }
  };

  // Renderizar Carrito en el Drawer
  function renderCartDrawer(cart) {
    if (!cartItemsList) return;

    if (!cart || cart.length === 0) {
      cartItemsList.innerHTML = '';
      if (cartDrawerEmpty) cartDrawerEmpty.style.display = 'block';
      if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
      if (cartTotalQtyEl) cartTotalQtyEl.textContent = '0 bultos';
      return;
    }

    if (cartDrawerEmpty) cartDrawerEmpty.style.display = 'none';
    if (cartDrawerFooter) cartDrawerFooter.style.display = 'block';

    const totalQty = window.cartInstance.getTotalItemsCount();
    if (cartTotalQtyEl) cartTotalQtyEl.textContent = `${totalQty} bulto${totalQty !== 1 ? 's' : ''}`;

    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <span class="cart-item-brand">${item.brand}</span>
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-pres">${item.presentation}</span>
          
          <div class="cart-item-controls">
            <div class="cart-qty-picker">
              <button type="button" class="btn-cart-minus" data-id="${item.id}" aria-label="Restar">-</button>
              <span class="cart-qty-num">${item.quantity}</span>
              <button type="button" class="btn-cart-plus" data-id="${item.id}" aria-label="Sumar">+</button>
            </div>
            <button type="button" class="btn-cart-remove" data-id="${item.id}" title="Eliminar del pedido">
              🗑️ Quitar
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Eventos de controles de cantidad en el carrito
    cartItemsList.querySelectorAll('.btn-cart-minus').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.id;
        const currentItem = cart.find(i => i.id === id);
        if (currentItem) {
          window.cartInstance.updateQuantity(id, currentItem.quantity - 1);
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-cart-plus').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.id;
        const currentItem = cart.find(i => i.id === id);
        if (currentItem) {
          window.cartInstance.updateQuantity(id, currentItem.quantity + 1);
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-cart-remove').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.id;
        window.cartInstance.removeFromCart(id);
      });
    });
  }

  // Abrir / Cerrar Drawer del Carrito
  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openCartBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Enviar Pedido por WhatsApp
  if (btnSendWhatsappOrder) {
    btnSendWhatsappOrder.addEventListener('click', () => {
      if (!window.cartInstance || window.cartInstance.getItems().length === 0) {
        window.showToast('Tu carrito está vacío. Agrega productos antes de pedir.', '⚠️', 'error');
        return;
      }

      const clientName = customerNameInput ? customerNameInput.value.trim() : '';
      const notes = customerNotesInput ? customerNotesInput.value.trim() : '';

      const waUrl = window.cartInstance.generateWhatsAppOrderUrl(clientName, notes);
      if (waUrl) {
        window.open(waUrl, '_blank');
        closeCart();
      }
    });
  }

  // Vaciar Carrito
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar todos los productos del carrito?')) {
        window.cartInstance.clearCart();
      }
    });
  }

  // Modal de Detalles de Producto
  window.openProductModal = function(productId) {
    const p = PRODUCTS.find(prod => prod.id === productId);
    if (!p) return;

    activeModalProductId = p.id;
    modalImage.src = p.image;
    modalImage.alt = p.name;
    modalBrand.textContent = p.brand;
    modalTitle.textContent = p.name;
    modalCategory.textContent = formatCategory(p.category);
    modalPresentation.textContent = p.presentation;
    modalDescription.textContent = p.description;
    
    if (modalQtyInput) modalQtyInput.value = 1;

    const waText = encodeURIComponent(`Hola Distribuidora San Roque! Quisiera consultar precio y stock de: ${p.name} (${p.brand} - ${p.presentation}).`);
    modalWhatsappBtn.href = `https://wa.me/5491112345678?text=${waText}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    activeModalProductId = null;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Cantidad en Modal
  if (modalQtyMinus && modalQtyInput) {
    modalQtyMinus.addEventListener('click', () => {
      let val = parseInt(modalQtyInput.value, 10) || 1;
      if (val > 1) modalQtyInput.value = val - 1;
    });
  }

  if (modalQtyPlus && modalQtyInput) {
    modalQtyPlus.addEventListener('click', () => {
      let val = parseInt(modalQtyInput.value, 10) || 1;
      modalQtyInput.value = val + 1;
    });
  }

  // Agregar al Carrito desde el Modal
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
      if (activeModalProductId && window.cartInstance) {
        const qty = parseInt(modalQtyInput.value, 10) || 1;
        window.cartInstance.addToCart(activeModalProductId, qty);
        closeModal();
      }
    });
  }

  // Filtros de categoría
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Buscador en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Suscribirse a cambios del Carrito
  if (window.cartInstance) {
    window.cartInstance.subscribe((cart) => {
      renderCartDrawer(cart);
    });
    window.cartInstance.updateBadges();
  }

  // Render inicial
  renderProducts();
});
