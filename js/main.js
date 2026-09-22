/* ==========================================================================
   Distribuidora San Roque S.R.L. - Lógica Principal (Filtros, Búsqueda, Modal)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('product-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
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

  // ==========================================================================
  // Carrusel de Marcas (Bloques de a 6 marcas con flechas laterales y paginación)
  // ==========================================================================
  function setupBrandsCarousel() {
    const track = document.getElementById('brands-track');
    const viewport = document.getElementById('brands-viewport');
    const prevBtn = document.getElementById('brands-prev-btn');
    const nextBtn = document.getElementById('brands-next-btn');
    const pagination = document.getElementById('brands-pagination');

    if (!track || typeof BRANDS === 'undefined' || !BRANDS.length) return;

    const BRANDS_PER_PAGE = 6;
    const totalPages = Math.ceil(BRANDS.length / BRANDS_PER_PAGE);
    let currentBlock = 0;

    // 1. Renderizar páginas / bloques de 6 marcas
    let pagesHTML = '';
    for (let p = 0; p < totalPages; p++) {
      const pageBrands = BRANDS.slice(p * BRANDS_PER_PAGE, (p + 1) * BRANDS_PER_PAGE);
      pagesHTML += `
        <div class="brands-page ${p === 0 ? 'active-page' : ''}" role="group" aria-roledescription="slide" aria-label="Bloque ${p + 1} de ${totalPages}">
          <div class="brands-grid">
            ${pageBrands.map(b => `
              <div class="brand-card">
                <img src="${b.logo}" alt="Logo de ${b.name}" loading="lazy">
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    track.innerHTML = pagesHTML;

    // 2. Renderizar indicadores de paginación (dots)
    if (pagination && totalPages > 1) {
      pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <button type="button" class="brands-dot ${i === 0 ? 'active' : ''}" 
          role="tab" 
          aria-selected="${i === 0 ? 'true' : 'false'}" 
          aria-label="Ir al bloque ${i + 1} de marcas" 
          data-block="${i}">
        </button>
      `).join('');
    }

    // 3. Actualizar visibilidad de flechas según el bloque actual
    function updateNavButtons() {
      const isFirst = currentBlock <= 0;
      const isLast = currentBlock >= totalPages - 1;

      if (prevBtn) {
        prevBtn.classList.toggle('is-hidden', isFirst);
        prevBtn.setAttribute('tabindex', isFirst ? '-1' : '0');
        prevBtn.setAttribute('aria-hidden', isFirst ? 'true' : 'false');
        prevBtn.disabled = isFirst;
      }

      if (nextBtn) {
        nextBtn.classList.toggle('is-hidden', isLast);
        nextBtn.setAttribute('tabindex', isLast ? '-1' : '0');
        nextBtn.setAttribute('aria-hidden', isLast ? 'true' : 'false');
        nextBtn.disabled = isLast;
      }
    }

    // 4. Cambiar de bloque con animación suave y delimitada
    function goToBlock(index) {
      if (index < 0) {
        currentBlock = 0;
      } else if (index >= totalPages) {
        currentBlock = totalPages - 1;
      } else {
        currentBlock = index;
      }

      track.style.transform = `translateX(-${currentBlock * 100}%)`;

      // Activar clase active-page en el bloque actual para disparar la animación en cascada de sus logos
      const pages = track.querySelectorAll('.brands-page');
      pages.forEach((page, idx) => {
        page.classList.toggle('active-page', idx === currentBlock);
      });

      if (pagination) {
        const dots = pagination.querySelectorAll('.brands-dot');
        dots.forEach((dot, idx) => {
          const isActive = idx === currentBlock;
          dot.classList.toggle('active', isActive);
          dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }

      updateNavButtons();
    }

    // 5. Navegación con flechas a los costados
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentBlock > 0) {
          goToBlock(currentBlock - 1);
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentBlock < totalPages - 1) {
          goToBlock(currentBlock + 1);
        }
      });
    }

    // 6. Clic en los dots
    if (pagination) {
      pagination.addEventListener('click', (e) => {
        const targetDot = e.target.closest('.brands-dot');
        if (targetDot) {
          const blockIdx = parseInt(targetDot.getAttribute('data-block'), 10);
          if (!isNaN(blockIdx)) {
            goToBlock(blockIdx);
          }
        }
      });
    }

    // 7. Gestos táctiles (Swipe en móviles)
    if (viewport) {
      let touchStartX = 0;
      let touchStartY = 0;

      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        const diffX = e.changedTouches[0].screenX - touchStartX;
        const diffY = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0 && currentBlock < totalPages - 1) {
            goToBlock(currentBlock + 1);
          } else if (diffX > 0 && currentBlock > 0) {
            goToBlock(currentBlock - 1);
          }
        }
      }, { passive: true });
    }

    // 8. Navegación por teclado en el contenedor de marcas
    const container = document.querySelector('.brands-carousel-container');
    if (container) {
      container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentBlock > 0) {
          goToBlock(currentBlock - 1);
        } else if (e.key === 'ArrowRight' && currentBlock < totalPages - 1) {
          goToBlock(currentBlock + 1);
        }
      });
    }

    // 9. Estado inicial de las flechas
    updateNavButtons();
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
            const duration = 1800; // Conteo más rápido y dinámico (1.8s)

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

  // Redirección al catálogo con categoría seleccionada
  window.filterCatalogByKeyword = function(keyword) {
    window.location.href = `catalogo.html?cat=${encodeURIComponent(keyword)}`;
  };

  // Animaciones de entrada en Scroll (se repiten cada vez que el elemento entra en el viewport)
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          entry.target.classList.remove('revealed');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    animatedElements.forEach(el => scrollObserver.observe(el));
  }

  // Tooltip Interactivo de WhatsApp
  const whatsappTooltip = document.getElementById('whatsapp-tooltip');
  if (whatsappTooltip) {
    whatsappTooltip.addEventListener('click', () => {
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Distribuidora San Roque! Quisiera consultar cotización mayorista.')}`, '_blank');
    });
  }

  // Menú móvil accesible con soporte para ARIA y Escape
  if (mobileToggle && navMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', 'nav-menu');

    const toggleMenu = (open) => {
      const shouldOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', shouldOpen);
      mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    // Cerrar al clickear enlaces
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Cerrar al pulsar tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
        mobileToggle.focus();
      }
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

  // ==========================================================================
  // ScrollSpy & Indicador Animado Deslizante de la Barra Superior
  // ==========================================================================
  function setupNavScrollSpy() {
    const navMenu = document.getElementById('nav-menu');
    const indicator = document.getElementById('nav-sliding-indicator');
    if (!navMenu) return;

    // Secciones a rastrear en la página de inicio
    const SECTIONS = [
      { id: 'inicio', link: navMenu.querySelector('a[href="#inicio"]') },
      { id: 'nosotros', link: navMenu.querySelector('a[href="#nosotros"]') },
      { id: 'marcas', link: navMenu.querySelector('a[href="#marcas"]') },
      { id: 'servicios', link: navMenu.querySelector('a[href="#servicios"]') },
      { id: 'contacto', link: navMenu.querySelector('a[href="#contacto"]') }
    ];

    // Sincronización con barra inferior móvil
    const mobileMap = {
      'inicio': document.getElementById('mob-nav-inicio'),
      'nosotros': document.getElementById('mob-nav-nosotros'),
      'contacto': document.getElementById('mob-nav-contacto')
    };
    const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item:not(.mobile-nav-wa)');

    let currentActiveId = 'inicio';
    let isTicking = false;

    // Desplazar el indicador animado hacia el link activo
    function updateIndicatorPosition(activeLink, animate = true) {
      if (!indicator || !activeLink) return;

      // Ocultar si la ventana es móvil
      if (window.innerWidth <= 920) {
        indicator.style.opacity = '0';
        return;
      }

      const navRect = navMenu.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const left = linkRect.left - navRect.left;
      const top = linkRect.top - navRect.top + linkRect.height - 2;
      const width = linkRect.width;

      if (!animate) {
        indicator.style.transition = 'none';
      } else {
        indicator.style.transition = 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), width 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease';
      }

      indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      indicator.style.width = `${width}px`;
      indicator.style.opacity = '1';
    }

    // Activar una sección y actualizar el indicador
    function setActiveSection(sectionId, animate = true) {
      currentActiveId = sectionId;

      let matchedLink = null;
      SECTIONS.forEach(item => {
        if (item.link) {
          if (item.id === sectionId) {
            item.link.classList.add('active');
            matchedLink = item.link;
          } else {
            item.link.classList.remove('active');
          }
        }
      });

      if (matchedLink) {
        updateIndicatorPosition(matchedLink, animate);
      }

      // Sincronizar barra inferior móvil
      if (mobileMap[sectionId]) {
        mobileNavItems.forEach(item => item.classList.remove('active'));
        mobileMap[sectionId].classList.add('active');
      }
    }

    // Determinar la sección visible con delta de scroll
    function getSectionInView() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. Tope de página
      if (scrollY < 120) {
        return 'inicio';
      }

      // 2. Fondo de página (Contacto y Footer)
      if (scrollY + windowHeight >= docHeight - 80) {
        return 'contacto';
      }

      // 3. Revisar cada sección por posición relativa
      const offset = 140;
      let active = 'inicio';

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop - offset;
          if (scrollY >= top) {
            active = section.id;
          }
        }
      }

      return active;
    }

    function onScroll() {
      if (!isTicking) {
        requestAnimationFrame(() => {
          const activeId = getSectionInView();
          if (activeId !== currentActiveId) {
            setActiveSection(activeId, true);
          }
          isTicking = false;
        });
        isTicking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // En resize recalculamos posición sin animación
    window.addEventListener('resize', () => {
      const activeItem = SECTIONS.find(item => item.id === currentActiveId);
      if (activeItem && activeItem.link) {
        updateIndicatorPosition(activeItem.link, false);
      }
    }, { passive: true });

    // Respuesta inmediata a los clics en los enlaces
    SECTIONS.forEach(item => {
      if (item.link) {
        item.link.addEventListener('click', () => {
          setActiveSection(item.id, true);
        });
      }
    });

    // Ajuste al cargar fuentes
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const activeItem = SECTIONS.find(item => item.id === currentActiveId);
        if (activeItem && activeItem.link) {
          updateIndicatorPosition(activeItem.link, false);
        }
      });
    }

    // Inicializar posición
    const initialId = getSectionInView();
    setActiveSection(initialId, false);
  }

  // Control de visibilidad del botón flotante de WhatsApp:
  // Oculto en la pantalla inicial (hero), aparece suavemente a partir del
  // bloque de "Nosotros" y se mantiene para toda la parte inferior.
  // Al volver a subir por encima de "Nosotros", se esconde de nuevo.
  function setupWhatsAppVisibility() {
    const waWrapper = document.getElementById('whatsapp-wrapper');
    const nosotrosSection = document.getElementById('nosotros');
    if (!waWrapper || !nosotrosSection) return;

    let ticking = false;

    function updateWhatsAppVisibility() {
      const rect = nosotrosSection.getBoundingClientRect();
      // Aparece cuando el bloque de Nosotros entra en la pantalla (al 65% de la ventana)
      const isPastNosotros = rect.top <= (window.innerHeight * 0.65);

      if (isPastNosotros) {
        waWrapper.classList.add('is-visible');
      } else {
        waWrapper.classList.remove('is-visible');
      }
      ticking = false;
    }

    function onScrollOrResize() {
      if (!ticking) {
        requestAnimationFrame(updateWhatsAppVisibility);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Verificación inicial por si la página carga con scroll o hash
    updateWhatsAppVisibility();
  }

  // Inicializar
  setupBrandsCarousel();
  setupAnimatedCounters();
  setupScrollAnimations();
  setupWhatsAppVisibility();
  setupNavScrollSpy();
});


