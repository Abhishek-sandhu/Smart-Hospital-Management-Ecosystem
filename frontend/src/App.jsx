import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
const PatientLayout = lazy(() => import('./components/PatientLayout'));
const DoctorLayout = lazy(() => import('./components/DoctorLayout'));
const LabLayout = lazy(() => import('./components/LabLayout'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));

// Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Patient Pages
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const PatientProfile = lazy(() => import('./pages/PatientProfile'));
const PatientAppointments = lazy(() => import('./pages/PatientAppointments'));
const PatientPrescriptions = lazy(() => import('./pages/PatientPrescriptions'));
const PatientLabReports = lazy(() => import('./pages/PatientLabReports'));
const PatientBilling = lazy(() => import('./pages/PatientBilling'));
const PatientEmergency = lazy(() => import('./pages/PatientEmergency'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const DoctorAppointments = lazy(() => import('./pages/DoctorAppointments'));
const DoctorPatients = lazy(() => import('./pages/DoctorPatients'));
const DoctorPrescriptions = lazy(() => import('./pages/DoctorPrescriptions'));
const DoctorLabReports = lazy(() => import('./pages/DoctorLabReports'));
const DoctorEmergency = lazy(() => import('./pages/DoctorEmergency'));
const DoctorAnalytics = lazy(() => import('./pages/DoctorAnalytics'));

// Lab Pages
const LabDashboard = lazy(() => import('./pages/LabDashboard'));
const LabProfile = lazy(() => import('./pages/LabProfile'));
const LabTests = lazy(() => import('./pages/LabTests'));
const LabUploadReport = lazy(() => import('./pages/LabUploadReport'));
const LabReports = lazy(() => import('./pages/LabReports'));
const LabCriticalCases = lazy(() => import('./pages/LabCriticalCases'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminDoctors = lazy(() => import('./pages/AdminDoctors'));
const AdminLabStaff = lazy(() => import('./pages/AdminLabStaff'));
const AdminInventory = lazy(() => import('./pages/AdminInventory'));
const AdminBilling = lazy(() => import('./pages/AdminBilling'));
const AdminInsurance = lazy(() => import('./pages/AdminInsurance'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));

// Loading Component
const Loading = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute role="patient"><PatientLayout /></ProtectedRoute>}>
            <Route index element={<PatientDashboard />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="lab-reports" element={<PatientLabReports />} />
            <Route path="billing" element={<PatientBilling />} />
            <Route path="emergency" element={<PatientEmergency />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorLayout /></ProtectedRoute>}>
            <Route index element={<DoctorDashboard />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="lab-reports" element={<DoctorLabReports />} />
            <Route path="emergency" element={<DoctorEmergency />} />
            <Route path="analytics" element={<DoctorAnalytics />} />
          </Route>

          {/* Lab Routes */}
          <Route path="/lab" element={<ProtectedRoute role="lab"><LabLayout /></ProtectedRoute>}>
            <Route index element={<LabDashboard />} />
            <Route path="profile" element={<LabProfile />} />
            <Route path="tests" element={<LabTests />} />
            <Route path="upload-report" element={<LabUploadReport />} />
            <Route path="reports" element={<LabReports />} />
            <Route path="critical-cases" element={<LabCriticalCases />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="lab-staff" element={<AdminLabStaff />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="insurance" element={<AdminInsurance />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
