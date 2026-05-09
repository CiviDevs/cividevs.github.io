/**
 * CIVIDEVS — Main Entry Point
 * Initializes Lenis smooth scroll, GSAP plugins, and all modules
 * @version 1.0.0
 */

'use strict';

// Import modules
import { initCustomCursor } from './components.js';
import { initAnimations } from './animations.js';

/**
 * Initialize Lenis smooth scroll
 * @returns {Lenis} Lenis instance
 */
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    // RAF loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger to Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Store lenis globally for anchor links
    window.lenis = lenis;

    return lenis;
}

/**
 * Handle anchor link smooth scrolling
 */
function initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target && window.lenis) {
                e.preventDefault();
                window.lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.5,
                });
            }
        });
    });
}

/**
 * Preloader animation sequence
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderLine = preloader?.querySelector('.preloader__line');
    
    if (!preloader || !preloaderLine) return;

    const tl = gsap.timeline({
        onComplete: () => {
            preloader.classList.add('is-complete');
            // Trigger entrance animations after preloader
            document.dispatchEvent(new CustomEvent('preloader:complete'));
            
            // Remove preloader from DOM after fade out
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    tl.to(preloaderLine, {
        height: '100vh',
        duration: 1.2,
        ease: 'expo.inOut'
    })
    .to(preloaderLine, {
        width: '100vw',
        height: '100vh',
        duration: 0.8,
        ease: 'expo.inOut'
    })
    .to(preloaderLine, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
}

/**
 * Check if reduced motion is preferred
 * @returns {boolean}
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Theme Toggle functionality
 * Handles theme switching between dark and light modes - Text button style
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const STORAGE_KEY = 'cividevs-theme';

    // Get saved theme or default to dark
    const getSavedTheme = () => {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'dark';
        } catch (e) {
            return 'dark';
        }
    };

    // Save theme preference
    const saveTheme = (theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // Ignore localStorage errors
        }
    };

    // Apply theme to document
    const applyTheme = (theme) => {
        if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else {
            html.removeAttribute('data-theme');
        }
    };

    // Toggle between themes
    const toggleTheme = () => {
        const currentTheme = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        saveTheme(newTheme);
    };

    // Initialize
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    // Event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
        // Only apply if no saved preference
        try {
            const hasSaved = localStorage.getItem(STORAGE_KEY);
            if (!hasSaved) {
                const newTheme = e.matches ? 'light' : 'dark';
                applyTheme(newTheme);
            }
        } catch (e) {
            // Ignore
        }
    });
}

/**
 * Translations dictionary
 */
const translations = {
    en: {
        // Navigation
        nav_solutions: 'Solutions',
        nav_work: 'Work',
        nav_about: 'About',
        nav_contact: 'Contact',

        // Hero
        hero_role: 'Lead Developer / Project Manager',
        hero_scroll: 'Scroll',

        // Stats
        stat_projects: 'PROJECTS',
        stat_years: 'YEARS',
        stat_satisfaction: 'SATISFACTION',
        stat_support: 'SUPPORT',

        // Solutions section
        solutions_title: 'Solutions',
        solutions_label_strategy: 'Strategy',
        solutions_title_digital: 'Digital Transformation',
        solutions_desc_digital: 'End-to-end digital strategy and implementation for enterprise-scale solutions.',
        solutions_label_dev: 'Development',
        solutions_title_fullstack: 'Full-Stack Engineering',
        solutions_desc_fullstack: 'React, Node, Python, cloud-native architectures.',
        solutions_label_design: 'Design',
        solutions_title_uiux: 'UI/UX Excellence',
        solutions_desc_uiux: 'Interface design that converts users into customers.',
        solutions_label_mgmt: 'Management',
        solutions_title_agile: 'Agile Project Delivery',
        solutions_desc_agile: 'Certified Scrum Master. On-time, on-budget, every time.',
        solutions_label_perf: 'Performance',
        solutions_title_speed: 'Speed Optimization',
        solutions_desc_speed: 'Core Web Vitals mastery. Sub-100ms interactions.',
        solutions_label_security: 'Security',
        solutions_title_security: 'Enterprise Security',
        solutions_desc_security: 'SOC 2, GDPR, penetration testing, compliance.',

        // Work section
        work_title: 'Selected Work',
        work_cat_fintech: 'Fintech',
        work_title_fintech: 'Quantum Banking',
        work_cat_healthcare: 'Healthcare',
        work_title_healthcare: 'MedSync Platform',
        work_cat_ecommerce: 'E-Commerce',
        work_title_ecommerce: 'Luxe Retail OS',
        work_cat_ai: 'AI/ML',
        work_title_ai: 'Neural Analytics',

        // About section
        about_title: 'Approach',
        about_lead: 'Precision engineering meets bold creativity. Every project is a balance of technical excellence and human-centered design.',
        about_body: 'With over 8 years leading cross-functional teams, I bring a rare combination of deep technical expertise and strategic vision. From Fortune 500 enterprises to disruptive startups, the focus remains constant: deliver digital products that perform at scale.',
        about_p1_title: 'Performance First',
        about_p1_desc: 'Speed is a feature. Every millisecond matters.',
        about_p2_title: 'Clean Architecture',
        about_p2_desc: 'Code that scales, maintains, and evolves.',
        about_p3_title: 'Transparent Process',
        about_p3_desc: 'No black boxes. Full visibility, always.',

        // Contact section
        contact_label: '[ Start a Project ]',
        contact_title: "Let's build something exceptional.",
        contact_email: 'hello@cividevs.com',
        contact_linkedin: 'LinkedIn',
        contact_github: 'GitHub',
        contact_twitter: 'Twitter',

        // Footer
        footer_copy: '© 2024 All Rights Reserved',
        footer_location: 'Global · Remote · Available'
    },
    it: {
        // Navigation
        nav_solutions: 'Soluzioni',
        nav_work: 'Lavori',
        nav_about: 'Chi Siamo',
        nav_contact: 'Contatti',

        // Hero
        hero_role: 'Lead Developer / Project Manager',
        hero_scroll: 'Scorri',

        // Stats
        stat_projects: 'PROGETTI',
        stat_years: 'ANNI',
        stat_satisfaction: 'SODDISFAZIONE',
        stat_support: 'SUPPORTO',

        // Solutions section
        solutions_title: 'Soluzioni',
        solutions_label_strategy: 'Strategia',
        solutions_title_digital: 'Trasformazione Digitale',
        solutions_desc_digital: 'Strategia digitale end-to-end e implementazione per soluzioni enterprise.',
        solutions_label_dev: 'Sviluppo',
        solutions_title_fullstack: 'Ingegneria Full-Stack',
        solutions_desc_fullstack: 'React, Node, Python, architetture cloud-native.',
        solutions_label_design: 'Design',
        solutions_title_uiux: 'Eccellenza UI/UX',
        solutions_desc_uiux: 'Design di interfacce che convertono utenti in clienti.',
        solutions_label_mgmt: 'Gestione',
        solutions_title_agile: 'Consegna Agile',
        solutions_desc_agile: 'Scrum Master certificato. In tempo, nel budget, sempre.',
        solutions_label_perf: 'Performance',
        solutions_title_speed: 'Ottimizzazione Velocità',
        solutions_desc_speed: 'Maestria Core Web Vitals. Interazioni sotto i 100ms.',
        solutions_label_security: 'Sicurezza',
        solutions_title_security: 'Sicurezza Enterprise',
        solutions_desc_security: 'SOC 2, GDPR, penetration testing, compliance.',

        // Work section
        work_title: 'Lavori Selezionati',
        work_cat_fintech: 'Fintech',
        work_title_fintech: 'Quantum Banking',
        work_cat_healthcare: 'Healthcare',
        work_title_healthcare: 'Piattaforma MedSync',
        work_cat_ecommerce: 'E-Commerce',
        work_title_ecommerce: 'Luxe Retail OS',
        work_cat_ai: 'AI/ML',
        work_title_ai: 'Neural Analytics',

        // About section
        about_title: 'Approccio',
        about_lead: "L'ingegneria di precisione incontra la creatività audace. Ogni progetto è un equilibrio tra eccellenza tecnica e design centrato sull'utente.",
        about_body: "Con oltre 8 anni di leadership di team cross-funzionali, porto una rara combinazione di profonda competenza tecnica e visione strategica. Dalle imprese Fortune 500 alle startup disruptive, l'attenzione rimane costante: consegnare prodotti digitali che performano su larga scala.",
        about_p1_title: 'Performance First',
        about_p1_desc: 'La velocità è una feature. Ogni millisecondo conta.',
        about_p2_title: 'Architettura Pulita',
        about_p2_desc: 'Codice che scala, si mantiene e si evolve.',
        about_p3_title: 'Processo Trasparente',
        about_p3_desc: 'Niente scatole nere. Piena visibilità, sempre.',

        // Contact section
        contact_label: '[ Inizia un Progetto ]',
        contact_title: 'Costruiamo qualcosa di eccezionale.',
        contact_email: 'hello@cividevs.com',
        contact_linkedin: 'LinkedIn',
        contact_github: 'GitHub',
        contact_twitter: 'Twitter',

        // Footer
        footer_copy: '© 2024 Tutti i Diritti Riservati',
        footer_location: 'Globale · Remoto · Disponibile'
    }
};

/**
 * Language Toggle functionality
 * Handles language switching with dropdown
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const langBtn = document.getElementById('langBtn');
    const langOptions = document.querySelectorAll('.header__utility-option');
    const html = document.documentElement;
    const STORAGE_KEY = 'cividevs-lang';

    // Get saved language or default to English
    const getSavedLang = () => {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'en';
        } catch (e) {
            return 'en';
        }
    };

    // Save language preference
    const saveLang = (lang) => {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // Ignore localStorage errors
        }
    };

    // Apply translations to the page
    const applyTranslations = (lang) => {
        const t = translations[lang];
        if (!t) return;

        // Update lang attribute
        html.setAttribute('lang', lang);

        // Navigation
        updateText('[href="#solutions"]', t.nav_solutions);
        updateText('[href="#work"]', t.nav_work);
        updateText('[href="#about"]', t.nav_about);
        updateText('.header__link--cta', t.nav_contact);

        // Hero
        updateText('.hero__role', t.hero_role, true);
        updateText('.hero__scroll-text', t.hero_scroll);

        // Stats
        updateText('.stat__item:nth-child(1) .stat__label', t.stat_projects);
        updateText('.stat__item:nth-child(3) .stat__label', t.stat_years);
        updateText('.stat__item:nth-child(5) .stat__label', t.stat_satisfaction);
        updateText('.stat__item:nth-child(7) .stat__label', t.stat_support);

        // Solutions
        updateText('.solutions .section-header__title', t.solutions_title);
        const bentoLabels = document.querySelectorAll('.bento-cell__label');
        if (bentoLabels[0]) bentoLabels[0].textContent = t.solutions_label_strategy;
        if (bentoLabels[1]) bentoLabels[1].textContent = t.solutions_label_dev;
        if (bentoLabels[2]) bentoLabels[2].textContent = t.solutions_label_design;
        if (bentoLabels[3]) bentoLabels[3].textContent = t.solutions_label_mgmt;
        if (bentoLabels[4]) bentoLabels[4].textContent = t.solutions_label_perf;
        if (bentoLabels[5]) bentoLabels[5].textContent = t.solutions_label_security;

        const bentoTitles = document.querySelectorAll('.bento-cell__title');
        if (bentoTitles[0]) bentoTitles[0].textContent = t.solutions_title_digital;
        if (bentoTitles[1]) bentoTitles[1].textContent = t.solutions_title_fullstack;
        if (bentoTitles[2]) bentoTitles[2].textContent = t.solutions_title_uiux;
        if (bentoTitles[3]) bentoTitles[3].textContent = t.solutions_title_agile;
        if (bentoTitles[4]) bentoTitles[4].textContent = t.solutions_title_speed;
        if (bentoTitles[5]) bentoTitles[5].textContent = t.solutions_title_security;

        const bentoDescs = document.querySelectorAll('.bento-cell__desc');
        if (bentoDescs[0]) bentoDescs[0].textContent = t.solutions_desc_digital;
        if (bentoDescs[1]) bentoDescs[1].textContent = t.solutions_desc_fullstack;
        if (bentoDescs[2]) bentoDescs[2].textContent = t.solutions_desc_uiux;
        if (bentoDescs[3]) bentoDescs[3].textContent = t.solutions_desc_agile;
        if (bentoDescs[4]) bentoDescs[4].textContent = t.solutions_desc_speed;
        if (bentoDescs[5]) bentoDescs[5].textContent = t.solutions_desc_security;

        // Work
        updateText('.projects .section-header__title', t.work_title);
        const projectCats = document.querySelectorAll('.project-item__cat');
        if (projectCats[0]) projectCats[0].textContent = t.work_cat_fintech;
        if (projectCats[1]) projectCats[1].textContent = t.work_cat_healthcare;
        if (projectCats[2]) projectCats[2].textContent = t.work_cat_ecommerce;
        if (projectCats[3]) projectCats[3].textContent = t.work_cat_ai;

        const projectTitles = document.querySelectorAll('.project-item__title');
        if (projectTitles[0]) projectTitles[0].textContent = t.work_title_fintech;
        if (projectTitles[1]) projectTitles[1].textContent = t.work_title_healthcare;
        if (projectTitles[2]) projectTitles[2].textContent = t.work_title_ecommerce;
        if (projectTitles[3]) projectTitles[3].textContent = t.work_title_ai;

        // About
        updateText('.about .section-header__title', t.about_title);
        const aboutLead = document.querySelector('.about__lead');
        if (aboutLead) {
            aboutLead.textContent = t.about_lead;
            // Re-trigger split text animation if needed
            if (aboutLead.hasAttribute('data-split-text')) {
                aboutLead.setAttribute('data-split-text', '');
            }
        }
        updateText('.about__body', t.about_body);

        const principles = document.querySelectorAll('.principle');
        if (principles[0]) {
            principles[0].querySelector('.principle__title').textContent = t.about_p1_title;
            principles[0].querySelector('.principle__desc').textContent = t.about_p1_desc;
        }
        if (principles[1]) {
            principles[1].querySelector('.principle__title').textContent = t.about_p2_title;
            principles[1].querySelector('.principle__desc').textContent = t.about_p2_desc;
        }
        if (principles[2]) {
            principles[2].querySelector('.principle__title').textContent = t.about_p3_title;
            principles[2].querySelector('.principle__desc').textContent = t.about_p3_desc;
        }

        // Contact
        updateText('.contact__label', t.contact_label);
        const contactTitle = document.querySelector('.contact__title');
        if (contactTitle) {
            contactTitle.textContent = t.contact_title;
            if (contactTitle.hasAttribute('data-split-text')) {
                contactTitle.setAttribute('data-split-text', '');
            }
        }

        const contactLinks = document.querySelectorAll('.contact__link');
        if (contactLinks[0]) contactLinks[0].textContent = t.contact_linkedin;
        if (contactLinks[1]) contactLinks[1].textContent = t.contact_github;
        if (contactLinks[2]) contactLinks[2].textContent = t.contact_twitter;

        // Footer
        updateText('.footer__copy', t.footer_copy);
        updateText('.footer__location', t.footer_location);
    };

    // Helper to update text content
    const updateText = (selector, text, useSplit = false) => {
        const el = document.querySelector(selector);
        if (el) {
            el.textContent = text;
        }
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        langToggle.classList.toggle('is-open');
    };

    // Close dropdown
    const closeDropdown = () => {
        langToggle.classList.remove('is-open');
    };

    // Set language
    const setLanguage = (lang) => {
        // Update active state on options
        langOptions.forEach(opt => {
            opt.classList.toggle('is-active', opt.dataset.lang === lang);
        });

        // Apply translations
        applyTranslations(lang);

        // Save preference
        saveLang(lang);

        // Close dropdown
        closeDropdown();
    };

    // Event listeners
    if (langToggle && langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        langOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                setLanguage(opt.dataset.lang);
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target)) {
                closeDropdown();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });
    }

    // Initialize with saved language
    const savedLang = getSavedLang();
    setLanguage(savedLang);
}

/**
 * Initialize all modules when DOM is ready
 */
function init() {
    // Initialize theme early to prevent flash
    initThemeToggle();

    // Initialize language early
    initLanguageToggle();

    // Wait for fonts to load before starting animations
    document.fonts.ready.then(() => {
        initPreloader();
    });

    // Initialize core systems
    initLenis();
    initAnchorLinks();

    // Initialize components (non-animated ones)
    initCustomCursor();

    // Initialize animations after preloader completes
    document.addEventListener('preloader:complete', () => {
        initAnimations();
    });

    // Handle reduced motion preference
    if (prefersReducedMotion()) {
        document.documentElement.classList.add('reduced-motion');
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
