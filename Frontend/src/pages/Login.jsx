import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css'; // Import the shared CSS file
import API from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('/user/login', formData);
      console.log('Login successful:', response.data.data);
      console.log(response.data.data.access_token);

      // Save the token to localStorage (or context/state)
      localStorage.setItem('token', response.data.data.access_token);


      if (response.data.data.role === 'GHOST') {
        navigate('/ghost'); // Redirect to the Ghost page
      } else {
        navigate('/'); // Redirect to the dashboard for other roles
      }
    } catch (err) {
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p>
            <Link to="/forgot-password">Forgot Your Password</Link>
          </p>
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;