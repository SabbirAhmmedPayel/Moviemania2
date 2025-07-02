const express = require('express');
const router = express.Router();
const { pool } = require('../pool'); // adjust path to your pool file

// POST: Add a new review
router.post('/', async (req, res) => {
  const { movie_id, username, rating, text_review } = req.body;

  if (!movie_id || !username || !rating) {
    return res.status(400).json({ error: 'movie_id, username, and rating are required' });
  }

  try {
    // Check if the review already exists
    const checkQuery = `
      SELECT * FROM "Reviews"
      WHERE movie_id = $1 AND username = $2
    `;
    const existing = await pool.query(checkQuery, [movie_id, username]);

    if (existing.rows.length > 0) {
      // If review exists, update it
      const updateQuery = `
        UPDATE "Reviews"
        SET rating = $1, text_review = $2
        WHERE movie_id = $3 AND username = $4
        RETURNING *
      `;
      const updated = await pool.query(updateQuery, [rating, text_review, movie_id, username]);

      return res.json({
        message: 'Review updated successfully',
        review: updated.rows[0]
      });
    }

    // If no review exists, insert new
    const insertQuery = `
      INSERT INTO "Reviews" (movie_id, username, rating, text_review)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const inserted = await pool.query(insertQuery, [movie_id, username, rating, text_review]);

    res.status(201).json({
      message: 'Review submitted successfully',
      review: inserted.rows[0]
    });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET: All reviews for a specific movie
router.get('/movie/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.*, u."Name"
       FROM "Reviews" r
       JOIN "Users" u ON r.username = u.username
       WHERE r.movie_id = $1
       ORDER BY r.id DESC`,
      [movieId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews for movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: All reviews by a user
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.*, m.title
       FROM "Reviews" r
       JOIN "Movies" m ON r.movie_id = m.id
       WHERE r.username = $1
       ORDER BY r.id DESC`,
      [username]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
