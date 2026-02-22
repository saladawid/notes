import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../Spinner/Spinner';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner centered />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
