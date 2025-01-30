import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import SimpleNavbar from '../components/SimpleNavbar';
import '../styles/Restaurants.css'; // Reuse the same CSS

const Food = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState({}); // Store restaurant details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch food items on page load
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await API.get('/food?page=1&limit=10');
        setFoods(response.data.data);
        fetchRestaurants(response.data.data); // Fetch restaurant details for each food item
      } catch (err) {
        setError('Failed to fetch food items. Please try again later.');
        console.error('Error fetching food items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Fetch user role (admin or not)
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await API.get('/user/me');
        setIsAdmin(response.data.data.role === 'ADMIN');
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch restaurant details for each food item
  const fetchRestaurants = async (foods) => {
    const restaurantDetails = {};
    for (const food of foods) {
      try {
        const response = await API.get(`/restaurant/${food.restaurantId}`);
        restaurantDetails[food.restaurantId] = response.data.data.name; // Store restaurant name
      } catch (err) {
        console.error(`Error fetching restaurant details for ID ${food.restaurantId}:`, err);
        restaurantDetails[food.restaurantId] = 'Unknown Restaurant'; // Fallback if fetch fails
      }
    }
    setRestaurants(restaurantDetails);
  };

  // Handle Create Food
  const handleCreateFood = () => {
    navigate('/food/create');
  };

  // Handle Update Food
  const handleUpdateFood = (id) => {
    navigate(`/food/update/${id}`);
  };

  // Handle Delete Food
  const handleDeleteFood = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this food item?');
    if (!confirmDelete) return;

    try {
      await API.delete(`/food/${id}`);
      setFoods(foods.filter((food) => food.id !== id)); // Remove the deleted food item from the list
    } catch (err) {
      console.error('Error deleting food item:', err);
      alert('Failed to delete food item. Please try again.');
    }
  };

  return (
    <div className="home-container">
      {/* Simplified Navbar */}
      <SimpleNavbar />

      {/* Header Section */}
      <div className="header-section">
        <h1>Food</h1>
        {isAdmin && (
          <button onClick={handleCreateFood} className="create-button">
            Create New Food
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && <p>Loading food items...</p>}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Food List */}
      <div className="restaurants-list">
        {foods.map((food) => (
          <div key={food.id} className="restaurant-card">
            <img
              src={food.picturePath}
              alt={food.name}
              className="restaurant-image"
            />
            <div className="restaurant-details">
              <h2>{food.name}</h2>
              <p>Price: ${food.price}</p>
              <p>Restaurant: {restaurants[food.restaurantId] || 'Loading...'}</p>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="admin-actions">
                <button
                  onClick={() => handleUpdateFood(food.id)}
                  className="update-button"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteFood(food.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;