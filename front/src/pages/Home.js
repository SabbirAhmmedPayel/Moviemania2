import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/allmovies" style={{ fontSize: "38px", color: "#ffcc00" }}>
          View All Movies →
        </Link>
      </div>
      <section className="intro">
        <h2>Your source for everything movies</h2>
        <p>Discover reviews, trailers, and ratings for your favorite films.</p>
      </section>
    </>
  );
}

export default Home;
