# Phase 2: Backend Foundation

**Scope:** Backend only  
**Goal:** Create a Node.js API server backed by PostgreSQL, modeled after the data structures visible in the HTML template.

## What Was Done

### 1. Server Bootstrap
- Initialized `/backend/` with `npm init`
- Installed core dependencies: `express`, `cors`, `dotenv`, `prisma`, `@prisma/client`
- Created `src/index.js` as the Express entry point, configured for JSON parsing, CORS, and static file serving

### 2. Database Schema Design
- Analyzed the HTML template to identify data entities (programs, chefs, blog posts, etc.)
- Designed the Prisma schema (`prisma/schema.prisma`) with 5 initial models:
  - `User` — admin accounts with role-based access
  - `Program` — baking courses with slug, title, price, thumbnail
  - `Post` — blog articles with slug, content, category
  - `Chief` — chef/instructor profiles with social links
  - `Testimonial` — customer review quotes
- Ran `npx prisma db push` to create the tables in a local PostgreSQL database (`muka_baking_db`)

### 3. Database Seeding
- Created `src/seed.js` that:
  - Hashes a default admin password using bcrypt
  - Creates the admin account: `admin@muka.com` / `admin123`
  - Inserts programs, posts, chiefs, and testimonials extracted from the HTML template content
- This ensures any developer cloning the project can immediately have a populated database

### 4. Initial API Routes
- Created controllers and routes for each entity with `GET` endpoints:
  - `GET /api/programs` — returns all programs
  - `GET /api/posts` — returns all posts
  - `GET /api/chiefs` — returns all chiefs
  - `GET /api/testimonials` — returns all testimonials

## Key Files Created
- `backend/prisma/schema.prisma`
- `backend/src/index.js`
- `backend/src/seed.js`
- `backend/src/controllers/programController.js`
- `backend/src/controllers/postController.js`
- `backend/src/controllers/chiefController.js`
- `backend/src/controllers/testimonialController.js`
- `backend/src/routes/*.js` (corresponding route files)

## Result
A running Express server on port 5000 with a populated PostgreSQL database and public GET endpoints for all content types.
