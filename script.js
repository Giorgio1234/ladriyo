// LadriYO Website JavaScript — Redesigned

document.addEventListener('DOMContentLoaded', () => {
    // === Mobile Menu ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            mobileMenuBtn.setAttribute('aria-label',
                isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );
        });
    }

    function closeMobileMenu() {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#hero') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeMobileMenu();
                return;
            }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });

    // === Scroll Effects (throttled with rAF) ===
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        if (header) {
            header.style.boxShadow = scrollY > 50
                ? '0 4px 30px rgba(0, 0, 0, 0.3)'
                : 'none';
        }
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', scrollY > 600);
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === Scroll-Reveal Animations ===
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    const animStyle = document.createElement('style');
    animStyle.textContent = `
        .reveal-item {
            opacity: 0;
            transform: translateY(25px);
            transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-item.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .reveal-item.delay-1 { transition-delay: 100ms; }
        .reveal-item.delay-2 { transition-delay: 200ms; }
        .reveal-item.delay-3 { transition-delay: 300ms; }
    `;
    document.head.appendChild(animStyle);

    // Apply reveal to elements
    const revealSelectors = [
        '.card', '.feature-item', '.app-card', '.callout-box',
        '.size-comparison-section', '.comprar-layout', '.comprar-included',
        '.usecase-card', '.product-image-container', '.proof-metric',
        '.survey-banner', '.faq-item', '.proof-badges'
    ];

    document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
        el.classList.add('reveal-item');
        revealObserver.observe(el);
    });

    // === Timeline Step Stagger ===
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const steps = entry.target.querySelectorAll('.timeline-step');
                steps.forEach((step, i) => {
                    step.classList.add('reveal-item');
                    step.classList.add('delay-' + (i + 1));
                    // Trigger after a frame so transition kicks in
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            step.classList.add('animate-in');
                        });
                    });
                });
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timelineObserver.observe(timeline);
    }

    // === FAQ Accordion ===
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Close all other open items
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    openItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // === Counter Animation for Social Proof ===
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                if (!target) return;
                let current = 0;
                const increment = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                        el.textContent = target + '+';
                    } else {
                        el.textContent = current + '+';
                    }
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => {
        counterObserver.observe(el);
    });
});
