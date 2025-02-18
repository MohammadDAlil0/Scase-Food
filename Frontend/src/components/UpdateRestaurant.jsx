import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import '../styles/UpdateRestaurant.css'; // Add styles for the form

const UpdateRestaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the restaurant ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    picturePath: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch restaurant data on page load
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await API.get(`/restaurant/${id}`);
        setFormData(response.data.data); // Pre-fill the form with existing data
      } catch (err) {
        setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch restaurant details. Please try again.');
        console.error('Error fetching restaurant:', err);
      }
    };

    fetchRestaurant();
  }, [id]);

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
      const response = await API.patch(`/restaurant/${id}`, formData);
      if (response.status === 200) {
        navigate('/restaurants'); // Redirect to the restaurants page after successful update
      }
    } catch (err) {
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to update restaurant. Please try again.');
      console.error('Error updating restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-restaurant-container">
      <h1>Update Restaurant</h1>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Update Restaurant Form */}
      <form onSubmit={handleSubmit} className="update-restaurant-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Picture URL:
          <input
            type="url"
            name="picturePath"
            value={formData.picturePath}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </label>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Updating...' : 'Update Restaurant'}
        </button>
      </form>
    </div>
  );
};

export default UpdateRestaurant;