# Phase 6: Dynamic Detail Pages

**Scope:** Frontend + Backend  
**Goal:** Build individual detail pages for Programs, Posts, and Chefs that load content based on URL parameters.

## What Was Done

### 1. Backend — Single-Record Endpoints
Added endpoints that accept a URL parameter and return a single record:
- `GET /api/programs/:slug` — finds a program by its slug field
- `GET /api/posts/:slug` — finds a post by its slug field
- `GET /api/chiefs/:id` — finds a chef by UUID

These use Prisma's `findUnique()` with the appropriate field.

### 2. Frontend — Route Registration
Added parameterized routes in `App.jsx`:
```jsx
<Route path="/program/:slug" element={<ProgramDetail />} />
<Route path="/post/:slug" element={<PostDetail />} />
<Route path="/chief/:id" element={<ChiefDetail />} />
```

### 3. Frontend — Detail Page Components

**`ProgramDetail.jsx`** (`/program/:slug`)
- Uses `useParams()` to extract the slug
- Fetches the program via `getProgramBySlug(slug)`
- Renders: hero banner, course description, instructor info, price, enrollment button
- Layout matches the original `program-single.html` template

**`PostDetail.jsx`** (`/post/:slug`)
- Uses `useParams()` to extract the slug
- Fetches the post via `getPostBySlug(slug)`
- Renders: featured image, title, content (with HTML rendering via `dangerouslySetInnerHTML`), author info, sidebar

**`ChiefDetail.jsx`** (`/chief/:id`)
- Uses `useParams()` to extract the ID
- Fetches the chef via `getChiefById(id)`
- Renders: profile photo, name, role, social links, biography

### 4. API Service Functions
Added to `services/api.js`:
- `getProgramBySlug(slug)`
- `getPostBySlug(slug)`
- `getChiefById(id)`

## Key Files Created
- `frontend/src/pages/ProgramDetail.jsx`
- `frontend/src/pages/PostDetail.jsx`
- `frontend/src/pages/ChiefDetail.jsx`

## Result
Clicking on any program card, blog post, or chef profile in a listing page now navigates to a fully rendered detail page with content fetched from the database.
