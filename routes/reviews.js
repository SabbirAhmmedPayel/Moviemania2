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

// GET: Total number of reviews by a user
router.get('/user/:username/count', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS total_reviews
       FROM "Reviews"
       WHERE username = $1`,
      [username]
    );

    // result.rows[0].total_reviews is a string, so convert to number
    const totalReviews = parseInt(result.rows[0].total_reviews, 10);

    res.json({ username, totalReviews });
  } catch (err) {
    console.error('Error fetching reviews count:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// In your reviewRoutes.js or wherever you handle reviews routes:

router.get('/top-users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT username, COUNT(*) AS review_count
      FROM "Reviews"
      GROUP BY username
      ORDER BY review_count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET: Review by user and movie
router.get('/movie/:movieId/user/:username', async (req, res) => {
  const { movieId, username } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM "Reviews" WHERE movie_id = $1 AND username = $2`,
      [movieId, username]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json(null); // No review found
    }
  } catch (err) {
    console.error('Error fetching review:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE review by user and movie
router.delete('/movie/:movieId/user/:username', async (req, res) => {
  const { movieId, username } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM "Reviews" WHERE movie_id = $1 AND username = $2 RETURNING *`,
      [movieId, username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
