import React from 'react';

function UserPage({ user, onLogout }) {
  return (
    <div className="user-page">
      <h2>Welcome, {user?.username}!</h2>
      <button onClick={onLogout}>Log out</button>
    </div>
  );
}

export default UserPage;
