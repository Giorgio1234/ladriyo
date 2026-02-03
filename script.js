// LadriYO Website JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(245, 245, 240, 0.98)';
            navbar.style.padding = '0.75rem 0';
            navbar.style.boxShadow = '0 2px 20px rgba(45, 45, 45, 0.08)';
        } else {
            navbar.style.background = 'rgba(245, 245, 240, 0.9)';
            navbar.style.padding = '1.5rem 0';
            navbar.style.boxShadow = 'none';
        }
        lastScrollY = window.scrollY;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step, .foqos-content > *, .cta-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Form submission handling
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = waitlistForm.querySelector('input[type="email"]').value;

            // Show success message
            const formGroup = waitlistForm.querySelector('.form-group');
            formGroup.innerHTML = `
                <div style="padding: 1rem; color: #10b981; font-weight: 600;">
                    ✓ ¡Listo! Te avisaremos cuando LadriYO esté disponible.
                </div>
            `;

            // Log for demo purposes
            console.log('Email registered:', email);
        });
    }

    // Parallax effect for floating elements
    document.addEventListener('mousemove', (e) => {
        const floatingElements = document.querySelectorAll('.floating-element');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        floatingElements.forEach((el, index) => {
            const speed = (index + 1) * 10;
            el.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
    });
});
