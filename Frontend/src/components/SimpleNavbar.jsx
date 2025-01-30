import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';


const SimpleNavbar = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar visibility

  return (
    <>
      {/* Top Navbar */}
      <nav className="top-navbar">
        {/* Left Section: Sidebar Toggle Button */}
        <div className="top-navbar-element left">
          <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
            ☰
          </button>
        </div>

        {/* Center Section: Logo */}
        <div className="top-navbar-element center2">
          <img
            src="https://hrms.lit-co.net/web/image/website/1/logo/SCASE?unique=2cf4f07"
            alt="Logo"
            className="logo"
          />
        </div>
      </nav>

      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Overlay */}
          <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>

          {/* Sidebar */}
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
              <li onClick={() => navigate('/ordersOfMyContribution')}>
                Orders of My Contribution
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default SimpleNavbar;