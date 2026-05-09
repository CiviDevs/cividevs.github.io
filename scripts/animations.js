/**
 * CIVIDEVS — Animation Controller
 * GSAP ScrollTrigger animations and text effects
 * @version 2.0.0
 */

'use strict';

import { prefersReducedMotion } from './main.js';
import { initRippleEffect, initTiltEffect, initLinkSweep, initMagneticEffect, initContactHub } from './components.js';

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
            const wrapper = document.createElement('span');
            wrapper.className = 'char-wrap';
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';

            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform';
            
            wrapper.appendChild(span);
            element.appendChild(wrapper);
        });
        return element.querySelectorAll('.char');
    } else {
        const words = text.split(' ');
        words.forEach((word, i) => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-wrap';
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';

            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform';
            
            wrapper.appendChild(span);
            element.appendChild(wrapper);
            
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

    // T+0.3s — Title lines stagger in (Masked Skew Reveal)
    heroLines.forEach((line, i) => {
        const chars = splitText(line, 'chars');
        gsap.set(chars, { y: '110%', skewY: 10 });
        
        tl.to(chars, {
            y: '0%',
            skewY: 0,
            duration: 1.2,
            stagger: i === 0 ? 0.04 : 0.06,
            ease: 'expo.out'
        }, i === 0 ? '-=0.3' : '-=0.6');
    });

    // T+1.2s — Divider draws from center
    if (heroDivider) {
        gsap.set(heroDivider, { width: 0, opacity: 1 });
        tl.to(heroDivider, {
            width: 80,
            duration: 0.8,
            ease: 'expo.out'
        }, '-=0.6');
    }

    // T+1.4s — Expertise statement words fade up
    if (heroExpertise) {
        const words = splitText(heroExpertise, 'words');
        gsap.set(words, { y: '100%', opacity: 0 });
        
        tl.to(words, {
            y: '0%',
            opacity: 1,
            duration: 1,
            stagger: 0.02,
            ease: 'expo.out'
        }, '-=0.6');
    }

    // T+1.6s — Qualifier & CTA fade up
    if (heroQualifier && heroCta) {
        gsap.set([heroQualifier, heroCta], { y: 20, opacity: 0 });
        tl.to([heroQualifier, heroCta], {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'expo.out'
        }, '-=0.8');
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
 * Services pillars reveal + accordion toggle
 */
function animateServices() {
    const pillars = document.querySelectorAll('.service-pillar');
    if (!pillars.length) return;

    // Stagger reveal
    gsap.fromTo(pillars,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.services__list',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Accordion toggle logic
    pillars.forEach(pillar => {
        const header = pillar.querySelector('.service-pillar__header');
        if (!header) return;

        header.addEventListener('click', () => {
            const wasOpen = pillar.classList.contains('is-open');
            
            // Close all others
            pillars.forEach(p => p.classList.remove('is-open'));
            
            // Toggle current
            if (!wasOpen) {
                pillar.classList.add('is-open');
            }
            
            // Refresh ScrollTrigger after CSS transition to recalculate trigger positions
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 550); // Matches --duration-slow plus a tiny buffer
        });
    });

    // Nudge link reveal
    const nudge = document.querySelector('.services__nudge');
    if (nudge) {
        gsap.fromTo(nudge,
            { y: 15, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: nudge,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
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

    // Nudge link
    const nudge = document.querySelector('.why__nudge');
    if (nudge) {
        gsap.fromTo(nudge,
            { y: 15, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, ease: 'expo.out',
                scrollTrigger: { trigger: nudge, start: 'top 90%', toggleActions: 'play none none none' }
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

    // Animate metric badges inside project items
    const badges = document.querySelectorAll('.metric-badge');
    if (badges.length) {
        gsap.fromTo(badges,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.projects__list',
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
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

    // Refresh ScrollTrigger when FAQ details are toggled
    items.forEach(item => {
        item.addEventListener('toggle', () => {
            // Need a slight delay for the DOM to fully render the opened state
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 50);
        });
    });
}

/**
 * Contact section reveal
 */
function animateContact() {
    const title = document.querySelector('.contact__title');
    const subheadline = document.querySelector('.contact__subheadline');
    const nodes = document.querySelectorAll('.contact__node');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 60%',
            toggleActions: 'play none none none'
        }
    });

    if (title) {
        const words = splitText(title, 'words');
        gsap.set(words, { y: '100%', opacity: 0 });
        
        tl.to(words, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: 'expo.out'
        });
    }

    if (subheadline) {
        gsap.set(subheadline, { y: 20, opacity: 0 });
        tl.to(subheadline, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'expo.out'
        }, '-=0.4');
    }

    if (nodes.length) {
        gsap.set(nodes, { y: 40, opacity: 0 });
        tl.to(nodes, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out'
        }, '-=0.4');
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
    let isHidden = false;
    let isFilled = false;
    
    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: (self) => {
            const currentScroll = self.scroll();
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down — hide header
                if (!isHidden) {
                    gsap.to(header, {
                        yPercent: -100,
                        duration: 0.3,
                        ease: 'power2.out',
                        overwrite: true
                    });
                    isHidden = true;
                }
            } else {
                // Scrolling up — show header
                if (isHidden || currentScroll <= 100) {
                    gsap.to(header, {
                        yPercent: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                        overwrite: true
                    });
                    isHidden = false;
                }
            }

            // CTA morph — when past hero, change to filled style
            if (navCta) {
                const shouldBeFilled = currentScroll > window.innerHeight * 0.8;
                if (shouldBeFilled !== isFilled) {
                    if (shouldBeFilled) {
                        navCta.classList.add('header__link--filled');
                    } else {
                        navCta.classList.remove('header__link--filled');
                    }
                    isFilled = shouldBeFilled;
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
 * Intent CTA visibility logic
 */
function animateIntentCta() {
    const cta = document.getElementById('intentCta');
    const triggerSection = document.getElementById('services'); // Show after passing services
    
    if (!cta || !triggerSection) return;

    ScrollTrigger.create({
        trigger: triggerSection,
        start: 'top 30%', // When top of services hits 30% of viewport
        end: () => `+=${document.documentElement.scrollHeight}`,
        onEnter: () => cta.classList.add('is-visible'),
        onLeaveBack: () => cta.classList.remove('is-visible')
    });
}

/**
 * Initialize all animations
 */
export function initAnimations() {
    if (prefersReducedMotion()) {
        // Just make everything visible without animations
        document.querySelectorAll(
            '[data-split-text], .service-pillar, .project-item, .why__card, ' +
            '.testimonial, .process-step, .faq-item, .hero__label, ' +
            '.hero__divider, .hero__cta, .hero__expertise-qualifier, ' +
            '.metric-badge, .nudge-link, .services__intro'
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
    animateIntentCta();
    initParallax();

    // Initialize interactive components
    initRippleEffect();
    initTiltEffect();
    initLinkSweep();
    initMagneticEffect();

    // Global resize observer to fix ScrollTrigger bugs on dynamic height changes
    const ro = new ResizeObserver(() => {
        ScrollTrigger.refresh();
    });
    ro.observe(document.body);
}
