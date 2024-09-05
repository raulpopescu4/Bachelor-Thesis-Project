import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './images/logo.png';

const Register = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });
      console.log('Registration successful:', response.data);

      const loginResponse = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('access_token', loginResponse.data.access);
      localStorage.setItem('refresh_token', loginResponse.data.refresh);
      setAuth({ user: username, loggedIn: true });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.error && error.response.data.error.includes('UNIQUE constraint failed')) {
            setErrorMessage('Username already exists. Please choose another username.');
          } else {
            setErrorMessage('Registration failed. ' + error.response.data.error);
          }
        } else {
          setErrorMessage('Registration failed with status: ' + error.response.status);
        }
      } else {
        setErrorMessage('Registration failed. Please try again later.');
      }
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={logo} alt="FightFinder Logo" className="big-logo" />
      </div>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              pattern="(?=.*\d)(?=.*[A-Z]).{8,}"
              title="Password must contain at least one number, one uppercase letter, and be at least 8 characters long"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            /> 
          <br></br>
          <br></br>
          <div className="form-group">
            <label htmlFor="agree">I agree to the data collection of the application.</label>
            <input type="checkbox" id="agree" name="agree" required />
          </div>
          </div>
          <button type="submit" className="btn">Register</button>
          <div className="register-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
