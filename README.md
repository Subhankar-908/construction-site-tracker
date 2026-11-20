# Construction Daily Site Log + Material Consumption Tracker

Next.js client + Express/MongoDB API with JWT auth, RBAC (ADMIN, MANAGER, SUPERVISOR), Cloudinary photos,
manager approval workflow, material variance tracking, audit trail and a Recharts dashboard.

## Run
```
cd server && npm install && cp .env.example .env   # fill MONGODB_URI, JWT_SECRET, Cloudinary keys
npm run seed   # optional demo users: admin/manager/supervisor@site.com, password Password@123
npm run dev    # http://localhost:5000

cd client && npm install && cp .env.local.example .env.local
npm run dev    # http://localhost:3000
```

## How it works
- First registered user becomes ADMIN; later sign-ups are SUPERVISORs. Admins can create users (POST /api/users) or change roles (PATCH /api/users/:id/role).
- Managers/Admins create projects, assign supervisors and add materials (planned qty, stock, minimum stock).
- Supervisors submit daily logs (manpower, work, delays, issues, material used, photos). Submitting a log deducts material stock once.
- Managers approve or reject (rejection needs a comment). Rejected logs can be edited and resubmitted. Every action is written to the audit trail.
- Dashboard shows progress, manpower, delay reasons, material variance, rule-based risk signals and a weekly progress note.
