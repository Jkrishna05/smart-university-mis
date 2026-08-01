# University Management Information System (MIS)

A production-ready university management platform for student, faculty, admin, and academic operations. This project combines the original backend MIS implementation with the newer upstream features, including a more complete architecture, deployment automation, and project documentation.

---

## Overview

The application supports core university workflows such as authentication, department and faculty management, student records, attendance, course offerings, enrollment, exam processing, fee tracking, analytics, and deployment-ready infrastructure.

This repository currently includes the backend implementation under the `server/` folder, while the upstream branch also adds a more complete full-stack structure with frontend, Docker, CI/CD, Terraform, and deployment manifests.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL / TiDB Cloud
- JWT authentication
- bcrypt password hashing
- Role-based access control
- Repository-Service-Controller architecture

### Frontend (from upstream)
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios with JWT handling
- Chart.js and analytics widgets

### DevOps / Deployment
- Docker and Docker Compose
- Nginx
- GitHub Actions
- Terraform
- Render deployment configuration

---

## Modules

### Implemented / Active
- Authentication
- JWT authorization
- Role-based access
- Department module
- Faculty module
- Student module
- Course, enrollment, attendance, exam, fee, and dashboard modules are progressively present in the project and expanded in the upstream branch

### Planned / Extended
- Course management
- Course offerings
- Student enrollments
- Attendance tracking
- Examinations and results
- Fee payment and reporting
- Hostel and library modules
- Notifications and dashboard analytics

---

## Architecture

```text
Client
   │
   ▼
Frontend / API Consumer
   │
   ▼
Express API
   │
   ├── Middleware (Auth / RBAC / Validation)
   │
   ├── Controllers
   │
   ├── Services
   │
   ├── Repositories
   │
   ▼
MySQL / TiDB Cloud
```

---

## Database Design

Key entities include:
- users
- departments
- students
- faculty
- admins
- courses
- course_offerings
- enrollments
- attendance
- exams
- results
- audit_logs

---

## Project Structure

```text
server/
├── config/
├── controllers/
├── repositories/
├── services/
├── middleware/
├── routes/
├── utils/
├── app.js
├── server.js
└── ...
```

The merged repository may also include:
- frontend/
- backend/
- nginx/
- terraform/
- .github/workflows/
- docker-compose files
- deployment and CI/CD configuration

---

## Authentication Flow

```text
Register
  ↓
Hash Password
  ↓
Store User
  ↓
Generate JWT
  ↓
Login
  ↓
Protected Route
  ↓
Role Authorization
```

---

## Roles

### Admin
- Manage departments, students, faculty, courses, exams, and reports

### Faculty
- Manage assigned courses and attendance
- Upload marks and view student data

### Student
- View profile, attendance, exam schedules, results, and fees

---

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/university-mis.git
cd university-mis/server
npm install
```

Create a `.env` file with your database and JWT settings:

```env
PORT=5000
DB_HOST=your_tidb_host
DB_PORT=4000
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret
```

Run the backend:

```bash
npm run dev
```

---

## Notes

This README merges the original backend-focused MIS project with the newer upstream deployment and full-stack project updates. The codebase is intentionally kept aligned with the latest team repository updates after the merge.

Routes

     │

     ▼

Middleware
(Authentication)
(Role Authorization)
(Validation)

     │

     ▼

Controller

     │

     ▼

Service
(Business Logic)

     │

     ▼

Repository
(Database Queries)

     │

     ▼

MySQL / TiDB Cloud
```

---

# 📦 Database Design

Current Modules

- Users
- Departments
- Students
- Faculty
- Blacklist Tokens

Upcoming Modules

- Courses
- Course Offerings
- Student Enrollments
- Attendance
- Examinations
- Results
- Fee Payments
- Hostel
- Library
- Notifications
- Events

---

# 🔐 Authentication Flow

```
Register

↓

Hash Password

↓

Store User

↓

Generate JWT

↓

Login

↓

JWT Cookie

↓

Protected Route

↓

Role Authorization
```

---

# 👥 User Roles

### Admin
- Manage Departments
- Manage Students
- Manage Faculty
- Manage Courses
- Manage Exams
- View Reports

### Faculty
- View Students
- Take Attendance
- Upload Marks
- View Courses

### Student
- View Profile
- Register Courses
- View Attendance
- View Results
- Pay Fees

---

# ⚡ Current Completed Modules

- [x] Authentication
- [x] JWT Authorization
- [x] Role-Based Access
- [x] Department Module
- [x] Faculty Module
- [x] Student Module

---

# 🚧 Upcoming Modules

- [ ] Course Module
- [ ] Course Offering Module
- [ ] Enrollment Module
- [ ] Attendance Module
- [ ] Examination Module
- [ ] Result Module
- [ ] Fee Module
- [ ] Hostel Module
- [ ] Library Module
- [ ] Notifications
- [ ] Dashboard
- [ ] AI Early Warning System

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/university-mis.git
```

Move to project

```bash
cd university-mis/server
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
PORT=5000

DB_HOST=your_tidb_host
DB_PORT=4000
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database

JWT_SECRET=your_secret
```

Start Development Server

```bash
npm run dev
```

---

# 📮 API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/logout

GET /api/auth/profile
```

## Departments

```
POST /api/departments

GET /api/departments

GET /api/departments/:id

PUT /api/departments/:id

DELETE /api/departments/:id
```

## Faculty

```
POST /api/faculty

GET /api/faculty

GET /api/faculty/:id

PUT /api/faculty/:id

DELETE /api/faculty/:id
```

## Students

```
POST /api/students

GET /api/students

GET /api/students/:id

PUT /api/students/:id

DELETE /api/students/:id
```

---

# 🧪 Testing

API testing is performed using **Postman**.

Features tested:

- Authentication
- Authorization
- CRUD Operations
- Validation
- Error Handling

---

# 🔮 Future Enhancements

- OAuth 2.0 Login (Google)
- Refresh Token Authentication
- Redis Caching
- Docker Support
- CI/CD Pipeline
- AWS Deployment
- Email Verification
- Forgot Password
- Real-Time Notifications
- AI-based Student Risk Prediction

---

# 👨‍💻 Contributors

Developed as a team project for the **University Management Information System**.

Backend & Database Architecture:
- **Jay Krishna Rout**

Frontend & UI:
- Team Members

Testing:
- Team Members

---

# 📄 License

This project is developed for educational purposes and university academic use.

---

## ⭐ If you like this project, don't forget to give it a star on GitHub!
=======
## 🔑 Authentication & RBAC

> **NOTE:** There is **NO registration page**. Only administrators can insert users into the system.

### Default Login Credentials (Pre-seeded)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@university.edu` | `Admin@123` |
| **Faculty** | `faculty1@university.edu` | `Faculty@123` |
| **Student** | `student1@university.edu` | `Student@123` |

### Role Permissions
- **Admin**: Complete system access — Manage Users, Students, Faculty, Departments, Courses, Offerings, Enrollments, Exams, Results, and View Reports & Audit Logs.
- **Faculty**: Manage Attendance, Upload Marks, View Assigned Courses & Student Lists.
- **Student**: View Enrolled Courses, Attendance History, Exam Results, Exam Schedule, and Profile.

---

## 🚀 Quick Start (One Command Execution)

The entire project is pre-configured to run immediately using Docker Compose.

```bash
docker-compose up --build
```

Access the application in your browser:
- **Web App**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Swagger Documentation**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

## 📄 API Documentation

Full interactive Swagger API documentation is available at `http://localhost:5000/api/docs`.

### Primary Endpoints Overview
- `POST /api/auth/login` — User authentication
- `GET /api/auth/me` — Current user profile
- `GET, POST, PUT, DELETE /api/students` — Student CRUD
- `GET, POST, PUT, DELETE /api/faculty` — Faculty CRUD
- `GET, POST, PUT, DELETE /api/departments` — Department CRUD
- `GET, POST, PUT, DELETE /api/courses` — Course CRUD
- `GET, POST, PUT, DELETE /api/course-offerings` — Course Offerings CRUD
- `GET, POST, PUT, DELETE /api/enrollments` — Student Enrollments CRUD
- `GET, POST, PUT, DELETE /api/attendance` — Attendance Management
- `GET, POST, PUT, DELETE /api/exams` — Exam Schedule CRUD
- `GET, POST, PUT, DELETE /api/results` — Exam Results & Grading CRUD
- `GET /api/reports/*` — Analytics & Audit Logs

---

## ⚡ Features & Bonus Implementations
- **Pagination, Search, Sorting, Filtering**: Built into all table views with server-side query optimizations.
- **Excel & PDF Exports**: Download student lists and reports formatted dynamically.
- **Interactive Dashboards**: Powered by Chart.js for data visualization.
- **Dark Mode**: Fully supported with local storage persistence and system preference matching.
- **Audit Logging**: Comprehensive mutation tracking stored in `audit_logs`.
- **Security**: Rate limiting, Helmet HTTP headers, CORS validation, parameter sanitization, and SQL injection protection via Sequelize ORM.
>>>>>>> upstream/main
