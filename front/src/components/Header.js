import React from 'react';
import { Link } from 'react-router-dom';

function Header({ loggedInUser }) {
  return (
    <header>
      <div className="logo-container">
        <img src="/images/Logo.png" alt="Moviemania Logo" className="logo" />
      </div>

      <nav className="main-nav">
        <Link to="/">Home</Link>
        <Link to="/upcoming">Upcoming</Link>
      </nav>

      <div className="header-right">
        {loggedInUser ? (
          <Link to="/user" className="logged-user">
            {loggedInUser.username}
          </Link>
        ) : (
          <span style={{ color: "white" }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color: "#ffcc00" }}>Sign in</Link> or{" "}
            <Link to="/signup" style={{ color: "#ffcc00" }}>Sign up</Link>
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
