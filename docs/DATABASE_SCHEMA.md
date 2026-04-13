# Database Schema Documentation

This document mirrors the Prisma schema at `backend/prisma/schema.prisma`. It serves as a human-readable reference for understanding the database structure without reading Prisma syntax.

**Note:** If you modify the schema, update this document AND run `npx prisma db push` to sync changes.

---

## Enums

### Role
| Value | Description |
|-------|-------------|
| `ADMIN` | Full CMS access |
| `EDITOR` | Content editing (not currently differentiated in middleware) |
| `USER` | Default role for registered users |

### PostType
| Value | Description |
|-------|-------------|
| `BLOG` | Standard blog article |
| `RECIPE` | Recipe content type |

### EnrollmentStatus
| Value | Description |
|-------|-------------|
| `PENDING` | Submitted, awaiting admin review |
| `CONFIRMED` | Approved by admin |
| `CANCELLED` | Rejected or cancelled |

---

## Tables

### 1. User
Admin and registered user accounts.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | Auto-generated |
| email | String | Unique | Login credential |
| password | String | | bcrypt-hashed |
| fullName | String | | Display name |
| role | Role | Default: USER | Access level |
| createdAt | DateTime | Default: now() | |
| updatedAt | DateTime | Auto | |

**Relations:** `posts` (one-to-many with Post), `enrollments` (one-to-many with Enrollment)

---

### 2. Program
Baking courses and class offerings.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| slug | String | Unique | URL-safe identifier (e.g., `french-pastry-basics`) |
| title | String | | Course name |
| description | String? | | Full curriculum text |
| price | String? | | Display price (e.g., `$550`) |
| reviews | Int | Default: 0 | Review count |
| students | Int | Default: 0 | Enrolled student count |
| thumbnail | String? | | Cover image URL path |
| authorName | String? | | Lead instructor name |
| authorImage | String? | | Instructor avatar URL |
| createdAt | DateTime | Default: now() | |
| updatedAt | DateTime | Auto | |

**Relations:** `enrollments` (one-to-many with Enrollment)

---

### 3. Post
Blog articles and recipe content.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| slug | String | Unique | SEO-friendly URL segment |
| title | String | | Article headline |
| content | String | | Full article body (may contain HTML) |
| desc | String? | | Short excerpt for list views |
| category | String? | | Category tag (e.g., `Recipes`) |
| type | PostType | Default: BLOG | Content format |
| thumbnail | String? | | Featured image URL |
| authorId | String? | FK → User.id | Optional link to user |
| authorName | String? | | Hardcoded author name fallback |
| dateIso | DateTime | Default: now() | Publication date |
| dateString | String? | | Pre-formatted date (e.g., `19 Jan`) |
| createdAt | DateTime | Default: now() | |
| updatedAt | DateTime | Auto | |

**Relations:** `author` (many-to-one with User, optional)

---

### 4. Chief
Chef/instructor profiles displayed on the public site.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| name | String | | Full name |
| role | String | | Title (e.g., `Master Chef`) |
| image | String? | | Profile photo URL |
| socialFb | String? | | Facebook profile link |
| socialTw | String? | | Twitter profile link |
| socialIn | String? | | Instagram profile link |
| createdAt | DateTime | Default: now() | |
| updatedAt | DateTime | Auto | |

---

### 5. Testimonial
Customer review quotes displayed in carousels.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| excerpt | String | | Bold highlight quote |
| text | String | | Full review paragraph |
| name | String | | Customer name |
| role | String | | Title (e.g., `Former Student`) |
| signature | String? | | Signature image URL |
| createdAt | DateTime | Default: now() | |

---

### 6. Slider
Hero banner slides on the homepage carousel.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| titleHighlight | String? | | Secondary tagline text |
| titleMain | String | | Primary headline |
| btnLink | String? | Default: `#` | CTA button URL |
| btnText | String? | Default: `enroll now` | CTA button label |
| image | String? | | Background image URL |
| isActive | Boolean | Default: true | Toggle visibility |
| createdAt | DateTime | Default: now() | |
| updatedAt | DateTime | Auto | |

---

### 7. Timetable
Weekly class schedule entries displayed in tabs on the homepage.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| dayOfWeek | String | | e.g., `Monday`, `Tuesday` |
| title | String | | Class topic |
| dateRange | String | | e.g., `19 Jan - 25 Feb` |
| timeRange | String | | e.g., `10:00 AM - 12:00 PM` |
| instructor | String | | Teacher name |
| image | String? | | Schedule card thumbnail |
| createdAt | DateTime | Default: now() | |
| updatedAt | DateTime | Auto | |

---

### 8. Contact
Public contact form submissions (admin inbox).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| fullName | String | | Submitter name |
| email | String | | Submitter email |
| subject | String? | | Message topic |
| message | String | | Message body |
| createdAt | DateTime | Default: now() | Submission time |

---

### 9. Enrollment
Course enrollment requests from public users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, UUID | |
| programId | String | FK → Program.id | Selected course |
| userId | String? | FK → User.id | Optional logged-in user |
| fullName | String | | Applicant name |
| email | String | | Applicant email |
| phone | String? | | Applicant phone |
| status | EnrollmentStatus | Default: PENDING | Review state |
| createdAt | DateTime | Default: now() | |
| updatedAt | DateTime | Auto | |

**Relations:** `program` (many-to-one with Program), `user` (many-to-one with User, optional)
