/**
 * CIVIDEVS — Main Entry Point
 * Initializes Lenis smooth scroll, GSAP plugins, and all modules
 * @version 2.0.0
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
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const STORAGE_KEY = 'cividevs-theme';

    const getSavedTheme = () => {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'dark';
        } catch (e) {
            return 'dark';
        }
    };

    const saveTheme = (theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // Ignore localStorage errors
        }
    };

    const applyTheme = (theme) => {
        if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else {
            html.removeAttribute('data-theme');
        }
    };

    const toggleTheme = () => {
        const currentTheme = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        saveTheme(newTheme);
    };

    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
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
        nav_services: 'Services',
        nav_work: 'Work',
        nav_process: 'Process',
        nav_about: 'About',
        nav_cta: 'Start a Project',

        // Hero
        hero_label: 'We Build',
        hero_line1: 'Brands That',
        hero_line2: 'Dominate',
        hero_expertise: 'Strategy · Design · Engineering',
        hero_qualifier: 'for brands that refuse to blend in.',
        hero_cta: 'Request a Proposal',
        hero_scroll: 'Scroll',

        // Services
        services_title: 'Services',
        service_strategy_title: 'Digital Strategy',
        service_strategy_desc: 'Market positioning, growth roadmaps, and digital transformation frameworks that turn ambition into market authority.',
        service_design_title: 'Brand & Product Design',
        service_design_desc: 'UI/UX systems, visual identities, and conversion-optimized interfaces that make your competition irrelevant.',
        service_engineering_title: 'Engineering & Performance',
        service_engineering_desc: 'Full-stack architecture, sub-100ms interactions, and zero-framework builds that outperform everything in your vertical.',

        // Why Us
        why_title: 'Why CIVIDEVS',
        why_lead: 'Other agencies sell templates. We engineer unfair advantages.',
        why_speed_title: 'Brutal Speed',
        why_speed_desc: 'No frameworks. No bloat. Pure, hand-crafted code that loads before your users can blink. Core Web Vitals aren\'t a goal — they\'re a floor.',
        why_aesthetic_title: 'Calculated Aesthetics',
        why_aesthetic_desc: 'Every pixel serves a purpose. Our Brutalist Luxury approach strips away noise to reveal what matters: your brand\'s authority.',
        why_ownership_title: 'Full Ownership',
        why_ownership_desc: 'Zero vendor lock-in. Zero dependencies. You own every line of code. When we ship, you\'re free — not chained to a retainer.',

        // Work
        work_title: 'Selected Work',
        work_cat_fintech: 'Fintech',
        work_title_fintech: 'Quantum Banking',
        work_cat_healthcare: 'Healthcare',
        work_title_healthcare: 'MedSync Platform',
        work_cat_ecommerce: 'E-Commerce',
        work_title_ecommerce: 'Luxe Retail OS',
        work_cat_ai: 'AI/ML',
        work_title_ai: 'Neural Analytics',

        // Testimonials
        testimonials_title: 'Client Voices',
        testimonial_1_text: '"CIVIDEVS didn\'t just build our platform — they engineered our market position. Revenue up 340% in the first quarter post-launch."',
        testimonial_1_author: '— Marcus Chen',
        testimonial_1_role: 'CEO, Quantum Banking',
        testimonial_2_text: '"The fastest site in our entire vertical. Our bounce rate dropped 60% overnight. These people understand performance at a molecular level."',
        testimonial_2_author: '— Sarah Lindström',
        testimonial_2_role: 'CTO, MedSync Health',
        testimonial_3_text: '"No fluff, no wasted sprints. They shipped in 8 weeks what our previous agency couldn\'t deliver in 8 months."',
        testimonial_3_author: '— David Okafor',
        testimonial_3_role: 'Founder, Luxe Retail',

        // Process
        process_title: 'Process',
        process_1_title: 'Discovery & Strategy',
        process_1_desc: 'We dissect your market, audit competitors, and define the precise digital strategy that positions you for dominance.',
        process_1_duration: 'Week 1–2',
        process_2_title: 'Design & Architecture',
        process_2_desc: 'High-fidelity prototypes and system architecture designed for scale. You approve every pixel before a single line of code is written.',
        process_2_duration: 'Week 3–4',
        process_3_title: 'Engineering & QA',
        process_3_desc: 'Hand-crafted code, rigorous testing, and performance optimization. Every interaction under 100ms.',
        process_3_duration: 'Week 5–7',
        process_4_title: 'Launch & Growth',
        process_4_desc: 'Deployment, monitoring, and growth analytics. We don\'t disappear after launch — we ensure your product wins.',
        process_4_duration: 'Week 8+',

        // FAQ
        faq_title: 'Frequently Asked',
        faq_1_q: 'What does "zero-framework" actually mean?',
        faq_1_a: 'We write every line of CSS and JavaScript by hand — no React, no Next.js, no WordPress. The result is a site that loads 3-5x faster than framework-based alternatives.',
        faq_2_q: 'How long does a typical project take?',
        faq_2_a: 'Most projects ship in 6–10 weeks from kickoff to launch. Complex enterprise builds may extend to 12–16 weeks.',
        faq_3_q: 'What\'s the investment range?',
        faq_3_a: 'Our engagements start at €15,000 for focused brand sites and scale to €80,000+ for full-stack enterprise platforms.',
        faq_4_q: 'Do you work with startups or only enterprises?',
        faq_4_a: 'Both. If you\'re serious about building a premium digital presence and have the budget to match, we\'re interested.',

        // Contact
        contact_label: '[ Ready to Dominate? ]',
        contact_title: "Let's build something that wins.",
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
        nav_services: 'Servizi',
        nav_work: 'Lavori',
        nav_process: 'Processo',
        nav_about: 'Chi Siamo',
        nav_cta: 'Inizia un Progetto',

        // Hero
        hero_label: 'Costruiamo',
        hero_line1: 'Brand Che',
        hero_line2: 'Dominano',
        hero_expertise: 'Strategia · Design · Ingegneria',
        hero_qualifier: 'per brand che rifiutano di confondersi.',
        hero_cta: 'Richiedi una Proposta',
        hero_scroll: 'Scorri',

        // Services
        services_title: 'Servizi',
        service_strategy_title: 'Strategia Digitale',
        service_strategy_desc: 'Posizionamento di mercato, roadmap di crescita e framework di trasformazione digitale che trasformano l\'ambizione in autorità.',
        service_design_title: 'Brand & Product Design',
        service_design_desc: 'Sistemi UI/UX, identità visive e interfacce ottimizzate per la conversione che rendono irrilevante la concorrenza.',
        service_engineering_title: 'Ingegneria & Performance',
        service_engineering_desc: 'Architettura full-stack, interazioni sotto i 100ms e build zero-framework che superano tutto nel tuo verticale.',

        // Why Us
        why_title: 'Perché CIVIDEVS',
        why_lead: 'Le altre agenzie vendono template. Noi progettiamo vantaggi competitivi.',
        why_speed_title: 'Velocità Brutale',
        why_speed_desc: 'Niente framework. Niente bloat. Codice puro, artigianale, che carica prima che i tuoi utenti possano battere ciglio.',
        why_aesthetic_title: 'Estetica Calcolata',
        why_aesthetic_desc: 'Ogni pixel ha uno scopo. Il nostro approccio Brutalist Luxury elimina il rumore per rivelare ciò che conta.',
        why_ownership_title: 'Proprietà Totale',
        why_ownership_desc: 'Zero vendor lock-in. Zero dipendenze. Ogni riga di codice è tua. Quando consegniamo, sei libero.',

        // Work
        work_title: 'Lavori Selezionati',
        work_cat_fintech: 'Fintech',
        work_title_fintech: 'Quantum Banking',
        work_cat_healthcare: 'Healthcare',
        work_title_healthcare: 'Piattaforma MedSync',
        work_cat_ecommerce: 'E-Commerce',
        work_title_ecommerce: 'Luxe Retail OS',
        work_cat_ai: 'AI/ML',
        work_title_ai: 'Neural Analytics',

        // Testimonials
        testimonials_title: 'Voci dei Clienti',
        testimonial_1_text: '"CIVIDEVS non ha solo costruito la nostra piattaforma — ha ingegnerizzato la nostra posizione di mercato. Fatturato +340% nel primo trimestre."',
        testimonial_1_author: '— Marcus Chen',
        testimonial_1_role: 'CEO, Quantum Banking',
        testimonial_2_text: '"Il sito più veloce del nostro intero verticale. Il bounce rate è calato del 60% dalla sera alla mattina."',
        testimonial_2_author: '— Sarah Lindström',
        testimonial_2_role: 'CTO, MedSync Health',
        testimonial_3_text: '"Niente fronzoli, niente sprint sprecati. Hanno consegnato in 8 settimane quello che la nostra agenzia precedente non riusciva in 8 mesi."',
        testimonial_3_author: '— David Okafor',
        testimonial_3_role: 'Fondatore, Luxe Retail',

        // Process
        process_title: 'Processo',
        process_1_title: 'Scoperta & Strategia',
        process_1_desc: 'Analizziamo il tuo mercato, auditiamo i competitor e definiamo la strategia digitale che ti posiziona per il dominio.',
        process_1_duration: 'Settimana 1–2',
        process_2_title: 'Design & Architettura',
        process_2_desc: 'Prototipi ad alta fedeltà e architettura progettata per scalare. Approvi ogni pixel prima che venga scritta una riga di codice.',
        process_2_duration: 'Settimana 3–4',
        process_3_title: 'Ingegneria & QA',
        process_3_desc: 'Codice artigianale, test rigorosi e ottimizzazione delle performance. Ogni interazione sotto i 100ms.',
        process_3_duration: 'Settimana 5–7',
        process_4_title: 'Lancio & Crescita',
        process_4_desc: 'Deployment, monitoraggio e analytics di crescita. Non spariamoafter il lancio — assicuriamo che il tuo prodotto vinca.',
        process_4_duration: 'Settimana 8+',

        // FAQ
        faq_title: 'Domande Frequenti',
        faq_1_q: 'Cosa significa "zero-framework"?',
        faq_1_a: 'Scriviamo ogni riga di CSS e JavaScript a mano — niente React, niente Next.js, niente WordPress. Il risultato è un sito 3-5x più veloce.',
        faq_2_q: 'Quanto dura un progetto tipico?',
        faq_2_a: 'La maggior parte dei progetti viene consegnata in 6–10 settimane. Build enterprise complessi possono estendersi a 12–16 settimane.',
        faq_3_q: 'Qual è il range di investimento?',
        faq_3_a: 'I nostri ingaggi partono da €15.000 per siti brand focalizzati e scalano a €80.000+ per piattaforme enterprise full-stack.',
        faq_4_q: 'Lavorate con startup o solo enterprise?',
        faq_4_a: 'Entrambi. Se sei serio nel costruire una presenza digitale premium e hai il budget adeguato, siamo interessati.',

        // Contact
        contact_label: '[ Pronti a Dominare? ]',
        contact_title: 'Costruiamo qualcosa che vince.',
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
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const langBtn = document.getElementById('langBtn');
    const langOptions = document.querySelectorAll('.header__utility-option');
    const html = document.documentElement;
    const STORAGE_KEY = 'cividevs-lang';

    const getSavedLang = () => {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'en';
        } catch (e) {
            return 'en';
        }
    };

    const saveLang = (lang) => {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {}
    };

    /**
     * Apply translations using data-i18n attributes
     */
    const applyTranslations = (lang) => {
        const t = translations[lang];
        if (!t) return;

        html.setAttribute('lang', lang);

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                el.textContent = t[key];
            }
        });
    };

    const toggleDropdown = () => {
        langToggle.classList.toggle('is-open');
    };

    const closeDropdown = () => {
        langToggle.classList.remove('is-open');
    };

    const setLanguage = (lang) => {
        langOptions.forEach(opt => {
            opt.classList.toggle('is-active', opt.dataset.lang === lang);
        });
        applyTranslations(lang);
        saveLang(lang);
        closeDropdown();
    };

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

        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target)) {
                closeDropdown();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });
    }

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
