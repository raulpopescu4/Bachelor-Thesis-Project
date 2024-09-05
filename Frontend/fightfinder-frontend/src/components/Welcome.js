import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import './Welcome.css';
import logo from './images/logo.png';
import mainImage from './images/first page.jpg';
import secondImage from './images/firstImage.jpeg';

function Welcome({ auth }) {
  if (!auth.loggedIn) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div className="Welcome">
      <div className="main-image">
        <img src={logo} alt="Main Banner" />
      </div>
      <div className="image-text-button">
        <img src={mainImage} alt="Update Preferences" />
        <div>
          <p>Haven't set your preferences yet? Jump in and tell us what gets your blood pumping—your personalized fight journey is just one click away!</p>
          <Link to="/update-preferences" className="btn">Set Your Preferences</Link>
        </div>
      </div>
      <div className="image-text-button">
        <img src={secondImage} alt="Recommendations" />
        <div>
          <p>Ready to watch battles hand-picked just for you? Dive into the octagon of tailored recommendations and never miss a fight that’ll blow your mind!</p>
          <Link to="/recommendations" className="btn">See Recommendations</Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
