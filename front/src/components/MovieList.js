import React from "react";
import { Link } from "react-router-dom";
import "../styles/MovieList.css";

function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p className="no-movies">loading....</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="movie-poster"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <h3 className="movie-title">
            <Link to={`/movies/${movie.id}`} className="movie-link">
              {movie.title} ({movie.year})
            </Link>
          </h3>
          <p className="movie-rating">⭐ Rating: {movie.rating || "N/A"} /10</p>
          <p className="movie-votes">Votes: {movie.votes}</p>
          <p className="movie-label">
            {movie.runtime} min • {movie.rating_label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
