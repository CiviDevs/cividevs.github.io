# CIVIDEVS
Gay
**Premium Digital Agency — Brutalist Luxury Framework**

A high-performance, ultra-premium agency website built with pure HTML5, CSS3, and Vanilla JavaScript (ES Modules).

## Design Philosophy

- **Color Palette**: Deep Black (#0a0a0a), Pure White (#ffffff)
- **Aesthetic**: Brutalist Luxury — thin 1px lines, no glows, heavy focus on typography
- **Typography**: Montserrat (headers), Inter (body), Fluid Typography via `clamp()`
- **Inspiration**: Boutique design studios from Porto, Berlin, Tokyo

## Tech Stack

| Category | Technology |
|----------|------------|
| Smooth Scroll | Lenis |
| Animations | GSAP 3.x + ScrollTrigger |
| Fonts | Google Fonts (Montserrat, Inter) |
| Build | Pure vanilla — no build step required |
| Deploy | GitHub Pages |

## Project Structure

```
CiviDevs5/
├── index.html              # Main entry point
├── styles/
│   ├── main.css           # Design tokens, resets, globals
│   ├── components.css     # Buttons, lines, cursor, utilities
│   └── sections.css       # Section-specific styles
├── scripts/
│   ├── main.js           # Entry point, Lenis init
│   ├── animations.js     # GSAP ScrollTrigger logic
│   └── components.js     # Custom cursor, magnetic buttons
├── .github/workflows/
│   └── deploy.yml        # GitHub Pages deployment
└── README.md
```

## Features

- **Preloader**: Black overlay with expanding 1px line reveal
- **Custom Cursor**: Inversion cursor using `mix-blend-mode: difference`
- **Section Dividers**: 1px lines animating width on scroll
- **Hero**: Split-text reveal animation with signature line
- **Solutions Bento**: 4-column grid with sharp borders, hover states
- **Project Showcase**: Floating image preview on hover
- **Stats Bar**: Count-up animation using GSAP
- **Magnetic Buttons**: Elements attract to cursor
- **Smooth Scroll**: Lenis integration with GSAP ScrollTrigger

## Development

No build step required. For local development:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000`

## Deployment

Automatic deployment to GitHub Pages on every push to `main` or `master`.

### Manual Setup

1. Push to GitHub
2. Go to Settings → Pages
3. Set Source to "GitHub Actions"

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- `loading="lazy"` on images
- Modern `srcset` for responsive images
- Hardware-accelerated animations (transform, opacity)
- Reduced motion support via `prefers-reduced-motion`

## Credits

Built by **NIK | TOMA** — Lead Developer / Project Manager

---

© 2024 CIVIDEVS. All rights reserved.
