document.addEventListener('DOMContentLoaded', () => {

  // ===== Navbar scroll effect =====
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu toggle =====
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ===== Scroll animations for feature cards =====
  const featureCards = document.querySelectorAll('.feature-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  featureCards.forEach(card => observer.observe(card));

  // ===== Leaflet Map =====
  const mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
    const lat = 48.8347;
    const lng = 2.0133;

    const ecoleLat = 48.8437;
    const ecoleLng = 2.0167;

    const map = L.map('map', {
      scrollWheelZoom: false,
    }).setView([(lat + ecoleLat) / 2, (lng + ecoleLng) / 2], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const houseIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 48px; height: 48px;
          background: #d4862f;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        ">
          <svg style="transform: rotate(45deg); width: 20px; height: 20px;" fill="white" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          </svg>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });

    const schoolIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 42px; height: 42px;
          background: #4a7c59;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        ">
          <svg style="transform: rotate(45deg); width: 18px; height: 18px;" fill="white" viewBox="0 0 24 24">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -42],
    });

    L.marker([lat, lng], { icon: houseIcon })
      .addTo(map)
      .bindPopup(`
        <div class="map-popup-title">12 rue de Mailly</div>
        <div class="map-popup-address">78450 Villepreux Village</div>
        <div class="map-popup-price">850 000 €</div>
      `)
      .openPopup();

    L.marker([ecoleLat, ecoleLng], { icon: schoolIcon })
      .addTo(map)
      .bindPopup(`
        <div class="map-popup-title">École Saint-Bernard</div>
        <div class="map-popup-address">Chemin de Grand'Maisons, Villepreux</div>
        <div style="color:#4a7c59; font-weight:600; margin-top:6px; font-size:13px;">≈ 500 m à pied</div>
      `);

    L.polyline([[lat, lng], [ecoleLat, ecoleLng]], {
      color: '#d4862f',
      weight: 3,
      dashArray: '8, 8',
      opacity: 0.6,
    }).addTo(map);

    map.fitBounds([[lat, lng], [ecoleLat, ecoleLng]], { padding: [60, 60] });
  }

  // ===== Lightbox with navigation =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  if (lightbox && lightboxClose) {
    let activeImageSet = [];
    let currentIndex = 0;

    const getGalleryImages = () => {
      return Array.from(document.querySelectorAll('#gallery-grid .gallery-item:not(.hidden-item) img'));
    };

    const getPlanImages = () => {
      return Array.from(document.querySelectorAll('#plans-grid img'));
    };

    const showImage = (index) => {
      if (activeImageSet.length === 0) return;
      currentIndex = (index + activeImageSet.length) % activeImageSet.length;
      lightboxImg.src = activeImageSet[currentIndex].src;
      lightboxImg.alt = activeImageSet[currentIndex].alt || '';
      lightboxCounter.textContent = `${currentIndex + 1} / ${activeImageSet.length}`;
    };

    const openLightbox = (clickedImg, imageSet) => {
      activeImageSet = imageSet;
      const idx = activeImageSet.indexOf(clickedImg);
      showImage(idx >= 0 ? idx : 0);
      lightbox.classList.remove('hidden');
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.getElementById('gallery-grid').addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (img) openLightbox(img, getGalleryImages());
    });

    const plansGrid = document.getElementById('plans-grid');
    if (plansGrid) {
      plansGrid.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img) openLightbox(img, getPlanImages());
      });
    }

    lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
    lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? showImage(currentIndex - 1) : showImage(currentIndex + 1);
      }
    }, { passive: true });
  }

  // ===== Gallery category filters =====
  const filters = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden-item');
          item.classList.add('fade-in');
        } else {
          item.classList.add('hidden-item');
          item.classList.remove('fade-in');
        }
      });
    });
  });

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
