import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MovieList from './MovieList';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm) return;

    fetch(`http://localhost:3000/api/movies/search?q=${encodeURIComponent(searchTerm)}`)
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => setMovies(data))
      .catch(err => {
        console.error(err);
        setError('Failed to load search results');
      });
  }, [searchTerm]);

  if (!searchTerm) return <p>Please enter a search term.</p>;
  if (error) return <p>{error}</p>;
  if (movies.length === 0) return <p>No movies found for "{searchTerm}".</p>; // ✅ Add this here

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Search Results for: "{searchTerm}"</h2>
      <MovieList movies={movies} />
    </div>
  );
}

export default SearchResults;
