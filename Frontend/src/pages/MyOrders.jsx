import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/MyOrders.css';
import SimpleNavbar from '../components/SimpleNavbar';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Number of Orders per page
  const [totalNumberOfOrders, setTotalNumberOfOrders] = useState(0);

   // Calculate total number of pages
   const totalPages = Math.ceil(totalNumberOfOrders / limit);

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get(`/order/GetMyOrders?page=${page}&limit=${limit}`);
        console.log('Orders API Response:', response.data);

        setOrders(response.data.data.orders);
        setTotalNumberOfOrders(response.data.data.totalOrders)
      } catch (err) {
        setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  // Function to calculate total price of an order
  const calculateTotalPrice = (foods) => {
    return foods.reduce((total, food) => {
      return total + food.price * food.FoodOrder.number;
    }, 0);
  };

  // Open modal with order details
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
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
    <div className="my-orders-container">
      {/* Simplified Navbar */}
      <SimpleNavbar />

      <h2>My Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Contributor Username</th>
              <th>Created At</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.contributor.username}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>${calculateTotalPrice(order.foods)}</td>
                <td>{order.statusOfOrder}</td>
                <td>
                  <button className="view-details-btn" onClick={() => openModal(order)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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

      {/* Modal for viewing order details */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Order Details</h3>
            <table className="foods-table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.foods.map((food) => (
                  <tr key={food.id}>
                    <td>{food.name}</td>
                    <td>{food.FoodOrder.number}</td>
                    <td>${food.price}</td>
                    <td>${(food.price * food.FoodOrder.number)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="close-modal-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
