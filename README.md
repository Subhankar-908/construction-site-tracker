# Construction Site Tracker

Full-stack construction management application without AI.

## Stack
- Next.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Cloudinary
- Recharts

## Features
- Authentication
- RBAC: ADMIN, MANAGER, SUPERVISOR
- Project management
- Daily site logs
- Manpower/work/delay/issues tracking
- Cloudinary site photos
- Material planned vs actual consumption
- Low-stock and variance risk signals
- Manager approval/rejection/comments
- Dashboard analytics
- Audit trail

## Run

### Backend
```bash
cd server
npm install
copy .env.example .env
npm run dev
```

### Frontend
```bash
cd client
npm install
copy .env.local.example .env.local
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## MongoDB
Use local MongoDB or MongoDB Atlas and put the connection string in `server/.env`.

## Git team workflow
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature
git add .
git commit -m "Describe your change"
git push -u origin feature/your-feature
```
Create a Pull Request and merge after review.

Never commit `.env` files or credentials.
