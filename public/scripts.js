document.addEventListener('DOMContentLoaded', function () {
    let initialPosition = 0; // Variable para almacenar la posición inicial

    function toggleInfo(infoId) {
        const infoElement = document.getElementById(infoId);
        const moreButton = document.querySelector(`button[data-info-id="${infoId}"]`);

        if (infoElement.style.display === 'none' || infoElement.style.display === '') {
            // Guardar la posición inicial solo cuando se abre la información
            initialPosition = moreButton.getBoundingClientRect().top + window.scrollY;
            infoElement.style.display = 'block';
            moreButton.innerText = "Mostrar menos";

            // Desplazar suavemente hacia el contenido que se muestra
            infoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            infoElement.style.display = 'none';
            moreButton.innerText = "Más información";

            // Ajusta este valor para desplazar un poco más hacia arriba
            window.scrollTo({
                top: initialPosition - 400,  // Subir 100 píxeles adicionales
                behavior: 'smooth'
            });
        }
    }

    // Añadir los listeners para todos los botones de "Más información" y "Mostrar menos"
    document.querySelectorAll('.mas-info-btn, .mostrar-menos-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const infoId = e.target.getAttribute('data-info-id');
            toggleInfo(infoId);
        });
    });

    // Código del contador regresivo
    const countdown = document.getElementById('countdown');
    const targetDate = new Date("November 14, 2024 00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.innerHTML = `${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdown.innerHTML = "¡El congreso ha comenzado!";
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);

    // Código del carrusel de expositores
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const totalSlides = slides.length;

    // Definir la función moveSlide globalmente
    window.moveSlide = function (direction) {
        currentSlide += direction;
        if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        } else if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    };

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            indicators[i].classList.toggle('active', i === index);  // Actualiza los puntitos
        });
    }

    // Mostrar la primera diapositiva
    showSlide(currentSlide);

    // Mover automáticamente cada 8 segundos
    setInterval(() => {
        moveSlide(1);  // Mover a la siguiente diapositiva automáticamente
    }, 8000); // Intervalo de 8 segundos

    // Añadir funcionalidad a los indicadores (puntitos)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Mostrar advertencia solo en dispositivos móviles
    if (window.innerWidth <= 768) {
        const warning = document.getElementById('mobile-warning');
        warning.style.display = 'block';
    }

    // Ocultar el cartel al hacer clic en "Aceptar"
    document.getElementById('close-warning').addEventListener('click', function () {
        const warning = document.getElementById('mobile-warning');
        warning.style.display = 'none';
    });
});
