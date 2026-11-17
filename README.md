# MAX CODE ACADEMY

Full-stack starting implementation for the MAX CODE academy platform.

## Included in this first build
- React + Vite + Tailwind public website (Arabic default, RTL/LTR language switch).
- Dynamic public course catalog and course details.
- Student registration API with validation, duplicate protection, generated registration code, and course-specific WhatsApp invitation returned only after the registration is saved.
- Express + MongoDB/Mongoose backend.
- JWT login, bcrypt password hashing, initial Super Admin bootstrap.
- Backend RBAC middleware with deny-by-default permissions and immutable Super Admin protection.
- Initial course, user, role, registration, and audit-log models.
- Protected admin API endpoints for course and registration management.
- Working bilingual admin dashboard for course CRUD, registration review, activity logs, and Super Admin account creation.
- `.env.example` and local setup instructions.

## Requirements
- Node.js 20+
- MongoDB 7+ (local or hosted)

## Setup
1. Copy `.env.example` to `backend/.env` (or root `.env` if you adapt your process); the backend loads `backend/.env`.
2. Set a strong unique `SUPER_ADMIN_PASSWORD` and a long random `JWT_ACCESS_SECRET`.
3. Start MongoDB.
4. Install dependencies:
   ```bash
   npm install
   npm run install:all
   ```
5. Run both apps:
   ```bash
   npm run dev
   ```
6. Open http://localhost:5173. API health: http://localhost:5001/api/health

## First Super Admin
On backend startup, the app creates the Super Admin from environment variables only if that email does not already exist. Existing accounts are never overwritten. In production, weak/default passwords are rejected.

Sign in at `/login` with the Super Admin email and password from `backend/.env`, then open `/admin`. Use **Admin accounts** to create additional staff accounts; the new administrator signs in with the email and password assigned there. Students currently submit course registrations from each course page; student portal accounts and self-service password recovery are not part of this build.

## Important production checklist
This is a working foundation, not a claim that every module in the full master specification is complete. Before public launch:
- Configure HTTPS, secure hosting, MongoDB backups, CORS origins, rate limits and monitoring.
- Use a managed secret store; rotate JWT secrets.
- Add email/phone verification and abuse protection (CAPTCHA or equivalent).
- Replace local course-image uploads with managed storage (S3/Cloudinary) before deploying multiple production servers.
- Complete remaining modules: attendance, exams/assignments, grades, Google Meet schedules, student portal, website content editor, reports/export, notifications, and full admin UI.
- Review legal/privacy requirements and consent for the public student directory.
- Never commit `.env`.

## Project layout
- `frontend/` React public site, bilingual login, and admin dashboard
- `backend/` REST API, models, middleware, services, routes
