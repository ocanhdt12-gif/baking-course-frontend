# API Documentation — Muka Baking CMS

Base URL: `http://localhost:5000/api`

All protected endpoints require the header: `x-auth-token: <valid_jwt_token>`

---

## 1. Authentication

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| POST | `/auth/register` | No | `{ email, password, fullName }` | `{ token, user }` |
| POST | `/auth/login` | No | `{ email, password }` | `{ token, user }` |
| GET | `/auth/me` | Yes | — | `{ id, email, fullName, role }` |

### Login Example
```
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@muka.com", "password": "admin123" }
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "fullName": "System Administrator", "role": "ADMIN" }
}
```

---

## 2. Programs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/programs` | No | List all programs |
| GET | `/programs/:slug` | No | Get single program by slug |
| POST | `/programs` | Yes | Create a program |
| PUT | `/programs/:id` | Yes | Update a program |
| DELETE | `/programs/:id` | Yes | Delete a program |

**Create/Update Body:** `{ slug, title, description, price, reviews, students, thumbnail, authorName, authorImage }`

---

## 3. Posts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts` | No | List all posts |
| GET | `/posts/:slug` | No | Get single post by slug |
| POST | `/posts` | Yes | Create a post |
| PUT | `/posts/:id` | Yes | Update a post |
| DELETE | `/posts/:id` | Yes | Delete a post |

**Create/Update Body:** `{ slug, title, content, desc, category, type, thumbnail, authorName, dateString }`

---

## 4. Chiefs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/chiefs` | No | List all chefs |
| GET | `/chiefs/:id` | No | Get single chef by ID |

---

## 5. Testimonials

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/testimonials` | No | List all testimonials |

---

## 6. Sliders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/sliders` | No | List all sliders |
| POST | `/sliders` | Yes | Create a slider |
| PUT | `/sliders/:id` | Yes | Update a slider |
| DELETE | `/sliders/:id` | Yes | Delete a slider |

**Create/Update Body:** `{ titleHighlight, titleMain, btnLink, btnText, image, isActive }`

---

## 7. Timetables

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/timetables` | No | List all schedules |
| POST | `/timetables` | Yes | Create a schedule |
| PUT | `/timetables/:id` | Yes | Update a schedule |
| DELETE | `/timetables/:id` | Yes | Delete a schedule |

**Create/Update Body:** `{ dayOfWeek, title, dateRange, timeRange, instructor, image }`

---

## 8. Contacts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/contacts` | **No** | Submit a contact message (public form) |
| GET | `/contacts` | Yes | List all contact messages (admin inbox) |
| DELETE | `/contacts/:id` | Yes | Delete a contact message |

**Submit Body:** `{ fullName, email, subject, message }`

---

## 9. Enrollments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/enrollments` | **No** | Submit enrollment request (public form) |
| GET | `/enrollments` | Yes | List all enrollments (admin view) |
| PATCH | `/enrollments/:id` | Yes | Update enrollment status |
| DELETE | `/enrollments/:id` | Yes | Delete an enrollment |

**Submit Body:** `{ programId, fullName, email, phone }`  
**Status Update Body:** `{ status }` (values: `PENDING`, `CONFIRMED`, `CANCELLED`)

---

## 10. File Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | Yes | Upload image file |

**Request:** `multipart/form-data` with field name `file`  
**Response:** `{ url: "/uploads/1712345678-filename.jpg" }`

The returned URL can be used as the `thumbnail` or `image` field when creating/updating entities.
