import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/OrdersOfMyContribution.css';
import SimpleNavbar from '../components/SimpleNavbar';
import AddFoodsModal from '../components/AddFoodModal';

const OrdersOfMyContribution = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderNumberModal, setOrderNumberModal] = useState(0);

  // Fetch orders of contribution
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/order/getOrdersOfContribution');
        console.log('Orders API Response:', response.data);

        const ordersWithTotalPrice = response.data?.data?.map((order) => {
          const totalFoodPrice = order.foods?.reduce((sum, food) => {
            return sum + food.FoodOrder.number * food.price;
          }, 0);

          return {
            ...order,
            totalFoodPrice, // Add totalFoodPrice to each order
          };
        });
        console.log(ordersWithTotalPrice);

        console.log('Updated Orders with Total Price:', ordersWithTotalPrice);

        setOrders(ordersWithTotalPrice);
      } catch (err) {
        setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Remove food from an order
  const handleRemoveFood = async (orderId, foodId) => {
    try {
      await API.delete(`/order/removeFoodFromOrder/${orderId}/${foodId}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            const food = order.foods.find((food) => food.id === foodId);
            order.totalFoodPrice -= food.FoodOrder.number * food.price;
            return {
              ...order,
              foods: order.foods.filter((food) => food.id !== foodId),
            }
          }
          return order;
        })
      );
      console.log(`Food ${foodId} removed from order ${orderId}`);
    } catch (err) {
      console.log(err);
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to remove food. Please try again.');
      console.error('Error removing food:', err);
    }
  };

  const handleStatusChange = async (orderId) => {
    try {
      // Call the API to update the status
      const response = await API.put(`/order/changeStatusOfOrder/${orderId}`);

      const newStatus = response.data.data.statusOfOrder;

      // Update the local state to reflect the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, statusOfOrder: newStatus } : order
        )
      );

      console.log(`Status updated for order ${orderId}: ${newStatus}`);
    } catch (err) {
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to update status. Please try again.');
      console.error('Error updating status:', err);
    }
  };

  // Calculate the total number of each type of food
  const calculateFoodCounts = () => {
    const foodCounts = {};

    orders.forEach((order) => {
      order.foods.forEach((food) => {
        if (foodCounts[food.name]) {
          foodCounts[food.name] += food.FoodOrder.number;
        } else {
          foodCounts[food.name] = food.FoodOrder.number;
        }
      });
    });

    return foodCounts;
  };

  // Calculate the total price of all orders
  const calculateTotalPrice = () => {
    return orders.reduce((sum, order) => sum + order.totalFoodPrice, 0);
  };

  // Calculate the total paid price
  const calculateTotalPaidPrice = () => {
    return orders
      .filter((order) => order.statusOfOrder === 'PAIED' || order.statusOfOrder === 'DONE')
      .reduce((sum, order) => sum + order.totalFoodPrice, 0);
  };

  const foodCounts = calculateFoodCounts();
  const totalPrice = calculateTotalPrice();
  const totalPaidPrice = calculateTotalPaidPrice();

  return (
    <div className="orders-of-my-contribution-container">
      {/* Simplified Navbar */}
      <SimpleNavbar />

      <h2>Orders of My Contribution</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Order Details</h3>
              <p>
                <strong>username:</strong> {order.creator.username}
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.totalFoodPrice}
              </p>
              <div className="toggle-switch">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={order.statusOfOrder === 'PAIED' || order.statusOfOrder === 'DONE'}
                    onChange={() => handleStatusChange(order.id)}
                  />
                  <span className="slider round"></span>
                </label>
                <p className="toggle-label">
                  {order.statusOfOrder}
                </p>
              </div>

              <h4>Foods</h4>
              {order.foods.length > 0 ? (
                <ul>
                  {order.foods.map((food) => (
                    <li key={food.id} className="food-item">
                      <p>
                        <strong>Name:</strong> {food.name}
                      </p>
                      <p>
                        <strong>Price:</strong>{' '}
                        ${food.price}
                      </p>
                      <p>
                        <strong>Number:</strong>{' '}
                        {food.FoodOrder.number}
                      </p>
                      <p>
                        <strong>Total:</strong>{' '}
                        ${food.price * food.FoodOrder.number}
                      </p>
                      <button
                        className="remove-food-button"
                        onClick={() => handleRemoveFood(order.id, food.id)}
                      >
                        Remove Food
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No foods added yet.</p>
              )}
              <button className='add-food-button' onClick={() => setOrderNumberModal(order.id)}>Add Food</button>
              {orderNumberModal === order.id && (
                <AddFoodsModal
                  order={order}
                  onClose={() => setOrderNumberModal(0)}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {/* Summary Section */}
      <div className="summary-section">
        <p><strong>Total Price:</strong> ${totalPrice}</p>
        <p><strong>Total Paid Price:</strong> ${totalPaidPrice}</p>
      </div>
      <div className='Food-content'>
        <ul>
            {Object.entries(foodCounts).map(([foodName, count]) => (
              <li key={foodName}>
                <strong>{foodName}:</strong> {count}
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};

export default OrdersOfMyContribution;