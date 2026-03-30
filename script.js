// Mobile Navigation Toggle with Focus Trap
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sectionLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // Set aria-expanded for accessibility
        navToggle.setAttribute('aria-expanded', String(isOpen));

        // Focus first menu item when opening
        if (isOpen) {
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    });
}

// Close menu when clicking outside on mobile
document.addEventListener('click', (event) => {
    if (!navMenu || !navToggle) return;

    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);

    if (navMenu.classList.contains('active') && !clickedInsideMenu && !clickedToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }
});

// Combined high-performance scroll effects (navbar + optional parallax)
const hero = document.querySelector('.hero');
const shouldUseParallax = Boolean(
    hero &&
    !prefersReducedMotion &&
    window.matchMedia('(min-width: 1024px)').matches
);

let scrollTicking = false;
const onScroll = () => {
    if (scrollTicking) return;

    scrollTicking = true;
    requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;

        // Navbar scroll effect
        if (currentScroll > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Lightweight parallax only where it's likely to stay smooth
        if (shouldUseParallax && currentScroll < window.innerHeight) {
            hero.style.setProperty('--hero-parallax-y', `${Math.round(currentScroll * 0.35)}px`);
        }

        scrollTicking = false;
    });
};

window.addEventListener('scroll', onScroll, { passive: true });

// Active section highlighting for navigation
const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const sectionId = entry.target.getAttribute('id');
        sectionLinks.forEach((link) => {
            const isMatch = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active-link', isMatch);
            if (isMatch) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0.01 });

document.querySelectorAll('section[id]').forEach((section) => {
    activeLinkObserver.observe(section);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm && formMessage && submitButton) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        formMessage.style.display = '';

        // Add loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simulate form submission (replace with actual backend endpoint)
        setTimeout(() => {
            console.log('Form submitted:', data);

            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;

            // Show success message
            formMessage.textContent = 'Thank you! We\'ll contact you within 24 hours with your free quote.';
            formMessage.className = 'form-message success';

            // Reset form
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

// Smooth scroll for anchor links (backup for browsers without CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .about-content, .about-image, .contact-info, .contact-form-wrapper');

    animatedElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
});

// Form validation enhancement
const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '' && input.checkValidity()) {
            input.style.borderColor = 'var(--fresh-green)';
        } else if (input.value.trim() !== '' && !input.checkValidity()) {
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = 'var(--light-gray)';
        }
    });

    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--fresh-green)';
    });
});

// Animated counter for stats
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.floor(target * eased));

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            element.textContent = String(target);
        }
    };

    requestAnimationFrame(tick);
};

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (!stat.classList.contains('counted')) {
                    animateCounter(stat);
                    stat.classList.add('counted');
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statsObserver.observe(statsBar);
    }
});
