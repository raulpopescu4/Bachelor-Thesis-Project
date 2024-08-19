import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import './Welcome.css'

function Welcome({ auth }) {
  if (!auth.loggedIn) {
    return <Navigate replace to="/login"/>;
  }

  return (
    <div className="Welcome">
      <header className="welcome-header">
        <h1>Welcome to Our Application</h1>
      </header>
      <div className="welcome-style-1">
        <Link to="/recommendations" className="btn">Get Recommendations</Link>
        <Link to="/update-preferences" className="btn">Set Preferences</Link>
        <Link to="/view-preferences" className="btn">See Preferences</Link>
        <Link to="/your-fights" className="btn">View Your Bookmarked Fights</Link>
      </div>
    </div>
  );
  
}

export default Welcome;
