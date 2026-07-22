# 🎓 University MIS (Management Information System)

A full-stack **University Management Information System (MIS)** built using **Node.js, Express.js, MySQL (TiDB Cloud)** following a clean **Repository-Service-Controller Architecture**.

This project is designed to digitize and automate university operations including student management, faculty management, course registration, attendance, examinations, grading, fee management, hostel management, notifications, and analytics.

---

## 🚀 Features

### ✅ Authentication & Authorization
- JWT Authentication
- Secure Password Hashing (bcrypt)
- Role-Based Access Control (Admin / Faculty / Student)
- Token Blacklisting (Logout)
- Input Validation using Express Validator

### 👨‍🎓 Student Management
- Create Student
- Update Student
- Delete Student
- View Student Profile
- Department Mapping
- Registration Number Management

### 👨‍🏫 Faculty Management
- Faculty Registration
- Department Assignment
- Qualification & Experience
- Designation Management
- Salary Information
- Faculty CRUD Operations

### 🏢 Department Management
- Add Department
- Update Department
- Activate / Deactivate Department
- Department CRUD

### 📚 Course Management *(Upcoming)*
- Course Creation
- Credit System
- Semester Mapping
- Course Type
- Department-wise Courses

### 📖 Course Registration *(Upcoming)*
- Student Enrollment
- Semester Registration
- Section Allocation

### 📝 Examination Module *(Upcoming)*
- Exam Scheduling
- Marks Entry
- Grade Calculation
- Result Generation

### 📊 Attendance Module *(Upcoming)*
- Daily Attendance
- Faculty Attendance Entry
- Attendance Percentage

### 💰 Fee Management *(Upcoming)*
- Online Fee Payment
- Payment History
- Due Tracking

### 📚 Library Module *(Upcoming)*
- Book Management
- Issue / Return
- Fine Management

### 🏠 Hostel Management *(Upcoming)*
- Room Allocation
- Hostel Details

### 📢 Notifications *(Upcoming)*
- Email Notifications
- In-App Notifications

### 📈 Dashboard *(Upcoming)*
- Student Analytics
- Faculty Analytics
- Department Statistics

---

# 🛠 Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MySQL
- TiDB Cloud

## Authentication
- JWT
- bcrypt

## Validation
- Express Validator

## API Testing
- Postman

## Version Control
- Git
- GitHub

---

# 📂 Project Structure

```
server/
│
├── config/
│     └── db.js
│
├── controllers/
│
├── repositories/
│
├── services/
│
├── middleware/
│
├── validations/
│
├── routes/
│
├── utils/
│
├── app.js
│
└── server.js
```

---

# 🏗 Architecture

```
Client

     │

     ▼

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
