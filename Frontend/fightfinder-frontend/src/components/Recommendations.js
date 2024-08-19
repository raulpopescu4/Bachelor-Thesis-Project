import React, { useState, useEffect, useRef } from 'react';
import api from './api';
import FightCard from './FightCard'; 

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); 

  useEffect(() => {
   
    if (hasFetched.current) return;
    hasFetched.current = true; 

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/recommendations/');
        if (response.data && Array.isArray(response.data.fights)) {
          const fightsWithBookmark = response.data.fights.map(fight => ({
            ...fight,
            isBookmarked: fight.isBookmarked || false  
          }));
          setRecommendations(fightsWithBookmark);
        } else {
          throw new Error('Data is not in expected format');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);  

  const onBookmark = async (fight) => {
    try {
      const formattedDate = new Date(fight.date).toISOString().split('T')[0];
      const fightData = {
        title: fight.title,
        fighter1: fight.fighter1,
        fighter2: fight.fighter2,
        card: fight.card,
        date: formattedDate,
        details: fight.details
      };
  
      const response = await api.post('/bookmark-fight/', { fight: fightData });
      if (response.status === 200 || response.status === 201) {
        
        setRecommendations(recommendations.map(f =>
          f.id === fight.id ? { ...f, isBookmarked: true } : f
        ));
      } else {
        throw new Error('Failed to add bookmark');
      }
    } catch (error) {
      console.error('Failed to bookmark:', error);
    }
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Your Recommendations</h1>
      {recommendations.length > 0 ? (
        recommendations.map((rec, index) => (
          <FightCard key={index} fight={rec} isBookmarked={rec.isBookmarked}
            onBookmark={() => onBookmark(rec)} pageType="recommendations" />
        ))
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};

export default Recommendations;
