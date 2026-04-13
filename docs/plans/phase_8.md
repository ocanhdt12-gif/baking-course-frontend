# Phase 8: CRM — Contacts & Enrollments

**Scope:** Frontend + Backend  
**Goal:** Allow public users to submit contact messages and course enrollment requests, and give admins tools to manage these submissions.

## What Was Done

### 1. Database Schema Updates
Added two new models to `prisma/schema.prisma`:

**Contact:**
```prisma
model Contact {
  id        String   @id @default(uuid())
  fullName  String
  email     String
  subject   String?
  message   String
  createdAt DateTime @default(now())
}
```

**Enrollment:**
```prisma
model Enrollment {
  id        String           @id @default(uuid())
  programId String
  userId    String?
  fullName  String
  email     String
  phone     String?
  status    EnrollmentStatus @default(PENDING)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
  program   Program          @relation(fields: [programId], references: [id])
  user      User?            @relation(fields: [userId], references: [id])
}
```

Added `EnrollmentStatus` enum: `PENDING`, `CONFIRMED`, `CANCELLED`

### 2. Backend API
**Contact endpoints:**
- `POST /api/contacts` (public) — anyone can submit a contact form
- `GET /api/contacts` (protected) — admin views all messages
- `DELETE /api/contacts/:id` (protected) — admin deletes a message

**Enrollment endpoints:**
- `POST /api/enrollments` (public) — anyone can submit an enrollment
- `GET /api/enrollments` (protected) — admin views all enrollments
- `PATCH /api/enrollments/:id` (protected) — admin updates status (PENDING → CONFIRMED)
- `DELETE /api/enrollments/:id` (protected) — admin deletes an enrollment

### 3. Frontend — Public Forms
- **`ContactForm.jsx`:** Collects name, email, subject, message. Submits to `POST /api/contacts`. Shows success alert.
- **`HomeContacts.jsx`:** Enrollment form with a dynamic course dropdown (fetches programs from API). Submits to `POST /api/enrollments`.

### 4. Frontend — Admin CRM Modules
- **`AdminContacts.jsx`:** Table displaying all contact messages with delete button. Shows sender name, email, subject, message, and date.
- **`AdminEnrollments.jsx`:** Table displaying all enrollments with the associated program name. Features a "Confirm" button that toggles status from PENDING to CONFIRMED via `PATCH` request.

Both modules were integrated into the `AdminDashboard.jsx` sidebar navigation.

## Key Files Created
- `backend/src/controllers/contactController.js`
- `backend/src/controllers/enrollmentController.js`
- `backend/src/routes/contactRoutes.js`
- `backend/src/routes/enrollmentRoutes.js`
- `frontend/src/components/Admin/AdminContacts.jsx`
- `frontend/src/components/Admin/AdminEnrollments.jsx`

## Result
Complete lead management pipeline: users submit forms → data lands in the database → admin reviews and manages submissions through the CMS dashboard.
