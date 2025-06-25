import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`/api/movies/${encodeURIComponent(title)}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Error fetching movie:", err));
  }, [title]);

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="movie-details">
      <h2>{movie.title}</h2>
      <img src={movie.image_url || "/images/default-poster.jpg"} alt={movie.title} />
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Summary:</strong> {movie.description || "No description available."}</p>
    </div>
  );
}

export default MovieDetails;
