import React, { useState, useEffect } from 'react';
import api from './api';
import FightCard from './FightCard';

const YourFights = () => {
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedFights = async () => {
      try {
        const response = await api.get('/bookmarked-fights/');
        setFights(response.data); 
      } catch (error) {
        console.error('Error fetching bookmarked fights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedFights();
  }, []);

  const deleteBookmark = async (bookmark_id) => {
    try {
      await api.delete(`/delete-bookmark/${bookmark_id}/`);
      setFights(fights.filter(fight => fight.bookmark_id !== bookmark_id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  if (loading) return <p>Loading your bookmarked fights...</p>;

  return (
    <div>
      <h2>Your Bookmarked Fights</h2>
      {fights.map((fight) => (
        <FightCard
          key={fight.bookmark_id}
          fight={fight}
          onDeleteBookmark={() => deleteBookmark(fight.bookmark_id)}
          pageType="yourFights"
        />
      ))}
    </div>
  );
};

export default YourFights;
