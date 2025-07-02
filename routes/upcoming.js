const express = require('express');
const router = express.Router();
const { pool } = require('../pool');

// GET all upcoming movies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM upcoming_movies ORDER BY year, title');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching upcoming movies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new upcoming movie
router.post('/add', async (req, res) => {
  const { title, year } = req.body;

  if (!title || !year) {
    return res.status(400).json({ error: 'Title and year are required' });
  }

  try {
    const insertQuery = `
      INSERT INTO upcoming_movies (title, year)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [title, year]);
    res.status(201).json({ message: 'Movie added', movie: result.rows[0] });
  } catch (err) {
    console.error('Error adding upcoming movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE upcoming movie
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const del = await pool.query('DELETE FROM upcoming_movies WHERE id = $1', [id]);
    if (del.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
