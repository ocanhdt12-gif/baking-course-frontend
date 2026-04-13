# Deployment Guide

This guide covers deploying the Muka Baking CMS application to production environments. Due to its decoupled architecture, the frontend and backend must be deployed as separate services.

## Architecture Topology
1. **Frontend**: Static Site Hosting (Vercel, Netlify, or AWS S3)
2. **Backend**: Node.js Runtime Server (Render, Railway, or AWS EC2)
3. **Database**: Managed PostgreSQL (Supabase, Neon, or AWS RDS)
4. **Storage**: Cloud Object Storage (AWS S3 or Cloudinary for uploads)

---

## 1. Database Deployment (Supabase / Neon)

Before deploying the backend, you must have a live PostgreSQL database.

1. Create a project on [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).
2. Obtain the Connection String/URI (e.g., `postgresql://...`).
3. Take note of this URL; it will be your `DATABASE_URL` environment variable.

---

## 2. Backend Deployment (Render / Railway)

We recommend Render Web Services for Node.js.

### Prerequisites
Update the file upload logic. Currently, files are saved locally to `backend/uploads`. For production, you **MUST** integrate cloud storage (like Cloudinary or AWS S3) in `uploadRoutes.js`. Local ephemeral disks will delete images on every deploy.

### Environment Variables
Set the following on your hosting dashboard:
- `PORT=5000`
- `DATABASE_URL="your-production-postgres-url"`
- `JWT_SECRET="a-very-long-secure-random-string"`

### Build & Run Commands
- **Build Command:** `npm install && npx prisma db push`
- **Start Command:** `npm start` (Make sure `package.json` has `"start": "node src/index.js"`)

---

## 3. Frontend Deployment (Vercel)

Vercel provides the fastest workflow for Vite/React applications.

### Setup
1. Log in to Vercel and Import your Git Repository.
2. Ensure the Framework Preset is set to **Vite**.

### Environment Variables
You must point the frontend to your live backend.
- `VITE_API_BASE_URL="https://your-backend-url.onrender.com/api"`

### Build Commands
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Handling SPA Routing
Vercel automatically handles client-side routing for Vite when configured via `vercel.json`, or if you use the Vercel dashboard preset. Make sure 404s fallback to `index.html`.

---

## 4. Post-Deployment Checklist
- [ ] Log in using default admin credentials.
- [ ] Attempt to upload an image (Verify Cloud Storage integration).
- [ ] Submit the Contact Form from the public view and check the Admin CMS Inbox.
- [ ] Submit a test enrollment for a course.
- [ ] Change the default Admin password immediately!
