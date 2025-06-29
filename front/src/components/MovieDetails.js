import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/MovieDetails.css';


function getYouTubeSearchUrl(title, year) {
  const query = encodeURIComponent(`${title} ${year} trailer`);
  return `https://www.youtube.com/results?search_query=${query}`;
}




function MovieDetails() {
  const { id } = useParams(); // get movie ID from URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
