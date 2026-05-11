import { prefersReducedMotion } from './utils.js'

export function initMobileAppExperience() {
	const mobileDock = document.getElementById('mobileDock')
	const mobileMenuBtn = document.getElementById('mobileMenuBtn')
	const mobileMenu = document.getElementById('mobileMenu')
	const mobileMenuClose = document.getElementById('mobileMenuClose')
	const mobileMenuOverlay = document.getElementById('mobileMenuOverlay')
	const dockIndicator = document.getElementById('dockIndicator')
	const dockItems = document.querySelectorAll(
		'.mobile-dock__item:not(.mobile-dock__menu-btn)',
	)
	const menuLinks = document.querySelectorAll('.mobile-menu__link')

	// 1. Smart Sticky Dock (Hide on scroll down, show on scroll up)
	if (mobileDock) {
		let lastScrollY = window.scrollY
		let isDockHidden = false

		window.addEventListener(
			'scroll',
			() => {
				if (window.innerWidth > 768) return

				const currentScrollY = window.scrollY
				if (
					currentScrollY > 100 &&
					currentScrollY > lastScrollY &&
					!isDockHidden
				) {
					mobileDock.classList.add('is-hidden')
					isDockHidden = true
				} else if (currentScrollY < lastScrollY && isDockHidden) {
					mobileDock.classList.remove('is-hidden')
					isDockHidden = false
				}
				lastScrollY = currentScrollY
			},
			{ passive: true },
		)

		// 2. Magnetic Dock Indicator & Active States
		const updateDockIndicator = activeIndex => {
			if (activeIndex === -1 || !dockIndicator) return
			dockIndicator.style.transform = `translate3d(${activeIndex * 100}%, 0, 0)`

			dockItems.forEach((item, idx) => {
				item.classList.toggle('is-active', idx === activeIndex)
			})
		}

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const id = entry.target.id
						const activeIndex = Array.from(dockItems).findIndex(
							item => item.getAttribute('href') === `#${id}`,
						)
						if (activeIndex !== -1) updateDockIndicator(activeIndex)
					}
				})
			},
			{ threshold: 0.5 },
		)

		document
			.querySelectorAll('section[id]')
			.forEach(section => observer.observe(section))

		dockItems.forEach((item, index) => {
			item.addEventListener('touchstart', () => updateDockIndicator(index), {
				passive: true,
			})
		})
	}

	// 3. Full-Screen Menu Overlay Animation
	if (mobileMenu && mobileMenuBtn) {
		let menuTimeline = null

		const openMenu = () => {
			mobileMenu.classList.add('is-open')
			document.body.style.overflow = 'hidden'
			mobileMenuBtn.setAttribute('aria-expanded', 'true')
			if (menuTimeline) menuTimeline.kill()
			menuTimeline = gsap.timeline()

			if (!prefersReducedMotion()) {
				menuTimeline
					.to(menuLinks, {
						y: 0,
						opacity: 1,
						duration: 0.4,
						stagger: 0.05,
						ease: 'power3.out',
						delay: 0.2,
					})
					.to(
						'.mobile-menu__footer',
						{
							y: 0,
							opacity: 1,
							duration: 0.4,
							ease: 'power3.out',
						},
						'-=0.2',
					)
			} else {
				gsap.set([menuLinks, '.mobile-menu__footer'], { y: 0, opacity: 1 })
			}
		}

		const closeMenu = () => {
			mobileMenu.classList.remove('is-open')
			document.body.style.overflow = ''
			mobileMenuBtn.setAttribute('aria-expanded', 'false')
			if (menuTimeline) menuTimeline.kill()
			gsap.set([menuLinks, '.mobile-menu__footer'], { y: 20, opacity: 0 })

			// Close any open language dropdowns
			document
				.querySelectorAll('.js-lang-dropdown')
				.forEach(d => d.classList.remove('is-open'))
		}

		mobileMenuBtn.addEventListener('click', openMenu)
		if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu)
		if (mobileMenuOverlay)
			mobileMenuOverlay.addEventListener('click', closeMenu)
		menuLinks.forEach(link => link.addEventListener('click', closeMenu))

		let touchStartY = 0
		mobileMenu.addEventListener(
			'touchstart',
			e => {
				touchStartY = e.changedTouches[0].screenY
			},
			{ passive: true },
		)

		mobileMenu.addEventListener(
			'touchend',
			e => {
				const touchEndY = e.changedTouches[0].screenY
				if (touchEndY - touchStartY > 100) closeMenu()
			},
			{ passive: true },
		)

		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
				closeMenu()
			}
		})
	}
}
