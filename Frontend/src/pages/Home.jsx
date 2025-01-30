import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import ContributorCard from '../components/ContributorCard';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeContributors, setActiveContributors] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contributionError, setcontributionError] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [dateToCall, setDateToCall] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch user status on page load
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await API.get('/user/me');
        setIsContributing(response.data.data.status === 'ONGOING');
      } catch (err) {
        console.error('Error fetching user status:', err);
      }
    };

    fetchUserStatus();
  }, []);

  // Fetch active contributors
  useEffect(() => {
    const fetchActiveContributors = async () => {
      try {
        const response = await API.get('/user/getAllActiveContributors');
        setActiveContributors(response.data.data);
      } catch (err) {
        setError('Failed to fetch active contributors. Please try again later.');
        console.error('Error fetching active contributors:', err);
      }
    };

    fetchActiveContributors();
  }, []);

  // Fetch top contributors
  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const response = await API.get('/user/GetTopContributors?page=1&limit=10');
        setTopContributors(response.data.data);
      } catch (err) {
        console.error('Error fetching top contributors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopContributors();
  }, []);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/restaurant?page=1&limit=10');
        setRestaurants(response.data.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get('/Notification');
        setNotifications(response.data.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, []);

  // Handle Contribute/Uncontribute toggle
  const handleToggleContribute = async () => {
    if (isContributing) {
      try {
        await API.put('/user/changeStatus', { restaurantId: 'anything' });
        setIsContributing(false);
        fetchActiveContributors();
        window.location.reload();
      } catch (err) {
        setError(err.response?.data?.messages[0] || 'Error toggling contribution.')
        console.error('Error toggling contribution status:', err);
      }
    } else {
      setShowForm(true);
    }
  };

  // Handle Logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  }

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      await API.put('/user/changeStatus', {
        restaurantId: selectedRestaurant,
        dateToCall: dateToCall || null,
      });
      setIsContributing(true);
      setShowForm(false);
      fetchActiveContributors();
    } catch (err) {
      setcontributionError(err.response?.data?.messages[0] || 'Error submitting contribution.')
      console.error('Error submitting contribution form:', err);
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setShowForm(false);
    setIsContributing(false);
    setcontributionError('');
  };

  // Reusable function to fetch active contributors
  const fetchActiveContributors = async () => {
    try {
      const response = await API.get('/user/getAllActiveContributors?page=1&limit=10');
      setActiveContributors(response.data.data);
    } catch (err) {
      setError('Failed to fetch active contributors. Please try again later.');
      console.error('Error fetching active contributors:', err);
    }
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="home-container">
      {/* Top Navbar */}
      <nav className="top-navbar">
        {/* Left Section: Sidebar Toggle Button */}
        <div className="top-navbar-element left">
          <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
            ☰
          </button>
        </div>

        {/* Center Section: Logo */}
        <div className="top-navbar-element center">
          <img src="https://hrms.lit-co.net/web/image/website/1/logo/SCASE?unique=2cf4f07" alt="Logo" className="logo" />
        </div>

        {/* Right Section: Notification, Toggle Switch, Logout */}
        <div className="top-navbar-element right">
          <div className="top-nav-buttons">
            <button className="notification-button" onClick={toggleNotifications}>
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">{notifications.length}</span>
            </button>
            <div className="toggle-switch">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isContributing}
                  onChange={handleToggleContribute}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">
                {isContributing ? 'Uncontribute' : 'Contribute'}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown">
          <h3>Notifications</h3>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <strong>{notification.title}</strong>
                <p>{notification.description}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <>
          <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>
          <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
            <button className="sidebar-close" onClick={() => setShowSidebar(false)}>
              ✕
            </button>
            <ul>
              <li onClick={() => navigate('/')}>Home</li>
              <li onClick={() => navigate('/users')}>Users</li>
              <li onClick={() => navigate('/myOrders')}>My Orders</li>
              <li onClick={() => navigate('/restaurants')}>Restaurants</li>
              <li onClick={() => navigate('/food')}>Food</li>
              <li onClick={() => navigate('/ordersOfMyContribution')}>Orders of My Contribution</li>
            </ul>
          </div>
        </>
      )}

      {/* Body */}
      <div className="body">
        <div className="active-contributors">
          <h2>Active Contributors</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : activeContributors.length === 0 ? (
            <p>No active contributors at the moment.</p>
          ) : (
            <div className="contributors-list">
              {activeContributors.map((contributor) => (
                <ContributorCard key={contributor.id} contributor={contributor} />
              ))}
            </div>
          )}
        </div>

        <div className="top-contributors">
          <h2>Top 10 Contributors</h2>
          {topContributors.length === 0 ? (
            <p>No top contributors at the moment.</p>
          ) : (
            <ul>
              {topContributors.map((contributor, index) => (
                <li key={contributor.id}>
                  <span>{index + 1}. {contributor.username}</span>
                  <span>Contributions: {contributor.numberOfContributions}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal for Contribute Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Contribute</h3>
            {contributionError && <p className="error-message">{contributionError}</p>}
            <label>
              Restaurant:
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
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
            <label>
              Date to Call (optional):
              <input
                type="datetime-local"
                value={dateToCall}
                onChange={(e) => setDateToCall(e.target.value)}
              />
            </label>
            <div className="form-buttons">
              <button onClick={handleFormSubmit}>OK</button>
              <button onClick={handleFormCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;