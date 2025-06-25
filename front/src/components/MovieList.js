import React from "react";

function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p>No movies available.</p>;
  }

  return (
    <div className="movie-grid" style={styles.grid}>
      {movies.map((movie) => (
        <div key={movie.id} style={styles.card}>
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              style={styles.poster}
            />
          ) : (
            <div style={styles.noImage}>No Image</div>
          )}
          <h3 style={styles.title}>{movie.title}</h3>
          <p style={styles.rating}>Rating: {movie.rating || "N/A"}</p>
          
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1.5rem",
    padding: "1rem",
  },
  card: {
    backgroundColor: "#f0f8ff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "1rem",
    textAlign: "center",
  },
  poster: {
    width: "100%",
    height: "270px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  noImage: {
    width: "100%",
    height: "270px",
    backgroundColor: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    color: "#666",
  },
  title: {
    margin: "0.5rem 0 0.25rem",
    fontSize: "1.1rem",
    color: "#003366",
  },
  rating: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#0077cc",
  },
};

export default MovieList;
