import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but unauthorized for this specific view, redirect to their default home
    if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
    if (user.role === 'COORDINATOR') return <Navigate to="/coordinator" replace />;
    if (user.role === 'VET') return <Navigate to="/vet" replace />;
    if (user.role === 'OWNER') return <Navigate to="/owner" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
