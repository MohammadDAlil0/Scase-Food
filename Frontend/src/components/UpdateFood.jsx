import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import '../styles/Restaurants.css'; // Reuse the same CSS

const UpdateFood = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the food ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    picturePath: '',
    restaurantId: '',
  });
  const [restaurants, setRestaurants] = useState([]); // State for restaurants
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch food data on page load
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await API.get(`/food/${id}`);
        setFormData(response.data.data); // Pre-fill the form with existing data
      } catch (err) {
        setError(err.response?.data?.messages[0] || 'Failed to fetch food details. Please try again.');
        console.error('Error fetching food:', err);
      }
    };

    fetchFood();
  }, [id]);

  // Fetch restaurants on page load
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/restaurant?page=1&limit=10');
        setRestaurants(response.data.data);
      } catch (err) {
        setError(err.response?.data?.messages[0] || 'Failed to fetch restaurants. Please try again later.');
        console.error('Error fetching restaurants:', err);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'price') {
        value = +value;
    }
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.patch(`/food/${id}`, formData);
      if (response.status === 200) {
        navigate('/food'); // Redirect to the food page after successful update
      }
    } catch (err) {
      setError(err.response?.data?.messages[0] || 'Failed to update food item. Please try again.');
      console.error('Error updating food item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-restaurant-container">
      <h1>Update Food</h1>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Update Food Form */}
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
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
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
          Restaurant:
          <select
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Updating...' : 'Update Food'}
        </button>
      </form>
    </div>
  );
};

export default UpdateFood;