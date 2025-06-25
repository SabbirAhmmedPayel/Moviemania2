import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Signin from './components/Signin';
import Signup from './components/Signup';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/signin" style={{ marginRight: '10px' }}>Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>

        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<h2>Welcome! Please Sign In or Sign Up.</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
