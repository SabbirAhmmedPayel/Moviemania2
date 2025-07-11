import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MovieList.css";

function MovieList({ movies }) {
  const [sortField, setSortField] = useState("default");
  const [sortOrder, setSortOrder] = useState("desc");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");

  if (!movies || movies.length === 0) {
    return <p className="no-movies">Loading...</p>;
  }

  // Filter by year range
  const filteredMovies = movies.filter((movie) => {
    const year = parseInt(movie.year);
    const min = parseInt(yearMin) || 0;
    const max = parseInt(yearMax) || 9999;
    return year >= min && year <= max;
  });

  // Sort filtered movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    let valA = a[sortField] || 0;
    let valB = b[sortField] || 0;

     if (sortField === "runtime" || sortField === "votes" || sortField === "rating" || sortField === "year") {
    valA = parseFloat(valA) || 0;
    valB = parseFloat(valB) || 0;
  }

    if (sortOrder === "asc") {
      return valA > valB ? 1 : -1;
    } else if (sortOrder === "desc") {
      return valA < valB ? 1 : -1;
    }
    return 0;
  });

  return (
    <div>
      {/* Controls */}
      <div className="controls">
        <label>Sort By:</label>
        <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
          <option value="default">None</option>
          <option value="title">Title</option>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
          <option value="runtime">Runtime</option>
          <option value="votes">Votes</option>
        </select>

        <label>Order:</label>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">⬆ Ascending</option>
          <option value="desc">⬇ Descending</option>
        </select>

        <label>Filter Year:</label>
        <input
          type="number"
          placeholder="From"
          value={yearMin}
          onChange={(e) => setYearMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="To"
          value={yearMax}
          onChange={(e) => setYearMax(e.target.value)}
        />
      </div>

      {/* Movie Grid */}
      <div className="movie-grid">
        {sortedMovies.map((movie) => (
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
           <p className="movie-rating">
  ⭐ Rating: {typeof movie.rating === 'number'
    ? (movie.rating % 1 === 0
        ? movie.rating
        : movie.rating.toFixed(2))
    : 'N/A'} /10
</p>


            <p className="movie-votes">Votes: {movie.votes}</p>
            <p className="movie-label">
              {movie.runtime} min • {movie.rating_label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
