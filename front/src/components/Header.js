import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

let imglink= "./logo192.png"

function Header({ loggedInUser }) {
  return (
    <header>
      <div className="logo-container">
        <img src={imglink} alt="Moviemania Logo" className="logo" />
      </div>

      <nav className="main-nav" style={{ textAlign : 'centre'}}>
        <Link to="/">Home</Link>
        <Link to="/upcoming">Upcoming</Link>
        <Link to ="/news">News</Link>
      </nav>

      <div className="header-right">
        {loggedInUser ? (
          <Link to="/user" className="loggeduser">
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
