# Frontend Documentation — Muka Baking CMS

This document is the complete technical reference for the React frontend. It covers architecture, component inventory, CSS strategy, routing, data flow, and known quirks. A new developer or AI agent should be able to read this file and fully understand how the frontend works.

---

## 1. Technology & Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.x | UI framework |
| react-dom | 18.x | DOM renderer |
| react-router-dom | 6.x | Client-side routing with nested layouts |
| axios | 1.x | HTTP client for backend API communication |
| vite | 5.x | Build tool and dev server |

**No CSS framework is used.** Styling comes entirely from the original Muka HTML template's CSS files, loaded via `<link>` tags in `index.html`. TailwindCSS is explicitly banned from this project.

---

## 2. Directory Structure (Detailed)

```
frontend/src/
├── App.jsx                      # Root component — defines ALL routes and layout nesting
├── main.jsx                     # ReactDOM.createRoot entry point
├── App.css                      # Additional CSS overrides (admin styles, fixes)
├── index.css                    # Minimal global reset
│
├── constants/
│   └── routes.js                # EVERY navigable path as a named constant
│                                  Prevents 404s from hardcoded strings
│
├── services/
│   └── api.js                   # Axios instance + exported functions for every API call
│                                  Interceptor auto-attaches JWT from localStorage
│
├── config/
│   └── siteConfig.js            # Static site metadata: site name, menu structure,
│                                  sidebar categories, social links
│
├── hooks/
│   └── useTemplateRuntime.js    # Re-initializes legacy jQuery plugins after React renders
│
├── layouts/
│   └── PublicLayout.jsx         # Wraps: <Header /> + <Outlet /> + <Footer />
│                                  All public routes are children of this layout
│                                  Admin route is NOT wrapped by this (no header/footer)
│
├── pages/                       # One file per route (see Route Map below)
│   ├── Home.jsx                 # Composes: HomeSlider, HomeClasses, HomeAbout, HomeFaq,
│   │                              HomeTimetables, HomeChiefs, HomeBlog, HomeContacts
│   ├── About.jsx                # Static about page
│   ├── Program.jsx              # Lists all programs via <ProgramCard> grid
│   ├── ProgramDetail.jsx        # Single program view — fetches by :slug param
│   ├── Receipt.jsx              # Blog listing page with sidebar
│   ├── PostDetail.jsx           # Single blog post — fetches by :slug param
│   ├── Contact.jsx              # Contact page with <ContactForm>
│   ├── ChiefDetail.jsx          # Single chef profile — fetches by :id param
│   ├── Auth.jsx                 # Login + Register forms
│   ├── UserDashboard.jsx        # /my-account (requires login)
│   ├── AdminDashboard.jsx       # /admin (requires ADMIN role)
│   └── NotFound.jsx             # 404 catch-all
│
├── components/
│   ├── Header/
│   │   └── Header.jsx           # Navbar with navigation menu
│   │
│   ├── Footer/
│   │   └── Footer.jsx           # Site footer with links and social icons
│   │
│   ├── Home/                    # Section blocks composing the homepage:
│   │   ├── HomeSlider.jsx       #   Hero carousel (fetches from /api/sliders)
│   │   ├── HomeClasses.jsx      #   Featured programs grid (fetches from /api/programs)
│   │   ├── HomeAbout.jsx        #   About section with counters
│   │   ├── HomeFaq.jsx          #   FAQ accordion
│   │   ├── HomeTimetables.jsx   #   Weekly class schedule tabs (fetches from /api/timetables)
│   │   ├── HomeChiefs.jsx       #   Chef team grid (fetches from /api/chiefs)
│   │   ├── HomeBlog.jsx         #   Recent blog posts (fetches from /api/posts)
│   │   └── HomeContacts.jsx     #   Enrollment form + contact info
│   │
│   ├── Blog/
│   │   ├── BlogCard.jsx         #   Individual blog post card (used in listings)
│   │   └── BlogSidebar.jsx      #   Sidebar with categories, tags, social stats
│   │
│   ├── Contact/
│   │   └── ContactForm.jsx      #   Form that POSTs to /api/contacts
│   │
│   ├── Admin/                   # CMS dashboard components:
│   │   ├── AdminPrograms.jsx    #   CRUD table for programs
│   │   ├── AdminPosts.jsx       #   CRUD table for blog posts
│   │   ├── AdminSliders.jsx     #   CRUD table for hero banners
│   │   ├── AdminTimetables.jsx  #   CRUD table for class schedules
│   │   ├── AdminContacts.jsx    #   Read-only inbox for contact messages
│   │   ├── AdminEnrollments.jsx #   Enrollment list with status toggle
│   │   ├── AdminTable.jsx       #   Reusable table renderer
│   │   └── AdminModal.jsx       #   Reusable modal wrapper for create/edit forms
│   │
│   ├── Auth/
│   │   └── ProtectedRoute.jsx   #   Route guard — checks JWT and optionally ADMIN role
│   │
│   └── Shared/
│       ├── PageTitle.jsx        #   Breadcrumb + page title banner
│       ├── ProgramCard.jsx      #   Individual program card (used in grids)
│       └── ScrollToTop.jsx      #   Scroll reset hook (see "Known Quirks" below)
│
└── data/
    └── mockData.js              # DEPRECATED — legacy static data, kept for reference only
```

---

## 3. Route Map

All routes are defined in `App.jsx`. Path strings come from `constants/routes.js`.

| Path Pattern | Component | Auth | Description |
|-------------|-----------|------|-------------|
| `/` | Home | No | Homepage with all section blocks |
| `/about` | About | No | About the bakery |
| `/program` | Program | No | Lists all courses |
| `/program/:slug` | ProgramDetail | No | Single course detail |
| `/receipt` | Receipt | No | Blog post listing |
| `/post/:slug` | PostDetail | No | Single blog post |
| `/contact` | Contact | No | Contact form page |
| `/chief/:id` | ChiefDetail | No | Single chef profile |
| `/auth` | Auth | No | Login / Register |
| `/my-account` | UserDashboard | Login required | User profile |
| `/admin` | AdminDashboard | ADMIN role required | CMS dashboard |
| `*` | NotFound | No | 404 fallback |

**Layout nesting:** All routes except `/admin` are wrapped in `<PublicLayout>` which provides the Header and Footer. The admin route renders its own standalone layout.

---

## 4. CSS Architecture

### 4.1 Public Pages
All styling for public pages comes from the original Muka template CSS files loaded via `<link>` tags in `index.html`. Key CSS classes to know:
- `.ls` / `.ds` — Light Section / Dark Section backgrounds
- `.s-py-100`, `.s-pt-60` — Section padding utilities  
- `.vertical-item` — Card layout wrapper
- `.c-gutter-60` — Column gap utilities
- `.bordered` — Adds border styling to cards

**Never rename or remove these classes.** They are the backbone of the layout.

### 4.2 Admin Dashboard
Admin CSS lives in `App.css` and is scoped using the `.admin-mode` body class:
```css
.admin-mode .sidebar { background: #1a1a2e; }
.admin-mode .admin-table { ... }
```
The `AdminDashboard.jsx` component manages this class:
```js
useEffect(() => {
  document.body.classList.add('admin-mode');
  return () => document.body.classList.remove('admin-mode');
}, []);
```

### 4.3 Adding New Styles
- For public pages: modify the template CSS files in `/public/css/` or add overrides in `App.css`
- For admin: add scoped rules under `.admin-mode` in `App.css`

---

## 5. Data Flow

```
User Action → React Component → api.js function → Axios → Backend API → Prisma → PostgreSQL
                                                      ↑
                                              JWT token auto-attached
                                              via Axios interceptor
```

### Key file: `services/api.js`
- Creates a single Axios instance pointed at `http://localhost:5001/api`
- Interceptor reads `localStorage.getItem('token')` and adds it as `x-auth-token` header
- Exports named functions for every API call: `getPrograms()`, `createPost(payload)`, `submitContact(payload)`, etc.

### Authentication Flow
1. User submits credentials → `loginUser()` → Backend returns `{ token, user }`
2. Frontend stores `token` in `localStorage`
3. All subsequent API calls automatically include the token via interceptor
4. `ProtectedRoute.jsx` checks for token presence (and optionally ADMIN role) before rendering children

---

## 6. Known Quirks & Workarounds

### ScrollToTop Component (`components/Shared/ScrollToTop.jsx`)
**Problem:** When navigating between pages via React Router `<Link>`, the browser preserves scroll position. Additionally, the Muka template's jQuery measures header height on initial page load — SPA navigations don't trigger this measurement, causing the header to overlap page content.

**Solution:** `ScrollToTop` listens to `pathname` changes and:
1. Immediately scrolls to `{ top: 0, left: 0 }`
2. After 100ms, dispatches `window.dispatchEvent(new Event('resize'))` which triggers the template's header recalculation

### useTemplateRuntime Hook
**Problem:** jQuery plugins (carousels, counters, lightboxes) initialize on `DOMContentLoaded`. React renders content after this event, so plugins don't bind to dynamically rendered elements.

**Solution:** `useTemplateRuntime` re-runs plugin initialization scripts after React components mount.

---

## 7. Getting Started

```bash
cd frontend
npm install

# Create .env file:
echo 'VITE_API_BASE_URL=http://localhost:5000/api' > .env

npm run dev
# Open http://localhost:5173
```

**Prerequisite:** The backend server must be running for data to load. Without it, all pages will show loading states or errors.

---

## 8. Remaining Work (Frontend Scope)

- [ ] **Payment Checkout UI** — Build `Checkout.jsx` page connected to Stripe Elements for course enrollment payments
- [ ] **Image Lazy Loading** — Wrap `<img>` tags in a component that shows skeleton/blur placeholders while loading
- [ ] **Code Splitting** — Configure Vite to lazy-load route components for smaller initial bundle
- [ ] **Analytics Integration** — Add Google Analytics or Firebase to track enrollment conversions
- [ ] **Production Build & Deploy** — Run `npm run build`, configure Vercel deployment with environment variables
