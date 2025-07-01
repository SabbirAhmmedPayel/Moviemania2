const express = require('express');
const router = express.Router();
const { pool } = require('../pool'); // adjust path if needed

router.post('/add-movie', async (req, res) => {
  const { watchlist_id, movie_id } = req.body;
  console.log("Request body:", req.body);

  if (!watchlist_id || !movie_id) {
    return res.status(400).json({ error: 'watchlist_id and movie_id are required' });
  }

  try {
    const existsQuery = `
      SELECT * FROM watchlist_movies
      WHERE watchlist_id = $1 AND movie_id = $2
    `;
    const exists = await pool.query(existsQuery, [watchlist_id, movie_id]);

    if (exists.rows.length > 0) {
      return res.status(409).json({ message: 'Movie already in watchlist' });
    }

    const insertQuery = `
      INSERT INTO watchlist_movies (watchlist_id, movie_id)
      VALUES ($1, $2)
    `;
    await pool.query(insertQuery, [watchlist_id, movie_id]);

    res.status(201).json({ message: 'Movie added to watchlist successfully' });
  } catch (error) {
    console.error('Error adding movie to watchlist:', error); // 🛠️ Logs actual error
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/', async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'Username query parameter is required' });
  }

  try {
    // Get all watchlists for the user
    const watchlistsResult = await pool.query(
      `SELECT id, listname FROM watchlists WHERE username = $1`,
      [username]
    );

    const watchlists = watchlistsResult.rows;

    // For each watchlist, fetch associated movies
    for (const watchlist of watchlists) {
      const moviesResult = await pool.query(
        `SELECT m.* FROM watchlist_movies wm
         JOIN "Movies" m ON wm.movie_id = m.id
         WHERE wm.watchlist_id = $1`,
        [watchlist.id]
      );
      watchlist.movies = moviesResult.rows;
    }

    res.json(watchlists);
  } catch (err) {
    console.error('Error fetching watchlists:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
