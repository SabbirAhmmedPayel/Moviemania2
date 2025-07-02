import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header"; // Import Header component
import SearchBox from "./components/SearchBox";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import MovieDetails from "./components/MovieDetails";
import UserPage from "./components/UserPage";
import AllMovies from "./components/AllMovies";
import SearchResults from "./components/SearchResults";
import WatchlistMovies from './components/WatchlistMovies';
import ReviewList from "./components/ReviewList";
import UserReviewsPage from "./components/UserReviewsPage";



import { UserContext } from './contexts/UserContext';

import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    navigate("/user");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (

    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      
    <div className="App">
      {/* Pass loggedInUser prop to Header */}
      <Header loggedInUser={loggedInUser} />
      <SearchBox />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/movie/:title" element={<MovieDetails />} />
          <Route
            path="/user"
            element={<UserPage user={loggedInUser} onLogout={handleLogout} />}
          />
          <Route path="/allmovies" element={<AllMovies />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movies/:id" element={<MovieDetails />} />

          <Route path="/watchlist/:watchlistId" element={<WatchlistMovies />} />
          <Route path="/movies/:id/reviews" element={<ReviewList />} />
    <Route path="/user-reviews/:username" element={<UserReviewsPage />} />


        </Routes>
      </main>

      <footer>
        <p>&copy; 2025 Moviemania. All rights reserved.</p>
      </footer>
    </div>
    </UserContext.Provider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
