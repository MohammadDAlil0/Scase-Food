import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/Home.css';
import ContributorCard from '../components/ContributorCard';
import MainNavBar from '../components/MainNavBar';

const Home = () => {
  const [activeContributors, setActiveContributors] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeResponse, topResponse] = await Promise.all([
          API.get('/user/getAllActiveContributors'),
          API.get('/user/GetTopContributors?page=1&limit=10'),
        ]);
        setActiveContributors(activeResponse.data.data.contributors);
        setTopContributors(topResponse.data.data);
      } catch (err) {
        setError(Array.isArray(err.response?.data?.messages) ? err.response?.data?.messages[0] : 'Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <MainNavBar />

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
                <li key={`${contributor.id}-${index}`}>
                  <span>{index + 1}. {contributor.username}</span>
                  <span>Contributions: {contributor.numberOfContributions}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;