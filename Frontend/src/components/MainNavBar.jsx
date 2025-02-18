import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/MainNavBar.css';
import NotificationsDropdown from './NotificationsDropdown';

// Custom Hooks
const useUserStatus = () => {
  const [isContributing, setIsContributing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await API.get('/user/me');
        setIsContributing(response.data.data.status === 'ONGOING');
      } catch (err) {
        setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch the user. Please try again later.');
        console.error('Error fetching user status:', err);
      }
    };

    fetchUserStatus();
  }, []);

  return { isContributing, setIsContributing, error };
};

const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/restaurant');
        setRestaurants(response.data.data.restaurants);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };

    fetchRestaurants();
  }, []);

  return { restaurants };
};

const MainNavBar = () => {
  const { isContributing, setIsContributing, error } = useUserStatus();
  const { restaurants } = useRestaurants();
  const [contributionError, setContributionError] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [dateToCall, setDateToCall] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [notificationState, setNotificationState] = useState({
    noNotification: 0,
    notifications: [],
    showNotifications: false,
    currentPage: 1,
    totalNotifications: 0
  });
  const navigate = useNavigate();

  // Fetch unseen notification count
  useEffect(() => {
    const fetchNoNotifications = async () => {
      try {
        const response = await API.get('/Notification/CountUnseendNotfication');
        setNotificationState((prev) => ({ ...prev, noNotification: response.data.data.count }));
      } catch (err) {
        console.error('Error fetching unseen notification count:', err);
      }
    };

    fetchNoNotifications();
  }, [notificationState.notifications]);

  // Fetch notifications with pagination
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get(`/Notification?page=${notificationState.currentPage}&limit=5`);
        setNotificationState((prev) => ({ ...prev, notifications: response.data.data.notifications }));
        setNotificationState((prev) => ({ ...prev, totalNotifications: response.data.data.noNotifications }));
        
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    if (notificationState.showNotifications) {
      fetchNotifications();
    }
  }, [notificationState.currentPage, notificationState.showNotifications]);

  // Handle Contribute/Uncontribute toggle
  const handleToggleContribute = async () => {
    if (isContributing) {
      try {
        await API.put('/user/changeStatus', { restaurantId: 'anything' });
        window.location.reload();
        setIsContributing(false);
      } catch (err) {
        setContributionError(err.response?.data?.messages[0] || 'Error toggling contribution.');
        console.error('Error toggling contribution status:', err);
      }
    } else {
      setShowForm(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      await API.put('/user/changeStatus', {
        restaurantId: selectedRestaurant,
        dateToCall: dateToCall || null,
      });
      setIsContributing(true);
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      setContributionError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Error submitting contribution.');
      console.error('Error submitting contribution form:', err);
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setShowForm(false);
    setContributionError('');
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setNotificationState((prev) => ({ ...prev, showNotifications: !prev.showNotifications }));
  };

  // Handle pagination for notifications
  const handleNextPage = () => {
    setNotificationState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
  };

  const handlePreviousPage = () => {
    if (notificationState.currentPage > 1) {
      setNotificationState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="top-navbar-element left">
          <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
            ☰
          </button>
        </div>
        <div className="top-navbar-element center">
        {error ? (
            <span className="error-message">{error}</span>
        ) : (
            <img
            src="https://hrms.lit-co.net/web/image/website/1/logo/SCASE?unique=2cf4f07"
            alt="Logo"
            className="logo"
            />
        )}
        </div>
        <div className="top-navbar-element right">
          <div className="top-nav-buttons">
            <button className="notification-button" onClick={toggleNotifications}>
              <span className="notification-icon">🔔</span>
              {notificationState.noNotification > 0 && <span className="notification-badge">{notificationState.noNotification}</span>}
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
      {notificationState.showNotifications && (
        <NotificationsDropdown
          notifications={notificationState.notifications}
          currentPage={notificationState.currentPage}
          lastPage={Math.ceil(notificationState.totalNotifications / 5)}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
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

export default MainNavBar;