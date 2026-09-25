
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
=======
# Construction Daily Site Log + Material Consumption Tracker

A full-stack construction project management application for recording
daily site progress, tracking material consumption, managing delays, and
maintaining an auditable approval workflow.

## Project Overview

Construction projects often suffer from unstructured daily updates, weak
accountability, and poor material tracking.

This application provides a centralized system where site supervisors
can submit daily site reports, managers can review and approve them, and
project teams can monitor progress, delays, manpower, and material
variance from dashboards.

## Key Features

### Authentication & Authorization

-   User registration and login
-   JWT-based authentication
-   Password hashing
-   Role-Based Access Control (RBAC)
-   Roles:
    -   Admin
    -   Manager
    -   Supervisor

### Project Management

-   Create and manage construction projects
-   Assign managers and supervisors
-   Track project status
-   Track overall project progress

### Daily Site Logs

Supervisors can submit: - Daily manpower count - Skilled and unskilled
worker counts - Work completed - Work progress - Delay information -
Delay reasons - Issues and site remarks - Site photographs - Report
status

### Manager Review & Approval

Managers can: - View submitted daily reports - Add comments - Approve
reports - Reject reports - Track report status

Workflow:

`Draft → Submitted → Approved`

or

`Draft → Submitted → Rejected → Resubmit`

### Material Consumption Tracking

Track: - Material name - Unit - Planned quantity - Consumed quantity -
Current stock - Minimum stock - Daily material usage - Material
variance - Shortage warnings

### Dashboard & Analytics

The dashboard provides: - Overall project progress - Daily/weekly
progress trends - Manpower trends - Delay statistics - Delay reasons -
Material consumption - Material variance - Low-stock warnings - Risk
indicators

### Audit Trail

Important project actions are recorded for accountability, including: -
Report submission - Report approval - Report rejection - Manager
comments - Status changes

### Cloudinary Photo Storage

Construction site photos are uploaded to Cloudinary.

MongoDB stores the photo URL and Cloudinary public ID instead of storing
image files directly in the database.

### AI / Innovation

Optional AI functionality can: - Generate weekly progress summaries -
Summarize daily site reports - Identify repeated delays - Highlight low
manpower - Highlight material over-consumption - Identify potential
project risk signals - Provide management-oriented recommendations

### PDF Export

Optional PDF export can generate formal daily or weekly construction
reports.

## Technology Stack

### Frontend

-   Next.js
-   React
-   JavaScript
-   HTML/CSS
-   Chart library such as Recharts

### Backend

-   Node.js
-   Express.js
-   REST API
-   JWT
-   bcrypt

### Database

-   MongoDB
-   Mongoose

### File Storage

-   Cloudinary

### Optional

-   AI API
-   PDF generation

## System Architecture

``` text
                    Next.js Frontend
                          |
                       REST API
                          |
                    Express.js API
                          |
             +------------+------------+
             |                         |
          MongoDB                  Cloudinary
             |                         |
      Application Data          Site Photos
             |
        Audit History

             JWT + RBAC
                 |
       Authentication & Authorization
```

## User Roles

  Role         Main Responsibilities
  ------------ ---------------------------------------------------------
  Admin        Manage users, projects, and system data
  Manager      Review reports, approve/reject logs, monitor projects
  Supervisor   Submit daily logs, manpower, material usage, and photos

## Main Modules

``` text
Authentication
      |
      +-- Users & RBAC
      |
      +-- Projects
      |
      +-- Daily Site Logs
      |
      +-- Material Consumption
      |
      +-- Manager Review
      |
      +-- Audit Logs
      |
      +-- Dashboard
      |
      +-- AI Insights
      |
      +-- PDF Reports
```

## Recommended Project Structure

``` text
construction-site-tracker/
│
├── client/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── .env.example
├── .gitignore
└── README.md
```

## Environment Variables

Create a `.env` file locally. Never commit real secrets to GitHub.

Example:

``` env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Installation

### 1. Clone the repository

``` bash
git clone https://github.com/Subhankar-908/construction-site-tracker.git
cd construction-site-tracker
```

### 2. Install frontend dependencies

``` bash
cd client
npm install
```

### 3. Install backend dependencies

``` bash
cd ../server
npm install
```

### 4. Configure environment variables

Create `.env` files using `.env.example` and add your local MongoDB,
JWT, and Cloudinary credentials.

### 5. Start the backend

``` bash
cd server
npm run dev
```

### 6. Start the frontend

Open another terminal:

``` bash
cd client
npm run dev
```

Then open the local Next.js URL shown in the terminal.

## Git & Team Workflow

Do not work directly on `main` for feature development.

### Get the latest code

``` bash
git checkout main
git pull origin main
```

### Create a feature branch

``` bash
git checkout -b feature/daily-logs
```

### Commit your changes

``` bash
git add .
git commit -m "Add daily site logs"
```

### Push your branch

``` bash
git push -u origin feature/daily-logs
```

Then create a Pull Request on GitHub.

Recommended workflow:

``` text
main
 |
 +-- feature/auth-rbac
 |
 +-- feature/daily-logs
 |
 +-- feature/material-tracker
 |
 +-- feature/dashboard
 |
 +-- Pull Request
 |
 +-- Code Review
 |
 +-- Merge into main
```

## Security

-   Never commit `.env` files.
-   Never expose JWT secrets.
-   Never expose MongoDB credentials.
-   Never expose Cloudinary API secrets.
-   Use role-based authorization on protected API endpoints.
-   Validate and sanitize user input.
-   Restrict report approval to authorized roles.

## Future Improvements

-   Real-time notifications
-   Email notifications for report approvals
-   Advanced project forecasting
-   Equipment tracking
-   Contractor management
-   Attendance management
-   Mobile-friendly supervisor interface
-   Advanced AI risk prediction
-   Automated weekly PDF reports

## Project Status

**Development**

The project is being developed incrementally, starting with
authentication, RBAC, project management, daily site logs, material
tracking, and team collaboration.

## License

This project is intended for educational and development purposes.
>>>>>>> 6b8e26f7ded0acbb6e9fd06e05daac6515688dee
