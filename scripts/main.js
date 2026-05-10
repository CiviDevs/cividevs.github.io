/**
 * CIVIDEVS — Main Entry Point
 * Initializes Lenis smooth scroll, GSAP plugins, and all modules
 * @version 2.0.0
 */

'use strict';

// Import modules
import { initCustomCursor } from './components.js';
import { initAnimations } from './animations.js';
import { initMobileAppExperience } from './mobile.js';

/**
 * PROOF OF IMPACT — Project Data
 * Manually update this array to add or remove projects.
 */
const PROJECTS_DATA = [
    {
        id: '01',
        name: "Quantum Banking",
        client: "Swiss Global Bank",
        category: "Fintech",
        description: "Next-gen core banking engine with sub-100ms response times and real-time transaction processing.",
        productUrl: "https://example.com/quantum",
        reviewUrl: "https://example.com/reviews/quantum",
        year: "2024"
    },
    {
        id: '02',
        name: "MedSync Platform",
        client: "National Health Service",
        category: "Healthcare",
        description: "Unified healthcare data platform connecting 500+ clinics with patient records in real-time.",
        productUrl: "https://example.com/medsync",
        reviewUrl: "https://example.com/reviews/medsync",
        year: "2024"
    },
    {
        id: '03',
        name: "Luxe Retail OS",
        client: "Vogue Group",
        category: "E-Commerce",
        description: "High-performance storefront for premium brands. Achieving perfect 100/100 Lighthouse scores.",
        productUrl: "https://example.com/luxe",
        reviewUrl: "https://example.com/reviews/luxe",
        year: "2023"
    },
    {
        id: '04',
        name: "Neural Analytics",
        client: "DataPath Corp",
        category: "AI/ML",
        description: "Predictive analytics dashboard processing 1B+ data points per day for enterprise clients.",
        productUrl: "https://example.com/neural",
        reviewUrl: "https://example.com/reviews/neural",
        year: "2023"
    }
];

/**
 * Render Project Cards dynamically
 */
function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.innerHTML = PROJECTS_DATA.map(project => {
        return `
            <article class="impact-card" data-reveal>
                <div class="impact-card__header">
                    <span class="impact-card__num">${project.id}</span>
                    <span class="impact-card__cat">${project.category}</span>
                </div>
                <div class="impact-card__content">
                    <h3 class="impact-card__title">${project.name}</h3>
                    <div class="impact-card__client">
                        <span class="impact-card__client-label">Client:</span>
                        <span class="impact-card__client-name">${project.client}</span>
                    </div>
                    <p class="impact-card__desc">${project.description}</p>
                </div>
                <div class="impact-card__footer">
                    <div class="impact-card__actions">
                        <a href="${project.productUrl}" target="_blank" class="impact-btn impact-btn--primary" data-magnetic>
                            <span>Visit Site</span>
                        </a>
                        <a href="${project.reviewUrl}" target="_blank" class="impact-btn impact-btn--secondary" data-magnetic>
                            <span>View Review</span>
                        </a>
                    </div>
                    <span class="impact-card__year">${project.year}</span>
                </div>
            </article>
        `;
    }).join('');
}

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
        duration: 0.5,
        ease: 'expo.inOut'
    })
    .to(preloaderLine, {
        width: '100vw',
        height: '100vh',
        duration: 0.4,
        ease: 'expo.inOut'
    })
    .to(preloaderLine, {
        opacity: 0,
        duration: 0.2,
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
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return saved;
            // Strictly default to light
            return 'light';
        } catch (e) {
            return 'light';
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

    const themeToggles = document.querySelectorAll('.js-theme-toggle');
    themeToggles.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

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
        hero_label: 'We Engineer',
        hero_line1: 'Digital',
        hero_line2: 'Excellence',
        hero_expertise: 'Strategy · Design · Engineering',
        hero_qualifier: 'from concept to high-end solution.',
        hero_cta: 'Start a Project',
        hero_scroll: 'Scroll',

        // Services — Value Pillars
        services_title: 'Strategic Capabilities',
        services_intro: 'We don\'t sell hours. We deliver assets that compound in value long after launch.',
        svc_web_title: 'Digital Flagships',
        svc_web_result: 'Sub-1s Load · 100/100 Lighthouse',
        svc_web_outcome: 'High-performance, zero-bloat web platforms that convert visitors into revenue — built without a single framework dependency.',
        svc_seo_title: 'Organic Dominance',
        svc_seo_result: '+200% Organic Traffic · Page 1 Rankings',
        svc_seo_outcome: 'Market dominance through technical authority and strategic content architecture. We engineer the visibility your competitors pay millions to rent.',
        svc_brand_title: 'Visual Authority',
        svc_brand_result: 'Premium Positioning · Brand Equity',
        svc_brand_outcome: 'Visual identities that command premium pricing. From logo systems to full brand ecosystems — we build the perception that justifies your rates.',
        svc_auto_title: 'Operational Intelligence',
        svc_auto_result: '40hrs/mo Reclaimed · Zero Manual Errors',
        svc_auto_outcome: 'Workflow automation and system integration that eliminates repetitive labor. Your team focuses on strategy while the machines handle execution.',
        svc_mkt_title: 'Growth Engineering',
        svc_mkt_result: 'Data-Driven · Measurable ROI',
        svc_mkt_outcome: 'Performance marketing and conversion optimization backed by real data. Every campaign dollar is tracked, tested, and compounded.',
        services_nudge: 'See how these capabilities apply to your business →',

        // Why Us — Competitive Moat
        why_title: 'Why CIVIDEVS',
        why_lead: 'Other agencies sell templates. We build competitive advantages.',
        why_speed_title: 'Performance First',
        why_speed_desc: 'Hand-crafted code with zero framework overhead. Sub-second load times, perfect Core Web Vitals, and conversion rates that consistently outperform industry benchmarks.',
        why_aesthetic_title: 'Custom Built',
        why_aesthetic_desc: 'Every project is designed and developed from scratch. No themes, no plugins, no compromises. You receive a unique digital asset tailored to your business goals.',
        why_ownership_title: 'Dedicated Attention',
        why_ownership_desc: 'We take on a limited number of clients per quarter. Your project receives senior-level expertise from discovery to launch — and you own every line of code.',
        why_nudge: 'Limited availability this quarter — get in touch →',

        // Work — Proof of Impact
        work_title: 'Proof of Impact',
        work_cat_fintech: 'Fintech',
        work_title_fintech: 'Quantum Banking',
        work_metric_fintech_1: '+340% Revenue',
        work_metric_fintech_2: '0.6s Load',
        work_cat_healthcare: 'Healthcare',
        work_title_healthcare: 'MedSync Platform',
        work_metric_health_1: '-60% Bounce',
        work_metric_health_2: '99.9% Uptime',
        work_cat_ecommerce: 'E-Commerce',
        work_title_ecommerce: 'Luxe Retail OS',
        work_metric_ecom_1: '+200% Conv.',
        work_metric_ecom_2: '8wk Delivery',
        work_cat_ai: 'AI/ML',
        work_title_ai: 'Neural Analytics',
        work_metric_ai_1: '100/100 LH',
        work_metric_ai_2: '3x Faster',

        // Testimonials
        testimonials_title: 'What Decision-Makers Say',
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
        process_title: 'How We Deliver',
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
        faq_title: 'Before We Begin',
        faq_1_q: 'What does "zero-framework" actually mean?',
        faq_1_a: 'We write every line of CSS and JavaScript by hand — no React, no Next.js, no WordPress. The result is a site that loads 3-5x faster than framework-based alternatives.',
        faq_2_q: 'How long does a typical project take?',
        faq_2_a: 'Most projects ship in 6–10 weeks from kickoff to launch. Complex enterprise builds may extend to 12–16 weeks.',
        faq_3_q: 'What\'s the investment range?',
        faq_3_a: 'Our engagements start at €15,000 for focused brand sites and scale to €80,000+ for full-stack enterprise platforms.',
        faq_4_q: 'Do you work with startups or only enterprises?',
        faq_4_a: 'Both. If you\'re serious about building a premium digital presence and have the budget to match, we\'re interested.',

        // Contact
        contact_label: '[ Ready to Start? ]',
        contact_title: "Let's build something exceptional.",
        contact_email: 'hello@cividevs.com',
        contact_linkedin: 'LinkedIn',
        contact_github: 'GitHub',
        contact_twitter: 'Twitter',

        // Footer
        footer_copy: `© ${new Date().getFullYear()} CIVIDEVS`,
        footer_rights: 'All Rights Reserved',
        footer_location: 'Global · Remote · Available',
        footer_tagline: 'Strategy · Design · Engineering',
        footer_privacy: 'Privacy Policy',
        footer_terms: 'Terms of Service'
    },
    it: {
        nav_services: 'Servizi',
        nav_work: 'Lavori',
        nav_process: 'Processo',
        nav_about: 'Chi Siamo',
        nav_cta: 'Inizia un Progetto',
        hero_label: 'Progettiamo',
        hero_line1: 'Eccellenza',
        hero_line2: 'Digitale',
        hero_expertise: 'Strategia · Design · Ingegneria',
        hero_qualifier: 'dal concept alla soluzione su misura.',
        hero_cta: 'Inizia un Progetto',
        hero_scroll: 'Scorri',
        services_title: 'Capacità Strategiche',
        services_intro: 'Non vendiamo ore. Consegniamo asset che crescono di valore nel tempo.',
        svc_web_title: 'Piattaforme Digitali',
        svc_web_result: 'Caricamento <1s · 100/100 Lighthouse',
        svc_web_outcome: 'Piattaforme web ad alte prestazioni, zero bloat, che convertono visitatori in ricavi — costruite senza dipendenze da framework.',
        svc_seo_title: 'Dominanza Organica',
        svc_seo_result: '+200% Traffico Organico · Pagina 1',
        svc_seo_outcome: 'Dominanza di mercato attraverso autorità tecnica e architettura strategica dei contenuti.',
        svc_brand_title: 'Autorità Visiva',
        svc_brand_result: 'Posizionamento Premium · Brand Equity',
        svc_brand_outcome: 'Identità visive che giustificano prezzi premium. Dai sistemi di logo agli ecosistemi di brand completi.',
        svc_auto_title: 'Intelligenza Operativa',
        svc_auto_result: '40ore/mese Recuperate · Zero Errori',
        svc_auto_outcome: 'Automazione dei workflow e integrazione dei sistemi che elimina il lavoro ripetitivo.',
        svc_mkt_title: 'Ingegneria della Crescita',
        svc_mkt_result: 'Data-Driven · ROI Misurabile',
        svc_mkt_outcome: 'Marketing performante e ottimizzazione della conversione supportati da dati reali.',
        services_nudge: 'Scopri come queste capacità si applicano al tuo business →',
        why_title: 'Perché CIVIDEVS',
        why_lead: 'Le altre agenzie vendono template. Noi costruiamo vantaggi competitivi.',
        why_speed_title: 'Performance First',
        why_speed_desc: 'Codice scritto a mano senza dipendenze da framework. Tempi di caricamento sotto il secondo, Core Web Vitals perfetti e tassi di conversione che superano costantemente i benchmark di settore.',
        why_aesthetic_title: 'Costruito Su Misura',
        why_aesthetic_desc: 'Ogni progetto è progettato e sviluppato da zero. Niente temi, niente plugin, nessun compromesso. Ricevi un asset digitale unico, su misura per i tuoi obiettivi.',
        why_ownership_title: 'Attenzione Dedicata',
        why_ownership_desc: 'Accettiamo un numero limitato di clienti a trimestre. Il tuo progetto riceve competenze senior dalla scoperta al lancio — e ogni riga di codice è tua.',
        why_nudge: 'Disponibilità limitata questo trimestre — contattaci →',
        work_title: 'Prove d\'Impatto',
        work_cat_fintech: 'Fintech',
        work_title_fintech: 'Quantum Banking',
        work_metric_fintech_1: '+340% Fatturato',
        work_metric_fintech_2: '0.6s Caricamento',
        work_cat_healthcare: 'Healthcare',
        work_title_healthcare: 'Piattaforma MedSync',
        work_metric_health_1: '-60% Bounce',
        work_metric_health_2: '99.9% Uptime',
        work_cat_ecommerce: 'E-Commerce',
        work_title_ecommerce: 'Luxe Retail OS',
        work_metric_ecom_1: '+200% Conv.',
        work_metric_ecom_2: '8 sett. Consegna',
        work_cat_ai: 'AI/ML',
        work_title_ai: 'Neural Analytics',
        work_metric_ai_1: '100/100 LH',
        work_metric_ai_2: '3x Più Veloce',
        testimonials_title: 'Cosa Dicono i Decision-Maker',
        testimonial_1_text: '"CIVIDEVS non ha solo costruito la nostra piattaforma — ha ingegnerizzato la nostra posizione di mercato. Fatturato +340% nel primo trimestre."',
        testimonial_1_author: '— Marcus Chen',
        testimonial_1_role: 'CEO, Quantum Banking',
        testimonial_2_text: '"Il sito più veloce del nostro intero verticale. Il bounce rate è calato del 60% dalla sera alla mattina."',
        testimonial_2_author: '— Sarah Lindström',
        testimonial_2_role: 'CTO, MedSync Health',
        testimonial_3_text: '"Niente fronzoli, niente sprint sprecati. Hanno consegnato in 8 settimane quello che la nostra agenzia precedente non riusciva in 8 mesi."',
        testimonial_3_author: '— David Okafor',
        testimonial_3_role: 'Fondatore, Luxe Retail',
        process_title: 'Come Consegniamo',
        process_1_title: 'Scoperta & Strategia',
        process_1_desc: 'Analizziamo il tuo mercato, auditiamo i competitor e definiamo la strategia digitale che ti posiziona per il dominio.',
        process_1_duration: 'Settimana 1–2',
        process_2_title: 'Design & Architettura',
        process_2_desc: 'Prototipi ad alta fedeltà e architettura progettata per scalare.',
        process_2_duration: 'Settimana 3–4',
        process_3_title: 'Ingegneria & QA',
        process_3_desc: 'Codice artigianale, test rigorosi e ottimizzazione delle performance.',
        process_3_duration: 'Settimana 5–7',
        process_4_title: 'Lancio & Crescita',
        process_4_desc: 'Deployment, monitoraggio e analytics di crescita. Non spariamodopo il lancio.',
        process_4_duration: 'Settimana 8+',
        faq_title: 'Prima di Iniziare',
        faq_1_q: 'Cosa significa "zero-framework"?',
        faq_1_a: 'Scriviamo ogni riga di CSS e JavaScript a mano — niente React, niente Next.js, niente WordPress. Il risultato è un sito 3-5x più veloce.',
        faq_2_q: 'Quanto dura un progetto tipico?',
        faq_2_a: 'La maggior parte dei progetti viene consegnata in 6–10 settimane.',
        faq_3_q: 'Qual è il range di investimento?',
        faq_3_a: 'I nostri ingaggi partono da €15.000 per siti brand e scalano a €80.000+ per piattaforme enterprise.',
        faq_4_q: 'Lavorate con startup o solo enterprise?',
        faq_4_a: 'Entrambi. Se sei serio nel costruire una presenza digitale premium, siamo interessati.',
        contact_label: '[ Pronti a Iniziare? ]',
        contact_title: 'Costruiamo qualcosa di eccezionale.',
        contact_email: 'hello@cividevs.com',
        contact_linkedin: 'LinkedIn',
        contact_github: 'GitHub',
        contact_twitter: 'Twitter',
        footer_copy: `© ${new Date().getFullYear()} CIVIDEVS`,
        footer_rights: 'Tutti i Diritti Riservati',
        footer_location: 'Globale · Remoto · Disponibile',
        footer_tagline: 'Strategia · Design · Ingegneria',
        footer_privacy: 'Privacy Policy',
        footer_terms: 'Termini di Servizio'
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
                // If this element was split-text animated, clear the spans first
                if (el.hasAttribute('data-split-text') || el.querySelector('.char, .word')) {
                    el.innerHTML = t[key];
                    // Reset opacity/transform in case animation left them invisible
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                } else {
                    el.textContent = t[key];
                }
            }
        });
    };

    const setLanguage = (lang) => {
        document.querySelectorAll('.js-lang-option').forEach(opt => {
            opt.classList.toggle('is-active', opt.dataset.lang === lang);
        });
        applyTranslations(lang);
        saveLang(lang);
    };

    const langDropdowns = document.querySelectorAll('.js-lang-dropdown');
    
    // Toggle dropdown
    document.querySelectorAll('.js-lang-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = btn.closest('.js-lang-dropdown');
            const isOpen = parent.classList.contains('is-open');
            langDropdowns.forEach(d => d.classList.remove('is-open'));
            if (!isOpen) {
                parent.classList.add('is-open');
            }
        });
    });

    // Handle selection
    document.querySelectorAll('.js-lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            langDropdowns.forEach(d => d.classList.remove('is-open'));
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.js-lang-dropdown')) {
            langDropdowns.forEach(d => d.classList.remove('is-open'));
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            langDropdowns.forEach(d => d.classList.remove('is-open'));
        }
    });

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
    renderProjects();
    initMobileAppExperience();

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
