/**
 * CIVIDEVS — Main Entry Point
 * Initializes Lenis smooth scroll, GSAP plugins, and all modules
 * @version 2.0.0
 */

'use strict'

// Import modules
import { initCustomCursor } from './components.js'
import { initAnimations } from './animations.js'
import { initMobileAppExperience } from './mobile.js'
import { prefersReducedMotion } from './utils.js'

export { prefersReducedMotion } from './utils.js'

/**
 * PROOF OF IMPACT — Project Data
 * Manually update this array to add or remove projects.
 */
const PROJECTS_DATA = [
	{
		id: '01',
		name: {
			en: 'Quantum Banking',
			it: 'Quantum Banking',
		},
		client: {
			en: 'Swiss Global Bank',
			it: 'Banca Globale Svizzera',
		},
		category: {
			en: 'Fintech',
			it: 'Fintech',
		},
		description: {
			en: 'A next-generation core banking engine with sub-100ms response times and real-time transaction processing.',
			it: 'Un motore bancario core di nuova generazione con tempi di risposta inferiori a 100 ms ed elaborazione delle transazioni in tempo reale.',
		},
		productUrl: 'https://example.com/quantum',
		reviewUrl: 'https://example.com/reviews/quantum',
		year: '2024',
	},
	{
		id: '02',
		name: {
			en: 'MedSync Platform',
			it: 'Piattaforma MedSync',
		},
		client: {
			en: 'National Health Service',
			it: 'Servizio Sanitario Nazionale',
		},
		category: {
			en: 'Healthcare',
			it: 'Sanita',
		},
		description: {
			en: 'A unified healthcare data platform connecting more than 500 clinics with patient records in real time.',
			it: 'Una piattaforma unificata per i dati sanitari che collega oltre 500 cliniche alle cartelle dei pazienti in tempo reale.',
		},
		productUrl: 'https://example.com/medsync',
		reviewUrl: 'https://example.com/reviews/medsync',
		year: '2024',
	},
	{
		id: '03',
		name: {
			en: 'Luxe Retail OS',
			it: 'Luxe Retail OS',
		},
		client: {
			en: 'Vogue Group',
			it: 'Vogue Group',
		},
		category: {
			en: 'E-Commerce',
			it: 'E-Commerce',
		},
		description: {
			en: 'A high-performance storefront for premium brands, engineered to achieve perfect Lighthouse scores.',
			it: 'Uno storefront ad alte prestazioni per brand premium, progettato per ottenere punteggi Lighthouse perfetti.',
		},
		productUrl: 'https://example.com/luxe',
		reviewUrl: 'https://example.com/reviews/luxe',
		year: '2023',
	},
	{
		id: '04',
		name: {
			en: 'Neural Analytics',
			it: 'Neural Analytics',
		},
		client: {
			en: 'DataPath Corp',
			it: 'DataPath Corp',
		},
		category: {
			en: 'AI/ML',
			it: 'AI/ML',
		},
		description: {
			en: 'A predictive analytics dashboard processing more than one billion data points per day for enterprise clients.',
			it: 'Una dashboard di analisi predittiva che elabora oltre un miliardo di dati al giorno per clienti enterprise.',
		},
		productUrl: 'https://example.com/neural',
		reviewUrl: 'https://example.com/reviews/neural',
		year: '2023',
	},
]

/**
 * Render Project Cards dynamically
 */
function renderProjects(lang = 'en') {
	const grid = document.getElementById('project-grid')
	if (!grid) return

	const projectCopy = {
		en: {
			clientLabel: 'Client:',
			visitSite: 'Visit Site',
			viewReview: 'View Review',
		},
		it: {
			clientLabel: 'Cliente:',
			visitSite: 'Visita Sito',
			viewReview: 'Vedi Recensione',
		},
	}
	const copy = projectCopy[lang] || projectCopy.en

	grid.innerHTML = PROJECTS_DATA.map(project => {
		const reviewBtn = project.reviewUrl
			? `
                        <a href="${project.reviewUrl}" target="_blank" class="impact-btn impact-btn--secondary" data-magnetic>
                            <span>${copy.viewReview}</span>
                        </a>`
			: ''

		return `
            <article class="impact-card" data-reveal>
                <div class="impact-card__header">
                    <span class="impact-card__num">${project.id}</span>
                    <span class="impact-card__cat">${project.category[lang] || project.category.en}</span>
                </div>
                <div class="impact-card__content">
                    <h3 class="impact-card__title">${project.name[lang] || project.name.en}</h3>
                    <div class="impact-card__client">
                        <span class="impact-card__client-label">${copy.clientLabel}</span>
                        <span class="impact-card__client-name">${project.client[lang] || project.client.en}</span>
                    </div>
                    <p class="impact-card__desc">${project.description[lang] || project.description.en}</p>
                </div>
                <div class="impact-card__footer">
                    <div class="impact-card__actions">
                        <a href="${project.productUrl}" target="_blank" class="impact-btn impact-btn--primary" data-magnetic>
                            <span>${copy.visitSite}</span>
                        </a>
                        ${reviewBtn}
                    </div>
                </div>
            </article>
        `
	}).join('')
}

/**
 * Initialize Active Card Observer for all mobile sliders
 */
function initActiveCardObserver() {
	const sliders = [
		{ gridId: 'project-grid', selector: '.impact-card', breakpoint: 768 },
		{ gridId: 'whyGrid', selector: '.why__card', breakpoint: 768 },
		{ gridId: 'testimonialsGrid', selector: '.testimonial', breakpoint: 1024 },
	]

	sliders.forEach(({ gridId, selector, breakpoint }) => {
		const grid = document.getElementById(gridId)
		if (!grid || !window.matchMedia(`(max-width: ${breakpoint}px)`).matches)
			return

		const cards = grid.querySelectorAll(selector)
		if (cards.length === 0) return

		// Set first card as active
		cards[0].classList.add('is-active')

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						cards.forEach(c => c.classList.remove('is-active'))
						entry.target.classList.add('is-active')
					}
				})
			},
			{
				root: grid,
				threshold: 0.6,
			},
		)

		cards.forEach(card => observer.observe(card))
	})
}

/**
 * Initialize Generic Mobile Sliders
 */
function initMobileSliders() {
	const prevBtns = document.querySelectorAll('[data-slider-prev]')
	const nextBtns = document.querySelectorAll('[data-slider-next]')

	const initNav = (btn, isNext) => {
		const gridId = isNext
			? btn.getAttribute('data-slider-next')
			: btn.getAttribute('data-slider-prev')
		const grid = document.getElementById(gridId)
		if (!grid) return

		// Find partner button to handle opacity updates together
		const partnerAttr = isNext ? 'data-slider-prev' : 'data-slider-next'
		const partnerBtn = btn
			.closest('section')
			?.querySelector(`[${partnerAttr}="${gridId}"]`)

		const getScrollAmount = () => {
			const firstChild = grid.firstElementChild
			if (!firstChild) return 300
			const style = window.getComputedStyle(grid)
			const gap = parseFloat(style.gap) || 0
			// On mobile, we scroll exactly one card width + gap for precision
			return firstChild.offsetWidth + gap
		}

		// Click handler
		btn.addEventListener('click', () => {
			const amount = getScrollAmount()
			const currentScroll = grid.scrollLeft
			const targetScroll = isNext
				? currentScroll + amount
				: currentScroll - amount

			grid.scrollTo({
				left: targetScroll,
				behavior: 'smooth',
			})
		})

		// Only attach scroll listener to grid once (handle both buttons' state)
		const updateButtons = () => {
			const isAtStart = grid.scrollLeft <= 10
			const isAtEnd =
				grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10

			if (isNext) {
				btn.style.opacity = isAtEnd ? '0.3' : '1'
				btn.style.pointerEvents = isAtEnd ? 'none' : 'auto'
			} else {
				btn.style.opacity = isAtStart ? '0.3' : '1'
				btn.style.pointerEvents = isAtStart ? 'none' : 'auto'
			}
		}

		grid.addEventListener('scroll', updateButtons, { passive: true })
		window.addEventListener('resize', updateButtons, { passive: true })
		// Initial state update after a small delay to ensure rendering
		setTimeout(updateButtons, 100)
	}

	prevBtns.forEach(btn => initNav(btn, false))
	nextBtns.forEach(btn => initNav(btn, true))
}
/**
 * Initialize Lenis smooth scroll
 * @returns {Lenis} Lenis instance
 */
function initLenis() {
	const lenis = new Lenis({
		duration: 1.2,
		easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		orientation: 'vertical',
		gestureOrientation: 'vertical',
		smoothWheel: true,
		wheelMultiplier: 1,
		touchMultiplier: 2,
	})

	// RAF loop for Lenis
	function raf(time) {
		lenis.raf(time)
		requestAnimationFrame(raf)
	}
	requestAnimationFrame(raf)

	// Connect GSAP ScrollTrigger to Lenis
	lenis.on('scroll', ScrollTrigger.update)

	gsap.ticker.add(time => {
		lenis.raf(time * 1000)
	})

	gsap.ticker.lagSmoothing(0)

	// Store lenis globally for anchor links
	window.lenis = lenis

	return lenis
}

/**
 * Handle anchor link smooth scrolling
 */
function initAnchorLinks() {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', e => {
			const href = anchor.getAttribute('href')
			if (href === '#') return

			const target = document.querySelector(href)
			if (target && window.lenis) {
				e.preventDefault()
				window.lenis.scrollTo(target, {
					offset: -100,
					duration: 1.5,
				})
			}
		})
	})
}

/**
 * Preloader animation sequence
 */
function initPreloader() {
	const preloader = document.getElementById('preloader')
	const preloaderLine = preloader?.querySelector('.preloader__line')

	if (!preloader || !preloaderLine) return

	const tl = gsap.timeline({
		onComplete: () => {
			preloader.classList.add('is-complete')
			// Trigger entrance animations after preloader
			document.dispatchEvent(new CustomEvent('preloader:complete'))

			// Remove preloader from DOM after fade out
			setTimeout(() => {
				preloader.style.display = 'none'
			}, 500)
		},
	})

	tl.to(preloaderLine, {
		height: '100vh',
		duration: 0.5,
		ease: 'expo.inOut',
	})
		.to(preloaderLine, {
			width: '100vw',
			height: '100vh',
			duration: 0.4,
			ease: 'expo.inOut',
		})
		.to(preloaderLine, {
			opacity: 0,
			duration: 0.2,
			ease: 'power2.out',
		})
}

/**
 * Theme Toggle functionality
 */
function initThemeToggle() {
	const html = document.documentElement
	const STORAGE_KEY = 'cividevs-theme'

	const getSavedTheme = () => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY)
			if (saved) return saved
			return 'light'
		} catch (e) {
			return 'light'
		}
	}

	const saveTheme = theme => {
		try {
			localStorage.setItem(STORAGE_KEY, theme)
		} catch (e) {
			// Ignore localStorage errors
		}
	}

	const applyTheme = theme => {
		if (theme === 'light') {
			html.setAttribute('data-theme', 'light')
		} else {
			html.removeAttribute('data-theme')
		}
		syncThemeToggleUI(theme)
	}

	const syncThemeToggleUI = theme => {
		const isLight = theme === 'light'
		document.querySelectorAll('.js-theme-toggle').forEach(button => {
			button.setAttribute('aria-pressed', String(isLight))
			button.setAttribute(
				'aria-label',
				isLight ? 'Switch to dark theme' : 'Switch to light theme',
			)
			button.setAttribute(
				'title',
				isLight ? 'Switch to dark theme' : 'Switch to light theme',
			)
			button.classList.toggle('is-active', isLight)
		})
	}

	const toggleTheme = () => {
		const currentTheme =
			html.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
		const newTheme = currentTheme === 'light' ? 'dark' : 'light'
		applyTheme(newTheme)
		saveTheme(newTheme)
	}

	const savedTheme = getSavedTheme()
	applyTheme(savedTheme)

	// Use event delegation for theme toggles to handle header and mobile menu instances
	document.addEventListener('click', e => {
		const toggleBtn = e.target.closest('.js-theme-toggle')
		if (toggleBtn) {
			e.preventDefault()
			toggleTheme()
		}
	})
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
		nav_reviews: 'Reviews',
		nav_about: 'About',
		nav_menu: 'Menu',
		nav_cta: 'Start a Project',
		intent_cta: 'Start Project',

		// Hero
		hero_label: 'We Engineer',
		hero_line1: 'Digital',
		hero_line2: 'Excellence',
		hero_expertise: 'Strategy · Design · Engineering',
		hero_qualifier: 'from concept to high-end solution.',
		hero_cta: 'Start a Project',
		hero_scroll: 'Scroll',

		// Marquee
		marquee_projects: '40+ Projects Delivered',
		marquee_years: '8+ Years of Excellence',
		marquee_satisfaction: '99% Client Satisfaction',
		marquee_performance: 'Zero-Framework Performance',
		marquee_security: 'Enterprise-Grade Security',

		// Services — Value Pillars
		services_title: 'Strategic Capabilities',
		services_intro:
			"We don't sell hours. We deliver assets that compound in value long after launch.",
		svc_web_title: 'Digital Flagships',
		svc_web_result: 'Sub-1s Load · 100/100 Lighthouse',
		svc_web_outcome:
			'High-performance, zero-bloat web platforms that convert visitors into revenue — built without a single framework dependency.',
		svc_seo_title: 'Organic Dominance',
		svc_seo_result: '+200% Organic Traffic · Page 1 Rankings',
		svc_seo_outcome:
			'Market dominance through technical authority and strategic content architecture. We engineer the visibility your competitors pay millions to rent.',
		svc_brand_title: 'Visual Authority',
		svc_brand_result: 'Premium Positioning · Brand Equity',
		svc_brand_outcome:
			'Visual identities that command premium pricing. From logo systems to full brand ecosystems — we build the perception that justifies your rates.',
		svc_auto_title: 'Operational Intelligence',
		svc_auto_result: '40hrs/mo Reclaimed · Zero Manual Errors',
		svc_auto_outcome:
			'Workflow automation and system integration that eliminates repetitive labor. Your team focuses on strategy while the machines handle execution.',
		svc_mkt_title: 'Growth Engineering',
		svc_mkt_result: 'Data-Driven · Measurable ROI',
		svc_mkt_outcome:
			'Performance marketing and conversion optimization backed by real data. Every campaign dollar is tracked, tested, and compounded.',
		services_nudge: 'See how these capabilities apply to your business →',

		// About Banners
		about_banner1_label: '[ Behind the Code ]',
		about_banner1_title: 'Curious who builds this?',
		about_banner1_desc:
			'We are a specialized collective of senior engineers and designers crafting premium digital assets. No junior devs. No templates. Just pure, unfiltered expertise applied directly to your business goals.',
		about_banner1_tag1: '0 Frameworks',
		about_banner1_tag2: 'Sub-100ms Load',
		about_banner1_tag3: 'Premium Code',
		about_cta: 'Meet the Agency',
		about_banner2_label: '[ The Architects ]',
		about_banner2_title: 'Want to learn more?',
		about_banner2_desc:
			'CIVIDEVS operates at the intersection of high-end aesthetics and molecular-level performance. We build digital flagships for brands that cannot afford to compromise on quality or speed.',
		about_banner2_tag1: 'Bespoke Design',
		about_banner2_tag2: 'Vanilla JS',
		about_banner2_tag3: 'Global Scale',

		// Why Us — Competitive Moat
		why_title: 'Why CIVIDEVS',
		why_lead: 'Other agencies sell templates. We build competitive advantages.',
		why_speed_title: 'Performance First',
		why_speed_desc:
			'Hand-crafted code with zero framework overhead. Sub-second load times, perfect Core Web Vitals, and conversion rates that consistently outperform industry benchmarks.',
		why_aesthetic_title: 'Custom Built',
		why_aesthetic_desc:
			'Every project is designed and developed from scratch. No themes, no plugins, no compromises. You receive a unique digital asset tailored to your business goals.',
		why_ownership_title: 'Dedicated Attention',
		why_ownership_desc:
			'We take on a limited number of clients per quarter. Your project receives senior-level expertise from discovery to launch — and you own every line of code.',
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
		testimonial_cat: 'Testimonial',
		testimonial_1_text:
			'"CIVIDEVS didn\'t just build our platform — they engineered our market position. Revenue up 340% in the first quarter post-launch."',
		testimonial_1_author: '— Marcus Chen',
		testimonial_1_role: 'CEO, Quantum Banking',
		testimonial_2_text:
			'"The fastest site in our entire vertical. Our bounce rate dropped 60% overnight. These people understand performance at a molecular level."',
		testimonial_2_author: '— Sarah Lindström',
		testimonial_2_role: 'CTO, MedSync Health',
		testimonial_3_text:
			'"No fluff, no wasted sprints. They shipped in 8 weeks what our previous agency couldn\'t deliver in 8 months."',
		testimonial_3_author: '— David Okafor',
		testimonial_3_role: 'Founder, Luxe Retail',

		// Process
		process_title: 'How We Deliver',
		process_1_title: 'Discovery & Strategy',
		process_1_desc:
			'We dissect your market, audit competitors, and define the precise digital strategy that positions you for dominance.',
		process_1_duration: 'Week 1–2',
		process_2_title: 'Design & Architecture',
		process_2_desc:
			'High-fidelity prototypes and system architecture designed for scale. You approve every pixel before a single line of code is written.',
		process_2_duration: 'Week 3–4',
		process_3_title: 'Engineering & QA',
		process_3_desc:
			'Hand-crafted code, rigorous testing, and performance optimization. Every interaction under 100ms.',
		process_3_duration: 'Week 5–7',
		process_4_title: 'Launch & Growth',
		process_4_desc:
			"Deployment, monitoring, and growth analytics. We don't disappear after launch — we ensure your product wins.",
		process_4_duration: 'Week 8+',

		// FAQ
		faq_title: 'Before We Begin',
		faq_1_q: 'What does "zero-framework" actually mean?',
		faq_1_a:
			'We write every line of CSS and JavaScript by hand — no React, no Next.js, no WordPress. The result is a site that loads 3-5x faster than framework-based alternatives.',
		faq_2_q: 'How long does a typical project take?',
		faq_2_a:
			'Most projects ship in 6–10 weeks from kickoff to launch. Complex enterprise builds may extend to 12–16 weeks.',
		faq_3_q: "What's the investment range?",
		faq_3_a:
			'Our engagements start at €15,000 for focused brand sites and scale to €80,000+ for full-stack enterprise platforms.',
		faq_4_q: 'Do you work with startups or only enterprises?',
		faq_4_a:
			"Both. If you're serious about building a premium digital presence and have the budget to match, we're interested.",

		// Contact
		contact_title: "Let's Work Together",
		contact_subheadline:
			'For project inquiries, partnerships, or technical consultations, reach out through your preferred channel.',
		contact_node_phone_label: 'Direct',
		contact_node_phone_value: 'Call Us',
		contact_node_email_label: 'Formal',
		contact_node_email_value: 'Email Us',
		contact_node_whatsapp_label: 'Instant',
		contact_node_whatsapp_value: 'WhatsApp',
		contact_node_telegram_label: 'Instant',
		contact_node_telegram_value: 'Telegram',
		contact_node_github_label: 'Technical',
		contact_node_github_value: 'GitHub',
		contact_copied: 'Copied!',

		// About modal
		about_modal_label: '[ The Agency ]',
		about_modal_title: 'We engineer digital supremacy.',
		about_modal_p1:
			'CIVIDEVS is an independent digital product agency founded by engineers and designers who were tired of bloated frameworks, slow delivery cycles, and generic templates.',
		about_modal_p2:
			'We build with raw code and mathematical precision. Our zero-framework philosophy delivers elite Lighthouse scores, fast interactions, and architectures that scale without trend-driven technical debt.',
		about_modal_p3:
			'For us, performance is not an extra. It is the foundation of a premium digital presence.',
		about_modal_stat_years: 'Years of Mastery',
		about_modal_stat_frameworks: 'Frameworks Used',

		// Footer
		footer_copy: `© ${new Date().getFullYear()} CIVIDEVS`,
		footer_rights: 'All Rights Reserved',
		footer_location: 'Global · Remote · Available',
		footer_tagline: 'Strategy · Design · Engineering',
		footer_nav_title: 'Navigate',
		footer_connect_title: 'Connect',
		footer_contact: 'Contact',
		footer_privacy: 'Privacy Policy',
		footer_terms: 'Terms of Service',
	},
	it: {
		nav_services: 'Servizi',
		nav_work: 'Lavori',
		nav_process: 'Processo',
		nav_reviews: 'Recensioni',
		nav_about: 'Chi Siamo',
		nav_menu: 'Menu',
		nav_cta: 'Inizia un Progetto',
		intent_cta: 'Inizia Progetto',
		hero_label: 'Progettiamo',
		hero_line1: 'Eccellenza',
		hero_line2: 'Digitale',
		hero_expertise: 'Strategia · Design · Ingegneria',
		hero_qualifier: 'dal concept a una soluzione digitale di alto livello.',
		hero_cta: 'Inizia un Progetto',
		hero_scroll: 'Scorri',
		marquee_projects: 'Oltre 40 progetti consegnati',
		marquee_years: 'Oltre 8 anni di eccellenza',
		marquee_satisfaction: '99% di soddisfazione clienti',
		marquee_performance: 'Performance zero-framework',
		marquee_security: 'Sicurezza di livello enterprise',
		services_title: 'Capacità Strategiche',
		services_intro:
			'Non vendiamo ore. Consegniamo asset che crescono di valore nel tempo.',
		svc_web_title: 'Piattaforme Digitali',
		svc_web_result: 'Caricamento <1s · 100/100 Lighthouse',
		svc_web_outcome:
			'Piattaforme web ad alte prestazioni, zero bloat, che convertono visitatori in ricavi — costruite senza dipendenze da framework.',
		svc_seo_title: 'Dominanza Organica',
		svc_seo_result: '+200% Traffico Organico · Pagina 1',
		svc_seo_outcome:
			'Dominanza di mercato attraverso autorità tecnica e architettura strategica dei contenuti.',
		svc_brand_title: 'Autorità Visiva',
		svc_brand_result: 'Posizionamento Premium · Brand Equity',
		svc_brand_outcome:
			'Identità visive che giustificano prezzi premium. Dai sistemi di logo agli ecosistemi di brand completi.',
		svc_auto_title: 'Intelligenza Operativa',
		svc_auto_result: '40ore/mese Recuperate · Zero Errori',
		svc_auto_outcome:
			'Automazione dei workflow e integrazione dei sistemi che elimina il lavoro ripetitivo.',
		svc_mkt_title: 'Ingegneria della Crescita',
		svc_mkt_result: 'Data-Driven · ROI Misurabile',
		svc_mkt_outcome:
			'Marketing performante e ottimizzazione della conversione supportati da dati reali.',
		services_nudge:
			'Scopri come queste capacità si applicano al tuo business →',

		// About Banners
		about_banner1_label: '[ Dietro il Codice ]',
		about_banner1_title: 'Curioso di sapere chi costruisce tutto questo?',
		about_banner1_desc:
			'Siamo un collettivo specializzato di ingegneri e designer senior che creano asset digitali premium. Nessun junior. Nessun template. Solo competenza pura applicata ai tuoi obiettivi.',
		about_banner1_tag1: '0 Framework',
		about_banner1_tag2: 'Caricamento <100ms',
		about_banner1_tag3: 'Codice Premium',
		about_cta: "Scopri l'Agenzia",
		about_banner2_label: '[ Gli Architetti ]',
		about_banner2_title: 'Vuoi saperne di più?',
		about_banner2_desc:
			"CIVIDEVS opera all'intersezione tra estetica d'alto livello e performance a livello molecolare. Costruiamo flagship digitali per brand che non possono permettersi compromessi.",
		about_banner2_tag1: 'Design Su Misura',
		about_banner2_tag2: 'Vanilla JS',
		about_banner2_tag3: 'Scala Globale',

		why_title: 'Perché CIVIDEVS',
		why_lead:
			'Le altre agenzie vendono template. Noi costruiamo vantaggi competitivi.',
		why_speed_title: 'Performance al Primo Posto',
		why_speed_desc:
			'Codice scritto a mano, senza dipendenze da framework. Tempi di caricamento sotto il secondo, Core Web Vitals eccellenti e conversioni che superano con continuita i benchmark di settore.',
		why_aesthetic_title: 'Costruito Su Misura',
		why_aesthetic_desc:
			'Ogni progetto viene progettato e sviluppato da zero. Nessun tema preconfezionato, nessun plugin, nessun compromesso. Ricevi un asset digitale unico, costruito sui tuoi obiettivi di business.',
		why_ownership_title: 'Attenzione Dedicata',
		why_ownership_desc:
			'Seguiamo un numero limitato di clienti per trimestre. Il tuo progetto riceve competenze senior dalla fase strategica al lancio, e ogni riga di codice resta di tua proprieta.',
		why_nudge: 'Disponibilità limitata questo trimestre — contattaci →',
		work_title: "Prove d'Impatto",
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
		testimonial_cat: 'Testimonianza',
		testimonial_1_text:
			'"CIVIDEVS non ha solo realizzato la nostra piattaforma: ha rafforzato il nostro posizionamento sul mercato. Il fatturato e cresciuto del 340% nel primo trimestre dopo il lancio."',
		testimonial_1_author: '— Marcus Chen',
		testimonial_1_role: 'CEO, Quantum Banking',
		testimonial_2_text:
			'"Il sito piu veloce del nostro settore. Il bounce rate e sceso del 60% praticamente da un giorno all\'altro. Qui la performance viene trattata con un livello di precisione raro."',
		testimonial_2_author: '— Sarah Lindström',
		testimonial_2_role: 'CTO, MedSync Health',
		testimonial_3_text:
			'"Niente fronzoli, niente sprint sprecati. Hanno consegnato in 8 settimane cio che la nostra agenzia precedente non era riuscita a completare in 8 mesi."',
		testimonial_3_author: '— David Okafor',
		testimonial_3_role: 'Fondatore, Luxe Retail',
		process_title: 'Come Consegniamo',
		process_1_title: 'Scoperta & Strategia',
		process_1_desc:
			'Analizziamo il tuo mercato, studiamo i competitor e definiamo la strategia digitale piu adatta a posizionarti con autorevolezza.',
		process_1_duration: 'Settimana 1–2',
		process_2_title: 'Design & Architettura',
		process_2_desc:
			"Prototipi ad alta fedelta e un'architettura tecnica progettata per sostenere la crescita nel tempo.",
		process_2_duration: 'Settimana 3–4',
		process_3_title: 'Ingegneria & QA',
		process_3_desc:
			'Codice curato a mano, test rigorosi e ottimizzazione continua delle prestazioni.',
		process_3_duration: 'Settimana 5–7',
		process_4_title: 'Lancio & Crescita',
		process_4_desc:
			'Deployment, monitoraggio e analytics di crescita. Non scompariamo dopo il lancio: restiamo al tuo fianco per far performare il prodotto.',
		process_4_duration: 'Settimana 8+',
		faq_title: 'Prima di Iniziare',
		faq_1_q: 'Cosa significa "zero-framework"?',
		faq_1_a:
			'Scriviamo ogni riga di CSS e JavaScript a mano: niente React, niente Next.js, niente WordPress. Il risultato e un sito da tre a cinque volte piu veloce rispetto alle alternative basate su framework.',
		faq_2_q: 'Quanto dura un progetto tipico?',
		faq_2_a:
			'La maggior parte dei progetti viene consegnata in 6–10 settimane dal kickoff al lancio. Le implementazioni enterprise piu complesse possono richiedere tempi superiori.',
		faq_3_q: 'Qual è il range di investimento?',
		faq_3_a:
			'I nostri progetti partono da 15.000 euro per siti brand focalizzati e possono superare gli 80.000 euro per piattaforme enterprise complete.',
		faq_4_q: 'Lavorate con startup o solo enterprise?',
		faq_4_a:
			'Entrambi. Se vuoi costruire una presenza digitale premium e hai obiettivi chiari, siamo interessati.',
		contact_title: 'Lavoriamo Insieme',
		contact_subheadline:
			'Per richieste di progetto, partnership o consulenze tecniche, contattaci attraverso il canale che preferisci.',
		contact_node_phone_label: 'Diretto',
		contact_node_phone_value: 'Chiamaci',
		contact_node_email_label: 'Formale',
		contact_node_email_value: 'Scrivici',
		contact_node_whatsapp_label: 'Immediato',
		contact_node_whatsapp_value: 'WhatsApp',
		contact_node_telegram_label: 'Immediato',
		contact_node_telegram_value: 'Telegram',
		contact_node_github_label: 'Tecnico',
		contact_node_github_value: 'GitHub',
		contact_copied: 'Copiato!',
		about_modal_label: "[ L'Agenzia ]",
		about_modal_title: 'Progettiamo supremazia digitale.',
		about_modal_p1:
			"CIVIDEVS e un'agenzia indipendente di prodotti digitali fondata da ingegneri e designer stanchi di framework pesanti, consegne lente e template generici.",
		about_modal_p2:
			'Lavoriamo con codice puro e precisione tecnica. La nostra filosofia zero-framework garantisce Lighthouse di alto livello, interazioni rapide e architetture scalabili senza debito tecnico dettato dalle mode.',
		about_modal_p3:
			'Per noi la performance non e un extra. E la base di una presenza digitale premium.',
		about_modal_stat_years: 'Anni di esperienza',
		about_modal_stat_frameworks: 'Framework utilizzati',
		footer_copy: `© ${new Date().getFullYear()} CIVIDEVS`,
		footer_rights: 'Tutti i Diritti Riservati',
		footer_location: 'Globale · Remoto · Disponibile',
		footer_tagline: 'Strategia · Design · Ingegneria',
		footer_nav_title: 'Navigazione',
		footer_connect_title: 'Contatti',
		footer_contact: 'Contatto',
		footer_privacy: 'Privacy Policy',
		footer_terms: 'Termini di Servizio',
	},
}

/**
 * Language Toggle functionality
 */
function initLanguageToggle() {
	const html = document.documentElement
	const STORAGE_KEY = 'cividevs-lang'
	const languageLabels = {
		en: 'EN',
		it: 'IT',
	}

	const getSavedLang = () => {
		try {
			return localStorage.getItem(STORAGE_KEY) || 'en'
		} catch (e) {
			return 'en'
		}
	}

	const saveLang = lang => {
		try {
			localStorage.setItem(STORAGE_KEY, lang)
		} catch (e) {}
	}

	/**
	 * Apply translations using data-i18n attributes
	 */
	const applyTranslations = lang => {
		const t = translations[lang]
		if (!t) return

		html.setAttribute('lang', lang)

		// Update all elements with data-i18n attribute
		document.querySelectorAll('[data-i18n]').forEach(el => {
			const key = el.getAttribute('data-i18n')
			if (t[key] !== undefined) {
				// If this element was split-text animated, clear the spans first
				if (
					el.hasAttribute('data-split-text') ||
					el.querySelector('.char, .word')
				) {
					el.innerHTML = t[key]
					// Reset opacity/transform in case animation left them invisible
					el.style.opacity = '1'
					el.style.transform = 'none'
				} else {
					el.textContent = t[key]
				}
			}
		})
	}

	const setLanguage = lang => {
		document.querySelectorAll('.js-lang-option').forEach(opt => {
			opt.classList.toggle('is-active', opt.dataset.lang === lang)
		})
		document.querySelectorAll('.js-lang-current').forEach(label => {
			label.textContent = languageLabels[lang] || languageLabels.en
		})
		document.querySelectorAll('.js-lang-toggle').forEach(button => {
			const label = languageLabels[lang] || languageLabels.en
			button.setAttribute('aria-label', `Selected language ${label}`)
			button.setAttribute('title', `Selected language ${label}`)
		})
		applyTranslations(lang)
		renderProjects(lang)
		initActiveCardObserver()
		saveLang(lang)
	}

	// Use event delegation for all language interactions
	document.addEventListener('click', e => {
		// Toggle dropdown
		const toggleBtn = e.target.closest('.js-lang-toggle')
		if (toggleBtn) {
			e.preventDefault()
			e.stopPropagation()
			const parent = toggleBtn.closest('.js-lang-dropdown')
			if (parent) {
				const isOpen = parent.classList.contains('is-open')
				// Close all other lang dropdowns
				document
					.querySelectorAll('.js-lang-dropdown')
					.forEach(d => d.classList.remove('is-open'))
				if (!isOpen) {
					parent.classList.add('is-open')
				}
			}
			return
		}

		// Language selection
		const langOption = e.target.closest('.js-lang-option')
		if (langOption) {
			e.preventDefault()
			const lang = langOption.getAttribute('data-lang')
			setLanguage(lang)
			document
				.querySelectorAll('.js-lang-dropdown')
				.forEach(d => d.classList.remove('is-open'))
			return
		}

		// Close on outside click
		if (!e.target.closest('.js-lang-dropdown')) {
			document
				.querySelectorAll('.js-lang-dropdown')
				.forEach(d => d.classList.remove('is-open'))
		}
	})

	// Close on escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			document
				.querySelectorAll('.js-lang-dropdown')
				.forEach(d => d.classList.remove('is-open'))
		}
	})

	const savedLang = getSavedLang()
	setLanguage(savedLang)
	return savedLang
}

/**
 * Initialize all modules when DOM is ready
 */
function init() {
	// Initialize theme early to prevent flash
	initThemeToggle()

	// Initialize language early
	const currentLang = initLanguageToggle()

	// Wait for fonts to load before starting animations
	document.fonts.ready.then(() => {
		initPreloader()
	})

	// Initialize core systems
	initLenis()
	initAnchorLinks()

	// Initialize components (non-animated ones)
	initCustomCursor()
	renderProjects(currentLang)
	initMobileSliders()
	initActiveCardObserver()
	initMobileAppExperience()

	// Initialize animations after preloader completes
	document.addEventListener('preloader:complete', () => {
		initAnimations()
	})

	// Handle reduced motion preference
	if (prefersReducedMotion()) {
		document.documentElement.classList.add('reduced-motion')
	}
}

// Start when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init)
} else {
	init()
}
