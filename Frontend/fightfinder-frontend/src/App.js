import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import UserPreferences from './UserPreferences';
import api from './api';

const App = () => {
  const [auth, setAuth] = useState({ user: null, loggedIn: false });

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/recommendations/');
      console.log('Recommendations:', response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          {}
          <Route path="/" element={auth.loggedIn ? <Navigate replace to="/welcome" /> : <Navigate replace to="/login" />} />
          
          <Route path="/login" element={
            !auth.loggedIn ? (
              <div>
                <Login setAuth={setAuth} />
                <Link to="/register">Don't have an account? Register</Link>
              </div>
            ) : (
              <Navigate replace to="/welcome" />
            )
          } />
          
          <Route path="/register" element={
            !auth.loggedIn ? (
              <div>
                <Register setAuth={setAuth} />
                <Link to="/login">Already have an account? Log in</Link>
              </div>
            ) : (
              <Navigate replace to="/welcome" />
            )
          } />
          
          <Route path="/welcome" element={
            auth.loggedIn ? (
              <div>
                <h1>Welcome, {auth.user}</h1>
                <button onClick={fetchRecommendations}>Get Recommendations</button>
                <Link to="/preferences">Set/Update Preferences</Link>
              </div>
            ) : (
              <Navigate replace to="/login" />
            )
          } />

          <Route path="/preferences" element={
            auth.loggedIn ? (
              <UserPreferences />
            ) : (
              <Navigate replace to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
