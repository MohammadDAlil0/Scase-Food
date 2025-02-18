import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/CreateOrderModal.css';

const AddFoodsModal = ({ order, onClose }) => {
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
        const response = await API.get(`/food?restaurantId=${order.restaurantId}`);

        console.log('Foods API Response:', response.data);
        // Filter out foods that already exist in prevFoods
        const filteredFoods = response.data.data.foods.filter((food) =>
          order.foods.find((oldFood => oldFood.id === food.id)) ? false : true
        );

        setFoods(filteredFoods);
      } catch (err) {
        setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch foods. Please try again later.');
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [order.foods, order.restaurantId]);

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
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to add food. Please try again.');
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
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to remove food. Please try again.');
      console.error('Error removing food:', err);
    } finally {
      setIsRemovingFood(false);
    }
  };

  // Submit the order
  const handleAddingFoods = async () => {
    setIsSubmittingOrder(true);
    try {
      const selectedFoodPromise = selectedFoods.map(async (food) => {
        await API.post(`/order/addFoodToOrder`, {
          foodId: food.foodId,
          orderId: order.id,
          number: food.number
        });
      })
      await Promise.all(selectedFoodPromise);
    } catch (err) {
      setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to submit order. Please try again.');
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
        <h3>Adding Foods</h3>
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
              <button onClick={handleAddingFoods} disabled={isSubmittingOrder}>
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

export default AddFoodsModal;