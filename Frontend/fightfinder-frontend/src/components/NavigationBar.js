import React from 'react';
import { Link } from 'react-router-dom';
import smallLogo from './images/small-logo.png';
import './NavigationBar.css';

const NavigationBar = () => {
    return (
        <nav className="navbar">
            <Link to="/welcome">
                <img src={smallLogo} alt="Small Logo" className="navbar-logo" />
            </Link>
            <div className="navbar-links">
                <Link to="/recommendations">Recommendations</Link>
                <Link to="/update-preferences">Update Preferences</Link>
                <Link to="/view-preferences">View Preferences</Link>
                <Link to="/your-fights">Your Fights</Link>
                <Link to="/watch-links">Watch Links</Link>
            </div>
            <div className="navbar-profile">
                <Link to="/profile-management">Your Profile</Link>
            </div>
        </nav>
    );
}

export default NavigationBar;
