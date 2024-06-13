import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import SeePreferences from './SeePreferences';
import SetPreferences from './SetPreferences';
import Recommendations from './Recommendations';
import smallLogo from './images/small-logo.png';

const App = () => {
  const [auth, setAuth] = useState({ user: null, loggedIn: false });

  return (
    <Router>
      <div>
        <header>
          <img src={smallLogo} alt="Small Logo" className="small-logo" />
        </header>
        <Routes>
          <Route path="/" element={auth.loggedIn ? <Navigate replace to="/welcome" /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={!auth.loggedIn ? <Login setAuth={setAuth} /> : <Navigate replace to="/welcome" />} />
          <Route path="/register" element={!auth.loggedIn ? <Register setAuth={setAuth} /> : <Navigate replace to="/welcome" />} />
          <Route path="/welcome" element={
            auth.loggedIn ? (
              <div className="Welcome">
      <header className="welcome-header">
        <h1>Welcome to Our Application</h1>
      </header>
      <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
      <div className="button-container">
        <Link to="/recommendations" className="btn">Get Recommendations</Link>
        <Link to="/update-preferences" className="btn">Set Preferences</Link>
        <Link to="/view-preferences" className="btn">See Preferences</Link>
      </div>
      </div>
    </div>
            ) : (
              <Navigate replace to="/login" />
            )
          } />
          <Route path="/view-preferences" element={auth.loggedIn ? <SeePreferences /> : <Navigate replace to="/login" />} />
          <Route path="/update-preferences" element={auth.loggedIn ? <SetPreferences /> : <Navigate replace to="/login" />} />
          <Route path="/recommendations" element={auth.loggedIn ? <Recommendations /> : <Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
