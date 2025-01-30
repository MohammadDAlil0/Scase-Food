import React, { useState } from 'react';
import CreateOrderModal from './CreateOrderModal'; // We'll create this next

const ContributorCard = ({ contributor }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="contributor-card">
      <h3>{contributor.username}</h3>
      <p>Contributions: {contributor.numberOfContributions}</p>
      <p>Restaurant: {contributor.restaurant.name}</p>
      <p>Status: {contributor.status}</p>
      <p>Date to Call: {new Date(contributor.dateToCall).toLocaleString()}</p>
      <button onClick={() => setShowModal(true)}>Create Order</button>
      {showModal && (
        <CreateOrderModal
          contributor={contributor} // Pass restaurantId from contributor
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ContributorCard;