# 📚 Template Analysis & Migration Guide

**Source**: Muka Bakery & Cooking Classes HTML Template  
**Date**: 2026-04-08  
**Status**: Analysis Complete, Phase 1.5 Homepage Implemented

---

## 📊 Template Statistics

### File Count
- **Total Files**: 1,375
- **HTML Pages**: 114
- **CSS Files**: 14
- **JavaScript Files**: 20+
- **Images**: 200+
- **Fonts**: 50+

### Size
- **Total Size**: ~57MB
- **CSS Size**: ~520KB
- **JS Size**: ~2MB
- **Images Size**: ~50MB

---

## 🏗️ Original Template Structure

```
HTML/
├── .DS_Store
├── index.html              (Main homepage - REPLICATED IN REACT)
├── about.html
├── blog-*.html             (14 blog variants)
├── blog-single-*.html      (6 blog detail pages)
├── chief-single.html
├── chiefs.html
├── clients.html
├── comingsoon.html
├── contact*.html           (5 contact page variants)
├── event-single-*.html     (3 event detail variants)
├── events-*.html           (3 event list variants)
├── faq*.html               (2 FAQ pages)
├── gallery-*.html          (7 gallery variants)
├── gallery-single*.html    (2 gallery detail variants)
├── header*.html            (6 header variants)
├── footer*.html            (6 footer variants)
├── copyright*.html         (6 copyright/footer variants)
├── title*.html             (6 title section variants)
├── pricing.html
├── program*.html           (Program pages)
├── shop*.html              (10 shop variants)
├── contact*.html           (Contact variants)
│
├── css/                    (14 files, 520KB)
│   ├── bootstrap.min.css
│   ├── bootstrap.addons.css
│   ├── font-awesome.css
│   ├── font-awesome4.7.css
│   ├── animations.css
│   ├── main.css            (PRIMARY - 80KB)
│   ├── main2.css           (COLOR VARIANT 1)
│   ├── main3.css           (COLOR VARIANT 2)
│   ├── shop.css
│   ├── shop2.css
│   ├── shop3.css
│   └── ...
│
├── fonts/                  (50+ font files)
│   ├── FontAwesome.otf
│   ├── fontawesome-webfont.*
│   └── rawline/            (Complete rawline font family)
│
├── images/                 (200+ images)
│   ├── logo.png
│   ├── slide01-03.jpg      (Hero slider images)
│   ├── service/01-06.jpg   (Course/program images)
│   ├── team/01-12.jpg      (Chef/instructor photos)
│   ├── team/testimonials_*.jpg
│   ├── team/comment-*.jpg
│   ├── gallery/01-16.jpg
│   ├── events/01-06.jpg
│   ├── shop/01-33.jpg      (Product images)
│   ├── partners/01-12.jpg  (Partner logos)
│   ├── parallax/           (Background images)
│   ├── flags/              (Language flags)
│   └── ...
│
├── js/                     (20+ JavaScript files)
│   ├── vendor/
│   │   ├── jquery-3.3.1.min.js
│   │   ├── bootstrap.bundle.js
│   │   ├── modernizr-2.6.2.min.js
│   │   ├── jquery.flexslider-min.js    (SLIDER)
│   │   ├── owl.carousel.min.js         (CAROUSEL)
│   │   ├── isotope.pkgd.min.js         (MASONRY)
│   │   ├── jquery.parallax-1.1.3.js    (PARALLAX)
│   │   ├── photoswipe.js               (LIGHTBOX)
│   │   ├── jquery.countdown.min.js     (COUNTDOWN)
│   │   ├── jquery.countTo.js           (COUNTER)
│   │   ├── jquery.easypiechart.min.js  (PROGRESS)
│   │   ├── jquery.scrollbar.min.js
│   │   ├── superfish.js                (MENU)
│   │   └── ...
│   │
│   ├── main.js             (Template initialization)
│   ├── compressed.js       (Minified)
│   └── bootstrap.addons.js
│
└── scss/                   (28 SCSS source files)
    ├── addons/
    ├── color_schemes/
    ├── color_sections/
    ├── header/
    ├── helpers/
    ├── menu/
    ├── override_bootstrap/
    ├── plugins/
    ├── shortcodes/
    ├── subpages/
    ├── widgets/
    ├── wordpress/
    └── scss_bootstrap/
```

---

## 📄 Page Breakdown (114 Pages)

### Homepage Variants (3)
- `index.html` - **REPLICATED** ✅
- `index_static.html`
- `index_singlepage.html`

### About/Pages (10+)
- `about.html`
- `clients.html`
- `pricing.html`
- `comingsoon.html`
- `faq.html`, `faq2.html`
- `404.html`

### Programs (4)
- `program1.html`
- `program2.html`
- `program3.html`
- `program-single.html`

### Shop (10)
- `shop-right.html`
- `shop-left.html`
- `shop-product-right.html`
- `shop-product-left.html`
- `shop-cart.html`
- `shop-checkout.html`
- `shop-order-received.html`
- `shop-account-*.html` (7 account pages)

### Blog/Recipes (20)
- `blog-full.html`, `blog-left.html`, `blog-right.html`
- `blog-grid.html`
- `blog-single-full.html`, `blog-single-left.html`, `blog-single-right.html`
- `blog-single-video-full.html`, etc. (3 video variants)

### Events (6)
- `events-left.html`, `events-right.html`, `events-full.html`
- `event-single-left.html`, `event-single-right.html`, `event-single-full.html`

### Gallery (9)
- `gallery-regular-*.html` (2, 3, 4 columns)
- `gallery-title-*.html` (2, 3, 4 columns)
- `gallery-excerpt-*.html` (2, 3, 4 columns)
- `gallery-tiled.html`
- `gallery-single.html`, `gallery-single2.html`

### Team/Chiefs (2)
- `chiefs.html`
- `chief-single.html`

### Contact (5)
- `contact.html`
- `contact2.html`
- `contact3.html`
- `contact4.html`
- `contact5.html`

### Headers (6)
- `header1.html` through `header6.html`

### Footers (6)
- `footer1.html` through `footer6.html`

### Copyright/Footers (6)
- `copyright1.html` through `copyright6.html`

### Titles (6)
- `title1.html` through `title6.html`

### Shortcodes/Widgets (30+)
- `shortcodes_typography.html`
- `shortcodes_buttons.html`
- `shortcodes_pricing.html`
- `shortcodes_iconbox.html`
- `shortcodes_progress.html`
- `shortcodes_tabs.html`
- `shortcodes_bootstrap.html`
- `shortcodes_animation.html`
- `shortcodes_icons.html`
- `shortcodes_socialicons.html`
- `shortcodes_widgets_*.html` (3 variants)

---

## 🎨 Key CSS Classes & Concepts

### Layout Classes
```css
.container-fluid     /* Full width */
.container          /* Max-width container */
.row                /* Bootstrap row */
.col-*              /* Bootstrap columns */
```

### Section Classes
```css
.ls                 /* Light section */
.ds                 /* Dark section */
.cs                 /* Color section (colored bg) */
.ms                 /* Medium spacing */
.s-pt-*             /* Padding-top utilities */
.s-pb-*             /* Padding-bottom utilities */
```

### Component Classes
```css
.page_header        /* Header component */
.page_slider        /* Slider section */
.page_footer        /* Footer */
.vertical-item      /* Card component */
.item-media         /* Image container */
.item-content       /* Content container */
.media              /* Media object */
.icon-styled        /* Styled icon box */
```

### Color Classes
```css
.color-main         /* Primary orange #ff6b35 */
.color-main2        /* Secondary #f7931e */
.color-darkgrey     /* Dark text */
.bg-maincolor       /* Primary background */
.bg-maincolor2      /* Secondary background */
```

### Animation Classes
```css
.animate            /* Animation trigger */
[data-animation]    /* Animation types (fadeInUp, slideInRight, etc.) */
```

---

## 🔌 jQuery Plugins Used

### Carousels
| Plugin | Usage | Replacement |
|--------|-------|-------------|
| Flexslider | Hero slider | `react-multi-carousel` |
| Owl Carousel | Program carousel, testimonials | `react-multi-carousel` |

### Lightbox
| Plugin | Usage | Replacement |
|--------|-------|-------------|
| PhotoSwipe | Gallery lightbox | `yet-another-react-lightbox` |

### Layout
| Plugin | Usage | Replacement |
|--------|-------|-------------|
| Isotope | Gallery masonry | `react-grid-layout` |
| Parallax | Background parallax | `react-parallax` |

### Utilities
| Plugin | Usage | Replacement |
|--------|-------|-------------|
| jQuery Countdown | Timer display | `react-countdown` |
| jQuery CountTo | Number counter | Custom React hook |
| Easy Pie Chart | Progress circles | `recharts` |
| jQuery Scrollbar | Custom scrollbar | CSS `::-webkit-scrollbar` |

---

## 📐 Homepage Structure (index.html)

### Sections in Order
1. **Header** (Fixed, with logo + nav)
2. **Search Modal** (Hidden, toggle on search icon)
3. **Hero Slider** (Full-width, 3 slides, animations)
4. **Programs Carousel** (6 courses, Owl Carousel)
5. **About Section** (Video + achievements)
6. **Testimonials** (Owl Carousel, 3 slides)
7. **Footer** (Links, social, copyright)

### Homepage Data
```javascript
// 6 Programs
[
  {
    title: "Baking & Pastry",
    instructor: "Alexander Lamb",
    image: "service/01.jpg",
    students: 18,
    comments: 423,
    price: 550
  },
  // ... 5 more
]

// 3 Testimonials
[
  {
    name: "Lester Hodges",
    title: "former student / Chef",
    text: "...",
    image: "team/testimonials_01.jpg"
  },
  // ... 2 more
]
```

---

## 🔄 Migration Mapping

### What We've Done ✅
| Template | React Component | Status |
|----------|-----------------|--------|
| index.html | src/pages/Home.jsx | ✅ DONE |
| CSS files | public/css/ + src/template.css | ✅ DONE |
| Images | public/images/ | ✅ DONE |
| JS plugins | Ready to integrate | ✅ SETUP |

### What's Next 📋 (Phase 2-3)
| Template | React Component | Status |
|----------|-----------------|--------|
| about.html | src/pages/About.jsx | ⏳ TODO |
| pricing.html | src/pages/Pricing.jsx | ⏳ TODO |
| contact*.html | src/pages/Contact.jsx | ⏳ TODO |
| blog-*.html | src/pages/Blog/ + components | ⏳ TODO |
| shop-*.html | src/pages/Shop/ + components | ⏳ TODO |
| event-*.html | src/pages/Events/ + components | ⏳ TODO |
| gallery-*.html | src/pages/Gallery/ + components | ⏳ TODO |
| header*.html | src/components/Header/ variants | ⏳ TODO |
| footer*.html | src/components/Footer/ variants | ⏳ TODO |

---

## 🎯 Learning Points for New Developers

### How Template is Organized
1. **Single HTML files** - Each page is separate file
2. **Shared CSS** - All pages use main.css + Bootstrap
3. **jQuery plugins** - Heavy JavaScript for interactivity
4. **Bootstrap grid** - Uses Bootstrap 4 grid system
5. **Responsive images** - All images in public/images/

### How React Improves It
1. **Reusable components** - Share Header, Footer, Cards across pages
2. **State management** - Easier to manage UI state (open/close modal, etc.)
3. **Routing** - Single-page app, no need to load entire HTML
4. **Bundle optimization** - CSS/JS only loaded when needed
5. **Development speed** - Hot reload, easier debugging

### Key Differences
```
// OLD (HTML Template)
<img src="images/service/01.jpg" alt="Course">
<div class="item-content">
  <h5>Baking & Pastry</h5>
  <p>Description...</p>
</div>

// NEW (React Component)
<CourseCard 
  title="Baking & Pastry"
  image="/images/service/01.jpg"
  description="Description..."
/>
```

---

## 📚 Reference

### Accessing Original Template
All original HTML files available in:
```
reference/original-template/
```

### Useful Files to Check
- `reference/original-template/index.html` - Homepage reference
- `reference/original-template/about.html` - About page reference
- `reference/original-template/css/main.css` - CSS reference
- `reference/original-template/js/main.js` - JS initialization

### How to Compare
1. Clone repo: `git clone https://github.com/ocanhdt12-gif/baking-course-frontend.git`
2. Open `reference/original-template/index.html` in browser (original)
3. Run `npm run dev` and open http://localhost:5173 (React version)
4. Compare side-by-side to understand changes

---

## 🚀 Phase-by-Phase Conversion

### Phase 1.5 ✅ (DONE)
- Homepage converted to React
- All assets integrated
- Template CSS loaded globally

### Phase 2 📋 (NEXT - 2 weeks)
- Extract reusable components from Home.jsx
- Create component library
- Build UI components (Button, Card, Modal, etc.)

### Phase 3 📋 (2 weeks after Phase 2)
- Convert About, Contact, Pricing pages
- Convert Shop pages
- Convert Blog pages
- Convert Event pages

### Phase 4 📋 (2 weeks after Phase 3)
- API integration
- Payment processing
- User authentication
- Shopping cart

### Phase 5 📋 (1 week after Phase 4)
- Performance optimization
- SEO improvements
- Testing & bug fixes
- Deployment

---

## 💡 Tips for Contributors

### Understanding the Old Way
1. Each HTML file = separate page
2. CSS classes = styling (not components)
3. jQuery plugins = interactivity

### Understanding the New Way
1. Each React component = reusable piece
2. JSX = HTML + JavaScript mixed
3. State = dynamic data changes

### When Converting a Page
1. Copy HTML structure to JSX
2. Replace HTML classes with React equivalents
3. Extract data to component props
4. Replace jQuery plugins with React libraries
5. Test in browser

---

## 📞 Questions?

Check:
1. `README.md` - Project overview
2. `DEVELOPMENT.md` - Dev guide
3. `reference/original-template/` - Original HTML
4. Git history - See what changed & why

---

**Happy learning! 🍰**

Generated: 2026-04-08  
Last Updated: 2026-04-08
