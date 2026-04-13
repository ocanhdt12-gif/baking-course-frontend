# Backend Documentation — Muka Baking CMS

This document is the complete technical reference for the Node.js backend. It covers server architecture, database schema, API endpoints, authentication, file uploads, and known patterns. A new developer or AI agent should read this file to fully understand the backend.

---

## 1. Technology & Dependencies

| Package | Purpose |
|---------|---------|
| express | HTTP server framework |
| @prisma/client | Database ORM (auto-generated from schema) |
| prisma (dev) | Schema management, migrations, DB push |
| cors | Cross-origin request handling (allows frontend on different port) |
| dotenv | Environment variable loading from `.env` |
| bcryptjs | Password hashing for user accounts |
| jsonwebtoken | JWT token generation and verification |
| multer | Multipart form-data parsing for file uploads |
| nodemon (dev) | Auto-restart server on file changes |

---

## 2. Directory Structure (Detailed)

```
backend/
├── prisma/
│   ├── schema.prisma              # THE source of truth for ALL database tables
│   └── migrations/                # Auto-generated SQL migration files
│
├── src/
│   ├── index.js                   # Server entry point:
│   │                                - Configures Express, CORS, JSON parsing
│   │                                - Mounts /uploads as static directory
│   │                                - Registers all route modules under /api/*
│   │                                - Starts listening on PORT (default 5000)
│   │
│   ├── seed.js                    # First-time setup script:
│   │                                - Creates admin account (admin@muka.com / admin123)
│   │                                - Inserts programs, posts, chiefs, testimonials,
│   │                                  sliders, timetables from template HTML content
│   │
│   ├── seedAdmin.js               # Standalone: creates only the admin account
│   │
│   ├── controllers/               # Business logic — one file per entity:
│   │   ├── authController.js      #   register, login, getMe (current user profile)
│   │   ├── programController.js   #   getAll, getBySlug, create, update, delete
│   │   ├── postController.js      #   getAll, getBySlug, create, update, delete
│   │   ├── chiefController.js     #   getAll, getById
│   │   ├── sliderController.js    #   getAll, create, update, delete
│   │   ├── timetableController.js #   getAll, create, update, delete
│   │   ├── testimonialController.js # getAll
│   │   ├── contactController.js   #   getAll (admin), create (public), delete (admin)
│   │   └── enrollmentController.js #  getAll (admin), create (public),
│   │                                  updateStatus (admin), delete (admin)
│   │
│   ├── routes/                    # Express Router definitions — maps HTTP methods to controllers:
│   │   ├── authRoutes.js          #   POST /login, POST /register, GET /me
│   │   ├── programRoutes.js       #   GET /, GET /:slug, POST /, PUT /:id, DELETE /:id
│   │   ├── postRoutes.js          #   GET /, GET /:slug, POST /, PUT /:id, DELETE /:id
│   │   ├── chiefRoutes.js         #   GET /, GET /:id
│   │   ├── sliderRoutes.js        #   GET /, POST /, PUT /:id, DELETE /:id
│   │   ├── timetableRoutes.js     #   GET /, POST /, PUT /:id, DELETE /:id
│   │   ├── testimonialRoutes.js   #   GET /
│   │   ├── contactRoutes.js       #   GET / (auth), POST / (public), DELETE /:id (auth)
│   │   ├── enrollmentRoutes.js    #   GET / (auth), POST / (public), PATCH /:id (auth),
│   │   │                              DELETE /:id (auth)
│   │   └── uploadRoutes.js        #   POST / (multipart file upload via Multer)
│   │
│   ├── middleware/                 # Request interceptors:
│   │   └── authMiddleware.js      #   Extracts JWT from x-auth-token header,
│   │                                  verifies signature, attaches user to req.user,
│   │                                  rejects with 401 if invalid/missing
│   │
│   └── uploads/                   # Multer destination for uploaded images
│                                    Files served as static at /uploads/*
│
├── .env                           # Environment variables (not committed to git)
├── package.json
└── README.md                      # This file
```

---

## 3. Database Schema

The database has **9 tables**. The canonical definition is in `prisma/schema.prisma`.

### Entities & Relationships

```
User ──┬── Post (author)          One user can author many posts
       └── Enrollment (user)      One user can have many enrollments

Program ── Enrollment (program)   One program can have many enrollments
```

### Table Summary

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Admin/user accounts | email (unique), password (bcrypt), role (ADMIN/EDITOR/USER) |
| **Program** | Baking courses | slug (unique), title, price, thumbnail, authorName |
| **Post** | Blog articles | slug (unique), title, content, category, type (BLOG/RECIPE) |
| **Chief** | Chef/instructor profiles | name, role, image, social links |
| **Testimonial** | Customer reviews | excerpt, text, name, signature image |
| **Slider** | Homepage hero banners | titleMain, btnLink, image, isActive |
| **Timetable** | Weekly class schedules | dayOfWeek, title, dateRange, timeRange, instructor |
| **Contact** | Form submissions (inbox) | fullName, email, subject, message |
| **Enrollment** | Course registrations | programId (FK), fullName, email, status (PENDING/CONFIRMED/CANCELLED) |

### Enums
- `Role`: ADMIN, EDITOR, USER
- `PostType`: BLOG, RECIPE
- `EnrollmentStatus`: PENDING, CONFIRMED, CANCELLED

---

## 4. API Reference

Base URL: `http://localhost:5000/api`

### 4.1 Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create new user account |
| POST | `/auth/login` | No | Returns `{ token, user }` |
| GET | `/auth/me` | Yes | Returns current user profile |

**Login Request:**
```json
{ "email": "admin@muka.com", "password": "admin123" }
```
**Login Response:**
```json
{ "token": "eyJhbG...", "user": { "id": "...", "fullName": "System Administrator", "role": "ADMIN" } }
```

### 4.2 Public Endpoints (No Auth Required)
| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/programs` | All programs |
| GET | `/programs/:slug` | Single program by slug |
| GET | `/posts` | All blog posts |
| GET | `/posts/:slug` | Single post by slug |
| GET | `/chiefs` | All chef profiles |
| GET | `/chiefs/:id` | Single chef by ID |
| GET | `/testimonials` | All testimonials |
| GET | `/sliders` | All active hero banners |
| GET | `/timetables` | All weekly schedules |
| POST | `/contacts` | Submit a contact form |
| POST | `/enrollments` | Submit an enrollment request |

### 4.3 Protected Endpoints (JWT Required)
All requests must include: `x-auth-token: <valid_jwt_token>`

**Programs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/programs` | Create a new program |
| PUT | `/programs/:id` | Update a program |
| DELETE | `/programs/:id` | Delete a program |

**Posts:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create a new post |
| PUT | `/posts/:id` | Update a post |
| DELETE | `/posts/:id` | Delete a post |

**Sliders:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sliders` | Create a new banner |
| PUT | `/sliders/:id` | Update a banner |
| DELETE | `/sliders/:id` | Delete a banner |

**Timetables:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/timetables` | Create a schedule entry |
| PUT | `/timetables/:id` | Update a schedule entry |
| DELETE | `/timetables/:id` | Delete a schedule entry |

**Contacts (Admin CRM):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | List all contact messages |
| DELETE | `/contacts/:id` | Delete a message |

**Enrollments (Admin CRM):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/enrollments` | List all enrollments |
| PATCH | `/enrollments/:id` | Update enrollment status |
| DELETE | `/enrollments/:id` | Delete an enrollment |

**File Upload:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload image file (multipart/form-data) — returns URL path |

---

## 5. Authentication Deep Dive

### Token Flow
1. Frontend sends `POST /api/auth/login` with `{ email, password }`
2. Backend verifies password with `bcrypt.compare()`
3. On success, signs a JWT with `jwt.sign({ userId, role }, JWT_SECRET)`
4. Frontend stores token in `localStorage`
5. Every subsequent request includes `x-auth-token: <token>` header
6. `authMiddleware.js` decodes the token, looks up the user, and attaches it to `req.user`
7. If the token is missing/invalid/expired → `401 Unauthorized`

### Role-Based Access
The middleware exposes `req.user.role`. Controllers can check for `ADMIN` role to restrict operations.

---

## 6. File Upload System

- Multer is configured in `uploadRoutes.js` to accept single file uploads
- Files are stored in `/backend/uploads/` directory
- The directory is served as static: `app.use('/uploads', express.static('uploads'))`
- Upload endpoint returns the file path (e.g., `/uploads/1712345678-image.jpg`)
- Frontend uses this path as the `thumbnail` or `image` value when creating/updating entities

---

## 7. Getting Started

```bash
cd backend
npm install

# 1. Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:password@localhost:5432/muka_baking_db?schema=public"
PORT=5000
JWT_SECRET="your-random-secret-key-here"
EOF

# 2. Push schema to database
npx prisma db push

# 3. Seed initial data (creates admin + dummy content)
node src/seed.js

# 4. Start development server
npm run dev
# Server runs at http://localhost:5000
```

### Verify it works
```bash
curl http://localhost:5000/api
# Should return: {"message":"Baking Course API is running"}

curl http://localhost:5000/api/programs
# Should return array of program objects
```

---

## 8. Remaining Work (Backend Scope)

- [ ] **Payment Webhook** — Install `stripe` package, create `POST /api/webhooks/stripe` endpoint that listens for successful payment events and auto-updates enrollment status to `CONFIRMED`
- [ ] **Cloud Storage Migration** — Replace local Multer disk storage with S3 or Cloudinary SDK so uploaded images persist across deployments
- [ ] **Input Validation** — Add `express-validator` or `Joi` validation middleware to all POST/PUT endpoints to reject malformed data
- [ ] **Rate Limiting** — Add `express-rate-limit` to prevent abuse of public endpoints (contact form, enrollment)
- [ ] **Dockerization** — Write `Dockerfile` and `docker-compose.yml` for containerized deployment
- [ ] **Production Database** — Migrate from local PostgreSQL to managed service (Supabase, AWS RDS, or Neon)
