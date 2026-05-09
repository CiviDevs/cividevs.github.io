/**
 * CIVIDEVS — Animation Controller
 * GSAP ScrollTrigger animations and text effects
 * @version 1.0.0
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
 * Hero entrance animation
 */
function animateHero() {
    const heroTitle = document.querySelector('.hero__title-line');
    const heroName = document.querySelector('.hero__signature');
    const heroRole = document.querySelector('.hero__role');
    const heroScroll = document.querySelector('.hero__scroll-indicator');

    const tl = gsap.timeline({ delay: 0.3 });

    // Split and animate title
    if (heroTitle) {
        const chars = splitText(heroTitle, 'chars');
        gsap.set(chars, { y: '100%', opacity: 0 });
        
        tl.to(chars, {
            y: '0%',
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: 'expo.out'
        });
    }

    // Animate signature
    if (heroName) {
        gsap.set(heroName, { y: 30, opacity: 0 });
        tl.to(heroName, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'expo.out'
        }, '-=0.5');
    }

    // Animate role
    if (heroRole) {
        const words = splitText(heroRole, 'words');
        gsap.set(words, { y: 20, opacity: 0 });
        
        tl.to(words, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out'
        }, '-=0.4');
    }

    // Animate scroll indicator
    if (heroScroll) {
        gsap.set(heroScroll, { opacity: 0, y: 20 });
        tl.to(heroScroll, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out'
        }, '-=0.3');
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
 * Stats section animation — reveal + counter
 */
function animateStats() {
    const statItems = document.querySelectorAll('.stat__item');
    const statNumbers = document.querySelectorAll('[data-count]');
    
    if (!statItems.length) return;
    
    // Reveal animation with stagger
    gsap.fromTo(statItems,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.stats__bar',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    // Counter animation
    statNumbers.forEach(item => {
        const target = parseInt(item.dataset.count, 10);
        const duration = 2;
        
        gsap.fromTo(item, 
            { innerText: 0 },
            {
                innerText: target,
                duration: duration,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function() {
                    item.innerText = Math.round(this.targets()[0].innerText);
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
 * Bento grid reveal animation
 * Cells appear with individual borders drawing - no background flash
 */
function animateBentoGrid() {
    const grid = document.querySelector('.bento-grid');
    const cells = document.querySelectorAll('.bento-cell');

    if (!grid || !cells.length) return;

    // Set initial state - cells hidden, no background visible
    gsap.set(cells, {
        opacity: 0,
        clipPath: 'inset(100% 0 0 0)',
        y: 30
    });

    // Add individual borders to each cell for animation
    cells.forEach(cell => {
        if (!cell.querySelector('.bento-cell__border')) {
            const border = document.createElement('div');
            border.className = 'bento-cell__border';
            border.style.cssText = `
                position: absolute;
                inset: 0;
                border: 1px solid var(--color-border);
                opacity: 0;
                pointer-events: none;
                transition: border-color 0.3s ease, opacity 0.3s ease;
            `;
            cell.appendChild(border);
        }
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: grid,
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // All cells reveal simultaneously with staggered timing
    // Each cell: clip-path unfolds from bottom + fade + slight rise
    tl.to(cells, {
        opacity: 1,
        clipPath: 'inset(0% 0 0 0)',
        y: 0,
        duration: 0.8,
        stagger: {
            each: 0.1,
            from: 'random'
        },
        ease: 'expo.out',
        onStart: function() {
            // Fade in borders as cells appear
            cells.forEach((cell, i) => {
                const border = cell.querySelector('.bento-cell__border');
                if (border) {
                    setTimeout(() => {
                        border.style.opacity = '1';
                    }, i * 80);
                }
            });
        }
    });
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
 * About section text reveal — fast, snappy animation
 */
function animateAbout() {
    const lead = document.querySelector('.about__lead');
    const body = document.querySelector('.about__body');
    const principles = document.querySelectorAll('.principle');

    // Fast fade up for lead text (no word stagger — too slow)
    if (lead) {
        gsap.fromTo(lead,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: lead,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }

    if (body) {
        gsap.fromTo(body,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                delay: 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: body,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }

    if (principles.length) {
        gsap.fromTo(principles,
            { x: 30, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.about__principles',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
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
 * Header show/hide on scroll
 */
function animateHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    
    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: (self) => {
            const currentScroll = self.scroll();
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                gsap.to(header, {
                    y: -100,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                // Scrolling up
                gsap.to(header, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            
            lastScroll = currentScroll;
        }
    });
}

/**
 * Parallax effects for subtle depth
 */
function initParallax() {
    // Subtle parallax on hero elements
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
        document.querySelectorAll('[data-split-text], .bento-cell, .project-item, .principle').forEach(el => {
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
    animateStats();
    animateSectionHeaders();
    animateBentoGrid();
    animateProjects();
    animateAbout();
    animateContact();
    animateHeader();
    initParallax();

    // Initialize interactive components that depend on DOM being fully ready
    initRippleEffect();
    initTiltEffect();
    initLinkSweep();
    // initProjectPreview(); // Disabled - floating project preview removed
}
