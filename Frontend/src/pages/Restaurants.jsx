import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import SimpleNavbar from '../components/SimpleNavbar'; // Import the SimpleNavbar component
import '../styles/Restaurants.css';

  const Restaurants = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Fetch restaurants on page load
    useEffect(() => {
      const fetchRestaurants = async () => {
        try {
          const response = await API.get('/restaurant?page=1&limit=10');
          setRestaurants(response.data.data.restaurants);
        } catch (err) {
          setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch restaurants. Please try again later.');
          console.error('Error fetching restaurants:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchRestaurants();
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

    // Handle Delete Restaurant
    const handleDeleteRestaurant = async (id) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this restaurant?');
      if (!confirmDelete) return;

      try {
        console.log(id);
        await API.delete(`/restaurant/${id}`);
        setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id)); // Remove the deleted restaurant from the list
      } catch (err) {
        console.error('Error deleting restaurant:', err);
        alert('Failed to delete restaurant. Please try again.');
      }
    };

    return (
      <div className="home-container">
        {/* Simplified Navbar */}
        <SimpleNavbar /> {/* Use the SimpleNavbar component */}

        {/* Header Section */}
        <div className="header-section">
          <h1>Restaurants</h1>
          {isAdmin && (
            <button onClick={() => navigate('/restaurants/create')} className="create-button">
            Create New Restaurant
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && <p>Loading restaurants...</p>}

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Restaurants List */}
        <div className="restaurants-list">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <img
                src={restaurant.picturePath}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <div className="restaurant-details">
                <h2>{restaurant.name}</h2>
                <p>Phone: {restaurant.phoneNumber}</p>
                <p>Address: {restaurant.address}</p>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="admin-actions">
                  <button
                    onClick={() => navigate(`/restaurants/update/${restaurant.id}`)}
                    className="update-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant.id)}
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

  export default Restaurants;