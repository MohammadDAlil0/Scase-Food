import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Auth.css'; // Import the centralized API instance

const Ghost = () => {
  const navigate = useNavigate();

  // Check the user's role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await API.get('/user/me'); // Assuming an endpoint to fetch current user details
        const { role } = response.data.data;

        // Redirect if the user is no longer a ghost
        if (role !== 'GHOST') {
          navigate('/'); // Redirect to the dashboard or home page
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };

    checkUserRole();
  }, [navigate]);

  return (
    <div className="auth-container">
      <h2>Waiting for Approval</h2>
      <p>
        Your account is currently under review. Please wait until an admin approves your request.
      </p>
      <p>
        You will be redirected automatically once your account is approved.
      </p>
    </div>
  );
};

export default Ghost;