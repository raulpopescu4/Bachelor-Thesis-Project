import React, { useState, useEffect, useRef } from 'react';
import api from './api';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Ref to ensure effect only runs once

  useEffect(() => {
    if (hasFetched.current) return; // Exit if already fetched
    hasFetched.current = true;

    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/recommendations/');
        if (Array.isArray(response.data.recommendations)) {
          setRecommendations(response.data.recommendations);
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Your Recommendations</h1>
      {recommendations.length > 0 ? (
        recommendations.map((rec, index) => (
          <div key={index}>
            <p>{rec}</p>
          </div>
        ))
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};

export default Recommendations;
