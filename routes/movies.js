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

// GET a single movie by title (exact match, case-insensitive)
// router.get('/:title', async (req, res) => {
//   const { title } = req.params;
//   try {
//     const result = await pool.query('SELECT * FROM "Movies" WHERE LOWER(title) = LOWER($1)', [title]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Error fetching movie:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Search movies by title substring (case-insensitive)
router.get('/search', async (req, res) => {
  const searchText = req.query.q || '';

  try {
    const queryText = `
      SELECT * FROM "Movies"
      WHERE LOWER(title) LIKE '%' || LOWER($1) || '%'
      ORDER BY title
      LIMIT 50;
    `;
    const { rows } = await pool.query(queryText, [searchText]);
    res.json(rows);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET single movie by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  try {
    const result = await pool.query('SELECT * FROM "Movies" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching movie by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
