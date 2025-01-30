import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/CreateOrderModal.css';

const CreateOrderModal = ({ contributor, onClose }) => {
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [isRemovingFood, setIsRemovingFood] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Fetch foods for the restaurant
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await API.get(`/food?restaurantId=${contributor.restaurantId}&page=1&limit=10`);
        console.log('Foods API Response:', response.data);
        setFoods(response.data.data);
      } catch (err) {
        setError('Failed to fetch foods. Please try again later.');
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [contributor.restaurantId]);

  // Add food to the order
  const handleAddFood = async (foodId) => {
    setIsAddingFood(true);
    try {
      const existingFood = selectedFoods.find((food) => food.foodId === foodId);

      if (existingFood) {
        const updatedFood = { ...existingFood, number: existingFood.number + 1 };
        setSelectedFoods((prev) =>
          prev.map((food) => (food.foodId === foodId ? updatedFood : food))
        );
      } else {
        const foodItem = foods.find((food) => food.id === foodId);
        const addedFood = {
          foodId,
          name: foodItem.name,
          price: foodItem.price, // Include the price
          number: 1,
        };
        setSelectedFoods([...selectedFoods, addedFood]);
      }
      setError('');
    } catch (err) {
      setError('Failed to add food. Please try again.');
      console.error('Error adding food:', err);
    } finally {
      setIsAddingFood(false);
    }
  };

  // Remove food from the order
  const handleRemoveFood = async (orderFoodId) => {
    setIsRemovingFood(true);
    try {
      const foodToRemove = selectedFoods.find((food) => food.foodId === orderFoodId);
      if (foodToRemove.number > 1) {
        const updatedFood = { ...foodToRemove, number: foodToRemove.number - 1 };
        setSelectedFoods((prev) =>
          prev.map((food) => (food.foodId === orderFoodId ? updatedFood : food))
        );
      } else {
        setSelectedFoods((prev) => prev.filter((food) => food.foodId !== orderFoodId));
      }
      setError('');
    } catch (err) {
      setError('Failed to remove food. Please try again.');
      console.error('Error removing food:', err);
    } finally {
      setIsRemovingFood(false);
    }
  };

  // Submit the order
  const handleSubmitOrder = async () => {
    setIsSubmittingOrder(true);
    try {
      // Iterate over selectedFoods and update the order with the correct number of pieces
      const foods = selectedFoods.map(food => ({
        foodId: food.foodId,
        number: food.number
      }));

      console.log('From foods', foods);

      // Submit the order
      const response = await API.post(`http://localhost:3001/order/createOrder`, {
        foods,
        contributorId: contributor.id
      });
      console.log('Submit Order Response:', response.data.data);
      alert('Order submitted successfully!');
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError('Failed to submit order. Please try again.');
      console.error('Error submitting order:', err);
    } finally {
      setIsSubmittingOrder(false);
      window.location.reload();
    }
  };

  // Calculate grand total
  const grandTotal = selectedFoods.reduce((total, food) => total + food.price * food.number, 0);

  return (
    <div className="create-order-modal-overlay">
      <div className="create-order-modal">
        <h3>Create Order</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="create-order-food-list">
              <h4>Available Foods</h4>
              <ul>
                {foods.map((food) => (
                  <li key={food.id}>
                    <span>{food.name} (${food.price})</span>
                    <button onClick={() => handleAddFood(food.id)} disabled={isAddingFood}>
                      {isAddingFood ? 'Adding...' : 'Add'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="create-order-selected-foods">
              <h4>Selected Foods</h4>
              <ul>
                {selectedFoods.map((food) => (
                  <li key={food.foodId}>
                    <span>
                      {food.name} (Pieces: {food.number}) - Total: ${(food.price * food.number)}
                    </span>
                    <button onClick={() => handleRemoveFood(food.foodId)} disabled={isRemovingFood}>
                      {isRemovingFood ? 'Removing...' : 'Remove'}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="grand-total">
                <strong>Grand Total: ${grandTotal}</strong>
              </div>
            </div>
            <div className="create-order-form-buttons">
              <button onClick={handleSubmitOrder} disabled={isSubmittingOrder}>
                {isSubmittingOrder ? 'Submitting...' : 'Submit Order'}
              </button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateOrderModal;