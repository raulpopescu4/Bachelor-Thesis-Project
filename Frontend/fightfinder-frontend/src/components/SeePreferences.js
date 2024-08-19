import React, { useState, useEffect, useRef } from 'react';
import api from './api';

const questions = {
  1: "Do you like matches that finish or that go the distance?",
  2: "Do you prefer technical grappling show-downs or a flashy stand-up fight?",
  3: "Do you enjoy fast-paced fights or more strategic, slower-paced bouts?",
  4: "Which weight class do you enjoy watching the most?",
  5: "Do you like watching underdogs or favorites winning?",
};

const SeePreferences = () => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); 

  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true;

    const fetchPreferences = async () => {
      try {
        const response = await api.get('/user/preferences/');
        const prefString = response.data.preferences || '{}';
        setPreferences(JSON.parse(prefString));
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []); 

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className='welcome-header'>Your Preferences</h1>
      {Object.keys(preferences).length > 0 ? (
        Object.entries(preferences).map(([key, value]) => (
          <div key={key}>
            <p><strong>{questions[key]}</strong></p>
            <p>{value}</p>
          </div>
        ))
      ) : (
        <p>No preferences set.</p>
      )}
    </div>
  );
};

export default SeePreferences;
