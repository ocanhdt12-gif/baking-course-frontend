# Phase 1: Component Extraction

**Scope:** Frontend only  
**Goal:** Convert the static Muka HTML template into a React component architecture without breaking any visual styling.

## Context

The project started with a purchased ThemeForest template: "Muka — Bakery and Cooking Classes HTML Template". This is a multi-page HTML/CSS/jQuery website with complex Bootstrap-based layouts, custom CSS classes, and jQuery plugins for carousels, counters, and animations.

The templates live in: `/themeforest-5aMLDH4E-muka-bakery-and-cooking-classes-html-template/HTML/`

## What Was Done

### 1. Project Scaffolding
- Initialized a Vite + React project in `/frontend/`
- Copied all static assets (images, CSS, vendor JS, fonts) from the HTML template into `/frontend/public/`
- Configured `index.html` to load the template's CSS and JS files via `<link>` and `<script>` tags

### 2. Layout Architecture
- Created `PublicLayout.jsx` as the shell component that wraps every public page
- This component renders: `<Header />` → `<Outlet />` (React Router) → `<Footer />`
- The `<div id="canvas"><div id="box_wrapper">` structure from the HTML template was preserved exactly, because the template's JS depends on these specific IDs

### 3. Component Decomposition
The homepage (`index.html`) was split into independent section components:

| Component | Source Section | Description |
|-----------|---------------|-------------|
| `HomeSlider.jsx` | Hero carousel | Image slider with text overlays |
| `HomeClasses.jsx` | "Our Classes" | Grid of program cards |
| `HomeAbout.jsx` | "About Us" | Counters and description |
| `HomeFaq.jsx` | FAQ section | Accordion questions |
| `HomeTimetables.jsx` | "Class Schedule" | Tabbed weekly timetable |
| `HomeChiefs.jsx` | "Best Chefs" | Chef profile cards with social links |
| `HomeBlog.jsx` | "Latest News" | Recent blog post cards |
| `HomeContacts.jsx` | Contact/Enrollment | Form with course dropdown |

Shared components were also extracted:
- `Header.jsx` / `Footer.jsx` — site-wide navigation and footer
- `PageTitle.jsx` — breadcrumb + page title banner used on inner pages
- `ProgramCard.jsx` — reusable course card component

### 4. Mock Data
- Created `src/data/mockData.js` with arrays of JavaScript objects to simulate database records
- Each component imported from this file and used `.map()` to render lists
- This allowed the UI to be built and tested before any backend existed

## Key Files Created
- `frontend/src/layouts/PublicLayout.jsx`
- `frontend/src/components/Header/Header.jsx`
- `frontend/src/components/Footer/Footer.jsx`
- `frontend/src/components/Home/*.jsx` (8 files)
- `frontend/src/components/Shared/PageTitle.jsx`
- `frontend/src/components/Shared/ProgramCard.jsx`
- `frontend/src/data/mockData.js`
- `frontend/src/pages/Home.jsx`, `About.jsx`, `Program.jsx`, `Receipt.jsx`, `Contact.jsx`

## Result
A fully functional React SPA that visually matches the original HTML template. All CSS classes preserved. jQuery plugins functioning. Data powered by static mock objects.
