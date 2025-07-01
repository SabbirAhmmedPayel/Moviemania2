import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/MovieDetails.css';
import { useUser } from '../contexts/UserContext';

function getYouTubeSearchUrl(title, year) {
  const query = encodeURIComponent(`${title} ${year} trailer`);
  return `https://www.youtube.com/results?search_query=${query}`;
}





function MovieDetails() {
  const { id } = useParams(); // get movie ID from URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlists, setWatchlists] = useState([]);



//handladd will take a string input . if taken input favourites, then will add to current users favourite list 


function handleAdd(watchlistId) {
  if (!movie) return alert('Movie data not loaded yet');

  fetch('http://localhost:3000/api/watchlists/add-movie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ watchlist_id: watchlistId, movie_id: movie.id }),
  })
    .then(res => res.json())
    .then(data => alert(data.message || 'Added successfully!' ))
    .catch(() => alert('Failed to add movie'));
}


  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`);
        if (!response.ok) throw new Error('Movie not found');
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>No movie data.</p>;

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

      <div className="dropdown-container">
  <button className="dropdown-button">➕</button>
  <div className="dropdown-menu">
    <button onClick={() => handleAdd('Favourites')}>❤️ Add to Favourites</button> // 
    <button onClick={() => handleAdd('Wishlist')}>📝 Add to Wishlist</button>
    <button onClick={() => handleAdd('Watched')}>✅ Add to Watched</button>
  </div>
</div>

      <p><strong>Plot:</strong> {movie.plot || "No plot available."}</p>
      <p><strong>Rating:</strong> {movie.rating || "N/A"} / 10</p>
      <p><strong>Votes:</strong> {movie.votes}</p>
      <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
      <p><strong>Budget:</strong> ${movie.budget?.toLocaleString() || "N/A"}</p>
      <p><strong>Box Office:</strong> ${movie.boxoffice?.toLocaleString() || "N/A"}</p>

      <a
        href={getYouTubeSearchUrl(movie.title, movie.year)}
        target="_blank"
        rel="noopener noreferrer"
        className="trailer-button"
      >
        🎬 View Trailer
      </a>

      <div className="movie-links">
        <a href={`/movies/${movie.id}/reviews`} className="details-link">📝 Check Reviews</a>
        <a href={`/movies/${movie.id}/cast`} className="details-link">🎭 See Full Cast</a>
        <a href={`/movies/${movie.id}/similar`} className="details-link">🎞️ Similar Movies</a>
      </div>


    </div>


  );
}

export default MovieDetails;
