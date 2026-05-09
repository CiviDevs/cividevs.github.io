/**
 * CIVIDEVS — Interactive Components
 * Custom cursor, magnetic buttons, and UI interactions
 * @version 1.0.0
 */

'use strict';

import { prefersReducedMotion } from './main.js';

/**
 * ════════════════════════════════════════════════════════════════
 * AGENCY CONTACT CONFIGURATION
 * Edit these values to instantly update all contact links across the site.
 * ════════════════════════════════════════════════════════════════
 */
export const AGENCY_CONFIG = {
    email: 'cividevs@gmail.com',
    phone: '+393715207035',          // International format (e.g., +1234567890)
    whatsapp: '3715207035',        // Just numbers, no spaces or plus signs
    telegram: 'cividev',          // Telegram username without '@'
    github: 'cividevs'             // GitHub username
};

/**
 * Custom Cursor with inversion effect
 */
export function initCustomCursor() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (prefersReducedMotion()) return;

    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    let isActive = true;
    let rafId = null;

    // Mouse move handler
    const onMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    // Animation loop
    const animate = () => {
        if (!isActive) return;

        // Smooth follow for main cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Slower follow for follower
        if (cursorFollower) {
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;

            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
        }

        rafId = requestAnimationFrame(animate);
    };

    // Hover states
    const addHoverListeners = () => {
        const hoverElements = document.querySelectorAll('a, button, [role="button"], [data-magnetic], .bento-cell, .service-pillar, .project-item, .why__card, .testimonial, .process-step');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('is-hovering');
                if (cursorFollower) cursorFollower.classList.add('is-hovering');
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-hovering');
                if (cursorFollower) cursorFollower.classList.remove('is-hovering');
            });
        });
    };

    // Click states
    const onMouseDown = () => cursor.classList.add('is-clicking');
    const onMouseUp = () => cursor.classList.remove('is-clicking');

    // Visibility handling
    const onVisibilityChange = () => {
        if (document.hidden) {
            isActive = false;
            if (rafId) cancelAnimationFrame(rafId);
        } else {
            isActive = true;
            animate();
        }
    };

    // Initialize
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Initial hover listeners
    addHoverListeners();

    // Re-apply hover listeners after preloader completes (new elements may appear)
    document.addEventListener('preloader:complete', addHoverListeners);

    // Show follower after a brief delay
    if (cursorFollower) {
        setTimeout(() => {
            cursorFollower.classList.add('is-visible');
        }, 100);
    }

    // Start animation loop
    animate();
}

/**
 * Ripple effect for buttons and cards
 * Creates a subtle ripple emanating from cursor position on hover
 */
export function initRippleEffect() {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rippleElements = document.querySelectorAll('[data-ripple], .btn, .bento-cell, .service-pillar, .project-item, .why__card');

    rippleElements.forEach(el => {
        el.style.position = 'relative';
        el.style.overflow = 'hidden';

        el.addEventListener('mouseenter', (e) => {
            // Remove any existing ripples first (prevents stacking)
            const existingRipples = el.querySelectorAll('.ripple');
            existingRipples.forEach(r => r.remove());

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check current theme
            const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
            const rippleColor = isLightTheme
                ? 'radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)';

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: ${rippleColor};
                transform: scale(0);
                pointer-events: none;
                width: 200%;
                padding-bottom: 200%;
                left: ${x - rect.width}px;
                top: ${y - rect.height / 2}px;
                transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
            `;

            el.appendChild(ripple);

            // Trigger animation
            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(1)';
            });
        });

        el.addEventListener('mouseleave', function () {
            // Remove ALL ripples, not just the first one
            const ripples = el.querySelectorAll('.ripple');
            ripples.forEach(ripple => {
                ripple.style.opacity = '0';
                ripple.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (ripple.parentNode) ripple.remove();
                }, 300);
            });
        });

        // Safety: clear any stuck ripples when mouse leaves document
        document.addEventListener('mouseleave', () => {
            const allRipples = el.querySelectorAll('.ripple');
            allRipples.forEach(r => r.remove());
        });
    });
}

/**
 * Tilt effect for bento cards - subtle 3D rotation based on hover position
 */
export function initTiltEffect() {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltElements = document.querySelectorAll('.bento-cell');
    const activeElements = new Map();
    let mouseX = 0;
    let mouseY = 0;
    let rafId = null;

    const updateTilt = () => {
        activeElements.forEach((isActive, el) => {
            if (!isActive) return;

            const rect = el.getBoundingClientRect();
            const x = mouseX - rect.left;
            const y = mouseY - rect.top;

            // Проверка что курсор всё ещё над элементом
            if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
                activeElements.set(el, false);
                el.style.transform = '';
                return;
            }

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        if (activeElements.size > 0) {
            rafId = requestAnimationFrame(updateTilt);
        } else {
            rafId = null;
        }
    };

    tiltElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            activeElements.set(el, true);
            if (!rafId) {
                rafId = requestAnimationFrame(updateTilt);
            }
        });

        el.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        el.addEventListener('mouseleave', () => {
            activeElements.set(el, false);
            el.style.transform = '';
        });
    });

    // Сброс всех tilt при возврате на вкладку
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            activeElements.forEach((_, el) => {
                el.style.transform = '';
            });
            activeElements.clear();
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }
    });
}

/**
 * Link sweep effect - line sweeps across on hover
 */
export function initLinkSweep() {
    if (prefersReducedMotion()) return;

    const links = document.querySelectorAll('.header__link:not(.header__link--cta), .contact__link');

    links.forEach(link => {
        // Check if already has sweep element
        if (link.querySelector('.link-sweep')) return;

        const sweep = document.createElement('span');
        sweep.className = 'link-sweep';
        sweep.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: currentColor;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        `;

        link.style.position = 'relative';
        link.appendChild(sweep);

        link.addEventListener('mouseenter', () => {
            sweep.style.transform = 'scaleX(1)';
            sweep.style.transformOrigin = 'left';
        });

        link.addEventListener('mouseleave', () => {
            sweep.style.transform = 'scaleX(0)';
            sweep.style.transformOrigin = 'right';
        });
    });
}

/**
 * Floating project preview that follows cursor
 */
export function initProjectPreview() {
    const preview = document.getElementById('projectPreview');
    const previewImg = preview?.querySelector('.project-preview__img');
    const projectItems = document.querySelectorAll('[data-project]');

    if (!preview || !previewImg || projectItems.length === 0) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (prefersReducedMotion()) return;

    let currentProject = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    let isVisible = false;

    // Project images (using placeholder colors - replace with actual images)
    const projectImages = {
        fintech: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80',
        healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&q=80',
        ecommerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80',
        ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&q=80',
    };

    const animate = () => {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        // Offset preview from cursor
        const offsetX = 20;
        const offsetY = 20;

        preview.style.left = `${currentX + offsetX}px`;
        preview.style.top = `${currentY + offsetY}px`;

        if (isVisible) {
            rafId = requestAnimationFrame(animate);
        }
    };

    projectItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const project = item.dataset.project;
            if (projectImages[project]) {
                previewImg.src = projectImages[project];
                previewImg.alt = `${project} project preview`;
                currentProject = project;

                isVisible = true;
                preview.classList.add('is-visible');

                // Get initial position
                targetX = e.clientX;
                targetY = e.clientY;
                currentX = targetX;
                currentY = targetY;

                animate();
            }
        });

        item.addEventListener('mouseleave', () => {
            isVisible = false;
            preview.classList.remove('is-visible');
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });

        item.addEventListener('mousemove', (e) => {
            if (isVisible) {
                targetX = e.clientX;
                targetY = e.clientY;
            }
        });
    });
}

/**
 * Magnetic effect for buttons - pull elements toward cursor
 */
export function initMagneticEffect() {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const magneticElements = document.querySelectorAll('.btn, .header__utility-btn, .contact__node');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate distance from center (-1 to 1)
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            // Subtle movement: 10px max
            gsap.to(el, {
                x: x * 10,
                y: y * 10,
                duration: 0.4,
                ease: "power2.out"
            });

            // Move child elements slightly more for parallax
            const inner = el.querySelector('span, svg, .header__utility-icon');
            if (inner) {
                gsap.to(inner, {
                    x: x * 4,
                    y: y * 4,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
            const inner = el.querySelector('span, svg, .header__utility-icon');
            if (inner) {
                gsap.to(inner, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });
}

/**
 * Initialize Contact Hub specific interactions (Copy to Clipboard)
 */
export function initContactHub() {
    // 1. Inject links from AGENCY_CONFIG
    const phoneLink = document.querySelector('.contact__node--phone');
    if (phoneLink) phoneLink.href = `tel:${AGENCY_CONFIG.phone}`;

    const waLink = document.querySelector('.contact__node--whatsapp');
    if (waLink) waLink.href = `https://wa.me/${AGENCY_CONFIG.whatsapp}`;

    const tgLink = document.querySelector('.contact__node--telegram');
    if (tgLink) tgLink.href = `https://t.me/${AGENCY_CONFIG.telegram}`;

    const ghLink = document.querySelector('.contact__node--github');
    if (ghLink) ghLink.href = `https://github.com/${AGENCY_CONFIG.github}`;

    // 2. Setup Email Copy-to-Clipboard
    const emailBtn = document.getElementById('emailCopyBtn');
    if (!emailBtn) return;

    emailBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Open default email client
        window.location.href = `mailto:${AGENCY_CONFIG.email}`;

        try {
            await navigator.clipboard.writeText(AGENCY_CONFIG.email);
            const tooltip = emailBtn.querySelector('.contact__tooltip');
            if (tooltip) {
                tooltip.classList.add('is-active');
                setTimeout(() => {
                    tooltip.classList.remove('is-active');
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    });
}

/**
 * Initialize About Us Modal
 */
export function initAboutModal() {
    const modal = document.getElementById('aboutModal');
    const openBtns = [
        document.getElementById('openAboutModal'),
        document.getElementById('openAboutModalMobile'),
        document.getElementById('openAboutModalDock')
    ];
    const closeBtn = document.getElementById('aboutModalClose');
    const overlay = document.getElementById('aboutModalOverlay');

    if (!modal) return;

    function openModal(e) {
        if (e) e.preventDefault();

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

/**
 * Initialize all components
 */
export function initComponents() {
    initCustomCursor();
    initRippleEffect();
    initTiltEffect();
    initLinkSweep();
    initMagneticEffect();
    initContactHub();
    initAboutModal();
    // initProjectPreview(); // Disabled - floating project preview removed
}
