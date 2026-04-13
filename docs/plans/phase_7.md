# Phase 7: Full CRUD & File Uploads

**Scope:** Frontend + Backend  
**Goal:** Enable the admin dashboard to create, update, and delete content for all entity types, including image uploads.

## What Was Done

### 1. Backend — Mutating Endpoints
Added `POST`, `PUT`, and `DELETE` routes for all manageable entities. Each is protected by `authMiddleware`:

| Entity | Create | Update | Delete |
|--------|--------|--------|--------|
| Programs | `POST /api/programs` | `PUT /api/programs/:id` | `DELETE /api/programs/:id` |
| Posts | `POST /api/posts` | `PUT /api/posts/:id` | `DELETE /api/posts/:id` |
| Sliders | `POST /api/sliders` | `PUT /api/sliders/:id` | `DELETE /api/sliders/:id` |
| Timetables | `POST /api/timetables` | `PUT /api/timetables/:id` | `DELETE /api/timetables/:id` |

### 2. File Upload System
- Configured Multer in `uploadRoutes.js` to accept single file uploads
- Files are saved to `/backend/uploads/` with unique filenames (timestamp prefix)
- The uploads directory is served as static files: `app.use('/uploads', express.static('uploads'))`
- Upload endpoint: `POST /api/upload` — returns the stored file path

### 3. Frontend — Admin CRUD Components
Built dedicated management components for each entity:

| Component | Features |
|-----------|----------|
| `AdminPrograms.jsx` | Table listing, Create/Edit modal, Delete confirmation, Image upload |
| `AdminPosts.jsx` | Table listing, Create/Edit modal, Delete confirmation, Image upload |
| `AdminSliders.jsx` | Table listing, Create/Edit modal, Delete confirmation, Image upload |
| `AdminTimetables.jsx` | Table listing, Create/Edit modal, Delete confirmation |

Each component follows the same pattern:
1. Fetches all records on mount
2. Renders them in `AdminTable`
3. "Add New" button opens `AdminModal` with a form
4. Edit button opens the same modal pre-filled with existing data
5. Delete button sends a `DELETE` request and refreshes the list

### 4. API Service Functions
Added to `services/api.js`:
- `createProgram(payload)`, `updateProgram(id, payload)`, `deleteProgram(id)`
- Same pattern for posts, sliders, timetables

## Key Files Created
- `frontend/src/components/Admin/AdminPrograms.jsx`
- `frontend/src/components/Admin/AdminPosts.jsx`
- `frontend/src/components/Admin/AdminSliders.jsx`
- `frontend/src/components/Admin/AdminTimetables.jsx`
- `backend/src/routes/uploadRoutes.js`

## Result
A non-technical user can now log into `/admin`, and create/edit/delete courses, blog posts, hero banners, and class schedules through a visual interface — no code or database access needed.
