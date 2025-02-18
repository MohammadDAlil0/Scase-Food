import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/ResetPasswordPage.css'

const ResetPasswordPage = () => {
  const { resetToken } = useParams(); // Extract resetToken from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await API.patch(
        `http://localhost:3001/user/resetPassword/${resetToken}`,
        { password, confirmPassword }
      );


      if (response.data.statusCode === 200) {
        setSuccess('Password reset successfully!');
        setError('');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after success
        }, 1000);
      }
    } catch (err) {
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to reset password. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;