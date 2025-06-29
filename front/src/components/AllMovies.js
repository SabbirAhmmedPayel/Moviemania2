//this directory /src/components/AllMovies.js

import React, { useEffect, useState } from 'react';
import MovieList from './MovieList';



function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/movies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMovies(data))
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load movies');
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#007bff' }}>All Movies</h2>
      <MovieList movies={movies} />
    </div>
  );
}

export default AllMovies;
