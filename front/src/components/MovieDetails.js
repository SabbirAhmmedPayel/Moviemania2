import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/MovieDetails.css';
import '../styles/MovieDetails.css';
import '../styles/RateModal.css';

import MovieCast from './MovieCast';

import { useUser } from '../contexts/UserContext';

function getYouTubeSearchUrl(title, year) {
  const query = encodeURIComponent(`${title} ${year} trailer`);
  return `https://www.youtube.com/results?search_query=${query}`;
}



function MovieDetails() {
  const { id } = useParams();
  const { loggedInUser } = useUser();
  const [movie, setMovie] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [textReview, setTextReview] = useState('');

  const handleSubmitReview = async () => {
    if (selectedRating === 0) return alert("Please select a rating.");

    try {
      const res = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movie_id: movie.id,
          username: loggedInUser.username,
          rating: selectedRating,
          text_review: textReview
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Review submitted successfully!');
        setShowRateModal(false);
        setSelectedRating(0);
        setTextReview('');
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error submitting review');
    }
  };
  // Fetch movie details
  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`http://localhost:3000/api/movies/${id}`);
        if (!res.ok) throw new Error('Movie not found');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  const [removingFromListId, setRemovingFromListId] = useState(null);

  const handleRemove = async (watchlistId, listname) => {
    if (!loggedInUser) return alert('Please sign in');

    if (!window.confirm(`Remove this movie from ${listname}?`)) return;

    setRemovingFromListId(watchlistId);
    try {
      const res = await fetch(`http://localhost:3000/api/watchlists/${watchlistId}/movies/${movie.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || `Removed from ${listname}`);
      } else {
        alert(data.error || `Current movie is not in ${listname} `);
      }
    } catch (err) {
      alert('Failed to remove movie.');
    } finally {
      setRemovingFromListId(null);
    }
  };


  // Fetch user watchlists
  useEffect(() => {
    async function fetchWatchlists() {
      if (!loggedInUser) return;
      try {
        const res = await fetch(`http://localhost:3000/api/watchlists/user/${loggedInUser.username}`);
        const data = await res.json();
        setWatchlists(data);
      } catch (err) {
        console.error('Failed to load watchlists:', err);
      }
    }
    fetchWatchlists();
  }, [loggedInUser]);

  const handleAdd = async (watchlistId, listname) => {
    if (!loggedInUser) return alert('Please sign in');
    try {
      const res = await fetch('http://localhost:3000/api/watchlists/add-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchlist_id: watchlistId, movie_id: movie.id }),
      });
      const data = await res.json();
      alert(data.message || `Added to ${listname}`);
    } catch (err) {
      alert('Failed to add movie.');
    }
  };

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>No movie data found.</p>;

  return (
    <div className="movie-details">
      {movie.poster_url && (
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="movie-details-poster"
        />
      )}

      <h1>{movie.title} ({movie.year})</h1>

      {loggedInUser && watchlists.length > 0 && (
        <>
          <div className="dropdown-container">
            <button className="dropdown-button">➕ Add to Watchlist</button>
            <div className="dropdown-menu">
              {watchlists.map(watchlist => (
                <button
                  key={watchlist.id}
                  onClick={() => handleAdd(watchlist.id, watchlist.listname)}
                >
                  📁 Add to {watchlist.listname}
                </button>
              ))}
            </div>
          </div>

          {/* Remove from Watchlist Dropdown */}
          <div className="dropdown-container" style={{ marginLeft: '1rem' }}>
            <button className="dropdown-button remove">➖ Remove from Watchlist</button>
            <div className="dropdown-menu" aria-label="Remove from watchlist options">
              {watchlists.map(watchlist => (
                <button
                  key={watchlist.id}
                  onClick={() => handleRemove(watchlist.id, watchlist.listname)}
                  disabled={removingFromListId === watchlist.id}
                >
                  {removingFromListId === watchlist.id ? 'Removing...' : `📁 Remove from ${watchlist.listname}`}
                </button>
              ))}
            </div>
          </div>
        </>
      )
      }



      {/*  similar to add to watchlist button , remove form watchlist dropdown button and functionality*/}

      <div className="movie-info-grid">
        <div className="info-item">
          <strong>📖 Plot:</strong>
          <p>{movie.plot || 'No plot available.'}</p>
        </div>

        <div className="info-item">
          <strong>⭐ Rating:</strong>
          <p>{movie.rating || 'N/A'} / 10</p>
        </div>

        <div className="info-item">
          <strong>🗳️ Votes:</strong>
          <p>{movie.votes || 'N/A'}</p>
        </div>

        <div className="info-item">
          <strong>⏱️ Runtime:</strong>
          <p>{movie.runtime} minutes</p>
        </div>

        <div className="info-item">
          <strong>💰 Budget:</strong>
          <p>{movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
        </div>

        <div className="info-item">
          <strong>🏆 Box Office:</strong>
          <p>{movie.boxoffice ? `$${movie.boxoffice.toLocaleString()}` : 'N/A'}</p>
        </div>
      </div>



      <a
        href={getYouTubeSearchUrl(movie.title, movie.year)}
        target="_blank"
        rel="noopener noreferrer"
        className="trailer-button"
      >
        🎬 View Trailer
      </a>

      {/* Placeholder for star rating */}
      <div className="rate-section">
        <button className="rate-btn" onClick={() => setShowRateModal(true)}>⭐ Rate</button>
        {/* TODO: Implement star popup or modal */}

        {showRateModal && (
          <div className="rate-modal-overlay" onClick={() => setShowRateModal(false)}>
            <div className="rate-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Rate {movie.title}</h3>

              <div className="stars">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                  <span
                    key={star}

                    className={`star ${(hoverRating || selectedRating) >= star ? 'filled' : ''
                      }`}

                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(star)}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Write your review..."
                value={textReview}
                onChange={(e) => setTextReview(e.target.value)}
              />

              <button className="submit-review-btn" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>
        )}

      </div>
{movie && <MovieCast movieId={movie.id} />}
      <div className="movie-links">
        <a href={`/movies/${movie.id}/reviews`} className="details-link">📝 Check Reviews</a>
      
        <a href={`/movies/${movie.id}/similar`} className="details-link">🎞️ Similar Movies</a>
      </div>
    </div >

    
  );
}

export default MovieDetails;
