# Frontend Execution Plan

This file tracks what has been completed and what remains for the frontend codebase.

## Completed Work

### Phase 1 — Component Extraction
- [x] Scaffold Vite + React project
- [x] Copy template static assets to `/public`
- [x] Create `PublicLayout.jsx` (Header + Outlet + Footer)
- [x] Extract homepage sections into individual components (8 files in `components/Home/`)
- [x] Extract shared components (`PageTitle`, `ProgramCard`, `Header`, `Footer`)
- [x] Create `mockData.js` for development
- [x] Create page-level components (`Home`, `About`, `Program`, `Receipt`, `Contact`)

### Phase 4 — Admin Dashboard UI
- [x] Build `AdminDashboard.jsx` with sidebar tab navigation
- [x] Implement CSS isolation via `.admin-mode` body class
- [x] Place admin route outside `PublicLayout` (no header/footer)
- [x] Create `AdminTable.jsx` and `AdminModal.jsx` reusable components

### Phase 5 — Live Data
- [x] Create `services/api.js` with Axios instance and JWT interceptor
- [x] Migrate all Home section components to fetch from API
- [x] Migrate `Program.jsx` and `Receipt.jsx` to fetch from API

### Phase 6 — Detail Pages
- [x] Create `ProgramDetail.jsx` with `:slug` parameter
- [x] Create `PostDetail.jsx` with `:slug` parameter
- [x] Create `ChiefDetail.jsx` with `:id` parameter
- [x] Add `getProgramBySlug`, `getPostBySlug`, `getChiefById` to api.js

### Phase 7 — Admin CRUD
- [x] Build `AdminPrograms.jsx` with full CRUD modal
- [x] Build `AdminPosts.jsx` with full CRUD modal
- [x] Build `AdminSliders.jsx` with full CRUD modal
- [x] Build `AdminTimetables.jsx` with full CRUD modal
- [x] Image upload integration via `POST /api/upload`

### Phase 8 — CRM Forms
- [x] Refactor `ContactForm.jsx` to submit via API
- [x] Refactor `HomeContacts.jsx` enrollment form to submit via API
- [x] Build `AdminContacts.jsx` inbox view
- [x] Build `AdminEnrollments.jsx` with status toggle

### Phase 9 — SPA Polish
- [x] Create `ScrollToTop.jsx` hook (scroll reset + resize event)
- [x] Create `constants/routes.js` with all route paths
- [x] Replace all hardcoded URLs with ROUTES constants
- [x] Convert all internal `<a href>` tags to `<Link to>`
- [x] Create `NotFound.jsx` 404 page
- [x] Register `path="*"` catch-all route

## Remaining Work

### Phase 10 — Payment UI
- [ ] Create `Checkout.jsx` page for course payments
- [ ] Integrate Stripe Elements or PayPal SDK
- [ ] Handle payment success/failure UI states
- [ ] Update enrollment form to redirect to checkout after submission

### Phase 11 — Performance & Deployment
- [ ] Add lazy loading for images (skeleton/blur placeholder component)
- [ ] Configure Vite code splitting for route-based chunks
- [ ] Add Google Analytics / Firebase tracking
- [ ] Configure Vercel deployment with `VITE_API_BASE_URL` environment variable
- [ ] Run `npm run build` and verify production bundle
