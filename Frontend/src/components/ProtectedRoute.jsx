import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import API from '../services/api';

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await API.get('/user/me'); // Fetch current user details
        setUser(response.data.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (<div>Loading...</div>) // Show a loading spinner or message
  }

  // Redirect unauthenticated users to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect Ghost users to the Ghost page
  if (user.role === 'GHOST') {
    return <Navigate to="/ghost" />;
  }

  // Allow USER and ADMIN users to access the protected pages
  if (user.role === 'USER' || user.role === 'ADMIN') {
    return <Outlet />;
  }

  // Fallback: Redirect to login
  return <Navigate to="/login" />;
};

export default ProtectedRoute;