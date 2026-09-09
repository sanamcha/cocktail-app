const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

// Get the logged-in user's likes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         likes.id AS like_id,
         likes.cocktail_id,
         cocktails.name AS cocktail_name
       FROM likes
       JOIN cocktails ON cocktails.id = likes.cocktail_id
       WHERE likes.user_id = $1
       ORDER BY likes.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a like to a cocktail
router.post("/:cocktailId", async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO likes (user_id, cocktail_id)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user.id, req.params.cocktailId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "You already liked this cocktail"
      });
    }

    if (error.code === "23503") {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.status(500).json({ message: error.message });
  }
});

// Remove a like from a cocktail
router.delete("/:cocktailId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM likes
       WHERE user_id = $1 AND cocktail_id = $2
       RETURNING *`,
      [req.user.id, req.params.cocktailId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Like not found" });
    }

    res.json({ message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
