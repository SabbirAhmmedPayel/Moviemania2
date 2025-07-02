import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ReviewList.css'; // create this CSS

function ReviewList() {
  const { id } = useParams(); // movie id from route
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovieAndReviews() {
      try {
        const movieRes = await fetch(`http://localhost:3000/api/movies/${id}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        const reviewRes = await fetch(`http://localhost:3000/api/reviews/movie/${id}`);
        const reviewData = await reviewRes.json();
        setReviews(reviewData);
      } catch (err) {
        console.error('Error fetching reviews or movie:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieAndReviews();
  }, [id]);

  if (loading) return <p>Loading reviews...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="review-list-container">
      {movie.poster_url && (
        <img src={movie.poster_url} alt={movie.title} className="review-movie-poster" />
      )}

      <h2 className="review-title">User Reviews of "{movie.title}"</h2>

      <div className="reviews">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="stars">
              <strong> { review.rating  }/10  </strong>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>

              <h3 className="review-username">
  <strong className="username">{review.username}</strong>
  <span className="says-text"> says about </span>
  <span className="movie-title">{movie.title}</span>
</h3>
              <p className="review-text">{review.text_review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewList;
