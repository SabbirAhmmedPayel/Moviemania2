import React, { useEffect, useState } from 'react';
import '../styles/UpcomingPage.css';

function getYouTubeVideoId(url) {
  // Extract YouTube video ID from URL (supports youtube.com/watch?v= and youtu.be/)
  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function getYouTubeEmbedUrlFromLink(trailerLink) {
  const videoId = getYouTubeVideoId(trailerLink);
  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&rel=0&showinfo=0&modestbranding=1`;
}

function UpcomingPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/upcoming')
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch(console.error);
  }, []);

  return (
    <div className="upcoming-container">
      <h2>🎬 Upcoming Movies</h2>
      {movies.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="upcoming-list">
          {movies.map((movie) => (
            <div key={movie.id} className="upcoming-card">
              <div className="poster-column">
                <img
                  src={movie.poster_url || '/images/placeholder.jpg'}
                  alt={movie.title}
                  className="upcoming-poster"
                />
                <p className="upcoming-title">{movie.title}</p>
                <p className="upcoming-year">{movie.year}</p>
              </div>

              <div className="trailer-column">
                <iframe
                  src={getYouTubeEmbedUrlFromLink(movie.trailer_link)}
                  title={movie.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="trailer-iframe"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingPage;
