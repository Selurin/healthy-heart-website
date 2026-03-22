/**
 * ============================================
 * Custom Slider Component v1.0
 * ============================================
 * Подключение:
 * 1. Добавьте CSS: <link rel="stylesheet" href="slider-component.css">
 * 2. Добавьте HTML разметку слайдера
 * 3. Добавьте JS: <script src="slider-component.js"></script>
 *
 * Использование:
 * <div class="slider" data-slides-to-scroll="3">
 *   <button class="slider-btn-prev">‹</button>
 *   <button class="slider-btn-next">›</button>
 *   <div class="slider-viewport">
 *     <div class="slider-track">
 *       <div class="slider-slide">...контент...</div>
 *       <div class="slider-slide">...контент...</div>
 *     </div>
 *   </div>
 * </div>
 */

(function() {
  'use strict';

  const GAP = 15;

  function initSlider(slider) {
    const viewport = slider.querySelector('.slider-viewport');
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slider-slide'));
    const prevBtn = slider.querySelector('.slider-btn-prev');
    const nextBtn = slider.querySelector('.slider-btn-next');

    if (!track || slides.length === 0 || !viewport) {
      console.error('Slider: missing required elements');
      return;
    }

    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideWidth = slides[0].offsetWidth;

    // Получаем количество слайдов для прокрутки из data-атрибута
    const slidesToScroll = parseInt(slider.dataset.slidesToScroll) || 3;

    function getTotalWidth() {
      return slideWidth * totalSlides + GAP * (totalSlides - 1);
    }

    function getMaxOffset() {
      const totalWidth = getTotalWidth();
      const viewportWidth = viewport.clientWidth;
      return Math.max(0, totalWidth - viewportWidth);
    }

    function getMaxIndex() {
      const slideWithGap = slideWidth + GAP;
      const maxOffset = getMaxOffset();
      return Math.ceil(maxOffset / slideWithGap);
    }

    function updateTrackPosition() {
      const slideWithGap = slideWidth + GAP;
      let offset = currentIndex * slideWithGap;
      const maxOffset = getMaxOffset();
      offset = Math.min(offset, maxOffset);
      track.style.transform = `translateX(-${offset}px)`;
    }

    function updateButtons() {
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= getMaxIndex();
    }

    function nextSlide() {
      const maxOffset = getMaxOffset();
      const slideWithGap = slideWidth + GAP;
      const currentOffset = currentIndex * slideWithGap;
      const remainingOffset = maxOffset - currentOffset;

      if (remainingOffset <= 0) return;

      const remainingSlides = remainingOffset / slideWithGap;

      if (remainingSlides < slidesToScroll) {
        currentIndex = getMaxIndex();
      } else {
        currentIndex += slidesToScroll;
      }

      updateTrackPosition();
      updateButtons();
    }

    function prevSlide() {
      if (currentIndex === 0) return;
      const newIndex = Math.max(0, currentIndex - slidesToScroll);
      currentIndex = newIndex;
      updateTrackPosition();
      updateButtons();
    }

    // Обработчики кнопок
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    // Поддержка клавиатуры
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'ArrowRight') nextSlide();
    });

    // Поддержка свайпов
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });

    // Изменение размера
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        slideWidth = slides[0].offsetWidth;
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateTrackPosition();
        updateButtons();
      }, 150);
    });

    // Инициализация
    updateTrackPosition();
    updateButtons();
  }

  // Авто-инициализация всех слайдеров на странице
  function initAllSliders() {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(initSlider);
  }

  // Инициализация после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllSliders);
  } else {
    initAllSliders();
  }

  // Экспорт для внешнего использования
  window.SliderComponent = {
    init: initSlider,
    initAll: initAllSliders
  };

})();
