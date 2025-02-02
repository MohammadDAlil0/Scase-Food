import React, { useEffect, useState } from 'react';
import API from '../services/api';
import SimpleNavbar from '../components/SimpleNavbar';
import '../styles/Users.css'; // Create a new CSS file for styling

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalNumberOfUsers, setTotalNumberOfUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    username: undefined,
    email: undefined,
    role: undefined,
  });
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Number of users per page

  // Calculate total number of pages
  const totalPages = Math.ceil(totalNumberOfUsers / limit);

  // Fetch total number of users (without pagination)
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await API.get('/user/getAllUsers', { params: filters });
        setTotalNumberOfUsers(response.data.data.length);
      } catch (err) {
        setError(err.response?.data?.messages[0] || 'Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      }
    };

    fetchTotalUsers();
  }, [filters]);

  // Fetch users based on filters, page, and limit
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('/user/getAllUsers', {
          params: { ...filters, page, limit },
        });
        setUsers(response.data.data);
      } catch (err) {
        setError(err.response?.data?.messages[0] || 'Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters, page, limit]);

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    const confirmChange = window.confirm(`Are you sure you want to change this user's role to ${newRole}?`);
    if (!confirmChange) return;

    try {
      // Call the changeRole API
      await API.put('/user/changeRole', {
        userId: userId,
        role: newRole,
      });

      // Update the local state to reflect the new role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      alert('User role updated successfully!');
    } catch (err) {
      console.error('Error updating user role:', err);
      const message = err.response?.data?.messages[0] || 'Failed to update user role. Please try again.';
      alert(message);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    let { name, value } = e.target;
    if (value === '' || !value) value = undefined;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPage(1); // Reset to the first page when filters change
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent going out of bounds
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1); // Reset to the first page when limit changes
  };

  return (
    <div className="users-container">
      {/* Simplified Navbar */}
      <SimpleNavbar />

      {/* Header Section */}
      <div className="header-section">
        <h1>Users</h1>
      </div>

      {/* Loading State */}
      {loading && <p>Loading users...</p>}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          name="username"
          placeholder="Filter by username"
          value={filters.username || ''}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by email"
          value={filters.email || ''}
          onChange={handleFilterChange}
        />
        <select
          name="role"
          value={filters.role || ''}
          onChange={handleFilterChange}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="GHOST">Ghost</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Number of Contributions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="GHOST">Ghost</option>
                  <option value="USER">User</option>
                </select>
              </td>
              <td>{user.numberOfContributions}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
        <select value={limit} onChange={handleLimitChange} className='select-page'>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default Users;