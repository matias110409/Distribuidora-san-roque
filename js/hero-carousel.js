/**
 * ==========================================================================
 * Distribuidora San Roque S.R.L. - Hero 3D Carousel (TOONHUB-Style Architecture)
 * ==========================================================================
 * Carrusel full-viewport interactivo con transición simultánea de:
 * - Color de fondo dinámico por producto (cubic-bezier 650ms)
 * - Perspectiva 3D con roles: center (zoom frontal), left, right
 * - Textura granulada (grain overlay) y tipografía de impacto gigante
 * - Soporte para clics en controles, tarjetas laterales, teclado y gestos táctiles (swipe)
 */

(function () {
  'use strict';

  // Catálogo de los 3 productos destacados (.PNG con transparencia)
  const HERO_PRODUCTS = [
    {
      id: 'pandulce',
      title: 'PAN DULCE & ROSCA',
      subtitle: 'LÍNEA DE PLATA',
      desc: 'Premezcla premium para elaboración artesanal de panes dulces y roscas con máxima terneza, volumen y frescura.',
      src: 'imagenes de pagina/premezcla-pan-dulce-rosca-linea-de-plata-Photoroom.png',
      alt: 'Premezcla Pan Dulce y Rosca Línea de Plata',
      bg: '#1A538C',
      panel: '#2A69A8',
      ghost: 'SAN ROQUE'
    },
    {
      id: 'brownies',
      title: 'PREMEZCLA BROWNIES',
      subtitle: 'CALSA INNOVA 360',
      desc: 'Textura húmeda y fudge, intenso sabor a chocolate y óptimo rendimiento para pastelería y panadería profesional.',
      src: 'imagenes de pagina/Innova_Brownies_Nuevo-Photoroom.png',
      alt: 'Premezcla Brownies Innova 360 Calsa',
      bg: '#D95A32',
      panel: '#E2744F',
      ghost: 'SAN ROQUE'
    },
    {
      id: 'muffins',
      title: 'MUFFINS DE VAINILLA',
      subtitle: 'CALSA INNOVA 360',
      desc: 'Miga suave y esponjosa con aroma tradicional a vainilla. Excelente desarrollo y dorado parejo en horno.',
      src: 'imagenes de pagina/Innova_Muffins_de_Vainilla_Nuevo-Photoroom.png',
      alt: 'Premezcla Muffins de Vainilla Innova 360 Calsa',
      bg: '#D49B00',
      panel: '#E2A914',
      ghost: 'SAN ROQUE'
    }
  ];

  // Estado del Carrusel
  let activeIndex = 0;
  let isAnimating = false;
  const ANIMATION_DURATION = 650; // ms (coincide con cubic-bezier(0.4, 0, 0.2, 1))

  // Elementos DOM
  let sectionEl = null;
  let stageEl = null;
  let titleEl = null;
  let descEl = null;
  let metaEl = null;
  let prevBtn = null;
  let nextBtn = null;
  let items = [];

  // Precargar las 3 imágenes en memoria
  function preloadImages() {
    HERO_PRODUCTS.forEach(item => {
      const img = new Image();
      img.src = item.src;
    });
  }

  // Calcular roles de los 3 ítems según el índice activo
  function calculateRoles(active, count = 3) {
    return {
      center: active,
      right: (active + 1) % count,
      left: (active + count - 1) % count
    };
  }

  // Actualizar la escena visual
  function updateScene(direction) {
    if (!sectionEl || items.length === 0) return;

    const currentProduct = HERO_PRODUCTS[activeIndex];

    // 1. Transición suave de color de fondo
    sectionEl.style.backgroundColor = currentProduct.bg;

    // 2. Transición suave de texto meta (título y descripción)
    if (metaEl && titleEl && descEl) {
      metaEl.classList.add('is-fading');
      setTimeout(() => {
        titleEl.textContent = currentProduct.title;
        descEl.textContent = currentProduct.desc;
        metaEl.classList.remove('is-fading');
      }, 160);
    }

    // 3. Asignación de roles a cada uno de los 3 ítems del carrusel
    const roles = calculateRoles(activeIndex, items.length);

    items.forEach((item, index) => {
      // Limpiar clases de rol previas
      item.classList.remove('role-center', 'role-left', 'role-right', 'role-back');

      if (index === roles.center) {
        item.classList.add('role-center');
        item.setAttribute('aria-hidden', 'false');
      } else if (index === roles.right) {
        item.classList.add('role-right');
        item.setAttribute('aria-hidden', 'true');
      } else if (index === roles.left) {
        item.classList.add('role-left');
        item.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Navegación con bloqueo de animación
  function navigate(direction) {
    if (isAnimating) return;
    isAnimating = true;

    if (direction === 'next') {
      activeIndex = (activeIndex + 1) % HERO_PRODUCTS.length;
    } else {
      activeIndex = (activeIndex + HERO_PRODUCTS.length - 1) % HERO_PRODUCTS.length;
    }

    updateScene(direction);

    // Liberar bloqueo de animación luego de completarse el crossfade
    setTimeout(() => {
      isAnimating = false;
    }, ANIMATION_DURATION);
  }

  // Inicialización de Eventos e Interacciones
  function initHeroCarousel() {
    sectionEl = document.getElementById('hero-carousel');
    stageEl = document.getElementById('hero-carousel-stage');
    titleEl = document.getElementById('hero-product-title');
    descEl = document.getElementById('hero-product-desc');
    metaEl = document.getElementById('hero-product-meta');
    prevBtn = document.getElementById('hero-prev-btn');
    nextBtn = document.getElementById('hero-next-btn');

    if (!sectionEl || !stageEl) return;

    items = Array.from(stageEl.querySelectorAll('.hero-carousel-item'));
    if (items.length === 0) return;

    // Precarga inmediata
    preloadImages();

    // Estado inicial
    updateScene('init');

    // Botones de navegación
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('prev');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('next');
      });
    }

    // Clic directo en las tarjetas laterales para girar hacia ellas
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (item.classList.contains('role-right')) {
          navigate('next');
        } else if (item.classList.contains('role-left')) {
          navigate('prev');
        }
      });
    });

    // Navegación por teclado (Flechas izquierda / derecha) solo si el hero está visible en pantalla
    window.addEventListener('keydown', (e) => {
      // Ignorar si el usuario está escribiendo en un input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
        return;
      }
      // Solo navegar si el hero está en el viewport
      const heroRect = heroSection.getBoundingClientRect();
      const inViewport = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
      if (!inViewport) return;

      if (e.key === 'ArrowRight') {
        navigate('next');
      } else if (e.key === 'ArrowLeft') {
        navigate('prev');
      }
    });

    // Soporte para gestos táctiles (Swipe en móviles)
    let touchStartX = 0;
    let touchStartY = 0;

    stageEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    stageEl.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;

      // Detectar swipe horizontal claro (mínimo 45px)
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          navigate('next'); // Deslizar hacia la izquierda avanza
        } else {
          navigate('prev'); // Deslizar hacia la derecha retrocede
        }
      }
    }, { passive: true });
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCarousel);
  } else {
    initHeroCarousel();
  }
})();
