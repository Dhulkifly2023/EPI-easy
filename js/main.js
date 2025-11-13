// js/aula-capacete.js

// Função para toggle do menu (adaptado do index)
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
}

// Função para toggle de notificações (adaptado do index)
function toggleNotif() {
    const dropdown = document.querySelector('.notif-dropdown');
    dropdown.classList.toggle('show');
}

// Fecha dropdown ao clicar fora
document.addEventListener('click', function(event) {
    const notification = document.querySelector('.notification');
    if (!notification.contains(event.target)) {
        const dropdown = document.querySelector('.notif-dropdown');
        dropdown.classList.remove('show');
    }
});

// Animação suave para carrossel (opcional, Bootstrap já cuida)
document.addEventListener('DOMContentLoaded', function() {
    const carousel = new bootstrap.Carousel(document.querySelector('#carouselAula'), {
        interval: false, // Desativa auto-slide para leitura
        wrap: true
    });
});