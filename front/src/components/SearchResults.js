import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieList from "./MovieList";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const [results, setResults] = useState([]);
  const query = useQuery().get("q");

  useEffect(() => {
    if (query) {
      fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Search error:", err));
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      <MovieList movies={results} />
    </div>
  );
}

export default SearchResults;
