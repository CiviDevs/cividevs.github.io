import { prefersReducedMotion } from './main.js';

export function initMobileAppExperience() {
    const mobileDock = document.getElementById('mobileDock');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const dockIndicator = document.getElementById('dockIndicator');
    const dockItems = document.querySelectorAll('.mobile-dock__item[data-section]');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');
    
    if (!mobileDock) return;

    // 1. Smart Sticky Dock (Hide on scroll down, show on scroll up)
    let lastScrollY = window.scrollY;
    let isDockHidden = false;

    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) return;
        
        const currentScrollY = window.scrollY;
        // Don't hide at the very top
        if (currentScrollY > 100 && currentScrollY > lastScrollY && !isDockHidden) {
            mobileDock.classList.add('is-hidden');
            isDockHidden = true;
        } else if (currentScrollY < lastScrollY && isDockHidden) {
            mobileDock.classList.remove('is-hidden');
            isDockHidden = false;
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    // 2. Magnetic Dock Indicator & Active States
    function updateDockIndicator(activeIndex) {
        if (activeIndex === -1 || !dockIndicator) return;
        const widthPercent = 25; // 4 items
        dockIndicator.style.transform = `translate3d(${activeIndex * 100}%, 0, 0)`;
        
        dockItems.forEach((item, idx) => {
            if (idx === activeIndex) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    }

    // Observe sections to update active state
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const activeIndex = Array.from(dockItems).findIndex(item => item.getAttribute('href') === `#${id}`);
                if (activeIndex !== -1) {
                    updateDockIndicator(activeIndex);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    // Handle dock clicks with haptic feel (fake zero-delay touch)
    dockItems.forEach((item, index) => {
        item.addEventListener('touchstart', () => {
            updateDockIndicator(index);
        }, { passive: true });
    });

    // 3. Full-Screen Menu Overlay Animation
    let menuTimeline = null;

    function openMenu() {
        mobileMenu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        
        if (menuTimeline) menuTimeline.kill();
        
        menuTimeline = gsap.timeline();
        
        if (!prefersReducedMotion()) {
            menuTimeline.to(menuLinks, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power3.out',
                delay: 0.2
            }).to('.mobile-menu__footer', {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: 'power3.out'
            }, '-=0.2');
        } else {
            gsap.set([menuLinks, '.mobile-menu__footer'], { y: 0, opacity: 1 });
        }
    }

    function closeMenu() {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        
        if (menuTimeline) menuTimeline.kill();
        
        gsap.set([menuLinks, '.mobile-menu__footer'], { 
            y: 20, 
            opacity: 0 
        });
    }

    if (mobileMenuBtn && mobileMenuClose) {
        mobileMenuBtn.addEventListener('click', openMenu);
        mobileMenuClose.addEventListener('click', closeMenu);
        
        // Close on link click
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Swipe down to close (basic implementation)
        let touchStartY = 0;
        mobileMenu.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        mobileMenu.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].screenY;
            if (touchEndY - touchStartY > 100) { // Swipe down
                closeMenu();
            }
        }, { passive: true });
    }
}
