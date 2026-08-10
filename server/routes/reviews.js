const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

// Get reviews for one cocktail
router.get("/cocktail/:cocktailId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         reviews.id,
         reviews.rating,
         reviews.comment,
         reviews.created_at,
         reviews.updated_at,
         users.name AS user_name
       FROM reviews
       JOIN users ON users.id = reviews.user_id
       WHERE reviews.cocktail_id = $1
       ORDER BY reviews.created_at DESC`,
      [req.params.cocktailId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review for a cocktail
router.post("/cocktail/:cocktailId", async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, cocktail_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, req.params.cocktailId, rating, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "You already reviewed this cocktail"
      });
    }

    res.status(500).json({ message: error.message });
  }
});

// Update own review
router.put("/:reviewId", async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const result = await pool.query(
      `UPDATE reviews
       SET rating = $1,
           comment = $2,
           updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [rating, comment || null, req.params.reviewId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found or you are not the owner"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete own review
router.delete("/:reviewId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM reviews
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.reviewId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found or you are not the owner"
      });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

