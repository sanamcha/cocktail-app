const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

// Get comments for one cocktail
router.get("/cocktail/:cocktailId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         comments.id,
         comments.comment,
         comments.created_at,
         comments.updated_at,
         users.name AS user_name
       FROM comments
       JOIN users ON users.id = comments.user_id
       WHERE comments.cocktail_id = $1
       ORDER BY comments.created_at DESC`,
      [req.params.cocktailId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment for a cocktail
router.post("/cocktail/:cocktailId", async (req, res) => {
  try {
    const { comment } = req.body;
    const trimmedComment = typeof comment === "string" ? comment.trim() : "";

    if (!trimmedComment) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const result = await pool.query(
      `INSERT INTO comments (user_id, cocktail_id, comment)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, req.params.cocktailId, trimmedComment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "You already commented on this cocktail"
      });
    }

    res.status(500).json({ message: error.message });
  }
});

// Update own comment
router.put("/:commentId", async (req, res) => {
  try {
    const { comment } = req.body;
    const trimmedComment = typeof comment === "string" ? comment.trim() : "";

    if (!trimmedComment) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const result = await pool.query(
      `UPDATE comments
       SET comment = $1,
           updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [trimmedComment, req.params.commentId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Comment not found or you are not the owner"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete own comment
router.delete("/:commentId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM comments
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.commentId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Comment not found or you are not the owner"
      });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

