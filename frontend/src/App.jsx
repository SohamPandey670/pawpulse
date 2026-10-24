import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardStudio from './pages/DashboardStudio';
import AdminDashboard from './pages/AdminDashboard';
import CoordinatorView from './pages/CoordinatorView';
import VetConsole from './pages/VetConsole';
import OwnerPortal from './pages/OwnerPortal';
import BookingPage from './pages/BookingPage';
import AppointmentsPage from './pages/AppointmentsPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public / Standalone CSV/Excel Dashboard Studio */}
        <Route path="/studio" element={<DashboardStudio />} />

        {/* Authenticated workspace shell */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Admin Operations View */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Care Coordinator View */}
          <Route
            path="/coordinator"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
                <CoordinatorView />
              </ProtectedRoute>
            }
          />

          {/* Vet Clinical Console */}
          <Route
            path="/vet"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VET']}>
                <VetConsole />
              </ProtectedRoute>
            }
          />

          {/* Pet Parent Portal */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
                <OwnerPortal />
              </ProtectedRoute>
            }
          />

          {/* Booking Flow */}
          <Route
            path="/book"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          {/* Network Appointments */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'VET']}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
