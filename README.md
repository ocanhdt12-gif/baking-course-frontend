# 🍰 Baking Course Frontend - Muka

React + Vite implementation of Muka bakery/cooking course platform. Converting from HTML template to modern React with phase-based development.

---

## 📊 Project Status

### ✅ Completed
- **Phase 1**: React 18 + Vite project setup with folder structure
- **Phase 1.5**: Homepage with full template layout
  - Hero slider (3 slides with animations)
  - Programs carousel (6 cooking classes)
  - About/achievements section
  - Testimonials section
  - Footer with links
  - All template CSS/JS/images integrated

### 🚀 In Progress / Upcoming

| Phase | Timeline | Status | Description |
|-------|----------|--------|-------------|
| **Phase 2** | 2 weeks | ⏳ TODO | Reusable UI Components (Button, Card, Modal, Form, etc.) + React Router setup |
| **Phase 3** | 2 weeks | ⏳ TODO | Convert 114 HTML pages to React components |
| **Phase 4** | 2 weeks | ⏳ TODO | Feature implementation (API integration, cart, auth, payments) |
| **Phase 5** | 1 week | ⏳ TODO | Polish, testing, optimization, SEO |

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool & dev server
- **React Router v6** - Page routing
- **Bootstrap 5** - CSS framework
- **SCSS** - Styling (with modules)
- **Axios** - HTTP client (ready for Phase 4)
- **Font Awesome** - Icons
- **jQuery plugins** (Flexslider, Owl Carousel, etc.) - Integrated from original template

---

## 📁 Project Structure

```
baking-course-frontend/
├── public/              # Static assets from original template
│   ├── images/         # All template images
│   ├── css/            # Original template CSS
│   ├── js/             # jQuery plugins & scripts
│   └── fonts/          # Font files
│
├── src/
│   ├── pages/          # Page components
│   │   ├── Home.jsx    # Homepage (Phase 1.5 - COMPLETE)
│   │   ├── About.jsx
│   │   ├── Shop.jsx
│   │   ├── Blog.jsx
│   │   ├── Contact.jsx
│   │   └── ...
│   │
│   ├── components/     # Reusable components (Phase 2)
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── Navigation/
│   │   ├── UI/         # Buttons, Cards, Modals, etc.
│   │   ├── Forms/
│   │   └── Sections/   # Hero, Features, Testimonials, etc.
│   │
│   ├── styles/         # Global SCSS
│   │   ├── variables.scss
│   │   ├── globals.scss
│   │   └── animations.scss
│   │
│   ├── App.jsx         # Main app wrapper
│   ├── main.jsx        # Entry point
│   └── template.css    # Merged template CSS
│
├── index.html          # HTML entry with template CSS links
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/ocanhdt12-gif/baking-course-frontend.git
cd baking-course-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Dev server will run at:** http://localhost:5173

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

Built files will be in `dist/` folder.

---

## 📋 Current Features (Phase 1.5)

### Homepage Components
- ✅ **Header** - Logo, navigation menu, CTA button
- ✅ **Hero Slider** - Full-width carousel with 3 slides + animations
- ✅ **Programs Section** - 6 cooking classes with instructor info, ratings, pricing
- ✅ **About Section** - Video embed + achievements (trophy, chefs, employment)
- ✅ **Testimonials** - Carousel with student reviews
- ✅ **Footer** - Links, quick nav, social icons

### Template Integration
- All 14 CSS files from original template loaded
- All images, fonts, JavaScript plugins available
- Bootstrap grid & components working
- Font Awesome icons ready
- Responsive mobile-first layout

---

## 🎯 Phase 2: Reusable Components (Next)

After Phase 1.5 completion:

### UI Components to Build
- `Button` - Primary, secondary, outline variants
- `Card` - Course card, blog card, team card variants
- `Modal` - Popup dialogs for forms, confirmations
- `Form` - Input, textarea, select, checkbox, radio
- `Tabs` - Tab navigation with content
- `Accordion` - Collapsible sections
- `Pagination` - Page navigation
- `Badge` - Labels & tags
- `Alert` - Message boxes

### Layout Components
- `NavBar` - Responsive header with mobile menu
- `Sidebar` - Left/right sidebars
- `Hero` - Full-width banner sections
- `Container` - Constraint max-width wrapper
- `Grid` - Flexible grid layout

### Feature Sections (Reusable)
- `CourseCard` - Display single course
- `ProgramCarousel` - Carousel of programs
- `TestimonialSlider` - Testimonial carousel
- `FeatureBox` - Feature/benefit display
- `VideoSection` - Video embed section
- `CTASection` - Call-to-action banner

---

## 🔄 Phase 3: Page Conversion (After Phase 2)

Convert 114 HTML pages from template to React components:

**Page Groups:**
1. **Core Pages**: About, Contact, Pricing, FAQ, 404
2. **Shop Pages**: Product listing, single product, cart, checkout, account
3. **Program Pages**: Programs listing, single program details
4. **Blog Pages**: Blog listing, single post, categories, tags
5. **Gallery Pages**: Gallery grid, gallery item details
6. **Event Pages**: Events listing, single event
7. **Header/Footer Variants**: 6 header styles, 6 footer styles
8. **Shortcode Pages**: Typography, buttons, icons, widgets, etc.

Each page will:
- Reuse components from Phase 2
- Maintain exact visual design from original
- Add React Router navigation
- Be mobile-responsive

---

## 🔌 Phase 4: Features & API Integration

### Backend Integration
- Connect to REST/GraphQL API (to be defined)
- Course enrollment system
- Shopping cart & checkout
- User authentication & profiles
- Blog/recipe content management
- Image uploads

### Payment Integration
- Stripe/PayPal integration
- Course payment processing
- Order history tracking

### Features
- User authentication (login, register, forgot password)
- Course search & filtering
- Shopping cart
- Wishlist/favorites
- Reviews & ratings
- Blog comments
- Contact form submissions
- Email notifications

---

## 🎨 Design System

### Colors (from template)
- **Primary**: #ff6b35 (Orange)
- **Secondary**: #f7931e (Light orange)
- **Dark Text**: #20252b
- **Light Text**: #999
- **Borders**: #e0e0e0
- **Dark Sections**: #3a3f45

### Typography
- **Headings**: Rawline font family
- **Body**: System fonts (fallback)
- **Size Range**: 14px - 48px responsive

### Spacing
- Consistent 8px base unit
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 40px

### Breakpoints
- Mobile: < 576px
- Tablet: 576px - 768px
- Desktop: 768px - 992px
- Large: 992px+

---

## 📚 Documentation

- **REACT_CONVERSION_PLAN.md** - Detailed migration strategy
- **BAKING_COURSE_PROJECT_PLAN.md** - Full project scope & timeline
- Component-specific READMEs (added per phase)

---

## 👥 Team & Contribution

**Lead**: Tuấn Anh (@ocanhdt12-gif)  
**AI Assistant**: Eve (OpenClaw)

### Development Process
1. Plan phase in detail
2. Build & test locally
3. Commit to git with clear messages
4. Deploy to staging/production
5. Iterate based on feedback

---

## 🐛 Known Issues & TODOs

### Current Limitations
- jQuery plugins (Flexslider, Owl Carousel) not yet fully Reactified
- Some animations may need refinement on mobile
- Contact form not yet connected to backend

### Before Phase 2
- [ ] Test homepage on all device sizes
- [ ] Verify all images load correctly
- [ ] Check accessibility (WCAG 2.1)
- [ ] Performance optimization

---

## 📞 Support & Questions

For questions or issues:
1. Check documentation files
2. Review code comments
3. Check Git history for context
4. Create GitHub issue with details

---

## 📄 License

Template: Muka (original)  
React Implementation: Tuấn Anh

---

**Last Updated**: 2026-04-08  
**Current Version**: 1.0.0-phase-1.5  
**Next Milestone**: Phase 2 - Reusable Components

---

## 🚀 Quick Commands

```bash
# Development
npm run dev           # Start Vite dev server

# Production
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Lint code (if configured)

# Git
git add .
git commit -m "message"
git push origin master
```

**Happy coding! 🍰**
