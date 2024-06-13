import React, { useState, useEffect, useRef } from 'react';
import api from './api';

const questions = {
  1: "Do you like matches that finish or that go the distance?",
  2: "Do you prefer technical grappling show-downs or a flashy stand-up fight?",
};

const SeePreferences = () => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Ref to ensure effect only runs once

  useEffect(() => {
    if (hasFetched.current) return; // Exit if already fetched
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
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Your Preferences</h1>
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
