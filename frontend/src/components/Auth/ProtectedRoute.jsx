import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../../services/api';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Auth check failed", err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Authenticating...</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/my-account" replace />;
  }

  return children;
};

export default ProtectedRoute;
