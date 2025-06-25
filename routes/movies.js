const express = require('express');
const router = express.Router();
const { pool } = require('../pool');

// GET all movies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Movies" ORDER BY year DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a single movie by title
router.get('/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const result = await pool.query('SELECT * FROM "Movies" WHERE LOWER(title) = LOWER($1)', [title]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search by query string
router.get('/search/query', async (req, res) => {
  const q = req.query.q;
  try {
    const result = await pool.query(`SELECT * FROM "Movies" WHERE LOWER(title) LIKE LOWER($1)`, [`%${q}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
