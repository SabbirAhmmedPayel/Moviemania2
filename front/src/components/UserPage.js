import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserPage.css';




function UserPage({ user, onLogout }) {
  const [watchlists, setWatchlists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3000/api/watchlists/user/${user.username}`)
      .then(res => res.json())
      .then(data => setWatchlists(data))
      .catch(err => console.error('Failed to load watchlists:', err));
  }, [user]);


  const handleCreateWatchlist = async () => {
    if (!newListName.trim()) {
      alert('Please enter a valid list name.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/watchlists/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          listname: newListName.trim()
        }),
      });

      console.log('Response status:', response.status);
      const text = await response.text();
      console.log('Response text:', text);

      if (!response.ok) {
        alert('Failed to create watchlist');
        setLoading(false);
        return;
      }

      const result = JSON.parse(text);
      setWatchlists(prev => [...prev, result.watchlist]);
      setNewListName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Create watchlist error:', err);
      alert('Error creating watchlist');
    } finally {
      setLoading(false);
    }
  }
    ;

    const handleDelete = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this watchlist?');
  if (!confirmed) return;

  try {
   const response = await fetch(`http://localhost:3000/api/watchlists/user/${user.username}/watchlist/${id}`, {
  method: 'DELETE',
});


    const result = await response.json();
    if (response.ok) {
      alert('Watchlist deleted successfully.');
      // Remove from UI
      setWatchlists(prev => prev.filter(w => w.id !== id));
    } else {
      alert(result.error || 'Failed to delete watchlist');
    }
  } catch (error) {
    console.error('Error deleting watchlist:', error);
    alert('An error occurred while deleting.');
  }
};



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
        <h3>📚 Your Watchlists</h3>

   <ul className="watchlist-links">
  {watchlists.length === 0 ? (
    <li className="empty-msg">No watchlists found.</li>
  ) : (
    watchlists.map(list => (
      <li key={list.id} className="watchlist-item">
        <Link to={`/watchlist/${list.id}`} className="watchlist-link">
          {list.listname} {'->>'}
        </Link>
        <button
          onClick={() => handleDelete(list.id)}
          className="delete-watchlist-btn"
        >
          Delete
        </button>
      </li>
    ))
  )}
</ul>



        {/* Button to show create form */}
        {!showCreateForm && (
          <button className="create-watchlist-btn" onClick={() => setShowCreateForm(true)}>
            ➕ Create New Watchlist
          </button>
        )}

        {/* Create watchlist input form */}
        {showCreateForm && (
          <div className="create-watchlist-form">
            <input
              type="text"
              placeholder="Enter watchlist name"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleCreateWatchlist} disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => setShowCreateForm(false)} disabled={loading}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="user-actions">
        <Link to={`/user-reviews/${user.username}`}>
          <button className="reviews-btn">📝 Check Past Reviews</button>
        </Link>
      </div>

    </div>
  );
}

export default UserPage;
