import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/CreateRestaurant.css'; // Add styles for the form

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    picturePath: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/restaurant', formData);
      if (response.status === 201) {
        navigate('/restaurants'); // Redirect to the restaurants page after successful creation
      }
    } catch (err) {
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to create restaurant. Please try again.');
      console.error('Error creating restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-restaurant-container">
      <h1>Create New Restaurant</h1>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Create Restaurant Form */}
      <form onSubmit={handleSubmit} className="create-restaurant-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Picture URL:
          <input
            type="url"
            name="picturePath"
            value={formData.picturePath}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </label>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : 'Create Restaurant'}
        </button>
      </form>
    </div>
  );
};

export default CreateRestaurant;