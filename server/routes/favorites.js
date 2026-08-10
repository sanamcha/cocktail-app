const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

// Get logged-in user's favorite cocktails
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         favorites.id AS favorite_id,
         favorites.created_at AS favorited_at,
         cocktails.*
       FROM favorites
       JOIN cocktails ON cocktails.id = favorites.cocktail_id
       WHERE favorites.user_id = $1
       ORDER BY favorites.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a cocktail to favorites
router.post("/:cocktailId", async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, cocktail_id)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user.id, req.params.cocktailId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "This cocktail is already in your favorites"
      });
    }

    if (error.code === "23503") {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.status(500).json({ message: error.message });
  }
});

// Remove a cocktail from favorites
router.delete("/:cocktailId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM favorites
       WHERE user_id = $1 AND cocktail_id = $2
       RETURNING *`,
      [req.user.id, req.params.cocktailId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;