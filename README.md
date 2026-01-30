# 🚑 Smart Hospital Management ecosystem

<div align="center">

![Hospital Management System](https://img.shields.io/badge/Hospital-Management-blue?style=for-the-badge&logo=hospital)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**A comprehensive, production-ready hospital management system with role-based access control**

[📋 Features](#-features) • [🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Overview

The **Smart Hospital Management Ecosystem** is a full-stack web application designed to streamline hospital operations with modern technology. Built with the MERN stack, it provides a comprehensive solution for managing patients, doctors, lab staff, and administrators with an intuitive, responsive interface.

### 🎯 Key Highlights

- **🔐 Role-Based Access Control**: Secure authentication for Patients, Doctors, Lab Staff, and Admins
- **📱 Responsive Design**: Beautiful UI built with Tailwind CSS that works on all devices
- **⚡ Real-time Features**: Emergency queue management and instant notifications
- **📊 Analytics Dashboard**: Comprehensive insights with interactive charts
- **🆔 Unique ID System**: Automatic ID generation for all users (PAT001, DOC001, etc.)
- **🔄 Full CRUD Operations**: Complete data management across all modules

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express Backend │    │   MongoDB       │
│   (Port 5173)   │◄──►│   (Port 5000)   │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • User Schema   │
│ • Protected Routes│   │ • Role Middleware│   │ • Appointments  │
│ • Recharts       │    │ • File Upload   │    │ • Prescriptions │
│ • Axios          │    │ • Validation    │    │ • Lab Reports   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 18 + Vite | Modern React with fast development server |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | Node.js + Express | RESTful API with MVC architecture |
| **Database** | MongoDB + Mongoose | NoSQL database with schema validation |
| **Authentication** | JWT | Secure token-based authentication |
| **Charts** | Recharts | Interactive data visualization |
| **File Upload** | Multer | Secure file handling for reports |

---

## 🎨 Features

### 👥 User Management
- **🔐 Multi-Role Authentication**: Patient, Doctor, Lab Staff, Admin roles
- **🆔 Unique ID System**: Automatic ID generation (PAT001, DOC001, LAB001, ADM001)
- **👤 Profile Management**: Complete user profile with medical history
- **🔒 Secure Access**: JWT-based authentication with role-based permissions

### 📅 Appointment System
- **📆 Online Booking**: Patients can book appointments with doctors
- **👨‍⚕️ Doctor Schedules**: Manage availability and consultation slots
- **📊 Status Tracking**: Pending, Confirmed, Completed, Cancelled states
- **⏰ Time Management**: Efficient scheduling and rescheduling

### 💊 Prescription Management
- **📝 Digital Prescriptions**: Electronic prescription creation
- **💰 Medicine Inventory**: Stock management and pricing
- **📋 Diagnosis Records**: Comprehensive medical records
- **📄 PDF Generation**: Printable prescription documents

### 🧪 Lab Management
- **🔬 Test Requests**: Doctors can request lab tests
- **📊 Report Upload**: Secure file upload for lab results
- **🚨 Critical Alerts**: Priority-based result notifications
- **📈 Test Analytics**: Comprehensive lab statistics

### 🚨 Emergency System
- **🚑 Emergency Queue**: Priority-based emergency handling
- **👥 Patient Triage**: Symptom-based priority assignment
- **👨‍⚕️ Doctor Assignment**: Automatic doctor allocation
- **📞 Real-time Updates**: Instant emergency notifications

### 💰 Billing & Insurance
- **💳 Automated Billing**: Appointment-based bill generation
- **🛡️ Insurance Claims**: Policy management and approvals
- **📊 Payment Tracking**: Bill status and payment history
- **📈 Financial Analytics**: Revenue and expense tracking

### 📊 Analytics Dashboard
- **📈 Interactive Charts**: Recharts-powered visualizations
- **👥 User Statistics**: Role-based user distribution
- **💰 Revenue Reports**: Financial performance metrics
- **📅 Appointment Analytics**: Scheduling and utilization data

---

## 📊 Database Schema

### Core Models

```javascript
// User Model (All Roles)
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['patient', 'doctor', 'lab', 'admin'],
  uniqueId: String (PAT001, DOC001, etc.),
  phone: String,
  address: String,
  dateOfBirth: Date,
  gender: String,
  // Role-specific fields...
}

// Appointment Model
{
  patient: ObjectId,
  doctor: ObjectId,
  date: Date,
  time: String,
  reason: String,
  status: ['pending', 'confirmed', 'completed', 'cancelled']
}

// Prescription Model
{
  patient: ObjectId,
  doctor: ObjectId,
  medicines: Array,
  diagnosis: String,
  notes: String,
  date: Date
}
```

### Complete Schema Overview

| Model | Key Fields | Relationships |
|-------|------------|---------------|
| **User** | name, email, role, uniqueId | Self-referencing for roles |
| **Appointment** | patient, doctor, date, status | User (patient), User (doctor) |
| **Prescription** | patient, doctor, medicines | User (patient), User (doctor) |
| **LabReport** | patient, testName, results | User (patient), User (lab) |
| **Bill** | patient, amount, status | User (patient), Appointment |
| **Medicine** | name, stock, price | Independent |
| **Insurance** | patient, provider, coverage | User (patient) |
| **Emergency** | patient, priority, symptoms | User (patient), User (doctor) |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-hospital-management.git
   cd smart-hospital-management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret

   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install

   # Start the frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Configuration

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

---

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Authenticated |

### Patient Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/patient/appointment` | Book appointment | Patient |
| GET | `/api/patient/appointments` | Get appointments | Patient |
| GET | `/api/patient/prescriptions` | Get prescriptions | Patient |
| GET | `/api/patient/lab-reports` | Get lab reports | Patient |
| GET | `/api/patient/bills` | Get bills | Patient |

### Doctor Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/doctor/patients` | Get assigned patients | Doctor |
| POST | `/api/doctor/prescription` | Create prescription | Doctor |
| GET | `/api/doctor/emergencies` | Get emergency queue | Doctor |
| PUT | `/api/doctor/emergency/:id/handle` | Handle emergency | Doctor |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/users` | Get all users | Admin |
| POST | `/api/admin/medicine` | Add medicine | Admin |
| GET | `/api/admin/medicines` | Get medicines | Admin |
| POST | `/api/admin/bill` | Create bill | Admin |
| GET | `/api/admin/emergencies` | Get emergency queue | Admin |

---

## 🎯 Usage Examples

### Patient Registration & Login

```javascript
// Register as patient
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword',
    role: 'patient',
    phone: '+1234567890',
    dateOfBirth: '1990-01-01',
    gender: 'male'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securepassword'
  })
});
```

### Booking an Appointment

```javascript
const token = localStorage.getItem('token');

const appointment = await fetch('/api/patient/appointment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    doctorId: 'doctor_id_here',
    date: '2024-01-30',
    time: '10:00',
    reason: 'Regular checkup'
  })
});
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**
   ```bash
   # Push frontend code to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Deploy

### Backend Deployment (Render)

1. **Prepare Backend**
   ```bash
   # Create render.yaml or use dashboard
   # Set environment variables in Render dashboard
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

2. **Deploy on Render**
   - Connect GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Configure environment variables
   - Deploy

### Database Setup (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Set up database user and IP whitelist
4. Get connection string and update in environment variables

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure responsive design

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **📧 Email**: support@hospitalmanagement.com
- **🐛 Issues**: [GitHub Issues](https://github.com/your-username/smart-hospital-management/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/smart-hospital-management/discussions)

---

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the powerful NoSQL database
- **Express.js** for the robust backend framework
- **Font Awesome** for the beautiful icons

---

<div align="center">

**Made with ❤️ for better healthcare management**
** Made by Abhishek and Abhinandan **

⭐ Star this repository if you found it helpful!

[⬆️ Back to Top](#-smart-hospital-management-ecosystem)

</div>
=======
# Smart-Hospital-Management-Ecosystem
>>>>>>> fc536b19811119b95e70d9b700f3c0262ba16b0e
