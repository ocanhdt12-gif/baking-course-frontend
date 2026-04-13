# Phase 3: Authentication & Security

**Scope:** Backend + Frontend (login page)  
**Goal:** Implement JWT-based authentication to protect administrative API endpoints.

## What Was Done

### 1. Authentication Controller (`authController.js`)
- `POST /api/auth/register` — creates a new user with bcrypt-hashed password
- `POST /api/auth/login` — validates credentials, returns a signed JWT token + user object
- `GET /api/auth/me` — returns the profile of the currently authenticated user (requires valid token)

### 2. JWT Middleware (`authMiddleware.js`)
- Intercepts incoming requests and checks for `x-auth-token` header
- Decodes the JWT using `jsonwebtoken.verify()` with `JWT_SECRET` from environment
- Attaches the decoded user object to `req.user` for downstream controllers
- Returns `401 Unauthorized` if the token is missing, invalid, or expired

### 3. Password Security
- All passwords are hashed using `bcryptjs` with salt rounds before storage
- The seed script creates the admin account with a pre-hashed password
- Plain-text passwords are never stored or logged

### 4. Frontend Auth Page (`Auth.jsx`)
- Built a login/register page at `/auth`
- Login form sends credentials to `POST /api/auth/login`
- On success, stores the returned JWT token in `localStorage`
- Created `ProtectedRoute.jsx` component that checks for token presence and optionally verifies ADMIN role before rendering child routes

## Key Files Created/Modified
- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`
- `backend/src/middleware/authMiddleware.js`
- `frontend/src/pages/Auth.jsx`
- `frontend/src/components/Auth/ProtectedRoute.jsx`

## Result
The API is now secured. All `POST`, `PUT`, and `DELETE` endpoints require a valid JWT token. The frontend has a functional login page that persists the session token.
