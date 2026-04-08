# Muka - Baking Course Platform (Frontend)

**Phase 1: Setup & Structure - Complete ✅**

## 📂 Project Structure

```
src/
├── components/
│   ├── Layout/           (Header, Footer, MainLayout)
│   ├── Navigation/       (TopNav)
│   ├── Sections/        (To be created)
│   ├── Course/          (To be created)
│   ├── Shop/            (To be created)
│   ├── Blog/            (To be created)
│   ├── Gallery/         (To be created)
│   ├── Recipe/          (To be created)
│   ├── Auth/            (To be created)
│   ├── Common/          (To be created)
│   └── Widgets/         (To be created)
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── Blog.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
├── styles/
│   ├── variables.scss   (Colors, spacing, typography)
│   ├── globals.scss     (Base styles, typography)
│   ├── animations.scss  (Animation classes)
│   └── components/      (Component-specific styles)
├── hooks/              (To be created)
├── services/           (To be created)
├── context/            (To be created)
├── utils/              (To be created)
├── assets/             (Images, fonts, icons)
├── App.jsx             (Routing setup)
└── main.jsx
```

## 🎨 Design System

### Colors
- **Primary**: `#ff6b35` (Orange)
- **Dark**: `#20252b`
- **Light**: `#f5f5f5`

### Typography
- **Headings**: Merriweather (serif)
- **Body**: Open Sans (sans-serif)
- **Code**: Courier New (monospace)

### Spacing Scale
- Base unit: 8px
- Scale: 4px, 8px, 16px, 24px, 32px, 40px, 48px

## ✅ Phase 1 Completed

- [x] React + Vite project setup
- [x] Dependencies installed (Bootstrap, React Router, SCSS)
- [x] Folder structure created
- [x] SCSS variables & globals
- [x] Animation system
- [x] React Router setup
- [x] Layout components (Header, Footer, MainLayout)
- [x] Navigation component
- [x] Placeholder pages
- [x] Vite configuration for SCSS

## 🚀 Next Steps (Phase 2)

1. **Core UI Components**
   - Button variations
   - Card component
   - Modal
   - Form elements
   - Badge, Icons, Pagination

2. **Section Components**
   - LightSection
   - DarkSection
   - ColorSection
   - IntroSection

3. **Storybook Setup** (optional)
   - Document components
   - Visual testing

## 📦 Installation & Running

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v6** - Routing
- **Bootstrap 5** - CSS framework
- **SCSS** - Styling (with variables, mixins)
- **Axios** - HTTP client (for Phase 4)

## 📝 CSS Architecture

- **variables.scss** - All colors, spacing, typography
- **globals.scss** - Base styles, resets, utilities
- **animations.scss** - Animation keyframes & classes
- **Component modules** - Component-specific styles (MainLayout.scss, Header.scss, etc.)

### Using SCSS

```scss
@import '../../styles/variables';

.component {
  color: $primary-color;
  padding: $spacing-md;
  transition: all $transition-speed-base $ease-out;
  
  @media (max-width: $md) {
    padding: $spacing-sm;
  }
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint (when configured)
- `npm run preview` - Preview production build

## 📖 Template Assets

Original Bootstrap template files are located at:
`/tmp/HTML/`

To integrate images/fonts:
```bash
# Copy images
cp -r /tmp/HTML/images/* src/assets/images/

# Copy fonts
cp -r /tmp/HTML/fonts/* src/assets/fonts/
```

## 🎨 Component Library (Coming in Phase 2)

- Button (primary, secondary, sizes)
- Card (with image, content, footer)
- Section wrappers (light, dark, color)
- Form components
- Modal/Dialog
- Tabs, Accordion
- Slider/Carousel
- Gallery
- Badge, Icons, Pagination

---

**Status**: Phase 1 Complete ✅  
**Next**: Phase 2 - Core Components  
**Date**: 2026-04-08
