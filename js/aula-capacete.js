// js/aula-capacete.js

// Sincroniza indicadores
const carousel = document.getElementById('aulaCarousel');
const indicators = document.querySelectorAll('.aula-indicators .indicator');

carousel.addEventListener('slid.bs.carousel', function(e) {
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === e.to);
    });
});

// Garante swipe no mobile
document.querySelectorAll('.carousel').forEach(carouselEl => {
    let startX;
    carouselEl.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    carouselEl.addEventListener('touchend', e => {
        if (!startX) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                bootstrap.Carousel.getInstance(carouselEl).next();
            } else {
                bootstrap.Carousel.getInstance(carouselEl).prev();
            }
        }
    });
});