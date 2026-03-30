// ── Cached DOM references ────────────────────────────────────
const navToggle  = document.querySelector('.nav-toggle');
const navMenu    = document.querySelector('.nav-menu');
const navbar     = document.querySelector('.navbar');
const hero       = document.querySelector('.hero');

// ── Mobile Navigation Toggle ─────────────────────────────────
navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
        const firstLink = navMenu.querySelector('a');
        if (firstLink) firstLink.focus();
    }
});

// Close mobile menu when clicking a nav link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }
});

// ── Single rAF-throttled, passive scroll handler ──────────────
// Fix: replaces two separate unthrottled scroll listeners.
// passive:true tells the browser we'll never call preventDefault(),
// which lets it skip the main-thread check on every scroll tick.
let ticking = false;

const onScroll = () => {
    const scrolled = window.scrollY;

    // Navbar compact state — class toggle only (CSS handles the transition).
    // No inline padding/boxShadow mutations → no layout reflow per frame.
    navbar.classList.toggle('scrolled', scrolled > 100);

    // Hero parallax — backgroundPositionY is cheaper than fixed-attachment
    // repaints. Only runs while hero is in viewport.
    if (hero && scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
    }

    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

// ── Scroll-reveal IntersectionObserver ───────────────────────
// Fix: initial opacity/transform/transition are declared in CSS (.service-card etc.)
// JS only toggles .is-visible — no inline style mutations, no transition override.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // stop watching once revealed
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(
        '.service-card, .testimonial-card, .about-content, .about-image, .contact-info, .contact-form-wrapper'
    ).forEach(el => revealObserver.observe(el));
});

// ── Animated stat counters ────────────────────────────────────
const animateCounter = (element) => {
    const target    = parseInt(element.getAttribute('data-target'), 10);
    const duration  = 2000;
    const increment = target / (duration / 16);
    let current     = 0;

    const tick = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(tick);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(stat => {
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
    if (statsBar) statsObserver.observe(statsBar);
});

// ── Contact Form ──────────────────────────────────────────────
const contactForm  = document.getElementById('contactForm');
const formMessage  = document.getElementById('formMessage');
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    submitButton.classList.add('loading');
    submitButton.disabled = true;

    const data = Object.fromEntries(new FormData(contactForm));

    // Simulate submission — replace with real fetch() call in production
    setTimeout(() => {
        console.log('Form submitted:', data);

        submitButton.classList.remove('loading');
        submitButton.disabled = false;

        formMessage.textContent = "Thank you! We'll contact you within 24 hours with your free quote.";
        formMessage.className   = 'form-message success';
        contactForm.reset();

        // Clear all validation classes on reset
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.classList.remove('is-valid', 'is-error');
        });

        setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
    }, 1500);
});

// ── Form field validation — class-based (no inline style.borderColor) ──
// Fix: was mutating input.style.borderColor on every blur/focus,
// causing paint invalidation on each field interaction.
const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

formFields.forEach(field => {
    field.addEventListener('blur', () => {
        const filled = field.value.trim() !== '';
        field.classList.toggle('is-valid',  filled && field.checkValidity());
        field.classList.toggle('is-error',  filled && !field.checkValidity());
        if (!filled) field.classList.remove('is-valid', 'is-error');
    });

    field.addEventListener('focus', () => {
        field.classList.remove('is-error');
        if (field.value.trim()) field.classList.add('is-valid');
    });
});

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// NOTE: The mouseenter transition-setter block from the original has been
// removed. It was re-injecting `transition: all` on every link mouseenter,
// overriding the more efficient scoped property transitions set in CSS and
// adding a redundant event listener to every anchor on the page.
