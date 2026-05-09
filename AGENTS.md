# CIVIDEVS — Agent Development Guide

> **Project**: CIVIDEVS Premium Digital Agency Website  
> **Stack**: Vanilla HTML5/CSS3/JS (ES Modules), GSAP, Lenis  
> **Architecture**: Brutalist Luxury — thin 1px lines, no glows, typography-focused  
> **Maintainer**: NIK | TOMA — Lead Developer / Project Manager

---

## 1. Project Overview

CIVIDEVS is a **premium agency portfolio website** built with a "Brutalist Luxury" aesthetic. It's a **pure vanilla JS project** — no frameworks, no build step, just modern web standards.

### Core Philosophy
- **Visual Language**: Deep black (#0a0a0a) ↔ Pure white (#ffffff), thin 1px lines, no shadows/glows
- **Typography-Driven**: Fluid typography via `clamp()`, Montserrat (headers) + Inter (body)
- **Performance**: Sub-100ms interactions, hardware-accelerated animations
- **Accessibility**: Respects `prefers-reduced-motion`, keyboard navigation support

---

## 2. Architecture Deep Dive

### 2.1 File Structure

```
CiviDevs5/
├── index.html              # Single-page entry, all sections inline
├── styles/
│   ├── main.css           # Design tokens, CSS reset, globals, cursor, preloader
│   ├── components.css     # Buttons, cards, lines, tags, reveal animations
│   └── sections.css       # Hero, stats, bento grid, projects, about, contact
├── scripts/
│   ├── main.js            # Entry: Lenis init, preloader, theme toggle, anchor links
│   ├── animations.js      # GSAP ScrollTrigger logic, all section animations
│   └── components.js      # Custom cursor, magnetic effects, ripple, tilt, project preview
├── .github/workflows/
│   └── deploy.yml         # GitHub Pages auto-deployment
├── README.md
└── AGENTS.md              # You are here
```

### 2.2 Module System (ES Modules)

All JS uses **native ES modules** with import/export:

```javascript
// main.js — entry point
import { initCustomCursor } from './components.js';
import { initAnimations } from './animations.js';

// scripts are loaded with type="module" in index.html
<script type="module" src="scripts/main.js"></script>
```

**Key Export Patterns:**
- `main.js`: exports `prefersReducedMotion()` — ALWAYS check this before animations
- `animations.js`: exports `initAnimations()` — called after preloader completes
- `components.js`: exports `initCustomCursor()`, `initRippleEffect()`, `initTiltEffect()`, `initLinkSweep()`, `initProjectPreview()`

### 2.3 CSS Architecture (ITCSS-like)

| File | Responsibility |
|------|----------------|
| `main.css` | Design tokens (`:root`), reset, typography, cursor, preloader, header, footer, theme toggle |
| `components.css` | Reusable UI components (buttons, cards, tags, lines), utility classes, light theme overrides |
| `sections.css` | Section-specific layouts (hero, stats, bento, projects, about, contact), responsive breakpoints |

---

## 3. Design System Reference

### 3.1 CSS Custom Properties (Design Tokens)

All styling uses CSS variables defined in `main.css:9-79`:

```css
:root {
  /* Colors - Dark (default) */
  --color-bg: #0a0a0a;
  --color-bg-elevated: #111111;
  --color-surface: #1a1a1a;
  --color-text: #ffffff;
  --color-text-muted: rgba(255, 255, 255, 0.6);
  --color-text-subtle: rgba(255, 255, 255, 0.4);
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-hover: rgba(255, 255, 255, 1);
  
  /* Light theme override at :84 */
  [data-theme="light"] {
    --color-bg: #fafafa;
    --color-text: #111111;
    /* ... */
  }
  
  /* Typography - Fluid */
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
  --text-display: clamp(3rem, 12vw, 10rem);
  --text-h1: clamp(2.5rem, 8vw, 6rem);
  /* ... */
  
  /* Spacing - Fluid */
  --space-xs: clamp(0.5rem, 1vw, 0.75rem);
  --space-3xl: clamp(6rem, 12vw, 10rem);
  
  /* Z-Index Scale */
  --z-preloader: 9999;
  --z-cursor: 9998;
  --z-header: 100;
}
```

### 3.2 Animation Timing

```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;
--ease-out: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
--ease-in-out: cubic-bezier(0.87, 0, 0.13, 1);
```

### 3.3 Breakpoints

Responsive design uses **mobile-first** with these breakpoints:
- `max-width: 768px` — Tablet/mobile (main.css:666)
- `max-width: 1024px` — Small desktop (sections.css:297)
- `max-width: 640px` — Mobile (sections.css:308)
- `max-width: 480px` — Small mobile (sections.css:622)

---

## 4. JavaScript Systems

### 4.1 Initialization Order (main.js:190-215)

```
1. initThemeToggle()      → Apply saved/system theme immediately
2. Wait for fonts ready   → document.fonts.ready.then()
3. initPreloader()        → GSAP animation, emits 'preloader:complete'
4. initLenis()            → Smooth scroll, connected to GSAP ScrollTrigger
5. initAnchorLinks()      → Smooth scroll to #anchors via Lenis
6. initCustomCursor()     → Cursor immediately visible
7. After preloader:complete → initAnimations() (all GSAP animations)
```

### 4.2 Smooth Scroll (Lenis) Configuration

```javascript
// main.js:18-26
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
});

// Connected to GSAP via:
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
```

**Global access**: `window.lenis` — use for programmatic scrolling.

### 4.3 Preloader Sequence (main.js:74-109)

GSAP timeline animation:
1. Line grows vertically to 100vh (1.2s, expo.inOut)
2. Line expands to fill screen (0.8s, expo.inOut)
3. Fades out, dispatches `preloader:complete` event
4. CSS fade out via `.is-complete` class

### 4.4 Theme Toggle System (main.js:123-185)

- **Storage key**: `cividevs-theme` in localStorage
- **Attribute**: `data-theme="light"` on `<html>`
- **Anti-flash script**: In `<head>` to prevent FOUC
- **System preference**: Listens to `prefers-color-scheme` if no saved theme

**Adding light theme styles:** Always add after dark styles in this pattern:
```css
.element { border-color: var(--color-border); }
[data-theme="light"] .element { border-color: rgba(0, 0, 0, 0.2); }
```

### 4.5 Animation Controller (animations.js)

**Critical Pattern**: All animations check `prefersReducedMotion()` first:

```javascript
export function initAnimations() {
    if (prefersReducedMotion()) {
        // Make everything visible, skip animations
        document.querySelectorAll('[data-split-text], .bento-cell, ...')
            .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    // ... animation sequences
}
```

**Split Text Animation** (animations.js:18-48):
```javascript
function splitText(element, type = 'chars') {
    // Splits text into spans for character/word animation
    // Returns NodeList of `.char` or `.word` spans
}
```

**ScrollTrigger Pattern**:
```javascript
gsap.fromTo(element, 
    { y: 50, opacity: 0 },
    {
        y: 0, opacity: 1,
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',    // when top of element hits 80% viewport
            toggleActions: 'play none none none'  // play once
        }
    }
);
```

### 4.6 Component Interactions (components.js)

| Function | Purpose | Key Behavior |
|----------|---------|--------------|
| `initCustomCursor()` | Inverted cursor with follower | Hides on touch devices, pauses on `visibilitychange` |
| `initRippleEffect()` | Hover ripple on interactive elements | Creates dynamic DOM element, positions at mouse entry |
| `initTiltEffect()` | 3D tilt on bento cards | `perspective(1000px) rotateX/Y`, limited to ±3deg |
| `initLinkSweep()` | Underline sweep animation | Creates `.link-sweep` span dynamically |
| `initProjectPreview()` | Floating image on project hover | Follows cursor with 0.1 lerp, uses Unsplash images |

---

## 5. Section-by-Section Guide

### 5.1 Hero Section (`#hero`)

**Key Elements**:
- `.hero__title-line` — Split-text animation (chars)
- `.hero__signature` — NIK / TOMA with animated line
- `.hero__role` — Split-text animation (words)
- `.hero__scroll-indicator` — Animated line with pulse animation

**Animations** (animations.js:53-110):
- Title chars stagger in from y: 100%
- Signature fades up
- Role words stagger in
- Scroll indicator fades in last

**Responsive**: Always centered, fluid typography scales with viewport.

### 5.2 Stats Section (`#stats`)

**Key Elements**:
- `.stats__grid` — 4-column grid (2-column on mobile)
- `[data-count]` — Numbers animate via GSAP `innerText` tween
- `.stat__divider` — 1px vertical lines (hidden on mobile)

**Animation** (animations.js:138-163):
- Count-up from 0 to `data-count` value
- Duration: 2s, snap to whole numbers
- Triggered at 'top 80%' viewport

### 5.3 Solutions Bento Grid (`#solutions`)

**Key Elements**:
- `.bento-grid` — 4x2 CSS grid with 1px gap (becomes border)
- `.bento-cell` — Individual cards with hover states
- `.bento-cell--large` — Spans 2 columns
- `.bento-cell--wide` — Spans 2 columns

**Grid Layout** (sections.css:197-204):
```css
.bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;                    /* Creates the lines between cells */
    background: var(--color-border);  /* Shows through gaps */
    border: 1px solid var(--color-border);
}
```

**Hover Effects**:
- Background shifts to `--color-bg-elevated`
- Border appears via `::before` pseudo-element
- Subtle box-shadow appears
- Content lifts up 5px
- Bottom line expands from 40px to 60px

**Tilt Effect**: 3D rotation based on mouse position within card.

### 5.4 Projects Section (`#work`)

**Key Elements**:
- `.project-item` — List items with `[data-project]` attribute
- `.project-preview` — Fixed floating image container

**Layout**: CSS Grid — `200px 1fr 100px` (meta | title | year)

**Interactions**:
- Hover: left padding increases, bottom line expands
- Title shifts right 10px
- Project preview follows cursor with project-specific image

**Project Images** (components.js:266-271):
Mapped by `data-project` attribute to Unsplash URLs:
```javascript
const projectImages = {
    fintech: 'https://images.unsplash.com/...',
    healthcare: 'https://images.unsplash.com/...',
    // ...
};
```

### 5.5 About Section (`#about`)

**Key Elements**:
- `.about__lead` — Large statement text (split-text)
- `.about__body` — Supporting paragraph
- `.about__principles` — 3 principles with left border

**Layout**: 2-column grid (1.2fr 1fr), stacks on mobile.

### 5.6 Contact Section (`#contact`)

**Key Elements**:
- `.contact__title` — Split-text animation
- `.contact__email` — Animated underline on hover
- `.contact__links` — Social links with sweep effect

---

## 6. Critical Implementation Patterns

### 6.1 Adding a New Section

```html
<!-- 1. Add to index.html -->
<div class="section-divider" data-animate-line></div>
<section class="section-class" id="section-id">
    <div class="section-class__container">
        <div class="section-header">
            <span class="section-header__label">[ 04 ]</span>
            <h2 class="section-header__title">Section Name</h2>
        </div>
        <!-- content -->
    </div>
</section>
```

```css
/* 2. Add to sections.css */
.section-class { padding: var(--space-3xl) var(--gutter); }
.section-class__container { max-width: var(--container-max); margin-inline: auto; }
/* Light theme adjustments at bottom of file */
[data-theme="light"] .section-class { ... }
```

```javascript
// 3. Add to animations.js
function animateNewSection() {
    const section = document.querySelector('.section-class');
    gsap.fromTo(section, 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1,
            scrollTrigger: { trigger: section, start: 'top 80%' }
        }
    );
}
// Call in initAnimations()
```

### 6.2 Adding Theme-Aware Styles

Always add light theme overrides **at the bottom** of the relevant CSS file:

```css
/* In main.css, components.css, or sections.css */
[data-theme="light"] .your-element {
    border-color: rgba(0, 0, 0, 0.2);
}
```

Common patterns:
- Borders: `rgba(0, 0, 0, 0.2)` instead of `rgba(255, 255, 255, 0.1)`
- Backgrounds: Keep using CSS vars, they switch automatically
- Images: May need contrast adjustments

### 6.3 Touch Device Handling

Always check before mouse-dependent effects:

```javascript
if (window.matchMedia('(pointer: coarse)').matches) return;
```

This applies to:
- Custom cursor
- Hover effects (ripple, tilt)
- Project preview

### 6.4 Reduced Motion Handling

Check at function start:

```javascript
import { prefersReducedMotion } from './main.js';
function initEffect() {
    if (prefersReducedMotion()) return;
    // ... animation code
}
```

### 6.5 RAF Loop Pattern

For smooth cursor following/parallax:

```javascript
let targetX = 0, currentX = 0, rafId = null;
const animate = () => {
    currentX += (targetX - currentX) * 0.1;  // Lerp factor 0.1 = smooth
    element.style.left = `${currentX}px`;
    rafId = requestAnimationFrame(animate);
};
// Start: animate()
// Stop: cancelAnimationFrame(rafId)
```

---

## 7. External Dependencies

Loaded via CDN in `index.html:313-315`:

```html
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

**GSAP Plugin Usage**:
- `ScrollTrigger` — All scroll-based animations
- No other plugins required

---

## 8. Development Workflow

### 8.1 Local Development

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000`

### 8.2 Deployment

Automatic via GitHub Actions (`.github/workflows/deploy.yml`):
- Triggers on push to `main` or `master`
- Deploys to GitHub Pages
- No build step required

### 8.3 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 9. Common Pitfalls & Solutions

### Pitfall: Animation not triggering
**Cause**: Element added after `initAnimations()` ran  
**Fix**: Ensure element exists before ScrollTrigger initializes, or call ScrollTrigger.refresh()

### Pitfall: Cursor shows on touch device
**Cause**: Missing coarse pointer check  
**Fix**: Add `if (window.matchMedia('(pointer: coarse)').matches) return;`

### Pitfall: Light theme flashes on load
**Cause**: Theme applied after render  
**Fix**: Anti-flash script in `<head>` sets theme before paint

### Pitfall: Split text breaks layout
**Cause**: Words/chars wrapped in spans cause spacing issues  
**Fix**: Use `&nbsp;` for spaces, ensure spans are `display: inline-block`

### Pitfall: Smooth scroll not working
**Cause**: GSAP ScrollTrigger not synced to Lenis  
**Fix**: Ensure `lenis.on('scroll', ScrollTrigger.update)` is called

---

## 10. Quick Reference: CSS Classes

### Layout
- `.container` — Max-width 1400px, centered
- `.container--narrow` — Max-width 900px
- `.section-divider` — 1px line, animates width on scroll
- `.section-header` — Label + title with bottom border

### Typography
- `[data-split-text]` — Mark for split-text animation
- `.text-muted` — Secondary text color
- `.text-subtle` — Tertiary text color

### Components
- `.btn` — Base button with hover fill
- `.btn--filled` — Solid background
- `.btn--minimal` — No border, underline only
- `.card` — Elevated card with hover lift
- `.tag` — Bordered label
- `.bento-cell` — Grid cell with hover effects

### States
- `.is-visible` — Reveal animation complete
- `.is-hovering` — Cursor hover state
- `.is-clicking` — Cursor click state
- `.is-complete` — Preloader finished

---

## 11. Quick Reference: JavaScript APIs

### Global
- `window.lenis` — Lenis instance for programmatic scroll
- `prefersReducedMotion()` — Returns boolean

### Events
- `preloader:complete` — Dispatched when preloader finishes

### GSAP Patterns
```javascript
// Basic reveal
gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' });

// Stagger
gsap.to(elements, { stagger: 0.1, ... });

// ScrollTrigger
gsap.fromTo(el, fromVars, { ...toVars, scrollTrigger: { trigger: el, start: 'top 80%' }});
```

---

## 12. Agent Checklist

When modifying this codebase:

- [ ] Test both light and dark themes
- [ ] Test at mobile breakpoint (≤768px)
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify cursor behavior on hover (desktop)
- [ ] Check that anchor links work with Lenis
- [ ] Ensure section dividers animate on scroll
- [ ] Verify no console errors
- [ ] Test GitHub Pages deployment compatibility (no build step)

---

**Last Updated**: 2024  
**Maintainer**: NIK | TOMA — Lead Developer / Project Manager  
**Project**: CIVIDEVS — Premium Digital Agency
