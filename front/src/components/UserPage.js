// src/components/UserPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserPage.css';

function UserPage({ user, onLogout }) {
  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="user-page">
      <div className="user-card">
        <h2>Welcome, {user.Name}!</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Name:</strong> {user.Name}</p>
        <p><strong>Email:</strong> {user.Email}</p>

        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="user-links">
        <Link to="/favourites">⭐ Favourite Movies</Link>
        <Link to="/wishlist">📝 Wishlist</Link>
        <Link to="/watched">🎬 Watched</Link>
        <Link to="/lists">📚 All Lists</Link>
        <Link to="/reviews">🗣️ Reviews</Link>
      </div>
    </div>
  );
}

export default UserPage;
