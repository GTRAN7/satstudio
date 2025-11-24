/**
 * SAT Studio — Interactive Scripts
 * Handles animations, scroll effects, gallery, and navigation
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Scroll-Triggered Animations =====
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animationObserver.observe(el);
  });

  // ===== Header Scroll Effect =====
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // ===== Mobile Navigation Toggle =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Animate hamburger to X
      const spans = menuToggle.querySelectorAll('span');
      if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Image Gallery =====
  const gallery = document.querySelector('.gallery');
  const images = document.querySelectorAll('.gallery img');
  const prevBtn = document.querySelector('.gallery-nav.prev');
  const nextBtn = document.querySelector('.gallery-nav.next');
  const dotsContainer = document.querySelector('.gallery-dots');
  
  if (gallery && images.length > 0 && dotsContainer) {
    let currentIndex = 0;
    let autoplayInterval;

    // Create dots
    images.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('gallery-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToImage(index));
      dotsContainer.appendChild(dot);
    });

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
      resetAutoplay();
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      updateGallery();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateGallery();
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextImage, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => { nextImage(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevImage(); resetAutoplay(); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const galleryContainer = document.querySelector('.gallery-container');
      if (!galleryContainer) return;
      
      const rect = galleryContainer.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        if (e.key === 'ArrowRight') { nextImage(); resetAutoplay(); }
        if (e.key === 'ArrowLeft') { prevImage(); resetAutoplay(); }
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
        resetAutoplay();
      }
    }

    // Start autoplay
    startAutoplay();

    // Pause autoplay on hover
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
      galleryContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
      galleryContainer.addEventListener('mouseleave', startAutoplay);
    }
  }

  // ===== Form Enhancement =====
  const form = document.querySelector('.booking-form form');
  if (form) {
    // Add focus states with visual feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        if (input.value) {
          input.parentElement.classList.add('filled');
        } else {
          input.parentElement.classList.remove('filled');
        }
      });
    });

    // Form submission feedback
    form.addEventListener('submit', function(e) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      }
    });
  }

  // ===== Stagger Animation Trigger =====
  // Trigger stagger animations when section comes into view
  const staggerContainers = document.querySelectorAll('.stagger-children');
  
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  staggerContainers.forEach(container => {
    staggerObserver.observe(container);
  });

  // ===== Parallax Effect for Hero (subtle) =====
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            hero.style.setProperty('--parallax-offset', `${scrolled * 0.3}px`);
          }
        });
      }
    }, { passive: true });
  }

});
