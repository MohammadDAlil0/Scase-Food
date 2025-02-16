import React, { useState } from 'react';
import API from '../services/api';
import '../styles/ResetPasswordPage.css'

const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.patch(
        'http://localhost:3001/user/forgotPassword',
        { email }
      );

      console.log(response.data.statusCode)

      if (response.data.statusCode === 200) {
        setSuccess('Please check your email to confirm yourself');
        setError('');
      }
    } catch (err) {
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to reset password. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Forgot Password</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;