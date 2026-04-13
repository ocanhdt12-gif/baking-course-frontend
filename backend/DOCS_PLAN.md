# Backend Execution Plan

This file tracks what has been completed and what remains for the backend codebase.

## Completed Work

### Phase 2 — Foundation
- [x] Initialize Express.js server
- [x] Design Prisma schema (User, Program, Post, Chief, Testimonial)
- [x] Push schema to PostgreSQL via `npx prisma db push`
- [x] Create `seed.js` to populate database with template content
- [x] Create admin account (`admin@muka.com` / `admin123`)
- [x] Implement GET endpoints for all initial entities

### Phase 3 — Authentication
- [x] Build `authController.js` (register, login, getMe)
- [x] Create `authMiddleware.js` for JWT verification
- [x] Implement bcrypt password hashing
- [x] Protect all POST/PUT/DELETE routes with auth middleware

### Phase 5 — Additional Models
- [x] Add `Slider` model to schema + controller + routes
- [x] Add `Timetable` model to schema + controller + routes
- [x] Seed slider and timetable data

### Phase 7 — CRUD & Uploads
- [x] Add POST/PUT/DELETE for Programs, Posts, Sliders, Timetables
- [x] Configure Multer for file uploads (`uploadRoutes.js`)
- [x] Serve `/uploads/` as static directory

### Phase 8 — CRM
- [x] Add `Contact` model to schema + controller + routes
- [x] Add `Enrollment` model to schema (with `EnrollmentStatus` enum)
- [x] Create enrollment controller with status update (PATCH)
- [x] Public POST for contacts and enrollments (no auth required)
- [x] Protected GET/DELETE/PATCH for admin CRM views

## Remaining Work

### Phase 10 — Payment Processing
- [ ] Install `stripe` npm package
- [ ] Create `paymentController.js` with Stripe Checkout Session creation
- [ ] Create `POST /api/webhooks/stripe` endpoint for payment confirmation
- [ ] On successful payment webhook, auto-update enrollment status to CONFIRMED
- [ ] Add Stripe API keys to `.env`

### Phase 11 — Cloud Infrastructure
- [ ] Replace Multer local storage with Cloudinary or AWS S3 SDK
- [ ] Write `Dockerfile` for containerized deployment
- [ ] Write `docker-compose.yml` with PostgreSQL service
- [ ] Mount `/uploads` as Docker volume (interim before cloud storage)
- [ ] Migrate local PostgreSQL to managed service (Supabase / AWS RDS / Neon)

### Phase 12 — Hardening
- [ ] Add `express-validator` or `Joi` input validation to all endpoints
- [ ] Add `express-rate-limit` to public endpoints (contacts, enrollments)
- [ ] Add request logging middleware
- [ ] Write API integration tests with Jest + Supertest
