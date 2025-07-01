import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from './MovieList'; // reuse your movie grid display component





function WatchlistMovies() {
  const { watchlistId } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listname, setListname] = useState('');

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`http://localhost:3000/api/watchlists/${watchlistId}/movies`);
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error('Error fetching watchlist movies:', err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchListName() {
      try {
        const res = await fetch(`http://localhost:3000/api/watchlists/user/`);
        const data = await res.json();
        const target = data.find(list => list.id === watchlistId);
        setListname(target?.listname || '');
      } catch (err) {
        console.error('Failed to get watchlist name');
      }
    }

    fetchMovies();
    fetchListName();
  }, [watchlistId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '1rem' }}>
        🎞️ Movies in "{listname}" Watchlist
      </h2>
      <MovieList movies={movies} />
    </div>
  );
}

export default WatchlistMovies;
