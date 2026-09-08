/* ==========================================================================
   Distribuidora San Roque S.R.L. - Lógica Principal (Filtros, Búsqueda, Modal)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('product-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const brandsGrid = document.getElementById('brands-grid');
  
  // Elementos del Modal
  const modal = document.getElementById('product-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImage = document.getElementById('modal-image');
  const modalBrand = document.getElementById('modal-brand');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalPresentation = document.getElementById('modal-presentation');
  const modalDescription = document.getElementById('modal-description');
  const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');

  // Menú Móvil
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Estado
  let currentCategory = 'all';
  let searchQuery = '';

  // Número de WhatsApp para consultas (Configurable)
  const WHATSAPP_PHONE = '5491112345678'; // Número de ejemplo internacional

  // Generador de Link de WhatsApp
  function createWhatsAppLink(productName) {
    const text = encodeURIComponent(`Hola Distribuidora San Roque! Quisiera consultar precio y disponibilidad de: ${productName}.`);
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }

  // Renderizar Productos
  function renderProducts() {
    if (!productsGrid) return;

    const filtered = PRODUCTS.filter(p => {
      const matchCategory = currentCategory === 'all' || p.category === currentCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = query === '' || 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)));
      
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products-found">
          <h3>No se encontraron productos</h3>
          <p>Prueba con otros términos de búsqueda o selecciona otra categoría.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => {
      const waLink = createWhatsAppLink(p.name);
      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-image-container" onclick="window.openProductModal('${p.id}')">
            <span class="product-badge-brand">${p.brand}</span>
            <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
            <span class="product-badge-presentation">${p.presentation}</span>
          </div>
          <div class="product-body">
            <span class="product-category-tag">${formatCategory(p.category)}</span>
            <h4 class="product-title" onclick="window.openProductModal('${p.id}')">${p.name}</h4>
            <p class="product-description">${p.description}</p>
            <div class="product-actions">
              <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="window.openProductModal('${p.id}')">
                Detalles
              </button>
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" title="Consultar por WhatsApp">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                Pedir
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Formatear categoría legible
  function formatCategory(cat) {
    const map = {
      'premezclas': 'Premezclas y Harinas',
      'margarinas': 'Margarinas y Grasas',
      'reposteria': 'Repostería y Rellenos',
      'lacteos': 'Lácteos',
      'golosinas': 'Frutos Secos y Golosinas'
    };
    return map[cat] || cat;
  }

  // Renderizar Marcas
  function renderBrands() {
    if (!brandsGrid || typeof BRANDS === 'undefined') return;
    brandsGrid.innerHTML = BRANDS.map(b => `
      <div class="brand-card">
        <h4>${b.name}</h4>
        <p>${b.desc}</p>
      </div>
    `).join('');
  }

  // Sistema de Notificaciones Toast Dinámicas
  function showToast(message, icon = '✓', type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
      </div>
      <button style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:1.1rem;padding:0.2rem;" aria-label="Cerrar notificación">✕</button>
    `;

    const closeBtn = toast.querySelector('button');
    function dismiss() {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 320);
    }
    closeBtn.addEventListener('click', dismiss);
    container.appendChild(toast);
    setTimeout(dismiss, duration);
  }

  // Animación de Contadores con requestAnimationFrame (sin setInterval, delta-time compliant)
  function setupAnimatedCounters() {
    const counterElements = document.querySelectorAll('.hero-feature-num[data-target]');
    if (!counterElements.length) return;

    let countersStarted = false;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counterElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            if (isNaN(target)) return;

            let startTime = null;
            const duration = 3500; // 3.5 segundos para un conteo suave, pausado y elegante

            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              // Curva suave easeOutCubic
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeProgress * target);

              el.textContent = `${prefix}${current}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                el.textContent = `${prefix}${target}${suffix}`;
              }
            }

            requestAnimationFrame(step);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const heroFeatures = document.querySelector('.hero-features');
    if (heroFeatures) counterObserver.observe(heroFeatures);
  }

  // Función para filtrar el catálogo desde los botones de las recetas en video
  window.filterCatalogByKeyword = function(keyword) {
    if (searchInput) {
      searchInput.value = keyword;
      searchQuery = keyword;
    }
    // Si coincide con alguna categoría, activar su botón
    let matchedCategory = false;
    filterButtons.forEach(b => {
      if (b.dataset.category === keyword) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        currentCategory = keyword;
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        matchedCategory = true;
      }
    });

    if (!matchedCategory) {
      filterButtons.forEach(btn => {
        if (btn.dataset.category === 'all') btn.classList.add('active');
        else btn.classList.remove('active');
      });
      currentCategory = 'all';
    }

    renderProducts();
    animateProductCards();

    // Desplazar suavemente a catálogo
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animaciones de Entrada en Scroll (IntersectionObserver)
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    animatedElements.forEach(el => scrollObserver.observe(el));
  }

  // Función global para abrir el modal desde el onclick
  window.openProductModal = function(productId) {
    const p = PRODUCTS.find(prod => prod.id === productId);
    if (!p) return;

    modalImage.src = p.image;
    modalImage.alt = p.name;
    modalBrand.textContent = p.brand;
    modalTitle.textContent = p.name;
    modalCategory.textContent = formatCategory(p.category);
    modalPresentation.textContent = p.presentation;
    modalDescription.textContent = p.description;

    const waLink = createWhatsAppLink(p.name);
    modalWhatsappBtn.href = waLink;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloquear scroll
  };

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event Listeners del Modal
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Filtros de categoría
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
      animateProductCards();
    });
  });

  // Buscador
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
      animateProductCards();
    });
  }

  // Animación de entrada escalonada para las tarjetas de producto (suave y pausada)
  function animateProductCards() {
    if (!productsGrid) return;
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(22px)';
      card.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transitionDelay = `${Math.min(i * 0.07, 0.65)}s`;
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  }

  // Formulario de Contacto Interactivo
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombreInput = document.getElementById('nombre');
      const clientName = nombreInput?.value.trim() || 'Cliente';
      showToast(`¡Gracias ${clientName}! Tu consulta fue enviada con éxito. Nos pondremos en contacto a la brevedad.`, '📨', 'success', 5000);
      contactForm.reset();
    });
  }

  // Tooltip Interactivo de WhatsApp
  const whatsappTooltip = document.getElementById('whatsapp-tooltip');
  if (whatsappTooltip) {
    whatsappTooltip.addEventListener('click', () => {
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Distribuidora San Roque! Quisiera consultar cotización mayorista.')}`, '_blank');
    });
  }

  // Menú móvil
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Cerrar al clickear enlaces
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Sombra al scrollear header
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Manejo de videos de recetas verticales: pausar otros al reproducir uno
  const recipeVideos = document.querySelectorAll('.recipe-video');
  recipeVideos.forEach(video => {
    video.addEventListener('play', () => {
      recipeVideos.forEach(other => {
        if (other !== video && !other.paused) {
          other.pause();
        }
      });
    });
  });

  // Mobile Bottom Navigation Bar: sincronizar pestaña activa según scroll
  const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item:not(.mobile-nav-wa)');
  const sectionsToTrack = [
    { id: 'inicio', navItem: document.getElementById('mob-nav-inicio') },
    { id: 'recetas', navItem: document.getElementById('mob-nav-recetas') },
    { id: 'catalogo', navItem: document.getElementById('mob-nav-catalogo') },
    { id: 'contacto', navItem: document.getElementById('mob-nav-contacto') }
  ];

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 220;
    sectionsToTrack.forEach(section => {
      const el = document.getElementById(section.id);
      if (el && section.navItem) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          mobileNavItems.forEach(item => item.classList.remove('active'));
          section.navItem.classList.add('active');
        }
      }
    });
  });

  // Inicializar
  renderProducts();
  renderBrands();
  animateProductCards();
  setupAnimatedCounters();
  setupScrollAnimations();
});
