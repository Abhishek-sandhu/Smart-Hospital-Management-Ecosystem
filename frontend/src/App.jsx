import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientLayout from './components/PatientLayout';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/PatientProfile';
import PatientAppointments from './pages/PatientAppointments';
import PatientPrescriptions from './pages/PatientPrescriptions';
import PatientLabReports from './pages/PatientLabReports';
import PatientBilling from './pages/PatientBilling';
import PatientEmergency from './pages/PatientEmergency';
import DoctorLayout from './components/DoctorLayout';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPatients from './pages/DoctorPatients';
import DoctorPrescriptions from './pages/DoctorPrescriptions';
import DoctorLabReports from './pages/DoctorLabReports';
import DoctorEmergency from './pages/DoctorEmergency';
import DoctorAnalytics from './pages/DoctorAnalytics';
import LabLayout from './components/LabLayout';
import LabDashboard from './pages/LabDashboard';
import LabProfile from './pages/LabProfile';
import LabTests from './pages/LabTests';
import LabUploadReport from './pages/LabUploadReport';
import LabReports from './pages/LabReports';
import LabCriticalCases from './pages/LabCriticalCases';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDoctors from './pages/AdminDoctors';
import AdminLabStaff from './pages/AdminLabStaff';
import AdminInventory from './pages/AdminInventory';
import AdminBilling from './pages/AdminBilling';
import AdminInsurance from './pages/AdminInsurance';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<ProtectedRoute role="patient"><PatientLayout /></ProtectedRoute>}>
          <Route index element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="lab-reports" element={<PatientLabReports />} />
          <Route path="billing" element={<PatientBilling />} />
          <Route path="emergency" element={<PatientEmergency />} />
        </Route>
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
        <Route path="/lab" element={<ProtectedRoute role="lab"><LabLayout /></ProtectedRoute>}>
          <Route index element={<LabDashboard />} />
          <Route path="profile" element={<LabProfile />} />
          <Route path="tests" element={<LabTests />} />
          <Route path="upload-report" element={<LabUploadReport />} />
          <Route path="reports" element={<LabReports />} />
          <Route path="critical-cases" element={<LabCriticalCases />} />
        </Route>
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
    </Router>
  );
}

export default App;