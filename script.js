// Mobile Navigation Toggle with Focus Trap
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Set aria-expanded for accessibility
    navToggle.setAttribute('aria-expanded', isOpen);
    
    // Focus first menu item when opening
    if (isOpen) {
        const firstLink = navMenu.querySelector('a');
        if (firstLink) firstLink.focus();
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

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.padding = '0.8rem 0';
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
    } else {
        navbar.style.padding = '1.2rem 0';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    }
    
    lastScroll = currentScroll;
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
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
    
    // In production, replace above with actual API call:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        formMessage.textContent = 'Thank you! We\'ll contact you within 24 hours.';
        formMessage.className = 'form-message success';
        contactForm.reset();
    })
    .catch(error => {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        formMessage.textContent = 'Something went wrong. Please try again or call us directly.';
        formMessage.className = 'form-message error';
    });
    */
});

// Smooth scroll for anchor links (backup for browsers without CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .about-content, .about-image, .contact-info, .contact-form-wrapper');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
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
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
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

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Add smooth hover effect to all links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});
