const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// All cocktail routes require login
router.use(authenticateToken);

// Read all cocktails — use for the home page
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cocktails ORDER BY name ASC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read one cocktail
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cocktails WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create cocktail
router.post("/", async (req, res) => {
  try {
    const {
      cocktaildb_id,
      name,
      category,
      alcoholic,
      glass,
      instructions,
      image_url,
      ingredients = []
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Cocktail name is required" });
    }

    const result = await pool.query(
      `INSERT INTO cocktails
        (cocktaildb_id, name, category, alcoholic, glass, instructions, image_url, ingredients)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        cocktaildb_id || null,
        name,
        category || null,
        alcoholic || null,
        glass || null,
        instructions || null,
        image_url || null,
        JSON.stringify(ingredients)
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cocktail
router.put("/:id", async (req, res) => {
  try {
    const {
      cocktaildb_id,
      name,
      category,
      alcoholic,
      glass,
      instructions,
      image_url,
      ingredients = []
    } = req.body;

    const result = await pool.query(
      `UPDATE cocktails
       SET cocktaildb_id = $1,
           name = $2,
           category = $3,
           alcoholic = $4,
           glass = $5,
           instructions = $6,
           image_url = $7,
           ingredients = $8
       WHERE id = $9
       RETURNING *`,
      [
        cocktaildb_id || null,
        name,
        category || null,
        alcoholic || null,
        glass || null,
        instructions || null,
        image_url || null,
        JSON.stringify(ingredients),
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete cocktail
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM cocktails WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.json({ message: "Cocktail deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;