/* ==========================================================================
   Distribuidora San Roque S.R.L. - Sistema de Carrito de Compras (cart.js)
   ========================================================================== */

const CART_STORAGE_KEY = 'san_roque_cart_v1';
const WHATSAPP_PHONE = '5491112345678'; // Teléfono oficial para pedidos

class ShoppingCart {
  constructor() {
    this.cart = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al cargar carrito de localStorage:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      this.notifyListeners();
    } catch (e) {
      console.error('Error al guardar carrito en localStorage:', e);
    }
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
      callback(this.cart);
    }
  }

  notifyListeners() {
    this.updateBadges();
    this.listeners.forEach(cb => cb(this.cart));
    // Disparar evento personalizado en window
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: this.cart } }));
  }

  getItems() {
    return [...this.cart];
  }

  getTotalItemsCount() {
    return this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  addToCart(productId, quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const product = typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(p => p.id === productId) : null;
    
    if (!product) {
      console.error('Producto no encontrado:', productId);
      return;
    }

    const existingIndex = this.cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += qty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        presentation: product.presentation,
        category: product.category,
        image: product.image,
        quantity: qty
      });
    }

    this.saveCart();
    
    if (typeof window.showToast === 'function') {
      window.showToast(`Agregado al carrito: ${qty}x "${product.name}"`, '🛒', 'success', 3500);
    }
  }

  updateQuantity(productId, newQty) {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.quantity = qty;
      this.saveCart();
    }
  }

  removeFromCart(productId) {
    const index = this.cart.findIndex(i => i.id === productId);
    if (index > -1) {
      const removed = this.cart.splice(index, 1)[0];
      this.saveCart();
      if (typeof window.showToast === 'function') {
        window.showToast(`Eliminado: "${removed.name}"`, '🗑️', 'info', 2500);
      }
    }
  }

  clearCart() {
    if (this.cart.length === 0) return;
    this.cart = [];
    this.saveCart();
    if (typeof window.showToast === 'function') {
      window.showToast('El carrito ha sido vaciado.', '🧹', 'info', 2500);
    }
  }

  updateBadges() {
    const totalCount = this.getTotalItemsCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.remove('cart-badge-hidden');
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 400);
      } else {
        badge.classList.add('cart-badge-hidden');
      }
    });
  }

  generateWhatsAppOrderUrl(customerName = '', customerNotes = '') {
    if (this.cart.length === 0) return null;

    let message = `Hola Distribuidora San Roque S.R.L.! 👋\nQuisiera realizar el siguiente pedido mayorista:\n\n📦 *DETALLE DEL PEDIDO:*\n`;

    this.cart.forEach((item) => {
      message += `• *${item.quantity}x* ${item.name} (${item.brand} - ${item.presentation})\n`;
    });

    message += `\n📊 *Total de bultos/artículos:* ${this.getTotalItemsCount()} unidades\n`;

    if (customerName && customerName.trim()) {
      message += `👤 *Comercio / Nombre:* ${customerName.trim()}\n`;
    }

    if (customerNotes && customerNotes.trim()) {
      message += `📍 *Observaciones / Entrega:* ${customerNotes.trim()}\n`;
    }

    message += `\n¿Podrían confirmarme stock y cotización? ¡Muchas gracias!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
  }
}

// Instancia global
window.cartInstance = new ShoppingCart();

// Helper global para mostrar toast si no existe
if (typeof window.showToast !== 'function') {
  window.showToast = function(message, icon = '✓', type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
      </div>
      <button style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:1.1rem;padding:0.2rem;" aria-label="Cerrar">✕</button>
    `;

    const closeBtn = toast.querySelector('button');
    function dismiss() {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 320);
    }
    closeBtn.addEventListener('click', dismiss);
    container.appendChild(toast);
    setTimeout(dismiss, duration);
  };
}
