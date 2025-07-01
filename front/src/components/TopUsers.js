// src/components/TopUsers.js
import React from 'react';
import '../styles/TopUsers.css';

const dummyUsers = [
  { username: 'Kim', reviews: Math.floor(Math.random() * 50 + 10) },
  { username: 'Alex', reviews: Math.floor(Math.random() * 50 + 10) },
  { username: 'Nina', reviews: Math.floor(Math.random() * 50 + 10) },
  { username: 'Jay', reviews: Math.floor(Math.random() * 50 + 10) },
  { username: 'Sam', reviews: Math.floor(Math.random() * 50 + 10) },
];

function TopUsers() {
  return (
    <div className="top-users-card">
      <h2>🏆 Top Users</h2>
      <table className="top-users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Reviews</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.reviews}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopUsers;
