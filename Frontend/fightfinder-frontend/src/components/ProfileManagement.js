import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; // Import the axios instance
import './ProfileManagement.css'; // Import the CSS

const ProfileManagement = () => {
  const navigate = useNavigate();

  const handleDeletePreferences = async () => {
    try {
      await api.delete('/user/preferences/delete/');
      alert('Preferences deleted successfully.');
    } catch (error) {
      console.error('Error deleting preferences:', error);
      alert('Failed to delete preferences.');
    }
  };

  const handleDeleteBookmarks = async () => {
    try {
      await api.delete('/user/delete-all-bookmarks/');
      alert('All bookmarks deleted successfully.');
    } catch (error) {
      console.error('Error deleting bookmarks:', error);
      alert('Failed to delete bookmarks.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete('/delete-user/');
      alert('User profile deleted successfully.');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting user profile:', error);
      alert('Failed to delete user profile.');
    }
  };

  return (
    <div className="profile-management-container">
      <h2>Profile Management</h2>
      <button className="btn" onClick={handleDeletePreferences}>Delete Preferences</button>
      <button className="btn" onClick={handleDeleteBookmarks}>Delete All Bookmarks</button>
      <button className="btn" onClick={handleDeleteUser}>Delete User Profile</button>
    </div>
  );
};

export default ProfileManagement;
