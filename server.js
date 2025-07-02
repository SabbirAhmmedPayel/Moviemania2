const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const watchlistRoutes = require('./routes/watchlists');
const reviewRoutes = require('./routes/reviews');
const moviePersonsRoutes = require('./routes/moviePersons');
const upcomingRoutes = require('./routes/upcoming');

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Use auth routes with prefix /auth
app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/movie-persons', moviePersonsRoutes);
app.use('/api/upcoming', upcomingRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
