import React, { useEffect, useState } from 'react';
import "../styles/TopUsers.css";


function TopUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/reviews/top-users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading top users...</p>;
  if (!users.length) return <p>No top users found.</p>;

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
          {users.map(({ username, review_count }, i) => (
            <tr key={i}>
              <td>{username}</td>
              <td>{review_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopUsers;
