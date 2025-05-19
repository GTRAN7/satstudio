document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    const images = document.querySelectorAll('.gallery img');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    const dotsContainer = document.querySelector('.gallery-dots');
    let currentIndex = 0;

    // Create dots
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToImage(index));
        dotsContainer.appendChild(dot);
    });

    // Navigation functions
    function updateGallery() {
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex);
        });

        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToImage(index) {
        currentIndex = index;
        updateGallery();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGallery();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

});