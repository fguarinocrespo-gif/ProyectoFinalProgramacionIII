import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { isAuthenticated, usuario, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && usuario && !roles.includes(usuario.rol)) {
    return <Navigate to="/actas" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
