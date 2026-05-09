/**
 * CIVIDEVS — Animation Controller
 * GSAP ScrollTrigger animations and text effects
 * @version 2.0.0
 */

'use strict';

import { prefersReducedMotion } from './main.js';
import { initRippleEffect, initTiltEffect, initLinkSweep } from './components.js';

/**
 * Split text into characters or words for animation
 * @param {HTMLElement} element - Element containing text to split
 * @param {string} type - 'chars' or 'words'
 * @returns {Array} Array of span elements
 */
function splitText(element, type = 'chars') {
    const text = element.textContent;
    element.innerHTML = '';
    
    if (type === 'chars') {
        const chars = text.split('');
        chars.forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            element.appendChild(span);
        });
        return element.querySelectorAll('.char');
    } else {
        const words = text.split(' ');
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            span.style.display = 'inline-block';
            element.appendChild(span);
            
            // Add space between words
            if (i < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
        return element.querySelectorAll('.word');
    }
}

/**
 * Hero entrance animation — cinematic reveal sequence
 */
function animateHero() {
    const heroLabel = document.querySelector('.hero__label');
    const heroLines = document.querySelectorAll('.hero__title-line');
    const heroDivider = document.querySelector('.hero__divider');
    const heroExpertise = document.querySelector('.hero__expertise-statement');
    const heroQualifier = document.querySelector('.hero__expertise-qualifier');
    const heroCta = document.querySelector('.hero__cta');
    const heroScroll = document.querySelector('.hero__scroll-indicator');

    const tl = gsap.timeline({ delay: 0.3 });

    // T+0.0s — Label fades up
    if (heroLabel) {
        gsap.set(heroLabel, { y: 30, opacity: 0 });
        tl.to(heroLabel, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'expo.out'
        });
    }

    // T+0.3s — Title lines stagger in
    heroLines.forEach((line, i) => {
        const chars = splitText(line, 'chars');
        gsap.set(chars, { y: '100%', opacity: 0 });
        
        tl.to(chars, {
            y: '0%',
            opacity: 1,
            duration: 1,
            stagger: i === 0 ? 0.04 : 0.06,
            ease: 'expo.out'
        }, i === 0 ? '-=0.3' : '-=0.5');
    });

    // T+1.2s — Divider draws from center
    if (heroDivider) {
        gsap.set(heroDivider, { width: 0, opacity: 1 });
        tl.to(heroDivider, {
            width: 80,
            duration: 0.6,
            ease: 'expo.out'
        }, '-=0.4');
    }

    // T+1.4s — Expertise statement words fade up
    if (heroExpertise) {
        const words = splitText(heroExpertise, 'words');
        gsap.set(words, { y: 20, opacity: 0 });
        
        tl.to(words, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'expo.out'
        }, '-=0.3');
    }

    // T+1.6s — Qualifier fades up
    if (heroQualifier) {
        gsap.set(heroQualifier, { y: 15, opacity: 0 });
        tl.to(heroQualifier, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'expo.out'
        }, '-=0.3');
    }

    // T+1.8s — CTA scales in
    if (heroCta) {
        gsap.set(heroCta, { scale: 0.9, opacity: 0 });
        tl.to(heroCta, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'expo.out'
        }, '-=0.2');
    }

    // T+2.2s — Scroll indicator
    if (heroScroll) {
        gsap.set(heroScroll, { opacity: 0, y: 20 });
        tl.to(heroScroll, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out'
        }, '-=0.1');
    }
}

/**
 * Section dividers animation on scroll
 */
function animateSectionDividers() {
    const dividers = document.querySelectorAll('[data-animate-line]');
    
    dividers.forEach(divider => {
        gsap.fromTo(divider, 
            { width: '0%' },
            {
                width: '100%',
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: divider,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/**
 * Section headers reveal animation
 */
function animateSectionHeaders() {
    const headers = document.querySelectorAll('.section-header');
    
    headers.forEach(header => {
        const label = header.querySelector('.section-header__label');
        const title = header.querySelector('.section-header__title');
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        if (label) {
            gsap.set(label, { y: 20, opacity: 0 });
            tl.to(label, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'expo.out'
            });
        }

        if (title) {
            gsap.set(title, { y: 30, opacity: 0 });
            tl.to(title, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'expo.out'
            }, '-=0.4');
        }
    });
}

/**
 * Services cards reveal animation
 */
function animateServices() {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.services__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
}

/**
 * Why Us section reveal
 */
function animateWhy() {
    const lead = document.querySelector('.why__lead');
    const cards = document.querySelectorAll('.why__card');

    if (lead) {
        gsap.fromTo(lead,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: lead,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }

    if (cards.length) {
        gsap.fromTo(cards,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.why__grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
}

/**
 * Project items reveal animation
 */
function animateProjects() {
    const items = document.querySelectorAll('.project-item');
    
    items.forEach((item, index) => {
        gsap.fromTo(item,
            { x: -30, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/**
 * Testimonials reveal animation
 */
function animateTestimonials() {
    const items = document.querySelectorAll('.testimonial');
    if (!items.length) return;

    gsap.fromTo(items,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.testimonials__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
}

/**
 * Process steps reveal animation
 */
function animateProcess() {
    const steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    gsap.fromTo(steps,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.process__steps',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
}

/**
 * FAQ items reveal
 */
function animateFaq() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    gsap.fromTo(items,
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.faq__list',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );
}

/**
 * Contact section reveal
 */
function animateContact() {
    const label = document.querySelector('.contact__label');
    const title = document.querySelector('.contact__title');
    const email = document.querySelector('.contact__email');
    const links = document.querySelectorAll('.contact__link');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 60%',
            toggleActions: 'play none none none'
        }
    });

    if (label) {
        gsap.set(label, { y: 20, opacity: 0 });
        tl.to(label, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'expo.out'
        });
    }

    if (title) {
        const words = splitText(title, 'words');
        gsap.set(words, { y: 40, opacity: 0 });
        
        tl.to(words, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out'
        }, '-=0.3');
    }

    if (email) {
        gsap.set(email, { y: 30, opacity: 0 });
        tl.to(email, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'expo.out'
        }, '-=0.4');
    }

    if (links.length) {
        gsap.set(links, { y: 20, opacity: 0 });
        tl.to(links, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out'
        }, '-=0.3');
    }
}

/**
 * Header show/hide on scroll with CTA morph
 */
function animateHeader() {
    const header = document.getElementById('header');
    const navCta = document.getElementById('navCta');
    if (!header) return;

    let lastScroll = 0;
    
    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: (self) => {
            const currentScroll = self.scroll();
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down — hide header
                gsap.to(header, {
                    y: -100,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                // Scrolling up — show header
                gsap.to(header, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            // CTA morph — when past hero, change to filled style
            if (navCta) {
                if (currentScroll > window.innerHeight * 0.8) {
                    navCta.classList.add('header__link--filled');
                } else {
                    navCta.classList.remove('header__link--filled');
                }
            }
            
            lastScroll = currentScroll;
        }
    });
}

/**
 * Parallax effects for subtle depth
 */
function initParallax() {
    const heroContent = document.querySelector('.hero__content');
    
    if (heroContent) {
        gsap.to(heroContent, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

/**
 * Initialize all animations
 */
export function initAnimations() {
    if (prefersReducedMotion()) {
        // Just make everything visible without animations
        document.querySelectorAll(
            '[data-split-text], .service-card, .project-item, .why__card, ' +
            '.testimonial, .process-step, .faq-item, .hero__label, ' +
            '.hero__divider, .hero__cta, .hero__expertise-qualifier'
        ).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Run animations
    animateHero();
    animateSectionDividers();
    animateSectionHeaders();
    animateServices();
    animateWhy();
    animateProjects();
    animateTestimonials();
    animateProcess();
    animateFaq();
    animateContact();
    animateHeader();
    initParallax();

    // Initialize interactive components
    initRippleEffect();
    initTiltEffect();
    initLinkSweep();
}
