# Phase 5: Live Data Integration

**Scope:** Frontend (primary) + Backend (minor adjustments)  
**Goal:** Replace all static mock data with live API calls to the backend server.

## What Was Done

### 1. API Service Layer (`services/api.js`)
- Created a centralized Axios instance with `baseURL` pointing to the backend
- Added a request interceptor that reads JWT from `localStorage` and attaches it as `x-auth-token` header
- Exported named functions for every API call:
  - `getPrograms()`, `getPosts()`, `getChiefs()`, `getSliders()`, `getTimetables()`, `getTestimonials()`

### 2. Component Migration
Every component that previously imported from `mockData.js` was refactored to:
1. Initialize state with `useState([])` (empty array)
2. Fetch data on mount with `useEffect(() => { apiFunction().then(setData) }, [])`
3. Show a loading indicator while data is being fetched

**Affected components:**
- `HomeSlider.jsx` — now fetches from `GET /api/sliders`
- `HomeClasses.jsx` — now fetches from `GET /api/programs`
- `HomeChiefs.jsx` — now fetches from `GET /api/chiefs`
- `HomeBlog.jsx` — now fetches from `GET /api/posts`
- `HomeTimetables.jsx` — now fetches from `GET /api/timetables`
- `Program.jsx` — now fetches from `GET /api/programs`
- `Receipt.jsx` — now fetches from `GET /api/posts`

### 3. Backend Adjustments
Added `Slider` and `Timetable` models to the Prisma schema (they were not in the original Phase 2 schema). Created corresponding controllers, routes, and seed data.

## Key Files Created/Modified
- `frontend/src/services/api.js` (created)
- `frontend/src/components/Home/*.jsx` (all modified to use API)
- `backend/prisma/schema.prisma` (added Slider, Timetable models)
- `backend/src/controllers/sliderController.js` (created)
- `backend/src/controllers/timetableController.js` (created)
- `backend/src/routes/sliderRoutes.js` (created)
- `backend/src/routes/timetableRoutes.js` (created)

## Result
The frontend is now fully dynamic. Page content is determined by the database. If the database is empty, pages show no content. If data is added via the admin CMS, it appears immediately on the public site.
