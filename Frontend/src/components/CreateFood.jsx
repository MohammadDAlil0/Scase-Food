import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Restaurants.css'; // Reuse the same CSS

const CreateFood = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    picturePath: '',
    restaurantId: '',
  });
  const [restaurants, setRestaurants] = useState([]); // State for restaurants
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch restaurants on page load
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/restaurant?page=1&limit=10');
        setRestaurants(response.data.data);
      } catch (err) {
        setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch restaurants. Please try again later.');
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
      const response = await API.post('/food', {...formData, price: +formData.price});
      if (response.status === 201) {
        navigate('/food'); // Redirect to the food page after successful creation
      }
    } catch (err) {
      console.error('Error creating food item:', err);
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to create food item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-restaurant-container">
      <h1>Create New Food</h1>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Create Food Form */}
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
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
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
          {loading ? 'Creating...' : 'Create Food'}
        </button>
      </form>
    </div>
  );
};

export default CreateFood;